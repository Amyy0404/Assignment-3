document.querySelectorAll('.bookmark-sidebar a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
  
      window.scrollTo({
        top: targetElement.offsetTop - 20, // Adjust as needed for offset
        behavior: 'smooth'
      });
    });
  });
  