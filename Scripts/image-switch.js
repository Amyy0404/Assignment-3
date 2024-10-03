document.addEventListener('DOMContentLoaded', function() {
    const imageDisplay = document.getElementById('image-display');
    const arrow = document.getElementById('arrow');
    let currentImage = 1;
    const images = [
        { src: '../Images/Posters/Poster-Theory.png', link: '../Visualisation/data-viz-1.html' },
        { src: '../Images/Posters/Poster-Viz.png', link: '../Visualisation/data-viz-2.html' }
    ];

    // Function to handle image click and redirect
    function handleImageClick() {
        window.location.href = images[currentImage - 1].link;
    }

    // Add click event to the image
    imageDisplay.addEventListener('click', handleImageClick);

    arrow.addEventListener('click', function() {
        // Start the transition by hiding the current image
        imageDisplay.classList.add('hidden');
        
        // Switch the image after a short delay to allow fade-out
        setTimeout(function() {
            // Switch the image
            currentImage = (currentImage === 1) ? 2 : 1;
            imageDisplay.src = images[currentImage - 1].src;

            // Show the new image with fade-in
            imageDisplay.classList.remove('hidden');
        }, 600);  // Match the CSS transition time
    });
});
