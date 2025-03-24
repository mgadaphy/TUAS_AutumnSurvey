// Sound Manager Implementation
class SoundManager {
    constructor() {
        this.sounds = {
            emotional: {
                5: new Audio('audio/emotional/achievement-success.mp3'),    // Very Happy
                4: new Audio('audio/emotional/notification-positive.mp3'),  // Happy
                3: new Audio('audio/emotional/simple-notification.mp3'),    // Neutral
                2: new Audio('audio/emotional/error-notification.mp3'),     // Sad
                1: new Audio('audio/emotional/negative-notification.mp3')   // Very Sad
            },
            navigation: {
                next: new Audio('audio/navigation/mouse-click.mp3'),
                back: new Audio('audio/navigation/pop-clic.mp3'),
                drag: new Audio('audio/navigation/ui-sound.mp3')
            },
            achievements: {
                sectionComplete: new Audio('audio/achievements/success-fanfare-trumpets-6185.mp3'),
                surveyComplete: new Audio('audio/achievements/achievement-unlocked.mp3'),
                celebration: new Audio('audio/achievements/tada-fanfare-a-6313.mp3')
            },
            blueberries: {
                collect: new Audio('audio/blueberries/pop-39222.mp3'),
                basket: new Audio('audio/blueberries/chime-sound-7143.mp3')
            }
        };
        this.isMuted = false;
        this.volume = 0.5;
    }

    playEmotionalSound(rating) {
        if (!this.isMuted && this.sounds.emotional[rating]) {
            this.sounds.emotional[rating].currentTime = 0;
            this.sounds.emotional[rating].volume = this.volume;
            this.sounds.emotional[rating].play().catch(error => {
                console.warn('Error playing sound:', error);
            });
        }
    }

    playNavigationSound(action) {
        if (!this.isMuted && this.sounds.navigation[action]) {
            this.sounds.navigation[action].currentTime = 0;
            this.sounds.navigation[action].volume = this.volume;
            this.sounds.navigation[action].play().catch(error => {
                console.warn('Error playing sound:', error);
            });
        }
    }

    playAchievementSound(type) {
        if (!this.isMuted && this.sounds.achievements[type]) {
            this.sounds.achievements[type].currentTime = 0;
            this.sounds.achievements[type].volume = this.volume;
            this.sounds.achievements[type].play().catch(error => {
                console.warn('Error playing sound:', error);
            });
        }
    }

    playBlueberrySound(type) {
        if (!this.isMuted && this.sounds.blueberries[type]) {
            this.sounds.blueberries[type].currentTime = 0;
            this.sounds.blueberries[type].volume = this.volume;
            this.sounds.blueberries[type].play().catch(error => {
                console.warn('Error playing sound:', error);
            });
        }
    }
}

// Initialize sound manager
const soundManager = new SoundManager();

