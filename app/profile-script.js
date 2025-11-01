/**
 * INGREVO PROFILE PAGE - COMPLETE REWRITE
 * Simplified and optimized functionality
 */

// Global state
const ProfileApp = {
    currentSection: 'preferences',
    data: {
        preferences: [],
        allergens: [],
        settings: {},
        savedProducts: [],
        history: []
    }
};

/**
 * Initialize everything when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('� Profile page initializing...');
    
    initNavigation();
    initPreferences();
    initAllergens();
    initHistory();
    initSavedProducts();
    initSettings();
    initAvatarUpload();
    loadUserData();
    updateStats();
    
    console.log('✅ Profile page ready!');
});

/**
 * NAVIGATION SYSTEM - REWRITTEN
 */
function initNavigation() {
    console.log('🔧 Initializing navigation...');
    
    const navButtons = document.querySelectorAll('.profile-nav-item');
    const sections = document.querySelectorAll('.profile-section');
    
    console.log(`Found ${navButtons.length} nav buttons`);
    console.log(`Found ${sections.length} sections`);
    
    if (!navButtons.length || !sections.length) {
        console.error('❌ Navigation elements missing!');
        return;
    }
    
    // Log all sections for debugging
    sections.forEach(section => {
        console.log('Section:', section.id);
    });
    
    // Function to switch sections
    function switchToSection(sectionName) {
        console.log(`🔄 Switching to: ${sectionName}`);
        
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Deactivate all buttons
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            console.log(`✅ Activated section: ${sectionName}-section`);
        } else {
            console.error(`❌ Section not found: ${sectionName}-section`);
        }
        
        // Activate corresponding button
        const targetButton = document.querySelector(`.profile-nav-item[data-section="${sectionName}"]`);
        if (targetButton) {
            targetButton.classList.add('active');
            console.log(`✅ Activated button: ${sectionName}`);
        }
        
        // Update current section
        ProfileApp.currentSection = sectionName;
    }
    
    // Attach click handlers to each button
    navButtons.forEach((button, index) => {
        const sectionName = button.getAttribute('data-section');
        console.log(`Setting up button ${index + 1}: ${sectionName}`);
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`👆 Clicked: ${sectionName}`);
            switchToSection(sectionName);
        });
    });
    
    // Initialize first section
    const firstButton = navButtons[0];
    if (firstButton) {
        const firstSection = firstButton.getAttribute('data-section');
        console.log(`🎬 Showing initial section: ${firstSection}`);
        switchToSection(firstSection);
    }
    
    // Keyboard shortcuts (Alt + 1-5)
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            const index = parseInt(e.key) - 1;
            if (navButtons[index]) {
                navButtons[index].click();
            }
        }
    });
    
    console.log('✅ Navigation initialized successfully!');
}

/**
 * PREFERENCES SECTION
 */
function initPreferences() {
    const cards = document.querySelectorAll('.preference-card');
    const saveBtn = document.querySelector('#preferences-section .btn-primary');
    
    // Handle card clicks
    cards.forEach(card => {
        const checkbox = card.querySelector('input[type="checkbox"]');
        
        card.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT') {
                checkbox.checked = !checkbox.checked;
                card.classList.toggle('selected', checkbox.checked);
            }
        });
        
        checkbox.addEventListener('change', () => {
            card.classList.toggle('selected', checkbox.checked);
        });
    });
    
    // Save preferences
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const selected = Array.from(cards)
                .filter(card => card.querySelector('input').checked)
                .map(card => card.querySelector('input').value);
            
            ProfileApp.data.preferences = selected;
            localStorage.setItem('dietaryPreferences', JSON.stringify(selected));
            showNotification(`Saved ${selected.length} preferences`, 'success');
        });
    }
    
    console.log('✅ Preferences initialized');
}

/**
 * ALLERGENS SECTION
 */
