/**
 * Ingrevo Web App - Main JavaScript
 * Handles navigation, modals, theme, and common functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Ingrevo App Initialized');
    
    // Initialize common features
    initNavigation();
    initModals();
    initTheme();
});

/**
 * Navigation Functions
 */
function initNavigation() {
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
    
    // Login button
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    
    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', () => {
            loginModal.classList.add('active');
        });
    }
}

/**
 * Modal Functions
 */
function initModals() {
    // Close login modal
    const closeLogin = document.getElementById('close-login');
    const loginModal = document.getElementById('login-modal');
    
    if (closeLogin && loginModal) {
        closeLogin.addEventListener('click', () => {
            loginModal.classList.remove('active');
        });
        
        // Close on outside click
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
            }
        });
    }
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

/**
 * Handle login
 */
function handleLogin(e) {
    e.preventDefault();
    
    // Show loading
    showNotification('Signing in...', 'info');
    
    // Simulate authentication
    setTimeout(() => {
        showNotification('Successfully signed in!', 'success');
        document.getElementById('login-modal').classList.remove('active');
        
        // Update UI
        const loginBtn = document.getElementById('login-btn');
        loginBtn.innerHTML = '<i class="fas fa-user-circle"></i> Profile';
        loginBtn.onclick = () => window.location.href = 'profile.html';
    }, 1000);
}

/**
 * Theme Toggle
 */
/**
 * Initialize Theme System (Light/Dark Mode)
 */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        console.log('🎨 Theme system initialized');
        
        // Toggle theme function
        const toggleTheme = () => {
            const isDark = document.body.classList.toggle('dark-mode');
            const icon = themeToggle.querySelector('i');
            
            // Update icon
            if (isDark) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
            
            // Save preference
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            console.log(`✨ Theme switched to: ${isDark ? 'dark' : 'light'}`);
            
            // Dispatch custom event for other components
            window.dispatchEvent(new CustomEvent('themeChanged', { 
                detail: { theme: isDark ? 'dark' : 'light' } 
            }));
        };
        
        // Add click event
        themeToggle.addEventListener('click', toggleTheme);
        
        // Load saved theme on page load
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
        
        if (shouldBeDark) {
            document.body.classList.add('dark-mode');
            const icon = themeToggle.querySelector('i');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            console.log('🌙 Dark mode loaded from preferences');
        } else {
            console.log('☀️ Light mode active');
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    document.body.classList.add('dark-mode');
                    const icon = themeToggle.querySelector('i');
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    document.body.classList.remove('dark-mode');
                    const icon = themeToggle.querySelector('i');
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }
        });
    } else {
        console.warn('⚠️ Theme toggle button not found');
    }
}

/**
 * Scroll to features
 */
function scrollToFeatures() {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 99999;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @media (max-width: 768px) {
        .nav-links.active {
            display: flex !important;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border-top: 1px solid #E5E7EB;
            padding: 1rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
    }
`;
document.head.appendChild(style);
