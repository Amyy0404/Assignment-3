document.getElementById("submit-age").addEventListener("click", function() {
    var age = document.getElementById("age-input").value;
    var over18Content = document.getElementById("over-18-content");
    var errorMessage = document.getElementById("error-message");
  
    // Check if the user is over 18
    if (age >= 18) {
      over18Content.classList.remove("hidden");  // Show the over 18 content
      document.getElementById("age-verification").style.display = "none";  // Hide the age verification form
    } else {
      errorMessage.style.display = "block";  // Show error message if under 18
    }
  });
  