document.addEventListener('DOMContentLoaded', function() {
    // Initialize global counters
    let moodScore = 0;
    let blueberryCount = 0;

    // Update counter displays
    function updateCounters(points = 1, isMoodQuestion = false) {
        // Always update blueberry count
        blueberryCount += points;
        
        // Only update mood score for emotional/mood questions
        if (isMoodQuestion) {
            moodScore += points;
        }

        // Update displays
        document.querySelector('.score-value').textContent = moodScore;
        document.querySelector('#blueberry-count').textContent = blueberryCount;

        // Add collection animation class
        const blueberryCounter = document.querySelector('.blueberry-counter');
        blueberryCounter.classList.add('collecting');
        setTimeout(() => blueberryCounter.classList.remove('collecting'), 500);
    }

    // Initialize variables
    const sections = document.querySelectorAll('.survey-section');
    let currentSection = 0;

    // Function to show a specific section
    function showSection(index) {
        if (index < 0 || index >= sections.length) return;
        
        sections.forEach((section, i) => {
            section.style.display = i === index ? 'block' : 'none';
            section.classList.toggle('active', i === index);
        });
        
        currentSection = index;
        updateProgressIndicators(index);
        
        // Scroll to the top of the page when changing sections
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Generic function to handle option selection
    function handleOptionSelection(element, rect) {
        const wasNotSelected = !element.classList.contains('selected');
        if (wasNotSelected) {
            updateCounters(1);
            soundManager.playBlueberrySound('collect');
            blueberryAnimations.createBlueberryBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
    }

    // Add click handlers for all options
    document.querySelectorAll('.option, .scale-option, .rating-option, .fa-angry, .fa-frown, .fa-meh, .fa-smile, .fa-laugh').forEach(button => {
        button.addEventListener('click', () => {
            const group = button.closest('.options, .scale-options, .rating-options');
            if (group) {
                const wasNotSelected = !button.classList.contains('selected');
                
                // Deselect all options in the group
                group.querySelectorAll('.option, .scale-option, .rating-option, .fa').forEach(btn => {
                    btn.classList.remove('selected');
                });
                
                // Select the clicked option
                button.classList.add('selected');
                
                // Clear any error messages
                clearError(button.closest('.question'));
                updateProgressIndicators(currentSection);
                
                // Handle scoring and animations
                if (wasNotSelected) {
                    const rect = button.getBoundingClientRect();
                    
                    // Check if this is a mood/emotional question
                    const isMoodQuestion = button.closest('.scale-options') !== null || 
                                        button.classList.contains('fa-angry') ||
                                        button.classList.contains('fa-frown') ||
                                        button.classList.contains('fa-meh') ||
                                        button.classList.contains('fa-smile') ||
                                        button.classList.contains('fa-laugh');
                    
                    if (isMoodQuestion) {
                        const rating = parseInt(button.dataset.value || button.parentElement.dataset.value || 3);
                        soundManager.playEmotionalSound(rating);
                        setTimeout(() => {
                            updateCounters(1, true);
                            soundManager.playBlueberrySound('collect');
                        }, 200);
                    } else {
                        updateCounters(1, false);
                        soundManager.playBlueberrySound('collect');
                    }
                    
                    blueberryAnimations.createBlueberryBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
                }
            }
        });
    });

    // Add input handlers for text inputs
    document.querySelectorAll('.text-input').forEach(input => {
        let typingTimer;
        let hasEarnedPoints = false;
        
        input.addEventListener('input', () => {
            const value = input.value.trim();
            if (value !== '') {
                clearError(input.closest('.question'));
                updateProgressIndicators(currentSection);
                
                // Clear existing timer
                clearTimeout(typingTimer);
                
                // Set new timer
                typingTimer = setTimeout(() => {
                    if (!hasEarnedPoints) {
                        updateCounters(1, false);
                        soundManager.playBlueberrySound('collect');
                        const rect = input.getBoundingClientRect();
                        blueberryAnimations.createBlueberryBurst(rect.left + rect.width / 2, rect.top);
                        hasEarnedPoints = true;
                    }
                }, 500);
            } else {
                hasEarnedPoints = false;
            }
        });
    });

    // Add handlers for sliders
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        let lastValue = slider.value;
        let pointsEarned = 0;
        const maxPoints = 5;
        
        slider.addEventListener('input', function() {
            const currentValue = parseInt(this.value);
            if (Math.abs(currentValue - parseInt(lastValue)) >= 20) {
                soundManager.playNavigationSound('drag');
                lastValue = currentValue;
                
                if (pointsEarned < maxPoints) {
                    updateCounters(1, false);
                    soundManager.playBlueberrySound('collect');
                    pointsEarned++;
                    
                    const rect = this.getBoundingClientRect();
                    blueberryAnimations.createBlueberryBurst(rect.left + rect.width / 2, rect.top);
                }
            }
        });
    });

    // Initialize displays
    updateCounters(0); // Initialize with 0 to set initial display
    
    // Show initial section
    showSection(0);

    // Validate current section
    function validateSection(sectionIndex) {
        const section = sections[sectionIndex];
        const questions = section.querySelectorAll('.question');
        let isValid = true;

        questions.forEach(question => {
            const options = question.querySelectorAll('.option, .scale-option');
            const textInput = question.querySelector('.text-input');
            const slider = question.querySelector('input[type="range"]');
            
            const optionSelected = Array.from(options).some(opt => 
                opt.classList.contains('selected'));
            const textFilled = textInput && textInput.value.trim() !== '';
            const hasSlider = slider !== null;
            
            if (!optionSelected && !textFilled && !hasSlider) {
                showError(question, 'Please answer this question');
                isValid = false;
            } else {
                clearError(question);
            }
        });

        return isValid;
    }

    // Show error message
    function showError(question, message) {
        clearError(question);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        question.appendChild(errorDiv);
        question.classList.add('has-error');
    }

    // Clear error message
    function clearError(question) {
        const errorDiv = question.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
            question.classList.remove('has-error');
        }
    }

    // Update progress indicators
    function updateProgressIndicators(index) {
        document.querySelectorAll('.progress-step').forEach((step, i) => {
            if (i < index) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (i === index) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('completed', 'active');
            }
        });

        document.querySelectorAll('.section-progress').forEach((progress, i) => {
            if (i < index) {
                progress.classList.add('completed');
                progress.classList.remove('active');
            } else if (i === index) {
                progress.classList.add('active');
                progress.classList.remove('completed');
            } else {
                progress.classList.remove('completed', 'active');
            }

            const fill = progress.querySelector('.progress-fill');
            if (fill) {
                if (i < index) {
                    fill.style.width = '100%';
                } else if (i === index) {
                    const section = sections[i];
                    const questions = section.querySelectorAll('.question');
                    const answered = Array.from(questions).filter(q => isQuestionAnswered(q));
                    const progressPercent = (answered.length / questions.length) * 100;
                    fill.style.width = progressPercent + '%';
                } else {
                    fill.style.width = '0%';
                }
            }
        });
    }

    // Check if a question is answered
    function isQuestionAnswered(question) {
        const options = question.querySelectorAll('.option, .scale-option');
        const textInput = question.querySelector('.text-input');
        const slider = question.querySelector('input[type="range"]');
        
        const optionSelected = Array.from(options).some(opt => 
            opt.classList.contains('selected'));
        const textFilled = textInput && textInput.value.trim() !== '';
        const hasSlider = slider !== null;
        
        return optionSelected || textFilled || hasSlider;
    }

    // Add navigation button handlers
    document.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (validateSection(currentSection)) {
                // Play next sound first
                soundManager.playNavigationSound('next');
                
                if (currentSection < sections.length - 1) {
                    // Then show next section
                    showSection(currentSection + 1);
                    // Play achievement sound for section completion
                    setTimeout(() => {
                        soundManager.playAchievementSound('sectionComplete');
                        blueberryAnimations.createBlueberryBurst(window.innerWidth / 2, window.innerHeight / 2);
                    }, 300);
                } else {
                    // Final survey completion sounds
                    setTimeout(() => {
                        soundManager.playAchievementSound('surveyComplete');
                        setTimeout(() => {
                            soundManager.playAchievementSound('celebration');
                            blueberryAnimations.createBlueberryBurst(window.innerWidth / 2, window.innerHeight / 2, true);
                        }, 1000);
                    }, 300);
                }
            }
        });
    });

    document.querySelectorAll('.back-btn').forEach(button => {
        button.addEventListener('click', () => {
            soundManager.playNavigationSound('back');
            if (currentSection > 0) {
                showSection(currentSection - 1);
            }
        });
    });

    // Add click handlers for options
    document.querySelectorAll('.option, .scale-option').forEach(button => {
        button.addEventListener('click', () => {
            const group = button.closest('.options, .scale-options');
            if (group) {
                group.querySelectorAll('.option, .scale-option').forEach(btn => {
                    btn.classList.remove('selected');
                    btn.setAttribute('aria-checked', 'false');
                });
                button.classList.add('selected');
                button.setAttribute('aria-checked', 'true');
                clearError(button.closest('.question'));
                updateProgressIndicators(currentSection);
                
                // Play blueberry collect sound for regular options
                soundManager.playBlueberrySound('collect');
                const rect = button.getBoundingClientRect();
                blueberryAnimations.createBlueberryBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
            }
        });
    });

    // Add input handlers for text inputs
    document.querySelectorAll('.text-input').forEach(input => {
        let typingTimer;
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                clearError(input.closest('.question'));
                updateProgressIndicators(currentSection);
                
                // Clear existing timer
                clearTimeout(typingTimer);
                
                // Set new timer
                typingTimer = setTimeout(() => {
                    soundManager.playBlueberrySound('collect');
                }, 500); // Play sound after 500ms of no typing
            }
        });
    });

    // Add handlers for rating options
    document.querySelectorAll('.rating-option').forEach(option => {
        option.addEventListener('click', function() {
            const rating = parseInt(this.dataset.value);
            // Play emotional sound based on rating
            soundManager.playEmotionalSound(rating);
            const rect = this.getBoundingClientRect();
            blueberryAnimations.createBlueberryBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
            
            // Play collect sound after emotional sound
            setTimeout(() => {
                soundManager.playBlueberrySound('collect');
            }, 200);
        });
    });

    // Add handlers for sliders
    let lastValue = 0;
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.addEventListener('input', function() {
            const currentValue = parseInt(this.value);
            if (Math.abs(currentValue - lastValue) >= 1) {
                soundManager.playNavigationSound('drag');
                lastValue = currentValue;
                
                // Create blueberry animation
                const rect = this.getBoundingClientRect();
                blueberryAnimations.createBlueberryBurst(rect.left + rect.width / 2, rect.top);
                
                // Play collect sound occasionally (every 5 points)
                if (currentValue % 5 === 0) {
                    setTimeout(() => {
                        soundManager.playBlueberrySound('collect');
                    }, 100);
                }
            }
        });
    });

    // Add click handlers for progress steps
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.addEventListener('click', () => {
            showSection(index);
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Blueberry counter functionality
    let blueberryCount = 0;

    // Function to update blueberry counter
    function updateBlueberryCounter() {
        blueberryCount++;
        document.getElementById('blueberry-count').textContent = blueberryCount;
        
        // Add collection animation
        const counter = document.querySelector('.blueberry-counter');
        counter.classList.add('collecting');
        setTimeout(() => counter.classList.remove('collecting'), 500);
    }

    // Add click handlers for all clickable options
    document.querySelectorAll('.option, .scale-option, .rating-option, .fa-angry, .fa-frown, .fa-meh, .fa-smile, .fa-laugh').forEach(button => {
        button.addEventListener('click', () => {
            const wasNotSelected = !button.classList.contains('selected');
            if (wasNotSelected) {
                // Handle selection
                const group = button.closest('.options, .scale-options, .rating-options');
                if (group) {
                    group.querySelectorAll('.option, .scale-option, .rating-option, .fa').forEach(btn => {
                        btn.classList.remove('selected');
                    });
                    button.classList.add('selected');
                }
                
                // Update counter and play animation
                updateBlueberryCounter();
                const rect = button.getBoundingClientRect();
                blueberryAnimations.createBlueberryBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
                soundManager.playBlueberrySound('collect');
            }
        });
    });

    // Add input handlers for text inputs
    document.querySelectorAll('.text-input').forEach(input => {
        let typingTimer;
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                // Clear existing timer
                clearTimeout(typingTimer);
                
                // Set new timer
                typingTimer = setTimeout(() => {
                    updateBlueberryCounter();
                    const rect = input.getBoundingClientRect();
                    blueberryAnimations.createBlueberryBurst(rect.left + rect.width / 2, rect.top);
                    soundManager.playBlueberrySound('collect');
                }, 500);
            }
        });
    });

    // Add handlers for sliders
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        let lastValue = slider.value;
        let pointsEarned = 0;
        const maxPoints = 5;
        
        slider.addEventListener('input', function() {
            const currentValue = parseInt(this.value);
            if (Math.abs(currentValue - parseInt(lastValue)) >= 20) {
                soundManager.playNavigationSound('drag');
                lastValue = currentValue;
                
                if (pointsEarned < maxPoints) {
                    updateBlueberryCounter();
                    const rect = this.getBoundingClientRect();
                    blueberryAnimations.createBlueberryBurst(rect.left + rect.width / 2, rect.top);
                    soundManager.playBlueberrySound('collect');
                    pointsEarned++;
                }
            }
        });
    });

    // Initialize blueberry counter on page load
    document.getElementById('blueberry-count').textContent = blueberryCount;
});

