document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const eyeIcon = document.getElementById('eye-icon');

    // 1. Password Show / Hide Toggle
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            
            // Icon update using Lucide Icons
            if (eyeIcon) {
                eyeIcon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
                if (window.lucide) {
                    lucide.createIcons();
                }
            }
        });
    }

    // 2. Helper functions for validation UI
    const showError = (input) => {
        if (!input) return;
        const formGroup = input.closest('.form-group') || input.closest('.input-group');
        if (formGroup) formGroup.classList.add('error');
    };

    const clearError = (input) => {
        if (!input) return;
        const formGroup = input.closest('.form-group') || input.closest('.input-group');
        if (formGroup) formGroup.classList.remove('error');
    };

    // Live validation clearing on input
    [fullnameInput, emailInput, phoneInput, passwordInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => clearError(input));
        }
    });

    // 3. Form Submission & Supabase Registration Integration
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            let isValid = true;

            const fullnameValue = fullnameInput ? fullnameInput.value.trim() : '';
            const emailValue = emailInput ? emailInput.value.trim() : '';
            const phoneValue = phoneInput ? phoneInput.value.trim() : '';
            const passwordValue = passwordInput ? passwordInput.value : '';

            // Name Validation
            if (fullnameValue.length < 2) {
                showError(fullnameInput);
                isValid = false;
            }

            // Email Validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailValue)) {
                showError(emailInput);
                isValid = false;
            }

            // Phone Validation (10 to 15 digits)
            const phoneRegex = /^[0-9+\s-]{10,15}$/;
            if (!phoneRegex.test(phoneValue)) {
                showError(phoneInput);
                isValid = false;
            }

            // Password Validation
            if (passwordValue.length < 6) {
                showError(passwordInput);
                isValid = false;
            }

            // Agar Validation fail hoti hai
            if (!isValid) {
                const card = document.querySelector('.signup-card') || document.querySelector('.login-card') || signupForm;
                if (card) {
                    card.classList.remove('shake');
                    void card.offsetWidth; // Trigger reflow
                    card.classList.add('shake');
                }
                return;
            }

            // Button UI Loading State
            const submitBtn = document.getElementById('submit-btn') || document.getElementById('submitBtn');
            const btnText = document.getElementById('btn-text');
            
            if (submitBtn) submitBtn.disabled = true;
            if (btnText) {
                btnText.textContent = "Creating Account...";
            } else if (submitBtn) {
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Account Ban Raha Hai...';
            }

            try {
                // Supabase Table Mein Direct Insertion
                const { data, error } = await _supabase
                    .from('users')
                    .insert([
                        { 
                            full_name: fullnameValue, 
                            email: emailValue, 
                            phone: phoneValue, 
                            password: passwordValue 
                        }
                    ]);

                if (error) {
                    // Unique constraint error check (Duplicate Email/Phone)
                    if (error.code === '23505' || error.message.includes('duplicate key')) {
                        alert('Yeh Email ya Phone number pehle se registered hai! Kripya login karein.');
                    } else {
                        alert('Registration Failed: ' + error.message);
                    }
                    resetSubmitButton(submitBtn, btnText);
                    return;
                }

                // Account successfully creation response
                alert('Account successfully ban gaya hai! Ab login karein.');
                window.location.href = 'login.html'; // Redirect to login page

            } catch (err) {
                console.error('Unexpected error:', err);
                alert('An unexpected error occurred. Please check your config file.');
                resetSubmitButton(submitBtn, btnText);
            }
        });
    }

    // Reset Button State Helper
    function resetSubmitButton(submitBtn, btnText) {
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) {
            btnText.textContent = "Create Account";
        } else if (submitBtn) {
            submitBtn.innerHTML = '<span>Sign Up</span>';
        }
    }
});