# Survey Creation Feature - User Guide

## 📋 Overview

The Survey Creation feature allows admins to create, manage, and analyze surveys directly from the Ingrevo Admin Portal. This comprehensive system includes multiple question types, response tracking, and detailed analytics.

## ✨ Features

### Survey Management
- ✅ Create new surveys with multiple questions
- ✅ Edit existing surveys
- ✅ Delete surveys (with response cleanup)
- ✅ View detailed survey results
- ✅ Filter surveys by status
- ✅ Search surveys by title or description

### Question Types Supported
1. **Text Answer** - Short text responses
2. **Long Text** - Paragraph responses
3. **Multiple Choice** - Single selection from options
4. **Checkboxes** - Multiple selections allowed
5. **Rating Scale** - 1-5 star ratings
6. **Yes/No** - Binary choice questions

### Survey Settings
- Target audience selection
- Response limits
- Anonymous responses
- Multiple responses per user
- Start and end dates
- Status management (Draft, Active, Closed)

## 🚀 How to Use

### Creating a New Survey

1. **Navigate to Surveys Page**
   - Click "Surveys" in the admin sidebar
   - URL: `admin/surveys.html`

2. **Click "Create New Survey" Button**
   - Located in the actions bar
   - Opens the survey creation modal

3. **Fill Basic Information**
   ```
   - Survey Title (required)
   - Description (required)
   - Survey Type: Customer, Product, Health, Store, or General
   - Status: Draft, Active, or Closed
   - Start Date (optional)
   - End Date (optional)
   ```

4. **Add Questions**
   - Click "Add Question" button
   - Fill in question details:
     * Question Text (required)
     * Question Type (required)
     * Mark as Required (optional)
   
   - For Multiple Choice or Checkboxes:
     * Enter options (one per line)
     * Example:
       ```
       Very Satisfied
       Satisfied
       Neutral
       Dissatisfied
       Very Dissatisfied
       ```

5. **Configure Settings**
   ```
   - Target Audience: All Users, Customers, Members, or New Users
   - Response Limit: 0 = Unlimited
   - Allow Anonymous Responses: ☐
   - Allow Multiple Responses: ☐
   ```

6. **Save Survey**
   - Click "Save Survey" button
   - Survey is saved to Firebase
   - Success notification appears

### Editing a Survey

1. **Find the Survey**
   - Use search or filters
   - Locate the survey in the table

2. **Click Edit Icon** (pencil icon)
   - Survey data loads into modal
   - All fields are pre-filled

3. **Make Changes**
   - Update any fields
   - Add/remove/edit questions

4. **Save Changes**
   - Click "Save Survey"
   - Changes are updated in Firebase

### Viewing Survey Results

1. **Click Results Icon** (chart icon)
   - Opens results modal
   - Shows response summary

2. **View Analytics**
   - **Multiple Choice/Checkboxes**: Visual bar charts with percentages
   - **Rating Scale**: Average rating calculation
   - **Yes/No**: Percentage breakdown
   - **Text Answers**: Sample responses displayed

3. **Export Results** (Coming Soon)
   - Export to CSV/Excel
   - Generate PDF reports

### Deleting a Survey

1. **Click Delete Icon** (trash icon)
   - Confirmation dialog appears

2. **Confirm Deletion**
   - Survey is permanently deleted
   - All associated responses are also deleted

## 📊 Survey Statistics

The dashboard shows:
- **Total Surveys**: All surveys created
- **Active Surveys**: Currently running surveys
- **Total Responses**: Sum of all responses
- **Avg Response Rate**: Percentage of active surveys

## 🎨 Survey Types

### Customer Satisfaction
- Measure customer happiness
- NPS (Net Promoter Score)
- Service quality feedback

### Product Feedback
- Product reviews
- Feature requests
- Quality ratings

### Health & Allergens
- Allergen awareness
- Health concerns
- Dietary preferences

### Store Experience
- Shopping experience
- Store cleanliness
- Staff friendliness

### General Feedback
- Open-ended surveys
- Suggestion boxes
- General inquiries

## 💾 Firebase Integration

### Collections Used

#### 1. `survey` Collection
Stores survey configurations:
```javascript
{
  title: "Customer Satisfaction Survey",
  description: "Help us improve your experience",
  type: "customer",
  status: "active",
  startDate: "2024-10-30",
  endDate: "2024-12-31",
  targetAudience: "all",
  responseLimit: 0,
  allowAnonymous: true,
  allowMultiple: false,
  questions: [
    {
      id: "q1",
      text: "How satisfied are you with our service?",
      type: "multiple-choice",
      required: true,
      options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"]
    }
  ],
  responseCount: 0,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 2. `surveyResponses` Collection
Stores user responses:
```javascript
{
  surveyId: "survey123",
  userId: "user456" or null (anonymous),
  answers: {
    q1: "Very Satisfied",
    q2: ["Option 1", "Option 2"],
    q3: 5
  },
  submittedAt: Timestamp
}
```

### Security Rules

The survey collections have the following access control:

```javascript
// survey collection
allow read: if true; // Public can view surveys
allow create, update, delete: if isAdmin(); // Only admins can manage