// Blueberry Animation System
class BlueberryAnimationSystem {
    constructor() {
        this.particles = [];
        this.container = document.createElement('div');
        this.container.className = 'blueberry-particle-container';
        document.body.appendChild(this.container);
        
        // Bind animation frame
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    createParticle(x, y, collected = false) {
        const particle = document.createElement('div');
        particle.className = 'blueberry-particle';
        
        // Random size for variety
        const size = Math.random() * 15 + 10;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Set initial position
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        // Random initial velocity
        const angle = Math.random() * Math.PI * 2;
        const speed = collected ? 10 : Math.random() * 2 + 1;
        
        const particleObj = {
            element: particle,
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            collected,
            targetX: collected ? document.querySelector('.blueberry-counter').getBoundingClientRect().left : null,
            targetY: collected ? document.querySelector('.blueberry-counter').getBoundingClientRect().top : null
        };
        
        this.container.appendChild(particle);
        this.particles.push(particleObj);
        
        return particleObj;
    }

    createBlueberryBurst(x, y, count = 8) {
        for (let i = 0; i < count; i++) {
            this.createParticle(x, y);
        }
    }

    collectBlueberry(x, y) {
        const particle = this.createParticle(x, y, true);
        return particle;
    }

    animate() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            if (particle.collected) {
                // Collection animation
                const dx = particle.targetX - particle.x;
                const dy = particle.targetY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 5) {
                    particle.element.remove();
                    this.particles.splice(i, 1);
                    continue;
                }
                
                particle.x += dx * 0.1;
                particle.y += dy * 0.1;
                particle.life -= 0.02;
            } else {
                // Floating animation
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.1; // Gravity
                particle.life -= 0.01;
            }
            
