/**
 * Login Page Logic - Email/Password Authentication
 * Purpose: Handle email and password authentication using Firebase
 * Author: Ingrevo Team
 * 
 * Features:
 * - Email/Password Sign-In
 * - User session management with localStorage
 * - Password visibility toggle
 * - Remember me functionality
 * - Error handling and user feedback
 * - Redirect to admin dashboard after successful login
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Login page loaded');
    
    // Get UI elements
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const rememberMeCheckbox = document.getElementById('remember-me');
    const forgotPasswordLink = document.getElementById('forgot-password');
    const loginBtn = document.getElementById('login-btn');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const successMessage = document.getElementById('success-message');
    const successText = document.getElementById('success-text');
    const logoImg = document.getElementById('logo-img');

    // Handle missing logo gracefully
    if (logoImg) {
        logoImg.onerror = function() {
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 80px;
                height: 80px;
                margin: 0 auto 1rem;
                border-radius: 50%;
                background: linear-gradient(135deg, #0891B2, #3B82F6);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 2rem;
                font-weight: bold;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            `;
            placeholder.textContent = 'I';
            this.parentNode.insertBefore(placeholder, this);
        };
    }

    // Check if user is already logged in
    checkExistingSession();

    // Load saved email if "Remember Me" was checked
    loadSavedCredentials();

    // Password visibility toggle
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    }

    // Form submission handler
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Forgot password handler
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', handleForgotPassword);
    }

    /**
     * Check if user has an existing session
     */
    function checkExistingSession() {
        const user = localStorage.getItem('ingrevo_user');
        const authTimestamp = localStorage.getItem('ingrevo_auth_timestamp');
        
        if (user && authTimestamp) {
            const now = new Date().getTime();
            const sessionAge = now - parseInt(authTimestamp);
            const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
            
            if (sessionAge < maxAge) {
                console.log('✅ Active session found, redirecting...');
                showLoading(true, 'Restoring your session...');
                
                // Verify with Firebase Auth
                firebase.auth().onAuthStateChanged((firebaseUser) => {
                    if (firebaseUser) {
                        setTimeout(() => {
                            redirectToDashboard();
                        }, 1000);
                    } else {
                        clearUserSession();
                        showLoading(false);
                    }
                });
            } else {
                clearUserSession();
            }
        }
    }

    /**
     * Load saved credentials if Remember Me was checked
     */
    function loadSavedCredentials() {
        const savedEmail = localStorage.getItem('ingrevo_saved_email');
        const rememberMe = localStorage.getItem('ingrevo_remember_me') === 'true';
        
        if (savedEmail && rememberMe && emailInput) {
            emailInput.value = savedEmail;
            rememberMeCheckbox.checked = true;
        }
    }

    /**
     * Toggle password visibility
     */
    function togglePasswordVisibility() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        // Update icon (optional enhancement)
        const eyeIcon = togglePasswordBtn.querySelector('.eye-icon');
        if (type === 'text') {
            eyeIcon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
            `;
        } else {
            eyeIcon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            `;
        }
    }

    /**
     * Handle login form submission
     */
    async function handleLogin(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = rememberMeCheckbox.checked;

        // Basic validation
        if (!email || !password) {
            showError('Please enter both email and password.');
            return;
        }

        if (!validateEmail(email)) {
            showError('Please enter a valid email address.');
            return;
        }

        // Check if Firebase is initialized
        if (!window.firebaseAuth) {
            showError('Firebase is not initialized. Please check your configuration.');
            return;
        }

        console.log('🔑 Attempting to sign in...');
        
        showLoading(true);
        hideError();
        hideSuccess();

        try {
            // Sign in with email and password
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            console.log('✅ Sign-in successful:', user.email);
            
            // Store user data
            storeUserSession(user);
            
            // Handle Remember Me
            if (rememberMe) {
                localStorage.setItem('ingrevo_saved_email', email);
                localStorage.setItem('ingrevo_remember_me', 'true');
            } else {
                localStorage.removeItem('ingrevo_saved_email');
                localStorage.removeItem('ingrevo_remember_me');
            }
            
            // Show success message
            showSuccess('Login successful! Redirecting...');
            
            // Redirect after short delay
            setTimeout(() => {
                redirectToDashboard();
            }, 1500);
            
        } catch (error) {
            console.error('❌ Sign-in error:', error);
            showLoading(false);
            handleSignInError(error);
        }
    }

    /**
     * Handle forgot password
     */
    function handleForgotPassword(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!email) {
            showError('Please enter your email address first.');
            emailInput.focus();
            return;
        }

        if (!validateEmail(email)) {
            showError('Please enter a valid email address.');
            return;
        }

        if (!window.firebaseAuth) {
            showError('Firebase is not initialized.');
            return;
        }

        showLoading(true);
        hideError();

        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                showLoading(false);
                showSuccess(`Password reset email sent to ${email}. Check your inbox.`);
                console.log('✅ Password reset email sent');
            })
            .catch((error) => {
                showLoading(false);
                console.error('❌ Password reset error:', error);
                
                if (error.code === 'auth/user-not-found') {
                    showError('No account found with this email address.');
                } else {
                    showError('Failed to send reset email. Please try again.');
                }
            });
    }

    /**
     * Validate email format
     */
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Store user session in localStorage
     */
    function storeUserSession(user) {
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL || null,
            emailVerified: user.emailVerified,
            loginTime: new Date().toISOString()
        };

        localStorage.setItem('ingrevo_user', JSON.stringify(userData));
        localStorage.setItem('ingrevo_auth_timestamp', new Date().getTime().toString());
        
        console.log('💾 User session stored:', userData.email);
    }

    /**
     * Clear user session from localStorage
     */
    function clearUserSession() {
        localStorage.removeItem('ingrevo_user');
        localStorage.removeItem('ingrevo_auth_timestamp');
        console.log('🗑️ User session cleared');
    }

    /**
     * Handle sign-in errors
     */
    function handleSignInError(error) {
        let errorMessage = 'An unexpected error occurred. Please try again.';

        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email. Please check your email.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password. Please try again.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address format.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'This account has been disabled. Contact support.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many failed attempts. Please try again later.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your internet connection.';
                break;
            case 'auth/invalid-credential':
                errorMessage = 'Invalid email or password. Please try again.';
                break;
            default:
                errorMessage = `Error: ${error.message}`;
        }

        showError(errorMessage);
    }

    /**
     * Show or hide loading indicator
     */
    function showLoading(show, message = 'Signing you in...') {
        if (loadingIndicator) {
            loadingIndicator.style.display = show ? 'block' : 'none';
            if (show && message) {
                const loadingText = loadingIndicator.querySelector('p');
                if (loadingText) loadingText.textContent = message;
            }
        }
        
        if (loginBtn) {
            loginBtn.disabled = show;
        }

        if (loginForm) {
            loginForm.style.opacity = show ? '0.6' : '1';
        }
    }

    /**
     * Show error message
     */
    function showError(message) {
        if (errorMessage && errorText) {
            errorText.textContent = message;
            errorMessage.style.display = 'block';
            
            setTimeout(() => {
                hideError();
            }, 5000);
        }
    }

    /**
     * Hide error message
     */
    function hideError() {
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    }

    /**
     * Show success message
     */
    function showSuccess(message) {
        if (successMessage && successText) {
            successText.textContent = message;
            successMessage.style.display = 'block';
        }
    }

    /**
     * Hide success message
     */
    function hideSuccess() {
        if (successMessage) {
            successMessage.style.display = 'none';
        }
    }

    /**
     * Redirect to admin dashboard
     */
    function redirectToDashboard() {
        console.log('🚀 Redirecting to dashboard...');
        window.location.href = 'admin/dashboard.html';
    }

    /**
     * Listen to auth state changes
     */
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log('👤 User is signed in:', user.email);
        } else {
            console.log('👤 No user signed in');
        }
    });
});