// surveyResponses collection
allow read: if isAdmin(); // Only admins can view responses
allow create: if isSignedIn(); // Users can submit responses
allow update, delete: if isAdmin() || isOwner(request.auth.uid);
```

## 🔧 Technical Details

### File Structure
```
admin/
├── surveys.html       # Main surveys page with modal
├── surveys.js         # Survey management logic
└── admin-style.css    # Includes survey-specific styles
```

### Key Functions

#### `loadSurveys()`
Loads all surveys from Firebase and displays them in the table.

#### `openCreateModal()`
Opens modal in create mode with one initial question.

#### `addQuestion()`
Dynamically adds a new question to the survey form.

#### `handleSubmit(e)`
Validates and saves survey to Firebase.

#### `editSurvey(surveyId)`
Loads survey data into modal for editing.

#### `deleteSurvey(surveyId)`
Deletes survey and all associated responses.

#### `viewResults(surveyId)`
Loads and displays survey results with analytics.

#### `displayResults(survey, responses)`
Generates visual analytics for each question type.

## 📱 Mobile Responsive

The survey creation interface is fully responsive:
- Stacked layouts on mobile
- Touch-friendly buttons
- Scrollable modals
- Optimized forms

## 🎯 Best Practices

### Creating Effective Surveys

1. **Keep it Short**
   - Aim for 5-10 questions
   - Respect user time

2. **Clear Questions**
   - Use simple language
   - Avoid double-barreled questions
   - Be specific

3. **Balanced Options**
   - Provide neutral options
   - Include "Other" when appropriate
   - Avoid leading options

4. **Logical Flow**
   - Start with easy questions
   - Group related questions
   - End with open-ended feedback

5. **Test First**
   - Create as Draft
   - Preview thoroughly
   - Test all question types

### Managing Responses

1. **Monitor Regularly**
   - Check response rates
   - Close when sufficient data collected
   - Archive old surveys

2. **Analyze Results**
   - Look for patterns
   - Compare across time periods
   - Share insights with team

3. **Act on Feedback**
   - Respond to concerns
   - Implement suggestions
   - Communicate changes

## 🐛 Troubleshooting

### Survey Not Saving
**Issue**: Survey doesn't save when clicking Save Survey
**Solution**: 
- Check console for errors
- Verify Firebase connection
- Ensure all required fields are filled
- Check that at least one question is added

### Questions Not Appearing
**Issue**: Questions section is empty
**Solution**:
- Click "Add Question" button
- Check if questions were properly saved
- Refresh the page

### Results Not Loading
**Issue**: Results modal shows "No responses yet"
**Solution**:
- Verify responses exist in Firebase
- Check surveyResponses collection
- Ensure surveyId matches

### Options Not Showing
**Issue**: Question options field doesn't appear
**Solution**:
- Select "Multiple Choice" or "Checkboxes" type
- Options field only shows for these types

## 📈 Future Enhancements

Coming soon:
- [ ] Survey templates
- [ ] Question branching logic
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Response exports (CSV, PDF)
- [ ] Survey cloning
- [ ] A/B testing
- [ ] Time-based triggers

## 🔗 Related Features

- **Analytics Dashboard**: View overall survey metrics
- **User Management**: Track which users responded
- **Settings**: Configure survey defaults

## 💡 Example Use Cases

### 1. Customer Satisfaction Survey
```
Title: "How are we doing?"
Type: Customer
Questions:
- Rating: Overall satisfaction (1-5)
- Multiple Choice: Service quality
- Text: What can we improve?
Settings: Anonymous, No limit
```

### 2. Product Feedback Form
```
Title: "Tell us about [Product Name]"
Type: Product
Questions:
- Yes/No: Would you recommend?
- Rating: Product quality (1-5)
- Checkboxes: Which features do you use?
- Long Text: Additional comments
Settings: Customers only, One response
```

### 3. Allergen Awareness Survey
```
Title: "Food Safety Awareness"
Type: Health
Questions:
- Multiple Choice: Do you have food allergies?
- Checkboxes: Which allergens affect you?
- Yes/No: Do you read ingredient labels?
- Rating: How important is allergen info? (1-5)
Settings: All users, Multiple responses
```

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Verify Firebase configuration
3. Ensure security rules are deployed
4. Check network connection
5. Review this guide

---

**Your survey creation feature is ready to use!** 📊✨

Start creating engaging surveys to gather valuable feedback from your users!
