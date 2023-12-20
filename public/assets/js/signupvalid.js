function validateSignupForm(event) {
    // Reset previous error messages
    resetErrorMessages();

    // Validate username, email, and password
    const usernameInput = document.getElementById('username');
    const usernameError = document.getElementById('usernameError');
    const usernameValue = usernameInput.value.trim();

    if (usernameValue === '') {
        usernameError.innerHTML = 'Username is required.';
        event.preventDefault(); // Prevent form submission
    }

    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const emailValue = emailInput.value.trim();

    if (emailValue === '') {
        emailError.innerHTML = 'Email is required.';
        event.preventDefault(); // Prevent form submission
    } else if (!isValidEmail(emailValue)) {
        emailError.innerHTML = 'Email is not valid.';
        event.preventDefault(); // Prevent form submission
    } else if (!isValidEmail(emailValue)) {
        emailError.innerHTML = 'Email is not valid.';
        event.preventDefault(); // Prevent form submission
    }

    const passwordInput = document.getElementById('password');
    const passwordError = document.getElementById('passwordError');
    const passwordValue = passwordInput.value.trim();

    if (passwordValue === '') {
        passwordError.innerHTML = 'Password is required.';
        event.preventDefault(); // Prevent form submission
    } else if (passwordValue.length < 8 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(passwordValue)) {
        passwordError.innerHTML = 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.';
        event.preventDefault(); // Prevent form submission
    }

    const cpasswordInput = document.getElementById('cpassword');
    const cpasswordError = document.getElementById('cpasswordError');
    const cpasswordValue = cpasswordInput.value.trim();
    if (cpasswordValue === '') {
        cpasswordError.innerHTML = 'Please confirm Password';
        event.preventDefault(); // Prevent form submission
    } 
    else if (cpasswordValue !== passwordValue) {
        cpasswordError.innerHTML = 'Please Enter the correct password.';
        event.preventDefault(); // Prevent form submission
    }
    

    const mobileinput = document.getElementById('Mobile');
    const mobileerror = document.getElementById('MobileError');
    const mobilevalue = mobileinput.value.trim();

    if(mobilevalue === ''){
        mobileerror.innerHTML = 'Mobile number is required';
        event.preventDefault();
    }else if(mobilevalue.length < 10 || mobilevalue.length > 13) {
        mobileerror.innerHTML = 'invalid phone number';
        event.preventDefault();
    }


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

function resetErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(function (errorMessage) {
        errorMessage.innerHTML = '';
    });
}