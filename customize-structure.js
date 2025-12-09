const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname);

// Enhanced project configurations with structure changes
const projectConfigs = {
    rankingbrokerslatam: {
        heroClass: "hero-leaderboard",
        featuredSectionTitle: "Top 10 Brokers del Mes",
        featuredSectionSubtitle: "Ranking actualizado mensualmente basado en spreads, regulación y reseñas de usuarios",
        structure: "leaderboard"
    },
    inversionistadigital: {
        heroClass: "hero-modern",
        featuredSectionTitle: "Plataformas de Inversión Digital",
        featuredSectionSubtitle: "Brokers que te permiten invertir en acciones de EE.UU., crypto y más desde LATAM",
        structure: "modern-grid"
    },
    zonatradinglatam: {
        heroClass: "hero-active",
        featuredSectionTitle: "Brokers para Trading Activo",
        featuredSectionSubtitle: "Enfocados en velocidad de ejecución, spreads ajustados y herramientas para day trading",
        structure: "speed-focused"
    },
    brokersconfiables: {
        heroClass: "hero-trust",
        featuredSectionTitle: "Brokers Verificados y Seguros",
        featuredSectionSubtitle: "Todos los brokers han sido auditados por seguridad, regulación y protección de fondos",
        structure: "trust-badges"
    },
    rutadetrading: {
        heroClass: "hero-education",
        featuredSectionTitle: "Comienza Tu Ruta de Trading",
        featuredSectionSubtitle: "Brokers ideales para principiantes con cuentas demo, educación y soporte en español",
        structure: "step-by-step"
    },
    comparativaforex: {
        heroClass: "hero-forex",
        featuredSectionTitle: "Especialistas en Forex",
        featuredSectionSubtitle: "Comparativa detallada de spreads, apalancamiento y condiciones para trading de divisas",
        structure: "forex-comparison"
    },
    plataformasdeinversion: {
        heroClass: "hero-investment",
        featuredSectionTitle: "Plataformas Multi-Activo",
        featuredSectionSubtitle: "Brokers que ofrecen acciones, crypto, forex y más en una sola plataforma",
        structure: "multi-asset"
    },
    guiadebrokerssudamerica: {
        heroClass: "hero-regional",
        featuredSectionTitle: "Brokers para Sudamérica",
        featuredSectionSubtitle: "Especializados en Argentina, Uruguay, Paraguay y métodos de pago locales",
        structure: "regional-focus"
    },
    topbrokersmexicoymas: {
        heroClass: "hero-mexico",
        featuredSectionTitle: "Top Brokers México",
        featuredSectionSubtitle: "Brokers optimizados para el mercado mexicano con depósitos SPEI y regulación CNBV",
        structure: "mexico-focused"
    },
    capitallatamreviews: {
        heroClass: "hero-professional",
        featuredSectionTitle: "Brokers para Traders Profesionales",
        featuredSectionSubtitle: "Cuentas institucionales, DMA, API trading y herramientas avanzadas",
        structure: "professional"
    }
};

function updateProjectStructure(projectKey, config) {
    console.log(`\n🏗️  Updating structure: ${projectKey}`);
    
    const projectDir = path.join(BASE_DIR, projectKey);
    const indexPath = path.join(projectDir, 'views', 'index.html');
    
    if (!fs.existsSync(indexPath)) {
        console.log(`⚠️  Index file not found: ${indexPath}`);
        return;
    }
    
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Update hero section class
    content = content.replace(
        /class="hero[^"]*"/,
        `class="hero ${config.heroClass}"`
    );
    
    // Update featured brokers section title
    content = content.replace(
        /<h2[^>]*>.*?Brokers Destacados.*?<\/h2>/i,
        `<h2 data-translate="brokers.title">${config.featuredSectionTitle}</h2>`
    );
    
    // Update featured brokers section subtitle
    content = content.replace(
        /<p[^>]*class="[^"]*subtitle[^"]*"[^>]*>.*?<\/p>/i,
        `<p class="section-subtitle" data-translate="brokers.subtitle">${config.featuredSectionSubtitle}</p>`
    );
    
    // Add structure-specific CSS class to featured section
    const featuredSectionPattern = /(<section[^>]*id="featured-brokers"[^>]*class="[^"]*)/;
    if (featuredSectionPattern.test(content)) {
        content = content.replace(
            featuredSectionPattern,
            `$1 structure-${config.structure}`
        );
    }
    
    fs.writeFileSync(indexPath, content);
    console.log(`   ✅ Updated structure for ${projectKey}`);
}

// Update all projects
console.log('🚀 Updating project structures...\n');

Object.keys(projectConfigs).forEach((key) => {
    updateProjectStructure(key, projectConfigs[key]);
});

console.log('\n✨ Structure updates complete!');