            // Update particle position
            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
            particle.element.style.opacity = particle.life;
            
            // Remove dead particles
            if (particle.life <= 0) {
                particle.element.remove();
                this.particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(this.animate);
    }

    addSectionTransition() {
        const sections = document.querySelectorAll('.survey-section');
        sections.forEach(section => {
            // Create floating blueberries
            const rect = section.getBoundingClientRect();
            for (let i = 0; i < 3; i++) {
                const x = rect.left + Math.random() * rect.width;
                const y = rect.top + Math.random() * rect.height;
                this.createFloatingBlueberry(x, y);
            }
        });
    }

    createFloatingBlueberry(x, y) {
        const blueberry = document.createElement('div');
        blueberry.className = 'floating-blueberry';
        blueberry.style.left = x + 'px';
        blueberry.style.top = y + 'px';
        this.container.appendChild(blueberry);
        
        // Add floating animation
        const floatDistance = Math.random() * 20 + 10;
        const duration = Math.random() * 2 + 2;
        blueberry.animate([
            { transform: 'translateY(0)' },
            { transform: `translateY(-${floatDistance}px)` },
            { transform: 'translateY(0)' }
        ], {
            duration: duration * 1000,
            iterations: Infinity,
            easing: 'ease-in-out'
        });
    }
}

