/**
 * Ingrevo Profile Page JavaScript
 * Complete interactive functionality for profile management
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Profile page DOM loaded, initializing...');
    
    try {
        initializeProfilePage();
        loadSavedProducts();
        loadScanHistory();
        initializePreferences();
        initializeAllergens();
        initializeSettings();
        initializeSearchAndFilters();
        initializeAvatarUpload();
        
        console.log('✅ All profile page modules initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing profile page:', error);
    }
});

/**
 * Initialize profile page
 */
function initializeProfilePage() {
    console.log('🔧 Initializing profile page navigation...');
    
    // Profile navigation
    const navItems = document.querySelectorAll('.profile-nav-item');
    const sections = document.querySelectorAll('.profile-section');
    
    console.log(`Found ${navItems.length} navigation items and ${sections.length} sections`);
    
    if (navItems.length === 0) {
        console.error('❌ No navigation items found!');
        return;
    }
    
    navItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const sectionName = this.getAttribute('data-section');
            const sectionId = sectionName + '-section';
            
            console.log(`🔄 Switching to section: ${sectionName} (ID: ${sectionId})`);
            
            // Remove active class from all nav items
            navItems.forEach(nav => {
                nav.classList.remove('active');
                console.log(`  Removed active from: ${nav.getAttribute('data-section')}`);
            });
            
            // Remove active class from all sections
            sections.forEach(section => {
                section.classList.remove('active');
                section.style.setProperty('display', 'none', 'important'); // Force hide with !important
                console.log(`  Hiding section: ${section.id}`);
            });
            
            // Add active class to clicked nav item
            this.classList.add('active');
            console.log(`  ✅ Nav item ${sectionName} is now active`);
            
            // Show target section
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.style.setProperty('display', 'block', 'important'); // Force show with !important
                console.log(`  ✅ Section ${sectionId} is now visible`);
                
                // Scroll to top of section
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                console.error(`  ❌ Section ${sectionId} not found in DOM!`);
                console.log('  Available sections:', Array.from(sections).map(s => s.id));
            }
        });
        
        console.log(`✅ Added listener to nav item ${index + 1}: ${item.getAttribute('data-section')}`);
    });
    
    // Initialize first section to be visible
    console.log('🎬 Initializing default section visibility...');
    sections.forEach((section, idx) => {
        if (idx === 0) {
            section.classList.add('active');
            section.style.setProperty('display', 'block', 'important');
            console.log(`  ✅ Set ${section.id} as default active section`);
        } else {
            section.classList.remove('active');
            section.style.setProperty('display', 'none', 'important');
            console.log(`  Hidden ${section.id}`);
        }
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
 * Remove product from saved list
 */
window.removeProduct = function(barcode) {
    if (!confirm('Remove this product from your saved list?')) return;
    
    let savedProducts = JSON.parse(localStorage.getItem('savedProducts') || '[]');
    savedProducts = savedProducts.filter(p => p.barcode !== barcode);
    localStorage.setItem('savedProducts', JSON.stringify(savedProducts));
    
    // Show notification
    if (window.IngrevoAnimations && window.IngrevoAnimations.showNotification) {
        window.IngrevoAnimations.showNotification('Product removed from saved list', 'success');
    }
    
    loadSavedProducts();
};

/**
 * Initialize dietary preferences
 */
function initializePreferences() {
    const preferenceCards = document.querySelectorAll('.preference-card');
    const saveBtn = document.querySelector('#preferences-section .btn-primary');
    
    // Load saved preferences
    const savedPrefs = JSON.parse(localStorage.getItem('dietaryPreferences') || '[]');
    
    preferenceCards.forEach(card => {
        const input = card.querySelector('input');
        const value = input.value;
        
        // Apply saved state
        if (savedPrefs.includes(value)) {
            input.checked = true;
            card.classList.add('selected');
        }
        
        // Handle click on card
        card.addEventListener('click', function(e) {
            if (e.target.tagName !== 'INPUT') {
                input.checked = !input.checked;
                card.classList.toggle('selected', input.checked);
            }
        });
        
        // Handle input change
        input.addEventListener('change', function() {
            card.classList.toggle('selected', input.checked);
        });
    });
    
    // Save preferences
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const selected = Array.from(document.querySelectorAll('.preference-card input:checked'))
                .map(input => input.value);
            
            localStorage.setItem('dietaryPreferences', JSON.stringify(selected));
            
            if (window.IngrevoAnimations && window.IngrevoAnimations.showNotification) {
                window.IngrevoAnimations.showNotification(`Saved ${selected.length} dietary preferences`, 'success');
            }
        });
    }
}

/**
 * Initialize allergen toggles
 */
