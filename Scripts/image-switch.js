document.addEventListener('DOMContentLoaded', function() {
    const imageDisplay = document.getElementById('image-display');
    const arrow = document.getElementById('arrow');
    let currentImage = 1;
    const images = [
        { src: '../Images/Posters/Data-Viz-1.png', link: '../Visualisation/data-viz-1.html' },
        { src: '../Images/Posters/Data-Viz-2.png', link: '../Visualisation/data-viz-2.html' }
    ];

    function handleImageClick() {
        window.location.href = images[currentImage - 1].link;
    }

    imageDisplay.addEventListener('click', handleImageClick);

    arrow.addEventListener('click', function() {
        imageDisplay.classList.add('hidden');

        setTimeout(function() {
            currentImage = (currentImage === 1) ? 2 : 1;
            imageDisplay.src = images[currentImage - 1].src;

            imageDisplay.classList.remove('hidden');
        }, 600);
    });
});