// Initialize animation system
const blueberryAnimations = new BlueberryAnimationSystem();

// Score and Progress Management
class ScoreManager {
    constructor() {
        this.score = 0;
        this.sectionProgress = {
            section1: 0,
            section2: 0,
            section3: 0
        };
        this.questionWeights = {
            default: 10,
            slider: 15,
            multiSelect: 20
        };
    }

    // Add points and show animation
    addPoints(points, reason = '') {
        this.score += points;
        this.updateScoreDisplay(points);
        this.playScoreSound(points);
    }

    // Update score display with animation
    updateScoreDisplay(points) {
        const scoreValue = document.getElementById('scoreValue');
        const scoreAnimation = document.getElementById('scoreAnimation');
        
        // Update score value
        scoreValue.textContent = this.score;
        
        // Show animation
        scoreAnimation.textContent = `+${points}`;
        scoreAnimation.classList.remove('show');
        void scoreAnimation.offsetWidth; // Force reflow
        scoreAnimation.classList.add('show');
    }

    // Play appropriate sound based on points earned
    playScoreSound(points) {
        if (points >= 20) {
            soundManager.playNavigationSound('next');
        } else if (points >= 10) {
            soundManager.playNavigationSound('next');
        }
    }

    // Update section progress
    updateSectionProgress(sectionId, progress) {
        this.sectionProgress[sectionId] = progress;
        this.updateProgressBar(sectionId);
    }

