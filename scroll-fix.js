// This script adds smooth scrolling behavior when navigating between survey sections
document.addEventListener('DOMContentLoaded', function() {
    // Add click event listeners to all next and back buttons
    document.querySelectorAll('.next-btn, .back-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Scroll to the top of the page with smooth animation
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
    
    // Also add to any other navigation buttons that might be used
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', function() {
            // Scroll to the top of the page with smooth animation
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
});
