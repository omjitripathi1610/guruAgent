document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginInput = document.getElementById('loginInput'); // Email / Phone Input
  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  const loginCard = document.querySelector('.login-card');

  // Helper function to remove error state
  const clearError = (input) => {
    if (!input) return;
    const parentGroup = input.closest('.input-group');
    if (parentGroup) {
      parentGroup.classList.remove('error');
    }
  };

  // Helper function to add error state
  const setError = (input) => {
    if (!input) return;
    const parentGroup = input.closest('.input-group');
    if (parentGroup) {
      parentGroup.classList.add('error');
    }
  };

  // 1. Password Show / Hide Toggle Functionality
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      
      // Icon class switch (fa-eye <-> fa-eye-slash)
      togglePassword.classList.toggle('fa-eye');
      togglePassword.classList.toggle('fa-eye-slash');
    });
  }

  // 2. Real-time Input Validation Reset on Typing
  if (loginInput) {
    loginInput.addEventListener('input', () => clearError(loginInput));
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', () => clearError(passwordInput));
  }

  // 3. Form Submission & Supabase Authentication
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      let isValid = true;
      const loginValue = loginInput ? loginInput.value.trim() : '';
      const passwordValue = passwordInput ? passwordInput.value : '';

      // Check Email / Phone Input (Khali nahi hona chahiye)
      if (!loginValue) {
        setError(loginInput);
        isValid = false;
      }

      // Check Password Length (Minimum 6 Characters)
      if (passwordValue.length < 6) {
        setError(passwordInput);
        isValid = false;
      }

      // Validation Fail hone par Card Shake Animation trigger karein
      if (!isValid) {
        if (loginCard) {
          loginCard.classList.remove('shake');
          void loginCard.offsetWidth; // Force Reflow
          loginCard.classList.add('shake');
        }
        return;
      }

      // UI Loading State Enable karein
      const submitBtn = document.getElementById('submitBtn');
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '<span>Log In</span>';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Logging in...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
      }

      try {
        // Supabase Database se Email YA Phone match karke Password check karein
        const { data: users, error } = await _supabase
          .from('users')
          .select('*')
          .or(`email.eq.${loginValue},phone.eq.${loginValue}`)
          .eq('password', passwordValue);

        if (error) {
          alert('Login Error: ' + error.message);
          resetButton(submitBtn, originalBtnHTML);
          return;
        }

        // Match mila ya nahi check karein
        if (users && users.length > 0) {
          const user = users[0];

          // User details ko Session storage / LocalStorage me save karein
          localStorage.setItem('userSession', JSON.stringify({
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            phone: user.phone
          }));

          alert(`Welcome back, ${user.full_name}!`);
          window.location.href = 'index.html'; // Direct to Dashboard
        } else {
          // Details match na hone par error aur shake animation
          alert('Galat Email/Phone ya Password! Kripya sahi details darj karein.');
          if (loginCard) {
            loginCard.classList.remove('shake');
            void loginCard.offsetWidth; // Force Reflow
            loginCard.classList.add('shake');
          }
          resetButton(submitBtn, originalBtnHTML);
        }

      } catch (err) {
        console.error('Unexpected Login Error:', err);
        alert('An unexpected error occurred. Please check console.');
        resetButton(submitBtn, originalBtnHTML);
      }
    });
  }

  // Reset Button Helper
  function resetButton(btn, originalHTML) {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalHTML;
    }
  }
});