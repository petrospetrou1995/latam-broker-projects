const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname);

// Project-specific navigation structures
const navigationConfigs = {
    rankingbrokerslatam: {
        navItems: [
            { text: "Home", href: "/", icon: "fas fa-home" },
            { 
                text: "Top 10", 
                href: "#", 
                icon: "fas fa-trophy",
                dropdown: [
                    { text: "Ranking Mensual", href: "/best-brokers-beginners.html" },
                    { text: "Por País", href: "/brokers.html" },
                    { text: "Mejores Spreads", href: "/best-low-fee-brokers.html" }
                ]
            },
            { 
                text: "Comparar", 
                href: "#", 
                icon: "fas fa-balance-scale",
                dropdown: [
                    { text: "Comparar 3 Brokers", href: "/broker-comparison.html" },
                    { text: "Spreads en Vivo", href: "/forex-trading.html" },
                    { text: "Métodos de Pago", href: "/payment-methods-latam.html" }
                ]
            },
            { text: "Copy Trading", href: "/best-scalping-brokers.html", icon: "fas fa-users" },
            { text: "Reseñas", href: "/reviews.html", icon: "fas fa-star" },
            { text: "Contacto", href: "#contact", icon: "fas fa-envelope" }
        ],
        layout: "leaderboard-grid"
    },
    inversionistadigital: {
        navItems: [
            { text: "Inicio", href: "/", icon: "fas fa-home" },
            { 
                text: "Acciones USA", 
                href: "#", 
                icon: "fas fa-chart-line",
                dropdown: [
                    { text: "Cómo Comprar", href: "/stocks-trading.html" },
                    { text: "Brokers Recomendados", href: "/best-stock-trading-brokers.html" },
                    { text: "Acciones Fraccionarias", href: "/best-no-minimum-deposit-brokers.html" }
                ]
            },
            { 
                text: "Crypto", 
                href: "#", 
                icon: "fas fa-coins",
                dropdown: [
                    { text: "On-Ramps Locales", href: "/best-crypto-brokers.html" },
                    { text: "MXN/COP/CLP a USDT", href: "/crypto-trading.html" },
                    { text: "Wallets", href: "/brokers.html" }
                ]
            },
            { text: "ETFs", href: "/best-swing-trading-brokers.html", icon: "fas fa-layer-group" },
            { text: "Neo-Bancos", href: "/payment-methods-latam.html", icon: "fas fa-university" },
            { text: "Blog", href: "/blog.html", icon: "fas fa-blog" },
            { text: "Contacto", href: "#contact", icon: "fas fa-envelope" }
        ],
        layout: "modern-card"
    },
    zonatradinglatam: {
        navItems: [
            { text: "Inicio", href: "/", icon: "fas fa-home" },
            { 
                text: "Day Trading", 
                href: "#", 
                icon: "fas fa-bolt",
                dropdown: [
                    { text: "Brokers Rápidos", href: "/best-day-trading-brokers.html" },
                    { text: "Velocidad Ejecución", href: "/brokers.html" },
                    { text: "Ping LATAM", href: "/forex-trading.html" }
                ]
            },
            { 
                text: "Forex Majors", 
                href: "#", 
                icon: "fas fa-exchange-alt",
                dropdown: [
                    { text: "USD/MXN", href: "/forex-trading.html" },
                    { text: "USD/BRL", href: "/forex-trading.html" },
                    { text: "USD/CLP", href: "/forex-trading.html" }
                ]
            },
            { text: "Plataformas", href: "/trading-platforms-latam.html", icon: "fas fa-desktop" },
            { text: "Señales", href: "/best-scalping-brokers.html", icon: "fas fa-signal" },
            { text: "Apps Móviles", href: "/best-mobile-trading-apps.html", icon: "fas fa-mobile-alt" },
            { text: "Reseñas", href: "/reviews.html", icon: "fas fa-star" }
        ],
        layout: "speed-focused"
    },
    brokersconfiables: {
        navItems: [
            { text: "Inicio", href: "/", icon: "fas fa-home" },
            { 
                text: "Seguridad", 
                href: "#", 
                icon: "fas fa-shield-alt",
                dropdown: [
                    { text: "Alertas de Estafas", href: "/regulated-brokers-latam.html" },
                    { text: "Verificador Regulación", href: "/how-to-choose-broker.html" },
                    { text: "Protección Fondos", href: "/brokers.html" }
                ]
            },
            { 
                text: "Verificación", 
                href: "#", 
                icon: "fas fa-check-circle",
                dropdown: [
                    { text: "Reseñas Verificadas", href: "/reviews.html" },
                    { text: "¿Es Seguro?", href: "/broker-comparison.html" },
                    { text: "Soporte Español", href: "/brokers.html" }
                ]
            },
            { text: "Brokers", href: "/brokers.html", icon: "fas fa-building" },
            { text: "Guías", href: "/how-to-choose-broker.html", icon: "fas fa-book" },
            { text: "Blog", href: "/blog.html", icon: "fas fa-blog" },
            { text: "Contacto", href: "#contact", icon: "fas fa-envelope" }
        ],
        layout: "trust-badges"
    },
    rutadetrading: {
        navItems: [
            { text: "Inicio", href: "/", icon: "fas fa-home" },
            { 
                text: "Guías", 
                href: "#", 
                icon: "fas fa-route",
                dropdown: [
                    { text: "Paso a Paso", href: "/how-to-choose-broker.html" },
                    { text: "Por País", href: "/brokers.html" },
                    { text: "Primera Operación", href: "/best-brokers-beginners.html" }
                ]
            },
            { 
                text: "Recursos", 
                href: "#", 
                icon: "fas fa-graduation-cap",
                dropdown: [
                    { text: "Academia", href: "/education-training.html" },
                    { text: "Cuentas Demo", href: "/best-no-minimum-deposit-brokers.html" },
                    { text: "Glosario", href: "/blog.html" }
                ]
            },
            { text: "Matchmaker", href: "/broker-comparison.html", icon: "fas fa-search-dollar" },
            { text: "Brokers", href: "/brokers.html", icon: "fas fa-building" },
            { text: "Blog", href: "/blog.html", icon: "fas fa-blog" },
            { text: "Sobre Nosotros", href: "#about", icon: "fas fa-info-circle" }
        ],
        layout: "step-by-step"
    },
    comparativaforex: {
        navItems: [
            { text: "Inicio", href: "/", icon: "fas fa-home" },
            { 
                text: "Spreads", 
                href: "#", 
                icon: "fas fa-table",
                dropdown: [
                    { text: "Tablas en Vivo", href: "/forex-trading.html" },
                    { text: "Comparar Costos", href: "/broker-comparison.html" },
                    { text: "Mejores Spreads", href: "/best-low-fee-brokers.html" }
                ]
            },
            { 
                text: "Apalancamiento", 
                href: "#", 
                icon: "fas fa-arrows-alt-v",
                dropdown: [
                    { text: "Alto Apalancamiento", href: "/best-day-trading-brokers.html" },
                    { text: "1:500+", href: "/brokers.html" },
                    { text: "Swap-Free", href: "/best-swing-trading-brokers.html" }
                ]
            },
            { text: "ECN vs MM", href: "/how-to-choose-broker.html", icon: "fas fa-code-branch" },
            { text: "Pares Exóticos", href: "/forex-trading.html", icon: "fas fa-globe" },
            { text: "Brokers", href: "/brokers.html", icon: "fas fa-building" },
            { text: "Reseñas", href: "/reviews.html", icon: "fas fa-star" }
        ],
        layout: "forex-comparison"
    },
    plataformasdeinversion: {
        navItems: [
            { text: "Inicio", href: "/", icon: "fas fa-home" },
            { 
                text: "Multi-Activo", 
                href: "#", 
                icon: "fas fa-layer-group",
                dropdown: [
                    { text: "Acciones + Crypto", href: "/stocks-trading.html" },
                    { text: "Forex + CFDs", href: "/cfd-trading.html" },
                    { text: "Todas las Opciones", href: "/brokers.html" }
                ]
            },
            { 
                text: "Inversión", 
                href: "#", 
                icon: "fas fa-chart-pie",
                dropdown: [
                    { text: "Dividendos", href: "/best-swing-trading-brokers.html" },
                    { text: "ETFs", href: "/best-stock-trading-brokers.html" },
                    { text: "IPOs", href: "/best-day-trading-brokers.html" }
                ]
            },
            { text: "Robo-Advisors", href: "/best-mobile-trading-apps.html", icon: "fas fa-robot" },
            { text: "UX Score", href: "/trading-platforms-latam.html", icon: "fas fa-star" },
            { text: "Brokers", href: "/brokers.html", icon: "fas fa-building" },
            { text: "Blog", href: "/blog.html", icon: "fas fa-blog" },
            { text: "Contacto", href: "#contact", icon: "fas fa-envelope" }
        ],
        layout: "multi-asset"
    },
    guiadebrokerssudamerica: {
        navItems: [
            { text: "Inicio", href: "/", icon: "fas fa-home" },
            { 
                text: "Países", 
                href: "#", 
                icon: "fas fa-map-marked-alt",
                dropdown: [
                    { text: "Argentina", href: "/brokers.html" },
                    { text: "Uruguay", href: "/brokers.html" },
                    { text: "Paraguay", href: "/brokers.html" }
                ]
            },
            { 
                text: "Cobertura", 
                href: "#", 
                icon: "fas fa-coins",
                dropdown: [
                    { text: "Oro y Plata", href: "/commodities-trading.html" },
                    { text: "Stablecoins", href: "/best-crypto-brokers.html" },
                    { text: "Inflación", href: "/brokers.html" }
                ]
            },
            { text: "P2P", href: "/payment-methods-latam.html", icon: "fas fa-users" },
            { text: "Transferencias", href: "/payment-methods-latam.html", icon: "fas fa-university" },
            { text: "Brokers", href: "/brokers.html", icon: "fas fa-building" },
            { text: "Noticias", href: "/blog.html", icon: "fas fa-newspaper" }
        ],
        layout: "regional-focus"
    },
    topbrokersmexicoymas: {
        navItems: [
            { text: "Inicio", href: "/", icon: "fas fa-home" },
            { 
                text: "México", 
                href: "#", 
                icon: "fas fa-flag",
                dropdown: [
                    { text: "SPEI", href: "/payment-methods-latam.html" },
                    { text: "CNBV", href: "/regulated-brokers-latam.html" },
                    { text: "Impuestos", href: "/how-to-choose-broker.html" }
                ]
            },
            { 
                text: "LATAM", 
                href: "#", 
                icon: "fas fa-globe-americas",
                dropdown: [
                    { text: "Otros Países", href: "/brokers.html" },
                    { text: "Guías por País", href: "/brokers.html" }
                ]
            },
            { text: "Brokers USA", href: "/best-stock-trading-brokers.html", icon: "fas fa-building" },
            { text: "Reportes", href: "/broker-comparison.html", icon: "fas fa-file-invoice-dollar" },
            { text: "Trading MXN", href: "/forex-trading.html", icon: "fas fa-dollar-sign" },
            { text: "Kits Inicio", href: "/best-brokers-beginners.html", icon: "fas fa-gift" },
            { text: "Contacto", href: "#contact", icon: "fas fa-envelope" }
        ],
        layout: "mexico-focused"
    },
    capitallatamreviews: {
        navItems: [
            { text: "Inicio", href: "/", icon: "fas fa-home" },
            { 
                text: "Profesional", 
                href: "#", 
                icon: "fas fa-briefcase",
                dropdown: [
                    { text: "Cuentas Pro", href: "/best-brokers-advanced.html" },
                    { text: "DMA", href: "/trading-platforms-latam.html" },
                    { text: "API Trading", href: "/brokers.html" }
                ]
            },
            { 
                text: "Seguridad", 
                href: "#", 
                icon: "fas fa-shield-alt",
                dropdown: [
                    { text: "Scorecard 50pts", href: "/regulated-brokers-latam.html" },
                    { text: "Auditorías", href: "/how-to-choose-broker.html" },
                    { text: "Protección", href: "/brokers.html" }
                ]
            },
            { text: "Gestión", href: "/best-swing-trading-brokers.html", icon: "fas fa-chart-line" },
            { text: "PAMM/MAM", href: "/brokers.html", icon: "fas fa-users-cog" },
            { text: "Brokers", href: "/brokers.html", icon: "fas fa-building" },
            { text: "Reseñas", href: "/reviews.html", icon: "fas fa-star" },
            { text: "Contacto", href: "#contact", icon: "fas fa-envelope" }
        ],
        layout: "professional"
    }
};

