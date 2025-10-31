/**
 * Ingrevo Allergens Management Script with Firebase
 */

const db = firebase.firestore();
let allergens = [];
let recentAlerts = [];

document.addEventListener('DOMContentLoaded', function() {
    loadAllergensFromFirebase();
    setupEventListeners();
});

/**
 * Load allergens from Firebase
 */
async function loadAllergensFromFirebase() {
    try {
        const snapshot = await db.collection('allergens').get();
        allergens = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        renderAllergensGrid();
        updateAllergenStats();
        console.log(`Loaded ${allergens.length} allergens from Firebase`);
    } catch (error) {
        console.error('Error loading allergens:', error);
        // Use fallback data if Firebase fails
        allergens = [
            { id: '1', name: 'Peanuts', icon: 'fa-peanut', color: '#F59E0B', products: 0, users: 0, severity: 'high' },
            { id: '2', name: 'Lactose', icon: 'fa-cheese', color: '#3B82F6', products: 0, users: 0, severity: 'medium' },
            { id: '3', name: 'Gluten', icon: 'fa-bread-slice', color: '#EF4444', products: 0, users: 0, severity: 'high' },
            { id: '4', name: 'Soy', icon: 'fa-seedling', color: '#10B981', products: 0, users: 0, severity: 'low' },
            { id: '5', name: 'Shellfish', icon: 'fa-fish', color: '#8B5CF6', products: 0, users: 0, severity: 'high' },
            { id: '6', name: 'Eggs', icon: 'fa-egg', color: '#F97316', products: 0, users: 0, severity: 'medium' },
            { id: '7', name: 'Tree Nuts', icon: 'fa-acorn', color: '#EAB308', products: 0, users: 0, severity: 'high' },
            { id: '8', name: 'Fish', icon: 'fa-fish-fins', color: '#06B6D4', products: 0, users: 0, severity: 'medium' }
        ];
        renderAllergensGrid();
    }
    
    // Load recent alerts (you can create an 'alerts' collection for this)
    loadRecentAlerts();
}

/**
 * Load recent alerts
 */
async function loadRecentAlerts() {
    try {
        // If you have an alerts collection
        const snapshot = await db.collection('analytics')
            .where('type', '==', 'allergen_alert')
            .orderBy('dateTime', 'desc')
            .limit(10)
            .get();
        
        recentAlerts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            dateTime: doc.data().dateTime?.toDate() || new Date()
        }));
        
        renderRecentAlerts();
    } catch (error) {
        console.error('Error loading alerts:', error);
        // Use sample data if collection doesn't exist yet
        recentAlerts = [];
        renderRecentAlerts();
    }
}

/**
 * Update allergen statistics
 */
function updateAllergenStats() {
    const totalAllergens = allergens.length;
    const totalUsers = allergens.reduce((sum, a) => sum + (a.users || 0), 0);
    const totalProducts = allergens.reduce((sum, a) => sum + (a.products || 0), 0);
    
    document.getElementById('total-allergens').textContent = totalAllergens;
    document.getElementById('users-tracking').textContent = totalUsers.toLocaleString();
    document.getElementById('products-affected').textContent = totalProducts.toLocaleString();
}

function setupEventListeners() {
    // Add allergen button
    document.getElementById('add-allergen-btn').addEventListener('click', openAddAllergenModal);

    // View all alerts button
    document.getElementById('view-all-alerts').addEventListener('click', () => {
        showNotification('View all alerts functionality coming soon!', 'info');
    });

    // Allergen form submission
    document.getElementById('allergen-form').addEventListener('submit', handleAllergenSubmit);

    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterAllergens(searchTerm);
        });
    }
}

/**
 * Open add allergen modal
 */
function openAddAllergenModal() {
    document.getElementById('modal-title').innerHTML = '<i class="fas fa-plus"></i> Add New Allergen';
    document.getElementById('allergen-form').reset();
    document.getElementById('allergen-form').dataset.mode = 'add';
    document.getElementById('allergen-form').dataset.id = '';
    document.getElementById('allergenModal').style.display = 'flex';
}

/**
 * Open edit allergen modal
 */
window.editAllergen = function(id) {
    const allergen = allergens.find(a => a.id === id);
    if (!allergen) return;

    document.getElementById('modal-title').innerHTML = '<i class="fas fa-edit"></i> Edit Allergen';
    document.getElementById('allergen-name').value = allergen.name;
    document.getElementById('allergen-severity').value = allergen.severity;
    document.getElementById('allergen-icon').value = allergen.icon;
    document.getElementById('allergen-color').value = allergen.color;
    document.getElementById('allergen-description').value = allergen.description || '';
    document.getElementById('allergen-symptoms').value = allergen.symptoms || '';
    document.getElementById('allergen-status').checked = allergen.status !== 'inactive';
    
    document.getElementById('allergen-form').dataset.mode = 'edit';
    document.getElementById('allergen-form').dataset.id = id;
    document.getElementById('allergenModal').style.display = 'flex';
};

/**
 * Close allergen modal
 */
window.closeAllergenModal = function() {
    document.getElementById('allergenModal').style.display = 'none';
    document.getElementById('allergen-form').reset();
};

/**
 * Handle allergen form submission
 */
