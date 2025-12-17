const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname);

// Navigation translations for all projects
const navigationTranslations = {
    rankingbrokerslatam: {
        es: {
            "Home": "Inicio",
            "Top 10": "Top 10",
            "Ranking Mensual": "Ranking Mensual",
            "Por País": "Por País",
            "Mejores Spreads": "Mejores Spreads",
            "Comparar": "Comparar",
            "Comparar 3 Brokers": "Comparar 3 Brokers",
            "Spreads en Vivo": "Spreads en Vivo",
            "Métodos de Pago": "Métodos de Pago",
            "Copy Trading": "Copy Trading",
            "Reseñas": "Reseñas",
            "Contacto": "Contacto"
        },
        en: {
            "Home": "Home",
            "Top 10": "Top 10",
            "Ranking Mensual": "Monthly Ranking",
            "Por País": "By Country",
            "Mejores Spreads": "Best Spreads",
            "Comparar": "Compare",
            "Comparar 3 Brokers": "Compare 3 Brokers",
            "Spreads en Vivo": "Live Spreads",
            "Métodos de Pago": "Payment Methods",
            "Copy Trading": "Copy Trading",
            "Reseñas": "Reviews",
            "Contacto": "Contact"
        }
    },
    inversionistadigital: {
        es: {
            "Inicio": "Inicio",
            "Acciones USA": "Acciones USA",
            "Cómo Comprar": "Cómo Comprar",
            "Brokers Recomendados": "Brokers Recomendados",
            "Acciones Fraccionarias": "Acciones Fraccionarias",
            "Crypto": "Crypto",
            "On-Ramps Locales": "On-Ramps Locales",
            "MXN/COP/CLP a USDT": "MXN/COP/CLP a USDT",
            "Wallets": "Wallets",
            "ETFs": "ETFs",
            "Neo-Bancos": "Neo-Bancos",
            "Blog": "Blog",
            "Contacto": "Contacto"
        },
        en: {
            "Inicio": "Home",
            "Acciones USA": "US Stocks",
            "Cómo Comprar": "How to Buy",
            "Brokers Recomendados": "Recommended Brokers",
            "Acciones Fraccionarias": "Fractional Shares",
            "Crypto": "Crypto",
            "On-Ramps Locales": "Local On-Ramps",
            "MXN/COP/CLP a USDT": "MXN/COP/CLP to USDT",
            "Wallets": "Wallets",
            "ETFs": "ETFs",
            "Neo-Bancos": "Neo-Banks",
            "Blog": "Blog",
            "Contacto": "Contact"
        }
    },
    zonatradinglatam: {
        es: {
            "Inicio": "Inicio",
            "Day Trading": "Day Trading",
            "Brokers Rápidos": "Brokers Rápidos",
            "Velocidad Ejecución": "Velocidad Ejecución",
            "Ping LATAM": "Ping LATAM",
            "Forex Majors": "Forex Majors",
            "USD/MXN": "USD/MXN",
            "USD/BRL": "USD/BRL",
            "USD/CLP": "USD/CLP",
            "Plataformas": "Plataformas",
            "Señales": "Señales",
            "Apps Móviles": "Apps Móviles",
            "Reseñas": "Reseñas"
        },
        en: {
            "Inicio": "Home",
            "Day Trading": "Day Trading",
            "Brokers Rápidos": "Fast Brokers",
            "Velocidad Ejecución": "Execution Speed",
            "Ping LATAM": "LATAM Ping",
            "Forex Majors": "Forex Majors",
            "USD/MXN": "USD/MXN",
            "USD/BRL": "USD/BRL",
            "USD/CLP": "USD/CLP",
            "Plataformas": "Platforms",
            "Señales": "Signals",
            "Apps Móviles": "Mobile Apps",
            "Reseñas": "Reviews"
        }
    },
    brokersconfiables: {
        es: {
            "Inicio": "Inicio",
            "Seguridad": "Seguridad",
            "Alertas de Estafas": "Alertas de Estafas",
            "Verificador Regulación": "Verificador Regulación",
            "Protección Fondos": "Protección Fondos",
            "Verificación": "Verificación",
            "Reseñas Verificadas": "Reseñas Verificadas",
            "¿Es Seguro?": "¿Es Seguro?",
            "Soporte Español": "Soporte Español",
            "Brokers": "Brokers",
            "Guías": "Guías",
            "Blog": "Blog",
            "Contacto": "Contacto"
        },
        en: {
            "Inicio": "Home",
            "Seguridad": "Security",
            "Alertas de Estafas": "Scam Alerts",
            "Verificador Regulación": "Regulation Checker",
            "Protección Fondos": "Fund Protection",
            "Verificación": "Verification",
            "Reseñas Verificadas": "Verified Reviews",
            "¿Es Seguro?": "Is It Safe?",
            "Soporte Español": "Spanish Support",
            "Brokers": "Brokers",
            "Guías": "Guides",
            "Blog": "Blog",
            "Contacto": "Contact"
        }
    },
    rutadetrading: {
        es: {
            "Inicio": "Inicio",
            "Guías": "Guías",
            "Paso a Paso": "Paso a Paso",
            "Por País": "Por País",
            "Primera Operación": "Primera Operación",
            "Recursos": "Recursos",
            "Academia": "Academia",
            "Cuentas Demo": "Cuentas Demo",
            "Glosario": "Glosario",
            "Matchmaker": "Matchmaker",
            "Brokers": "Brokers",
            "Blog": "Blog",
            "Sobre Nosotros": "Sobre Nosotros"
        },
        en: {
            "Inicio": "Home",
            "Guías": "Guides",
            "Paso a Paso": "Step by Step",
            "Por País": "By Country",
            "Primera Operación": "First Trade",
            "Recursos": "Resources",
            "Academia": "Academy",
            "Cuentas Demo": "Demo Accounts",
            "Glosario": "Glossary",
            "Matchmaker": "Matchmaker",
            "Brokers": "Brokers",
            "Blog": "Blog",
            "Sobre Nosotros": "About Us"
        }
    },
    comparativaforex: {
        es: {
            "Inicio": "Inicio",
            "Spreads": "Spreads",
            "Tablas en Vivo": "Tablas en Vivo",
            "Comparar Costos": "Comparar Costos",
            "Mejores Spreads": "Mejores Spreads",
            "Apalancamiento": "Apalancamiento",
            "Alto Apalancamiento": "Alto Apalancamiento",
            "1:500+": "1:500+",
            "Swap-Free": "Swap-Free",
            "ECN vs MM": "ECN vs MM",
            "Pares Exóticos": "Pares Exóticos",
            "Brokers": "Brokers",
            "Reseñas": "Reseñas"
        },
        en: {
            "Inicio": "Home",
            "Spreads": "Spreads",
            "Tablas en Vivo": "Live Tables",
            "Comparar Costos": "Compare Costs",
            "Mejores Spreads": "Best Spreads",
            "Apalancamiento": "Leverage",
            "Alto Apalancamiento": "High Leverage",
            "1:500+": "1:500+",
            "Swap-Free": "Swap-Free",
            "ECN vs MM": "ECN vs MM",
            "Pares Exóticos": "Exotic Pairs",
            "Brokers": "Brokers",
            "Reseñas": "Reviews"
        }
    },
    plataformasdeinversion: {
        es: {
            "Inicio": "Inicio",
            "Multi-Activo": "Multi-Activo",
            "Acciones + Crypto": "Acciones + Crypto",
            "Forex + CFDs": "Forex + CFDs",
            "Todas las Opciones": "Todas las Opciones",
            "Inversión": "Inversión",
            "Dividendos": "Dividendos",
            "ETFs": "ETFs",
            "IPOs": "IPOs",
            "Robo-Advisors": "Robo-Advisors",
            "UX Score": "UX Score",
            "Brokers": "Brokers",
            "Blog": "Blog",
            "Contacto": "Contacto"
        },
        en: {
            "Inicio": "Home",
            "Multi-Activo": "Multi-Asset",
            "Acciones + Crypto": "Stocks + Crypto",
            "Forex + CFDs": "Forex + CFDs",
            "Todas las Opciones": "All Options",
            "Inversión": "Investment",
            "Dividendos": "Dividends",
            "ETFs": "ETFs",
            "IPOs": "IPOs",
            "Robo-Advisors": "Robo-Advisors",
            "UX Score": "UX Score",
            "Brokers": "Brokers",
            "Blog": "Blog",
            "Contacto": "Contact"
        }
    },
    guiadebrokerssudamerica: {
        es: {
            "Inicio": "Inicio",
            "Países": "Países",
            "Argentina": "Argentina",
            "Uruguay": "Uruguay",
            "Paraguay": "Paraguay",
            "Cobertura": "Cobertura",
            "Oro y Plata": "Oro y Plata",
            "Stablecoins": "Stablecoins",
            "Inflación": "Inflación",
            "P2P": "P2P",
            "Transferencias": "Transferencias",
            "Brokers": "Brokers",
            "Noticias": "Noticias"
        },
        en: {
            "Inicio": "Home",
            "Países": "Countries",
            "Argentina": "Argentina",
            "Uruguay": "Uruguay",
            "Paraguay": "Paraguay",
            "Cobertura": "Hedging",
            "Oro y Plata": "Gold and Silver",
            "Stablecoins": "Stablecoins",
            "Inflación": "Inflation",
            "P2P": "P2P",
            "Transferencias": "Transfers",
            "Brokers": "Brokers",
            "Noticias": "News"
        }
    },
    topbrokersmexicoymas: {
        es: {
            "Inicio": "Inicio",
            "México": "México",
            "SPEI": "SPEI",
            "CNBV": "CNBV",
            "Impuestos": "Impuestos",
            "LATAM": "LATAM",
            "Otros Países": "Otros Países",
            "Guías por País": "Guías por País",
            "Brokers USA": "Brokers USA",
            "Reportes": "Reportes",
            "Trading MXN": "Trading MXN",
            "Kits Inicio": "Kits Inicio",
            "Contacto": "Contacto"
        },
        en: {
            "Inicio": "Home",
            "México": "Mexico",
            "SPEI": "SPEI",
            "CNBV": "CNBV",
            "Impuestos": "Taxes",
            "LATAM": "LATAM",
            "Otros Países": "Other Countries",
            "Guías por País": "Guides by Country",
            "Brokers USA": "US Brokers",
            "Reportes": "Reports",
            "Trading MXN": "Trading MXN",
            "Kits Inicio": "Starter Kits",
            "Contacto": "Contact"
        }
    },
    capitallatamreviews: {
        es: {
            "Inicio": "Inicio",
            "Profesional": "Profesional",
            "Cuentas Pro": "Cuentas Pro",
            "DMA": "DMA",
            "API Trading": "API Trading",
            "Seguridad": "Seguridad",
            "Scorecard 50pts": "Scorecard 50pts",
            "Auditorías": "Auditorías",
            "Protección": "Protección",
            "Gestión": "Gestión",
            "PAMM/MAM": "PAMM/MAM",
            "Brokers": "Brokers",
            "Reseñas": "Reseñas",
            "Contacto": "Contacto"
        },
        en: {
            "Inicio": "Home",
            "Profesional": "Professional",
            "Cuentas Pro": "Pro Accounts",
            "DMA": "DMA",
            "API Trading": "API Trading",
            "Seguridad": "Security",
            "Scorecard 50pts": "Scorecard 50pts",
            "Auditorías": "Audits",
            "Protección": "Protection",
            "Gestión": "Management",
            "PAMM/MAM": "PAMM/MAM",
            "Brokers": "Brokers",
            "Reseñas": "Reviews",
            "Contacto": "Contact"
        }
    }
};

