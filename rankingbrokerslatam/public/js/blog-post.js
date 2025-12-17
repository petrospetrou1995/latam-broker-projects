// Blog Post Content Loader - Updated to use hardcoded blogPosts from languages.js
console.log('Blog post script starting...');

// Get the slug from URL - handle trailing slashes and query params
let slug = window.location.pathname.split('/blog/')[1];
if (slug) {
    slug = slug.split('/')[0].split('?')[0].replace('.html', ''); // Remove trailing slash, query params, and .html extension
}

// Load blog post data from hardcoded blogPosts in languages.js, with fallback to blog.posts
function getBlogPost(slug) {
    if (typeof languages === 'undefined') {
        console.warn('languages not available yet');
        return null;
    }
    
    // First try new blogPosts structure
    if (languages.blogPosts && languages.blogPosts[slug]) {
        return languages.blogPosts[slug];
    }
    
    // Fallback to old blog.posts structure via blogPostMap
    // Map slug to post key (e.g., 'guia-forex-principiantes' -> 'forexGuide')
    const slugToKeyMap = {
        'guia-forex-principiantes': 'forexGuide',
        'futuro-criptomonedas-latam': 'cryptoFuture',
        'errores-comunes-trading': 'commonMistakes',
        'elegir-mejor-broker-2024': 'chooseBroker',
        'seguridad-trading-proteger-capital': 'security',
        'trading-oro-guia-completa': 'goldTrading',
        'psicologia-trading-control-emocional': 'psychology',
        'analisis-tecnico-vs-fundamental': 'analysisComparison',
        'metatrader-4-vs-5': 'metatrader',
        'gestion-riesgo-trading': 'riskManagement',
        'metodos-pago-latam': 'paymentMethods',
        'cuentas-demo-trading': 'demoAccount',
        'estrategias-trading-principiantes': 'tradingStrategies',
        'trading-movil-apps': 'mobileTrading',
        'social-trading-guia': 'socialTrading',
        'impuestos-trading-latam': 'taxes',
        'como-elegir-broker-forex': 'chooseForexBroker',
        'como-elegir-broker-latam': 'chooseBrokerLatam',
        'mejores-brokers-latinoamerica-guia': 'bestBrokersLatam',
        'trading-para-principiantes': 'tradingBeginners',
        'comparacion-plataformas-trading': 'platformComparison',
        'forex-vs-acciones': 'forexVsStocks',
        'elegir-broker-latinoamerica': 'chooseBrokerLatin',
        'brokers-regulados-latam': 'regulatedBrokersLatam',
        'brokers-seguros-latinoamerica': 'safeBrokersLatam',
        'brokers-regulados-fca-latam': 'fcaBrokersLatam',
        'brokers-regulados-cysec-latam': 'cysecBrokersLatam',
        'regulacion-brokers-latam': 'brokerRegulationLatam',
        'brokers-metatrader-4': 'mt4Brokers',
        'brokers-metatrader-5': 'mt5Brokers',
        'brokers-mt4-latam': 'mt4BrokersLatam',
        'brokers-mt5-latam': 'mt5BrokersLatam',
        'plataformas-trading-latam': 'tradingPlatformsLatam',
        'brokers-spei': 'brokersSpei',
        'brokers-pse': 'brokersPse',
        'brokers-cbu-alias': 'brokersCbuAlias',
        'brokers-webpay': 'brokersWebpay',
        'metodos-pago-latam-brokers': 'paymentMethodsLatamBrokers',
        'comparar-brokers': 'compareBrokers',
        'comparacion-brokers': 'brokerComparison',
        'libertex-vs-etoro': 'libertexVsEtoro',
        'etoro-vs-xtb': 'etoroVsXtb',
        'interactive-brokers-vs-etoro': 'interactiveBrokersVsEtoro',
        'avatrade-vs-xtb': 'avatradeVsXtb',
        'cmc-markets-vs-plus500': 'cmcMarketsVsPlus500',
        'admirals-vs-ic-markets': 'admiralsVsIcMarkets',
        'mejores-brokers-principiantes': 'bestBrokersBeginners',
        'mejores-brokers-avanzados': 'bestBrokersAdvanced',
        'mejores-brokers-criptomonedas': 'bestCryptoBrokers',
        'mejores-brokers-day-trading': 'bestDayTradingBrokers',
        'mejores-brokers-futuros': 'bestFuturesBrokers',
        'mejores-brokers-comisiones-bajas': 'bestLowFeeBrokers',
        'mejores-apps-trading-movil': 'bestMobileTradingApps',
        'mejores-brokers-sin-deposito-minimo': 'bestNoMinimumDepositBrokers',
        'mejores-brokers-opciones': 'bestOptionsBrokers',
        'mejores-brokers-scalping': 'bestScalpingBrokers',
        'mejores-brokers-acciones': 'bestStockTradingBrokers',
        'mejores-brokers-swing-trading': 'bestSwingTradingBrokers',
        'forex-brokers-latam': 'forexBrokersLatam',
        'cfd-brokers-latam': 'cfdBrokersLatam',
        'crypto-brokers-latam': 'cryptoBrokersLatam',
        'stock-brokers-latam': 'stockBrokersLatam',
        // New blog posts
        'mejores-brokers-forex-latam': 'mejoresBrokersForexLatam',
        'como-empezar-trading-forex': 'comoEmpezarTradingForex',
        'estrategias-scalping-forex': 'estrategiasScalpingForex',
        'analisis-tecnico-forex': 'analisisTecnicoForex',
        'gestion-riesgo-forex': 'gestionRiesgoForex',
        'mejores-pares-divisas-operar': 'mejoresParesDivisasOperar',
        'bonos-brokers-forex': 'bonosBrokersForex',
        'cuenta-demo-vs-real': 'cuentaDemoVsReal',
        'apalancamiento-forex-guia': 'apalancamientoForexGuia',
        'horarios-mejores-operar-forex': 'horariosMejoresOperarForex',
        'spreads-forex-explicacion': 'spreadsForexExplicacion',
        'stop-loss-take-profit': 'stopLossTakeProfit',
        'psicologia-trading-exito': 'psicologiaTradingExito',
        'errores-comunes-traders': 'erroresComunesTraders',
        'trading-forex-movil': 'tradingForexMovil',
        'copy-trading-guia': 'copyTradingGuia',
        'impuestos-trading-latam': 'impuestosTradingLatam',
        'brokers-regulados-latam': 'brokersReguladosLatam',
        'metodos-pago-brokers-latam': 'metodosPagoBrokersLatam',
        'mejores-brokers-crypto-latam': 'mejoresBrokersCryptoLatam',
        'trading-acciones-latam': 'tradingAccionesLatam',
        'cfd-trading-guia': 'cfdTradingGuia',
        'commodities-trading-guia': 'commoditiesTradingGuia',
        'estrategias-day-trading': 'estrategiasDayTrading'
    };
    
    const postKey = slugToKeyMap[slug];
    if (postKey && languages.es && languages.es.blog && languages.es.blog.posts && languages.es.blog.posts[postKey]) {
        const postData = languages.es.blog.posts[postKey];
        // Convert to blogPosts format
        return {
            slug: slug,
            date: '15 Dic 2024', // Default date
            imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
            category: postData.category?.toLowerCase() || 'brokers',
            translated: {
                es: {
                    title: postData.title,
                    description: postData.description,
                    category: postData.category,
                    content: postData.content
                },
                en: languages.en?.blog?.posts?.[postKey] ? {
                    title: languages.en.blog.posts[postKey].title,
                    description: languages.en.blog.posts[postKey].description,
                    category: languages.en.blog.posts[postKey].category,
                    content: languages.en.blog.posts[postKey].content
                } : {
                    title: postData.title,
                    description: postData.description,
                    category: postData.category,
                    content: postData.content
                }
            }
        };
    }
    
    return null;
}

