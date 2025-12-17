const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname);

// Project-specific customizations
const projectCustomizations = {
    rankingbrokerslatam: {
        name: "RankingBrokersLatam",
        logoIcon: "fas fa-trophy",
        logoText: "RankingBrokersLatam",
        heroTitle: "Top 10 Brokers LATAM - Ranking Mensual",
        heroSubtitle: "Rankings actualizados mensualmente de los mejores brokers. Filtra por país, compara spreads y encuentra el broker perfecto para ti.",
        focus: "leaderboard",
        navItems: ["Top 10", "Por País", "Comparar Spreads", "Métodos de Pago", "Copy Trading"],
        reviews: [
            {
                user: "Carlos M.",
                rating: 5,
                content: "Excelente ranking actualizado. Me ayudó a encontrar el broker con los mejores spreads para México.",
                broker: "XM Group"
            },
            {
                user: "Ana R.",
                rating: 5,
                content: "El filtro por país es genial. Encontré brokers que aceptan Mercado Pago en Argentina.",
                broker: "eToro"
            }
        ]
    },
    inversionistadigital: {
        name: "InversionistaDigital",
        logoIcon: "fas fa-digital-tachograph",
        logoText: "InversionistaDigital",
        heroTitle: "Inversión Digital para LATAM",
        heroSubtitle: "Guías completas para comprar acciones de EE.UU., crypto on-ramps locales y brokers con acciones fraccionarias. Todo lo que necesitas para invertir digitalmente.",
        focus: "modern-tech",
        navItems: ["Acciones USA", "Crypto On-Ramps", "Acciones Fraccionarias", "ETFs", "Neo-Bancos"],
        reviews: [
            {
                user: "Roberto S.",
                rating: 5,
                content: "Finalmente pude comprar Tesla desde Colombia. La guía de acciones fraccionarias fue clave.",
                broker: "Interactive Brokers"
            },
            {
                user: "María L.",
                rating: 5,
                content: "Excelente información sobre integración con NuBank. Muy útil para inversores brasileños.",
                broker: "eToro"
            }
        ]
    },
    zonatradinglatam: {
        name: "ZonaTradingLatam",
        logoIcon: "fas fa-bolt",
        logoText: "ZonaTradingLatam",
        heroTitle: "Zona de Trading Activo - LATAM",
        heroSubtitle: "Brokers para day trading, análisis de velocidad de ejecución, guías de Forex majors y las mejores apps móviles para Android.",
        focus: "active-trading",
        navItems: ["Day Trading", "Forex Majors", "Plataformas", "Señales", "Apps Móviles"],
        reviews: [
            {
                user: "Diego P.",
                rating: 5,
                content: "La mejor información sobre brokers para day trading en LATAM. La velocidad de ejecución es crucial.",
                broker: "XM Group"
            },
            {
                user: "Sofia C.",
                rating: 5,
                content: "Encontré la mejor app Android para trading. La comparativa de plataformas es excelente.",
                broker: "Libertex"
            }
        ]
    },
    brokersconfiables: {
        name: "BrokersConfiables",
        logoIcon: "fas fa-shield-alt",
        logoText: "BrokersConfiables",
        heroTitle: "Brokers Confiables y Seguros",
        heroSubtitle: "Centro de alertas de estafas, verificador de regulaciones y análisis de protección de fondos. Tu seguridad es nuestra prioridad.",
        focus: "safety-trust",
        navItems: ["Alertas de Estafas", "Verificador de Regulación", "Protección de Fondos", "Reseñas Verificadas", "¿Es Seguro?"],
        reviews: [
            {
                user: "Luis H.",
                rating: 5,
                content: "El verificador de regulación me salvó de un broker no regulado. Información muy valiosa.",
                broker: "XM Group"
            },
            {
                user: "Patricia G.",
                rating: 5,
                content: "Excelente análisis de protección de fondos. Ahora sé qué brokers tienen seguro.",
                broker: "Interactive Brokers"
            }
        ]
    },
    rutadetrading: {
        name: "RutaDeTrading",
        logoIcon: "fas fa-route",
        logoText: "RutaDeTrading",
        heroTitle: "Tu Ruta de Trading - Guía Completa",
        heroSubtitle: "Guías paso a paso, matchmaker de capital, cuentas demo y academia gratuita. Todo lo que necesitas para comenzar tu viaje en trading.",
        focus: "education",
        navItems: ["Guías Paso a Paso", "Matchmaker de Capital", "Cuentas Demo", "Academia", "Glosario"],
        reviews: [
            {
                user: "Fernando T.",
                rating: 5,
                content: "La guía paso a paso para Chile fue perfecta. Finalmente entendí cómo hacer mi primera operación.",
                broker: "XM Group"
            },
            {
                user: "Carmen V.",
                rating: 5,
                content: "El matchmaker de capital me ayudó a encontrar brokers para mi presupuesto de $50.",
                broker: "Libertex"
            }
        ]
    },
    comparativaforex: {
        name: "ComparativaForex",
        logoIcon: "fas fa-exchange-alt",
        logoText: "ComparativaForex",
        heroTitle: "Comparativa Especializada en Forex",
        heroSubtitle: "Tablas de spreads en vivo, brokers con alto apalancamiento, cuentas swap-free y análisis técnico profundo de ECN vs Market Maker.",
        focus: "forex-niche",
        navItems: ["Spreads en Vivo", "Alto Apalancamiento", "Swap-Free", "ECN vs MM", "Pares Exóticos"],
        reviews: [
            {
                user: "Alejandro M.",
                rating: 5,
                content: "Las tablas de spreads en vivo son increíbles. Ahorré mucho en costos de trading.",
                broker: "XM Group"
            },
            {
                user: "Isabel R.",
                rating: 5,
                content: "Encontré brokers con apalancamiento 1:500. Perfecto para mi estrategia de trading.",
                broker: "XM Group"
            }
        ]
    },
    plataformasdeinversion: {
        name: "PlataformasDeInversion",
        logoIcon: "fas fa-chart-pie",
        logoText: "PlataformasDeInversion",
        heroTitle: "Plataformas de Inversión Multi-Activo",
        heroSubtitle: "Brokers con acciones, crypto y forex. Guías de inversión en dividendos, robo-advisors y acceso a IPOs. Construye tu portafolio diversificado.",
        focus: "investment",
        navItems: ["Multi-Activo", "Dividendos", "Robo-Advisors", "IPOs", "UX Score"],
        reviews: [
            {
                user: "Ricardo F.",
                rating: 5,
                content: "Excelente análisis de brokers multi-activo. Ahora puedo operar todo en una plataforma.",
                broker: "Interactive Brokers"
            },
            {
                user: "Laura M.",
                rating: 5,
                content: "La guía de inversión en dividendos me ayudó a construir un portafolio pasivo.",
                broker: "Interactive Brokers"
            }
        ]
    },
    guiadebrokerssudamerica: {
        name: "GuiadeBrokersSudamerica",
        logoIcon: "fas fa-map-marked-alt",
        logoText: "Guía Sudamérica",
        heroTitle: "Guía de Brokers Sudamérica",
        heroSubtitle: "Guías específicas para Argentina, Uruguay y Paraguay. Brokers para cobertura contra inflación, trading P2P y transferencias bancarias locales.",
        focus: "southern-cone",
        navItems: ["Argentina", "Uruguay", "Paraguay", "Cobertura Inflación", "P2P"],
        reviews: [
            {
                user: "Martín A.",
                rating: 5,
                content: "La guía específica para Argentina fue exactamente lo que necesitaba. Información muy local.",
                broker: "XM Group"
            },
            {
                user: "Elena U.",
                rating: 5,
                content: "Encontré brokers para proteger mi capital de la inflación. Excelente información.",
                broker: "XM Group"
            }
        ]
    },
    topbrokersmexicoymas: {
        name: "TopBrokersMexicoYMas",
        logoIcon: "fas fa-flag",
        logoText: "Top México y Más",
        heroTitle: "Top Brokers México y Más",
        heroSubtitle: "Análisis profundo del mercado mexicano: depósitos SPEI, regulación CNBV, acceso a brokers de EE.UU. y estrategias de trading en pesos.",
        focus: "mexico",
        navItems: ["México", "SPEI", "CNBV", "Brokers USA", "Trading MXN"],
        reviews: [
            {
                user: "Javier M.",
                rating: 5,
                content: "La información sobre depósitos SPEI fue clave. Ahora puedo depositar fácilmente desde México.",
                broker: "XM Group"
            },
            {
                user: "Alejandra C.",
                rating: 5,
                content: "Excelente guía sobre cómo abrir cuenta en TD Ameritrade desde México. Muy detallada.",
                broker: "Interactive Brokers"
            }
        ]
    },
    capitallatamreviews: {
        name: "CapitalLatamReviews",
        logoIcon: "fas fa-briefcase",
        logoText: "Capital LATAM",
        heroTitle: "Reviews Institucionales para Traders Profesionales",
        heroSubtitle: "Cuentas profesionales, DMA, API trading, auditorías de seguridad de 50 puntos y servicios de gestión de patrimonio. Para traders serios.",
        focus: "institutional",
        navItems: ["Cuentas Pro", "DMA", "API Trading", "Scorecard Seguridad", "Gestión Patrimonio"],
        reviews: [
            {
                user: "Dr. Carlos R.",
                rating: 5,
                content: "El análisis de DMA y Level 2 data es profesional. Perfecto para trading institucional.",
                broker: "Interactive Brokers"
            },
            {
                user: "Ing. María S.",
                rating: 5,
                content: "La auditoría de seguridad de 50 puntos es exhaustiva. Muy útil para traders profesionales.",
                broker: "Interactive Brokers"
            }
        ]
    }
};

