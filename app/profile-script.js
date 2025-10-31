/**
 * Ingrevo Profile Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeProfilePage();
    loadSavedProducts();
    loadScanHistory();
});

/**
 * Initialize profile page
 */
function initializeProfilePage() {
    // Profile navigation
    const navItems = document.querySelectorAll('.profile-nav-item');
    const sections = document.querySelectorAll('.profile-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.dataset.section + '-section';
            
            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked
            item.classList.add('active');
            document.getElementById(sectionId).classList.add('active');
        });
    });
    
    // Dietary preferences
    const preferenceCards = document.querySelectorAll('.preference-card input');
    preferenceCards.forEach(input => {
        input.addEventListener('change', () => {
            const card = input.closest('.preference-card');
            if (input.checked) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
        
        // Load saved preferences
        if (input.checked) {
            input.closest('.preference-card').classList.add('selected');
        }
    });
}

/**
 * Load saved products
 */
function loadSavedProducts() {
    const savedProducts = JSON.parse(localStorage.getItem('savedProducts') || '[]');
    const container = document.querySelector('.saved-grid');
    
    if (!container) return;
    
    if (savedProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-bookmark" style="font-size: 3rem; color: var(--gray-300); margin-bottom: 1rem;"></i>
                <p>No saved products yet</p>
                <a href="scan.html" class="btn-primary" style="margin-top: 1rem;">Start Scanning</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = savedProducts.map(product => `
        <div class="product-card">
            <div class="product-card-image">
                <i class="fas fa-box"></i>
            </div>
            <div class="product-card-info">
                <h4>${product.name}</h4>
                <p>${product.category}</p>
                <div class="product-card-meta">
                    <span class="badge-success">Safe</span>
                    <span class="score">${product.healthScore}</span>
                </div>
            </div>
            <button class="product-card-action" onclick="removeProduct('${product.barcode}')">
                <i class="fas fa-bookmark-slash"></i>
            </button>
        </div>
    `).join('');
}

/**
 * Load scan history
 */
function loadScanHistory() {
    // Mock scan history
    const history = [
        { name: 'Organic Whole Milk', date: 'Oct 30, 2025', safe: true, score: 85 },
        { name: 'Peanut Butter Cookies', date: 'Oct 29, 2025', safe: false, score: 62 },
        { name: 'Gluten-Free Bread', date: 'Oct 28, 2025', safe: true, score: 92 },
        { name: 'Almond Milk', date: 'Oct 27, 2025', safe: true, score: 88 }
    ];
    
    const container = document.querySelector('.history-list');
    if (!container) return;
    
    container.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-icon ${item.safe ? 'safe' : 'warning'}">
                <i class="fas fa-${item.safe ? 'check-circle' : 'exclamation-triangle'}"></i>
            </div>
            <div class="history-info">
                <h4>${item.name}</h4>
                <p>Scanned on ${item.date} • ${item.safe ? 'Safe' : 'Contains allergens'}</p>
            </div>
            <div class="history-score">
                <span class="score-badge ${getScoreClass(item.score)}">${item.score}</span>
            </div>
            <button class="btn-icon">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `).join('');
}

/**
 * Get score class
 */
function getScoreClass(score) {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'fair';
    return 'warning';
}

/**
 * Remove product
 */
window.removeProduct = function(barcode) {
    let savedProducts = JSON.parse(localStorage.getItem('savedProducts') || '[]');
    savedProducts = savedProducts.filter(p => p.barcode !== barcode);
    localStorage.setItem('savedProducts', JSON.stringify(savedProducts));
    
    showNotification('Product removed from saved list', 'success');
    loadSavedProducts();
};

// Add CSS for selected preference cards
const style = document.createElement('style');
style.textContent = `
    .preference-card {
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        border: 2px solid var(--gray-200);
    }
    
    .preference-card input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
    }
    
    .preference-card:hover {
        border-color: var(--primary);
        transform: translateY(-2px);
    }
    
    .preference-card.selected {
        border-color: var(--primary);
        background: rgba(20, 184, 166, 0.05);
    }
    
    .card-check {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        background: var(--primary);
        color: white;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
    }
    
    .preference-card.selected .card-check {
        display: flex;
    }
    
    .toggle {
        position: relative;
        display: inline-block;
        width: 48px;
        height: 24px;
    }
    
    .toggle input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--gray-300);
        transition: 0.3s;
        border-radius: 24px;
    }
    
    .slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.3s;
        border-radius: 50%;
    }
    
    input:checked + .slider {
        background-color: var(--primary);
    }
    
    input:checked + .slider:before {
        transform: translateX(24px);
    }
    
    .allergen-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: var(--white);
        border: 2px solid var(--gray-200);
        border-radius: var(--radius-lg);
        margin-bottom: 1rem;
    }
    
    .allergen-icon {
        width: 3rem;
        height: 3rem;
        border-radius: var(--radius);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
    }
    
    .allergen-info {
        flex: 1;
    }
    
    .allergen-info h4 {
        margin-bottom: 0.25rem;
    }
    
    .severity {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-weight: 600;
    }
    
    .severity.high {
        background: #FEE2E2;
        color: #EF4444;
    }
    
    .severity.medium {
        background: #FEF3C7;
        color: #F59E0B;
    }
    
    .severity.low {
        background: #D1FAE5;
        color: #10B981;
    }
    
    .score-badge {
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-weight: 700;
    }
    
    .score-badge.excellent {
        background: #D1FAE5;
        color: #10B981;
    }
    
    .score-badge.good {
        background: #DBEAFE;
        color: #3B82F6;
    }
    
    .score-badge.fair {
        background: #FEF3C7;
        color: #F59E0B;
    }
    
    .score-badge.warning {
        background: #FEE2E2;
        color: #EF4444;
    }
    
    .history-icon {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
    }
    
    .history-icon.safe {
        background: #D1FAE5;
        color: #10B981;
    }
    
    .history-icon.warning {
        background: #FEE2E2;
        color: #EF4444;
    }
`;
document.head.appendChild(style);
