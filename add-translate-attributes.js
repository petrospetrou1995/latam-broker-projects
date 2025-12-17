const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname);

// Update navigation generation to include data-translate attributes
function updateNavigationWithTranslations() {
    console.log('🔄 Updating navigation HTML with data-translate attributes...\n');
    
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
        console.log(`📝 Updating: ${projectKey}`);
        
        const projectDir = path.join(BASE_DIR, projectKey);
        const viewsDir = path.join(projectDir, 'views');
        
        if (!fs.existsSync(viewsDir)) {
            console.log(`   ⚠️  Views directory not found`);
            return;
        }
        
        const files = fs.readdirSync(viewsDir);
        const htmlFiles = files.filter(f => f.endsWith('.html'));
        
        let updatedCount = 0;
        
        htmlFiles.forEach(file => {
            const filePath = path.join(viewsDir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            let modified = false;
            
            // Add data-translate to nav links
            // Pattern: <a href="..." class="nav-link">Text</a>
            content = content.replace(
                /<a href="([^"]*)" class="nav-link">([^<]*)<\/a>/g,
                (match, href, text) => {
                    const cleanText = text.trim();
                    if (cleanText && !match.includes('data-translate')) {
                        modified = true;
                        return `<a href="${href}" class="nav-link" data-translate="nav.${cleanText.toLowerCase().replace(/\s+/g, '')}">${cleanText}</a>`;
                    }
                    return match;
                }
            );
            
            // Add data-translate to dropdown items
            // Pattern: <a href="..." class="dropdown-item">Text</a>
            content = content.replace(
                /<a href="([^"]*)" class="dropdown-item">([^<]*)<\/a>/g,
                (match, href, text) => {
                    const cleanText = text.trim();
                    if (cleanText && !match.includes('data-translate')) {
                        modified = true;
                        return `<a href="${href}" class="dropdown-item" data-translate="nav.${cleanText.toLowerCase().replace(/\s+/g, '')}">${cleanText}</a>`;
                    }
                    return match;
                }
            );
            
            // Add data-translate to nav links with icons
            // Pattern: <a href="..." class="nav-link"><i class="..."></i> Text</a>
            content = content.replace(
                /<a href="([^"]*)" class="nav-link">\s*<i class="([^"]*)"><\/i>\s*([^<]*)<\/a>/g,
                (match, href, iconClass, text) => {
                    const cleanText = text.trim();
                    if (cleanText && !match.includes('data-translate')) {
                        modified = true;
                        return `<a href="${href}" class="nav-link" data-translate="nav.${cleanText.toLowerCase().replace(/\s+/g, '')}"><i class="${iconClass}"></i> ${cleanText}</a>`;
                    }
                    return match;
                }
            );
            
            // Add data-translate to dropdown toggle
            content = content.replace(
                /<a href="([^"]*)" class="nav-link dropdown-toggle">\s*<i class="([^"]*)"><\/i>\s*([^<]*)<\/a>/g,
                (match, href, iconClass, text) => {
                    const cleanText = text.trim();
                    if (cleanText && !match.includes('data-translate')) {
                        modified = true;
                        return `<a href="${href}" class="nav-link dropdown-toggle" data-translate="nav.${cleanText.toLowerCase().replace(/\s+/g, '')}"><i class="${iconClass}"></i> ${cleanText}</a>`;
                    }
                    return match;
                }
            );
            
            if (modified) {
                fs.writeFileSync(filePath, content);
                updatedCount++;
            }
        });
        
        console.log(`   ✅ Updated ${updatedCount} files`);
    });
    
    console.log('\n✨ Navigation translation attributes added!');
}

updateNavigationWithTranslations();

