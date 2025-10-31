// Health Professional Survey Script

const db = firebase.firestore();

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeFormLogic();
    initializeFormSubmission();
});

// Initialize form logic
function initializeFormLogic() {
    // Show/hide specialty field
    const professionRadios = document.querySelectorAll('input[name="profession"]');
    const specialtyGroup = document.getElementById('specialty-group');

    professionRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'Medical Doctor (Specialist)' || this.value === 'Other Healthcare Professional') {
                specialtyGroup.style.display = 'block';
            } else {
                specialtyGroup.style.display = 'none';
                document.getElementById('specialty').value = '';
            }
        });
    });
}

// Initialize form submission
function initializeFormSubmission() {
    const form = document.getElementById('health-survey-form');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate checkbox groups
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
            formData.surveyType = 'health';
            formData.role = 'health';
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
    const healthProblemsChecked = document.querySelectorAll('input[name="health_problems"]:checked').length > 0;
    if (!healthProblemsChecked) {
        alert('Please select at least one health problem type (or select "None").');
        document.querySelector('input[name="health_problems"]').focus();
        return false;
    }

    const commonAllergensChecked = document.querySelectorAll('input[name="common_allergens"]:checked').length > 0;
    if (!commonAllergensChecked) {
        alert('Please select at least one common allergen.');
        document.querySelector('input[name="common_allergens"]').focus();
        return false;
    }

    const priorityFeaturesChecked = document.querySelectorAll('input[name="priority_features"]:checked').length;
    if (priorityFeaturesChecked === 0 || priorityFeaturesChecked > 3) {
        alert('Please select exactly 3 priority features.');
        document.querySelector('input[name="priority_features"]').focus();
        return false;
    }

    return true;
}

// Collect form data
function collectFormData(form) {
    const data = {};

    // Text and number inputs
    const textInputs = form.querySelectorAll('input[type="text"], input[type="number"], input[type="email"], input[type="tel"], textarea');
    textInputs.forEach(input => {
        if (input.value.trim()) {
            data[input.name] = input.value.trim();
        }
    });

    // Radio buttons
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
