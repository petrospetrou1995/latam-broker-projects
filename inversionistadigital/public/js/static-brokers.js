// Static version - loads brokers from JSON file instead of API
(async function() {
    'use strict';
    
    let brokersData = null;
    let reviewsData = null;
    
    async function loadBrokersData() {
        if (brokersData) return brokersData;
        
        const paths = [
            '/public/data/brokers.json',
            './public/data/brokers.json',
            'public/data/brokers.json',
            '/data/brokers.json',
            './data/brokers.json'
        ];
        
        for (const path of paths) {
            try {
                const response = await fetch(path);
                if (!response.ok) {
                    console.warn(`Path ${path} returned status ${response.status}`);
                    continue;
                }
                
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    console.warn('Response is not JSON for path:', path, 'Content-Type:', contentType);
                    // Check if it's HTML (404 page)
                    const text = await response.text();
                    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
                        console.warn('Received HTML instead of JSON for path:', path);
                        continue;
                    }
                    // Try to parse anyway if it looks like JSON
                    try {
                        const data = JSON.parse(text);
                        if (data && data.brokers) {
                            brokersData = data.brokers || [];
                            console.log('Loaded brokers from:', path);
                            return brokersData;
                        }
                    } catch (e) {
                        continue;
                    }
                    continue;
                }
                
                const data = await response.json();
                if (data && data.brokers) {
                    brokersData = data.brokers || [];
                    console.log('Loaded brokers from:', path);
                    return brokersData;
                }
            } catch (error) {
                console.warn(`Error loading from ${path}:`, error.message);
                continue;
            }
        }
        
        console.error('Failed to load brokers data from all paths');
        return [];
    }
    
    async function loadReviewsData() {
        // Return cached data if available
        if (reviewsData) {
            console.log('Using cached reviews data');
            return reviewsData;
        }
        
        // Get current language
        const currentLang = localStorage.getItem('language') || 'en';
        const lang = currentLang === 'es' ? 'es' : 'en';
        
        // Load hardcoded reviews from languages.js
        if (typeof languages !== 'undefined' && languages.reviews) {
            const allReviews = [];
            
            // Flatten all reviews from all brokers
            Object.keys(languages.reviews).forEach(brokerSlug => {
                const brokerReviews = languages.reviews[brokerSlug];
                brokerReviews.forEach(review => {
                    // Translate review based on current language
                    const translatedReview = {
                        _id: review.id,
                        id: review.id,
                        broker: {
                            slug: brokerSlug,
                            _id: brokerSlug // Use slug as ID for matching
                        },
                        user: review.user,
                        rating: review.rating,
                        title: review.title[lang] || review.title.es || review.title.en,
                        content: review.content[lang] || review.content.es || review.content.en,
                        pros: review.pros[lang] || review.pros.es || review.pros.en,
                        cons: review.cons[lang] || review.cons.es || review.cons.en,
                        experience: review.experience,
                        tradingDuration: review.tradingDuration,
                        verified: review.verified,
                        helpful: review.helpful || 0,
                        notHelpful: review.notHelpful || 0,
                        createdAt: review.createdAt || new Date().toISOString(),
                        date: review.createdAt || new Date().toISOString(),
                        isApproved: true
                    };
                    allReviews.push(translatedReview);
                });
            });
            
            reviewsData = allReviews;
            console.log(`✅ Loaded ${reviewsData.length} hardcoded reviews (language: ${lang})`);
            return reviewsData;
        }
        
        console.warn('⚠️ languages.reviews not available, returning empty array');
        reviewsData = [];
        return reviewsData;
    }
    
    // Replace API calls with static data loading
    window.loadBrokers = async function(filters = {}) {
        const brokers = await loadBrokersData();
        
        // Apply filters
        let filtered = brokers;
        
        if (filters.category) {
            filtered = filtered.filter(b => b.category === filters.category);
        }
        
        if (filters.country) {
            filtered = filtered.filter(b => 
                b.countries && b.countries.includes(filters.country)
            );
        }
        
        if (filters.featured) {
            filtered = filtered.filter(b => b.isFeatured === true);
        }
        
        // Sort
        filtered.sort((a, b) => {
            if (b.rating !== a.rating) return b.rating - a.rating;
            return (b.totalReviews || 0) - (a.totalReviews || 0);
        });
        
        return {
            brokers: filtered,
            total: filtered.length,
            totalPages: 1,
            currentPage: 1
        };
    };
    
    window.loadBrokerBySlug = async function(slug) {
        const brokers = await loadBrokersData();
        const broker = brokers.find(b => b.slug === slug);
        
        if (!broker) return null;
        
        // Load reviews for this broker - reload to get current language
        reviewsData = null; // Clear cache to reload with current language
        const reviews = await loadReviewsData();
        const brokerReviews = reviews.filter(r => {
            if (!r.broker) return false;
            // Match by slug (preferred) or _id
            return r.broker.slug === slug || r.broker._id === slug || 
                   (broker._id && r.broker._id === broker._id);
        });
        
        return {
            broker: broker,
            reviews: brokerReviews.slice(0, 10)
        };
    };
    
    window.loadReviews = async function(filters = {}) {
        try {
            // Reload reviews to get current language translations
            const currentLang = localStorage.getItem('language') || 'en';
            if (reviewsData && reviewsData.length > 0) {
                // Check if language changed - if so, reload
                const lastLang = localStorage.getItem('lastReviewsLang');
                if (lastLang !== currentLang) {
                    reviewsData = null; // Clear cache to reload with new language
                }
            }
            localStorage.setItem('lastReviewsLang', currentLang);
            
            const reviews = await loadReviewsData();
            
            // Ensure reviews is an array
            if (!Array.isArray(reviews)) {
                console.error('Reviews data is not an array:', reviews);
                return {
                    reviews: [],
                    total: 0,
                    totalPages: 1,
                    currentPage: 1
                };
            }
            
            let filtered = [...reviews]; // Create a copy to avoid mutating original
            
            // Filter by rating
            if (filters.rating) {
                const ratingValue = parseInt(filters.rating);
                filtered = filtered.filter(r => r.rating === ratingValue);
            }
            
            // Filter by broker
            if (filters.broker) {
                console.log(`🔍 Filtering reviews for broker: ${filters.broker}`);
                console.log(`📊 Total reviews before filter: ${filtered.length}`);
                filtered = filtered.filter(r => {
                    if (!r.broker) {
                        console.log('⚠️ Review missing broker object:', r);
                        return false;
                    }
                    // Check both _id and slug (case-insensitive)
                    const brokerId = (r.broker._id || r.broker.id || '').toString().toLowerCase();
                    const brokerSlug = (r.broker.slug || '').toString().toLowerCase();
                    const filterBroker = filters.broker.toString().toLowerCase();
                    const matches = brokerId === filterBroker || brokerSlug === filterBroker;
                    if (matches) {
                        console.log(`✅ Review matches broker: ${r.broker.slug || r.broker._id}`);
                    }
                    return matches;
                });
                console.log(`📊 Total reviews after filter: ${filtered.length}`);
            }
            
            // Sort by date (newest first)
            filtered.sort((a, b) => {
                const dateA = new Date(a.createdAt || a.date || a.created_at || 0);
                const dateB = new Date(b.createdAt || b.date || b.created_at || 0);
                return dateB - dateA;
            });
            
            // Apply pagination
            const limit = filters.limit || filters.pageSize;
            const page = filters.page || 1;
            const startIndex = (page - 1) * (limit || filtered.length);
            const endIndex = limit ? startIndex + limit : filtered.length;
            const paginatedReviews = filtered.slice(startIndex, endIndex);
            
            // Calculate pagination info
            const totalPages = limit ? Math.ceil(filtered.length / limit) : 1;
            
            console.log(`📊 Reviews filtered: ${filtered.length} total, ${paginatedReviews.length} on page ${page}/${totalPages} (lang: ${currentLang})`);
            
            return {
                reviews: paginatedReviews,
                total: filtered.length,
                totalPages: totalPages,
                currentPage: page
            };
        } catch (error) {
            console.error('Error in loadReviews:', error);
            return {
                reviews: [],
                total: 0,
                totalPages: 1,
                currentPage: 1
            };
        }
    };
    
    // Listen for language changes to reload reviews
    window.addEventListener('languageChanged', function(event) {
        console.log('Language changed, clearing reviews cache:', event.detail.language);
        reviewsData = null; // Clear cache to reload with new language
    });
    
    console.log('✅ Static brokers loader initialized');
})();

