/**
 * Ingrevo Admin Dashboard Script
 * Handles dashboard functionality, authentication, and data display
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard loaded');

    // Check authentication
    checkAuth();

    // Initialize UI
    initializeSidebar();
    initializeChart();
    loadDashboardData();

    // Event listeners
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
});

/**
 * Check if user is authenticated
 */
function checkAuth() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log('User authenticated:', user.email);
            // Display user info
            const userName = document.getElementById('user-name');
            if (userName) {
                userName.textContent = user.displayName || user.email.split('@')[0];
            }
        } else {
            // Redirect to login
            console.log('No user found, redirecting to login');
            window.location.href = '../login.html';
        }
    });
}

/**
 * Initialize sidebar functionality
 */
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebarToggle = document.getElementById('sidebar-toggle');

    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // Sidebar close button
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.remove('active');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 968) {
            if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
}

/**
 * Initialize Chart.js
 */
function initializeChart() {
    const ctx = document.getElementById('scans-chart');
    
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Product Scans',
                    data: [450, 520, 480, 590, 610, 680, 720],
                    borderColor: '#0891B2',
                    backgroundColor: 'rgba(8, 145, 178, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Allergen Alerts',
                    data: [25, 32, 28, 35, 40, 38, 45],
                    borderColor: '#F59E0B',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

/**
 * Load dashboard data from Firebase
 */
async function loadDashboardData() {
    try {
        const db = firebase.firestore();
        
        // Load products count
        const productsSnapshot = await db.collection('products').get();
        const totalProducts = productsSnapshot.size;
        document.querySelector('.stat-card:nth-child(1) h3').textContent = totalProducts.toLocaleString();
        
        // Load ingredients count
        const ingredientsSnapshot = await db.collection('ingredients').get();
        const totalIngredients = ingredientsSnapshot.size;
        document.querySelector('.stat-card:nth-child(2) h3').textContent = totalIngredients.toLocaleString();
        
        // Load allergens count
        const allergensSnapshot = await db.collection('allergens').get();
        const totalAllergens = allergensSnapshot.size;
        
        // Load users count
        const usersSnapshot = await db.collection('users').get();
        const totalUsers = usersSnapshot.size;
        document.querySelector('.stat-card:nth-child(4) h3').textContent = totalUsers.toLocaleString();
        
        // Load analytics data for alerts
        const analyticsSnapshot = await db.collection('analytics')
            .where('type', '==', 'allergen_alert')
            .get();
        const allergenAlerts = analyticsSnapshot.size;
        document.querySelector('.stat-card:nth-child(3) h3').textContent = allergenAlerts.toLocaleString();
        
        console.log('Dashboard data loaded from Firebase');
        
        // Animate numbers
        animateNumbers();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Keep placeholder data if Firebase fails
        animateNumbers();
    }
}

/**
 * Animate stat numbers on page load
 */
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-info h3');
    
    statNumbers.forEach(stat => {
        const text = stat.textContent;
        const hasComma = text.includes(',');
        const number = parseInt(text.replace(/,/g, ''));
        
        if (!isNaN(number)) {
            let current = 0;
            const increment = number / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    stat.textContent = hasComma ? number.toLocaleString() : number;
                    clearInterval(timer);
                } else {
                    stat.textContent = hasComma ? Math.floor(current).toLocaleString() : Math.floor(current);
                }
            }, 20);
        }
    });
}

/**
 * Handle logout
 */
function handleLogout(e) {
    e.preventDefault();
    
    if (confirm('Are you sure you want to logout?')) {
        firebase.auth().signOut()
            .then(() => {
                console.log('User signed out');
                localStorage.clear();
                window.location.href = '../login.html';
            })
            .catch((error) => {
                console.error('Logout error:', error);
                alert('Error signing out. Please try again.');
            });
    }
}

/**
 * Utility: Format date
 */
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

/**
 * Utility: Format time ago
 */
function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }
    
    return 'just now';
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Simple notification (can be enhanced with a library)
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
