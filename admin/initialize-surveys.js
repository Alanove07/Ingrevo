/**
 * Initialize Sample Surveys in Firebase
 * 
 * Run this in browser console after logging in to admin portal
 * This will create sample surveys to demonstrate the feature
 */

async function initializeSampleSurveys() {
    console.log('🚀 Initializing sample surveys...');

    const sampleSurveys = [
        {
            title: 'Customer Satisfaction Survey',
            description: 'Help us understand how we can serve you better',
            type: 'customer',
            status: 'active',
            startDate: '2024-10-01',
            endDate: '2024-12-31',
            targetAudience: 'all',
            responseLimit: 0,
            allowAnonymous: true,
            allowMultiple: false,
            questions: [
                {
                    id: 'q1',
                    text: 'How satisfied are you with our overall service?',
                    type: 'rating',
                    required: true
                },
                {
                    id: 'q2',
                    text: 'How often do you shop at our store?',
                    type: 'multiple-choice',
                    required: true,
                    options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'First time']
                },
                {
                    id: 'q3',
                    text: 'What do you like most about shopping with us?',
                    type: 'checkbox',
                    required: false,
                    options: [
                        'Product Quality',
                        'Competitive Prices',
                        'Staff Service',
                        'Store Cleanliness',
                        'Product Variety',
                        'Convenient Location'
                    ]
                },
                {
                    id: 'q4',
                    text: 'Would you recommend us to friends and family?',
                    type: 'yes-no',
                    required: true
                },
                {
                    id: 'q5',
                    text: 'Any additional comments or suggestions?',
                    type: 'textarea',
                    required: false
                }
            ],
            responseCount: 847,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        },
        {
            title: 'Product Feedback Form',
            description: 'Share your thoughts about our products',
            type: 'product',
            status: 'active',
            startDate: '2024-09-15',
            endDate: '2024-11-30',
            targetAudience: 'customers',
            responseLimit: 0,
            allowAnonymous: false,
            allowMultiple: true,
            questions: [
                {
                    id: 'q1',
                    text: 'Which product category are you providing feedback on?',
                    type: 'multiple-choice',
                    required: true,
                    options: [
                        'Dairy Products',
                        'Bakery Items',
                        'Snacks & Beverages',
                        'Frozen Foods',
                        'Fresh Produce'
                    ]
                },
                {
                    id: 'q2',
                    text: 'Rate the product quality',
                    type: 'rating',
                    required: true
                },
                {
                    id: 'q3',
                    text: 'Rate the value for money',
                    type: 'rating',
                    required: true
                },
                {
                    id: 'q4',
                    text: 'Is the ingredient information clear and helpful?',
                    type: 'yes-no',
                    required: true
                },
                {
                    id: 'q5',
                    text: 'What improvements would you like to see?',
                    type: 'textarea',
                    required: false
                }
            ],
            responseCount: 1234,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        },
        {
            title: 'Allergen Awareness Survey',
            description: 'Help us improve our allergen information and safety measures',
            type: 'health',
            status: 'active',
            startDate: '2024-10-10',
            endDate: '2025-01-15',
            targetAudience: 'all',
            responseLimit: 0,
            allowAnonymous: true,
            allowMultiple: false,
            questions: [
                {
                    id: 'q1',
                    text: 'Do you or your family members have food allergies?',
                    type: 'yes-no',
                    required: true
                },
                {
                    id: 'q2',
                    text: 'Which allergens are you concerned about?',
                    type: 'checkbox',
                    required: false,
                    options: [
                        'Milk',
                        'Eggs',
                        'Peanuts',
                        'Tree Nuts',
                        'Soy',
                        'Wheat/Gluten',
                        'Fish',
                        'Shellfish'
                    ]
                },
                {
                    id: 'q3',
                    text: 'How important is clear allergen labeling to you?',
                    type: 'rating',
                    required: true
                },
                {
                    id: 'q4',
                    text: 'Do you currently read ingredient labels before purchasing?',
                    type: 'multiple-choice',
                    required: true,
                    options: [
                        'Always',
                        'Usually',
                        'Sometimes',
                        'Rarely',
                        'Never'
                    ]
                },
                {
                    id: 'q5',
                    text: 'Would you use a mobile app that scans products for allergens?',
                    type: 'yes-no',
                    required: true
                },
                {
                    id: 'q6',
                    text: 'Any suggestions for improving allergen safety?',
                    type: 'textarea',
                    required: false
                }
            ],
            responseCount: 567,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        },
        {
            title: 'Shopping Experience Review',
            description: 'Tell us about your in-store experience',
            type: 'store',
            status: 'draft',
            startDate: null,
            endDate: null,
            targetAudience: 'all',
            responseLimit: 500,
            allowAnonymous: true,
            allowMultiple: false,
            questions: [
                {
                    id: 'q1',
                    text: 'How would you rate the store cleanliness?',
                    type: 'rating',
                    required: true
                },
                {
                    id: 'q2',
                    text: 'How would you rate staff friendliness?',
                    type: 'rating',
                    required: true
                },
                {
                    id: 'q3',
                    text: 'Was it easy to find what you were looking for?',
                    type: 'yes-no',
                    required: true
                },
                {
                    id: 'q4',
                    text: 'What aspects of the store need improvement?',
                    type: 'checkbox',
                    required: false,
                    options: [
                        'Checkout Speed',
                        'Product Availability',
                        'Store Layout',
                        'Parking',
                        'Opening Hours',
                        'Pricing Display'
                    ]
                }
            ],
            responseCount: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        },
        {
            title: 'Q3 Customer Feedback',
            description: 'Quarterly customer satisfaction check',
            type: 'customer',
            status: 'closed',
            startDate: '2024-07-01',
            endDate: '2024-09-30',
            targetAudience: 'all',
            responseLimit: 0,
            allowAnonymous: true,
            allowMultiple: false,
            questions: [
                {
                    id: 'q1',
                    text: 'Overall satisfaction with Ingrevo',
                    type: 'rating',
                    required: true
                },
                {
                    id: 'q2',
                    text: 'What was the highlight of Q3?',
                    type: 'text',
                    required: false
                },
                {
                    id: 'q3',
                    text: 'Would you shop with us again?',
                    type: 'yes-no',
                    required: true
                }
            ],
            responseCount: 789,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }
    ];

    try {
        const db = firebase.firestore();
        let successCount = 0;

        for (const survey of sampleSurveys) {
            await db.collection('survey').add(survey);
            successCount++;
            console.log(`✅ Created: ${survey.title}`);
        }

        console.log(`\n🎉 Successfully created ${successCount} sample surveys!`);
        console.log('\n📊 Summary:');
        console.log('- 3 Active surveys');
        console.log('- 1 Draft survey');
        console.log('- 1 Closed survey');
        console.log('- Total of 25 questions across all surveys');
        console.log('\n👉 Refresh the Surveys page to see them!');

        return { success: true, count: successCount };

    } catch (error) {
        console.error('❌ Error creating sample surveys:', error);
        return { success: false, error: error.message };
    }
}

