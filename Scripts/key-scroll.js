let isScrolling = false; // Flag to track if the scroll action is in progress

document.addEventListener('keydown', function(event) {
  // Check for the down arrow key and ensure scrolling isn't already happening
  if (event.keyCode === 40 && !isScrolling) { 
    isScrolling = true; // Set the flag to prevent multiple scrolls in quick succession
    
    // Smoothly scroll down the page by 50 pixels
    window.scrollBy({
      top: 50,
      left: 0,
      behavior: 'smooth' 
    });

    // Reset the scrolling flag 
    setTimeout(function() {
      isScrolling = false; 
    }, 500); 
  }
});