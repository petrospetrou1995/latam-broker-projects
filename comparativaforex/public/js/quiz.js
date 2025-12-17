// Quiz functionality for education page
(function() {
    'use strict';
    
    let currentLanguage = 'es';
    let questions = [];
    let userAnswers = {};
    let isSubmitted = false;
    
    // Initialize quiz
    function initQuiz() {
        currentLanguage = localStorage.getItem('language') || 'es';
        loadQuizData();
        renderQuiz();
        setupEventListeners();
    }
    
    // Load quiz data from translations
    function loadQuizData() {
        if (typeof languages === 'undefined') return;
        const lang = languages[currentLanguage];
        if (lang && lang.education && lang.education.quiz) {
            questions = lang.education.quiz.questions || [];
            userAnswers = {};
            isSubmitted = false;
        }
    }
    
    // Render quiz questions
    function renderQuiz() {
        const quizQuestionsContainer = document.getElementById('quizQuestions');
        if (!quizQuestionsContainer || !questions.length) return;
        
        if (typeof languages === 'undefined') return;
        const lang = languages[currentLanguage];
        const quizData = lang && lang.education && lang.education.quiz;
        if (!quizData) return;
        
        quizQuestionsContainer.innerHTML = '';
        
        questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'quiz-question';
            questionDiv.setAttribute('data-question-index', index);
            
            const questionNumber = quizData.question + ' ' + (index + 1) + ' ' + quizData.of + ' ' + questions.length;
            
            questionDiv.innerHTML = `
                <div class="quiz-question-header">
                    <span class="quiz-question-number">${questionNumber}</span>
                    <span class="quiz-question-text">${question.question}</span>
                </div>
                <div class="quiz-options">
                    ${question.options.map((option, optIndex) => `
                        <label class="quiz-option" data-option-index="${optIndex}">
                            <input type="radio" name="question_${index}" value="${optIndex}" data-question="${index}" data-option="${optIndex}">
                            <span>${option}</span>
                        </label>
                    `).join('')}
                </div>
            `;
            
            quizQuestionsContainer.appendChild(questionDiv);
        });
        
        // Add click handlers to options
        quizQuestionsContainer.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', function(e) {
                if (isSubmitted) return;
                
                const radio = this.querySelector('input[type="radio"]');
                const questionIndex = parseInt(radio.getAttribute('data-question'));
                
                // Unselect all options in this question
                const questionDiv = this.closest('.quiz-question');
                questionDiv.querySelectorAll('.quiz-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Select this option
                radio.checked = true;
                this.classList.add('selected');
                userAnswers[questionIndex] = parseInt(radio.value);
            });
        });
    }
    
    // Setup event listeners
    function setupEventListeners() {
        const submitBtn = document.getElementById('submitQuiz');
        const resetBtn = document.getElementById('resetQuiz');
        
        if (submitBtn) {
            submitBtn.addEventListener('click', submitQuiz);
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', resetQuiz);
        }
    }
    
    // Submit quiz and show results
    function submitQuiz() {
        if (isSubmitted) return;
        
        if (typeof languages === 'undefined') return;
        const lang = languages[currentLanguage];
        const quizData = lang && lang.education && lang.education.quiz;
        if (!quizData) return;
        
        // Calculate score
        let correctAnswers = 0;
        questions.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            if (userAnswer !== undefined && userAnswer === question.correct) {
                correctAnswers++;
            }
        });
        
        const totalQuestions = questions.length;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        
        // Mark answers as correct/incorrect
        questions.forEach((question, index) => {
            const questionDiv = document.querySelector(`[data-question-index="${index}"]`);
            if (!questionDiv) return;
            
            const options = questionDiv.querySelectorAll('.quiz-option');
            options.forEach((option, optIndex) => {
                const radio = option.querySelector('input[type="radio"]');
                option.classList.add('disabled');
                
                if (optIndex === question.correct) {
                    option.classList.add('correct');
                } else if (userAnswers[index] === optIndex && optIndex !== question.correct) {
                    option.classList.add('incorrect');
                }
            });
        });
        
        // Show results
        showResults(correctAnswers, totalQuestions, percentage, quizData);
        
        isSubmitted = true;
        const submitBtn = document.getElementById('submitQuiz');
        const resetBtn = document.getElementById('resetQuiz');
        if (submitBtn) submitBtn.style.display = 'none';
        if (resetBtn) resetBtn.style.display = 'block';
    }
    
    // Show quiz results
    function showResults(correct, total, percentage, quizData) {
        const resultsContainer = document.getElementById('quizResults');
        if (!resultsContainer) return;
        
        // Get feedback message
        let feedbackMessage = '';
        if (percentage >= 90) {
            feedbackMessage = quizData.feedback.excellent;
        } else if (percentage >= 70) {
            feedbackMessage = quizData.feedback.good;
        } else if (percentage >= 50) {
            feedbackMessage = quizData.feedback.average;
        } else {
            feedbackMessage = quizData.feedback.poor;
        }
        
        // Build results summary
        let resultsSummary = '<div class="quiz-results-summary">';
        questions.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer !== undefined && userAnswer === question.correct;
            const answerText = userAnswer !== undefined ? question.options[userAnswer] : 'No respondida';
            const correctAnswerText = question.options[question.correct];
            
            resultsSummary += `
                <div class="quiz-result-item ${isCorrect ? 'correct-answer' : 'incorrect-answer'}">
                    <div class="quiz-result-question">
                        ${question.question}
                        <span class="quiz-result-status ${isCorrect ? 'correct' : 'incorrect'}">
                            ${isCorrect ? quizData.correct : quizData.incorrect}
                        </span>
                    </div>
                    <div class="quiz-result-answer">
                        <strong>Tu respuesta:</strong> ${answerText}<br>
                        <strong>Respuesta correcta:</strong> ${correctAnswerText}
                    </div>
                </div>
            `;
        });
        resultsSummary += '</div>';
        
        resultsContainer.innerHTML = `
            <div class="quiz-score">${correct}/${total}</div>
            <div class="quiz-percentage">${quizData.percentage}: ${percentage}%</div>
            <div class="quiz-feedback">${feedbackMessage}</div>
            ${resultsSummary}
        `;
        
        resultsContainer.style.display = 'block';
        
        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Reset quiz
    function resetQuiz() {
        userAnswers = {};
        isSubmitted = false;
        
        const submitBtn = document.getElementById('submitQuiz');
        const resetBtn = document.getElementById('resetQuiz');
        const resultsContainer = document.getElementById('quizResults');
        
        if (submitBtn) submitBtn.style.display = 'block';
        if (resetBtn) resetBtn.style.display = 'none';
        if (resultsContainer) resultsContainer.style.display = 'none';
        
        renderQuiz();
    }
    
    // Update language and re-render
    function updateLanguage(lang) {
        currentLanguage = lang;
        loadQuizData();
        renderQuiz();
        
        // Reset if already submitted
        if (isSubmitted) {
            resetQuiz();
        }
    }
    
    // Initialize when DOM is ready
    function tryInit() {
        if (typeof languages !== 'undefined') {
            initQuiz();
        } else {
            setTimeout(tryInit, 100);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(tryInit, 300);
        });
    } else {
        setTimeout(tryInit, 300);
    }
    
    // Listen for language changes
    window.addEventListener('languageChanged', function(e) {
        updateLanguage(e.detail.language);
    });
    
    // Expose for manual updates
    window.quizManager = {
        init: initQuiz,
        updateLanguage: updateLanguage,
        reset: resetQuiz
    };
})();

