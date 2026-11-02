/**
 * UniGuide AI - Authentication Logic
 * Handles login, registration validation, and API integration.
 */

const API_BASE_URL = "http://localhost:8080/api";

document.addEventListener('DOMContentLoaded', () => {
    initPasswordToggle();
    initPasswordStrength();
    initLoginForm();
    initRegisterForm();
});

function initPasswordToggle() {
    const toggles = document.querySelectorAll('.password-toggle');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const input = e.currentTarget.previousElementSibling;
            const icon = e.currentTarget.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.setAttribute('data-lucide', 'eye-off');
            } else {
                input.type = 'password';
                icon.setAttribute('data-lucide', 'eye');
            }
            if (window.lucide) lucide.createIcons();
        });
    });
}

function initPasswordStrength() {
    const passwordInput = document.getElementById('registerPassword');
    const strengthBar = document.getElementById('passwordStrengthBar');
    if (!passwordInput || !strengthBar) return;
    
    passwordInput.addEventListener('input', (e) => {
        const val = e.target.value;
        strengthBar.className = 'password-strength-bar';
        if (val.length === 0) return;
        if (val.length < 6) {
            strengthBar.classList.add('strength-weak');
        } else if (val.length < 10 || !/\d/.test(val)) {
            strengthBar.classList.add('strength-medium');
        } else {
            strengthBar.classList.add('strength-strong');
        }
    });
}

function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        let isValid = true;
        
        if (!email.value.includes('@')) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        } else clearError(email);
        
        if (password.value.length < 1) {
            showError(password, 'Password is required');
            isValid = false;
        } else clearError(password);
        
        if (isValid) {
            const btn = form.querySelector('button[type="submit"]');
            const originalBtnText = btn.innerHTML;
            btn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Logging in...';
            if (window.lucide) lucide.createIcons();
            
            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email.value, password: password.value })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('student', JSON.stringify(data.student));
                    window.location.href = 'dashboard.html';
                } else {
                    showError(password, data.message || 'Invalid credentials');
                    btn.innerHTML = originalBtnText;
                }
            } catch (error) {
                console.error("Login Error:", error);
                showError(password, 'Failed to connect to server');
                btn.innerHTML = originalBtnText;
            }
        }
    });
}

function initRegisterForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('fullName');
        const email = document.getElementById('email');
        const password = document.getElementById('registerPassword');
        const confirm = document.getElementById('confirmPassword');
        const terms = document.getElementById('terms');
        const course = document.getElementById('course');
        const location = document.getElementById('location');
        let isValid = true;
        
        if (name.value.trim().length < 2) { showError(name, 'Required'); isValid = false; } else clearError(name);
        if (!email.value.includes('@')) { showError(email, 'Invalid email'); isValid = false; } else clearError(email);
        if (password.value.length < 6) { showError(password, 'Min 6 chars'); isValid = false; } else clearError(password);
        if (password.value !== confirm.value) { showError(confirm, 'Mismatch'); isValid = false; } else clearError(confirm);
        if (!terms.checked) {
            alert('Please accept the Terms & Conditions to create an account.');
            isValid = false; 
        }
        
        if (isValid) {
            const btn = form.querySelector('button[type="submit"]');
            const originalBtnText = btn.innerHTML;
            btn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Creating Account...';
            if (window.lucide) lucide.createIcons();
            
            const payload = {
                name: name.value,
                email: email.value,
                password: password.value,
                preferredCourse: course ? course.value : null,
                preferredLocation: location ? location.value : null,
                marks: 0.0,
                entranceScore: 0.0,
                budget: 0.0,
                careerInterest: "Not specified"
            };
            
            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('student', JSON.stringify(data.student));
                    window.location.href = 'dashboard.html';
                } else {
                    showError(email, data.message || 'Registration failed');
                    btn.innerHTML = originalBtnText;
                }
            } catch (error) {
                console.error("Registration Error:", error);
                showError(email, 'Failed to connect to backend server. Make sure backend is running.');
                btn.innerHTML = originalBtnText;
            }
        }
    });
}

function showError(input, message) {
    if (!input) return;
    input.classList.add('is-invalid');
    const parent = input.parentElement;
    let errorDiv = parent ? parent.querySelector('.form-error') : null;
    if (!errorDiv) {
        errorDiv = input.nextElementSibling?.classList?.contains('form-error') ? 
                   input.nextElementSibling : 
                   (input.nextElementSibling?.nextElementSibling?.classList?.contains('form-error') ? input.nextElementSibling.nextElementSibling : null);
    }
    if (errorDiv) { errorDiv.textContent = message; errorDiv.style.display = 'block'; }
}

function clearError(input) {
    if (!input) return;
    input.classList.remove('is-invalid');
    const parent = input.parentElement;
    let errorDiv = parent ? parent.querySelector('.form-error') : null;
    if (!errorDiv) {
        errorDiv = input.nextElementSibling?.classList?.contains('form-error') ? 
                   input.nextElementSibling : 
                   (input.nextElementSibling?.nextElementSibling?.classList?.contains('form-error') ? input.nextElementSibling.nextElementSibling : null);
    }
    if (errorDiv) { errorDiv.textContent = ''; }
}
