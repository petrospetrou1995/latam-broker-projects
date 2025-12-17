const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname);

function enhanceLanguageSwitcher(projectKey) {
    console.log(`\n🌐 Enhancing language switcher: ${projectKey}`);
    
    const projectDir = path.join(BASE_DIR, projectKey);
    const switcherPath = path.join(projectDir, 'public', 'js', 'language-switcher.js');
    
    if (!fs.existsSync(switcherPath)) {
        console.log(`⚠️  Language switcher not found`);
        return;
    }
    
    let content = fs.readFileSync(switcherPath, 'utf8');
    
    // Add enhanced navigation translation function
    const enhancedNavTranslation = `
    // Enhanced navigation translation function
    function translateNavigationItems(lang) {
        if (typeof languages === 'undefined' || !languages[lang]) return;
        
        const langData = languages[lang];
        const customNav = langData.customNav || {};
        
        // Translate navigation links (including those with icons)
        document.querySelectorAll('.nav-link').forEach(link => {
            const icon = link.querySelector('i');
            const textNode = Array.from(link.childNodes).find(node => 
                node.nodeType === Node.TEXT_NODE && node.textContent.trim()
            );
            
            if (textNode) {
                const originalText = textNode.textContent.trim();
                if (customNav[originalText]) {
                    const newText = customNav[originalText];
                    if (icon) {
                        link.innerHTML = icon.outerHTML + ' ' + newText;
                    } else {
                        textNode.textContent = ' ' + newText;
                    }
                }
            } else {
                // Handle links where text is directly in the link
                const fullText = link.textContent.trim();
                const iconMatch = fullText.match(/^(.+?)\\s+(.+)$/);
                if (iconMatch) {
                    const iconText = iconMatch[1];
                    const text = iconMatch[2];
                    if (customNav[text]) {
                        if (icon) {
                            link.innerHTML = icon.outerHTML + ' ' + customNav[text];
                        }
                    }
                } else if (customNav[fullText]) {
                    if (icon) {
                        link.innerHTML = icon.outerHTML + ' ' + customNav[fullText];
                    } else {
                        link.textContent = customNav[fullText];
                    }
                }
            }
        });
        
        // Translate dropdown items
        document.querySelectorAll('.dropdown-item').forEach(item => {
            const text = item.textContent.trim();
            if (customNav[text]) {
                item.textContent = customNav[text];
            }
        });
        
        // Translate dropdown toggle text
        document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
            const icon = toggle.querySelector('i');
            const textNodes = Array.from(toggle.childNodes).filter(node => 
                node.nodeType === Node.TEXT_NODE && node.textContent.trim()
            );
            
            textNodes.forEach(textNode => {
                const text = textNode.textContent.trim();
                if (customNav[text]) {
                    if (icon) {
                        toggle.innerHTML = icon.outerHTML + ' ' + customNav[text];
                    } else {
                        textNode.textContent = ' ' + customNav[text];
                    }
                }
            });
        });
    }
    
    // Call translateNavigationItems when language changes
    const originalSwitchLanguage = window.switchLanguage || function(lang) {
        localStorage.setItem('language', lang);
        if (typeof applyTranslations === 'function') {
            applyTranslations(lang);
        }
        translateNavigationItems(lang);
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));
    };
    
    // Override switchLanguage if it exists
    if (typeof switchLanguage !== 'undefined') {
        const originalFn = switchLanguage;
        window.switchLanguage = function(lang) {
            originalFn(lang);
            setTimeout(() => translateNavigationItems(lang), 100);
        };
    }
    
    // Listen for language change events
    window.addEventListener('languageChanged', function(event) {
        setTimeout(() => translateNavigationItems(event.detail.language), 100);
    });
    
    // Initial translation on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            const lang = localStorage.getItem('language') || 'en';
            setTimeout(() => translateNavigationItems(lang), 500);
        });
    } else {
        const lang = localStorage.getItem('language') || 'en';
        setTimeout(() => translateNavigationItems(lang), 500);
    }
`;
    
    // Check if enhancement already exists
    if (!content.includes('translateNavigationItems')) {
        // Add before the closing of the function
        content = content.replace(
            /(\/\/ Language switching functionality[\s\S]*?)(\}\);)/,
            `$1${enhancedNavTranslation}\n$2`
        );
        
        fs.writeFileSync(switcherPath, content);
        console.log(`   ✅ Enhanced language switcher`);
    } else {
        console.log(`   ℹ️  Language switcher already enhanced`);
    }
}

// Update all projects
console.log('🚀 Enhancing language switchers for all projects...\n');

const projects = [
    'rankingbrokerslatam',
    'inversionistadigital',
    'zonatradinglatam',
    'brokersconfiables',
    'rutadetrading',
    'comparativaforex',
    'plataformasdeinversion',
    'guiadebrokerssudamerica',
    'topbrokersmexicoymas',
    'capitallatamreviews'
];

projects.forEach(projectKey => {
    enhanceLanguageSwitcher(projectKey);
});

console.log('\n✨ Language switchers enhanced successfully!');

