// This script fixes the blueberry counting issues in the TUAS Survey
document.addEventListener('DOMContentLoaded', function() {
    console.log("Counting fix loaded");
    
    // Store the original blueberry count to prevent resets
    let originalBlueberryCount = 0;
    let originalMoodScore = 0;
    
    // Track which questions have already been answered to prevent duplicate counting
    const answeredQuestions = new Set();
    
    // Function to safely get the current counter values
    function getCurrentCounters() {
        const blueberryCountElement = document.querySelector('#blueberry-count');
        const moodScoreElement = document.querySelector('.score-value');
        
        if (blueberryCountElement && moodScoreElement) {
            originalBlueberryCount = parseInt(blueberryCountElement.textContent || '0');
            originalMoodScore = parseInt(moodScoreElement.textContent || '0');
        }
        
        return {
            blueberryCount: originalBlueberryCount,
            moodScore: originalMoodScore
        };
    }
    
    // Get initial counter values
    getCurrentCounters();
    
    // Function to update counters consistently
    function updateCountersFixed(questionId, isMoodQuestion = false, rating = 3) {
        // Only count each question once
        if (!answeredQuestions.has(questionId)) {
            // Get current counter values
            const currentCounters = getCurrentCounters();
            
            // Always add exactly 1 blueberry per question
            const newBlueberryCount = currentCounters.blueberryCount + 1;
            document.querySelector('#blueberry-count').textContent = newBlueberryCount;
            originalBlueberryCount = newBlueberryCount;
            
            // For mood questions, add exactly 1 to mood score
            if (isMoodQuestion) {
                const newMoodScore = currentCounters.moodScore + 1;
                document.querySelector('.score-value').textContent = newMoodScore;
                originalMoodScore = newMoodScore;
                
                // Play emotional sound for mood questions
                if (window.soundManager) {
                    window.soundManager.playEmotionalSound(rating);
                }
            }
            
            // Play blueberry collect sound
            if (window.soundManager) {
                setTimeout(() => {
                    window.soundManager.playBlueberrySound('collect');
                }, isMoodQuestion ? 200 : 0);
            }
            
            // Mark this question as answered
            answeredQuestions.add(questionId);
            
            // Add collection animation
            const blueberryCounter = document.querySelector('.blueberry-counter');
            blueberryCounter.classList.add('collecting');
            setTimeout(() => blueberryCounter.classList.remove('collecting'), 500);
            
            // Create blueberry animation at the clicked element
            const question = document.getElementById(questionId);
            if (question) {
                const rect = question.getBoundingClientRect();
                if (window.blueberryAnimations) {
                    window.blueberryAnimations.createBlueberryBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
                }
            }
        }
    }
    
    // Add our fixed click handlers for options
    document.querySelectorAll('.option, .scale-option, .rating-option').forEach(button => {
        // Add click handler without removing original handlers
        button.addEventListener('click', function(event) {
            const question = button.closest('.question');
            if (question) {
                const questionId = question.id;
                const isMoodQuestion = button.closest('.scale-options') !== null;
                const rating = parseInt(button.dataset.value || 3);
                
                // Only update our counters, let original handlers handle UI and sounds
                setTimeout(() => {
                    updateCountersFixed(questionId, isMoodQuestion, rating);
                }, 10);
            }
        });
    });
    
    // Fix text inputs - use a global tracking system
    const processedTextInputs = new Set();
    
    document.querySelectorAll('.text-input').forEach(input => {
        let typingTimer;
        
        // Add input handler without removing original handlers
        input.addEventListener('input', function() {
            const question = input.closest('.question');
            if (question && input.value.trim() !== '') {
                const questionId = question.id;
                const inputId = questionId + '-' + input.id;
                
                // Clear existing timer
                clearTimeout(typingTimer);
                
                // Set new timer to prevent counting during continuous typing
                typingTimer = setTimeout(() => {
                    if (!processedTextInputs.has(inputId)) {
                        updateCountersFixed(questionId, false);
                        processedTextInputs.add(inputId);
                    }
                }, 500);
            }
        });
        
        // Also track when input is cleared
        input.addEventListener('change', function() {
            const question = input.closest('.question');
            if (question) {
                const questionId = question.id;
                const inputId = questionId + '-' + input.id;
                
                if (input.value.trim() === '') {
                    processedTextInputs.delete(inputId);
                }
            }
        });
    });
    
    // Fix sliders (range inputs)
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        const processedSliders = new Set();
        
        // Add change handler without removing original handlers
        slider.addEventListener('change', function() {
            const question = slider.closest('.question');
            if (question) {
                const questionId = question.id;
                const sliderId = questionId + '-' + (slider.id || 'slider');
                
                if (!processedSliders.has(sliderId)) {
                    setTimeout(() => {
                        updateCountersFixed(questionId, false);
                        processedSliders.add(sliderId);
                    }, 10);
                }
            }
        });
    });
    
    // Monitor counter changes to prevent resets
    const blueberryCountObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'characterData' || mutation.type === 'childList') {
                const currentValue = parseInt(document.querySelector('#blueberry-count').textContent || '0');
                
                // If the value has decreased, restore our tracked value
                if (currentValue < originalBlueberryCount) {
                    document.querySelector('#blueberry-count').textContent = originalBlueberryCount;
                } else {
                    // Update our tracked value
                    originalBlueberryCount = currentValue;
                }
            }
        });
    });
    
    // Start observing the blueberry counter
    const blueberryCountElement = document.querySelector('#blueberry-count');
    if (blueberryCountElement) {
        blueberryCountObserver.observe(blueberryCountElement, { 
            characterData: true, 
            childList: true,
            subtree: true 
        });
    }
    
    console.log("Counting fix applied");
});
