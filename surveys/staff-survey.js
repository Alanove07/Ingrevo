// Staff Survey Script

const db = firebase.firestore();

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeFormLogic();
    initializeFormSubmission();
});

// Initialize form logic
function initializeFormLogic() {
    // Show/hide digital tools description
    const digitalToolsRadios = document.querySelectorAll('input[name="current_digital_tools"]');
    const toolsSpecify = document.getElementById('tools-specify');

    digitalToolsRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'Yes, advanced systems' || this.value === 'Yes, basic systems') {
                toolsSpecify.style.display = 'block';
            } else {
                toolsSpecify.style.display = 'none';
                document.getElementById('tools_description').value = '';
            }
        });
    });
}

// Initialize form submission
function initializeFormSubmission() {
    const form = document.getElementById('staff-survey-form');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Show loading state
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        try {
            // Collect form data
            const formData = collectFormData(form);

            // Add metadata
            formData.surveyType = 'staff';
            formData.role = 'staff';
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
