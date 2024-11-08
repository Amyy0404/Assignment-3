function toggleEssay() {
    var essayContainer = document.getElementById("essay-container");
    
    // Check the current display style and toggle
    if (essayContainer.style.display === "none") {
      essayContainer.style.display = "block";  // Show the essay
    } else {
      essayContainer.style.display = "none";   // Hide the essay
    }
  }
  