// Initialize blog post content
function initializeBlogPost() {
    if (typeof languages === 'undefined' || !languages.blogPosts) {
        console.warn('Languages not ready yet');
        return;
    }
    
    const postData = getBlogPost(slug);
    
    if (!postData) {
        console.error('No post data found for slug:', slug);
        const postContentDiv = document.getElementById('postContent');
        if (postContentDiv) {
            postContentDiv.innerHTML = '<p style="color: red;">Error: Blog post not found. Please check the URL.</p>';
        }
        return;
    }
    
    const currentLang = localStorage.getItem('language') || 'es';
    const post = postData.translated && postData.translated[currentLang] ? postData.translated[currentLang] : postData.translated.es;
    
    if (!post) {
        console.error('Post content not found for language:', currentLang);
        const postContentDiv = document.getElementById('postContent');
        if (postContentDiv) {
            postContentDiv.innerHTML = '<p style="color: red;">Error: Content not found. Please refresh the page.</p>';
        }
        return;
    }
    
    // Update title
    const title = post.title;
    if (title) {
        const heading = document.getElementById('postHeading');
        const titleEl = document.getElementById('postTitle');
        const pageTitle = document.querySelector('title');
        if (heading) heading.textContent = title;
        if (titleEl) titleEl.textContent = title;
        if (pageTitle) pageTitle.textContent = title + ' - LatamBrokerReviews';
    }
    
    // Update category
    const category = post.category || postData.category;
    if (category) {
        const catEl = document.getElementById('postCategory');
        if (catEl) {
            // Get category translation if available
            const catTranslation = languages[currentLang]?.blog?.categories?.[category] || category;
            catEl.textContent = catTranslation;
        }
    }
    
    // Update date
    const dateEl = document.getElementById('postDate');
    if (dateEl && postData.date) dateEl.textContent = postData.date;
    
    // Load and display image
    if (postData.imageUrl) {
        const imageEl = document.getElementById('postImage');
        const imageContainer = document.getElementById('postImageContainer');
        if (imageEl && imageContainer) {
            imageEl.src = postData.imageUrl;
            imageEl.alt = title || 'Blog post image';
            imageEl.onload = function() {
                imageEl.style.display = 'block';
            };
            imageEl.onerror = function() {
                imageEl.style.display = 'none';
                imageContainer.style.display = 'none';
            };
        }
    }
    
    // Load content
    const description = post.description;
    if (post.content && (post.content.introduction || post.content.sections)) {
        loadDetailedContent(post.content, description);
    } else if (description) {
        const postContentDiv = document.getElementById('postContent');
        if (postContentDiv) {
            postContentDiv.innerHTML = `<p style="font-size: 1.1rem; line-height: 1.8;">${description}</p>`;
        }
    }
}

