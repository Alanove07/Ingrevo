/**
 * Ingrevo Recommendations Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeRecommendationsPage();
});

/**
 * Initialize recommendations page
 */
function initializeRecommendationsPage() {
    // Filter chips
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            filterRecommendations(chip.dataset.filter);
        });
    });
}

/**
 * Filter recommendations
 */
function filterRecommendations(filter) {
    const cards = document.querySelectorAll('.recommendation-card');
    
    cards.forEach(card => {
        // Show all cards for now (in real app, would filter based on filter value)
        card.style.display = 'block';
    });
    
    showNotification(`Showing ${filter === 'all' ? 'all' : filter} alternatives`, 'info');
}

// Add comparison table styles
const style = document.createElement('style');
style.textContent = `
    .recommendations-page {
        padding: 3rem 0;
        min-height: 100vh;
        background: linear-gradient(180deg, var(--gray-50) 0%, var(--white) 100%);
    }
    
    .page-header {
        text-align: center;
        margin-bottom: 3rem;
    }
    
    .page-header h1 {
        margin-bottom: 0.5rem;
    }
    
    .page-header p {
        color: var(--gray-600);
        font-size: 1.125rem;
    }
    
    .current-product-card {
        background: var(--white);
        border-radius: var(--radius-xl);
        padding: 2rem;
        box-shadow: var(--shadow-lg);
        margin-bottom: 2rem;
    }
    
    .comparison-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: var(--radius-full);
        color: var(--accent);
        font-size: 0.875rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
    }
    
    .current-product {
        display: flex;
        align-items: center;
        gap: 2rem;
    }
    
    .product-image {
        width: 100px;
        height: 100px;
        background: var(--gray-100);
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        color: var(--gray-300);
    }
    
    .product-details {
        flex: 1;
    }
    
    .product-details h3 {
        margin-bottom: 0.5rem;
    }
    
    .brand {
        color: var(--gray-600);
        margin-bottom: 1rem;
    }
    
    .product-issues {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
    }
    
    .issue-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid var(--danger);
        border-radius: var(--radius-full);
        color: var(--danger);
        font-size: 0.875rem;
    }
    
    .score-display {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .score-label {
        color: var(--gray-600);
    }
    
    .score-value {
        padding: 0.5rem 1rem;
        border-radius: var(--radius);
        font-weight: 700;
        font-size: 1.25rem;
    }
    
    .score-value.poor {
        background: #FEE2E2;
        color: #EF4444;
    }
    
    .recommendations-filters {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
    }
    
    .filter-chip {
        padding: 0.75rem 1.5rem;
        background: var(--white);
        border: 2px solid var(--gray-300);
        border-radius: var(--radius-full);
        font-weight: 600;
        color: var(--gray-700);
        cursor: pointer;
        transition: all var(--transition-fast);
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .filter-chip:hover {
        border-color: var(--primary);
    }
    
    .filter-chip.active {
        background: var(--primary);
        border-color: var(--primary);
        color: var(--white);
    }
    
    .ai-tips-card {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%);
        border: 2px solid rgba(59, 130, 246, 0.3);
        border-radius: var(--radius-xl);
        padding: 2rem;
        margin-bottom: 3rem;
        display: flex;
        gap: 2rem;
        align-items: start;
    }
    
    .ai-icon {
        width: 4rem;
        height: 4rem;
        background: linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%);
        color: var(--white);
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        flex-shrink: 0;
        animation: pulse 2s infinite;
    }
    
    .ai-content h3 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
        color: var(--accent);
    }
    
    .ai-content p {
        color: var(--gray-700);
        line-height: 1.7;
        margin: 0;
    }
    
    .recommendations-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }
    
    .recommendation-card {
        background: var(--white);
        border-radius: var(--radius-xl);
        overflow: hidden;
        box-shadow: var(--shadow);
        transition: all var(--transition-base);
        position: relative;
    }
    
    .recommendation-card:hover {
        transform: translateY(-8px);
        box-shadow: var(--shadow-lg);
    }
    
    .recommendation-card.best-match {
        border: 3px solid var(--primary);
    }
    
    .card-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0.5rem 1rem;
        border-radius: var(--radius-full);
        font-size: 0.75rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 1;
    }
    
    .card-badge.best {
        background: var(--primary);
        color: var(--white);
        box-shadow: 0 4px 15px rgba(20, 184, 166, 0.4);
    }
    
    .card-badge.good {
        background: var(--success);
        color: var(--white);
    }
    
    .card-badge:not(.best):not(.good) {
        background: var(--gray-100);
        color: var(--gray-700);
    }
    
    .card-image {
        height: 200px;
        background: var(--gray-100);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4rem;
        color: var(--gray-300);
    }
    
    .card-content {
        padding: 1.5rem;
    }
    
    .card-content h3 {
        margin-bottom: 0.25rem;
    }
    
    .card-content .brand {
        color: var(--gray-600);
        margin-bottom: 1.5rem;
    }
    
    .comparison-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: var(--gray-50);
        border-radius: var(--radius);
    }
    
    .stat-item {
        text-align: center;
    }
    
    .stat-label {
        display: block;
        font-size: 0.75rem;
        color: var(--gray-600);
        margin-bottom: 0.25rem;
    }
    
    .stat-value {
        font-weight: 700;
        font-size: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
    }
    
    .stat-value i {
        font-size: 0.875rem;
        color: var(--success);
    }
    
    .stat-value.excellent {
        color: var(--success);
    }
    
    .stat-value.good {
        color: var(--primary);
    }
    
    .benefits {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
    }
    
    .benefit {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
    }
    
    .benefit i {
        color: var(--success);
    }
    
    .benefit i.warning {
        color: var(--warning);
    }
    
    .card-actions {
        display: flex;
        gap: 0.75rem;
    }
    
    .card-actions .btn-primary {
        flex: 1;
    }
    
    .comparison-section {
        margin-top: 4rem;
    }
    
    .comparison-section h2 {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 2rem;
    }
    
    .comparison-table {
        background: var(--white);
        border-radius: var(--radius-xl);
        padding: 2rem;
        box-shadow: var(--shadow);
        overflow-x: auto;
    }
    
    .comparison-table table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .comparison-table th,
    .comparison-table td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid var(--gray-200);
    }
    
    .comparison-table th {
        font-weight: 600;
        color: var(--gray-700);
        background: var(--gray-50);
    }
    
    .comparison-table tr.original {
        background: rgba(239, 68, 68, 0.05);
    }
    
    .comparison-table tr.highlight {
        background: rgba(20, 184, 166, 0.05);
    }
    
    .comparison-table .score-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 700;
    }
    
    @media (max-width: 768px) {
        .recommendations-grid {
            grid-template-columns: 1fr;
        }
        
        .comparison-table {
            padding: 1rem;
        }
        
        .comparison-table table {
            font-size: 0.875rem;
        }
    }
`;
document.head.appendChild(style);
