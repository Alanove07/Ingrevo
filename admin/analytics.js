/**
 * Ingrevo Analytics Script
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
});

function initializeCharts() {
    // Scans Trend Chart
    const scansTrendCtx = document.getElementById('scans-trend-chart');
    if (scansTrendCtx) {
        new Chart(scansTrendCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Product Scans',
                    data: [8500, 9200, 10500, 11200],
                    borderColor: '#0891B2',
                    backgroundColor: 'rgba(8, 145, 178, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Allergen Queries Chart
    const allergenQueriesCtx = document.getElementById('allergen-queries-chart');
    if (allergenQueriesCtx) {
        new Chart(allergenQueriesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Peanuts', 'Lactose', 'Gluten', 'Soy', 'Shellfish', 'Others'],
                datasets: [{
                    data: [850, 720, 680, 450, 320, 380],
                    backgroundColor: [
                        '#F59E0B',
                        '#3B82F6',
                        '#EF4444',
                        '#10B981',
                        '#8B5CF6',
                        '#6B7280'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }

    // Engagement Chart
    const engagementCtx = document.getElementById('engagement-chart');
    if (engagementCtx) {
        new Chart(engagementCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Daily Active Users',
                    data: [1200, 1400, 1350, 1500, 1600, 1800, 1700],
                    backgroundColor: '#0891B2'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}
