function validateAndSubmit() {
  // Reset previous error messages
  resetErrorMessages();

  // Validate email
  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  const emailValue = emailInput.value.trim();

  if (emailValue === '') {
      emailError.innerHTML = 'Email is required.';
      return; // Stop further processing
  } else if (!isValidEmail(emailValue)) {
      emailError.innerHTML = 'Email is not valid.';
      return; // Stop further processing
  }

  // Validate password
  const passwordInput = document.getElementById('password');
  const passwordError = document.getElementById('passwordError');
  const passwordValue = passwordInput.value.trim();

  if (passwordValue === '') {
      passwordError.innerHTML = 'Password is required.';
      return; // Stop further processing
  } else if (passwordValue.length <= 8 ) {
      passwordError.innerHTML = 'invalid Password';
      return; // Stop further processing
  }

  // If all validations pass, submit the form
  document.getElementById('loginForm').submit();
}

function resetErrorMessages() {
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach(function (errorMessage) {
      errorMessage.innerHTML = '';
  });
}

function isValidEmail(email) {
  // Simple email validation, you may need to use a more comprehensive approach
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}