// Customer Survey Script

const db = firebase.firestore();

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeFormLogic();
    initializeFormSubmission();
});

// Initialize form logic
function initializeFormLogic() {
    // Show/hide reason for not reading ingredients
    const readIngredientsRadios = document.querySelectorAll('input[name="read_ingredients"]');
    const reasonGroup = document.getElementById('reason-group');

    readIngredientsRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'Rarely' || this.value === 'Never') {
                reasonGroup.style.display = 'block';
            } else {
                reasonGroup.style.display = 'none';
                // Uncheck all reason checkboxes
                document.querySelectorAll('input[name="not_reading_reason"]').forEach(cb => cb.checked = false);
            }
        });
    });

    // Show/hide allergy specification
    const allergyRadios = document.querySelectorAll('input[name="has_allergies"]');
    const allergySpecify = document.getElementById('allergy-specify');

    allergyRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'Yes') {
                allergySpecify.style.display = 'block';
            } else {
                allergySpecify.style.display = 'none';
                document.getElementById('allergy_details').value = '';
            }
        });
    });

    // Star rating interaction
    const ratingInputs = document.querySelectorAll('.rating-group input[type="radio"]');
    const starLabels = document.querySelectorAll('.star-label');

    ratingInputs.forEach((input, index) => {
        input.addEventListener('change', function() {
            // Remove active class from all
            starLabels.forEach(label => label.classList.remove('active'));
            
            // Add active class to selected and previous
            for (let i = 0; i <= index; i++) {
                starLabels[i].classList.add('active');
            }
        });
    });

    // Hover effect for stars
    starLabels.forEach((label, index) => {
        label.addEventListener('mouseenter', function() {
            starLabels.forEach(l => l.classList.remove('hover'));
            for (let i = 0; i <= index; i++) {
                starLabels[i].classList.add('hover');
            }
        });
    });

    document.querySelector('.rating-group').addEventListener('mouseleave', function() {
        starLabels.forEach(l => l.classList.remove('hover'));
    });
}

// Initialize form submission
function initializeFormSubmission() {
    const form = document.getElementById('customer-survey-form');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate checkboxes
        if (!validateCheckboxGroups()) {
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        try {
            // Collect form data
            const formData = collectFormData(form);

            // Add metadata
            formData.surveyType = 'customer';
            formData.role = 'customer';
            formData.submittedAt = firebase.firestore.FieldValue.serverTimestamp();
            formData.device = getDeviceInfo();

            // Save to Firestore - simplified structure
            await db.collection('surveyResponses').add(formData);

            // Show success modal
            document.getElementById('successModal').style.display = 'flex';

            // Reset form
            form.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

        } catch (error) {
            console.error('Error submitting survey:', error);
            alert('Failed to submit survey. Please try again.');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Validate checkbox groups
function validateCheckboxGroups() {
    const productTypesChecked = document.querySelectorAll('input[name="product_types"]:checked').length > 0;
    if (!productTypesChecked) {
        alert('Please select at least one product type.');
        document.querySelector('input[name="product_types"]').focus();
        return false;
    }

    const checkFirstChecked = document.querySelectorAll('input[name="check_first"]:checked').length > 0;
    if (!checkFirstChecked) {
        alert('Please select at least one option for what you check first when selecting a product.');
        document.querySelector('input[name="check_first"]').focus();
        return false;
    }

    const usefulFeaturesChecked = document.querySelectorAll('input[name="useful_features"]:checked').length > 0;
    if (!usefulFeaturesChecked) {
        alert('Please select at least one useful feature.');
        document.querySelector('input[name="useful_features"]').focus();
        return false;
    }

    return true;
}

// Collect form data
function collectFormData(form) {
    const data = {};

    // Text and number inputs
    const textInputs = form.querySelectorAll('input[type="text"], input[type="number"], textarea');
    textInputs.forEach(input => {
        if (input.value.trim()) {
            data[input.name] = input.value.trim();
        }
    });

    // Radio buttons
    const radioGroups = {};
    const radios = form.querySelectorAll('input[type="radio"]:checked');
    radios.forEach(radio => {
        data[radio.name] = radio.value;
    });

    // Checkboxes (arrays)
    const checkboxGroups = {};
    const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        if (!checkboxGroups[checkbox.name]) {
            checkboxGroups[checkbox.name] = [];
        }
        checkboxGroups[checkbox.name].push(checkbox.value);
    });

    // Merge checkbox groups into data
    Object.assign(data, checkboxGroups);

    return data;
}

// Get device info
function getDeviceInfo() {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        timestamp: new Date().toISOString()
    };
}

// Close modal
window.addEventListener('click', function(e) {
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        modal.style.display = 'none';
        window.location.href = '../index.html';
    }
});
