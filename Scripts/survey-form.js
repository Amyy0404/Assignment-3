document.getElementById("golfSurveyForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Clear previous error messages
  document.querySelectorAll(".error-message").forEach(span => span.textContent = "");
  document.getElementById("success-message").textContent = "";

  // Get form field values and trim whitespace
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
  } else if (name.length < 3 || name.length > 50) {
      document.getElementById("name-error").textContent = "Name must be between 3 and 50 characters.";
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
  } else if (password.length > 20) {
      document.getElementById("password-error").textContent = "Password cannot exceed 20 characters.";
      isValid = false;
  }

  // Phone validation
  if (!phone.match(/^\d{10}$/)) {
      document.getElementById("phone-error").textContent = "Phone number must be exactly 10 digits.";
      isValid = false;
  } else if (!phone.match(/^(07|08|06)/)) {
      document.getElementById("phone-error").textContent = "Phone number must start with '07', '08', or '06'.";
      isValid = false;
  }

  // Favorite Club validation
  if (favoriteClub === "") {
      document.getElementById("favorite-club-error").textContent = "Please select your favorite club.";
      isValid = false;
  }

  // Handicap validation 
  if (isNaN(handicap) || handicap < 0 || handicap > 54) {
      document.getElementById("handicap-error").textContent = "Please enter a valid handicap between 0 and 54.";
      isValid = false;
  }

  // Message length validation
  if (message.length < 20) {
      document.getElementById("message-error").textContent = "Message must be at least 20 characters long.";
      isValid = false;
  } else if (message.length > 300) {
      document.getElementById("message-error").textContent = "Message cannot exceed 300 characters.";
      isValid = false;
  }

  // Display success message if all validations pass
  if (isValid) {
      document.getElementById("success-message").textContent = "Thank you! Your response has been received.";

      // Reset the form fields
      document.getElementById("golfSurveyForm").reset();
  }
});

  
  