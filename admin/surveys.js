// Surveys Management Script

const db = firebase.firestore();
let surveys = [];
let currentSurveyId = null;
let questionCounter = 0;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadSurveys();
    initializeEventListeners();
});

// Load surveys from Firebase
async function loadSurveys() {
    try {
        const snapshot = await db.collection('survey').orderBy('createdAt', 'desc').get();
        surveys = [];
        
        snapshot.forEach(doc => {
            surveys.push({
                id: doc.id,
                ...doc.data()
            });
        });

        displaySurveys(surveys);
        updateStats();
    } catch (error) {
        console.error('Error loading surveys:', error);
        showNotification('Failed to load surveys', 'error');
    }
}

// Display surveys in table
function displaySurveys(surveysToDisplay) {
    const tbody = document.querySelector('.data-table tbody');
    
    if (surveysToDisplay.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px;">
                    <i class="fas fa-poll" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                    <p style="color: #666;">No surveys found. Create your first survey!</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = surveysToDisplay.map(survey => {
        const statusClass = {
            'active': 'success',
            'draft': 'warning',
            'closed': 'secondary'
        }[survey.status] || 'secondary';

        const typeClass = {
            'customer': 'info',
            'product': 'info',
            'health': 'warning',
            'store': 'info',
            'general': 'secondary'
        }[survey.type] || 'secondary';

        const createdDate = survey.createdAt ? 
            new Date(survey.createdAt.toDate()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 
            '-';

        const endDate = survey.endDate ? 
            new Date(survey.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 
            '-';

        return `
            <tr>
                <td><strong>${survey.title}</strong></td>
                <td><span class="badge badge-${typeClass}">${formatType(survey.type)}</span></td>
                <td><span class="badge badge-${statusClass}">${survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}</span></td>
                <td>${survey.responseCount || 0}</td>
                <td>${createdDate}</td>
                <td>${endDate}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="viewResults('${survey.id}')" title="View Results">
                            <i class="fas fa-chart-bar"></i>
                        </button>
                        <button class="btn-icon" onclick="editSurvey('${survey.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-danger" onclick="deleteSurvey('${survey.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Format survey type for display
function formatType(type) {
    const types = {
        'customer': 'Customer',
        'product': 'Product',
        'health': 'Health',
        'store': 'Store',
        'general': 'General'
    };
    return types[type] || type;
}

// Update statistics
function updateStats() {
    const totalSurveys = surveys.length;
    const activeSurveys = surveys.filter(s => s.status === 'active').length;
    const totalResponses = surveys.reduce((sum, s) => sum + (s.responseCount || 0), 0);
    const avgRate = totalSurveys > 0 ? Math.round((activeSurveys / totalSurveys) * 100) : 0;

    document.querySelector('.stats-grid .stat-card:nth-child(1) h3').textContent = totalSurveys;
    document.querySelector('.stats-grid .stat-card:nth-child(2) h3').textContent = activeSurveys;
    document.querySelector('.stats-grid .stat-card:nth-child(3) h3').textContent = totalResponses.toLocaleString();
    document.querySelector('.stats-grid .stat-card:nth-child(4) h3').textContent = avgRate + '%';
}

// Initialize event listeners
function initializeEventListeners() {
    // Create Survey Button
    document.getElementById('create-survey-btn').addEventListener('click', openCreateModal);

    // Modal Close Buttons
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('cancel-btn').addEventListener('click', closeModal);
    document.getElementById('close-results-modal').addEventListener('click', closeResultsModal);
    document.getElementById('close-results-btn').addEventListener('click', closeResultsModal);

    // Add Question Button
    document.getElementById('add-question-btn').addEventListener('click', addQuestion);

    // Form Submit
    document.getElementById('survey-form').addEventListener('submit', handleSubmit);

    // Filter
    document.querySelector('.filter-select').addEventListener('change', handleFilter);

    // Search
    document.querySelector('.search-box input').addEventListener('input', handleSearch);

    // Click outside modal to close
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal();
            closeResultsModal();
        }
    });
}

// Open create modal
function openCreateModal() {
    currentSurveyId = null;
    document.getElementById('modal-title').textContent = 'Create New Survey';
    document.getElementById('survey-form').reset();
    document.getElementById('questions-container').innerHTML = '';
    questionCounter = 0;
    
    // Add initial question
    addQuestion();
    
    document.getElementById('surveyModal').style.display = 'flex';
}

// Close modal
function closeModal() {
    document.getElementById('surveyModal').style.display = 'none';
}

// Close results modal
function closeResultsModal() {
    document.getElementById('resultsModal').style.display = 'none';
}

// Add question to survey
function addQuestion() {
    questionCounter++;
    const questionId = `question-${questionCounter}`;
    
    const questionHTML = `
        <div class="question-item" data-question-id="${questionId}">
            <div class="question-header">
                <h4>Question ${questionCounter}</h4>
                <button type="button" class="btn-icon btn-danger" onclick="removeQuestion('${questionId}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="form-group">
                <label>Question Text *</label>
                <input type="text" class="question-text" required placeholder="Enter your question">
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Question Type *</label>
                    <select class="question-type" required onchange="handleQuestionTypeChange('${questionId}')">
                        <option value="">Select Type</option>
                        <option value="text">Text Answer</option>
                        <option value="textarea">Long Text</option>
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="checkbox">Checkboxes</option>
                        <option value="rating">Rating Scale</option>
                        <option value="yes-no">Yes/No</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" class="question-required">
                        <span>Required</span>
                    </label>
                </div>
            </div>

            <div class="question-options" style="display: none;">
                <label>Options (one per line)</label>
                <textarea class="question-options-text" rows="4" placeholder="Option 1&#10;Option 2&#10;Option 3"></textarea>
            </div>
        </div>
    `;

    document.getElementById('questions-container').insertAdjacentHTML('beforeend', questionHTML);
}

// Remove question
function removeQuestion(questionId) {
    const questionItem = document.querySelector(`[data-question-id="${questionId}"]`);
    if (questionItem) {
        questionItem.remove();
        // Renumber remaining questions
        document.querySelectorAll('.question-item').forEach((item, index) => {
            item.querySelector('h4').textContent = `Question ${index + 1}`;
        });
    }
}

// Handle question type change
function handleQuestionTypeChange(questionId) {
    const questionItem = document.querySelector(`[data-question-id="${questionId}"]`);
    const typeSelect = questionItem.querySelector('.question-type');
    const optionsDiv = questionItem.querySelector('.question-options');
    
    const needsOptions = ['multiple-choice', 'checkbox'].includes(typeSelect.value);
    optionsDiv.style.display = needsOptions ? 'block' : 'none';
}

// Handle form submit
async function handleSubmit(e) {
    e.preventDefault();

    // Collect form data
    const formData = {
        title: document.getElementById('survey-title').value,
        description: document.getElementById('survey-description').value,
        type: document.getElementById('survey-type').value,
        status: document.getElementById('survey-status').value,
        startDate: document.getElementById('survey-start-date').value || null,
        endDate: document.getElementById('survey-end-date').value || null,
        targetAudience: document.getElementById('survey-target').value,
        responseLimit: parseInt(document.getElementById('survey-limit').value) || 0,
        allowAnonymous: document.getElementById('survey-anonymous').checked,
        allowMultiple: document.getElementById('survey-multiple').checked,
        questions: collectQuestions(),
        responseCount: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Validate questions
    if (formData.questions.length === 0) {
        showNotification('Please add at least one question', 'error');
        return;
    }

    try {
        if (currentSurveyId) {
            // Update existing survey
            await db.collection('survey').doc(currentSurveyId).update({
                ...formData,
                createdAt: undefined, // Don't update createdAt
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            showNotification('Survey updated successfully', 'success');
        } else {
            // Create new survey
            await db.collection('survey').add(formData);
            showNotification('Survey created successfully', 'success');
        }

        closeModal();
        loadSurveys();
    } catch (error) {
        console.error('Error saving survey:', error);
        showNotification('Failed to save survey', 'error');
    }
}

// Collect questions from form
function collectQuestions() {
    const questions = [];
    const questionItems = document.querySelectorAll('.question-item');

    questionItems.forEach((item, index) => {
        const questionText = item.querySelector('.question-text').value;
        const questionType = item.querySelector('.question-type').value;
        const isRequired = item.querySelector('.question-required').checked;
        const optionsText = item.querySelector('.question-options-text').value;

        if (questionText && questionType) {
            const question = {
                id: `q${index + 1}`,
                text: questionText,
                type: questionType,
                required: isRequired
            };

            // Add options if applicable
            if (['multiple-choice', 'checkbox'].includes(questionType) && optionsText) {
                question.options = optionsText.split('\n').filter(opt => opt.trim());
            }

            questions.push(question);
        }
    });

    return questions;
}

// Edit survey
async function editSurvey(surveyId) {
    try {
        const doc = await db.collection('survey').doc(surveyId).get();
        if (!doc.exists) {
            showNotification('Survey not found', 'error');
            return;
        }

        const survey = doc.data();
        currentSurveyId = surveyId;

        // Fill form
        document.getElementById('modal-title').textContent = 'Edit Survey';
        document.getElementById('survey-title').value = survey.title;
        document.getElementById('survey-description').value = survey.description;
        document.getElementById('survey-type').value = survey.type;
        document.getElementById('survey-status').value = survey.status;
        document.getElementById('survey-start-date').value = survey.startDate || '';
        document.getElementById('survey-end-date').value = survey.endDate || '';
        document.getElementById('survey-target').value = survey.targetAudience || 'all';
        document.getElementById('survey-limit').value = survey.responseLimit || '';
        document.getElementById('survey-anonymous').checked = survey.allowAnonymous || false;
        document.getElementById('survey-multiple').checked = survey.allowMultiple || false;

        // Load questions
        document.getElementById('questions-container').innerHTML = '';
        questionCounter = 0;

        if (survey.questions && survey.questions.length > 0) {
            survey.questions.forEach(question => {
                addQuestion();
                const questionItem = document.querySelectorAll('.question-item')[questionCounter - 1];
                
                questionItem.querySelector('.question-text').value = question.text;
                questionItem.querySelector('.question-type').value = question.type;
                questionItem.querySelector('.question-required').checked = question.required;

                if (question.options) {
                    const optionsDiv = questionItem.querySelector('.question-options');
                    optionsDiv.style.display = 'block';
                    questionItem.querySelector('.question-options-text').value = question.options.join('\n');
                }
            });
        } else {
            addQuestion();
        }

        document.getElementById('surveyModal').style.display = 'flex';
    } catch (error) {
        console.error('Error loading survey:', error);
        showNotification('Failed to load survey', 'error');
    }
}

// Delete survey
async function deleteSurvey(surveyId) {
    if (!confirm('Are you sure you want to delete this survey? This action cannot be undone.')) {
        return;
    }

    try {
        await db.collection('survey').doc(surveyId).delete();
        
        // Also delete responses
        const responsesSnapshot = await db.collection('surveyResponses')
            .where('surveyId', '==', surveyId)
            .get();
        
        const deletePromises = responsesSnapshot.docs.map(doc => doc.ref.delete());
        await Promise.all(deletePromises);

        showNotification('Survey deleted successfully', 'success');
        loadSurveys();
    } catch (error) {
        console.error('Error deleting survey:', error);
        showNotification('Failed to delete survey', 'error');
    }
}

// View survey results
async function viewResults(surveyId) {
    try {
        const surveyDoc = await db.collection('survey').doc(surveyId).get();
        if (!surveyDoc.exists) {
            showNotification('Survey not found', 'error');
            return;
        }

        const survey = surveyDoc.data();
        const responsesSnapshot = await db.collection('surveyResponses')
            .where('surveyId', '==', surveyId)
            .get();

        const responses = [];
        responsesSnapshot.forEach(doc => {
            responses.push(doc.data());
        });

        displayResults(survey, responses);
        document.getElementById('resultsModal').style.display = 'flex';
    } catch (error) {
        console.error('Error loading results:', error);
        showNotification('Failed to load results', 'error');
    }
}

// Display survey results
function displayResults(survey, responses) {
    const resultsContent = document.getElementById('results-content');
    
    if (responses.length === 0) {
        resultsContent.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-chart-bar" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                <p style="color: #666;">No responses yet</p>
            </div>
        `;
        return;
    }

    let html = `
        <div class="results-summary">
            <h3>${survey.title}</h3>
            <p>${survey.description}</p>
            <div class="stats-row">
                <div class="stat">
                    <strong>${responses.length}</strong>
                    <span>Total Responses</span>
                </div>
            </div>
        </div>
    `;

    // Display results for each question
    if (survey.questions) {
        html += '<div class="questions-results">';
        
        survey.questions.forEach((question, index) => {
            html += `
                <div class="question-result">
                    <h4>Q${index + 1}: ${question.text}</h4>
            `;

            // Analyze responses for this question
            const questionResponses = responses.map(r => r.answers && r.answers[question.id]).filter(a => a);

            if (question.type === 'multiple-choice' || question.type === 'checkbox') {
                const optionCounts = {};
                question.options.forEach(opt => optionCounts[opt] = 0);

                questionResponses.forEach(answer => {
                    if (Array.isArray(answer)) {
                        answer.forEach(a => {
                            if (optionCounts.hasOwnProperty(a)) optionCounts[a]++;
                        });
                    } else if (optionCounts.hasOwnProperty(answer)) {
                        optionCounts[answer]++;
                    }
                });

                html += '<div class="options-chart">';
                Object.entries(optionCounts).forEach(([option, count]) => {
                    const percentage = responses.length > 0 ? (count / responses.length * 100).toFixed(1) : 0;
                    html += `
                        <div class="option-bar">
                            <div class="option-label">${option}</div>
                            <div class="bar-container">
                                <div class="bar-fill" style="width: ${percentage}%"></div>
                            </div>
                            <div class="option-count">${count} (${percentage}%)</div>
                        </div>
                    `;
                });
                html += '</div>';

            } else if (question.type === 'rating') {
                const ratings = questionResponses.map(r => parseInt(r)).filter(r => !isNaN(r));
                const avgRating = ratings.length > 0 ? 
                    (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1) : 
                    0;

                html += `
                    <div class="rating-result">
                        <div class="avg-rating">${avgRating} / 5</div>
                        <p>Average Rating from ${ratings.length} responses</p>
                    </div>
                `;

            } else if (question.type === 'yes-no') {
                const yesCount = questionResponses.filter(r => r === 'Yes' || r === 'yes').length;
                const noCount = questionResponses.filter(r => r === 'No' || r === 'no').length;
                const yesPercentage = responses.length > 0 ? (yesCount / responses.length * 100).toFixed(1) : 0;
                const noPercentage = responses.length > 0 ? (noCount / responses.length * 100).toFixed(1) : 0;

                html += `
                    <div class="yes-no-result">
                        <div class="result-item">
                            <strong>Yes:</strong> ${yesCount} (${yesPercentage}%)
                        </div>
                        <div class="result-item">
                            <strong>No:</strong> ${noCount} (${noPercentage}%)
                        </div>
                    </div>
                `;

            } else {
                // Text responses
                html += '<div class="text-responses">';
                questionResponses.slice(0, 5).forEach(answer => {
                    html += `<div class="text-response">"${answer}"</div>`;
                });
                if (questionResponses.length > 5) {
                    html += `<p><em>... and ${questionResponses.length - 5} more responses</em></p>`;
                }
                html += '</div>';
            }

            html += '</div>';
        });

        html += '</div>';
    }

    resultsContent.innerHTML = html;
}

// Handle filter
function handleFilter(e) {
    const status = e.target.value;
    const filtered = status ? surveys.filter(s => s.status === status) : surveys;
    displaySurveys(filtered);
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = surveys.filter(s => 
        s.title.toLowerCase().includes(searchTerm) ||
        s.description.toLowerCase().includes(searchTerm)
    );
    displaySurveys(filtered);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
