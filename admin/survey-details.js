// Survey Details Admin Script

const db = firebase.firestore();
let allSurveys = [];
let filteredSurveys = [];
let roleChart = null;
let timelineChart = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadSurveyResponses();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('apply-filter').addEventListener('click', applyFilter);
    document.getElementById('export-csv').addEventListener('click', exportToCSV);
    document.getElementById('role-filter').addEventListener('change', applyFilter);
}

// Load survey responses from Firebase
async function loadSurveyResponses() {
    try {
        const snapshot = await db.collection('surveyResponses').get();
        
        allSurveys = [];
        snapshot.forEach(doc => {
            allSurveys.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Sort by date (newest first)
        allSurveys.sort((a, b) => {
            const dateA = a.submittedAt ? a.submittedAt.toDate() : new Date(0);
            const dateB = b.submittedAt ? b.submittedAt.toDate() : new Date(0);
            return dateB - dateA;
        });

        filteredSurveys = [...allSurveys];
        
        updateStatCards();
        renderCharts();
        renderTable();
    } catch (error) {
        console.error('Error loading surveys:', error);
        document.getElementById('survey-table-body').innerHTML = `
            <tr>
                <td colspan="5" class="text-center error">
                    <i class="fas fa-exclamation-triangle"></i> Error loading survey responses
                </td>
            </tr>
        `;
    }
}

// Update stat cards
function updateStatCards() {
    const customerCount = allSurveys.filter(s => s.role === 'customer').length;
    const staffCount = allSurveys.filter(s => s.role === 'staff').length;
    const healthCount = allSurveys.filter(s => s.role === 'health').length;
    const volunteerCount = allSurveys.filter(s => s.role === 'volunteer').length;

    document.getElementById('customer-count').textContent = customerCount;
    document.getElementById('staff-count').textContent = staffCount;
    document.getElementById('health-count').textContent = healthCount;
    document.getElementById('volunteer-count').textContent = volunteerCount;
}

// Render charts
function renderCharts() {
    renderRoleChart();
    renderTimelineChart();
}

// Render role distribution chart
function renderRoleChart() {
    const customerCount = allSurveys.filter(s => s.role === 'customer').length;
    const staffCount = allSurveys.filter(s => s.role === 'staff').length;
    const healthCount = allSurveys.filter(s => s.role === 'health').length;
    const volunteerCount = allSurveys.filter(s => s.role === 'volunteer').length;

    const ctx = document.getElementById('roleChart').getContext('2d');
    
    if (roleChart) {
        roleChart.destroy();
    }

    roleChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Customer', 'Staff', 'Health Professional', 'Volunteer'],
            datasets: [{
                data: [customerCount, staffCount, healthCount, volunteerCount],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(251, 146, 60, 0.8)'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Render timeline chart
function renderTimelineChart() {
    // Group surveys by date
    const dateGroups = {};
    
    allSurveys.forEach(survey => {
        const date = survey.submittedAt ? survey.submittedAt.toDate() : new Date();
        const dateKey = date.toISOString().split('T')[0];
        
        if (!dateGroups[dateKey]) {
            dateGroups[dateKey] = 0;
        }
        dateGroups[dateKey]++;
    });

    // Sort dates and get last 30 days
    const sortedDates = Object.keys(dateGroups).sort();
    const labels = sortedDates.slice(-30);
    const data = labels.map(date => dateGroups[date]);

    const ctx = document.getElementById('timelineChart').getContext('2d');
    
    if (timelineChart) {
        timelineChart.destroy();
    }

    timelineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Survey Responses',
                data: data,
                borderColor: 'rgba(99, 102, 241, 1)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

// Apply filter
function applyFilter() {
    const roleFilter = document.getElementById('role-filter').value;
    const dateFrom = document.getElementById('date-from').value;
    const dateTo = document.getElementById('date-to').value;

    filteredSurveys = allSurveys.filter(survey => {
        // Role filter
        if (roleFilter !== 'all' && survey.role !== roleFilter) {
            return false;
        }

        // Date filter
        if (dateFrom || dateTo) {
            const surveyDate = survey.submittedAt ? survey.submittedAt.toDate() : new Date();
            const surveyDateStr = surveyDate.toISOString().split('T')[0];

            if (dateFrom && surveyDateStr < dateFrom) {
                return false;
            }
            if (dateTo && surveyDateStr > dateTo) {
                return false;
            }
        }

        return true;
    });

    renderTable();
}

// Render table
function renderTable() {
    const tbody = document.getElementById('survey-table-body');
    document.getElementById('total-count').textContent = `Total: ${filteredSurveys.length}`;

    if (filteredSurveys.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    <i class="fas fa-inbox"></i> No survey responses found
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredSurveys.map(survey => {
        const date = survey.submittedAt ? survey.submittedAt.toDate().toLocaleString() : 'N/A';
        const name = survey.name || 'Anonymous';
        const roleIcon = getRoleIcon(survey.role);
        const roleBadge = getRoleBadge(survey.role);

        return `
            <tr>
                <td>${survey.id.substring(0, 8)}...</td>
                <td>${roleBadge}</td>
                <td>${name}</td>
                <td>${date}</td>
                <td>
                    <button class="btn-icon" onclick="viewDetails('${survey.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon danger" onclick="deleteResponse('${survey.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Get role icon
function getRoleIcon(role) {
    const icons = {
        customer: 'fa-users',
        staff: 'fa-user-tie',
        health: 'fa-stethoscope',
        volunteer: 'fa-clipboard-list'
    };
    return icons[role] || 'fa-user';
}

// Get role badge
function getRoleBadge(role) {
    const badges = {
        customer: '<span class="badge badge-customer"><i class="fas fa-users"></i> Customer</span>',
        staff: '<span class="badge badge-staff"><i class="fas fa-user-tie"></i> Staff</span>',
        health: '<span class="badge badge-health"><i class="fas fa-stethoscope"></i> Health</span>',
        volunteer: '<span class="badge badge-volunteer"><i class="fas fa-clipboard-list"></i> Volunteer</span>'
    };
    return badges[role] || '<span class="badge">Unknown</span>';
}

// View details
window.viewDetails = function(surveyId) {
    const survey = filteredSurveys.find(s => s.id === surveyId);
    if (!survey) return;

    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modal-body');

    // Format survey data for display
    let html = `
        <div class="detail-grid">
            <div class="detail-item">
                <strong>Survey ID:</strong>
                <span>${survey.id}</span>
            </div>
            <div class="detail-item">
                <strong>Role:</strong>
                <span>${getRoleBadge(survey.role)}</span>
            </div>
            <div class="detail-item">
                <strong>Submitted:</strong>
                <span>${survey.submittedAt ? survey.submittedAt.toDate().toLocaleString() : 'N/A'}</span>
            </div>
    `;

    // Add all survey fields
    Object.keys(survey).forEach(key => {
        if (key !== 'id' && key !== 'role' && key !== 'surveyType' && key !== 'submittedAt' && key !== 'device' && key !== 'userAgent' && key !== 'timestamp' && key !== 'screenResolution' && key !== 'platform') {
            const value = survey[key];
            if (value !== null && value !== undefined && value !== '') {
                html += `
                    <div class="detail-item">
                        <strong>${formatFieldName(key)}:</strong>
                        <span>${formatFieldValue(value)}</span>
                    </div>
                `;
            }
        }
    });

    html += '</div>';
    modalBody.innerHTML = html;
    modal.style.display = 'flex';
};

// Close detail modal
window.closeDetailModal = function() {
    document.getElementById('detailModal').style.display = 'none';
};

// Format field name
function formatFieldName(key) {
    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

// Format field value
function formatFieldValue(value) {
    if (Array.isArray(value)) {
        return value.join(', ');
    }
    if (typeof value === 'object') {
        return JSON.stringify(value, null, 2);
    }
    return value;
}

// Delete response
window.deleteResponse = async function(surveyId) {
    if (!confirm('Are you sure you want to delete this survey response? This action cannot be undone.')) {
        return;
    }

    try {
        await db.collection('surveyResponses').doc(surveyId).delete();
        alert('Survey response deleted successfully');
        loadSurveyResponses();
    } catch (error) {
        console.error('Error deleting survey:', error);
        alert('Error deleting survey response');
    }
};

// Export to CSV
function exportToCSV() {
    if (filteredSurveys.length === 0) {
        alert('No data to export');
        return;
    }

    // Get all unique keys
    const allKeys = new Set();
    filteredSurveys.forEach(survey => {
        Object.keys(survey).forEach(key => allKeys.add(key));
    });

    const keys = Array.from(allKeys).filter(k => k !== 'device' && k !== 'userAgent' && k !== 'platform');

    // Create CSV header
    let csv = keys.join(',') + '\n';

    // Add rows
    filteredSurveys.forEach(survey => {
        const row = keys.map(key => {
            let value = survey[key];
            
            if (key === 'submittedAt' && value) {
                value = value.toDate().toISOString();
            } else if (Array.isArray(value)) {
                value = value.join('; ');
            } else if (typeof value === 'object' && value !== null) {
                value = JSON.stringify(value);
            }
            
            // Escape commas and quotes
            if (value && typeof value === 'string') {
                value = value.replace(/"/g, '""');
                if (value.includes(',') || value.includes('\n')) {
                    value = `"${value}"`;
                }
            }
            
            return value || '';
        });
        csv += row.join(',') + '\n';
    });

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `survey-responses-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('detailModal');
    if (e.target === modal) {
        closeDetailModal();
    }
});
