// Main JavaScript for BrokersConfiables

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

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize website functionality
function initializeWebsite() {
    setupNavigation();
    loadFeaturedBrokers();
    loadRecentReviews();
    loadBrokersForDropdown();
    setupContactForm();
    setupSmoothScrolling();
    setupMobileMenu();
    setupEventListeners();
    setupFAQ();
}

// Setup event listeners for buttons
function setupEventListeners() {
    // Load more reviews button
    const loadMoreBtn = document.getElementById('loadMoreReviewsBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            if (window.reviewsManager && window.reviewsManager.loadReviews) {
                window.reviewsManager.loadReviews();
            }
        });
    }
    
    // Review helpful buttons (delegated event listener)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.helpful-btn')) {
            const button = e.target.closest('.helpful-btn');
            const reviewId = button.getAttribute('data-review-id');
            const isHelpful = button.getAttribute('data-helpful') === 'true';
            
            if (reviewId) {
                rateReview(reviewId, isHelpful);
            }
        }
    });
    
    // Listen for language changes to reload featured brokers with translated reviews
    window.addEventListener('languageChanged', function(event) {
        console.log('Language changed event received in main.js, reloading featured brokers...');
        // Reload featured brokers to get reviews in the new language
        loadFeaturedBrokers();
    });
}

// Navigation functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Setup dropdown functionality
    setupDropdowns();
    
    // Update active navigation link
    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
}

// Setup dropdown functionality
function setupDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        // Find dropdown - try nextElementSibling first, then parent's dropdown-menu
        let dropdown = toggle.nextElementSibling;
        if (!dropdown || !dropdown.classList.contains('dropdown-menu')) {
            const parent = toggle.closest('.nav-dropdown');
            if (parent) {
                dropdown = parent.querySelector('.dropdown-menu');
            }
        }
        
        if (!dropdown) {
            console.warn('Dropdown menu not found for toggle:', toggle);
            return;
        }
        
        // Toggle dropdown on click
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdown) {
                    menu.classList.remove('show');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('show');
            
            // Ensure dropdown translations are applied when opened
            if (dropdown.classList.contains('show') && window.ensureDropdownTranslations) {
                window.ensureDropdownTranslations();
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
}

// Load featured brokers
async function loadFeaturedBrokers() {
    try {
        // Try static data loader first, then fallback to JSON file
        if (window.loadBrokers) {
            // Load ALL brokers (remove featured filter to show all)
            const data = await window.loadBrokers();
            if (data.brokers && data.brokers.length > 0) {
                // Sort by rating and show all brokers
                const sortedBrokers = data.brokers.sort((a, b) => {
                    if (b.rating !== a.rating) return b.rating - a.rating;
                    return (b.totalReviews || 0) - (a.totalReviews || 0);
                });
                displayBrokers(sortedBrokers, 'brokersGrid');
                return;
            }
        }
        
        // Fallback to direct JSON fetch
        const paths = ['/public/data/brokers.json', './public/data/brokers.json', 'public/data/brokers.json'];
        let brokers = [];
        
        for (const path of paths) {
            try {
                const response = await fetch(path);
                if (!response.ok) {
                    console.warn(`Path ${path} returned status ${response.status}`);
                    continue;
                }
                
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    // Check if it's HTML (404 page) before parsing
                    const text = await response.text();
                    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
                        console.warn('Received HTML instead of JSON for path:', path);
                        continue;
                    }
                    // Try to parse anyway if it looks like JSON
                    try {
                        const jsonData = JSON.parse(text);
                        if (jsonData && jsonData.brokers) {
                            brokers = jsonData.brokers;
                            break;
                        }
                    } catch (e) {
                        continue;
                    }
                    continue;
                }
                
                const jsonData = await response.json();
                if (jsonData && jsonData.brokers) {
                    brokers = jsonData.brokers;
                    break;
                }
            } catch (e) {
                console.warn(`Error loading from ${path}:`, e.message);
                continue;
            }
        }
        
        // Show ALL brokers, sorted by rating
        const sortedBrokers = brokers.sort((a, b) => {
            if (b.rating !== a.rating) return b.rating - a.rating;
            return (b.totalReviews || 0) - (a.totalReviews || 0);
        });
        
        displayBrokers(sortedBrokers, 'brokersGrid');
    } catch (error) {
        console.error('Error loading featured brokers:', error);
        displayBrokerPlaceholders();
    }
}