function initAllergens() {
    const items = document.querySelectorAll('.allergen-item');
    const saveBtn = document.querySelector('#allergens-section .btn-primary');
    
    console.log('Initializing allergens...', items.length, 'items found');
    
    // Initialize active states for checked items
    items.forEach(item => {
        const toggle = item.querySelector('.toggle input');
        
        if (!toggle) {
            console.error('Toggle not found in allergen item:', item);
            return;
        }
        
        // Set initial active class
        if (toggle.checked) {
            item.classList.add('active');
        }
        
        // Handle toggle changes with animation
        toggle.addEventListener('change', () => {
            // Toggle active class
            if (toggle.checked) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
            
            // Bounce animation
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
                item.style.transform = '';
            }, 150);
            
            // Show quick feedback
            const icon = item.querySelector('.allergen-icon');
            icon.style.animation = 'bounce 0.5s ease';
            setTimeout(() => {
                icon.style.animation = '';
            }, 500);
        });
        
        // Click on item to toggle (except when clicking the toggle itself)
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.toggle')) {
                toggle.checked = !toggle.checked;
                toggle.dispatchEvent(new Event('change'));
            }
        });
    });
    
    // Save allergens with validation
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const selected = Array.from(items)
                .filter(item => item.querySelector('input').checked)
                .map(item => ({
                    name: item.dataset.allergen,
                    severity: item.querySelector('.severity').textContent.toLowerCase()
                }));
            
            ProfileApp.data.allergens = selected.map(a => a.name);
            localStorage.setItem('userAllergens', JSON.stringify(ProfileApp.data.allergens));
            
            // Show detailed notification
            if (selected.length === 0) {
                showNotification('No allergens selected', 'info');
            } else {
                const highRisk = selected.filter(a => a.severity.includes('high')).length;
                let message = `Saved ${selected.length} allergen${selected.length > 1 ? 's' : ''}`;
                if (highRisk > 0) {
                    message += ` (${highRisk} high risk)`;
                }
                showNotification(message, 'success');
            }
            
            // Update stats
            updateStats();
            
            // Visual feedback on save button
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
            saveBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
            setTimeout(() => {
                saveBtn.innerHTML = originalText;
                saveBtn.style.background = '';
            }, 2000);
        });
    }
    
    console.log('✅ Allergens initialized');
}

/**
 * HISTORY SECTION
 */
function initHistory() {
    const searchInput = document.querySelector('#history-section .search-input');
    const filterSelect = document.querySelector('#history-section .filter-select');
    const exportBtn = document.querySelector('#history-section .btn-outline');
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const items = document.querySelectorAll('.history-item');
            
            items.forEach(item => {
                const name = item.querySelector('h4').textContent.toLowerCase();
                item.style.display = name.includes(term) ? '' : 'none';
            });
        });
    }
    
    // Filter functionality
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            showNotification(`Filtered by: ${e.target.value}`, 'info');
        });
    }
    
    // Export history
    if (exportBtn) {
        exportBtn.addEventListener('click', exportHistory);
    }
    
    // Load history data
    loadHistory();
    
    console.log('✅ History initialized');
}

function loadHistory() {
    const container = document.querySelector('.history-list');
    if (!container) return;
    
    const mockHistory = [
        { name: 'Organic Whole Milk', date: 'Oct 30, 2025', safe: true, score: 85 },
        { name: 'Peanut Butter Cookies', date: 'Oct 29, 2025', safe: false, score: 62 },
        { name: 'Gluten-Free Bread', date: 'Oct 28, 2025', safe: true, score: 92 },
        { name: 'Almond Milk', date: 'Oct 27, 2025', safe: true, score: 88 }
    ];
    
    container.innerHTML = mockHistory.map(item => `
        <div class="history-item">
            <div class="history-icon ${item.safe ? 'safe' : 'warning'}">
                <i class="fas fa-${item.safe ? 'check-circle' : 'exclamation-triangle'}"></i>
            </div>
            <div class="history-info">
                <h4>${item.name}</h4>
                <p>Scanned on ${item.date}</p>
            </div>
            <span class="score-badge ${item.score >= 80 ? 'good' : 'warning'}">${item.score}</span>
            <button class="btn-icon">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `).join('');
}

function exportHistory() {
    const csv = 'Product,Date,Safe,Score\n' +
        'Organic Whole Milk,Oct 30 2025,Yes,85\n' +
        'Peanut Butter Cookies,Oct 29 2025,No,62\n' +
        'Gluten-Free Bread,Oct 28 2025,Yes,92\n' +
        'Almond Milk,Oct 27 2025,Yes,88';
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scan-history.csv';
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('History exported', 'success');
}