function generateNavHTML(navItems) {
    let html = '<ul class="nav-menu">';
    
    navItems.forEach(item => {
        if (item.dropdown && item.dropdown.length > 0) {
            html += `
                <li class="nav-dropdown">
                    <a href="${item.href}" class="nav-link dropdown-toggle">
                        <i class="${item.icon}"></i> ${item.text}
                    </a>
                    <div class="dropdown-menu">
            `;
            item.dropdown.forEach(subItem => {
                html += `<a href="${subItem.href}" class="dropdown-item">${subItem.text}</a>`;
            });
            html += `
                    </div>
                </li>
            `;
        } else {
            html += `
                <li>
                    <a href="${item.href}" class="nav-link">
                        <i class="${item.icon}"></i> ${item.text}
                    </a>
                </li>
            `;
        }
    });
    
    html += '</ul>';
    return html;
}

function updateNavigation(projectKey, config) {
    console.log(`\n🧭 Updating navigation: ${projectKey}`);
    
    const projectDir = path.join(BASE_DIR, projectKey);
    const indexPath = path.join(projectDir, 'views', 'index.html');
    
    if (!fs.existsSync(indexPath)) {
        console.log(`⚠️  Index file not found`);
        return;
    }
    
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Find and replace navigation menu
    const navPattern = /<ul class="nav-menu">[\s\S]*?<\/ul>/;
    const newNavHTML = generateNavHTML(config.navItems);
    
    if (navPattern.test(content)) {
        content = content.replace(navPattern, newNavHTML);
        fs.writeFileSync(indexPath, content);
        console.log(`   ✅ Updated navigation for ${projectKey}`);
    } else {
        console.log(`   ⚠️  Navigation pattern not found`);
    }
    
    // Add layout class to body
    content = content.replace(
        /<body([^>]*)>/,
        `<body$1 class="layout-${config.layout}">`
    );
    
    fs.writeFileSync(indexPath, content);
    console.log(`   ✅ Added layout class: layout-${config.layout}`);
}

// Update all projects
console.log('🚀 Updating navigation and layouts for all projects...\n');

Object.keys(navigationConfigs).forEach((key) => {
    updateNavigation(key, navigationConfigs[key]);
});

console.log('\n✨ Navigation and layout updates complete!');

