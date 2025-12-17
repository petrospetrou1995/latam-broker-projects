// Language switching functionality - CSP compliant
(function() {
    'use strict';
    
    // Immediately hide dropdown on page load (before DOM ready)
    (function hideDropdownImmediately() {
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
            dropdown.style.display = 'none';
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
            dropdown.style.pointerEvents = 'none';
        }
    })();
    
    // Language switching functions
    function toggleLanguageDropdown() {
        const dropdown = document.getElementById('languageDropdown');
        console.log('toggleLanguageDropdown called, dropdown found:', !!dropdown);
        if (dropdown) {
            const isVisible = dropdown.classList.contains('show');
            console.log('Current dropdown visible:', isVisible);
            
            if (isVisible) {
                // Hide dropdown
                dropdown.classList.remove('show');
                dropdown.style.setProperty('display', 'none', 'important');
                dropdown.style.setProperty('opacity', '0', 'important');
                dropdown.style.setProperty('visibility', 'hidden', 'important');
                dropdown.style.setProperty('pointer-events', 'none', 'important');
                console.log('Dropdown hidden');
            } else {
                // Show dropdown
                dropdown.classList.add('show');
                dropdown.style.setProperty('display', 'block', 'important');
                dropdown.style.setProperty('opacity', '1', 'important');
                dropdown.style.setProperty('visibility', 'visible', 'important');
                dropdown.style.setProperty('z-index', '10000', 'important');
                dropdown.style.setProperty('pointer-events', 'auto', 'important');
                console.log('Dropdown shown with forced styles');
            }
        } else {
            console.error('Language dropdown not found!');
        }
    }
    
    function switchLanguage(lang) {
        console.log('Switching to language:', lang);
        
        // Store language preference
        localStorage.setItem('language', lang);
        
        // Update current language display
        const currentLangSpan = document.getElementById('currentLanguage');
        if (currentLangSpan) {
            currentLangSpan.textContent = lang === 'en' ? '🇺🇸 English' : '🇲🇽 Español';
        }
        
        // Close dropdown
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
            dropdown.style.setProperty('display', 'none', 'important');
            dropdown.style.setProperty('opacity', '0', 'important');
            dropdown.style.setProperty('visibility', 'hidden', 'important');
            dropdown.style.setProperty('pointer-events', 'none', 'important');
        }
        
        // Apply translations immediately
        applyTranslations(lang);
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
        // Update page title
        updatePageTitle(lang);
        
        // Update structured data (JSON-LD)
        updateStructuredData(lang);
        
        // Update reviews if reviews manager is available
        if (window.reviewsManager) {
            window.reviewsManager.updateLanguage(lang);
        }
        
        // Dispatch language change event for other components
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));
    }
    
    function applyTranslations(lang) {
        // If no language provided, get from localStorage or default to 'en'
        if (!lang) {
            lang = localStorage.getItem('language') || 'en';
        }
        
        console.log('Attempting to apply translations for:', lang);
        console.log('Languages object available:', typeof languages !== 'undefined');
        
        // Check if languages object is available
        if (typeof languages === 'undefined') {
            console.log('Languages object not found, waiting...');
            setTimeout(() => {
                console.log('Retrying after timeout, languages available:', typeof languages !== 'undefined');
                if (typeof languages !== 'undefined') {
                    applyTranslations(lang);
                } else {
                    console.error('Languages object still not available after timeout');
                    // Try multiple times
                    let attempts = 0;
                    const maxAttempts = 10;
                    const checkLanguages = setInterval(() => {
                        attempts++;
                        if (typeof languages !== 'undefined') {
                            clearInterval(checkLanguages);
                            applyTranslations(lang);
                        } else if (attempts >= maxAttempts) {
                            clearInterval(checkLanguages);
                            console.error('Languages object not available after multiple attempts');
                        }
                    }, 100);
                }
            }, 200);
            return;
        }
        
        const translations = languages[lang];
        if (!translations) {
            console.error('No translations found for language:', lang);
            return;
        }
        
        console.log('Applying translations for:', lang);
        console.log('Available translations:', Object.keys(translations));
        
        let translatedCount = 0;
        let missingTranslations = [];
        
        // Update all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const value = getNestedValue(translations, key);
            
            if (value !== undefined) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = value;
                } else if (element.tagName === 'TEXTAREA') {
                    element.placeholder = value;
                } else if (element.tagName === 'TITLE') {
                    element.textContent = value;
                } else if (element.tagName === 'META') {
                    // Handle meta tags (description, og:title, og:description, etc.)
                    const property = element.getAttribute('property');
                    const name = element.getAttribute('name');
                    if (property) {
                        element.setAttribute('content', value);
                    } else if (name) {
                        element.setAttribute('content', value);
                    }
                } else {
                    // For elements that might contain HTML (like icons), preserve structure
                    if (element.children.length > 0) {
                        // Check if element contains icon or other HTML elements
                        const hasIcon = element.querySelector('i, svg, img');
                        if (hasIcon) {
                            // Preserve icon and update only text content
                            // Find all text nodes
                            const allNodes = Array.from(element.childNodes);
                            const textNodes = allNodes.filter(node => node.nodeType === Node.TEXT_NODE);
                            
                            // Remove all text nodes (they will be replaced)
                            textNodes.forEach(node => node.remove());
                            
                            // Find the first element child (icon)
                            const firstElement = element.firstElementChild;
                            if (firstElement) {
                                // Insert text node after the icon with a space
                                const textNode = document.createTextNode(' ' + value);
                                if (firstElement.nextSibling) {
                                    element.insertBefore(textNode, firstElement.nextSibling);
                                } else {
                                    element.appendChild(textNode);
                                }
                            } else {
                                // Fallback: prepend text
                                element.insertBefore(document.createTextNode(value + ' '), element.firstChild);
                            }
                        } else {
                            // If element has children but no icons, update text nodes
                            const textNodes = Array.from(element.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
                            if (textNodes.length > 0) {
                                // Update the first non-whitespace text node
                                const nonWhitespaceNode = textNodes.find(node => node.textContent.trim().length > 0);
                                if (nonWhitespaceNode) {
                                    nonWhitespaceNode.textContent = value;
                                } else {
                                    textNodes[0].textContent = value;
                                }
                            } else {
                                element.textContent = value;
                            }
                        }
                    } else {
                        element.textContent = value;
                    }
                }
                translatedCount++;
            } else {
                missingTranslations.push(key);
                console.log('No translation found for key:', key);
            }
        });
        
        // Specifically handle dropdown menu items that might be hidden
        const dropdownItems = document.querySelectorAll('.dropdown-item[data-translate]');
        dropdownItems.forEach(element => {
            const key = element.getAttribute('data-translate');
            const value = getNestedValue(translations, key);
            
            if (value !== undefined) {
                element.textContent = value;
                translatedCount++;
            } else {
                missingTranslations.push(key);
                console.log('No translation found for dropdown key:', key);
            }
        });
        
        console.log(`Translated ${translatedCount} elements`);
        if (missingTranslations.length > 0) {
            console.warn('Missing translations for keys:', missingTranslations);
        }
    }
    
    function getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }
    
    function updatePageTitle(lang) {
        const titleElement = document.querySelector('title[data-translate]');
        if (titleElement) {
            const key = titleElement.getAttribute('data-translate');
            const translations = languages[lang];
            if (translations) {
                const value = getNestedValue(translations, key);
                if (value !== undefined) {
                    titleElement.textContent = value;
                }
            }
        } else {
            // Fallback for pages without data-translate on title
            const titleElementFallback = document.querySelector('title');
            if (titleElementFallback) {
                if (lang === 'es') {
                    titleElementFallback.textContent = 'BrokersConfiables - Reseñas de Brokers en América Latina';
                } else {
                    titleElementFallback.textContent = 'BrokersConfiables - Latin America Broker Reviews';
                }
            }
        }
    }
    
    function updateStructuredData(lang) {
        const structuredDataScript = document.getElementById('blog-structured-data');
        if (structuredDataScript && typeof languages !== 'undefined') {
            const translations = languages[lang];
            if (translations && translations.blog) {
                try {
                    const structuredData = JSON.parse(structuredDataScript.textContent);
                    structuredData.description = translations.blog.hero.subtitle || translations.blog.pageDescription;
                    structuredDataScript.textContent = JSON.stringify(structuredData);
                } catch (e) {
                    console.error('Error updating structured data:', e);
                }
            }
        }
    }
    
    // Initialize when DOM is ready
    function initializeLanguageSwitcher() {
        console.log('Initializing language switcher...');
        
        // Check if language button exists
        const languageBtn = document.getElementById('languageBtn');
        console.log('Language button found for initialization:', !!languageBtn);
        
        // Initialize language display
        const savedLang = localStorage.getItem('language') || 'en';
        const currentLangSpan = document.getElementById('currentLanguage');
        if (currentLangSpan) {
            currentLangSpan.textContent = savedLang === 'en' ? '🇺🇸 English' : '🇲🇽 Español';
        }
        console.log('Language initialized:', savedLang);
        
        // Apply translations on page load with multiple attempts
        const applyInitialTranslations = () => {
            console.log('Attempting to apply initial translations...');
            applyTranslations(savedLang);
            document.documentElement.lang = savedLang;
            updatePageTitle(savedLang);
            updateStructuredData(savedLang);
        };
        
        // Try immediately
        applyInitialTranslations();
        
        // Try again after a short delay
        setTimeout(applyInitialTranslations, 100);
        
        // Try again after a longer delay
        setTimeout(applyInitialTranslations, 500);
        
        // Try again after DOM is fully loaded
        setTimeout(applyInitialTranslations, 1000);
        
        // Ensure dropdown translations are applied after a longer delay
        setTimeout(() => {
            if (window.ensureDropdownTranslations) {
                window.ensureDropdownTranslations();
            }
        }, 1500);
        
        // Add event listener to language button
        const languageBtnElement = document.getElementById('languageBtn');
        console.log('Language button found:', !!languageBtnElement);
        if (languageBtnElement) {
            languageBtnElement.setAttribute('data-initialized', 'true');
            console.log('Adding click listener to language button');
            
            // Remove any existing event listeners first
            const newLanguageBtn = languageBtnElement.cloneNode(true);
            languageBtnElement.parentNode.replaceChild(newLanguageBtn, languageBtnElement);
            
            newLanguageBtn.addEventListener('click', function(e) {
                console.log('Language button clicked - event fired!');
                e.preventDefault();
                e.stopPropagation();
                toggleLanguageDropdown();
            });
            
            console.log('Click listener added successfully');
        } else {
            console.error('Language button not found!');
        }
        
        // Add event listeners to language options
        const languageOptions = document.querySelectorAll('.language-option');
        console.log('Language options found:', languageOptions.length);
        languageOptions.forEach((option, index) => {
            console.log(`Adding click listener to language option ${index}:`, option.textContent.trim());
            option.addEventListener('click', function(e) {
                console.log('Language option clicked:', this.textContent.trim());
                e.preventDefault();
                e.stopPropagation();
                const lang = this.getAttribute('data-lang');
                console.log('Language option lang:', lang);
                if (lang) {
                    switchLanguage(lang);
                }
            });
        });
        
        // Ensure dropdown starts hidden
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
            dropdown.style.setProperty('display', 'none', 'important');
            dropdown.style.setProperty('opacity', '0', 'important');
            dropdown.style.setProperty('visibility', 'hidden', 'important');
            dropdown.style.setProperty('pointer-events', 'none', 'important');
            console.log('Dropdown initialized as hidden');
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            const selector = document.querySelector('.language-selector');
            const dropdownEl = document.getElementById('languageDropdown');
            
            if (selector && dropdownEl && !selector.contains(e.target)) {
                dropdownEl.classList.remove('show');
                dropdownEl.style.setProperty('display', 'none', 'important');
                dropdownEl.style.setProperty('opacity', '0', 'important');
                dropdownEl.style.setProperty('visibility', 'hidden', 'important');
                dropdownEl.style.setProperty('pointer-events', 'none', 'important');
                console.log('Dropdown closed by outside click');
            }
        });
    }
    
    // Initialize when DOM is ready
    function init() {
        console.log('Language switcher: DOM ready, initializing...');
        
        // Ensure dropdown is hidden before initialization
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
            dropdown.style.setProperty('display', 'none', 'important');
            dropdown.style.setProperty('opacity', '0', 'important');
            dropdown.style.setProperty('visibility', 'hidden', 'important');
            dropdown.style.setProperty('pointer-events', 'none', 'important');
        }
        
        initializeLanguageSwitcher();
        
        // Double-check after a short delay to ensure it stays hidden
        setTimeout(() => {
            const dropdownCheck = document.getElementById('languageDropdown');
            if (dropdownCheck && dropdownCheck.classList.contains('show')) {
                console.log('Dropdown was visible, forcing it to hide');
                dropdownCheck.classList.remove('show');
                dropdownCheck.style.setProperty('display', 'none', 'important');
                dropdownCheck.style.setProperty('opacity', '0', 'important');
                dropdownCheck.style.setProperty('visibility', 'hidden', 'important');
                dropdownCheck.style.setProperty('pointer-events', 'none', 'important');
            }
        }, 500);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded, initialize immediately
        setTimeout(init, 100);
    }
    
    // Function to ensure dropdown menu translations are applied
    function ensureDropdownTranslations() {
        const currentLang = localStorage.getItem('language') || 'en';
        const translations = languages[currentLang];
        
        if (translations) {
            const dropdownItems = document.querySelectorAll('.dropdown-item[data-translate]');
            dropdownItems.forEach(element => {
                const key = element.getAttribute('data-translate');
                const value = getNestedValue(translations, key);
                
                if (value !== undefined) {
                    element.textContent = value;
                }
            });
        }
    }
    
    // Make functions globally available if needed
    window.toggleLanguageDropdown = toggleLanguageDropdown;
    window.switchLanguage = switchLanguage;
    window.initializeLanguageSwitcher = initializeLanguageSwitcher;
    window.applyTranslations = applyTranslations;
    window.ensureDropdownTranslations = ensureDropdownTranslations;
    
    console.log('Language switcher functions exposed to global scope');
    console.log('applyTranslations available:', typeof window.applyTranslations === 'function');
    
    // Test function for debugging
    window.testTranslation = function() {
        console.log('Testing translation system...');
        console.log('Languages available:', typeof languages !== 'undefined');
        console.log('Elements with data-translate:', document.querySelectorAll('[data-translate]').length);
        console.log('Language button exists:', !!document.getElementById('languageBtn'));
        console.log('Current language:', localStorage.getItem('language') || 'en');
        
        if (typeof languages !== 'undefined') {
            console.log('Available languages:', Object.keys(languages));
            console.log('English nav.home:', languages.en?.nav?.home);
            console.log('Spanish nav.home:', languages.es?.nav?.home);
        }
        
        // Try to apply translations manually
        const currentLang = localStorage.getItem('language') || 'en';
        console.log('Applying translations for:', currentLang);
        applyTranslations(currentLang);
    };
    
    // Test language dropdown functionality
    window.testLanguageDropdown = function() {
        console.log('Testing language dropdown functionality...');
        const testLanguageBtn = document.getElementById('languageBtn');
        const languageDropdown = document.getElementById('languageDropdown');
        
        if (!testLanguageBtn) {
            console.error('Language button not found!');
            return false;
        }
        
        if (!languageDropdown) {
            console.error('Language dropdown not found!');
            return false;
        }
        
        console.log('Language button found:', testLanguageBtn);
        console.log('Language dropdown found:', languageDropdown);
        console.log('Language button clickable:', testLanguageBtn.offsetParent !== null);
        
        // Test clicking the button
        console.log('Testing language button click...');
        testLanguageBtn.click();
        
        setTimeout(() => {
            const isVisible = languageDropdown.classList.contains('show') || languageDropdown.style.display === 'block';
            console.log('Dropdown visible after click:', isVisible);
            if (isVisible) {
                console.log('Language dropdown is working!');
            } else {
                console.error('Language dropdown not showing!');
                console.log('Dropdown classes:', languageDropdown.className);
                console.log('Dropdown styles:', {
                    display: languageDropdown.style.display,
                    opacity: languageDropdown.style.opacity,
                    visibility: languageDropdown.style.visibility,
                    zIndex: languageDropdown.style.zIndex
                });
            }
        }, 100);
        
        return true;
    };
    
    // Force show dropdown for testing
    window.forceShowDropdown = function() {
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) {
            dropdown.classList.add('show');
            dropdown.style.display = 'block';
            dropdown.style.setProperty('display', 'block', 'important');
            dropdown.style.setProperty('opacity', '1', 'important');
            dropdown.style.setProperty('visibility', 'visible', 'important');
            dropdown.style.setProperty('z-index', '10000', 'important');
            dropdown.style.setProperty('position', 'absolute', 'important');
            dropdown.style.setProperty('top', '100%', 'important');
            dropdown.style.setProperty('right', '0', 'important');
            dropdown.style.setProperty('background', '#fff', 'important');
            dropdown.style.setProperty('border', '1px solid #e1e5e9', 'important');
            dropdown.style.setProperty('border-radius', '8px', 'important');
            dropdown.style.setProperty('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.1)', 'important');
            dropdown.style.setProperty('min-width', '150px', 'important');
            dropdown.style.setProperty('margin-top', '5px', 'important');
            console.log('Forced dropdown to show with all styles');
            console.log('Dropdown element:', dropdown);
            console.log('Dropdown computed styles:', window.getComputedStyle(dropdown));
        } else {
            console.error('Dropdown not found for force show');
        }
    };
    
    // Simple click handler for testing
    window.addSimpleClickHandler = function() {
        const btn = document.getElementById('languageBtn');
        const dropdown = document.getElementById('languageDropdown');
        
        if (btn && dropdown) {
            console.log('Adding simple click handler');
            btn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Simple click handler fired');
                
                if (dropdown.style.display === 'none' || dropdown.style.display === '') {
                    dropdown.style.display = 'block';
                    dropdown.style.opacity = '1';
                    dropdown.style.visibility = 'visible';
                    dropdown.style.zIndex = '10000';
                    console.log('Dropdown shown via simple handler');
                } else {
                    dropdown.style.display = 'none';
                    console.log('Dropdown hidden via simple handler');
                }
            };
            console.log('Simple click handler added');
        } else {
            console.error('Button or dropdown not found for simple handler');
        }
    };
    
    // Check for CSS conflicts
    window.checkDropdownStyles = function() {
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) {
            const computed = window.getComputedStyle(dropdown);
            console.log('Dropdown computed styles:');
            console.log('display:', computed.display);
            console.log('opacity:', computed.opacity);
            console.log('visibility:', computed.visibility);
            console.log('z-index:', computed.zIndex);
            console.log('position:', computed.position);
            console.log('top:', computed.top);
            console.log('right:', computed.right);
            console.log('background:', computed.backgroundColor);
            console.log('border:', computed.border);
            console.log('box-shadow:', computed.boxShadow);
            console.log('width:', computed.width);
            console.log('height:', computed.height);
            console.log('margin:', computed.margin);
            console.log('padding:', computed.padding);
            
            // Check parent elements
            let parent = dropdown.parentElement;
            let level = 0;
            while (parent && level < 5) {
                const parentComputed = window.getComputedStyle(parent);
                console.log(`Parent level ${level}:`, {
                    tagName: parent.tagName,
                    className: parent.className,
                    id: parent.id,
                    display: parentComputed.display,
                    overflow: parentComputed.overflow,
                    position: parentComputed.position,
                    zIndex: parentComputed.zIndex
                });
                parent = parent.parentElement;
                level++;
            }
        } else {
            console.error('Dropdown not found for style check');
        }
    };
    
    // Force retranslation function
    window.forceRetranslation = function() {
        const currentLang = localStorage.getItem('language') || 'en';
        console.log('Force retranslating all elements for language:', currentLang);
        applyTranslations(currentLang);
    };
    
    // Debug function to check which elements are not translating
    window.debugTranslations = function() {
        const currentLang = localStorage.getItem('language') || 'en';
        const translations = languages[currentLang];
        
        if (!translations) {
            console.error('No translations found for language:', currentLang);
            return;
        }
        
        const elements = document.querySelectorAll('[data-translate]');
        const missing = [];
        const found = [];
        
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const value = getNestedValue(translations, key);
            
            if (value === undefined) {
                missing.push({ element, key });
            } else {
                found.push({ element, key, value });
            }
        });
        
        console.log(`Found ${found.length} translations, ${missing.length} missing`);
        console.log('Missing translations:', missing.map(m => m.key));
        console.log('Found translations:', found.map(f => f.key));
        
        return { found, missing };
    };
    
    // Multiple fallback initializations
    setTimeout(() => {
        const fallbackLanguageBtn = document.getElementById('languageBtn');
        if (fallbackLanguageBtn && !fallbackLanguageBtn.hasAttribute('data-initialized')) {
            console.log('Language switcher: Fallback initialization (1s)...');
            initializeLanguageSwitcher();
        }
    }, 1000);
    
    setTimeout(() => {
        const fallbackLanguageBtn2 = document.getElementById('languageBtn');
        if (fallbackLanguageBtn2 && !fallbackLanguageBtn2.hasAttribute('data-initialized')) {
            console.log('Language switcher: Fallback initialization (3s)...');
            initializeLanguageSwitcher();
        }
    }, 3000);
    
    // Force initialization on window load
    window.addEventListener('load', () => {
        const windowLoadLanguageBtn = document.getElementById('languageBtn');
        if (windowLoadLanguageBtn && !windowLoadLanguageBtn.hasAttribute('data-initialized')) {
            console.log('Language switcher: Window load initialization...');
            initializeLanguageSwitcher();
        } else {
            console.log('Language switcher: Button already initialized or not found');
        }
        
        // Run automatic test after 5 seconds
        setTimeout(() => {
            console.log('Running automatic translation test...');
            window.testTranslation();
        }, 5000);
        
        // Test language dropdown functionality
        setTimeout(() => {
            console.log('Testing language dropdown functionality...');
            const testLanguageBtn2 = document.getElementById('languageBtn');
            const languageDropdown = document.getElementById('languageDropdown');
            console.log('Language button exists:', !!testLanguageBtn2);
            console.log('Language dropdown exists:', !!languageDropdown);
            if (testLanguageBtn2) {
                console.log('Language button clickable:', testLanguageBtn2.offsetParent !== null);
            }
            
            // Add simple click handler as fallback
            if (typeof window.addSimpleClickHandler === 'function') {
                console.log('Adding simple click handler as fallback...');
                window.addSimpleClickHandler();
            }
            
            // Run the test function
            if (typeof window.testLanguageDropdown === 'function') {
                window.testLanguageDropdown();
            }
        }, 2000);
    });
})();