/**
 * SAVED PRODUCTS SECTION
 */
function initSavedProducts() {
    const shareBtn = document.querySelector('#saved-section .btn-outline');
    
    if (shareBtn) {
        shareBtn.addEventListener('click', shareProducts);
    }
    
    loadSavedProducts();
    console.log('✅ Saved products initialized');
}

function loadSavedProducts() {
    const container = document.querySelector('.saved-grid');
    if (!container) return;
    
    const saved = JSON.parse(localStorage.getItem('savedProducts') || '[]');
    ProfileApp.data.savedProducts = saved;
    
    if (saved.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <i class="fas fa-bookmark" style="font-size: 3rem; color: var(--gray-300);"></i>
                <p style="margin-top: 1rem; color: var(--gray-600);">No saved products yet</p>
                <a href="scan.html" class="btn-primary" style="margin-top: 1rem;">Start Scanning</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = saved.map(product => `
        <div class="product-card">
            <div class="product-card-image">
                <i class="fas fa-box"></i>
            </div>
            <div class="product-card-info">
                <h4>${product.name}</h4>
                <p>${product.category || 'Food Product'}</p>
                <div class="product-card-meta">
                    <span class="badge-success">Safe</span>
                    <span class="score">${product.healthScore || 85}</span>
                </div>
            </div>
            <button class="product-card-action" onclick="removeProduct('${product.barcode}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

window.removeProduct = function(barcode) {
    if (!confirm('Remove this product?')) return;
    
    let saved = JSON.parse(localStorage.getItem('savedProducts') || '[]');
    saved = saved.filter(p => p.barcode !== barcode);
    localStorage.setItem('savedProducts', JSON.stringify(saved));
    
    loadSavedProducts();
    updateStats();
    showNotification('Product removed', 'success');
};

function shareProducts() {
    const saved = ProfileApp.data.savedProducts;
    
    if (saved.length === 0) {
        showNotification('No products to share', 'info');
        return;
    }
    
    const text = `My Safe Products:\n\n${saved.map((p, i) => 
        `${i + 1}. ${p.name}`
    ).join('\n')}`;
    
    if (navigator.share) {
        navigator.share({ title: 'My Safe Products', text });
    } else {
        navigator.clipboard.writeText(text);
        showNotification('List copied to clipboard', 'success');
    }
}

/**
 * SETTINGS SECTION
 */
function initSettings() {
    const items = document.querySelectorAll('.setting-item');
    const saveBtn = document.querySelector('.settings-actions .btn-primary');
    const deleteBtn = document.querySelector('.settings-actions .btn-outline.danger');
    
    // Load saved settings
    const saved = JSON.parse(localStorage.getItem('appSettings') || '{}');
    
    items.forEach(item => {
        const toggle = item.querySelector('.toggle input');
        const name = item.querySelector('h4').textContent.toLowerCase().replace(/\s+/g, '_');
        
        if (saved[name] !== undefined) {
            toggle.checked = saved[name];
        }
        
        toggle.addEventListener('change', () => {
            item.style.transform = 'translateX(5px)';
            setTimeout(() => item.style.transform = '', 200);
        });
    });
    
    // Save settings
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const settings = {};
            items.forEach(item => {
                const toggle = item.querySelector('.toggle input');
                const name = item.querySelector('h4').textContent.toLowerCase().replace(/\s+/g, '_');
                settings[name] = toggle.checked;
            });
            
            ProfileApp.data.settings = settings;
            localStorage.setItem('appSettings', JSON.stringify(settings));
            showNotification('Settings saved', 'success');
        });
    }
    
    // Delete account
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (!confirm('Delete your account? This cannot be undone.')) return;
            
            const confirm2 = prompt('Type DELETE to confirm:');
            if (confirm2 === 'DELETE') {
                localStorage.clear();
                showNotification('Account deleted', 'info');
                setTimeout(() => window.location.href = 'home.html', 2000);
            }
        });
    }
    
    console.log('✅ Settings initialized');
}
/**
 * AVATAR UPLOAD
 */
function initAvatarUpload() {
    const avatarEdit = document.querySelector('.avatar-edit');
    const avatarContainer = document.querySelector('.profile-avatar');
    
    // Click to upload
    if (avatarEdit) {
        avatarEdit.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) uploadAvatar(file);
            });
            
            input.click();
        });
    }
    
    // Drag and drop
    if (avatarContainer) {
        avatarContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            avatarContainer.style.opacity = '0.7';
        });
        
        avatarContainer.addEventListener('dragleave', () => {
            avatarContainer.style.opacity = '1';
        });
        
        avatarContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            avatarContainer.style.opacity = '1';
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                uploadAvatar(file);
            }
        });
    }
    
    // Load saved avatar
    const saved = localStorage.getItem('userAvatar');
    if (saved) {
        const img = document.querySelector('.profile-avatar img');
        if (img) img.src = saved;
    }
    
    console.log('✅ Avatar upload initialized');
}

function uploadAvatar(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = document.querySelector('.profile-avatar img');
        if (img) {
            img.src = e.target.result;
            localStorage.setItem('userAvatar', e.target.result);
            showNotification('Avatar updated', 'success');
        }
    };
    reader.readAsDataURL(file);
}

/**
 * UTILITY FUNCTIONS
 */
function loadUserData() {
    // Load all saved data
    ProfileApp.data.preferences = JSON.parse(localStorage.getItem('dietaryPreferences') || '[]');
    ProfileApp.data.allergens = JSON.parse(localStorage.getItem('userAllergens') || '[]');
    ProfileApp.data.settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
    ProfileApp.data.savedProducts = JSON.parse(localStorage.getItem('savedProducts') || '[]');
    
    // Apply saved preferences
    ProfileApp.data.preferences.forEach(pref => {
        const input = document.querySelector(`.preference-card input[value="${pref}"]`);
        if (input) {
            input.checked = true;
            input.closest('.preference-card').classList.add('selected');
        }
    });
    
    // Apply saved allergens
    ProfileApp.data.allergens.forEach(allergen => {
        const item = document.querySelector(`.allergen-item[data-allergen="${allergen}"]`);
        if (item) {
            const toggle = item.querySelector('input');
            if (toggle) toggle.checked = true;
        }
    });
    
    console.log('✅ User data loaded');
}

function updateStats() {
    const stats = {
        scans: localStorage.getItem('totalScans') || '0',
        saved: ProfileApp.data.savedProducts.length,
        allergens: ProfileApp.data.allergens.length
    };
    
    const scansEl = document.querySelector('.profile-stats .stat:nth-child(1) strong');
    const savedEl = document.querySelector('.profile-stats .stat:nth-child(2) strong');
    const allergensEl = document.querySelector('.profile-stats .stat:nth-child(3) strong');
    
    if (scansEl) scansEl.textContent = stats.scans;
    if (savedEl) savedEl.textContent = stats.saved;
    if (allergensEl) allergensEl.textContent = stats.allergens;
}

function showNotification(message, type = 'info') {
    // Use existing notification system if available
    if (window.IngrevoAnimations && window.IngrevoAnimations.showNotification) {
        window.IngrevoAnimations.showNotification(message, type);
        return;
    }
    
    // Fallback simple notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10B981' : type === 'danger' ? '#EF4444' : '#3B82F6'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * EDIT PROFILE MODAL
 */
const editProfileBtn = document.querySelector('.profile-header .btn-outline');
if (editProfileBtn) {
    editProfileBtn.addEventListener('click', openEditModal);
}

function openEditModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 1rem; max-width: 500px; width: 90%;">
            <h2 style="margin-bottom: 1.5rem;">Edit Profile</h2>
            <form id="profile-form">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Name</label>
                    <input type="text" id="name" value="${profile.name || 'John Doe'}" 
                           style="width: 100%; padding: 0.75rem; border: 2px solid #E5E7EB; border-radius: 0.5rem;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Email</label>
                    <input type="email" id="email" value="${profile.email || 'john@example.com'}" 
                           style="width: 100%; padding: 0.75rem; border: 2px solid #E5E7EB; border-radius: 0.5rem;">
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                    <button type="submit" class="btn-primary" style="flex: 1;">Save</button>
                    <button type="button" class="btn-outline" onclick="this.closest('.modal').remove()" style="flex: 1;">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value
        };
        
        localStorage.setItem('userProfile', JSON.stringify(data));
        document.querySelector('.profile-info h1').textContent = data.name;
        document.querySelector('.profile-info > p').textContent = data.email;
        
        modal.remove();
        showNotification('Profile updated', 'success');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

console.log('✨ Profile page fully loaded!');
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="modal-header">
                    <h2>Edit Profile</h2>
                    <p>Update your personal information</p>
                </div>
                
                <div class="modal-body">
                    <form id="edit-profile-form">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" id="profile-name" value="John Doe" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Email Address</label>
                            <input type="email" id="profile-email" value="john.doe@example.com" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Phone Number</label>
                            <input type="tel" id="profile-phone" placeholder="+1 (555) 000-0000">
                        </div>
                        
                        <div class="form-group">
                            <label>Bio</label>
                            <textarea id="profile-bio" rows="3" placeholder="Tell us about yourself..."></textarea>
                        </div>
                        
                        <button type="submit" class="btn-primary full-width">
                            <i class="fas fa-save"></i>
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    const form = modal.querySelector('#edit-profile-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('profile-name').value;
        const email = document.getElementById('profile-email').value;
        const phone = document.getElementById('profile-phone').value;
        const bio = document.getElementById('profile-bio').value;
        
        // Save to localStorage
        localStorage.setItem('userProfile', JSON.stringify({ name, email, phone, bio }));
        
        // Update display
        document.querySelector('.profile-info h1').textContent = name;
        document.querySelector('.profile-info > p').textContent = email;
        
        // Close modal
        modal.remove();
        
        if (window.IngrevoAnimations && window.IngrevoAnimations.showNotification) {
            window.IngrevoAnimations.showNotification('Profile updated successfully', 'success');
        }
    });
    
    // Load saved profile data
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (savedProfile.name) document.getElementById('profile-name').value = savedProfile.name;
    if (savedProfile.email) document.getElementById('profile-email').value = savedProfile.email;
    if (savedProfile.phone) document.getElementById('profile-phone').value = savedProfile.phone;
    if (savedProfile.bio) document.getElementById('profile-bio').value = savedProfile.bio;
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

/**
 * Auto-save draft changes
 */
let draftTimer;
function saveDraft(section, data) {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
        localStorage.setItem(`draft_${section}`, JSON.stringify(data));
    }, 1000);
}

/**
 * Load draft if exists
 */
function loadDraft(section) {
    const draft = localStorage.getItem(`draft_${section}`);
    if (draft) {
        return JSON.parse(draft);
    }
    return null;
}

/**
 * Clear draft
 */
function clearDraft(section) {
    localStorage.removeItem(`draft_${section}`);
}

/**
 * Animate stat counters on hover
 */
const statItems = document.querySelectorAll('.profile-stats .stat');
statItems.forEach(stat => {
    stat.addEventListener('mouseenter', function() {
        const strong = this.querySelector('strong');
        const originalValue = strong.textContent;
        
        // Add pulse animation
        strong.style.animation = 'pulse 0.5s ease';
        
        setTimeout(() => {
            strong.style.animation = '';
        }, 500);
    });
});

/**
 * Smooth scroll to section
 */
window.scrollToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

/**
 * Print profile summary
 */
window.printProfile = function() {
    window.print();
};

/**
 * Add tooltips to icons
 */
function initializeTooltips() {
    const elements = document.querySelectorAll('[data-tooltip]');
    elements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = this.getAttribute('data-tooltip');
            // Tooltip already handled by CSS
        });
    });
}

initializeTooltips();

/**
 * Initialize drag and drop for avatar
 */
const avatarContainer = document.querySelector('.profile-avatar');
if (avatarContainer) {
    avatarContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.opacity = '0.7';
    });
    
    avatarContainer.addEventListener('dragleave', function() {
        this.style.opacity = '1';
    });
    
    avatarContainer.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.opacity = '1';
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = document.querySelector('.profile-avatar img');
                img.src = event.target.result;
                localStorage.setItem('userAvatar', event.target.result);
                
                if (window.IngrevoAnimations && window.IngrevoAnimations.showNotification) {
                    window.IngrevoAnimations.showNotification('Avatar updated via drag & drop', 'success');
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

console.log('✨ Profile page fully initialized with advanced functionality');

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

console.log('✨ Profile script loaded successfully');