    // Update progress bar display
    updateProgressBar(sectionId) {
        const progressBar = document.getElementById(`${sectionId}Progress`);
        if (progressBar) {
            progressBar.style.width = `${this.sectionProgress[sectionId]}%`;
            
            // Add active class for animation if progress is being made
            if (this.sectionProgress[sectionId] > 0) {
                progressBar.classList.add('active');
            }
        }
    }

    // Calculate progress for a section
    calculateSectionProgress(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const questions = section.querySelectorAll('.question');
        let answeredQuestions = 0;

        questions.forEach(question => {
            if (this.isQuestionAnswered(question)) {
                answeredQuestions++;
            }
        });

        const progress = (answeredQuestions / questions.length) * 100;
        this.updateSectionProgress(sectionId, progress);
    }

    // Check if a question is answered
    isQuestionAnswered(question) {
        // Check for different types of inputs
        const radioButtons = question.querySelectorAll('input[type="radio"]:checked');
        const checkboxes = question.querySelectorAll('input[type="checkbox"]:checked');
        const textInputs = question.querySelectorAll('input[type="text"]');
        const textareas = question.querySelectorAll('textarea');
        const sliders = question.querySelectorAll('input[type="range"]');
        const scaleOptions = question.querySelectorAll('.scale-option.active');

        return (
            radioButtons.length > 0 ||
            checkboxes.length > 0 ||
            Array.from(textInputs).some(input => input.value.trim() !== '') ||
            Array.from(textareas).some(textarea => textarea.value.trim() !== '') ||
            Array.from(sliders).some(slider => slider.value !== slider.defaultValue) ||
            scaleOptions.length > 0
        );
    }
}

// Initialize score manager
const scoreManager = new ScoreManager();

// Achievement System
const achievements = {
    section1Complete: {
        title: 'Personal Info Master',
        description: 'Completed all basic information questions!',
        icon: 'fas fa-user-graduate'
    },
    section2Complete: {
        title: 'Background Explorer',
        description: 'Shared your valuable background information!',
        icon: 'fas fa-book-reader'
    },
    section3Complete: {
        title: 'Experience Sage',
        description: 'Completed the learning experience section!',
        icon: 'fas fa-star'
    },
    allComplete: {
        title: 'Survey Champion',
        description: 'Completed the entire survey! Thank you for your feedback!',
        icon: 'fas fa-trophy'
    }
};

function showAchievement(achievementId) {
    const achievement = achievements[achievementId];
    const achievementElement = document.createElement('div');
    achievementElement.className = 'achievement';
    achievementElement.innerHTML = `
        <div class="achievement-icon">
            <i class="${achievement.icon}"></i>
        </div>
        <div class="achievement-content">
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-description">${achievement.description}</div>
        </div>
    `;
    document.body.appendChild(achievementElement);
    
    // Show animation
    setTimeout(() => achievementElement.classList.add('show'), 100);
    
    // Remove after delay
    setTimeout(() => {
        achievementElement.classList.remove('show');
        setTimeout(() => achievementElement.remove(), 500);
    }, 3000);
}

function createConfetti() {
    const colors = ['#4a69bd', '#6c5ce7', '#a8e6cf', '#dcedc1'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.opacity = Math.random();
        document.querySelector('.celebration-container').appendChild(confetti);
    }
}

