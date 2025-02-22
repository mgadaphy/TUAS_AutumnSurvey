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
        this.volume = 0.5; // Default volume
        this.initializeControls();
        this.preloadSounds();
    }

    initializeControls() {
        this.toggleButton = document.getElementById('toggleSound');
        this.volumeSlider = document.getElementById('volumeSlider');
        
        if (this.toggleButton && this.volumeSlider) {
            // Update icon based on initial mute state
            this.updateSoundIcon();

            // Event listeners
            this.toggleButton.addEventListener('click', () => this.toggleMute());
            this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value / 100));
        } else {
            console.warn('Sound controls not found in the DOM');
        }
    }

    preloadSounds() {
        // Recursively traverse the sounds object and preload all audio files
        const preloadAudio = (obj) => {
            for (let key in obj) {
                if (obj[key] instanceof Audio) {
                    obj[key].load();
                    obj[key].volume = this.volume;
                } else if (typeof obj[key] === 'object') {
                    preloadAudio(obj[key]);
                }
            }
        };
        preloadAudio(this.sounds);
    }

    updateSoundIcon() {
        if (this.toggleButton) {
            const icon = this.toggleButton.querySelector('i');
            if (icon) {
                icon.className = this.isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
            }
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.updateSoundIcon();
        
        // Update all audio elements
        const updateVolume = (obj) => {
            for (let key in obj) {
                if (obj[key] instanceof Audio) {
                    obj[key].volume = this.isMuted ? 0 : this.volume;
                } else if (typeof obj[key] === 'object') {
                    updateVolume(obj[key]);
                }
            }
        };
        updateVolume(this.sounds);
    }

    setVolume(value) {
        this.volume = value;
        if (!this.isMuted) {
            const updateVolume = (obj) => {
                for (let key in obj) {
                    if (obj[key] instanceof Audio) {
                        obj[key].volume = value;
                    } else if (typeof obj[key] === 'object') {
                        updateVolume(obj[key]);
                    }
                }
            };
            updateVolume(this.sounds);
        }
    }

    playEmotionalSound(rating) {
        console.log('Playing emotional sound for rating:', rating); // Debug log
        if (this.sounds.emotional[rating]) {
            this.playSound(this.sounds.emotional[rating]);
        } else {
            console.warn(`No emotional sound found for rating: ${rating}`);
        }
    }

    playDragSound() {
        this.playSound(this.sounds.navigation.drag);
    }

    playNavigationSound(action) {
        this.playSound(this.sounds.navigation[action]);
    }

    playAchievementSound(type) {
        this.playSound(this.sounds.achievements[type]);
    }

    playBlueberrySound(type) {
        this.playSound(this.sounds.blueberries[type]);
    }

    playCelebrationSound() {
        this.playSound(this.sounds.achievements.celebration);
    }

    playSound(audioElement) {
        if (!audioElement) {
            console.warn('No audio element provided');
            return;
        }
        
        try {
            console.log('Playing sound:', audioElement.src); // Debug log
            audioElement.currentTime = 0;
            audioElement.volume = this.isMuted ? 0 : this.volume;
            
            const playPromise = audioElement.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn('Error playing sound:', error);
                });
            }
        } catch (error) {
            console.warn('Error playing sound:', error);
        }
    }
}

