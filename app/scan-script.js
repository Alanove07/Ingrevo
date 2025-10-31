/**
 * Ingrevo Scan Page JavaScript
 * Handles camera scanning, barcode entry, and product analysis
 */

let cameraStream = null;
let cameraActive = false;

// Mock product database
const mockProducts = {
    '123456789012': {
        name: 'Organic Whole Milk',
        brand: 'Farm Fresh',
        category: 'Dairy',
        barcode: '123456789012',
        image: null,
        ingredients: ['Organic Milk', 'Vitamin D3'],
        allergens: ['lactose'],
        healthScore: 85,
        nutrition: {
            calories: 150,
            fat: '8g',
            carbs: '12g',
            protein: '8g',
            sodium: '120mg'
        }
    },
    '987654321098': {
        name: 'Peanut Butter Cookies',
        brand: 'Sweet Treats',
        category: 'Snacks',
        barcode: '987654321098',
        image: null,
        ingredients: ['Wheat Flour', 'Peanut Butter', 'Sugar', 'Eggs', 'Butter', 'Baking Soda', 'Salt'],
        allergens: ['peanuts', 'gluten', 'eggs', 'lactose'],
        healthScore: 62,
        nutrition: {
            calories: 280,
            fat: '14g',
            carbs: '32g',
            protein: '6g',
            sodium: '180mg'
        }
    }
};

// User allergen profile (mock data)
const userAllergens = ['peanuts', 'gluten', 'eggs'];

document.addEventListener('DOMContentLoaded', function() {
    initializeScanPage();
});

/**
 * Initialize scan page
 */
function initializeScanPage() {
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to clicked tab and corresponding content
            btn.classList.add('active');
            const tabId = btn.dataset.tab + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Camera controls
    const startCameraBtn = document.getElementById('start-camera');
    const stopCameraBtn = document.getElementById('stop-camera');
    const captureBtn = document.getElementById('capture-btn');
    
    if (startCameraBtn) {
        startCameraBtn.addEventListener('click', startCamera);
    }
    
    if (stopCameraBtn) {
        stopCameraBtn.addEventListener('click', stopCamera);
    }
    
    if (captureBtn) {
        captureBtn.addEventListener('click', captureAndAnalyze);
    }
    
    // Barcode form
    const barcodeForm = document.getElementById('barcode-form');
    if (barcodeForm) {
        barcodeForm.addEventListener('submit', handleBarcodeSubmit);
    }
    
    // Alert close buttons
    document.querySelectorAll('.alert-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.alert').style.display = 'none';
        });
    });
    
    // Save product button
    const saveBtn = document.getElementById('save-product-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveProduct);
    }
}

/**
 * Start camera
 */
async function startCamera() {
    try {
        const video = document.getElementById('camera-video');
        cameraStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' }
        });
        
        video.srcObject = cameraStream;
        cameraActive = true;
        
        // Update button visibility
        document.getElementById('start-camera').style.display = 'none';
        document.getElementById('capture-btn').style.display = 'inline-flex';
        document.getElementById('stop-camera').style.display = 'inline-flex';
        
        showNotification('Camera started successfully', 'success');
    } catch (error) {
        console.error('Error starting camera:', error);
        showNotification('Unable to access camera. Please check permissions.', 'error');
    }
}

/**
 * Stop camera
 */
function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        cameraActive = false;
        
        const video = document.getElementById('camera-video');
        video.srcObject = null;
        
        // Update button visibility
        document.getElementById('start-camera').style.display = 'inline-flex';
        document.getElementById('capture-btn').style.display = 'none';
        document.getElementById('stop-camera').style.display = 'none';
        
        showNotification('Camera stopped', 'info');
    }
}

/**
 * Capture and analyze
 */
function captureAndAnalyze() {
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0);
    
    // Simulate barcode detection
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        // Use random mock product
        const mockBarcodes = Object.keys(mockProducts);
        const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
        displayProductResults(mockProducts[randomBarcode]);
        stopCamera();
    }, 2000);
}

/**
 * Handle barcode form submit
 */
function handleBarcodeSubmit(e) {
    e.preventDefault();
    
    const barcodeInput = document.getElementById('barcode-input');
    const barcode = barcodeInput.value.trim();
    
    if (barcode.length < 12) {
        showNotification('Please enter a valid 12-13 digit barcode', 'error');
        return;
    }
    
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        hideLoading();
        
        const product = mockProducts[barcode];
        if (product) {
            displayProductResults(product);
        } else {
            showNotification('Product not found. Try sample barcodes.', 'error');
        }
    }, 1500);
}

