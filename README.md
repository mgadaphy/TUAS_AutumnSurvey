# Gamified Survey System for Student Experience Assessment

## Overview
This project implements an innovative, gamified survey system designed to gather student feedback about their experience at Turku University of Applied Sciences (TUAS). The system transforms traditional survey-taking into an engaging, interactive experience through gamification elements, emotional feedback mechanisms, and responsive design.

## Key Features

### 1. Gamification Elements
- **Blueberry Collection System**: 
  - Users earn blueberries for each meaningful interaction
  - Visual feedback through animations and counter
  - Rewards different types of input (selections, text entries, slider movements)

- **Progress Tracking**:
  - Multi-section progress bars
  - Visual completion indicators
  - Step-by-step navigation system

### 2. Emotional Engagement
- **Mood Score System**:
  - Tracks emotional engagement throughout the survey
  - Interactive emoji-based rating system
  - Visual feedback through star counter

- **Interactive Elements**:
  - Animated responses to user input
  - Sound effects for different interactions
  - Dynamic visual feedback

### 3. User Experience Features
- **Accessibility**:
  - ARIA labels and roles
  - Keyboard navigation support
  - Skip-to-content functionality
  - Screen reader friendly structure

- **Responsive Design**:
  - Mobile-first approach
  - Fluid layouts and animations
  - Touch-friendly interface elements

## Technical Implementation

### Frontend Architecture
```
TUAS_SummerSurvey/
├── index.html      # Main survey structure
├── styles.css      # Core styling and animations
├── images.css      # Image-related styles
└── script.js       # Interactive functionality
```

### Core Components

#### 1. Survey Structure (index.html)
- Semantic HTML5 structure
- Three main sections:
  1. Basic Information
  2. Background
  3. Experience Assessment
- Banner with progress indicators and counters

#### 2. Styling System (styles.css)
- Modern CSS features:
  - Flexbox/Grid layouts
  - CSS animations
  - Custom properties
  - Media queries
- Theme-based color system
- Responsive design breakpoints

#### 3. Interactive Features (script.js)
```javascript
// Key Systems:
1. Blueberry Collection System
   - Event listeners for user interactions
   - Point calculation logic
   - Animation triggers

2. Progress Tracking
   - Section completion monitoring
   - Progress bar updates
   - Navigation controls

3. Sound Management
   - Context-aware sound effects
   - Emotional response sounds
   - Interactive feedback
```

## User Interaction Flow

1. **Initial Engagement**
   - Welcome message and story introduction
   - Clear progress indicators
   - Initial counter setup (0 blueberries, 0 mood score)

2. **During Survey**
   - Real-time feedback for all interactions
   - Progressive collection of blueberries
   - Emotional engagement tracking
   - Smooth section transitions

3. **Completion**
   - Final score display
   - Completion animations
   - Thank you message

## Gamification Logic

### Point System
1. **Blueberry Collection**
   - Text Input: 1 blueberry per meaningful entry
   - Option Selection: 1 blueberry per selection
   - Slider Movement: Up to 5 blueberries per slider
   - Emotional Ratings: 1 blueberry + mood score

### Animation System
- **Collection Effects**:
  ```css
  @keyframes counterPop {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
  }
  ```
- **Progress Indicators**
- **Emotional Feedback**

## Detailed Technical Implementation

### 1. Gamification Engine
```javascript
// Core Counter System
let blueberryCount = 0;
let moodScore = 0;

function updateBlueberryCounter() {
    blueberryCount++;
    document.getElementById('blueberry-count').textContent = blueberryCount;
    triggerCollectionAnimation();
    playCollectionSound();
}
```

#### Interaction Handlers
1. **Click Events**
   ```javascript
   document.querySelectorAll('.option, .scale-option, .rating-option').forEach(button => {
       button.addEventListener('click', () => {
           if (!button.classList.contains('selected')) {
               updateBlueberryCounter();
               createBlueberryBurst(button);
           }
       });
   });
   ```

