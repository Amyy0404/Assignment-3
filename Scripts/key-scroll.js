let isScrolling = false;

document.addEventListener('keydown', function(event) {
  if (event.keyCode === 40 && !isScrolling) { // Down arrow key (keyCode 40)
    isScrolling = true; // Set flag to prevent multiple triggers
    
    window.scrollBy({
      top: 50, // Adjust to control the scroll distance
      left: 0,
      behavior: 'smooth' // Smooth scrolling
    });
    
    // Reset the isScrolling flag after the scroll completes
    setTimeout(function() {
      isScrolling = false; 
    }, 500); // 500ms delay to allow smooth scrolling to finish
  }
});
  