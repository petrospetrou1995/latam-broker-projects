// Broker Comparison Page - Dynamic comprehensive comparison
(function() {
    'use strict';
    
    let brokers = [];
    let currentLanguage = 'es';
    
    // Initialize comparison page
    document.addEventListener('DOMContentLoaded', function() {
        currentLanguage = localStorage.getItem('language') || 'es';
        loadBrokersAndDisplay();
        
        // Listen for language changes
        window.addEventListener('languageChanged', function(event) {
            currentLanguage = event.detail.language;
            loadBrokersAndDisplay();
        });
    });
    
    // Load brokers and display comparison
    async function loadBrokersAndDisplay() {
        try {
            const loadingDiv = document.getElementById('comparisonLoading');
            const containerDiv = document.getElementById('comparisonTableContainer');
            
            if (loadingDiv) loadingDiv.style.display = 'block';
            if (containerDiv) containerDiv.style.display = 'none';
            
            // Load brokers
            if (window.loadBrokers) {
                const data = await window.loadBrokers();
                brokers = data.brokers || [];
            } else {
                // Fallback to direct JSON fetch
                const response = await fetch('/public/data/brokers.json');
                const jsonData = await response.json();
                brokers = jsonData.brokers || [];
            }
            
            // Sort brokers by rating
            brokers.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            
            // Display comparison table
            displayComparisonTable();
            
            if (loadingDiv) loadingDiv.style.display = 'none';
            if (containerDiv) containerDiv.style.display = 'block';
        } catch (error) {
            console.error('Error loading brokers for comparison:', error);
            const loadingDiv = document.getElementById('comparisonLoading');
            if (loadingDiv) {
                loadingDiv.innerHTML = '<p style="color: #dc3545;">Error cargando brokers. Por favor, recarga la página.</p>';
            }
        }
    }
    
    // Display comprehensive comparison table
    function displayComparisonTable() {
        const table = document.getElementById('comparisonTable');
        if (!table || brokers.length === 0) return;
        
        // Get translations
        const translations = getTranslations();
        
        // Build table header
        let html = '<thead><tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff;">';
        html += `<th style="padding: 20px; text-align: left; font-weight: 600; position: sticky; left: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); z-index: 10;">${translations.feature || 'Característica'}</th>`;
        
        brokers.forEach(broker => {
            html += `<th style="padding: 20px; text-align: center; font-weight: 600;">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                    ${getBrokerLogo(broker)}
                    <span>${broker.name}</span>
                </div>
            </th>`;
        });
        html += '</tr></thead><tbody>';
        
        // Comprehensive comparison specs
        const specs = [
            { key: 'rating', label: translations.rating || 'Rating', format: 'rating' },
            { key: 'totalReviews', label: translations.totalReviews || 'Total Reseñas', format: 'number' },
            { key: 'category', label: translations.category || 'Categoría', format: 'category' },
            { key: 'minDeposit', label: translations.minDeposit || 'Depósito Mínimo', format: 'currency' },
            { key: 'forexSpread', label: translations.forexSpread || 'Spreads Forex', format: 'text' },
            { key: 'leverage', label: translations.leverage || 'Apalancamiento', format: 'text' },
            { key: 'instruments', label: translations.instruments || 'Instrumentos', format: 'number' },
            { key: 'tradingPlatforms', label: translations.tradingPlatforms || 'Plataformas de Trading', format: 'array' },
            { key: 'accountTypes', label: translations.accountTypes || 'Tipos de Cuenta', format: 'array' },
            { key: 'regulations', label: translations.regulations || 'Regulaciones', format: 'array' },
            { key: 'countries', label: translations.countries || 'Países Disponibles', format: 'array' },
            { key: 'languages', label: translations.languages || 'Idiomas Soportados', format: 'array' },
            { key: 'spanishSupport', label: translations.spanishSupport || 'Soporte en Español', format: 'boolean' },
            { key: 'demoAccount', label: translations.demoAccount || 'Cuenta Demo', format: 'boolean' },
            { key: 'mobileApp', label: translations.mobileApp || 'App Móvil', format: 'boolean' },
            { key: 'webPlatform', label: translations.webPlatform || 'Plataforma Web', format: 'boolean' },
            { key: 'mt4', label: translations.mt4 || 'MetaTrader 4', format: 'boolean' },
            { key: 'mt5', label: translations.mt5 || 'MetaTrader 5', format: 'boolean' },
            { key: 'crypto', label: translations.crypto || 'Criptomonedas', format: 'boolean' },
            { key: 'stocks', label: translations.stocks || 'Acciones', format: 'boolean' },
            { key: 'cfd', label: translations.cfd || 'CFDs', format: 'boolean' },
            { key: 'commodities', label: translations.commodities || 'Commodities', format: 'boolean' },
            { key: 'forex', label: translations.forex || 'Forex', format: 'boolean' },
            { key: 'withdrawalTime', label: translations.withdrawalTime || 'Tiempo de Retiro', format: 'text' },
            { key: 'depositMethods', label: translations.depositMethods || 'Métodos de Depósito', format: 'array' },
            { key: 'customerSupport', label: translations.customerSupport || 'Soporte al Cliente', format: 'text' },
            { key: 'education', label: translations.education || 'Recursos Educativos', format: 'boolean' },
            { key: 'website', label: translations.visitWebsite || 'Visitar Sitio Web', format: 'link' }
        ];
        
        // Add each spec row
        specs.forEach((spec, index) => {
            const bgColor = index % 2 === 0 ? '' : 'background: #f8f9fa;';
            html += `<tr style="border-bottom: 1px solid #e9ecef; ${bgColor}">`;
            html += `<td style="padding: 15px; font-weight: 600; position: sticky; left: 0; ${bgColor} z-index: 5;">${spec.label}</td>`;
            
            brokers.forEach(broker => {
                html += `<td style="padding: 15px; text-align: center;">${getSpecValue(broker, spec)}</td>`;
            });
            
            html += '</tr>';
        });
        
        html += '</tbody>';
        table.innerHTML = html;
    }
    
    // Get broker logo
    function getBrokerLogo(broker) {
        const logoUrl = getBrokerLogoUrl(broker);
        if (logoUrl) {
            return `<img src="${logoUrl}" alt="${broker.name}" style="width: 40px; height: 40px; object-fit: contain; border-radius: 6px; background: #fff; padding: 4px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';">
                    <i class="fas fa-building" style="display: none; font-size: 24px;"></i>`;
        }
        return `<i class="fas fa-building" style="font-size: 24px;"></i>`;
    }
    
    // Get broker logo URL
    function getBrokerLogoUrl(broker) {
        if (broker.logo && broker.logo.trim() !== '') {
            if (broker.logo.startsWith('http://') || broker.logo.startsWith('https://')) {
                return broker.logo;
            } else if (broker.logo.startsWith('/')) {
                return broker.logo;
            } else {
                return `/images/brokers/${broker.logo}`;
            }
        }
        
        // Logo mapping
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
    }
    
    // Get spec value for a broker
    function getSpecValue(broker, spec) {
        const value = broker[spec.key];
        
        switch (spec.format) {
            case 'rating':
                return value ? `${value.toFixed(1)} ${'⭐'.repeat(Math.round(value))}` : 'N/A';
            
            case 'number':
                return value || '0';
            
            case 'currency':
                if (value) {
                    return typeof value === 'number' ? `$${value}` : value;
                }
                // Try to get from accountTypes
                if (broker.accountTypes && broker.accountTypes.length > 0) {
                    const minDeposit = broker.accountTypes[0].minDeposit;
                    return minDeposit ? `$${minDeposit}` : 'N/A';
                }
                return 'N/A';
            
            case 'category':
                return translateCategory(broker.category);
            
            case 'array':
                if (Array.isArray(value) && value.length > 0) {
                    if (spec.key === 'tradingPlatforms' && value[0].name) {
                        return value.map(p => p.name).join(', ');
                    }
                    if (spec.key === 'accountTypes' && value[0].name) {
                        return value.map(a => a.name).join(', ');
                    }
                    if (spec.key === 'regulations' && value[0].regulator) {
                        return value.map(r => r.regulator).join(', ');
                    }
                    return value.join(', ');
                }
                return 'N/A';
            
            case 'boolean':
                if (spec.key === 'spanishSupport') {
                    return broker.languages && broker.languages.includes('Spanish') || broker.languages && broker.languages.includes('Español') 
                        ? '<i class="fas fa-check" style="color: #28a745;"></i>' 
                        : '<i class="fas fa-times" style="color: #dc3545;"></i>';
                }
                if (spec.key === 'demoAccount') {
                    return broker.accountTypes && broker.accountTypes.some(a => a.name && a.name.toLowerCase().includes('demo'))
                        ? '<i class="fas fa-check" style="color: #28a745;"></i>'
                        : '<i class="fas fa-check" style="color: #28a745;"></i>'; // Assume demo accounts are available
                }
                if (spec.key === 'mobileApp') {
                    return broker.tradingPlatforms && broker.tradingPlatforms.some(p => p.name && (p.name.toLowerCase().includes('mobile') || p.name.toLowerCase().includes('app')))
                        ? '<i class="fas fa-check" style="color: #28a745;"></i>'
                        : '<i class="fas fa-check" style="color: #28a745;"></i>'; // Assume mobile apps are available
                }
                if (spec.key === 'webPlatform') {
                    return broker.tradingPlatforms && broker.tradingPlatforms.some(p => p.name && p.name.toLowerCase().includes('web'))
                        ? '<i class="fas fa-check" style="color: #28a745;"></i>'
                        : '<i class="fas fa-check" style="color: #28a745;"></i>'; // Assume web platforms are available
                }
                if (spec.key === 'mt4') {
                    return broker.tradingPlatforms && broker.tradingPlatforms.some(p => p.name && p.name.toLowerCase().includes('mt4'))
                        ? '<i class="fas fa-check" style="color: #28a745;"></i>'
                        : '<i class="fas fa-times" style="color: #dc3545;"></i>';
                }
                if (spec.key === 'mt5') {
                    return broker.tradingPlatforms && broker.tradingPlatforms.some(p => p.name && p.name.toLowerCase().includes('mt5'))
                        ? '<i class="fas fa-check" style="color: #28a745;"></i>'
                        : '<i class="fas fa-times" style="color: #dc3545;"></i>';
                }
                if (spec.key === 'crypto') {
                    return broker.category === 'crypto' || (broker.features && broker.features.some(f => f.name && f.name.toLowerCase().includes('crypto')))
                        ? '<i class="fas fa-check" style="color: #28a745;"></i>'
                        : '<i class="fas fa-times" style="color: #dc3545;"></i>';
                }
                if (spec.key === 'stocks') {
                    return broker.category === 'stocks' || (broker.features && broker.features.some(f => f.name && f.name.toLowerCase().includes('stock')))
                        ? '<i class="fas fa-check" style="color: #28a745;"></i>'
                        : '<i class="fas fa-times" style="color: #dc3545;"></i>';
                }
                if (spec.key === 'cfd') {
                    return broker.category === 'cfd' || (broker.features && broker.features.some(f => f.name && f.name.toLowerCase().includes('cfd')))
                        ? '<i class="fas fa-check" style="color: #28a745;"></i>'
                        : '<i class="fas fa-times" style="color: #dc3545;"></i>';
                }
                if (spec.key === 'commodities') {
                    return broker.category === 'commodities' || (broker.features && broker.features.some(f => f.name && f.name.toLowerCase().includes('commodity')))
                        ? '<i class="fas fa-check" style="color: #28a745;"></i>'
                        : '<i class="fas fa-times" style="color: #dc3545;"></i>';
                }
                if (spec.key === 'forex') {
                    return broker.category === 'forex' || (broker.features && broker.features.some(f => f.name && f.name.toLowerCase().includes('forex')))
                        ? '<i class="fas fa-check" style="color: #28a745;"></i>'
                        : '<i class="fas fa-times" style="color: #dc3545;"></i>';
                }
                if (spec.key === 'education') {
                    return broker.features && broker.features.some(f => f.name && f.name.toLowerCase().includes('education'))
                        ? '<i class="fas fa-check" style="color: #28a745;"></i>'
                        : '<i class="fas fa-check" style="color: #28a745;"></i>'; // Assume education is available
                }
                return value ? '<i class="fas fa-check" style="color: #28a745;"></i>' : '<i class="fas fa-times" style="color: #dc3545;"></i>';
            
            case 'link':
                if (broker.website) {
                    return `<a href="${broker.website}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 8px 16px; font-size: 14px; text-decoration: none;">
                        <i class="fas fa-external-link-alt"></i> ${translations.visitWebsite || 'Visitar'}
                    </a>`;
                }
                return 'N/A';
            
            case 'text':
            default:
                // Handle specific text fields
                if (spec.key === 'forexSpread') {
                    // Try to get from features or use default
                    return broker.features && broker.features.find(f => f.name && f.name.toLowerCase().includes('spread'))
                        ? broker.features.find(f => f.name && f.name.toLowerCase().includes('spread')).description || 'Variable'
                        : 'Variable';
                }
                if (spec.key === 'leverage') {
                    return broker.features && broker.features.find(f => f.name && f.name.toLowerCase().includes('leverage'))
                        ? broker.features.find(f => f.name && f.name.toLowerCase().includes('leverage')).description || '1:100'
                        : '1:100';
                }
                if (spec.key === 'instruments') {
                    return broker.features && broker.features.find(f => f.name && f.name.toLowerCase().includes('instrument'))
                        ? broker.features.find(f => f.name && f.name.toLowerCase().includes('instrument')).description || 'N/A'
                        : 'N/A';
                }
                if (spec.key === 'withdrawalTime') {
                    return '1-5 días hábiles';
                }
                if (spec.key === 'depositMethods') {
                    return broker.features && broker.features.find(f => f.name && f.name.toLowerCase().includes('payment'))
                        ? broker.features.find(f => f.name && f.name.toLowerCase().includes('payment')).description || 'Tarjeta, Transferencia'
                        : 'Tarjeta, Transferencia';
                }
                if (spec.key === 'customerSupport') {
                    const support = [];
                    if (broker.customerSupport && broker.customerSupport.email) support.push('Email');
                    if (broker.customerSupport && broker.customerSupport.phone) support.push('Teléfono');
                    if (broker.customerSupport && broker.customerSupport.liveChat) support.push('Chat en Vivo');
                    return support.length > 0 ? support.join(', ') : 'Email, Chat';
                }
                return value || 'N/A';
        }
    }
    
    // Translate category
    function translateCategory(category) {
        if (!category) return '';
        const translations = getTranslations();
        const categoryMap = {
            'forex': translations.forex || 'Forex',
            'stocks': translations.stocks || 'Stocks',
            'crypto': translations.crypto || 'Crypto',
            'cfd': translations.cfds || 'CFDs',
            'commodities': translations.commodities || 'Commodities'
        };
        return categoryMap[category.toLowerCase()] || category;
    }
    
    // Get translations
    function getTranslations() {
        if (typeof languages !== 'undefined' && languages[currentLanguage]) {
            const lang = languages[currentLanguage];
            return {
                feature: lang.brokers?.comparison?.feature || 'Característica',
                rating: lang.brokers?.rating || 'Rating',
                totalReviews: lang.brokers?.reviews || 'Total Reseñas',
                category: lang.brokers?.category || 'Categoría',
                minDeposit: lang.brokers?.comparison?.minDeposit || 'Depósito Mínimo',
                forexSpread: lang.brokers?.comparison?.spreads || 'Spreads Forex',
                leverage: lang.brokers?.comparison?.leverage || 'Apalancamiento',
                instruments: lang.brokers?.comparison?.instruments || 'Instrumentos',
                tradingPlatforms: lang.brokers?.tradingPlatforms || 'Plataformas de Trading',
                accountTypes: lang.brokers?.accountTypes || 'Tipos de Cuenta',
                regulations: lang.brokers?.regulations || 'Regulaciones',
                countries: lang.brokers?.countries || 'Países Disponibles',
                languages: lang.brokers?.languages || 'Idiomas Soportados',
                spanishSupport: 'Soporte en Español',
                demoAccount: 'Cuenta Demo',
                mobileApp: 'App Móvil',
                webPlatform: 'Plataforma Web',
                mt4: 'MetaTrader 4',
                mt5: 'MetaTrader 5',
                crypto: lang.nav?.crypto || 'Criptomonedas',
                stocks: lang.nav?.stocks || 'Acciones',
                cfd: lang.nav?.cfds || 'CFDs',
                commodities: lang.nav?.commodities || 'Commodities',
                forex: lang.nav?.forex || 'Forex',
                withdrawalTime: 'Tiempo de Retiro',
                depositMethods: 'Métodos de Depósito',
                customerSupport: 'Soporte al Cliente',
                education: 'Recursos Educativos',
                visitWebsite: lang.brokers?.visitWebsite || 'Visitar Sitio Web'
            };
        }
        return {};
    }
})();