function addNavigationTranslations(projectKey, translations) {
    console.log(`\n🌐 Adding translations for: ${projectKey}`);
    
    const projectDir = path.join(BASE_DIR, projectKey);
    const languagesPath = path.join(projectDir, 'public', 'js', 'languages.js');
    
    if (!fs.existsSync(languagesPath)) {
        console.log(`⚠️  Languages file not found`);
        return;
    }
    
    let content = fs.readFileSync(languagesPath, 'utf8');
    
    // Add navigation translations to both es and en sections
    const navTranslationsES = translations.es;
    const navTranslationsEN = translations.en;
    
    // Find the nav section in Spanish
    if (content.includes('nav: {')) {
        // Add custom navigation translations after the nav section
        let navSectionES = '        nav: {\n';
        Object.keys(navTranslationsES).forEach(key => {
            const value = navTranslationsES[key];
            navSectionES += `            "${key}": "${value}",\n`;
        });
        navSectionES += '        },';
        
        // Add to Spanish section
        if (!content.includes('"' + Object.keys(navTranslationsES)[0] + '"')) {
            content = content.replace(
                /(nav: \{[\s\S]*?\},)/,
                `$1\n        // Custom Navigation Translations\n        customNav: ${JSON.stringify(navTranslationsES, null, 12).replace(/^/gm, '        ')},`
            );
        }
    }
    
    // Find the English section and add translations
    const enSectionPattern = /en: \{[\s\S]*?nav: \{[\s\S]*?\},/;
    if (enSectionPattern.test(content)) {
        content = content.replace(
            /(en: \{[\s\S]*?nav: \{[\s\S]*?\},)/,
            `$1\n        // Custom Navigation Translations\n        customNav: ${JSON.stringify(navTranslationsEN, null, 12).replace(/^/gm, '        ')},`
        );
    }
    
    fs.writeFileSync(languagesPath, content);
    console.log(`   ✅ Added navigation translations`);
}

// Update language switcher to translate navigation
function updateLanguageSwitcher(projectKey) {
    console.log(`\n🔄 Updating language switcher for: ${projectKey}`);
    
    const projectDir = path.join(BASE_DIR, projectKey);
    const switcherPath = path.join(projectDir, 'public', 'js', 'language-switcher.js');
    
    if (!fs.existsSync(switcherPath)) {
        console.log(`⚠️  Language switcher not found`);
        return;
    }
    
    let content = fs.readFileSync(switcherPath, 'utf8');
    
    // Add function to translate navigation items
    const translateNavFunction = `
// Translate navigation items
function translateNavigation() {
    const currentLang = localStorage.getItem('language') || 'en';
    const langData = languages[currentLang];
    
    if (!langData || !langData.customNav) return;
    
    // Translate all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        const text = link.textContent.trim();
        if (langData.customNav[text]) {
            const icon = link.querySelector('i');
            if (icon) {
                link.innerHTML = icon.outerHTML + ' ' + langData.customNav[text];
            } else {
                link.textContent = langData.customNav[text];
            }
        }
    });
    
    // Translate dropdown items
    document.querySelectorAll('.dropdown-item').forEach(item => {
        const text = item.textContent.trim();
        if (langData.customNav[text]) {
            item.textContent = langData.customNav[text];
        }
    });
}

// Call translateNavigation when language changes
document.addEventListener('languageChanged', function() {
    translateNavigation();
});

// Initial translation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', translateNavigation);
} else {
    translateNavigation();
}
`;
    
    if (!content.includes('translateNavigation')) {
        content += translateNavFunction;
        fs.writeFileSync(switcherPath, content);
        console.log(`   ✅ Updated language switcher`);
    } else {
        console.log(`   ℹ️  Language switcher already updated`);
    }
}

// Update all projects
console.log('🚀 Adding translations for all projects...\n');

Object.keys(navigationTranslations).forEach((key) => {
    addNavigationTranslations(key, navigationTranslations[key]);
    updateLanguageSwitcher(key);
});

console.log('\n✨ Translation support added successfully!');