// Load recent reviews
async function loadRecentReviews() {
    try {
        // Wait a bit for static-brokers.js to load if it exists
        let waitAttempts = 0;
        while (typeof window.loadReviews !== 'function' && waitAttempts < 20) {
            await new Promise(resolve => setTimeout(resolve, 100));
            waitAttempts++;
        }
        
        let reviews = [];
        
        // Try static data loader first
        if (typeof window.loadReviews === 'function') {
            try {
                const data = await window.loadReviews({ limit: 6 });
                if (data && data.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
                    reviews = data.reviews;
                    console.log('Loaded reviews from static loader:', reviews.length);
                }
            } catch (err) {
                console.warn('Static loader failed, trying direct fetch:', err);
            }
        }
        
        // Fallback to direct JSON fetch if no reviews loaded yet
        if (reviews.length === 0) {
            // Try different possible paths
            const paths = [
                '/public/data/reviews.json',
                './public/data/reviews.json',
                'public/data/reviews.json',
                '/data/reviews.json',
                './data/reviews.json'
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
                        // Check if it's HTML (404 page) before parsing
                        const text = await response.text();
                        if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
                            console.warn('Received HTML instead of JSON for path:', path);
                            continue;
                        }
                        // Try to parse anyway if it looks like JSON
                        try {
                            const jsonData = JSON.parse(text);
                            if (jsonData && jsonData.reviews && Array.isArray(jsonData.reviews)) {
                                reviews = jsonData.reviews;
                                console.log('Loaded reviews from JSON file:', path, reviews.length);
                                break;
                            }
                        } catch (e) {
                            continue;
                        }
                        continue;
                    }
                    
                    const jsonData = await response.json();
                    if (jsonData && jsonData.reviews && Array.isArray(jsonData.reviews)) {
                        reviews = jsonData.reviews;
                        console.log('Loaded reviews from JSON file:', path, reviews.length);
                        break;
                    }
                } catch (e) {
                    console.warn(`Error loading from ${path}:`, e.message);
                    continue;
                }
            }
        }
        
        // Sort by date (newest first) and limit to 6
        if (reviews.length > 0) {
            reviews.sort((a, b) => {
                const dateA = new Date(a.createdAt || a.date || 0);
                const dateB = new Date(b.createdAt || b.date || 0);
                return dateB - dateA;
            });
            
            displayReviews(reviews.slice(0, 6), 'reviewsGrid');
        } else {
            console.warn('No reviews found, showing placeholders');
            displayReviewPlaceholders();
        }
    } catch (error) {
        console.error('Error loading recent reviews:', error);
        displayReviewPlaceholders();
    }
}