// Also create some sample responses for the active surveys
async function createSampleResponses() {
    console.log('\n📝 Creating sample survey responses...');

    const db = firebase.firestore();
    
    // Get the first active survey
    const surveysSnapshot = await db.collection('survey')
        .where('status', '==', 'active')
        .limit(1)
        .get();

    if (surveysSnapshot.empty) {
        console.log('⚠️ No active surveys found. Create surveys first.');
        return;
    }

    const surveyDoc = surveysSnapshot.docs[0];
    const surveyId = surveyDoc.id;
    const survey = surveyDoc.data();

    console.log(`📊 Creating responses for: ${survey.title}`);

    // Create 10 sample responses
    const sampleResponses = [];
    
    for (let i = 0; i < 10; i++) {
        const answers = {};
        
        // Generate answers based on question types
        survey.questions.forEach(question => {
            switch (question.type) {
                case 'rating':
                    answers[question.id] = Math.floor(Math.random() * 5) + 1;
                    break;
                case 'yes-no':
                    answers[question.id] = Math.random() > 0.5 ? 'Yes' : 'No';
                    break;
                case 'multiple-choice':
                    if (question.options && question.options.length > 0) {
                        answers[question.id] = question.options[Math.floor(Math.random() * question.options.length)];
                    }
                    break;
                case 'checkbox':
                    if (question.options && question.options.length > 0) {
                        const count = Math.floor(Math.random() * 3) + 1;
                        const selected = [];
                        for (let j = 0; j < count; j++) {
                            const option = question.options[Math.floor(Math.random() * question.options.length)];
                            if (!selected.includes(option)) {
                                selected.push(option);
                            }
                        }
                        answers[question.id] = selected;
                    }
                    break;
                case 'text':
                    answers[question.id] = `Sample response ${i + 1}`;
                    break;
                case 'textarea':
                    answers[question.id] = `This is a sample detailed response for question ${question.id}. The service was great and I enjoyed my experience.`;
                    break;
            }
        });

        sampleResponses.push({
            surveyId: surveyId,
            userId: null, // Anonymous
            answers: answers,
            submittedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    // Save all responses
    try {
        for (const response of sampleResponses) {
            await db.collection('surveyResponses').add(response);
        }
        
        // Update survey response count
        await db.collection('survey').doc(surveyId).update({
            responseCount: firebase.firestore.FieldValue.increment(10)
        });

        console.log(`✅ Created 10 sample responses for survey: ${survey.title}`);
        console.log('👉 Click the chart icon to view results!');
        
    } catch (error) {
        console.error('❌ Error creating responses:', error);
    }
}

// Instructions
console.log(`
╔════════════════════════════════════════════════════════════╗
║  🎯 Survey Initialization Script                          ║
╚════════════════════════════════════════════════════════════╝

To initialize sample surveys, run:
  
  initializeSampleSurveys()

To create sample responses (after surveys are created):
  
  createSampleResponses()

To do both:
  
  initializeSampleSurveys().then(() => createSampleResponses())

This will create:
✓ 5 sample surveys (3 active, 1 draft, 1 closed)
✓ 10 sample responses for one active survey
✓ Various question types demonstration
✓ Realistic survey data

`);