2. **Text Input Processing**
   ```javascript
   let typingTimer;
   input.addEventListener('input', () => {
       clearTimeout(typingTimer);
       typingTimer = setTimeout(() => {
           if (!hasEarnedPoints && input.value.trim() !== '') {
               updateBlueberryCounter();
               hasEarnedPoints = true;
           }
       }, 500);
   });
   ```

3. **Slider Interaction**
   ```javascript
   slider.addEventListener('input', function() {
       if (Math.abs(currentValue - lastValue) >= 20) {
           updateBlueberryCounter();
           lastValue = currentValue;
       }
   });
   ```

### 2. Animation System

#### CSS Animations
```css
/* Collection Animation */
@keyframes counterPop {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

/* Blueberry Burst Effect */
@keyframes berryPop {
    0% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.2) rotate(180deg); }
    100% { transform: scale(1) rotate(360deg); }
}

/* Progress Bar Animation */
@keyframes fillProgress {
    from { width: 0; }
    to { width: var(--progress-width); }
}
```

#### JavaScript Animation Triggers
```javascript
function triggerCollectionAnimation() {
    const counter = document.querySelector('.blueberry-counter');
    counter.classList.add('collecting');
    setTimeout(() => counter.classList.remove('collecting'), 500);
}

function createBlueberryBurst(element) {
    const rect = element.getBoundingClientRect();
    blueberryAnimations.createBurst({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        particleCount: 5,
        spreadRadius: 30
    });
}
```

### 3. Sound Management System
```javascript
const soundManager = {
    sounds: {
        collect: new Howl({ src: ['collect.mp3'] }),
        emotional: new Howl({ src: ['emotional.mp3'] }),
        navigation: new Howl({ src: ['navigation.mp3'] })
    },
    
    playBlueberrySound(type) {
        this.sounds[type].play();
    },
    
    playEmotionalSound(rating) {
        // Adjust pitch based on rating
        this.sounds.emotional.rate(0.8 + (rating * 0.1));
        this.sounds.emotional.play();
    }
};
```

## Feature-Specific Documentation

### 1. Progress Tracking System

#### Components
1. **Section Progress Bars**
   ```html
   <div class="progress-container">
       <div class="section-progress" data-section="section1">
           <div class="progress-label">Part 1: Basic Info</div>
           <div class="progress-bar">
               <div class="progress-fill" id="section1Progress"></div>
           </div>
       </div>
   </div>
   ```

2. **Progress Calculation**
   ```javascript
   function updateProgressIndicators(sectionIndex) {
       const section = sections[sectionIndex];
       const questions = section.querySelectorAll('.question');
       const answered = section.querySelectorAll('.question.answered');
       const progress = (answered.length / questions.length) * 100;
       
       document.querySelector(`#section${sectionIndex + 1}Progress`)
           .style.setProperty('--progress-width', `${progress}%`);
   }
   ```

### 2. Emotional Engagement System

#### Mood Score Implementation
```javascript
function updateMoodScore(rating) {
    moodScore += rating;
    document.querySelector('.score-value').textContent = moodScore;
    
    // Visual feedback
    const scoreContainer = document.querySelector('.score-container');
    scoreContainer.classList.add('score-updated');
    setTimeout(() => scoreContainer.classList.remove('score-updated'), 500);
}
```

#### Emotional Question Detection
```javascript
function isMoodQuestion(element) {
    return element.closest('.scale-options') !== null || 
           element.classList.contains('fa-angry') ||
           element.classList.contains('fa-frown') ||
           element.classList.contains('fa-meh') ||
           element.classList.contains('fa-smile') ||
           element.classList.contains('fa-laugh');
}
```

### 3. Accessibility Implementation

#### ARIA Integration
```html
<div class="question" role="group" aria-labelledby="q1-label">
    <label id="q1-label">1. How would you rate your experience?</label>
    <div class="rating-options" role="radiogroup">
        <button type="button" 
                class="rating-option" 
                role="radio" 
                aria-checked="false"
                data-value="1">
            <i class="fas fa-angry" aria-hidden="true"></i>
            <span class="sr-only">Very Dissatisfied</span>
        </button>
    </div>
