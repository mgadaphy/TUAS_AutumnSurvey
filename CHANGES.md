# TUAS Autumn Survey - Change History

## March 2025: Blueberry Counting Fix and Smooth Scrolling

### Blueberry Counting System
- Added a new script (`counting-fix.js`) to address counting issues for various question types:
  - **Option Selection**: Ensured that selecting options (radio buttons, scale options, etc.) counts only once per question.
  - **Text Input Handling**: Adjusted the handling of text inputs to prevent multiple counts while typing, only counting once the user stops typing.
  - **Slider Inputs**: Fixed the counting for sliders to ensure they count once when the value changes.
  - **Dropdown Selections**: Added functionality to count selections from dropdown menus.
- Introduced a set (`answeredQuestions`) to track which questions have already been answered to prevent duplicate counting.
- Implemented a MutationObserver to prevent counter resets and ensure consistent counting.
- Fixed mood questions to add exactly 1 point to mood score instead of 2.

### Navigation Improvements
- Added a new script (`scroll-fix.js`) that ensures smooth scrolling to the top of each section when navigating through the survey.

## February 2025: GitHub Pages Deployment
- Added automated GitHub Pages deployment workflow
- Fixed deployment configuration to ensure proper rendering on GitHub Pages
- Added support for custom domain configuration

## January 2025: Licensing
- Added MIT License to the project
- Updated documentation to reflect licensing terms

## December 2024: Initial Release
- Created the initial version of the TUAS Autumn Survey with gamification features
- Implemented the basic blueberry collection system
- Added mood score tracking
- Designed responsive UI with animations and sound effects
- Implemented multi-section survey structure with progress tracking
