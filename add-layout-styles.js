const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname);

// Layout-specific CSS for each project
const layoutStyles = {
    'leaderboard-grid': `
/* Leaderboard Grid Layout - RankingBrokersLatam */
.layout-leaderboard-grid .brokers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.layout-leaderboard-grid .broker-card {
    border-left: 4px solid var(--primary-color);
    position: relative;
}

.layout-leaderboard-grid .broker-card::before {
    content: attr(data-rank);
    position: absolute;
    top: -10px;
    left: -10px;
    background: var(--primary-color);
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
}

.layout-leaderboard-grid .nav-menu {
    display: flex;
    gap: 15px;
}

.layout-leaderboard-grid .nav-link {
    padding: 10px 15px;
    border-radius: 8px;
    transition: all 0.3s;
}

.layout-leaderboard-grid .nav-link:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}
`,

    'modern-card': `
/* Modern Card Layout - InversionistaDigital */
.layout-modern-card .brokers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
}

.layout-modern-card .broker-card {
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
}

.layout-modern-card .broker-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.layout-modern-card .nav-menu {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.layout-modern-card .nav-link {
    padding: 12px 20px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
}
`,

    'speed-focused': `
/* Speed Focused Layout - ZonaTradingLatam */
.layout-speed-focused .brokers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 15px;
}

.layout-speed-focused .broker-card {
    border: 2px solid transparent;
    background: linear-gradient(135deg, var(--card-background) 0%, rgba(0, 212, 255, 0.05) 100%);
    transition: all 0.2s;
}

.layout-speed-focused .broker-card:hover {
    border-color: var(--primary-color);
    transform: scale(1.02);
}

.layout-speed-focused .nav-menu {
    display: flex;
    gap: 8px;
}

.layout-speed-focused .nav-link {
    padding: 8px 12px;
    font-size: 0.9rem;
    border-bottom: 2px solid transparent;
}

.layout-speed-focused .nav-link:hover {
    border-bottom-color: var(--primary-color);
}
`,

    'trust-badges': `
/* Trust Badges Layout - BrokersConfiables */
.layout-trust-badges .brokers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.layout-trust-badges .broker-card {
    border: 2px solid var(--secondary-color);
    border-radius: 12px;
    position: relative;
    padding-top: 50px;
}

.layout-trust-badges .broker-card::before {
    content: "✓ Verificado";
    position: absolute;
    top: 15px;
    right: 15px;
    background: var(--secondary-color);
    color: white;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: bold;
}

.layout-trust-badges .nav-menu {
    display: flex;
    gap: 12px;
}

.layout-trust-badges .nav-link {
    padding: 10px 16px;
    border-radius: 6px;
    background: rgba(46, 125, 50, 0.1);
}
`,

    'step-by-step': `
/* Step by Step Layout - RutaDeTrading */
.layout-step-by-step .brokers-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.layout-step-by-step .broker-card {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px;
    border-left: 5px solid var(--primary-color);
    counter-increment: step-counter;
    position: relative;
}

.layout-step-by-step .brokers-grid {
    counter-reset: step-counter;
}

.layout-step-by-step .broker-card::before {
    content: counter(step-counter);
    position: absolute;
    left: -25px;
    background: var(--primary-color);
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

.layout-step-by-step .nav-menu {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
}

.layout-step-by-step .nav-link {
    padding: 10px 18px;
    border-radius: 8px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
}
`,

    'forex-comparison': `
/* Forex Comparison Layout - ComparativaForex */
.layout-forex-comparison .brokers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 25px;
}

.layout-forex-comparison .broker-card {
    border: 1px solid rgba(21, 101, 192, 0.2);
    border-radius: 8px;
    background: linear-gradient(to bottom, white 0%, rgba(21, 101, 192, 0.02) 100%);
}

.layout-forex-comparison .broker-card:hover {
    border-color: var(--primary-color);
    box-shadow: 0 4px 15px rgba(21, 101, 192, 0.2);
}

.layout-forex-comparison .nav-menu {
    display: flex;
    gap: 10px;
}

.layout-forex-comparison .nav-link {
    padding: 10px 15px;
    border-radius: 6px;
    border: 1px solid rgba(21, 101, 192, 0.3);
}
`,

    'multi-asset': `
/* Multi Asset Layout - PlataformasDeInversion */
.layout-multi-asset .brokers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
}

.layout-multi-asset .broker-card {
    border-radius: 20px;
    padding: 25px;
    background: linear-gradient(135deg, var(--card-background) 0%, rgba(123, 31, 162, 0.05) 100%);
    position: relative;
    overflow: hidden;
}

.layout-multi-asset .broker-card::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(123, 31, 162, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    transform: translate(30%, -30%);
}

.layout-multi-asset .nav-menu {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.layout-multi-asset .nav-link {
    padding: 12px 20px;
    border-radius: 10px;
    background: rgba(123, 31, 162, 0.1);
}
`,

    'regional-focus': `
/* Regional Focus Layout - GuiadeBrokersSudamerica */
.layout-regional-focus .brokers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.layout-regional-focus .broker-card {
    border: 2px solid var(--accent-color);
    border-radius: 12px;
    background: var(--card-background);
    position: relative;
}

.layout-regional-focus .broker-card::before {
    content: "🇦🇷 🇺🇾 🇵🇾";
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 1.5rem;
}

.layout-regional-focus .nav-menu {
    display: flex;
    gap: 10px;
}

.layout-regional-focus .nav-link {
    padding: 10px 16px;
    border-radius: 8px;
    background: rgba(198, 40, 40, 0.1);
    border: 1px solid rgba(198, 40, 40, 0.3);
}
`,

    'mexico-focused': `
/* Mexico Focused Layout - TopBrokersMexicoYMas */
.layout-mexico-focused .brokers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.layout-mexico-focused .broker-card {
    border: 3px solid;
    border-image: linear-gradient(135deg, #006847 0%, #CE1126 100%) 1;
    border-radius: 12px;
    position: relative;
}

.layout-mexico-focused .broker-card::before {
    content: "🇲🇽";
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 2rem;
}

.layout-mexico-focused .nav-menu {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.layout-mexico-focused .nav-link {
    padding: 10px 18px;
    border-radius: 8px;
    background: linear-gradient(135deg, #006847 0%, #CE1126 100%);
    color: white;
}
`,

    'professional': `
/* Professional Layout - CapitalLatamReviews */
.layout-professional .brokers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 25px;
}

.layout-professional .broker-card {
    border: 1px solid rgba(26, 35, 126, 0.2);
    border-radius: 8px;
    background: var(--card-background);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s;
}

.layout-professional .broker-card:hover {
    box-shadow: 0 8px 24px rgba(26, 35, 126, 0.15);
    border-color: var(--primary-color);
}

.layout-professional .nav-menu {
    display: flex;
    gap: 8px;
}

.layout-professional .nav-link {
    padding: 10px 16px;
    border-radius: 6px;
    font-weight: 500;
    border: 1px solid rgba(26, 35, 126, 0.2);
    background: rgba(26, 35, 126, 0.05);
}
`
};