// Display brokers in grid
async function displayBrokers(brokers, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Create broker cards with async review loading for featured brokers
    const brokerCards = await Promise.all(brokers.map(async (broker) => {
        // Get translated description
        const currentLang = localStorage.getItem('language') || 'en';
        let description = broker.description;
        if (typeof languages !== 'undefined' && languages[currentLang] && languages[currentLang].brokers && languages[currentLang].brokers.descriptions) {
            const translatedDesc = languages[currentLang].brokers.descriptions[broker.slug];
            if (translatedDesc) {
                description = translatedDesc;
            }
        }

        // Load a recent review/comment for featured brokers
        let reviewComment = '';
        if (broker.isFeatured && typeof window.loadReviews === 'function') {
            try {
                // Force reload reviews by clearing cache - this ensures we get reviews in current language
                // The static-brokers.js will reload with the current language from localStorage
                if (typeof window.loadReviewsData === 'function') {
                    // Clear the reviewsData cache in static-brokers.js scope
                    // We'll trigger a reload by calling loadReviews which checks language
                }
                
                const reviewData = await window.loadReviews({ 
                    broker: broker.slug || broker._id,
                    limit: 1,
                    page: 1
                });
                if (reviewData && reviewData.reviews && reviewData.reviews.length > 0) {
                    const review = reviewData.reviews[0];
                    // Review content is already translated by static-brokers.js
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
            <div class="broker-card ${broker.isFeatured ? 'featured' : ''}" ${broker.isFeatured ? `data-featured-text="${getTranslation('brokers.features.Destacado')}"` : ''}>
                <div class="broker-header">
                    <div class="broker-logo">
                        <i class="fas fa-building"></i>
                    </div>
                    <div class="broker-info">
                        <h3>${broker.name}</h3>
                        <div class="broker-rating">
                            ${generateStars(broker.rating)}
                            <span>${broker.rating.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
                <div class="broker-description">
                    ${description.substring(0, 150)}...
                </div>
                ${reviewComment}
                <div class="broker-features">
                    ${broker.features.slice(0, 3).map(feature => 
                        `<span class="feature-tag">${translateBrokerFeature(feature.name)}</span>`
                    ).join('')}
                </div>
                <div class="broker-actions">
                    <a href="/broker/${broker.slug}.html" class="btn btn-primary">
                        <i class="fas fa-eye"></i>
                        ${getTranslation('brokers.details')}
                    </a>
                    <a href="${broker.website}" target="_blank" class="btn btn-secondary" onclick="console.log('Visit site clicked:', '${broker.website}')">
                        <i class="fas fa-external-link-alt"></i>
                        ${getTranslation('brokers.visitSite')}
                    </a>
                </div>
            </div>
        `;
    }));

    container.innerHTML = brokerCards.join('');
    
    // Apply translations to newly created broker cards
    const currentLang = localStorage.getItem('language') || 'en';
    if (typeof window.applyTranslations === 'function') {
        window.applyTranslations(currentLang);
    }
}

// Display reviews in grid
function displayReviews(reviews, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn('Container not found:', containerId);
        return;
    }
    
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
        console.warn('No reviews to display');
        displayReviewPlaceholders();
        return;
    }

    container.innerHTML = reviews.map(review => {
        // Handle different review data structures
        const userName = review.user?.name || review.userName || 'Anonymous';
        const userCountry = review.user?.country || review.userCountry || '';
        const reviewTitle = review.title || 'Review';
        const reviewContent = review.content || review.text || '';
        const reviewRating = review.rating || 5;
        const reviewId = review._id || review.id || Math.random().toString(36);
        const helpfulCount = review.helpful || 0;
        const notHelpfulCount = review.notHelpful || 0;
        const reviewDate = review.createdAt || review.date || new Date().toISOString();
        
        return `
        <div class="review-card">
            <div class="review-header">
                <div class="review-user">
                    <div class="user-avatar">
                        ${userName.charAt(0).toUpperCase()}
                    </div>
                    <div class="user-info">
                        <h4>${userName}</h4>
                        ${userCountry ? `<p>${userCountry}</p>` : ''}
                    </div>
                </div>
                <div class="review-rating">
                    ${generateStars(reviewRating)}
                </div>
            </div>
            <div class="review-content">
                <h5>${reviewTitle}</h5>
                <p>${reviewContent.length > 200 ? reviewContent.substring(0, 200) + '...' : reviewContent}</p>
            </div>
            <div class="review-actions">
                <button class="helpful-btn" data-review-id="${reviewId}" data-helpful="true">
                    <i class="fas fa-thumbs-up"></i>
                    ${helpfulCount}
                </button>
                <button class="helpful-btn" data-review-id="${reviewId}" data-helpful="false">
                    <i class="fas fa-thumbs-down"></i>
                    ${notHelpfulCount}
                </button>
                <span class="review-date">${formatDate(reviewDate)}</span>
            </div>
        </div>
        `;
    }).join('');
}

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Rate review helpfulness
async function rateReview(reviewId, helpful) {
    try {
        // For static site, use localStorage to track ratings
        const storageKey = `review_${reviewId}_${helpful ? 'helpful' : 'notHelpful'}`;
        const currentCount = parseInt(localStorage.getItem(storageKey) || '0') + 1;
        localStorage.setItem(storageKey, currentCount.toString());
        
        // Update the UI with new counts
        const buttons = document.querySelectorAll(`[data-review-id="${reviewId}"]`);
        buttons.forEach(button => {
            const isHelpfulBtn = button.getAttribute('data-helpful') === 'true';
            if (isHelpfulBtn && helpful) {
                button.innerHTML = `<i class="fas fa-thumbs-up"></i> ${currentCount}`;
            } else if (!isHelpfulBtn && !helpful) {
                button.innerHTML = `<i class="fas fa-thumbs-down"></i> ${currentCount}`;
            }
        });
    } catch (error) {
        console.error('Error rating review:', error);
    }
}

// Setup contact form (static site - uses mailto)
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Create mailto link for static site
        const mailtoSubject = encodeURIComponent(subject || 'Contact from BrokersConfiables');
        const mailtoBody = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );
        const mailtoLink = `mailto:info@brokersconfiables.com?subject=${mailtoSubject}&body=${mailtoBody}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        showNotification('Opening your email client. Please send the message to contact us.', 'success');
        
        // Reset form after a delay
        setTimeout(() => {
            contactForm.reset();
        }, 1000);
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                animation: slideIn 0.3s ease;
            }
            .notification-success {
                background: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            .notification-error {
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
            .notification-info {
                background: #d1ecf1;
                color: #0c5460;
                border: 1px solid #bee5eb;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Setup smooth scrolling
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Setup mobile menu
function setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Handle dropdown toggles on mobile
        const dropdownToggles = document.querySelectorAll('.nav-dropdown .dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const dropdown = toggle.closest('.nav-dropdown');
                    dropdown.classList.toggle('active');
                }
            });
        });
        
        // Handle language selector on mobile - always set up, works on mobile
        const languageBtn = document.getElementById('languageBtn');
        const languageSelector = languageBtn?.closest('.language-selector');
        if (languageBtn && languageSelector) {
            // Add click handler for mobile menu
            languageBtn.addEventListener('click', (e) => {
                // On mobile, toggle the dropdown
                if (window.innerWidth <= 768) {
                    e.stopPropagation();
                    e.preventDefault();
                    languageSelector.classList.toggle('active');
                }
            });
            
            // Ensure language selector is visible in mobile menu
            if (window.innerWidth <= 768) {
                languageSelector.style.display = 'block';
            }
        }
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && navMenu.classList.contains('active')) {
                if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    }
}

// Display placeholder content when data is loading
function displayBrokerPlaceholders() {
    const container = document.getElementById('brokersGrid');
    if (!container) return;
    
    container.innerHTML = `
        <div class="broker-card">
            <div class="broker-header">
                <div class="broker-logo">
                    <i class="fas fa-building"></i>
                </div>
                <div class="broker-info">
                    <h3>Libertex</h3>
                    <div class="broker-rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <span>4.8</span>
                    </div>
                </div>
            </div>
            <div class="broker-description">
                Libertex es uno de los brokers más confiables para trading en América Latina, ofreciendo acceso a más de 300 instrumentos financieros...
            </div>
            <div class="broker-features">
                <span class="feature-tag">Forex</span>
                <span class="feature-tag">CFDs</span>
                <span class="feature-tag">Criptomonedas</span>
            </div>
            <div class="broker-actions">
                <a href="https://libertex.com" target="_blank" class="btn btn-primary">
                    <i class="fas fa-eye"></i>
                    ${getTranslation('brokers.details')}
                </a>
                <a href="https://libertex.com" target="_blank" class="btn btn-secondary">
                    <i class="fas fa-external-link-alt"></i>
                    ${getTranslation('brokers.visitSite')}
                </a>
            </div>
        </div>
    `;
}

function displayReviewPlaceholders() {
    const container = document.getElementById('reviewsGrid');
    if (!container) return;
    
    container.innerHTML = `
        <div class="review-card">
            <div class="review-header">
                <div class="review-user">
                    <div class="user-avatar">M</div>
                    <div class="user-info">
                        <h4>María González</h4>
                        <p>México</p>
                    </div>
                </div>
                <div class="review-rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </div>
            </div>
            <div class="review-content">
                <h5>Excelente plataforma para trading</h5>
                <p>He estado usando Libertex por más de 2 años y la experiencia ha sido excelente. La plataforma es muy intuitiva y el soporte al cliente es excepcional...</p>
            </div>
            <div class="review-actions">
                <button class="helpful-btn">
                    <i class="fas fa-thumbs-up"></i>
                    12
                </button>
                <button class="helpful-btn">
                    <i class="fas fa-thumbs-down"></i>
                    1
                </button>
                <span class="review-date">15 Nov 2024</span>
            </div>
        </div>
    `;
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('brokerSearch');
    if (!searchInput) return;
    
    const debouncedSearch = debounce(async (query) => {
        if (query.length < 2) return;
        
        try {
            // Use static data for search
            let brokers = [];
            if (window.loadBrokers) {
                const data = await window.loadBrokers();
                brokers = data.brokers || [];
            } else {
                const response = await fetch('/public/data/brokers.json');
                const jsonData = await response.json();
                brokers = jsonData.brokers || [];
            }
            
            // Filter brokers by query
            const filtered = brokers.filter(broker => 
                broker.name.toLowerCase().includes(query.toLowerCase())
            );
            
            if (filtered.length > 0) {
                displayBrokers(filtered, 'brokersGrid');
            }
        } catch (error) {
            console.error('Error searching brokers:', error);
        }
    }, 300);
    
    searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
    });
}

// Initialize search when DOM is ready
document.addEventListener('DOMContentLoaded', setupSearch);

// Load brokers for dropdown menu
async function loadBrokersForDropdown() {
    try {
        // Wait a bit to ensure DOM is fully ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Try static data loader first
        let brokers = [];
        if (window.loadBrokers) {
            try {
                const data = await window.loadBrokers({ limit: 50 });
                brokers = data.brokers || [];
            } catch (e) {
                console.warn('Static loader failed, trying direct fetch');
            }
        }
        
        // Fallback to direct JSON fetch if needed
        if (brokers.length === 0) {
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
                    if (!response.ok) continue;
                    
                    const contentType = response.headers.get('content-type');
                    if (!contentType || !contentType.includes('application/json')) {
                        console.warn('Response is not JSON for path:', path);
                        continue;
                    }
                    
                    const jsonData = await response.json();
                    if (jsonData && jsonData.brokers) {
                        brokers = jsonData.brokers;
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }
        }
        
        if (brokers.length > 0) {
            populateBrokerDropdowns(brokers.slice(0, 50));
        } else {
            // Fallback if no brokers returned
            addFallbackBrokers();
        }
    } catch (error) {
        console.error('Error loading brokers for dropdown:', error);
        // Fallback: add common brokers manually if API fails
        addFallbackBrokers();
    }
}

// Populate broker dropdowns with broker list
function populateBrokerDropdowns(brokers) {
    const brokerDropdowns = document.querySelectorAll('.nav-dropdown .dropdown-menu');
    
    if (brokerDropdowns.length === 0) {
        // Retry after a short delay if dropdowns aren't ready yet
        setTimeout(() => {
            const retryDropdowns = document.querySelectorAll('.nav-dropdown .dropdown-menu');
            if (retryDropdowns.length > 0) {
                populateBrokerDropdowns(brokers);
            } else {
                addFallbackBrokers();
            }
        }, 500);
        return;
    }
    
    brokerDropdowns.forEach(dropdown => {
        // Check if this is the brokers dropdown (has "Todos los Brokers" link - check both with and without .html)
        const allBrokersLink = dropdown.querySelector('a[href="/brokers"]') || dropdown.querySelector('a[href="/brokers.html"]');
        if (allBrokersLink) {
            // Clear existing broker links and dividers (keep "Todos los Brokers")
            const existingBrokerLinks = dropdown.querySelectorAll('a[href^="/broker/"]');
            const existingDividers = dropdown.querySelectorAll('.dropdown-divider');
            existingBrokerLinks.forEach(link => link.remove());
            existingDividers.forEach(divider => divider.remove());
            
            // Add separator if there are brokers
            if (brokers.length > 0) {
                const divider = document.createElement('div');
                divider.className = 'dropdown-divider';
                divider.style.cssText = 'height: 1px; margin: 8px 0; background: #e9ecef;';
                allBrokersLink.after(divider);
                
                // Add each broker as a dropdown item (sorted by name)
                const sortedBrokers = [...brokers].sort((a, b) => a.name.localeCompare(b.name));
                sortedBrokers.forEach(broker => {
                    const brokerLink = document.createElement('a');
                    brokerLink.href = `/broker/${broker.slug}.html`;
                    brokerLink.className = 'dropdown-item broker-dropdown-item';
                    brokerLink.setAttribute('aria-label', `Ver detalles de ${broker.name}`);
                    
                    // Create logo container
                    const logoContainer = document.createElement('span');
                    logoContainer.className = 'broker-logo-small';
                    
                    // Always show icon first as fallback
                    const icon = getBrokerIcon(broker);
                    logoContainer.innerHTML = `<i class="${icon}"></i>`;
                    
                    // Try to get logo URL (from database or generated)
                    const logoUrl = getBrokerLogoUrl(broker);
                    
                    if (logoUrl) {
                        // Try to load logo and replace icon if successful
                        const logoImg = document.createElement('img');
                        logoImg.src = logoUrl;
                        logoImg.alt = `${broker.name} logo - ${broker.name} broker logo image for trading platform`;
                        logoImg.style.width = '100%';
                        logoImg.style.height = '100%';
                        logoImg.style.objectFit = 'contain';
                        logoImg.style.padding = '4px';
                        logoImg.style.display = 'none'; // Hidden until loaded
                        logoImg.loading = 'lazy';
                        
                        // Show logo when loaded successfully
                        logoImg.onload = function() {
                            logoContainer.innerHTML = ''; // Clear icon
                            logoContainer.appendChild(this);
                            this.style.display = 'block';
                        };
                        
                        // Keep icon if logo fails to load
                        logoImg.onerror = function() {
                            // Icon is already displayed, just keep it
                            this.remove();
                        };
                        
                        // Add image to container (will replace icon on load)
                        logoContainer.appendChild(logoImg);
                    }
                    
                    // Create name span
                    const nameSpan = document.createElement('span');
                    nameSpan.className = 'broker-name-text';
                    nameSpan.textContent = broker.name;
                    
                    brokerLink.appendChild(logoContainer);
                    brokerLink.appendChild(nameSpan);
                    dropdown.appendChild(brokerLink);
                });
            }
        }
    });
}

// Make logo functions globally accessible
window.getBrokerLogoUrl = getBrokerLogoUrl;
window.getBrokerIcon = getBrokerIcon;

// Get broker logo URL (with fallback to common logo sources)
function getBrokerLogoUrl(broker) {
    // If logo exists in database, use it
    if (broker.logo && broker.logo.trim() !== '') {
        if (broker.logo.startsWith('http://') || broker.logo.startsWith('https://')) {
            return broker.logo;
        } else if (broker.logo.startsWith('/')) {
            return broker.logo;
        } else {
            return `/images/brokers/${broker.logo}`;
        }
    }
    
    // Broker logo URLs - using reliable CDN sources
    const logoCdnMap = {
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
    if (logoCdnMap[slug]) {
        return logoCdnMap[slug];
    }
    
    // Try to generate from website domain using clearbit as fallback
    if (broker.website) {
        try {
            const url = new URL(broker.website);
            // Try clearbit as last resort
            return `https://logo.clearbit.com/${url.hostname}`;
        } catch (e) {
            // Invalid URL, return null
        }
    }
    
    return null;
}

// Get broker icon based on name or category
function getBrokerIcon(broker) {
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
    
    // Check by slug first
    const slug = broker.slug ? broker.slug.toLowerCase() : '';
    if (iconMap[slug]) {
        return iconMap[slug];
    }
    
    // Check by name
    const name = broker.name ? broker.name.toLowerCase() : '';
    for (const [key, icon] of Object.entries(iconMap)) {
        if (name.includes(key)) {
            return icon;
        }
    }
    
    // Check by category
    if (broker.category === 'crypto') {
        return 'fab fa-bitcoin';
    } else if (broker.category === 'forex') {
        return 'fas fa-exchange-alt';
    } else if (broker.category === 'stocks') {
        return 'fas fa-chart-line';
    } else if (broker.category === 'cfd') {
        return 'fas fa-chart-bar';
    } else if (broker.category === 'commodities') {
        return 'fas fa-coins';
    }
    
    // Default icon
    return 'fas fa-building';
}

// Fallback function to add common brokers if API fails
function addFallbackBrokers() {
    const fallbackBrokers = [
        { name: 'Libertex', slug: 'libertex', category: 'forex' },
        { name: 'XM Group', slug: 'xm-group', category: 'forex' },
        { name: 'eToro', slug: 'etoro', category: 'crypto' },
        { name: 'Plus500', slug: 'plus500', category: 'cfd' },
        { name: 'AvaTrade', slug: 'avatrade', category: 'forex' },
        { name: 'IG Markets', slug: 'ig-markets', category: 'stocks' }
    ];
    
    populateBrokerDropdowns(fallbackBrokers);
}

// Setup FAQ accordion functionality
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}
