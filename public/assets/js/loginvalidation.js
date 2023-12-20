function validateForm() {
    // Reset previous error messages
    resetErrorMessages();

    // Validate email
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const emailValue = emailInput.value.trim();

    if (emailValue === '') {
        emailError.innerHTML = 'Email is required.';
    } else if (!isValidEmail(emailValue)) {
        emailError.innerHTML = 'Email is not valid.';
    }

    // Validate password
    const passwordInput = document.getElementById('password');
    const passwordError = document.getElementById('passwordError');
    const passwordValue = passwordInput.value.trim();

    if (passwordValue === '') {
        passwordError.innerHTML = 'Password is required.';
    } else if (passwordValue.length < 8 || !/^\w+$/.test(passwordValue)) {
        passwordError.innerHTML = 'Password must be 8 letters or numbers.';
    }

    // Submit the form if there are no errors
    if (!document.querySelector('.error-message')) {
        document.getElementById('loginForm').submit();
    }
}

function isValidEmail(email) {
    // Simple email validation, you may need to use a more comprehensive approach
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function resetErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(function (errorMessage) {
        errorMessage.innerHTML = '';
    });
}
if (!document.querySelector('.error-message')) {
    return true; // Allow form submission
} else {
    return false; // Prevent form submission
}