function showFinalCelebration() {
    const container = document.createElement('div');
    container.className = 'celebration-container';
    container.innerHTML = `
        <div class="celebration-content">
            <h2 class="celebration-title">Congratulations!</h2>
            <p class="celebration-message">You've completed the TUAS Student Survey!</p>
            <div class="celebration-badges">
                <div class="badge"><i class="fas fa-user-graduate"></i></div>
                <div class="badge"><i class="fas fa-book-reader"></i></div>
                <div class="badge"><i class="fas fa-star"></i></div>
                <div class="badge"><i class="fas fa-trophy"></i></div>
            </div>
            <button class="primary-button">Close</button>
        </div>
    `;
    document.body.appendChild(container);
    
    // Show container
    requestAnimationFrame(() => {
        container.style.display = 'flex';
        createConfetti();
    });
    
    // Handle close button
    container.querySelector('button').addEventListener('click', () => {
        container.style.display = 'none';
        setTimeout(() => container.remove(), 500);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const sections = document.querySelectorAll('.survey-section');
    let currentSection = 0;

    // Function to show a specific section
    function showSection(index) {
        if (index < 0 || index >= sections.length) return;
        
        sections.forEach((section, i) => {
            section.style.display = i === index ? 'block' : 'none';
            section.classList.toggle('active', i === index);
        });
        
        currentSection = index;
        updateProgressIndicators(index);
        updateDialogue();
    }

    // Show initial section
    showSection(0);

    // Add navigation button handlers
    document.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', () => {
            soundManager.playNavigationSound('next');
            if (currentSection < sections.length - 1) {
                showSection(currentSection + 1);
            }
        });
    });

    document.querySelectorAll('.back-btn').forEach(button => {
        button.addEventListener('click', () => {
            soundManager.playNavigationSound('back');
            if (currentSection > 0) {
                showSection(currentSection - 1);
            }
        });
    });

    // Add click handlers for progress steps
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.addEventListener('click', () => {
            showSection(index);
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize event listeners for mood selections
    document.querySelectorAll('.scale-option').forEach(button => {
        button.addEventListener('click', handleMoodSelection);
    });
});