</div>
```

#### Keyboard Navigation
```javascript
function setupKeyboardNavigation() {
    document.querySelectorAll('.rating-option').forEach(option => {
        option.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                option.click();
            }
        });
    });
}
```

### 4. Performance Optimizations

#### Event Delegation
```javascript
document.querySelector('.survey-section').addEventListener('click', (e) => {
    const button = e.target.closest('.option, .scale-option, .rating-option');
    if (button && !button.classList.contains('selected')) {
        handleOptionSelection(button);
    }
});
```

#### Debounced Updates
```javascript
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedProgressUpdate = debounce(updateProgressIndicators, 100);
```

## Best Practices Implemented

1. **Code Organization**
   - Modular JavaScript functions
   - Separated concerns (HTML/CSS/JS)
   - Clear naming conventions

2. **Performance**
   - Optimized animations
   - Efficient event handling
   - Debounced input handlers

3. **Maintainability**
   - Documented code sections
   - Consistent formatting
   - Reusable components

## Future Enhancements

1. **Potential Features**
   - Achievement system
   - Social sharing capabilities
   - Extended animation library
   - Additional gamification elements

2. **Technical Improvements**
   - Local storage for progress
   - Enhanced accessibility features
   - Additional language support

## Usage Guidelines

1. **Setup**
   - Clone repository
   - Open index.html in modern browser
   - No additional dependencies required

2. **Customization**
   - Modify questions in index.html
   - Adjust styling in styles.css
   - Configure game mechanics in script.js

## Quick Start Guide for Developers

### 1. Initial Setup
```bash
# Clone the repository
git clone https://github.com/your-org/gamified-survey.git

# Navigate to project directory
cd gamified-survey

# Open in browser
start index.html
```

### 2. Adding New Questions
```html
<!-- Add to appropriate section in index.html -->
<div class="question" id="newQuestion" role="group" aria-labelledby="new-q-label">
    <label id="new-q-label">Your Question Text</label>
    
    <!-- For multiple choice -->
    <div class="options" role="radiogroup">
        <button type="button" class="option" data-value="1">Option 1</button>
        <button type="button" class="option" data-value="2">Option 2</button>
    </div>
    
    <!-- For text input -->
    <input type="text" class="text-input" placeholder="Your answer here...">
    
    <!-- For rating -->
    <div class="rating-options">
        <button type="button" class="rating-option" data-value="1">
            <i class="fas fa-angry"></i>
        </button>
        <!-- Add more rating options -->
    </div>
</div>
```

### 3. Customizing Gamification
```javascript
// In script.js
const gameConfig = {
    pointsPerAnswer: 1,
    maxSliderPoints: 5,
    typingDelay: 500,
    animationDuration: 500
};

// Update counter configuration
function updateBlueberryCounter(points = gameConfig.pointsPerAnswer) {
    blueberryCount += points;
    // ... rest of the function
}
```

## Configuration Options

### 1. Game Mechanics
```javascript
const GAME_CONFIG = {
    // Point System
    POINTS: {
        QUESTION_ANSWER: 1,
        MOOD_RATING: 2,
        TEXT_INPUT: 1,
        SLIDER_MOVEMENT: 1,
        MAX_SLIDER_POINTS: 5
    },
    
    // Timing
    TIMING: {
        TYPING_DELAY: 500,
        ANIMATION_DURATION: 500,
        SOUND_DELAY: 200
    },
    
    // Animation
    ANIMATION: {
        PARTICLE_COUNT: 5,
        SPREAD_RADIUS: 30,
        DURATION: 500
    }
};
```

### 2. Theme Customization
```css
:root {
    /* Colors */
    --primary-color: #4a69bd;
    --secondary-color: #2c3e50;
    --background-color: #ffffff;
    --text-color: #333333;
    
    /* Animations */
    --animation-speed: 0.3s;
    --transition-timing: ease;
    
    /* Layout */
    --container-width: 800px;
    --spacing-unit: 1rem;
}
```

### 3. Sound Configuration
```javascript
const SOUND_CONFIG = {
    enabled: true,
    volume: 0.5,
    effects: {
        collect: {
            src: 'sounds/collect.mp3',
            volume: 0.4,
            rate: 1.0
        },
        emotional: {
            src: 'sounds/emotional.mp3',
            volume: 0.6,
            rateRange: [0.8, 1.2]
        }
    }
};
```

## Troubleshooting Guide

### 1. Common Issues and Solutions

#### Counter Not Incrementing
```javascript
// Problem: Counter not updating
// Check these common issues:

// 1. Element not found
console.log(document.getElementById('blueberry-count')); // Should not be null

// 2. Event listener not attached
function verifyEventListeners() {
    const elements = document.querySelectorAll('.option, .scale-option');
    elements.forEach(el => {
        const listeners = getEventListeners(el);
        console.log(`Element ${el.id} has ${listeners.click ? 'click handler' : 'no handler'}`);
    });
}

// 3. CSS visibility
// Check if counter is visible and not overlapped
.blueberry-counter {
    z-index: 1000; /* Ensure it's above other elements */
    position: relative; /* Or fixed/absolute as needed */
}
```

#### Animation Issues
```javascript
// Problem: Animations not working
// Solution: Check CSS classes and transitions

// 1. Verify animation class is added
function debugAnimation(element) {
    console.log('Before:', element.classList.contains('collecting'));
    element.classList.add('collecting');
    console.log('After:', element.classList.contains('collecting'));
    
    // Check if animation is running
    const styles = window.getComputedStyle(element);
    console.log('Animation:', styles.animation);
}

// 2. CSS Animation Debug
.collecting {
    animation: counterPop 0.5s ease !important; /* Force animation */
}
```

#### Sound Not Playing
```javascript
// Problem: Sound effects not working
// Solution: Check sound initialization

// 1. Verify Howler.js is loaded
console.log(typeof Howl); // Should be 'function'

// 2. Debug sound loading
const sound = new Howl({
    src: ['collect.mp3'],
    onload: () => console.log('Sound loaded'),
    onloaderror: (id, error) => console.error('Sound load error:', error)
});
```

### 2. Performance Issues

#### Slow Animations
```javascript
// Use requestAnimationFrame for smooth animations
function smoothAnimation(element) {
    let start;
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        
        element.style.transform = `scale(${1 + Math.sin(progress/500) * 0.1})`;
        
        if (progress < 500) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}
```

#### Memory Leaks
```javascript
// Clean up event listeners
function cleanupEventListeners() {
    const elements = document.querySelectorAll('.option, .scale-option');
    elements.forEach(el => {
        el.replaceWith(el.cloneNode(true));
    });
}

// Reset counters and state
function resetGameState() {
    blueberryCount = 0;
    moodScore = 0;
    updateDisplays();
    clearTimers();
}
```

## Additional Examples

### 1. Custom Question Types
```javascript
// Add a new type of interaction
function createDragDropQuestion(container, options) {
    const dropZone = document.createElement('div');
    dropZone.className = 'drop-zone';
    
    options.forEach(opt => {
        const draggable = document.createElement('div');
        draggable.className = 'draggable';
        draggable.draggable = true;
        draggable.textContent = opt;
        
        draggable.addEventListener('dragstart', handleDragStart);
        container.appendChild(draggable);
    });
    
    container.appendChild(dropZone);
}
```

### 2. Advanced Animations
```javascript
// Particle system for special effects
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
    }
    
    createParticle(x, y, color) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.backgroundColor = color;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
        
        this.animateParticle(particle);
    }
    
    animateParticle(particle) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 2;
        const lifetime = 1000;
        let opacity = 1;
        
        const animate = () => {
            opacity -= 0.02;
            particle.style.opacity = opacity;
            
            if (opacity <= 0) {
                particle.remove();
                return;
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
}
```

### 3. Accessibility Enhancements
```javascript
// Screen reader announcements
const announcer = {
    element: document.createElement('div'),
    
    init() {
        this.element.setAttribute('aria-live', 'polite');
        this.element.className = 'sr-only';
        document.body.appendChild(this.element);
    },
    
    announce(message) {
        this.element.textContent = message;
    }
};

// Usage
function updateGameStatus(points, total) {
    announcer.announce(`Earned ${points} points. Total: ${total}`);
}
```

## Credits
Developed for Turku University of Applied Sciences
Student Experience Assessment Project
