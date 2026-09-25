document.addEventListener('DOMContentLoaded', () => {
    const forgotForm = document.getElementById('forgot-form');
    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const successBox = document.getElementById('success-box');
    const sentEmailText = document.getElementById('sent-email-text');
    const resendBtn = document.getElementById('resend-btn');

    // Helper functions for validation
    const showError = (input) => {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
    };

    const clearError = (input) => {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error');
    };

    // Clear error on user input
    emailInput.addEventListener('input', () => clearError(emailInput));

    // Form Submission
    forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailValue = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(emailValue)) {
            showError(emailInput);
            return;
        }

        // Simulating API Call
        submitBtn.disabled = true;
        btnText.textContent = "Sending Link...";

        setTimeout(() => {
            // Hide Form and Show Success Message
            forgotForm.classList.add('hidden');
            sentEmailText.textContent = emailValue;
            successBox.classList.remove('hidden');
        }, 1200);
    });

    // Resend Email Click
    resendBtn.addEventListener('click', () => {
        resendBtn.disabled = true;
        resendBtn.textContent = "Sending...";
        
        setTimeout(() => {
            resendBtn.textContent = "Link Resent!";
            setTimeout(() => {
                resendBtn.disabled = false;
                resendBtn.textContent = "Resend Email";
            }, 2000);
        }, 1000);
    });
});