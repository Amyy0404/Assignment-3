document.getElementById("golfSurveyForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission for validation testing
  
    // Clear previous error messages
    document.querySelectorAll(".error-message").forEach(span => span.textContent = "");
    document.getElementById("success-message").textContent = "";
  
    // Validate form fields
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const favoriteClub = document.getElementById("favorite-club").value;
    const handicap = document.getElementById("handicap").value.trim();
    const message = document.getElementById("message").value.trim();
  
    let isValid = true;
  
    // Name validation
    if (!name.match(/^[A-Za-z\s]+$/)) {
      document.getElementById("name-error").textContent = "Name must only contain letters and spaces.";
      isValid = false;
    }
  
    // Email validation
    if (!email.match(/^[\w-]+@((gmail|outlook|icloud)\.com)$/)) {
      document.getElementById("email-error").textContent = "Please enter a valid email (e.g., xyz@gmail.com).";
      isValid = false;
    }
  
    // Password validation
    if (password.length < 8 || !/\d/.test(password) || !/[!@#$%^&*]/.test(password)) {
      document.getElementById("password-error").textContent = "Password must be at least 8 characters long and include numbers and special characters.";
      isValid = false;
    }
  
    // Phone validation
    if (!phone.match(/^\d{10}$/)) {
      document.getElementById("phone-error").textContent = "Phone number must be exactly 10 digits.";
      isValid = false;
    }
  
    // Favorite Club validation
    if (favoriteClub === "") {
      document.getElementById("favorite-club-error").textContent = "Please select your favorite club.";
      isValid = false;
    }
  
    // Handicap validation
    if (isNaN(handicap) || handicap < -7 || handicap > 54) {
      document.getElementById("handicap-error").textContent = "Please enter a valid handicap between 0 and 54.";
      isValid = false;
    }
  
    // Message length validation
    if (message.length < 20) {
      document.getElementById("message-error").textContent = "Message must be at least 20 characters long.";
      isValid = false;
    }
  
    // If all validations pass, show success message
    if (isValid) {
      document.getElementById("success-message").textContent = "Thank you! Your response has been received.";
    }
  });
  
  