function initializeAllergens() {
    const allergenItems = document.querySelectorAll('.allergen-item');
    const saveBtn = document.querySelector('#allergens-section .btn-primary');
    
    // Load saved allergens
    const savedAllergens = JSON.parse(localStorage.getItem('userAllergens') || '[]');
    
    allergenItems.forEach(item => {
        const toggle = item.querySelector('.toggle input');
        const allergen = item.dataset.allergen;
        
        // Apply saved state
        if (savedAllergens.includes(allergen)) {
            toggle.checked = true;
        }
        
        // Add animation on toggle
        toggle.addEventListener('change', function() {
            item.style.transform = 'scale(0.98)';
            setTimeout(() => {
                item.style.transform = 'scale(1)';
            }, 100);
        });
    });
    
    // Save allergens
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const selected = Array.from(document.querySelectorAll('.allergen-item .toggle input:checked'))
                .map(input => input.closest('.allergen-item').dataset.allergen);
            
            localStorage.setItem('userAllergens', JSON.stringify(selected));
            
            if (window.IngrevoAnimations && window.IngrevoAnimations.showNotification) {
                window.IngrevoAnimations.showNotification(`Updated ${selected.length} allergen alerts`, 'success');
            }
        });
    }
}

/**
 * Initialize settings toggles and actions
 */
function initializeSettings() {
    const settingItems = document.querySelectorAll('.setting-item');
    const saveSettingsBtn = document.querySelector('.settings-actions .btn-primary');
    const deleteAccountBtn = document.querySelector('.settings-actions .btn-outline.danger');
    
    // Load saved settings
    const savedSettings = JSON.parse(localStorage.getItem('appSettings') || '{}');
    
    settingItems.forEach(item => {
        const toggle = item.querySelector('.toggle input');
        const settingName = item.querySelector('h4').textContent.toLowerCase().replace(/\s+/g, '_');
        
        // Apply saved state
        if (savedSettings[settingName] !== undefined) {
            toggle.checked = savedSettings[settingName];
        }
        
        // Add animation on toggle
        toggle.addEventListener('change', function() {
            const icon = item.querySelector('.setting-info h4');
            icon.style.transform = 'translateX(5px)';
            setTimeout(() => {
                icon.style.transform = 'translateX(0)';
            }, 200);
        });
    });
    
    // Save settings
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', function() {
            const settings = {};
            
            settingItems.forEach(item => {
                const toggle = item.querySelector('.toggle input');
                const settingName = item.querySelector('h4').textContent.toLowerCase().replace(/\s+/g, '_');
                settings[settingName] = toggle.checked;
            });
            
            localStorage.setItem('appSettings', JSON.stringify(settings));
            
            if (window.IngrevoAnimations && window.IngrevoAnimations.showNotification) {
                window.IngrevoAnimations.showNotification('Settings saved successfully', 'success');
            }
        });
    }
    
    // Delete account
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
            
            if (confirmed) {
                const doubleCheck = prompt('Type "DELETE" to confirm account deletion:');
                
                if (doubleCheck === 'DELETE') {
                    // Clear all data
                    localStorage.clear();
                    
                    if (window.IngrevoAnimations && window.IngrevoAnimations.showNotification) {
                        window.IngrevoAnimations.showNotification('Account deleted. Redirecting...', 'info');
                    }
                    
                    setTimeout(() => {
                        window.location.href = 'home.html';
                    }, 2000);
                }
            }
        });
    }
}

/**
 * Initialize search and filter functionality
 */
function initializeSearchAndFilters() {
    const searchInput = document.querySelector('.search-input');
    const filterSelect = document.querySelector('.filter-select');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const historyItems = document.querySelectorAll('.history-item');
            
            historyItems.forEach(item => {
                const productName = item.querySelector('h4').textContent.toLowerCase();
                const matches = productName.includes(searchTerm);
                
                item.style.display = matches ? 'grid' : 'none';
                
                if (matches && searchTerm) {
                    item.style.animation = 'fadeIn 0.3s ease';
                }
            });
        });
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', function(e) {
            // Implement time-based filtering
            const filter = e.target.value;
            console.log('Filter by:', filter);
            
            if (window.IngrevoAnimations && window.IngrevoAnimations.showNotification) {
                window.IngrevoAnimations.showNotification(`Filtered by: ${filter}`, 'info');
            }
        });
    }
    
    // Export history button
    const exportBtn = document.querySelector('#history-section .btn-outline');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportScanHistory();
        });
    }
    
    // Share list button
    const shareBtn = document.querySelector('#saved-section .btn-outline');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            shareSavedProducts();
        });
    }
}

/**
 * Initialize avatar upload
 */
