document.addEventListener('DOMContentLoaded', function() {
    const imageDisplay = document.getElementById('image-display');
    const arrow = document.getElementById('arrow');
    const description = document.getElementById('description');
    let currentImage = 1;// Track the index of the currently displayed image

    // Store image data, links, and descriptions for easy access
    const images = [
        { 
            src: '../Images/Posters/Data-Viz-1.png', 
            link: '../Visualisation/data-viz-1.html',
            description: "As a golfer (or at least a wannabe one), there’s nothing quite like knowing who the top players in the game are, right? Imagine walking into your local course, armed with the knowledge of who’s crushing it in 2024, and dropping their names casually in conversation: “Oh, did you hear who just took over the leaderboard?!” Whether you’re trying to improve your swing or just want to impress your buddies, being in the loop with the top-ranked golfers keeps things exciting. Plus, who doesn’t want to know which pros are dominating the greens this year?"
        },
        { 
            src: '../Images/Posters/Data-Viz-2.png', 
            link: '../Visualisation/data-viz-2.html',
            description: "If you're a golfer (or even just a golf enthusiast), knowing the prize money for each tournament in 2024 isn’t just a fun fact—it could be your secret weapon for figuring out which tournaments to follow closely or even aim for! Let’s face it, we all want to know where the big money is. Whether you dream of swinging for that major purse or you're just fascinated by how much cash is at stake for the top players, tracking these figures is like keeping your eye on the golden prize. Plus, who doesn't want to know which events pay out the most and whether your favorite golfer has a chance to score big this season?"
        }
    ];

    function handleImageClick() {
        // Navigate to the link of the currently displayed image when clicked
        window.location.href = images[currentImage - 1].link;
    }

    imageDisplay.addEventListener('click', handleImageClick);

    // Handle arrow click to switch images and description with a transition
    arrow.addEventListener('click', function() {
        imageDisplay.classList.add('hidden');

        setTimeout(function() {
            // Toggle current image index to switch between the two available images
            currentImage = (currentImage === 1) ? 2 : 1;

            imageDisplay.src = images[currentImage - 1].src;
            description.textContent = images[currentImage - 1].description; 

            imageDisplay.classList.remove('hidden');
        }, 600);// Wait for transition effect before changing the content
    });
});
