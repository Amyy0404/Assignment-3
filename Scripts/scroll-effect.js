window.addEventListener('scroll', function() {
    const mainContent = document.querySelector('.main-content');
    const contentPosition = mainContent.getBoundingClientRect().top; // Get the distance of the content from the top of the viewport
    const screenPosition = window.innerHeight / 1.2; // Define when content should appear

    if (contentPosition < screenPosition) {
        mainContent.classList.add('visible');
    }
});