function addLayoutStyles(projectKey, layoutClass) {
    console.log(`\n🎨 Adding layout styles: ${projectKey} - ${layoutClass}`);
    
    const projectDir = path.join(BASE_DIR, projectKey);
    const themePath = path.join(projectDir, 'public', 'css', 'theme.css');
    
    if (!fs.existsSync(themePath)) {
        console.log(`⚠️  Theme file not found`);
        return;
    }
    
    let content = fs.readFileSync(themePath, 'utf8');
    
    // Add layout-specific styles if they don't exist
    if (!content.includes(`.layout-${layoutClass}`)) {
        const styles = layoutStyles[layoutClass] || '';
        content += '\n\n' + styles;
        fs.writeFileSync(themePath, content);
        console.log(`   ✅ Added layout styles for ${layoutClass}`);
    } else {
        console.log(`   ℹ️  Layout styles already exist`);
    }
}

// Add styles to all projects
console.log('🚀 Adding layout-specific styles...\n');

const projectLayouts = {
    rankingbrokerslatam: 'leaderboard-grid',
    inversionistadigital: 'modern-card',
    zonatradinglatam: 'speed-focused',
    brokersconfiables: 'trust-badges',
    rutadetrading: 'step-by-step',
    comparativaforex: 'forex-comparison',
    plataformasdeinversion: 'multi-asset',
    guiadebrokerssudamerica: 'regional-focus',
    topbrokersmexicoymas: 'mexico-focused',
    capitallatamreviews: 'professional'
};

Object.keys(projectLayouts).forEach((key) => {
    addLayoutStyles(key, projectLayouts[key]);
});

console.log('\n✨ Layout styles added successfully!');