function loadDetailedContent(content, description) {
    const postContentDiv = document.getElementById('postContent');
    if (!postContentDiv || !content) return;
    
    // Start with description paragraph
    let htmlContent = description ? `<p style="margin-bottom: 20px; font-size: 1.15rem; font-weight: 500; color: #555;">${description}</p>` : '';
    
    // Add introduction
    if (content.introduction) {
        htmlContent += `<h2 style="margin-top: 40px; margin-bottom: 20px; color: #333; font-size: 1.8rem;">${content.introduction.title || 'Introducción'}</h2>`;
        if (Array.isArray(content.introduction.paragraphs)) {
            content.introduction.paragraphs.forEach(p => {
                htmlContent += `<p style="margin-bottom: 15px; line-height: 1.8;">${p}</p>`;
            });
        }
    }
    
    // Add sections
    if (content.sections && Array.isArray(content.sections)) {
        content.sections.forEach(section => {
            htmlContent += `<h2 style="margin-top: 40px; margin-bottom: 20px; color: #333; font-size: 1.6rem; border-bottom: 2px solid #e1e5e9; padding-bottom: 10px;">${section.title}</h2>`;
            if (Array.isArray(section.paragraphs)) {
                section.paragraphs.forEach(p => {
                    htmlContent += `<p style="margin-bottom: 15px; line-height: 1.8;">${p}</p>`;
                });
            }
            if (section.list && Array.isArray(section.list)) {
                htmlContent += '<ul style="margin: 20px 0; padding-left: 30px; line-height: 1.8; background: #f8f9fa; padding: 20px 30px; border-radius: 8px; border-left: 4px solid #667eea;">';
                section.list.forEach(item => {
                    htmlContent += `<li style="margin-bottom: 10px;">${item}</li>`;
                });
                htmlContent += '</ul>';
            }
        });
    }
    
    // Add conclusion
    if (content.conclusion) {
        htmlContent += `<h2 style="margin-top: 50px; margin-bottom: 20px; color: #333; font-size: 1.8rem; border-top: 2px solid #e1e5e9; padding-top: 20px;">${content.conclusion.title || 'Conclusión'}</h2>`;
        if (Array.isArray(content.conclusion.paragraphs)) {
            content.conclusion.paragraphs.forEach(p => {
                htmlContent += `<p style="margin-bottom: 15px; line-height: 1.8; font-size: 1.05rem;">${p}</p>`;
            });
        }
    }
    
    postContentDiv.innerHTML = htmlContent;
}

// Wait for languages.js to load before initializing
let initAttempts = 0;
const maxAttempts = 50;

function waitForLanguages() {
    initAttempts++;
    if (typeof languages !== 'undefined' && languages.blogPosts) {
        console.log('Languages loaded, initializing blog post...');
        initializeBlogPost();
    } else if (initAttempts < maxAttempts) {
        setTimeout(waitForLanguages, 100);
    } else {
        console.error('Failed to load languages.js after ' + maxAttempts + ' attempts');
        const postContentDiv = document.getElementById('postContent');
        if (postContentDiv) {
            postContentDiv.innerHTML = '<p style="color: red;">Error: Failed to load content. Please refresh the page.</p>';
        }
    }
}

// Initialize when DOM is ready
function startInit() {
    waitForLanguages();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startInit);
} else {
    startInit();
}

// Listen for language changes
window.addEventListener('languageChanged', function(event) {
    console.log('Language changed, reloading blog post...');
    initializeBlogPost();
});
