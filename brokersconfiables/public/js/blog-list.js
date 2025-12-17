// Blog List Loader - Updated to use hardcoded blogPosts from languages.js
(function() {
    'use strict';
    
    function initializeBlogList() {
        if (typeof languages === 'undefined' || !languages.blogPosts) {
            console.warn('blogPosts not loaded yet, retrying...');
            setTimeout(initializeBlogList, 100);
            return;
        }
        
        const blogGrid = document.querySelector('.blog-grid');
        if (!blogGrid) {
            console.warn('Blog grid not found');
            return;
        }
        
        // Get current language
        const currentLang = localStorage.getItem('language') || 'es';
        
        // Get blog posts from new blogPosts structure or fallback to blog.posts
        let blogPosts = [];
        
        if (languages.blogPosts && Object.keys(languages.blogPosts).length > 0) {
            // Use new blogPosts structure
            blogPosts = Object.values(languages.blogPosts).map(postData => {
                const post = postData.translated && postData.translated[currentLang] 
                    ? postData.translated[currentLang] 
                    : postData.translated.es;
                
                return {
                    slug: postData.slug,
                    title: post.title,
                    description: post.description,
                    category: post.category || postData.category,
                    date: postData.date,
                    imageUrl: postData.imageUrl
                };
            });
        } else if (languages[currentLang] && languages[currentLang].blog && languages[currentLang].blog.posts) {
            // Fallback to old blog.posts structure
            const posts = languages[currentLang].blog.posts;
            const slugToKeyMap = {
                'forexGuide': 'guia-forex-principiantes',
                'cryptoFuture': 'futuro-criptomonedas-latam',
                'commonMistakes': 'errores-comunes-trading',
                'chooseBroker': 'elegir-mejor-broker-2024',
                'security': 'seguridad-trading-proteger-capital',
                'goldTrading': 'trading-oro-guia-completa',
                'psychology': 'psicologia-trading-control-emocional',
                'analysisComparison': 'analisis-tecnico-vs-fundamental',
                'metatrader': 'metatrader-4-vs-5',
                'riskManagement': 'gestion-riesgo-trading',
                'paymentMethods': 'metodos-pago-latam',
                'demoAccount': 'cuentas-demo-trading',
                'tradingStrategies': 'estrategias-trading-principiantes',
                'mobileTrading': 'trading-movil-apps',
                'socialTrading': 'social-trading-guia',
                'taxes': 'impuestos-trading-latam'
            };
            
            blogPosts = Object.entries(posts).map(([key, post]) => ({
                slug: slugToKeyMap[key] || key.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase(),
                title: post.title,
                description: post.description,
                category: post.category || 'brokers',
                date: '15 Dic 2024',
                imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop'
            }));
        }
        
        // Sort by date (newest first) - simple date comparison
        blogPosts.sort((a, b) => {
            const dateA = new Date(b.date.replace(/\s/g, ' '));
            const dateB = new Date(a.date.replace(/\s/g, ' '));
            return dateA - dateB;
        });
        
        // Remove all existing blog cards
        const existingCards = blogGrid.querySelectorAll('.blog-card');
        existingCards.forEach(card => card.remove());
        
        // Remove loading message
        const loadingMsg = blogGrid.querySelector('#blog-loading');
        if (loadingMsg) loadingMsg.remove();
        
        // Generate blog cards
        blogPosts.forEach(post => {
            const gradientColors = [
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
                'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
            ];
            const randomGradient = gradientColors[Math.floor(Math.random() * gradientColors.length)];
            
            // Get category translation
            const categoryTranslation = languages[currentLang]?.blog?.categories?.[post.category] || post.category;
            const readMoreText = currentLang === 'es' ? 'Leer Más' : 'Read More';
            
            const blogCard = document.createElement('div');
            blogCard.className = 'blog-card';
            blogCard.style.cssText = 'background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s ease;';
            blogCard.innerHTML = `
                <div style="height: 200px; overflow: hidden; background: ${randomGradient}; position: relative;">
                    <img src="${post.imageUrl}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; align-items: center; justify-content: center; background: ${randomGradient};">
                        <i class="fas fa-newspaper" style="font-size: 48px; color: #fff;"></i>
                    </div>
                </div>
                <div style="padding: 25px;">
                    <div style="display: flex; gap: 15px; margin-bottom: 15px; font-size: 14px; color: #666;">
                        <span><i class="fas fa-calendar"></i> ${post.date}</span>
                        <span><i class="fas fa-tag"></i> ${categoryTranslation}</span>
                    </div>
                    <h3 style="margin-bottom: 10px; color: #333;">${post.title}</h3>
                    <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">${post.description}</p>
                    <a href="/blog/${post.slug}.html" class="btn btn-primary" style="display: inline-block; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">${readMoreText}</a>
                </div>
            `;
            
            blogGrid.appendChild(blogCard);
        });
        
        console.log(`Loaded ${blogPosts.length} blog posts dynamically`);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeBlogList);
    } else {
        initializeBlogList();
    }
    
    // Listen for language changes
    window.addEventListener('languageChanged', function(event) {
        console.log('Language changed, reloading blog list...');
        initializeBlogList();
    });
})();