// Initialize sound manager
const soundManager = new SoundManager();

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
        soundManager.playBlueberrySound('collect');
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
            soundManager.playAchievementSound('sectionComplete');
        } else if (points >= 10) {
            soundManager.playBlueberrySound('collect');
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

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const sections = document.querySelectorAll('.survey-section');
    let currentSection = 0;
    const progressBar = document.getElementById('progress');
    let blueberryCount = 0;
    const BLUEBERRIES_PER_QUESTION = 5;

    // Story dialogues
    const dialogues = [
        "Welcome! Let's go picking blueberries in the autumn forest!",
        "For each question you answer, we'll collect more blueberries.",
        "The more thoughtful your answers, the more blueberries we'll find!",
        "Keep going! The forest is full of delicious blueberries!",
        "You're doing great! We're finding so many blueberries!",
        "Almost there! Soon we'll have enough for a pie!",
        "Final stretch! The basket is almost full!"
    ];
    let currentDialogue = 0;

    // Show a specific section
    function showSection(index) {
        sections.forEach((section, i) => {
            if (i === index) {
                section.style.display = 'block';
                setTimeout(() => {
                    section.classList.add('active');
                    // Add floating blueberries to new section
                    blueberryAnimations.addSectionTransition();
                }, 50);
            } else {
                section.classList.remove('active');
                section.style.display = 'none';
            }
        });
        currentSection = index;
        updateDialogue();
    }

    // Validate current section
    function validateSection(sectionIndex) {
        const section = sections[sectionIndex];
        const questions = section.querySelectorAll('.question');
        let isValid = true;

        questions.forEach(question => {
            let isAnswered = false;
            
            // Check different types of inputs
            const options = question.querySelectorAll('.option, .scale-option');
            const textInputs = question.querySelectorAll('.text-input');
            const sliders = question.querySelectorAll('.slider');
            const countryInput = question.querySelector('.country-input');
            
            if (options.length > 0) {
                isAnswered = Array.from(options).some(opt => opt.classList.contains('selected'));
            } else if (textInputs.length > 0) {
                isAnswered = Array.from(textInputs).some(input => input.value.trim() !== '');
            } else if (sliders.length > 0) {
                isAnswered = true; // Sliders always have a value
            } else if (countryInput) {
                isAnswered = countryInput.value.trim() !== '';
            }

            if (!isAnswered) {
                isValid = false;
                showError(question, 'Please answer this question');
            } else {
                clearError(question);
            }
        });

        return isValid;
    }

    // Show error message
    function showError(question, message) {
        let errorMsg = question.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            question.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
    }

    // Clear error message
    function clearError(question) {
        const errorMsg = question.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.style.display = 'none';
        }
    }

    // Update progress bar
    function updateProgress(index) {
        const progress = ((index + 1) / sections.length) * 100;
        progressBar.style.width = progress + '%';
        progressBar.setAttribute('aria-valuenow', progress);
    }

    // Update dialogue
    function updateDialogue() {
        const dialogueElement = document.getElementById('current-dialogue');
        if (dialogueElement) {
            dialogueElement.textContent = dialogues[currentDialogue];
            currentDialogue = (currentDialogue + 1) % dialogues.length;
        }
    }

    // Update blueberry count
    function updateBlueberries() {
        const blueberryCount = document.getElementById('blueberry-count');
        if (blueberryCount) {
            const currentCount = parseInt(blueberryCount.textContent);
            const newCount = currentCount + 1;
            blueberryCount.textContent = newCount;
            
            // Add collection animation
            const counter = document.querySelector('.blueberry-counter');
            if (counter) {
                counter.classList.add('collecting');
                setTimeout(() => counter.classList.remove('collecting'), 500);
            }
        }
    }

    // Show reward
    function showReward() {
        const rewardContainer = document.getElementById('reward-container');
        if (rewardContainer) {
            rewardContainer.style.display = 'block';
            soundManager.playAchievementSound('surveyComplete');
        }
    }

    // Handle option selection
    function handleOptionSelect(button) {
        const options = button.parentElement.querySelectorAll('.option');
        options.forEach(opt => opt.classList.remove('selected'));
        button.classList.add('selected');
        
        // Play sound and create blueberry effect
        soundManager.playBlueberrySound('collect');
        const rect = button.getBoundingClientRect();
        blueberryAnimations.collectBlueberry(rect.left + rect.width / 2, rect.top + rect.height / 2);
        
        // Add points and update blueberries
        scoreManager.addPoints(10, 'Option Selection');
        updateBlueberries();
        
        // Update progress
        updateProgress(currentSection);
    }

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
        
        // Add points and update blueberries
        scoreManager.addPoints(15, 'Mood Rating');
        updateBlueberries();

        // Update progress
        updateProgress(currentSection);
    }

    // Handle slider change
    function handleSliderChange(slider) {
        const value = slider.value;
        slider.style.background = `linear-gradient(to right, var(--accent-color) ${value * 10}%, #ddd ${value * 10}%)`;
        soundManager.playDragSound();
        
        // Add points and update blueberries
        scoreManager.addPoints(15, 'Slider Input');
        updateBlueberries();
        
        // Update progress
        updateProgress(currentSection);
    }

    // Add click handlers for options
    document.querySelectorAll('.option, .scale-option').forEach(button => {
        if (button.classList.contains('scale-option')) {
            button.addEventListener('click', handleMoodSelection);
        } else {
            button.addEventListener('click', () => handleOptionSelect(button));
        }
    });

    // Add change handlers for sliders
    document.querySelectorAll('.slider').forEach(slider => {
        slider.addEventListener('input', () => handleSliderChange(slider));
    });

    // Add input handlers for text inputs
    document.querySelectorAll('.text-input, .country-input').forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                clearError(input.closest('.question'));
                updateBlueberries();
                updateDialogue();
            }
        });
    });

    // Handle next button clicks
    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateSection(currentSection)) {
                if (currentSection < sections.length - 1) {
                    currentSection++;
                    showSection(currentSection);
                    soundManager.playNavigationSound('next');
                }
            }
        });
    });

    // Handle back button clicks
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentSection > 0) {
                currentSection--;
                showSection(currentSection);
                soundManager.playNavigationSound('back');
            }
        });
    });

    // Handle form submission
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (validateSection(currentSection)) {
                showReward();
            }
        });
    }

    // Initialize
    showSection(0);
    updateDialogue();
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
                soundManager.playDragSound();
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
        soundManager.playBlueberrySound('collect');
    });

    // Section completion
    document.addEventListener('sectionComplete', () => {
        soundManager.playAchievementSound('sectionComplete');
    });

    // Survey completion
    document.addEventListener('surveyComplete', () => {
        soundManager.playAchievementSound('surveyComplete');
        setTimeout(() => soundManager.playCelebrationSound(), 1000);
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