async function handleAllergenSubmit(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('save-allergen-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;

    try {
        const formData = {
            name: document.getElementById('allergen-name').value.trim(),
            severity: document.getElementById('allergen-severity').value,
            icon: document.getElementById('allergen-icon').value.trim(),
            color: document.getElementById('allergen-color').value,
            description: document.getElementById('allergen-description').value.trim(),
            symptoms: document.getElementById('allergen-symptoms').value.trim(),
            status: document.getElementById('allergen-status').checked ? 'active' : 'inactive',
            products: 0,
            users: 0,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        const mode = document.getElementById('allergen-form').dataset.mode;
        const id = document.getElementById('allergen-form').dataset.id;

        if (mode === 'edit' && id) {
            // Update existing allergen
            await db.collection('allergens').doc(id).update(formData);
            showNotification('Allergen updated successfully!', 'success');
        } else {
            // Add new allergen
            formData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('allergens').add(formData);
            showNotification('Allergen added successfully!', 'success');
        }

        closeAllergenModal();
        loadAllergensFromFirebase();

    } catch (error) {
        console.error('Error saving allergen:', error);
        showNotification('Error saving allergen. Please try again.', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * Delete allergen
 */
window.deleteAllergen = async function(id) {
    const allergen = allergens.find(a => a.id === id);
    if (!allergen) return;

    if (!confirm(`Are you sure you want to delete "${allergen.name}"? This action cannot be undone.`)) {
        return;
    }

    try {
        await db.collection('allergens').doc(id).delete();
        showNotification('Allergen deleted successfully!', 'success');
        loadAllergensFromFirebase();
    } catch (error) {
        console.error('Error deleting allergen:', error);
        showNotification('Error deleting allergen. Please try again.', 'error');
    }
};

/**
 * Filter allergens by search term
 */
function filterAllergens(searchTerm) {
    const grid = document.getElementById('allergens-grid');
    const cards = grid.querySelectorAll('.allergen-card');
    
    cards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        if (name.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function renderAllergensGrid() {
    const grid = document.getElementById('allergens-grid');
    
    if (allergens.length === 0) {
        grid.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #6B7280; grid-column: 1/-1;">
                <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                <p>No allergens found. Click "Add Allergen" to create one.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = allergens.map(allergen => `
        <div class="allergen-card">
            <div class="allergen-header">
                <div class="allergen-icon" style="background: ${allergen.color}20; color: ${allergen.color};">
                    <i class="fas ${allergen.icon}"></i>
                </div>
                <span class="badge badge-${getSeverityBadgeClass(allergen.severity)}">${allergen.severity}</span>
            </div>
            <h3>${allergen.name}</h3>
            ${allergen.description ? `<p class="allergen-description">${allergen.description.substring(0, 80)}${allergen.description.length > 80 ? '...' : ''}</p>` : ''}
            <div class="allergen-stats">
                <div class="stat-item">
                    <i class="fas fa-box"></i>
                    <span>${allergen.products || 0} products</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-users"></i>
                    <span>${allergen.users || 0} users tracking</span>
                </div>
            </div>
            <div class="allergen-actions">
                <button class="btn btn-sm btn-primary" onclick="editAllergen('${allergen.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-secondary" onclick="viewAllergenDetails('${allergen.id}')" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteAllergen('${allergen.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function renderRecentAlerts() {
    const tbody = document.getElementById('alerts-tbody');
    
    tbody.innerHTML = recentAlerts.map(alert => `
        <tr>
            <td>${alert.dateTime}</td>
            <td>${alert.user}</td>
            <td>${alert.product}</td>
            <td><span class="badge badge-warning">${alert.allergen}</span></td>
            <td><span class="badge badge-${getSeverityBadgeClass(alert.severity)}">${alert.severity}</span></td>
            <td><span class="badge badge-${getStatusBadgeClass(alert.status)}">${alert.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="viewAlert('${alert.id}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="resolveAlert('${alert.id}')" title="Resolve">
                        <i class="fas fa-check"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getSeverityBadgeClass(severity) {
    const classes = {
        'low': 'success',
        'medium': 'warning',
        'high': 'danger'
    };
    return classes[severity] || 'secondary';
}

function getStatusBadgeClass(status) {
    const classes = {
        'active': 'danger',
        'pending': 'warning',
        'resolved': 'success'
    };
    return classes[status] || 'secondary';
}

window.viewAllergenDetails = function(id) {
    const allergen = allergens.find(a => a.id === id);
    if (!allergen) return;
    
    alert(`Allergen: ${allergen.name}\nProducts: ${allergen.products}\nUsers Tracking: ${allergen.users}\nSeverity: ${allergen.severity}`);
};

window.viewAlert = function(id) {
    const alert = recentAlerts.find(a => a.id === id);
    if (!alert) return;
    
    alert(`Alert Details:\n\nUser: ${alert.user}\nProduct: ${alert.product}\nAllergen: ${alert.allergen}\nSeverity: ${alert.severity}\nStatus: ${alert.status}\nTime: ${alert.dateTime}`);
};

window.resolveAlert = function(id) {
    if (confirm('Mark this alert as resolved?')) {
        showNotification('Alert marked as resolved!', 'success');
        // Update alert status
        const alert = recentAlerts.find(a => a.id === id);
        if (alert) {
            alert.status = 'resolved';
            renderRecentAlerts();
        }
    }
};

function showNotification(message, type = 'info') {
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
