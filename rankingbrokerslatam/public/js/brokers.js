// Brokers page functionality
(function() {
    'use strict';
    
    // Translation helper function
    function getTranslation(key) {
        if (typeof languages !== 'undefined') {
            const currentLang = localStorage.getItem('language') || 'en';
            const translations = languages[currentLang];
            if (translations) {
                return key.split('.').reduce((current, k) => current && current[k], translations) || key;
            }
        }
        return key;
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
    
    // Translate category name
    function translateCategory(category) {
        if (!category) return '';
        
        if (typeof languages !== 'undefined') {
            const currentLang = localStorage.getItem('language') || 'en';
            const translations = languages[currentLang];
            
            // Try brokers.filters.categoryName first
            if (translations && translations.brokers && translations.brokers.filters) {
                const categoryMap = {
                    'forex': translations.brokers.filters.forex || 'Forex',
                    'stocks': translations.brokers.filters.stocks || 'Stocks',
                    'crypto': translations.brokers.filters.crypto || 'Crypto',
                    'cfd': translations.brokers.filters.cfds || 'CFDs',
                    'commodities': translations.brokers.filters.commodities || 'Commodities'
                };
                if (categoryMap[category.toLowerCase()]) {
                    return categoryMap[category.toLowerCase()];
                }
            }
            
            // Fallback to nav translations
            if (translations && translations.nav) {
                const navMap = {
                    'forex': translations.nav.forex || 'Forex',
                    'stocks': translations.nav.stocks || 'Stocks',
                    'crypto': translations.nav.crypto || 'Crypto',
                    'cfd': translations.nav.cfds || 'CFDs',
                    'commodities': translations.nav.commodities || 'Commodities'
                };
                if (navMap[category.toLowerCase()]) {
                    return navMap[category.toLowerCase()];
                }
            }
        }
        
        // Final fallback: capitalize first letter
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
    
    // Get translated broker description
    function getTranslatedDescription(brokerSlug, lang) {
        if (typeof languages !== 'undefined' && languages[lang] && languages[lang].brokers && languages[lang].brokers.descriptions) {
            return languages[lang].brokers.descriptions[brokerSlug] || '';
        }
        return '';
    }
    
    let brokers = [];
    let filteredBrokers = [];
    let currentView = 'grid';
    let currentPage = 1;
    let itemsPerPage = 100; // Show all brokers by default
    let comparisonBrokers = [];
    
    // Initialize brokers page
    function initBrokers() {
        loadBrokers();
        setupEventListeners();
        updateView();
        applyUrlFilters();
        
        // Listen for language changes to reload translations
        window.addEventListener('languageChanged', function(event) {
            console.log('Language changed event received in brokers.js:', event.detail.language);
            // Update descriptions
            updateBrokerDescriptions();
            // Re-display brokers to apply new translations (including review comments)
            displayBrokers();
            // Also update comparison view if it's active
            if (currentView === 'compare' && comparisonBrokers.length > 0) {
                displayComparisonView();
            }
        });
    }
    
    // Load brokers from static JSON or API
    async function loadBrokers() {
        try {
            // Try static data loader first
            if (window.loadBrokers) {
                const data = await window.loadBrokers();
                brokers = data.brokers || [];
            } else {
                // Fallback to direct JSON fetch
                const response = await fetch('/public/data/brokers.json');
                const jsonData = await response.json();
                brokers = jsonData.brokers || [];
            }
            filteredBrokers = [...brokers];
            displayBrokers();
        } catch (error) {
            console.error('Error loading brokers:', error);
            showError('Error loading brokers. Please try again.');
        }
    }
    
    // Apply URL-based filters
    function applyUrlFilters() {
        const path = window.location.pathname;
        const categoryMap = {
            '/brokers/forex': 'forex',
            '/brokers/stocks': 'stocks', 
            '/brokers/crypto': 'crypto',
            '/brokers/cfd': 'cfd',
            '/brokers/commodities': 'commodities'
        };
        
        const category = categoryMap[path];
        if (category) {
            const categoryFilter = document.getElementById('categoryFilter');
            if (categoryFilter) {
                categoryFilter.value = category;
                // Update page title and hero content
                updatePageContent(category);
                // Apply filters after a short delay to ensure brokers are loaded
                setTimeout(() => {
                    applyFilters();
                }, 100);
            }
        }
    }
    
    // Update page content based on category
    function updatePageContent(category) {
        const categoryNames = {
            'forex': 'Forex',
            'stocks': 'Acciones', 
            'crypto': 'Criptomonedas',
            'cfd': 'CFDs',
            'commodities': 'Commodities'
        };
        
        const categoryName = categoryNames[category];
        if (categoryName) {
            // Update hero title
            const heroTitle = document.querySelector('.brokers-hero h1');
            if (heroTitle) {
                heroTitle.textContent = `Mejores Brokers de ${categoryName} en América Latina`;
            }
            
            // Update hero subtitle
            const heroSubtitle = document.querySelector('.brokers-hero p');
            if (heroSubtitle) {
                heroSubtitle.textContent = `Descubre los mejores brokers especializados en ${categoryName.toLowerCase()} para traders latinoamericanos.`;
            }
            
            // Update page title
            document.title = `Brokers de ${categoryName} - LatamBrokerReviews`;
        }
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Filter controls
        document.getElementById('categoryFilter')?.addEventListener('change', applyFilters);
        document.getElementById('ratingFilter')?.addEventListener('change', applyFilters);
        document.getElementById('countryFilter')?.addEventListener('change', applyFilters);
        document.getElementById('sortFilter')?.addEventListener('change', applyFilters);
        
        // Filter buttons
        document.getElementById('applyFiltersBtn')?.addEventListener('click', applyFilters);
        document.getElementById('clearFiltersBtn')?.addEventListener('click', clearFilters);
        
        // View controls
        document.getElementById('gridView')?.addEventListener('click', () => setView('grid'));
        document.getElementById('listView')?.addEventListener('click', () => setView('list'));
        document.getElementById('compareView')?.addEventListener('click', () => setView('compare'));
        
        // Modal controls
        document.getElementById('comparisonModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'comparisonModal') {
                closeComparison();
            }
        });
        
        // Comparison modal buttons
        document.getElementById('closeComparisonBtn')?.addEventListener('click', closeComparison);
        document.getElementById('closeComparisonModalBtn')?.addEventListener('click', closeComparison);
        document.getElementById('exportComparisonBtn')?.addEventListener('click', exportComparison);
        document.getElementById('openComparisonModalBtn')?.addEventListener('click', openComparisonModal);
        
        // Delegated event listeners for dynamically generated buttons
        document.addEventListener('click', function(e) {
            // Add to comparison buttons
            if (e.target.closest('.btn-compare[data-action="add-comparison"]')) {
                const button = e.target.closest('.btn-compare');
                const brokerId = button.getAttribute('data-broker-id');
                if (brokerId) {
                    addToComparison(brokerId);
                }
            }
            
            // Remove from comparison buttons
            if (e.target.closest('.remove-btn[data-action="remove-comparison"]')) {
                const button = e.target.closest('.remove-btn');
                const brokerId = button.getAttribute('data-broker-id');
                if (brokerId) {
                    removeFromComparison(brokerId);
                }
            }
            
            // Pagination buttons
            if (e.target.closest('button[data-action="change-page"]')) {
                const button = e.target.closest('button[data-action="change-page"]');
                const page = parseInt(button.getAttribute('data-page'));
                if (page && !button.disabled) {
                    changePage(page);
                }
            }
        });
    }
    
    // Apply filters
    function applyFilters() {
        const category = document.getElementById('categoryFilter')?.value || '';
        const rating = document.getElementById('ratingFilter')?.value || '';
        const country = document.getElementById('countryFilter')?.value || '';
        const sort = document.getElementById('sortFilter')?.value || 'rating';
        
        filteredBrokers = brokers.filter(broker => {
            if (category && broker.category !== category) return false;
            if (rating && broker.rating < parseFloat(rating)) return false;
            if (country && !broker.countries.includes(country)) return false;
            return true;
        });
        
        // Sort brokers
        filteredBrokers.sort((a, b) => {
            switch (sort) {
                case 'rating':
                    return b.rating - a.rating;
                case 'reviews':
                    return b.totalReviews - a.totalReviews;
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });
        
        currentPage = 1;
        displayBrokers();
    }
    
    // Clear filters
    function clearFilters() {
        document.getElementById('categoryFilter').value = '';
        document.getElementById('ratingFilter').value = '';
        document.getElementById('countryFilter').value = '';
        document.getElementById('sortFilter').value = 'rating';
        
        filteredBrokers = [...brokers];
        currentPage = 1;
        displayBrokers();
    }
    
    // Set view mode
    function setView(view) {
        currentView = view;
        updateView();
        displayBrokers();
    }
    
    // Update view buttons
    function updateView() {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const viewBtn = document.getElementById(currentView + 'View');
        if (viewBtn) {
            viewBtn.classList.add('active');
        }
        
        const container = document.getElementById('brokersContainer');
        if (container) {
            container.className = `brokers-grid ${currentView}-view`;
        }
    }
    
    // Display brokers
    async function displayBrokers() {
        const container = document.getElementById('brokersContainer');
        if (!container) return;
        
        // Show all brokers if not in compare view
        if (currentView === 'compare') {
            displayComparisonView();
        } else {
            // Show all filtered brokers (no pagination limit)
            // Use Promise.all to handle async createBrokerCard
            const brokerCards = await Promise.all(filteredBrokers.map(broker => createBrokerCard(broker)));
            container.innerHTML = brokerCards.join('');
        }
        
        // Apply translations to newly created broker cards
        const currentLang = localStorage.getItem('language') || 'en';
        if (typeof window.applyTranslations === 'function') {
            window.applyTranslations(currentLang);
        }
        
        // Update descriptions based on current language
        updateBrokerDescriptions();
        
        updatePagination();
    }
    
    // Update broker descriptions when language changes
    function updateBrokerDescriptions() {
        const currentLang = localStorage.getItem('language') || 'en';
        document.querySelectorAll('.broker-description[data-broker-slug]').forEach(descEl => {
            const brokerSlug = descEl.getAttribute('data-broker-slug');
            const translatedDesc = getTranslatedDescription(brokerSlug, currentLang);
            if (translatedDesc) {
                descEl.textContent = translatedDesc.substring(0, 150) + '...';
            }
        });
    }
    
    // Create broker card
    async function createBrokerCard(broker) {
        const isFeatured = broker.isFeatured ? 'featured' : '';
        const stars = generateStars(broker.rating);
        
        // Get translated description
        const currentLang = localStorage.getItem('language') || 'en';
        let description = broker.description;
        const translatedDesc = getTranslatedDescription(broker.slug, currentLang);
        if (translatedDesc) {
            description = translatedDesc;
        }
        
        // Load a recent review/comment for featured brokers
        let reviewComment = '';
        if (isFeatured && typeof window.loadReviews === 'function') {
            try {
                const reviewData = await window.loadReviews({ 
                    broker: broker.slug || broker._id,
                    limit: 1,
                    page: 1
                });
                if (reviewData && reviewData.reviews && reviewData.reviews.length > 0) {
                    const review = reviewData.reviews[0];
                    const reviewContent = review.content || '';
                    const truncatedContent = reviewContent.length > 100 ? reviewContent.substring(0, 100) + '...' : reviewContent;
                    reviewComment = `
                        <div class="broker-comment" style="margin-top: 15px; padding: 12px; background: #f8f9fa; border-radius: 8px; border-left: 3px solid #667eea;">
                            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                                <div style="width: 32px; height: 32px; border-radius: 50%; background: #667eea; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin-right: 10px; font-size: 0.9rem;">
                                    ${review.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <strong style="font-size: 0.9rem; color: #333;">${review.user.name}</strong>
                                    <div style="font-size: 0.8rem; color: #666;">${generateStars(review.rating)}</div>
                                </div>
                            </div>
                            <p style="margin: 0; font-size: 0.85rem; color: #555; line-height: 1.4;">"${truncatedContent}"</p>
                        </div>
                    `;
                }
            } catch (error) {
                console.log('Could not load review comment:', error);
            }
        }
        
        return `
            <div class="broker-card ${currentView === 'list' ? 'list-view' : ''} ${isFeatured}" ${isFeatured ? `data-featured-text="${getTranslation('brokers.features.Destacado')}"` : ''}>
                <div class="broker-header">
                    <div class="broker-info">
                        <h3>${broker.name}</h3>
                        <div class="broker-rating">
                            <div class="stars">${stars}</div>
                            <span class="rating-number">${broker.rating}/5</span>
                            <span class="reviews-count">(${broker.totalReviews} <span data-translate="brokers.reviews">${getTranslation('brokers.reviews')}</span>)</span>
                        </div>
                    </div>
                </div>
                
                <div class="broker-description" data-broker-slug="${broker.slug}">
                    ${description.substring(0, 150)}...
                </div>
                ${reviewComment}
                
                <div class="broker-features">
                    <h4 data-translate="brokers.mainFeatures">${getTranslation('brokers.mainFeatures') || 'Características principales'}:</h4>
                    <div class="features-list">
                        ${broker.features.slice(0, 3).map(feature => 
                            `<span class="feature-tag">${translateBrokerFeature(feature.name)}</span>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="broker-stats">
                    <div class="stat-item">
                        <span class="stat-value">${broker.rating}</span>
                        <span class="stat-label" data-translate="brokers.rating">${getTranslation('brokers.rating')}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${broker.totalReviews}</span>
                        <span class="stat-label" data-translate="brokers.reviews">${getTranslation('brokers.reviews')}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${broker.countries.length}</span>
                        <span class="stat-label" data-translate="brokers.countries">${getTranslation('brokers.countries')}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${translateCategory(broker.category)}</span>
                        <span class="stat-label" data-translate="brokers.category">${getTranslation('brokers.category')}</span>
                    </div>
                </div>
                
                <div class="broker-actions">
                    <a href="${broker.website}" target="_blank" class="btn-visit" onclick="console.log('Visit site clicked:', '${broker.website}')" data-translate="brokers.visitSite">
                        <i class="fas fa-external-link-alt"></i>
                        <span data-translate="brokers.visitSite">${getTranslation('brokers.visitSite')}</span>
                    </a>
                    <button class="btn-compare" data-broker-id="${broker._id}" data-action="add-comparison" data-translate="brokers.view.compare">
                        <i class="fas fa-balance-scale"></i>
                        <span data-translate="brokers.view.compare">${getTranslation('brokers.view.compare')}</span>
                    </button>
                    <a href="/broker/${broker.slug}.html" class="btn-reviews" data-translate="brokers.reviews">
                        <i class="fas fa-star"></i>
                        <span data-translate="brokers.reviews">${getTranslation('brokers.reviews')}</span>
                    </a>
                </div>
            </div>
        `;
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
    
    // Add broker to comparison
    function addToComparison(brokerId) {
        const broker = brokers.find(b => b._id === brokerId);
        if (!broker) return;
        
        if (comparisonBrokers.length >= 3) {
            alert(getTranslation('brokers.comparison.maxBrokers'));
            return;
        }
        
        if (comparisonBrokers.find(b => b._id === brokerId)) {
            alert(getTranslation('brokers.comparison.alreadyAdded'));
            return;
        }
        
        comparisonBrokers.push(broker);
        updateComparisonButton();
        
        if (currentView === 'compare') {
            displayComparisonView();
        }
    }
    
    // Remove broker from comparison
    function removeFromComparison(brokerId) {
        comparisonBrokers = comparisonBrokers.filter(b => b._id !== brokerId);
        updateComparisonButton();
        
        if (currentView === 'compare') {
            displayComparisonView();
        }
    }
    
    // Update comparison button
    function updateComparisonButton() {
        const compareBtn = document.getElementById('compareView');
        if (compareBtn) {
            const count = comparisonBrokers.length;
            compareBtn.innerHTML = `
                <i class="fas fa-balance-scale"></i>
                <span>Comparar ${count > 0 ? `(${count})` : ''}</span>
            `;
        }
    }
    
    // Display comparison view
    function displayComparisonView() {
        const container = document.getElementById('brokersContainer');
        if (!container) return;
        
        if (comparisonBrokers.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-balance-scale" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                    <h3 data-translate="brokers.comparison.noBrokers">${getTranslation('brokers.comparison.noBrokers')}</h3>
                    <p data-translate="brokers.comparison.selectBrokers">${getTranslation('brokers.comparison.selectBrokers')}</p>
                </div>
            `;
            // Apply translations
            const currentLang = localStorage.getItem('language') || 'en';
            if (typeof window.applyTranslations === 'function') {
                window.applyTranslations(currentLang);
            }
            return;
        }
        
        container.innerHTML = `
            <div class="comparison-container">
                <div class="comparison-header">
                    <h3 data-translate="brokers.comparison.title">${getTranslation('brokers.comparison.title') || 'Comparación de Brokers'}</h3>
                    <button class="btn btn-primary" id="openComparisonModalBtn" data-translate="brokers.comparison.viewFull">
                        <i class="fas fa-expand"></i>
                        <span data-translate="brokers.comparison.viewFull">${getTranslation('brokers.comparison.viewFull') || 'Ver Comparación Completa'}</span>
                    </button>
                </div>
                <div class="comparison-grid">
                    ${comparisonBrokers.map(broker => createComparisonCard(broker)).join('')}
                </div>
            </div>
        `;
        
        // Apply translations to newly created comparison cards
        const currentLang = localStorage.getItem('language') || 'en';
        if (typeof window.applyTranslations === 'function') {
            window.applyTranslations(currentLang);
        }
    }
    
    // Create comparison card
    function createComparisonCard(broker) {
        return `
            <div class="broker-card comparison-card">
                <div class="broker-header">
                    <div class="broker-info">
                        <h3>${broker.name}</h3>
                        <div class="broker-rating">
                            <div class="stars">${generateStars(broker.rating)}</div>
                            <span class="rating-number">${broker.rating}/5</span>
                        </div>
                    </div>
                    <button class="remove-btn" data-broker-id="${broker._id}" data-action="remove-comparison">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="comparison-stats">
                    <div class="stat-row">
                        <span class="stat-label" data-translate="brokers.reviews">${getTranslation('brokers.reviews')}:</span>
                        <span class="stat-value">${broker.totalReviews}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label" data-translate="brokers.countries">${getTranslation('brokers.countries')}:</span>
                        <span class="stat-value">${broker.countries.length}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label" data-translate="brokers.category">${getTranslation('brokers.category')}:</span>
                        <span class="stat-value">${translateCategory(broker.category)}</span>
                    </div>
                </div>
                
                <div class="broker-actions">
                    <a href="${broker.website}" target="_blank" class="btn-visit" data-translate="brokers.visitSite">
                        <span data-translate="brokers.visitSite">${getTranslation('brokers.visitSite')}</span>
                    </a>
                </div>
            </div>
        `;
    }
    
    // Open comparison modal
    function openComparisonModal() {
        if (comparisonBrokers.length === 0) {
            alert(getTranslation('brokers.comparison.noBrokers'));
            return;
        }
        
        const modal = document.getElementById('comparisonModal');
        const table = document.getElementById('comparisonTable');
        
        if (modal && table) {
            table.innerHTML = createComparisonTable();
            // Apply translations to comparison table
            const currentLang = localStorage.getItem('language') || 'en';
            if (typeof window.applyTranslations === 'function') {
                window.applyTranslations(currentLang);
            }
            modal.style.display = 'block';
        }
    }
    
    // Close comparison modal
    function closeComparison() {
        const modal = document.getElementById('comparisonModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // Create comparison table
    function createComparisonTable() {
        if (comparisonBrokers.length === 0) return '';
        
        const features = [
            'name', 'rating', 'totalReviews', 'category', 'countries', 
            'languages', 'tradingPlatforms', 'accountTypes', 'regulations'
        ];
        
        let table = `<table class="comparison-table"><thead><tr><th data-translate="brokers.comparison.feature">${getTranslation('brokers.comparison.feature') || 'Característica'}</th>`;
        comparisonBrokers.forEach(broker => {
            table += `<th>${broker.name}</th>`;
        });
        table += '</tr></thead><tbody>';
        
        features.forEach(feature => {
            const label = getFeatureLabel(feature);
            // Add data-translate attribute for feature labels
            const translateKey = `brokers.${feature === 'totalReviews' ? 'reviews' : feature}`;
            table += `<tr><td data-translate="${translateKey}">${label}</td>`;
            comparisonBrokers.forEach(broker => {
                table += `<td>${getFeatureValue(broker, feature)}</td>`;
            });
            table += '</tr>';
        });
        
        table += '</tbody></table>';
        return table;
    }
    
    // Get feature label
    function getFeatureLabel(feature) {
        const labels = {
            'name': getTranslation('brokers.name') || 'Name',
            'rating': getTranslation('brokers.rating'),
            'totalReviews': getTranslation('brokers.reviews'),
            'category': getTranslation('brokers.category'),
            'countries': getTranslation('brokers.countries'),
            'languages': getTranslation('brokers.languages') || 'Languages',
            'tradingPlatforms': getTranslation('brokers.tradingPlatforms') || 'Trading Platforms',
            'accountTypes': getTranslation('brokers.accountTypes') || 'Account Types',
            'regulations': getTranslation('brokers.regulations') || 'Regulations'
        };
        return labels[feature] || feature;
    }
    
    // Get feature value
    function getFeatureValue(broker, feature) {
        if (feature === 'category') {
            return translateCategory(broker.category);
        }
        const value = broker[feature];
        if (Array.isArray(value)) {
            return value.join(', ');
        }
        return value || 'N/A';
    }
    
    // Export comparison
    function exportComparison() {
        if (comparisonBrokers.length === 0) {
            alert(getTranslation('brokers.comparison.noExport'));
            return;
        }
        
        // Simple CSV export
        const csv = createCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'brokers-comparison.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }
    
    // Create CSV
    function createCSV() {
        const features = ['name', 'rating', 'totalReviews', 'category', 'countries', 'languages'];
        let csv = 'Característica,' + comparisonBrokers.map(b => b.name).join(',') + '\n';
        
        features.forEach(feature => {
            csv += getFeatureLabel(feature) + ',';
            comparisonBrokers.forEach(broker => {
                const value = getFeatureValue(broker, feature);
                csv += '"' + value.replace(/"/g, '""') + '",';
            });
            csv += '\n';
        });
        
        return csv;
    }
    
    // Update pagination
    function updatePagination() {
        const container = document.getElementById('pagination');
        if (!container) return;
        
        const totalPages = Math.ceil(filteredBrokers.length / itemsPerPage);
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        let pagination = '';
        
        // Previous button
        pagination += `
            <button ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}" data-action="change-page">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                pagination += `
                    <button class="${i === currentPage ? 'active' : ''}" data-page="${i}" data-action="change-page">
                        ${i}
                    </button>
                `;
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                pagination += '<span>...</span>';
            }
        }
        
        // Next button
        pagination += `
            <button ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}" data-action="change-page">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        container.innerHTML = pagination;
    }
    
    // Change page
    function changePage(page) {
        const totalPages = Math.ceil(filteredBrokers.length / itemsPerPage);
        if (page < 1 || page > totalPages) return;
        
        currentPage = page;
        displayBrokers();
    }
    
    // Show error
    function showError(message) {
        const container = document.getElementById('brokersContainer');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #dc3545;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 20px;"></i>
                    <h3>Error</h3>
                    <p>${message}</p>
                </div>
            `;
        }
    }
    
    // Make functions globally available
    window.applyFilters = applyFilters;
    window.clearFilters = clearFilters;
    window.setView = setView;
    window.addToComparison = addToComparison;
    window.removeFromComparison = removeFromComparison;
    window.openComparisonModal = openComparisonModal;
    window.closeComparison = closeComparison;
    window.exportComparison = exportComparison;
    window.changePage = changePage;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBrokers);
    } else {
        initBrokers();
    }
})();
