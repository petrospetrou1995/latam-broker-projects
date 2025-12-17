// FAQ AI Bot
(function() {
    'use strict';

    let currentLanguage = localStorage.getItem('language') || 'es';
    let chatBotLanguage = localStorage.getItem('chatbotLanguage') || null;
    let chatHistory = [];
    let isOpen = false;
    let languageSelected = false;

    // Initialize FAQ data from languages.js
    function getFAQData() {
        const lang = chatBotLanguage || currentLanguage;
        if (typeof languages === 'undefined' || !languages[lang]) {
            return [];
        }

        const faqData = languages[lang].faq;
        if (!faqData) return [];

        const questions = [];
        
        // Extract FAQ questions and answers
        Object.keys(faqData).forEach(key => {
            if (key.startsWith('q') && faqData[key].question && faqData[key].answer) {
                questions.push({
                    id: key,
                    question: faqData[key].question,
                    answer: faqData[key].answer
                });
            }
        });

        return questions;
    }

    // Simple keyword matching for FAQ search
    function findFAQAnswer(userQuestion) {
        const faqData = getFAQData();
        const questionLower = userQuestion.toLowerCase().trim();
        
        if (!questionLower) return null;

        // Check for exact matches first
        for (const faq of faqData) {
            if (faq.question === questionLower) {
                return faq.answer;
            }
        }

        // Check for keyword matches
        const keywords = questionLower.split(/\s+/);
        let bestMatch = null;
        let bestScore = 0;

        for (const faq of faqData) {
            let score = 0;
            const faqKeywords = faq.question.split(/\s+/);
            
            keywords.forEach(keyword => {
                if (faqKeywords.some(faqKeyword => faqKeyword.includes(keyword) || keyword.includes(faqKeyword))) {
                    score++;
                }
            });

            if (score > bestScore && score >= 2) {
                bestScore = score;
                bestMatch = faq.answer;
            }
        }

        return bestMatch;
    }

    // Generate AI-like response
    function generateResponse(userQuestion) {
        const faqAnswer = findFAQAnswer(userQuestion);
        
        if (faqAnswer) {
            return faqAnswer;
        }

        // Fallback responses based on keywords
        const questionLower = userQuestion.toLowerCase();
        
        if (questionLower.includes('broker') || questionLower.includes('brokers')) {
            return getTranslation('faqBot.brokerInfo');
        }
        
        if (questionLower.includes('trading') || questionLower.includes('operar')) {
            return getTranslation('faqBot.tradingInfo');
        }
        
        if (questionLower.includes('regul') || questionLower.includes('regulacion')) {
            return getTranslation('faqBot.regulationInfo');
        }
        
        if (questionLower.includes('deposit') || questionLower.includes('deposito')) {
            return getTranslation('faqBot.depositInfo');
        }
        
        if (questionLower.includes('withdraw') || questionLower.includes('retiro')) {
            return getTranslation('faqBot.withdrawInfo');
        }

        // Default response
        return getTranslation('faqBot.defaultResponse');
    }

    // Get translation
    function getTranslation(key) {
        const lang = chatBotLanguage || currentLanguage;
        if (typeof languages !== 'undefined' && languages[lang]) {
            const keys = key.split('.');
            let value = languages[lang];
            
            for (const k of keys) {
                if (value && value[k]) {
                    value = value[k];
                } else {
                    return key;
                }
            }
            return value;
        }
        return key;
    }

    // Detect browser language
    function detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('es')) {
            return 'es';
        } else if (browserLang.startsWith('en')) {
            return 'en';
        }
        return 'es'; // Default to Spanish for Latin America
    }

    // Show language selection
    function showLanguageSelection() {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;

        const browserLang = detectBrowserLanguage();
        const welcomeMessage = getTranslation('faqBot.welcome');
        const selectLanguageText = getTranslation('faqBot.selectLanguage');
        
        const langSelectionHTML = `
            <div class="chatbot-message bot-message">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p style="margin-bottom: 15px; font-size: 1rem; line-height: 1.5;">${welcomeMessage}</p>
                    <p style="margin-bottom: 12px; font-weight: 600;">${selectLanguageText}</p>
                    <div class="language-buttons" style="margin-top: 12px; display: flex; gap: 10px; flex-wrap: wrap;">
                        <button class="lang-btn" data-lang="es" style="padding: 12px 24px; border: 2px solid #667eea; background: ${browserLang === 'es' ? '#667eea' : 'white'}; color: ${browserLang === 'es' ? 'white' : '#667eea'}; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease; font-size: 0.95rem;">
                            🇪🇸 Español ${browserLang === 'es' ? '(Detectado)' : ''}
                        </button>
                        <button class="lang-btn" data-lang="en" style="padding: 12px 24px; border: 2px solid #667eea; background: ${browserLang === 'en' ? '#667eea' : 'white'}; color: ${browserLang === 'en' ? 'white' : '#667eea'}; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease; font-size: 0.95rem;">
                            🇬🇧 English ${browserLang === 'en' ? '(Detected)' : ''}
                        </button>
                    </div>
                </div>
            </div>
        `;

        messagesContainer.innerHTML = langSelectionHTML;

        // Add event listeners to language buttons
        const langButtons = messagesContainer.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const selectedLang = this.getAttribute('data-lang');
                selectChatbotLanguage(selectedLang);
            });
            btn.addEventListener('mouseenter', function() {
                if (this.style.background !== '#667eea') {
                    this.style.background = '#f0f4ff';
                }
            });
            btn.addEventListener('mouseleave', function() {
                const lang = this.getAttribute('data-lang');
                if (this.style.background !== '#667eea') {
                    this.style.background = lang === browserLang ? '#667eea' : 'white';
                }
            });
        });
    }

    // Select chatbot language
    function selectChatbotLanguage(lang) {
        chatBotLanguage = lang;
        currentLanguage = lang;
        localStorage.setItem('chatbotLanguage', lang);
        localStorage.setItem('language', lang);
        languageSelected = true;

        // Update title
        const title = document.querySelector('.chatbot-title span');
        if (title) {
            title.textContent = getTranslation('faqBot.title');
        }

        // Show FAQ questions list
        showFAQQuestions();

        // Trigger language change event for other components
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }

    // Create chatbot HTML
    function createChatbotHTML() {
        const chatbotHTML = `
            <div id="faqChatbot" class="faq-chatbot">
                <div class="chatbot-header">
                    <div class="chatbot-title">
                        <i class="fas fa-robot"></i>
                        <span data-translate="faqBot.title">BrokerAssistBot</span>
                    </div>
                    <button class="chatbot-close" id="chatbotClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="chatbot-messages" id="chatbotMessages">
                    <!-- Language selection or FAQ questions will be added here -->
                </div>
            </div>
            <button id="chatbotToggle" class="chatbot-toggle">
                <i class="fas fa-comments"></i>
                <span class="chatbot-badge" id="chatbotBadge" style="display: none;">1</span>
            </button>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    // Show FAQ questions list
    function showFAQQuestions() {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;

        const faqData = getFAQData();
        const selectQuestionText = getTranslation('faqBot.selectQuestion');

        let questionsHTML = `
            <div class="chatbot-message bot-message">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p style="margin-bottom: 15px; line-height: 1.6; font-size: 0.95rem;">${selectQuestionText}</p>
                </div>
            </div>
        `;

        faqData.forEach((faq, index) => {
            questionsHTML += `
                <div class="faq-question-item" data-faq-id="${faq.id}" style="margin-top: 10px; cursor: pointer;">
                    <div class="faq-question-button">
                        <div class="faq-question-number">${index + 1}</div>
                        <div class="faq-question-text">${faq.question}</div>
                        <div class="faq-question-arrow"><i class="fas fa-chevron-right"></i></div>
                    </div>
                </div>
            `;
        });

        messagesContainer.innerHTML = questionsHTML;

        // Add click handlers to FAQ questions
        const questionItems = messagesContainer.querySelectorAll('.faq-question-item');
        questionItems.forEach(item => {
            item.addEventListener('click', function() {
                const faqId = this.getAttribute('data-faq-id');
                showFAQAnswer(faqId);
            });
        });

        // Hide back button
        const footer = document.getElementById('chatbotFooter');
        if (footer) {
            footer.style.display = 'none';
        }
    }

    // Show FAQ answer
    function showFAQAnswer(faqId) {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;

        const faqData = getFAQData();
        const faq = faqData.find(q => q.id === faqId);
        
        if (!faq) return;

        const selectAnotherText = getTranslation('faqBot.selectAnother');
        const backToQuestionsText = getTranslation('faqBot.backToQuestions');

        const answerHTML = `
            <div class="chatbot-message bot-message">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="faq-answer-header">
                        <h4 style="margin: 0 0 12px 0; color: #333; font-size: 1rem; font-weight: 600;">${faq.question}</h4>
                    </div>
                    <div class="faq-answer-content">
                        <p style="margin: 0 0 20px 0; line-height: 1.6; color: #555;">${faq.answer}</p>
                        <button class="btn-select-another" onclick="window.faqBotSelectAnother()" style="width: 100%; padding: 12px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                            <i class="fas fa-list"></i> ${selectAnotherText}
                        </button>
                    </div>
                </div>
            </div>
        `;

        messagesContainer.innerHTML = answerHTML;
        messagesContainer.scrollTop = 0;

        // Show back button
        const footer = document.getElementById('chatbotFooter');
        if (footer) {
            footer.style.display = 'block';
        }
    }

    // Make selectAnother function globally accessible
    window.faqBotSelectAnother = function() {
        showFAQQuestions();
    };

    // Back to questions handler
    function backToQuestions() {
        showFAQQuestions();
    }

    // Toggle chatbot
    function toggleChatbot() {
        const chatbot = document.getElementById('faqChatbot');
        if (!chatbot) return;

        isOpen = !isOpen;
        chatbot.classList.toggle('open', isOpen);
        
        if (isOpen) {
            // Check if language is already selected
            if (!chatBotLanguage) {
                // Show language selection
                showLanguageSelection();
            } else {
                // Show FAQ questions list
                showFAQQuestions();
            }
        }
    }

    // Initialize chatbot
    function initChatbot() {
        createChatbotHTML();
        
        // Check if chatbot language is already set
        if (chatBotLanguage) {
            languageSelected = true;
            currentLanguage = chatBotLanguage;
        }
        
        // Event listeners
        const toggle = document.getElementById('chatbotToggle');
        const close = document.getElementById('chatbotClose');
        const backBtn = document.getElementById('backToQuestions');

        if (toggle) {
            toggle.addEventListener('click', toggleChatbot);
        }

        if (close) {
            close.addEventListener('click', toggleChatbot);
        }

        if (backBtn) {
            backBtn.addEventListener('click', backToQuestions);
        }

        // Listen for language changes (from main language switcher)
        window.addEventListener('languageChanged', (event) => {
            const newLang = event.detail.language || localStorage.getItem('language') || 'es';
            
            // Only update if chatbot language is already set
            if (chatBotLanguage && chatBotLanguage !== newLang) {
                chatBotLanguage = newLang;
                currentLanguage = newLang;
                localStorage.setItem('chatbotLanguage', newLang);
                
                // Reload chatbot with new language
                if (languageSelected && isOpen) {
                    showFAQQuestions();
                }
                
                // Update title
                const title = document.querySelector('.chatbot-title span');
                if (title) {
                    title.textContent = getTranslation('faqBot.title');
                }
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }
})();

