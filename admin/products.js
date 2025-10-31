/**
 * Ingrevo Products Management Script
 * Handles product CRUD operations and UI interactions with Firebase
 */

let products = [];
let currentPage = 1;
const itemsPerPage = 10;
let filteredProducts = [];
let editingProductId = null;
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
    console.log('Products page loaded');

    // Initialize
    loadProductsFromFirebase();
    setupEventListeners();
});

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Add product button
    document.getElementById('add-product-btn').addEventListener('click', openAddModal);

    // Modal close buttons
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('cancel-btn').addEventListener('click', closeModal);

    // Form submit
    document.getElementById('product-form').addEventListener('submit', handleSubmit);

    // Filters
    document.getElementById('category-filter').addEventListener('change', applyFilters);
    document.getElementById('allergen-filter').addEventListener('change', applyFilters);

    // Search
    document.getElementById('search-input').addEventListener('input', handleSearch);

    // Pagination
    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));

    // Select all checkbox
    document.getElementById('select-all').addEventListener('change', handleSelectAll);

    // Close modal on outside click
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('product-modal');
        if (e.target === modal) {
            closeModal();
        }
    });
}

/**
 * Render products table
 */
function renderProducts() {
    const tbody = document.getElementById('products-tbody');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageProducts = filteredProducts.slice(start, end);

    if (pageProducts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-box-open"></i>
                        <p>No products found</p>
                    </div>
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = pageProducts.map(product => `
            <tr>
                <td>
                    <input type="checkbox" class="product-checkbox" data-id="${product.id}">
                </td>
                <td>
                    <div class="product-image">
                        <i class="fas fa-box"></i>
                    </div>
                </td>
                <td>
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <small>${product.brand || 'N/A'}</small>
                    </div>
                </td>
                <td>${product.barcode}</td>
                <td><span class="badge badge-secondary">${product.category}</span></td>
                <td><small>${product.ingredients.slice(0, 3).join(', ')}${product.ingredients.length > 3 ? '...' : ''}</small></td>
                <td>
                    ${product.allergens.map(a => 
                        `<span class="badge badge-warning">${a}</span>`
                    ).join(' ')}
                </td>
                <td>
                    <span class="badge badge-${product.status === 'active' ? 'success' : 'secondary'}">
                        ${product.status}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="viewProduct('${product.id}')" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="editProduct('${product.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-danger" onclick="deleteProduct('${product.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updateProductCount();
    updatePagination();
}

/**
 * Open add product modal
 */
function openAddModal() {
    editingProductId = null;
    document.getElementById('modal-title').textContent = 'Add New Product';
    document.getElementById('product-form').reset();
    document.getElementById('product-modal').classList.add('active');
}

/**
 * Close modal
 */
function closeModal() {
    document.getElementById('product-modal').classList.remove('active');
    editingProductId = null;
}

/**
 * Load products from Firebase
 */
async function loadProductsFromFirebase() {
    try {
        const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
        products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        
        filteredProducts = [...products];
        renderProducts();
        console.log(`Loaded ${products.length} products from Firebase`);
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Error loading products: ' + error.message, 'error');
    }
}

/**
 * Handle form submit
 */
async function handleSubmit(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('product-name').value,
        barcode: document.getElementById('barcode').value,
        category: document.getElementById('category').value,
        brand: document.getElementById('brand').value,
        description: document.getElementById('description').value,
        ingredients: document.getElementById('ingredients').value.split(',').map(i => i.trim()),
        allergens: Array.from(document.querySelectorAll('input[name="allergen"]:checked')).map(cb => cb.value),
        status: document.getElementById('status').value,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        if (editingProductId) {
            // Update existing product in Firebase
            await db.collection('products').doc(editingProductId).update(formData);
            showNotification('Product updated successfully!', 'success');
        } else {
            // Add new product to Firebase
            formData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('products').add(formData);
            showNotification('Product added successfully!', 'success');
        }

        closeModal();
        loadProductsFromFirebase(); // Reload products
    } catch (error) {
        console.error('Error saving product:', error);
        showNotification('Error saving product: ' + error.message, 'error');
    }
}

/**
 * Edit product
 */
window.editProduct = function(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    editingProductId = id;
    document.getElementById('modal-title').textContent = 'Edit Product';
    
    // Fill form
    document.getElementById('product-name').value = product.name;
    document.getElementById('barcode').value = product.barcode;
    document.getElementById('category').value = product.category;
    document.getElementById('brand').value = product.brand || '';
    document.getElementById('description').value = product.description || '';
    document.getElementById('ingredients').value = product.ingredients.join(', ');
    document.getElementById('status').value = product.status;

    // Set allergen checkboxes
    document.querySelectorAll('input[name="allergen"]').forEach(cb => {
        cb.checked = product.allergens.includes(cb.value);
    });

    document.getElementById('product-modal').classList.add('active');
};

/**
 * View product
 */
window.viewProduct = function(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    alert(`Product Details:\n\nName: ${product.name}\nBarcode: ${product.barcode}\nCategory: ${product.category}\nIngredients: ${product.ingredients.join(', ')}\nAllergens: ${product.allergens.join(', ')}`);
};

/**
 * Delete product
 */
window.deleteProduct = async function(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            await db.collection('products').doc(id).delete();
            showNotification('Product deleted successfully!', 'success');
            loadProductsFromFirebase(); // Reload products
        } catch (error) {
            console.error('Error deleting product:', error);
            showNotification('Error deleting product: ' + error.message, 'error');
        }
    }
};

/**
 * Apply filters
 */
function applyFilters() {
    const categoryFilter = document.getElementById('category-filter').value;
    const allergenFilter = document.getElementById('allergen-filter').value;

    filteredProducts = products.filter(product => {
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        const matchesAllergen = !allergenFilter || product.allergens.includes(allergenFilter);
        return matchesCategory && matchesAllergen;
    });

    currentPage = 1;
    renderProducts();
}

/**
 * Handle search
 */
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    filteredProducts = products.filter(product => {
        return product.name.toLowerCase().includes(searchTerm) ||
               product.barcode.includes(searchTerm) ||
               product.brand?.toLowerCase().includes(searchTerm);
    });

    currentPage = 1;
    renderProducts();
}

/**
 * Update product count
 */
function updateProductCount() {
    document.getElementById('product-count').textContent = `${filteredProducts.length} Products`;
}

/**
 * Update pagination
 */
function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
    
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages || totalPages === 0;
}

/**
 * Change page
 */
function changePage(direction) {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderProducts();
    }
}

/**
 * Handle select all
 */
function handleSelectAll(e) {
    const checkboxes = document.querySelectorAll('.product-checkbox');
    checkboxes.forEach(cb => cb.checked = e.target.checked);
}

/**
 * Show notification
 */
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
