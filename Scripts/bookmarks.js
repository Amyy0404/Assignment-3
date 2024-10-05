document.querySelectorAll('.bookmark-sidebar a').forEach(anchor => {
    // Prevent default anchor click behavior to avoid jumpy navigation
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      // Extract the target section's ID
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
  
      // Scroll to the target element with an offset for better visibility
      window.scrollTo({
        top: targetElement.offsetTop - 20, 
        behavior: 'smooth'
      });
    });
  });
  