// Volunteer Survey JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('volunteer-survey-form');
    const successModal = document.getElementById('successModal');
    
    // Initialize Firebase
    const db = firebase.firestore();
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('collection_date').value = today;
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate checkbox groups
        if (!validateCheckboxGroups()) {
            return;
        }
        
        // Collect form data
        const formData = collectFormData();
        
        // Save to Firebase
        saveToFirebase(formData);
    });
    
    // Collect form data
    function collectFormData() {
        const formData = {
            // Section A: Volunteer Information
            name: document.getElementById('name').value.trim(),
            role: document.querySelector('input[name="role"]:checked').value,
            contact_phone: document.getElementById('contact_phone').value.trim(),
            contact_email: document.getElementById('contact_email').value.trim(),
            assigned_region: document.getElementById('assigned_region').value.trim(),
            collection_date: document.getElementById('collection_date').value,
            
            // Section B: Data Collection Progress
            surveys_collected_today: parseInt(document.getElementById('surveys_collected_today').value),
            surveys_collected_week: parseInt(document.getElementById('surveys_collected_week').value),
            survey_types_collected: getCheckboxValues('survey_types_collected'),
            notable_responses: document.getElementById('notable_responses').value.trim(),
            explanation_challenges: document.getElementById('explanation_challenges').value.trim(),
            participation_receptiveness: document.querySelector('input[name="participation_receptiveness"]:checked').value,
            avg_completion_time: document.querySelector('input[name="avg_completion_time"]:checked').value,
            ui_improvements: document.getElementById('ui_improvements').value.trim(),
            
            // Section C: Progress Tracking & Technical Issues
            pending_locations: document.getElementById('pending_locations').value.trim(),
            target_surveys: document.getElementById('target_surveys').value ? parseInt(document.getElementById('target_surveys').value) : null,
            technical_issues: getCheckboxValues('technical_issues'),
            technical_details: document.getElementById('technical_details').value.trim(),
            session_rating: parseInt(document.querySelector('input[name="session_rating"]:checked').value),
            additional_feedback: document.getElementById('additional_feedback').value.trim(),
            next_session: document.getElementById('next_session').value || null,
            
            // Metadata
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`
        };
        
        return formData;
    }
    
    // Get checkbox values
    function getCheckboxValues(name) {
        const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
        return Array.from(checkboxes).map(cb => cb.value);
    }
    
    // Validate checkbox groups
    function validateCheckboxGroups() {
        // Validate survey_types_collected (at least 1)
        const surveyTypes = document.querySelectorAll('input[name="survey_types_collected"]:checked');
        if (surveyTypes.length === 0) {
            alert('Please select at least one survey type you collected today.');
            document.querySelector('input[name="survey_types_collected"]').focus();
            return false;
        }
        
        // Validate technical_issues (at least 1)
        const technicalIssues = document.querySelectorAll('input[name="technical_issues"]:checked');
        if (technicalIssues.length === 0) {
            alert('Please indicate if you encountered any technical issues or select "No issues".');
            document.querySelector('input[name="technical_issues"]').focus();
            return false;
        }
        
        return true;
    }
    
    // Save to Firebase
    function saveToFirebase(data) {
        // Show loading state
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
        
        // Add role field
        data.role = 'volunteer';
        data.surveyType = 'volunteer';
        
        // Save to surveyResponses collection - simplified structure
        db.collection('surveyResponses')
            .add(data)
            .then((docRef) => {
                console.log('Volunteer survey saved with ID: ', docRef.id);
                
                // Show success modal
                successModal.style.display = 'flex';
                
                // Reset form
                form.reset();
                
                // Reset date to today
                document.getElementById('collection_date').value = today;
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            })
            .catch((error) => {
                console.error('Error saving volunteer survey: ', error);
                alert('Error submitting report. Please check your internet connection and try again.');
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    }
});
