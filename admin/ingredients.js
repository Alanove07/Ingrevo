/**
 * Ingrevo Ingredients Management Script with Firebase
 */

let ingredients = [];
let currentPage = 1;
const itemsPerPage = 10;
let filteredIngredients = [];
let editingIngredientId = null;
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
    loadIngredientsFromFirebase();
    setupEventListeners();
});

/**
 * Load ingredients from Firebase
 */
async function loadIngredientsFromFirebase() {
    try {
        const snapshot = await db.collection('ingredients').orderBy('createdAt', 'desc').get();
        ingredients = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        
        filteredIngredients = [...ingredients];
        renderIngredients();
        console.log(`Loaded ${ingredients.length} ingredients from Firebase`);
    } catch (error) {
        console.error('Error loading ingredients:', error);
        showNotification('Error loading ingredients: ' + error.message, 'error');
    }
}

function setupEventListeners() {
    document.getElementById('add-ingredient-btn').addEventListener('click', openAddModal);
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('cancel-btn').addEventListener('click', closeModal);
    document.getElementById('ingredient-form').addEventListener('submit', handleSubmit);
    document.getElementById('allergen-filter').addEventListener('change', applyFilters);
    document.getElementById('search-input').addEventListener('input', handleSearch);
    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));
    document.getElementById('select-all').addEventListener('change', handleSelectAll);

    window.addEventListener('click', function(e) {
        const modal = document.getElementById('ingredient-modal');
        if (e.target === modal) closeModal();
    });
}

function renderIngredients() {
    const tbody = document.getElementById('ingredients-tbody');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageIngredients = filteredIngredients.slice(start, end);

    if (pageIngredients.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-flask"></i>
                        <p>No ingredients found</p>
                    </div>
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = pageIngredients.map(ingredient => `
            <tr>
                <td><input type="checkbox" class="ingredient-checkbox" data-id="${ingredient.id}"></td>
                <td><strong>${ingredient.name}</strong></td>
                <td><span class="badge badge-secondary">${ingredient.category}</span></td>
                <td>
                    ${ingredient.allergens.length > 0 
                        ? ingredient.allergens.map(a => `<span class="badge badge-warning">${a}</span>`).join(' ')
                        : '<span class="badge badge-success">None</span>'
                    }
                </td>
                <td>
                    <span class="badge badge-${getRiskBadgeClass(ingredient.riskLevel)}">
                        ${ingredient.riskLevel}
                    </span>
                </td>
                <td>${ingredient.productsUsing}</td>
                <td>
                    <span class="badge badge-${ingredient.status === 'active' ? 'success' : 'secondary'}">
                        ${ingredient.status}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="viewIngredient('${ingredient.id}')" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="editIngredient('${ingredient.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-danger" onclick="deleteIngredient('${ingredient.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updateIngredientCount();
    updatePagination();
}

function getRiskBadgeClass(riskLevel) {
    const classes = {
        'safe': 'success',
        'low': 'info',
        'medium': 'warning',
        'high': 'danger'
    };
    return classes[riskLevel] || 'secondary';
}

function openAddModal() {
    editingIngredientId = null;
    document.getElementById('modal-title').textContent = 'Add New Ingredient';
    document.getElementById('ingredient-form').reset();
    document.getElementById('ingredient-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('ingredient-modal').classList.remove('active');
    editingIngredientId = null;
}

async function handleSubmit(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('ingredient-name').value,
        category: document.getElementById('category').value,
        riskLevel: document.getElementById('risk-level').value,
        description: document.getElementById('description').value,
        allergens: Array.from(document.querySelectorAll('input[name="allergen"]:checked')).map(cb => cb.value),
        status: document.getElementById('status').value,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        if (editingIngredientId) {
            // Update existing ingredient
            await db.collection('ingredients').doc(editingIngredientId).update(formData);
            showNotification('Ingredient updated successfully!', 'success');
        } else {
            // Add new ingredient
            formData.productsUsing = 0;
            formData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('ingredients').add(formData);
            showNotification('Ingredient added successfully!', 'success');
        }

        closeModal();
        loadIngredientsFromFirebase();
    } catch (error) {
        console.error('Error saving ingredient:', error);
        showNotification('Error saving ingredient: ' + error.message, 'error');
    }
}

window.editIngredient = function(id) {
    const ingredient = ingredients.find(i => i.id === id);
    if (!ingredient) return;

    editingIngredientId = id;
    document.getElementById('modal-title').textContent = 'Edit Ingredient';
    
    document.getElementById('ingredient-name').value = ingredient.name;
    document.getElementById('category').value = ingredient.category;
    document.getElementById('risk-level').value = ingredient.riskLevel;
    document.getElementById('description').value = ingredient.description || '';
    document.getElementById('status').value = ingredient.status;

    document.querySelectorAll('input[name="allergen"]').forEach(cb => {
        cb.checked = ingredient.allergens.includes(cb.value);
    });

    document.getElementById('ingredient-modal').classList.add('active');
};

window.viewIngredient = function(id) {
    const ingredient = ingredients.find(i => i.id === id);
    if (!ingredient) return;

    alert(`Ingredient Details:\n\nName: ${ingredient.name}\nCategory: ${ingredient.category}\nRisk Level: ${ingredient.riskLevel}\nAllergens: ${ingredient.allergens.join(', ') || 'None'}\nProducts Using: ${ingredient.productsUsing}`);
};

window.deleteIngredient = async function(id) {
    if (confirm('Are you sure you want to delete this ingredient?')) {
        try {
            await db.collection('ingredients').doc(id).delete();
            showNotification('Ingredient deleted successfully!', 'success');
            loadIngredientsFromFirebase();
        } catch (error) {
            console.error('Error deleting ingredient:', error);
            showNotification('Error deleting ingredient: ' + error.message, 'error');
        }
    }
};

function applyFilters() {
    const allergenFilter = document.getElementById('allergen-filter').value;

    filteredIngredients = ingredients.filter(ingredient => {
        const matchesAllergen = !allergenFilter || ingredient.allergens.includes(allergenFilter);
        return matchesAllergen;
    });

    currentPage = 1;
    renderIngredients();
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    filteredIngredients = ingredients.filter(ingredient => {
        return ingredient.name.toLowerCase().includes(searchTerm) ||
               ingredient.category.toLowerCase().includes(searchTerm);
    });

    currentPage = 1;
    renderIngredients();
}

function updateIngredientCount() {
    document.getElementById('ingredient-count').textContent = `${filteredIngredients.length} Ingredients`;
}

function updatePagination() {
    const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);
    document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
    
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages || totalPages === 0;
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderIngredients();
    }
}

function handleSelectAll(e) {
    const checkboxes = document.querySelectorAll('.ingredient-checkbox');
    checkboxes.forEach(cb => cb.checked = e.target.checked);
}

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
