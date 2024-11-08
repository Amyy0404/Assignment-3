document.addEventListener('DOMContentLoaded', function() {
    const imageDisplay = document.getElementById('image-display');
    const arrow = document.getElementById('arrow');
    const description = document.getElementById('description');
    const visualizationHeading = document.getElementById('visualization-heading');
    let currentImage = 0; // Start with the first image

    const images = [
        { 
            src: '../Images/Posters/Data-Viz-1.png', 
            link: '../Visualisation/data-viz-1.html',
            description: "As a golfer (or at least a wannabe one), there’s nothing quite like knowing who the top players in the game are, right? Imagine walking into your local course, armed with the knowledge of who’s crushing it in 2024, and dropping their names casually in conversation: “Oh, did you hear who just took over the leaderboard?!” Whether you’re trying to improve your swing or just want to impress your buddies, being in the loop with the top-ranked golfers keeps things exciting. Plus, who doesn’t want to know which pros are dominating the greens this year?",
            heading: "VISUALISATION 1"
        },
        { 
            src: '../Images/Posters/Data-Viz-2.png', 
            link: '../Visualisation/data-viz-2.html',
            description: "If you're a golfer (or even just a golf enthusiast), knowing the prize money for each tournament in 2024 isn’t just a fun fact—it could be your secret weapon for figuring out which tournaments to follow closely or even aim for! Let’s face it, we all want to know where the big money is. Whether you dream of swinging for that major purse or you're just fascinated by how much cash is at stake for the top players, tracking these figures is like keeping your eye on the golden prize. Plus, who doesn't want to know which events pay out the most and whether your favorite golfer has a chance to score big this season?",
            heading: "VISUALISATION 2"
        },
        { 
            src: '../Images/Posters/Data-Viz-3.png', 
            link: '../Visualisation/data-viz-3.html',
            description: "Ready to see who’s taking home the big bucks and the bragging rights? Dive into the 2024 tournament winners’ share and the valuable FedEx Cup points they’re racking up! Whether it’s a hefty paycheck or those coveted points, these pros are battling it out for the ultimate golf glory. Who will rise to the top of the leaderboard, not just in prize money, but in FedEx Cup fame? Let’s see who’s making a hole-in-one for both their bank accounts and their standings!",
            heading: "VISUALISATION 3"
        },
    ];

    function handleImageClick() {
        window.location.href = images[currentImage].link;
    }

    imageDisplay.addEventListener('click', handleImageClick);

    arrow.addEventListener('click', function() {
        imageDisplay.classList.add('hidden');

        setTimeout(function() {
            currentImage = (currentImage + 1) % images.length;
            imageDisplay.src = images[currentImage].src;
            description.textContent = images[currentImage].description; 
            visualizationHeading.textContent = images[currentImage].heading; // Update heading

            imageDisplay.classList.remove('hidden');
        }, 600);
    });
});
