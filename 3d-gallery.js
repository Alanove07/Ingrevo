/**
 * Ingrevo 3D Gallery Script
 */

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    setupEventListeners();
});

/**
 * Initialize gallery
 */
function initializeGallery() {
    // Set initial model
    showModel('fixed');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modelType = this.dataset.model;
            switchModel(modelType);
        });
    });

    // Reset camera button
    document.getElementById('reset-camera').addEventListener('click', resetCamera);

    // Toggle rotation button
    document.getElementById('toggle-rotate').addEventListener('click', toggleRotation);

    // Fullscreen button
    document.getElementById('fullscreen-btn').addEventListener('click', toggleFullscreen);

    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Model viewer events
    const modelViewers = document.querySelectorAll('model-viewer');
    modelViewers.forEach(viewer => {
        viewer.addEventListener('load', function() {
            console.log('Model loaded successfully');
        });

        viewer.addEventListener('error', function(event) {
            console.error('Error loading model:', event);
            showNotification('Error loading 3D model. Please check the file path.', 'error');
        });
    });
}

/**
 * Switch between models
 */
function switchModel(modelType) {
    // Update tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        if (btn.dataset.model === modelType) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update model viewers
    showModel(modelType);

    // Update info cards
    showInfo(modelType);
}

/**
 * Show specific model
 */
function showModel(modelType) {
    const fixedModel = document.getElementById('fixed-model');
    const cartModel = document.getElementById('cart-model');

    if (modelType === 'fixed') {
        fixedModel.classList.add('active');
        cartModel.classList.remove('active');
    } else {
        cartModel.classList.add('active');
        fixedModel.classList.remove('active');
    }
}

/**
 * Show specific info card
 */
function showInfo(modelType) {
    const fixedInfo = document.getElementById('fixed-info');
    const cartInfo = document.getElementById('cart-info');

    if (modelType === 'fixed') {
        fixedInfo.style.display = 'block';
        cartInfo.style.display = 'none';
    } else {
        cartInfo.style.display = 'block';
        fixedInfo.style.display = 'none';
    }
}

/**
 * Reset camera to default position
 */
function resetCamera() {
    const activeViewer = document.querySelector('.model-viewer-wrapper.active model-viewer');
    if (activeViewer) {
        activeViewer.cameraOrbit = '45deg 75deg 2.5m';
        activeViewer.fieldOfView = '45deg';
        showNotification('Camera reset to default position', 'success');
    }
}

/**
 * Toggle auto-rotation
 */
function toggleRotation() {
    const activeViewer = document.querySelector('.model-viewer-wrapper.active model-viewer');
    const rotateText = document.getElementById('rotate-text');
    
    if (activeViewer) {
        const isRotating = activeViewer.autoRotate;
        activeViewer.autoRotate = !isRotating;
        
        if (isRotating) {
            rotateText.textContent = 'Resume Rotation';
            showNotification('Auto-rotation paused', 'info');
        } else {
            rotateText.textContent = 'Pause Rotation';
            showNotification('Auto-rotation resumed', 'info');
        }
    }
}

/**
 * Toggle fullscreen mode
 */
function toggleFullscreen() {
    const viewerContainer = document.querySelector('.viewer-container');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const icon = fullscreenBtn.querySelector('i');
    
    if (!document.fullscreenElement) {
        viewerContainer.requestFullscreen().then(() => {
            icon.classList.remove('fa-expand');
            icon.classList.add('fa-compress');
            viewerContainer.classList.add('fullscreen-mode');
        }).catch(err => {
            console.error('Error entering fullscreen:', err);
            showNotification('Fullscreen mode not available', 'error');
        });
    } else {
        document.exitFullscreen().then(() => {
            icon.classList.remove('fa-compress');
            icon.classList.add('fa-expand');
            viewerContainer.classList.remove('fullscreen-mode');
        });
    }
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'error' ? 'exclamation-triangle' : 
                 'info-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: slideInRight 0.3s ease;
        font-family: 'Poppins', sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Listen for fullscreen change
document.addEventListener('fullscreenchange', function() {
    const viewerContainer = document.querySelector('.viewer-container');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const icon = fullscreenBtn.querySelector('i');
    
    if (!document.fullscreenElement) {
        icon.classList.remove('fa-compress');
        icon.classList.add('fa-expand');
        viewerContainer.classList.remove('fullscreen-mode');
    }
});

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
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
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