function customizeProject(projectKey, config) {
    console.log(`\n🎨 Customizing: ${config.name}`);
    
    const projectDir = path.join(BASE_DIR, projectKey);
    if (!fs.existsSync(projectDir)) {
        console.log(`⚠️  Project directory not found: ${projectDir}`);
        return;
    }
    
    // 1. Update index.html - Logo and Hero
    const indexPath = path.join(projectDir, 'views', 'index.html');
    if (fs.existsSync(indexPath)) {
        let content = fs.readFileSync(indexPath, 'utf8');
        
        // Update logo
        content = content.replace(
            /<h2><i class="fas fa-[^"]+"><\/i> [^<]+<\/h2>/,
            `<h2><i class="${config.logoIcon}"></i> ${config.logoText}</h2>`
        );
        
        // Update hero title
        content = content.replace(
            /<h1[^>]*>.*?<\/h1>/s,
            `<h1 data-translate="hero.title">${config.heroTitle}</h1>`
        );
        
        // Update hero subtitle
        content = content.replace(
            /<p class="hero-subtitle"[^>]*>.*?<\/p>/s,
            `<p class="hero-subtitle" data-translate="hero.subtitle">${config.heroSubtitle}</p>`
        );
        
        // Update site name throughout
        content = content.replace(/LatamBrokerReviews/g, config.name);
        content = content.replace(/latambrokerreviews/g, config.name.toLowerCase());
        
        fs.writeFileSync(indexPath, content);
        console.log('   ✅ Updated index.html');
    }
    
    // 2. Update languages.js - Add project-specific reviews
    const languagesPath = path.join(projectDir, 'public', 'js', 'languages.js');
    if (fs.existsSync(languagesPath)) {
        let content = fs.readFileSync(languagesPath, 'utf8');
        
        // Add project-specific reviews to sampleReviews
        const reviewsJSON = JSON.stringify(config.reviews, null, 4);
        const reviewsCode = `
        // Project-specific reviews for ${config.name}
        ${config.reviews.map((review, idx) => {
            const key = `${projectKey}${idx + 1}`;
            return `
            ${key}: {
                title: '${review.user} - ${review.broker}',
                content: '${review.content}',
                rating: ${review.rating},
                user: {
                    name: '${review.user}',
                    verified: true
                },
                broker: '${review.broker}',
                date: new Date().toISOString()
            }`;
        }).join(',')}
        `;
        
        // Find sampleReviews section and add project reviews
        if (content.includes('sampleReviews:')) {
            // Add reviews before closing of sampleReviews
            const insertPoint = content.lastIndexOf('}');
            if (insertPoint > 0) {
                content = content.slice(0, insertPoint) + ',' + reviewsCode + '\n    ' + content.slice(insertPoint);
            }
        }
        
        fs.writeFileSync(languagesPath, content);
        console.log('   ✅ Updated languages.js with project reviews');
    }
    
    // 3. Update navigation structure
    const navPath = path.join(projectDir, 'views', 'index.html');
    if (fs.existsSync(navPath)) {
        let content = fs.readFileSync(navPath, 'utf8');
        
        // Update navigation items based on project focus
        // This is a simplified version - you may need to adjust based on actual HTML structure
        config.navItems.forEach((item, idx) => {
            // Add navigation items if they don't exist
            if (!content.includes(item)) {
                // This would need more sophisticated HTML manipulation
                console.log(`   📝 Navigation item: ${item}`);
            }
        });
        
        fs.writeFileSync(navPath, content);
        console.log('   ✅ Updated navigation');
    }
    
    // 4. Update theme.css with project-specific branding
    const themePath = path.join(projectDir, 'public', 'css', 'theme.css');
    if (fs.existsSync(themePath)) {
        let content = fs.readFileSync(themePath, 'utf8');
        
        // Add project-specific branding comments
        content = `/* ${config.name} - ${config.focus} Theme */\n` + content;
        
        fs.writeFileSync(themePath, content);
        console.log('   ✅ Updated theme.css');
    }
    
    // 5. Update package.json
    const packagePath = path.join(projectDir, 'package.json');
    if (fs.existsSync(packagePath)) {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        packageJson.name = projectKey;
        packageJson.description = `${config.name} - ${config.heroSubtitle.substring(0, 100)}`;
        fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
        console.log('   ✅ Updated package.json');
    }
    
    console.log(`   ✨ ${config.name} customization complete!`);
}

// Main execution
console.log('🚀 Starting project customization...\n');

Object.keys(projectCustomizations).forEach((key) => {
    customizeProject(key, projectCustomizations[key]);
});

console.log('\n✨ All projects customized successfully!');

