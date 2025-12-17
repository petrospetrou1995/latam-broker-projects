// Broker Detail Page JavaScript
(function() {
    'use strict';

    let currentBroker = null;
    let currentReviews = [];
    let currentPage = 1;
    const reviewsPerPage = 20; // Show at least 20 reviews per page

    // Initialize page
    document.addEventListener('DOMContentLoaded', function() {
        const urlParams = new URLSearchParams(window.location.search);
        // Handle both /broker/slug.html and /broker/slug formats
        let brokerSlug = window.location.pathname.split('/broker/')[1];
        if (brokerSlug) {
            brokerSlug = brokerSlug.replace('.html', '');
        }
        
        // Initialize global language switcher
        if (typeof window.initializeLanguageSwitcher === 'function') {
            console.log('Initializing global language switcher...');
            window.initializeLanguageSwitcher();
        } else {
            console.log('Global language switcher not found');
        }
        
        // Setup broker-specific language switching
        setupBrokerLanguageSwitching();
        
        // Force apply translations after a delay
        setTimeout(() => {
            const currentLang = localStorage.getItem('language') || 'en';
            console.log('Checking for applyTranslations function...');
            console.log('typeof applyTranslations:', typeof applyTranslations);
            console.log('typeof window.applyTranslations:', typeof window.applyTranslations);
            console.log('Current language:', currentLang);
            
            if (typeof applyTranslations === 'function') {
                console.log('Force applying translations...');
                applyTranslations(currentLang);
            } else if (typeof window.applyTranslations === 'function') {
                console.log('Force applying translations using window.applyTranslations...');
                window.applyTranslations(currentLang);
            } else {
                console.log('applyTranslations function not available');
                console.log('Available window functions:', Object.keys(window).filter(key => key.includes('apply') || key.includes('translation')));
            }
        }, 500);
        
        if (brokerSlug) {
            loadBrokerDetails(brokerSlug);
        } else {
            showError('Broker not found');
        }
    });

    // Load broker details
    async function loadBrokerDetails(slug) {
        try {
            // Use static data loader or JSON file
            let data;
            if (window.loadBrokerBySlug) {
                data = await window.loadBrokerBySlug(slug);
                if (!data || !data.broker) {
                    throw new Error('Broker not found');
                }
                currentBroker = data.broker;
            } else {
                // Fallback to direct JSON fetch
                const brokersResponse = await fetch('/public/data/brokers.json');
                const brokersData = await brokersResponse.json();
                const broker = brokersData.brokers.find(b => b.slug === slug);
                
                if (!broker) {
                    throw new Error('Broker not found');
                }
                
                currentBroker = broker;
            }
            
            displayBrokerDetails();
            updateBrokerLogo(currentBroker); // Ensure logo is displayed
            loadBrokerReviews();
        } catch (error) {
            console.error('Error loading broker:', error);
            showError('Error loading broker details');
        }
    }

    // Update broker logo on detail page
    function updateBrokerLogo(broker) {
        const logoContainer = document.querySelector('.broker-logo');
        if (!logoContainer) return;
        
        // Get logo URL using the global function or local fallback
        const getLogoUrl = window.getBrokerLogoUrl || function(broker) {
            if (broker.logo && broker.logo.trim() !== '') {
                if (broker.logo.startsWith('http://') || broker.logo.startsWith('https://')) {
                    return broker.logo;
                } else if (broker.logo.startsWith('/')) {
                    return broker.logo;
                } else {
                    return `/images/brokers/${broker.logo}`;
                }
            }
            
            // Logo mapping - using clearbit CDN
            const logoMap = {
                'libertex': 'https://logo.clearbit.com/libertex.com',
                'xm-group': 'https://logo.clearbit.com/xm.com',
                'xm': 'https://logo.clearbit.com/xm.com',
                'etoro': 'https://logo.clearbit.com/etoro.com',
                'plus500': 'https://logo.clearbit.com/plus500.com',
                'avatrade': 'https://logo.clearbit.com/avatrade.com',
                'ig-markets': 'https://logo.clearbit.com/ig.com',
                'ig': 'https://logo.clearbit.com/ig.com'
            };
            
            const slug = broker.slug ? broker.slug.toLowerCase() : '';
            if (logoMap[slug]) {
                return logoMap[slug];
            }
            
            if (broker.website) {
                try {
                    const url = new URL(broker.website);
                    return `https://logo.clearbit.com/${url.hostname}`;
                } catch (e) {}
            }
            
            return null;
        };
        
        const getIcon = window.getBrokerIcon || function(broker) {
            const iconMap = {
                'libertex': 'fas fa-chart-line',
                'xm-group': 'fas fa-exchange-alt',
                'xm': 'fas fa-exchange-alt',
                'etoro': 'fab fa-bitcoin',
                'plus500': 'fas fa-chart-bar',
                'avatrade': 'fas fa-globe',
                'ig-markets': 'fas fa-building',
                'ig': 'fas fa-building'
            };
            
            const slug = broker.slug ? broker.slug.toLowerCase() : '';
            if (iconMap[slug]) return iconMap[slug];
            
            if (broker.category === 'crypto') return 'fab fa-bitcoin';
            if (broker.category === 'forex') return 'fas fa-exchange-alt';
            if (broker.category === 'stocks') return 'fas fa-chart-line';
            if (broker.category === 'cfd') return 'fas fa-chart-bar';
            if (broker.category === 'commodities') return 'fas fa-coins';
            return 'fas fa-building';
        };
        
        // Clear existing content
        logoContainer.innerHTML = '';
        
        // Try to load logo
        const logoUrl = getLogoUrl(broker);
        const icon = getIcon(broker);
        
        if (logoUrl) {
            const logoImg = document.createElement('img');
            logoImg.src = logoUrl;
            logoImg.alt = `${broker.name} logo - ${broker.name} broker logo image for trading platform`;
            logoImg.style.width = '100%';
            logoImg.style.height = '100%';
            logoImg.style.objectFit = 'contain';
            logoImg.style.padding = '10px';
            logoImg.style.backgroundColor = '#fff';
            logoImg.style.borderRadius = '8px';
            logoImg.loading = 'lazy';
            
            logoImg.onerror = function() {
                // Fallback to icon if logo fails
                logoContainer.innerHTML = `<i class="${icon}"></i>`;
            };
            
            logoContainer.appendChild(logoImg);
        } else {
            // Use icon
            logoContainer.innerHTML = `<i class="${icon}"></i>`;
        }
    }

    // Display broker details
    function displayBrokerDetails() {
        if (!currentBroker) return;

        console.log('Displaying broker details for:', currentBroker.name);
        console.log('Broker website:', currentBroker.website);

        // Update page title
        document.getElementById('pageTitle').textContent = `${currentBroker.name} Reviews - LatamBrokerReviews`;
        document.getElementById('brokerName').textContent = currentBroker.name;
        
        // Update breadcrumb
        const breadcrumbName = document.getElementById('brokerBreadcrumbName');
        if (breadcrumbName) {
            breadcrumbName.textContent = currentBroker.name;
        }
        
        // Update broker logo
        updateBrokerLogo(currentBroker);
        
        // Update rating
        document.getElementById('brokerRating').textContent = currentBroker.rating.toFixed(1);
        document.getElementById('brokerStars').innerHTML = generateStars(currentBroker.rating);
        document.getElementById('brokerReviewsCount').textContent = `(${currentBroker.totalReviews} reseñas)`;
        
        // Update category
        document.getElementById('brokerCategory').textContent = currentBroker.category;
        
        // Update description with translation
        const currentLang = localStorage.getItem('language') || 'en';
        const translatedDescription = getTranslatedDescription(currentBroker.slug, currentLang);
        document.getElementById('brokerDescription').textContent = translatedDescription;
        
        // Apply translations after content is loaded
        setTimeout(() => {
            const currentLang = localStorage.getItem('language') || 'en';
            if (typeof applyTranslations === 'function') {
                console.log('Applying translations to broker detail page...');
                applyTranslations(currentLang);
            } else if (typeof window.applyTranslations === 'function') {
                console.log('Applying translations using window.applyTranslations...');
                window.applyTranslations(currentLang);
            } else {
                console.log('applyTranslations function not found');
            }
            
            // Ensure Visit Website button text is translated
            const visitWebsiteBtn = document.getElementById('brokerWebsite');
            if (visitWebsiteBtn) {
                const visitWebsiteSpan = visitWebsiteBtn.querySelector('span[data-translate="brokers.visitSite"]');
                if (visitWebsiteSpan && typeof languages !== 'undefined') {
                    const currentLang = localStorage.getItem('language') || 'es';
                    const translations = languages[currentLang];
                    if (translations && translations.brokers && translations.brokers.visitSite) {
                        visitWebsiteSpan.textContent = translations.brokers.visitSite;
                    }
                }
            }
        }, 100);
        
        // Update website link
        const websiteLink = document.getElementById('brokerWebsite');
        console.log('Broker website URL:', currentBroker.website);
        console.log('Website link element:', websiteLink);
        
        if (websiteLink && currentBroker.website) {
            websiteLink.href = currentBroker.website;
            websiteLink.setAttribute('href', currentBroker.website);
            console.log('Website link set to:', currentBroker.website);
            console.log('Link element href attribute:', websiteLink.href);
            console.log('Link element outerHTML:', websiteLink.outerHTML);
            
            // Remove any existing event listeners
            const newLink = websiteLink.cloneNode(true);
            websiteLink.parentNode.replaceChild(newLink, websiteLink);
            
            // Add click event listener for debugging and fallback
            newLink.addEventListener('click', function(e) {
                console.log('Website link clicked, href:', this.href);
                console.log('Event target:', e.target);
                console.log('Event currentTarget:', e.currentTarget);
                
                if (!this.href || this.href === '#' || this.href === window.location.href) {
                    e.preventDefault();
                    console.error('Invalid website URL:', this.href);
                    // Fallback: try to open the broker website directly
                    if (currentBroker && currentBroker.website) {
                        console.log('Opening fallback URL:', currentBroker.website);
                        window.open(currentBroker.website, '_blank');
                    }
                } else {
                    console.log('Opening URL:', this.href);
                }
            });
        } else {
            console.error('Website link element not found or broker website not available');
            console.error('Website link element:', websiteLink);
            console.error('Broker website:', currentBroker.website);
        }
        
        // Update features
        displayBrokerFeatures();
        
        // Update stats
        displayBrokerStats();
    }

    // Display broker features
    function displayBrokerFeatures() {
        const featuresContainer = document.getElementById('brokerFeatures');
        if (!currentBroker.features) return;

        featuresContainer.innerHTML = currentBroker.features.slice(0, 6).map(feature => `
            <div class="feature-item">
                <i class="${feature.icon || 'fas fa-check'}"></i>
                <span>${translateBrokerFeature(feature.name)}</span>
            </div>
        `).join('');
    }

    // Display broker stats
    function displayBrokerStats() {
        const statsContainer = document.getElementById('brokerStats');
        if (!currentBroker) return;

        const stats = [
            {
                label: getTranslation('brokers.rating'),
                value: currentBroker.rating.toFixed(1),
                icon: 'fas fa-star'
            },
            {
                label: getTranslation('brokers.reviews'),
                value: currentBroker.totalReviews,
                icon: 'fas fa-comments'
            },
            {
                label: getTranslation('brokers.countries'),
                value: currentBroker.countries ? currentBroker.countries.length : 0,
                icon: 'fas fa-globe'
            },
            {
                label: getTranslation('brokers.category'),
                value: currentBroker.category,
                icon: 'fas fa-tag'
            }
        ];

        statsContainer.innerHTML = stats.map(stat => `
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="${stat.icon}"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-value">${stat.value}</div>
                    <div class="stat-label">${stat.label}</div>
                </div>
            </div>
        `).join('');
    }

    // Load broker reviews
    async function loadBrokerReviews(reset = true) {
        if (!currentBroker) return;

        try {
            console.log('Loading broker reviews. Page:', currentPage);
            console.log('Current broker:', currentBroker);
            console.log('Broker _id:', currentBroker._id);
            console.log('Broker slug:', currentBroker.slug);
            
            // Wait for window.loadReviews to be available
            let waitAttempts = 0;
            while (typeof window.loadReviews === 'undefined' && waitAttempts < 30) {
                await new Promise(resolve => setTimeout(resolve, 100));
                waitAttempts++;
            }
            
            // Use static data loader or JSON file
            let data;
            if (window.loadReviews) {
                // Try both slug and _id for matching
                const brokerIdentifier = currentBroker.slug || currentBroker._id;
                console.log('Loading reviews for broker identifier:', brokerIdentifier);
                
                // Load ALL reviews for this broker (no pagination limit)
                data = await window.loadReviews({ 
                    broker: brokerIdentifier,
                    page: 1,
                    limit: 1000 // Load all reviews (we have 30 per broker, so 1000 is safe)
                });
                
                console.log('Reviews loaded:', data);
                console.log('Number of reviews:', data.reviews?.length || 0);
            } else {
                // Fallback: Load reviews directly from languages.js
                console.log('⚠️ window.loadReviews not available, loading directly from languages.js');
                if (typeof languages !== 'undefined' && languages.reviews) {
                    const brokerSlug = currentBroker.slug || currentBroker._id;
                    const brokerReviews = languages.reviews[brokerSlug] || [];
                    console.log(`📝 Found ${brokerReviews.length} reviews directly from languages.js for ${brokerSlug}`);
                    
                    const currentLang = localStorage.getItem('language') || 'en';
                    const lang = currentLang === 'es' ? 'es' : 'en';
                    
                    const translatedReviews = brokerReviews.map(review => ({
                        _id: review.id,
                        id: review.id,
                        broker: { slug: brokerSlug, _id: brokerSlug },
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
                    }));
                    
                    data = {
                        reviews: translatedReviews,
                        total: translatedReviews.length,
                        totalPages: 1,
                        currentPage: 1
                    };
                    console.log(`✅ Loaded ${translatedReviews.length} reviews directly from languages.js`);
                } else {
                    console.error('❌ languages.reviews not available');
                    data = { reviews: [], total: 0, totalPages: 1, currentPage: 1 };
                }
            }
            
            // Final fallback: Direct access to languages.js if data is empty
            if (!data || !data.reviews || data.reviews.length === 0) {
                console.log('⚠️ No reviews from window.loadReviews, trying direct languages.js access');
                if (typeof languages !== 'undefined' && languages.reviews) {
                    const brokerSlug = currentBroker.slug || currentBroker._id;
                    const brokerReviews = languages.reviews[brokerSlug] || [];
                    console.log(`📝 Direct access: Found ${brokerReviews.length} reviews for ${brokerSlug}`);
                    
                    if (brokerReviews.length > 0) {
                        const currentLang = localStorage.getItem('language') || 'en';
                        const lang = currentLang === 'es' ? 'es' : 'en';
                        
                        const translatedReviews = brokerReviews.map(review => ({
                            _id: review.id,
                            id: review.id,
                            broker: { slug: brokerSlug, _id: brokerSlug },
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
                        }));
                        
                        data = {
                            reviews: translatedReviews,
                            total: translatedReviews.length,
                            totalPages: 1,
                            currentPage: 1
                        };
                        console.log(`✅ Loaded ${translatedReviews.length} reviews via direct languages.js access`);
                    }
                }
            }
            
            const newReviews = data?.reviews || [];
            console.log('📊 Final reviews count:', newReviews.length);
            console.log('📊 Sample review:', newReviews[0]);
            
            if (reset) {
                currentReviews = newReviews;
            } else {
                currentReviews = currentReviews.concat(newReviews);
            }
            
            console.log('📊 currentReviews after assignment:', currentReviews.length);
            console.log('📊 About to call displayBrokerReviews with reset:', reset);
            
            displayBrokerReviews(reset);
            updateLoadMoreButton(data?.totalPages || 1);
        } catch (error) {
            console.error('Error loading reviews:', error);
            showError('Error loading reviews');
        }
    }
    
    // Update load more button visibility
    function updateLoadMoreButton(totalPages) {
        const loadMoreBtn = document.getElementById('loadMoreReviews');
        if (loadMoreBtn) {
            // Hide load more button since we're showing all reviews at once
            loadMoreBtn.style.display = 'none';
            console.log('All reviews displayed - load more button hidden');
        }
    }

    // Display broker reviews
    function displayBrokerReviews(reset = true) {
        const reviewsContainer = document.getElementById('brokerReviewsGrid');
        if (!reviewsContainer) {
            console.error('❌ brokerReviewsGrid container not found!');
            return;
        }
        
        console.log('📊 displayBrokerReviews called. currentReviews.length:', currentReviews.length, 'reset:', reset);
        
        if (!currentReviews.length) {
            console.warn('⚠️ No reviews to display. currentReviews is empty.');
            if (reset) {
                // Get translated "no reviews" message
                const currentLang = localStorage.getItem('language') || 'en';
                let noReviewsMessage = 'No reviews available for this broker.';
                if (typeof languages !== 'undefined' && languages[currentLang] && languages[currentLang].reviews && languages[currentLang].reviews.noReviews) {
                    noReviewsMessage = languages[currentLang].reviews.noReviews;
                }
                reviewsContainer.innerHTML = `<p class="no-reviews" data-translate="reviews.noReviews">${noReviewsMessage}</p>`;
                // Apply translations to ensure it's translated
                if (typeof window.applyTranslations === 'function') {
                    window.applyTranslations(currentLang);
                }
            }
            return;
        }

        if (reset) {
            reviewsContainer.innerHTML = '';
        }
        
        // Display ALL reviews (no pagination - show all reviews matching statistics)
        const reviewsToDisplay = currentReviews;
        
        // Get current language for date formatting and translations
        const currentLang = localStorage.getItem('language') || 'en';
        const langCode = currentLang === 'es' ? 'es' : 'en';
        
        // Helper function to get translation
        function getReviewTranslation(key) {
            if (typeof languages !== 'undefined' && languages[currentLang] && languages[currentLang].reviews) {
                return key.split('.').reduce((obj, k) => obj && obj[k], languages[currentLang].reviews) || key;
            }
            return key;
        }
        
        // Format date according to language
        function formatReviewDate(dateString) {
            const date = new Date(dateString);
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                locale: langCode === 'es' ? 'es-ES' : 'en-US'
            };
            return date.toLocaleDateString(langCode === 'es' ? 'es-ES' : 'en-US', options);
        }
        
        reviewsToDisplay.forEach(review => {
            const reviewHTML = `
                <div class="review-card" data-review-id="${review._id || review.id}">
                    <div class="review-header">
                        <div class="review-user">
                            <div class="user-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="user-info">
                                <h4>${review.user.name}</h4>
                                <span class="user-country">${review.user.country}</span>
                            </div>
                        </div>
                        <div class="review-rating">
                            ${generateStars(review.rating)}
                            <span>${review.rating}/5</span>
                        </div>
                    </div>
                    <div class="review-content">
                        <h3>${review.title}</h3>
                        <p>${review.content}</p>
                        ${review.pros && Array.isArray(review.pros) && review.pros.length > 0 ? `
                            <div class="review-pros">
                                <h4 data-translate="reviews.pros">${getReviewTranslation('pros')}</h4>
                                <ul>
                                    ${review.pros.map(pro => `<li>${pro}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                        ${review.cons && Array.isArray(review.cons) && review.cons.length > 0 ? `
                            <div class="review-cons">
                                <h4 data-translate="reviews.cons">${getReviewTranslation('cons')}</h4>
                                <ul>
                                    ${review.cons.map(con => `<li>${con}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                    <div class="review-meta">
                        <span class="review-date">${formatReviewDate(review.createdAt || review.date)}</span>
                        ${review.verified ? `<span class="verified-badge" data-translate="reviews.verified"><i class="fas fa-check-circle"></i> ${getReviewTranslation('verified')}</span>` : ''}
                        ${review.experience ? `<span class="review-experience" data-translate="reviews.experience.${review.experience}">${getReviewTranslation(`experience.${review.experience}`)}</span>` : ''}
                        ${review.tradingDuration ? `<span class="review-duration" data-translate="reviews.duration.${review.tradingDuration}">${getReviewTranslation(`duration.${review.tradingDuration}`)}</span>` : ''}
                        <div class="review-helpful">
                            <button class="helpful-btn" data-review-id="${review._id || review.id}" data-action="helpful" aria-label="${getReviewTranslation('helpful')}">
                                <i class="fas fa-thumbs-up"></i>
                                <span class="helpful-count">${review.helpful || 0}</span>
                                <span class="helpful-text" data-translate="reviews.helpful">${getReviewTranslation('helpful')}</span>
                            </button>
                            <button class="not-helpful-btn" data-review-id="${review._id || review.id}" data-action="not-helpful" aria-label="${getReviewTranslation('notHelpful')}">
                                <i class="fas fa-thumbs-down"></i>
                                <span class="not-helpful-count">${review.notHelpful || 0}</span>
                                <span class="not-helpful-text" data-translate="reviews.notHelpful">${getReviewTranslation('notHelpful')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            reviewsContainer.insertAdjacentHTML('beforeend', reviewHTML);
        });
        
        // Apply translations to newly added review elements
        if (typeof window.applyTranslations === 'function') {
            window.applyTranslations(currentLang);
        }

        // Add event listeners for helpful buttons
        setupReviewEventListeners();
        
        console.log(`Displayed ${reviewsToDisplay.length} reviews. Total: ${currentReviews.length}`);
    }

    // Setup review event listeners
    function setupReviewEventListeners() {
        document.querySelectorAll('.helpful-btn, .not-helpful-btn').forEach(button => {
            button.addEventListener('click', async function() {
                const reviewId = this.dataset.reviewId;
                const action = this.dataset.action;
                
                try {
                    // For static site, use localStorage to track ratings
                    const storageKey = `review_${reviewId}_${action}`;
                    const currentCount = parseInt(localStorage.getItem(storageKey) || '0') + 1;
                    localStorage.setItem(storageKey, currentCount.toString());
                    
                    // Update the count
                    const countSpan = this.querySelector('span');
                    const baseCount = parseInt(countSpan.textContent) || 0;
                    const newCount = baseCount + currentCount;
                    countSpan.textContent = newCount;
                    
                    // Visual feedback
                    this.style.opacity = '0.7';
                    setTimeout(() => {
                        this.style.opacity = '1';
                    }, 200);
                    
                    // Disable the button after click
                    this.disabled = true;
                } catch (error) {
                    console.error('Error updating review:', error);
                }
            });
        });
    }

    // Generate star rating
    function generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i - 0.5 <= rating) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    // Translate broker feature names
    function translateBrokerFeature(featureName) {
        if (typeof languages !== 'undefined') {
            const currentLang = localStorage.getItem('language') || 'en';
            const translations = languages[currentLang];
            if (translations && translations.brokers && translations.brokers.features) {
                return translations.brokers.features[featureName] || featureName;
            }
        }
        return featureName;
    }

    // Get translation helper
    function getTranslation(key) {
        if (typeof languages !== 'undefined') {
            const currentLang = localStorage.getItem('language') || 'en';
            const translations = languages[currentLang];
            if (translations) {
                const keys = key.split('.');
                let value = translations;
                for (const k of keys) {
                    value = value?.[k];
                }
                return value || key;
            }
        }
        return key;
    }

    // Get translated broker description
    function getTranslatedDescription(brokerSlug, lang) {
        if (typeof languages !== 'undefined' && languages[lang] && languages[lang].brokers && languages[lang].brokers.descriptions) {
            return languages[lang].brokers.descriptions[brokerSlug] || currentBroker.description;
        }
        return currentBroker.description;
    }

    // Show error message
    function showError(message) {
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2>Error</h2>
                    <p>${message}</p>
                    <a href="/brokers" class="btn btn-primary">Volver a Brokers</a>
                </div>
            `;
        }
    }

    // Load more reviews
    document.addEventListener('click', function(e) {
        if (e.target.id === 'loadMoreReviews' || e.target.closest('#loadMoreReviews')) {
            e.preventDefault();
            currentPage++;
            loadBrokerReviews(false);
        }
    });

    // Add to comparison
    document.addEventListener('click', function(e) {
        if (e.target.id === 'addToComparison') {
            if (currentBroker) {
                // Add to comparison logic here
                alert(`Added ${currentBroker.name} to comparison`);
            }
        }
    });

    // Setup broker-specific language switching
    function setupBrokerLanguageSwitching() {
        console.log('Setting up broker-specific language switching...');
        
        // Override the global switchLanguage function to handle broker-specific content
        const originalSwitchLanguage = window.switchLanguage;
        if (originalSwitchLanguage) {
            window.switchLanguage = function(lang) {
                console.log('Broker-specific language switch to:', lang);
                originalSwitchLanguage(lang);
                
                // Update broker description with new language
                if (currentBroker) {
                    const translatedDescription = getTranslatedDescription(currentBroker.slug, lang);
                    const descriptionElement = document.getElementById('brokerDescription');
                    if (descriptionElement) {
                        descriptionElement.textContent = translatedDescription;
                    }
                }
            };
        }
    }
    
    // Switch language
    function switchLanguage(lang) {
        localStorage.setItem('language', lang);
        updateLanguageDisplay(lang);
        
        // Apply translations
        if (typeof applyTranslations === 'function') {
            applyTranslations();
        } else if (typeof window.applyTranslations === 'function') {
            window.applyTranslations();
        }
        
        // Update broker description with new language
        if (currentBroker) {
            const translatedDescription = getTranslatedDescription(currentBroker.slug, lang);
            document.getElementById('brokerDescription').textContent = translatedDescription;
        }
        
        // Reload broker details to update translated content
        // Handle both /broker/slug.html and /broker/slug formats
        let brokerSlug = window.location.pathname.split('/broker/')[1];
        if (brokerSlug) {
            brokerSlug = brokerSlug.replace('.html', '');
        }
        if (brokerSlug) {
            loadBrokerDetails(brokerSlug);
        }
    }
    
    // Update language display
    function updateLanguageDisplay(lang) {
        const currentLanguageSpan = document.getElementById('currentLanguage');
        if (!currentLanguageSpan) return;
        
        const languageOptions = {
            'en': '🇺🇸 English',
            'es': '🇲🇽 Español'
        };
        
        currentLanguageSpan.textContent = languageOptions[lang] || '🇺🇸 English';
    }

})();
