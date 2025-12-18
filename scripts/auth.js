document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    checkAuthStatus();

    // Password strength indicator
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.id === 'password' || this.id === 'confirm-password') {
                checkPasswordStrength(this);
                if (this.id === 'password' && document.getElementById('confirm-password')?.value) {
                    validatePasswordMatch();
                }
            }
        });
    });

    function checkPasswordStrength(input) {
        const password = input.value;
        let strength = 0;

        if (password.length > 0) strength += 1;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        // Visual feedback can be added here
    }

    function validatePasswordMatch() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const confirmInput = document.getElementById('confirm-password');

        if (password && confirmPassword && password !== confirmPassword) {
            confirmInput.setCustomValidity('Passwords do not match');
        } else {
            confirmInput.setCustomValidity('');
        }
    }

    // Check authentication status
    function checkAuthStatus() {
        const currentUser = localStorage.getItem('currentUser');
        const currentPage = window.location.pathname;
        
        // If logged in and on login/register page, redirect to home
        if (currentUser && (currentPage.includes('login.html') || currentPage.includes('register.html'))) {
            // Uncomment to auto-redirect logged-in users
            // window.location.href = 'index.html';
        }
    }

    // Handle Registration Form
    const registerForm = document.querySelector('form[action="#"]');
    if (registerForm && window.location.pathname.includes('register.html')) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const termsAccepted = document.getElementById('terms').checked;

            // Validation
            if (!name || !email || !password || !confirmPassword) {
                showMessage('Please fill in all fields', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }

            if (password.length < 8) {
                showMessage('Password must be at least 8 characters long', 'error');
                return;
            }

            if (password !== confirmPassword) {
                showMessage('Passwords do not match', 'error');
                return;
            }

            if (!termsAccepted) {
                showMessage('Please accept the terms and conditions', 'error');
                return;
            }

            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const userExists = users.some(user => user.email === email);

            if (userExists) {
                showMessage('An account with this email already exists', 'error');
                return;
            }

            // Create new user
            const newUser = {
                id: Date.now().toString(),
                name: name,
                email: email,
                password: password, // In production, this should be hashed
                registeredAt: new Date().toISOString()
            };

            // Save to localStorage
            users.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(users));

            showMessage('Registration successful! Redirecting to login...', 'success');
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        });
    }

    // Handle Login Form
    if (registerForm && window.location.pathname.includes('login.html')) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember-me').checked;

            // Validation
            if (!email || !password) {
                showMessage('Please fill in all fields', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }

            // Check credentials
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const user = users.find(u => u.email === email && u.password === password);

            if (!user) {
                showMessage('Invalid email or password. Please register if you don\'t have an account.', 'error');
                return;
            }

            // Save current user session
            const sessionData = {
                id: user.id,
                name: user.name,
                email: user.email,
                loginTime: new Date().toISOString()
            };

            localStorage.setItem('currentUser', JSON.stringify(sessionData));
            
            if (rememberMe) {
                localStorage.setItem('rememberUser', 'true');
            }

            showMessage('Login successful! Redirecting...', 'success');
            
            // Redirect to profile page after 1 second
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1000);
        });
    }

    // Helper Functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showMessage(message, type) {
        // Remove existing messages
        const existingMsg = document.querySelector('.auth-message');
        if (existingMsg) existingMsg.remove();

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            padding: 1rem 2rem;
            border-radius: 4px;
            font-weight: 600;
            z-index: 10000;
            animation: slideDown 0.3s ease;
            ${type === 'success' ? 'background-color: #10b981; color: white;' : 'background-color: #ef4444; color: white;'}
        `;

        document.body.appendChild(messageDiv);

        // Remove after 4 seconds
        setTimeout(() => {
            messageDiv.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }, 4000);
    }
});

//  CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);