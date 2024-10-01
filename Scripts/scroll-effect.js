// scroll-effects.js
window.addEventListener('scroll', function() {
    const mainContent = document.querySelector('.main-content');
    const contentPosition = mainContent.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.2;

    if (contentPosition < screenPosition) {
        mainContent.classList.add('visible');
    }
});