// Handle mood selection
function handleMoodSelection(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const group = button.closest('.scale-options');
    
    if (!group) return;

    // Remove selected class from all buttons in this group
    group.querySelectorAll('.scale-option').forEach(btn => {
        btn.classList.remove('selected', 'active');
        btn.setAttribute('aria-checked', 'false');
    });

    // Add selected class to clicked button
    button.classList.add('selected', 'active');
    button.setAttribute('aria-checked', 'true');

    // Get the mood rating (1-5)
    const rating = parseInt(button.getAttribute('data-value'));

    // Play corresponding emotional sound and create blueberry effect
    soundManager.playEmotionalSound(rating);
    
    const rect = button.getBoundingClientRect();
    blueberryAnimations.createBlueberryBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    
    // Add points for mood selection
    scoreManager.addPoints(15, 'Mood Rating');

    // Update progress
    updateProgress(currentSection);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize sound manager
    const soundManager = new SoundManager();
    
    // Initialize section visibility
    updateSectionVisibility();
    updateProgressBar();
    updateDialogue();

    // Add click handlers for navigation buttons
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', () => {
            const direction = button.classList.contains('next') ? 'next' : 'back';
            handleNavigation(direction);
            soundManager.playNavigationSound(direction);
        });
    });

    // Handle all scale options (mood selections)
    document.querySelectorAll('.scale-option').forEach(button => {
        button.addEventListener('click', handleMoodSelection);
    });

    // Remove any other conflicting handlers
    document.querySelectorAll('.option').forEach(button => {
        if (!button.classList.contains('scale-option')) {
            button.addEventListener('click', () => handleOptionSelect(button));
        }
    });

    // Prevent form submission on button clicks
    document.querySelectorAll('button[type="button"]').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
        });
    });

    // Rating options with emoji sounds
    document.querySelectorAll('.rating-option').forEach(option => {
        option.addEventListener('click', function() {
            const rating = parseInt(this.dataset.value);
            soundManager.playEmotionalSound(rating);
        });
    });

    // Handle drag interactions for ratings
    const ratingInputs = document.querySelectorAll('input[type="range"]');
    ratingInputs.forEach(input => {
        let lastValue = input.value;
        
        input.addEventListener('input', function() {
            const currentValue = parseInt(this.value);
            // Only play sound if value changed by at least 1
            if (Math.abs(currentValue - lastValue) >= 1) {
                soundManager.playNavigationSound('drag');
                lastValue = currentValue;
            }
        });
    });

    // Navigation sounds
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            soundManager.playNavigationSound('next');
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            soundManager.playNavigationSound('back');
        });
    }

    // Blueberry collection
    document.addEventListener('blueberryCollected', () => {
        soundManager.playNavigationSound('next');
    });

    // Section completion
    document.addEventListener('sectionComplete', () => {
        soundManager.playNavigationSound('next');
    });

    // Survey completion
    document.addEventListener('surveyComplete', () => {
        soundManager.playNavigationSound('next');
        setTimeout(() => soundManager.playNavigationSound('next'), 1000);
    });

    // Add click handlers to all scale options
    document.querySelectorAll('.scale-option').forEach(button => {
        button.addEventListener('click', handleMoodSelection);
    });

    // Add change handlers for text inputs and textareas
    document.querySelectorAll('input[type="text"], textarea').forEach(input => {
        input.addEventListener('change', () => {
            if (input.value.trim() !== '') {
                const sectionId = input.closest('section').id;
                scoreManager.addPoints(10, 'text-input');
                scoreManager.calculateSectionProgress(sectionId);
            }
        });
    });

    // Add change handlers for sliders
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.addEventListener('change', () => {
            const sectionId = slider.closest('section').id;
            scoreManager.addPoints(15, 'slider-input');
            scoreManager.calculateSectionProgress(sectionId);
        });
    });

    // Add change handlers for checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const sectionId = checkbox.closest('section').id;
            scoreManager.addPoints(5, 'checkbox-input');
            scoreManager.calculateSectionProgress(sectionId);
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    updateProgressSteps();
    
    // Add click handlers for progress steps
    document.querySelectorAll('.progress-step').forEach(step => {
        step.addEventListener('click', () => {
            const sectionId = step.dataset.section;
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Section completion handler
function handleSectionCompletion() {
    soundManager.playAchievementSound('sectionComplete');
    blueberryAnimations.createBlueberryBurst(window.innerWidth / 2, window.innerHeight / 2);
    
    // Update badges and progress
    const currentBadgeId = `section${currentSection + 1}-badge`;
    const badge = document.querySelector(`#${currentBadgeId}`);
    if (badge) {
        badge.classList.add('earned');
    }
    
    updateProgressSteps();
    showSectionCompletionNotification();
}

// Survey completion handler
function handleSurveyCompletion() {
    soundManager.playAchievementSound('surveyComplete');
    setTimeout(() => {
        soundManager.playAchievementSound('celebration');
        blueberryAnimations.createBlueberryBurst(window.innerWidth / 2, window.innerHeight / 2, true);
    }, 1000);
    
    const championBadge = document.querySelector('#champion-badge');
    if (championBadge) {
        championBadge.classList.add('earned');
    }
    
    showFinalCelebration();
}

// Add navigation button handlers
document.querySelectorAll('.next-btn').forEach(button => {
    button.addEventListener('click', () => {
        if (validateSection(currentSection)) {
            soundManager.playNavigationSound('next');
            if (currentSection < sections.length - 1) {
                showSection(currentSection + 1);
                handleSectionCompletion();
            } else {
                handleSurveyCompletion();
            }
        }
    });
});

// Rating option click handler
function handleRatingClick(button) {
    const rating = parseInt(button.getAttribute('data-value'));
    soundManager.playEmotionalSound(rating);
    
    const rect = button.getBoundingClientRect();
    blueberryAnimations.createBlueberryBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
}

// Slider change handler
let lastValue = 0;
document.querySelectorAll('input[type="range"]').forEach(slider => {
    slider.addEventListener('input', function() {
        const currentValue = parseInt(this.value);
        if (Math.abs(currentValue - lastValue) >= 1) {
            soundManager.playNavigationSound('drag');
            lastValue = currentValue;
            
            const rect = this.getBoundingClientRect();
            blueberryAnimations.createBlueberryBurst(rect.left + rect.width / 2, rect.top);
        }
    });
});