/**
 * Fill barcode input (for sample buttons)
 */
window.fillBarcode = function(barcode) {
    const input = document.getElementById('barcode-input');
    input.value = barcode;
    input.focus();
};

/**
 * Display product results
 */
function displayProductResults(product) {
    // Show results section
    const resultsSection = document.getElementById('results-section');
    resultsSection.style.display = 'block';
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Check for allergens
    const hasAllergens = product.allergens.some(a => userAllergens.includes(a));
    
    // Show appropriate alert
    const allergenAlert = document.getElementById('allergen-alert');
    const successAlert = document.getElementById('success-alert');
    
    if (hasAllergens) {
        allergenAlert.style.display = 'flex';
        successAlert.style.display = 'none';
    } else {
        allergenAlert.style.display = 'none';
        successAlert.style.display = 'flex';
    }
    
    // Update product info
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-brand').textContent = product.brand;
    document.getElementById('product-category').textContent = product.category;
    document.getElementById('product-barcode').textContent = product.barcode;
    
    // Update health score
    updateHealthScore(product.healthScore);
    
    // Update ingredients
    displayIngredients(product.ingredients);
    
    // Update allergens
    displayAllergens(product.allergens);
    
    // Store current product
    window.currentProduct = product;
}

/**
 * Update health score
 */
function updateHealthScore(score) {
    const scoreElement = document.getElementById('health-score');
    const ratingElement = document.getElementById('score-rating');
    const circleElement = document.getElementById('score-circle');
    
    scoreElement.textContent = score;
    
    // Update rating text
    if (score >= 90) {
        ratingElement.textContent = 'Excellent';
    } else if (score >= 80) {
        ratingElement.textContent = 'Very Good';
    } else if (score >= 70) {
        ratingElement.textContent = 'Good';
    } else if (score >= 60) {
        ratingElement.textContent = 'Fair';
    } else {
        ratingElement.textContent = 'Poor';
    }
    
    // Update circle progress
    const circumference = 283;
    const offset = circumference - (score / 100) * circumference;
    circleElement.style.strokeDashoffset = offset;
}

/**
 * Display ingredients
 */
function displayIngredients(ingredients) {
    const container = document.getElementById('ingredients-list');
    container.innerHTML = ingredients.map(ingredient => 
        `<span class="ingredient-tag">${ingredient}</span>`
    ).join('');
}

/**
 * Display allergens
 */
function displayAllergens(productAllergens) {
    const container = document.getElementById('allergens-grid');
    
    // Common allergens to check
    const allAllergens = [
        { name: 'Peanuts', icon: 'fa-peanut', value: 'peanuts' },
        { name: 'Lactose', icon: 'fa-cheese', value: 'lactose' },
        { name: 'Gluten', icon: 'fa-bread-slice', value: 'gluten' },
        { name: 'Soy', icon: 'fa-seedling', value: 'soy' },
        { name: 'Shellfish', icon: 'fa-fish', value: 'shellfish' },
        { name: 'Eggs', icon: 'fa-egg', value: 'eggs' }
    ];
    
    container.innerHTML = allAllergens.map(allergen => {
        const isPresent = productAllergens.includes(allergen.value);
        const badgeClass = isPresent ? 'present' : 'absent';
        const icon = isPresent ? 'fa-exclamation-triangle' : 'fa-check-circle';
        const text = isPresent ? 'Contains' : 'Free';
        
        return `
            <div class="allergen-badge ${badgeClass}">
                <i class="fas ${icon}"></i>
                <div>
                    <div style="font-weight: 600;">${allergen.name}</div>
                    <small>${text}</small>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Save product
 */
function saveProduct() {
    if (!window.currentProduct) return;
    
    // Get saved products from localStorage
    let savedProducts = JSON.parse(localStorage.getItem('savedProducts') || '[]');
    
    // Check if already saved
    if (savedProducts.some(p => p.barcode === window.currentProduct.barcode)) {
        showNotification('Product already in your saved list', 'info');
        return;
    }
    
    // Add to saved products
    savedProducts.push(window.currentProduct);
    localStorage.setItem('savedProducts', JSON.stringify(savedProducts));
    
    showNotification('Product saved successfully!', 'success');
    
    // Update button
    const saveBtn = document.getElementById('save-product-btn');
    saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved';
    saveBtn.disabled = true;
}

/**
 * Show loading overlay
 */
function showLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.add('active');
    }
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}