function initializeAvatarUpload() {
    const avatarEdit = document.querySelector('.avatar-edit');
    
    if (avatarEdit) {
        avatarEdit.addEventListener('click', function() {
            // Create file input
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    
                    reader.onload = function(event) {
                        const img = document.querySelector('.profile-avatar img');
                        img.src = event.target.result;
                        
                        // Save to localStorage
                        localStorage.setItem('userAvatar', event.target.result);
                        
                        if (window.IngrevoAnimations && window.IngrevoAnimations.showNotification) {
                            window.IngrevoAnimations.showNotification('Avatar updated successfully', 'success');
                        }
                    };
                    
                    reader.readAsDataURL(file);
                }
            });
            
            input.click();
        });
    }
    
    // Load saved avatar
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
        const img = document.querySelector('.profile-avatar img');
        if (img) {
            img.src = savedAvatar;
        }
    }
}

/**
 * Export scan history to CSV
 */
function exportScanHistory() {
    const history = [
        { name: 'Organic Whole Milk', date: 'Oct 30, 2025', safe: 'Yes', score: 85 },
        { name: 'Peanut Butter Cookies', date: 'Oct 29, 2025', safe: 'No', score: 62 },
        { name: 'Gluten-Free Bread', date: 'Oct 28, 2025', safe: 'Yes', score: 92 },
        { name: 'Almond Milk', date: 'Oct 27, 2025', safe: 'Yes', score: 88 }
    ];
    
    // Create CSV content
    const csvContent = [
        ['Product Name', 'Date', 'Safe', 'Health Score'].join(','),
        ...history.map(item => [item.name, item.date, item.safe, item.score].join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ingrevo-scan-history.csv';
    a.click();
    
    window.URL.revokeObjectURL(url);
    
    if (window.IngrevoAnimations && window.IngrevoAnimations.showNotification) {
        window.IngrevoAnimations.showNotification('History exported successfully', 'success');
    }
}

/**
 * Share saved products list
 */
function shareSavedProducts() {
    const savedProducts = JSON.parse(localStorage.getItem('savedProducts') || '[]');
    
    if (savedProducts.length === 0) {
        if (window.IngrevoAnimations && window.IngrevoAnimations.showNotification) {
            window.IngrevoAnimations.showNotification('No products to share', 'info');
        }
        return;
    }
    
    // Create shareable text
    const shareText = `My Safe Products on Ingrevo:\n\n${savedProducts.map((p, i) => 
        `${i + 1}. ${p.name} (Score: ${p.healthScore})`
    ).join('\n')}`;
    
    // Try to use Web Share API
    if (navigator.share) {
        navigator.share({
            title: 'My Safe Products - Ingrevo',
            text: shareText
        }).catch(err => console.log('Share cancelled'));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            if (window.IngrevoAnimations && window.IngrevoAnimations.showNotification) {
                window.IngrevoAnimations.showNotification('List copied to clipboard', 'success');
            }
        });
    }
}

/**
 * Update profile stats dynamically
 */
function updateProfileStats() {
    const scansCount = document.querySelector('.profile-stats .stat:nth-child(1) strong');
    const savedCount = document.querySelector('.profile-stats .stat:nth-child(2) strong');
    const allergensCount = document.querySelector('.profile-stats .stat:nth-child(3) strong');
    
    if (scansCount) {
        scansCount.textContent = localStorage.getItem('totalScans') || '0';
    }
    
    if (savedCount) {
        const saved = JSON.parse(localStorage.getItem('savedProducts') || '[]');
        savedCount.textContent = saved.length;
    }
    
    if (allergensCount) {
        const allergens = JSON.parse(localStorage.getItem('userAllergens') || '[]');
        allergensCount.textContent = allergens.length;
    }
}

// Update stats on page load
setTimeout(updateProfileStats, 500);

/**
 * Keyboard shortcuts
 */
document.addEventListener('keydown', function(e) {
    // Alt + 1-5 for quick navigation
    if (e.altKey && e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        const navItems = document.querySelectorAll('.profile-nav-item');
        const index = parseInt(e.key) - 1;
        if (navItems[index]) {
            navItems[index].click();
        }
    }
    
    // Ctrl + S to save preferences/allergens/settings
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        const activeSection = document.querySelector('.profile-section.active');
        const saveBtn = activeSection?.querySelector('.btn-primary');
        if (saveBtn) {
            saveBtn.click();
        }
    }
    
    // Escape to close any active modal or deselect
    if (e.key === 'Escape') {
        // Add any escape handlers here
    }
});

/**
 * Edit profile button handler
 */
const editProfileBtn = document.querySelector('.profile-header .btn-outline');
if (editProfileBtn) {
    editProfileBtn.addEventListener('click', function() {
        openEditProfileModal();
    });
}

/**
 * Open edit profile modal
 */
function openEditProfileModal() {
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'modal active';
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
}

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
