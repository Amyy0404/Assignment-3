let isScrolling = false;

document.addEventListener('keydown', function(event) {
  if (event.keyCode === 40 && !isScrolling) { 
    isScrolling = true; 
    
    window.scrollBy({
      top: 50,
      left: 0,
      behavior: 'smooth' 
    });

    setTimeout(function() {
      isScrolling = false; 
    }, 500); 
  }
});
  