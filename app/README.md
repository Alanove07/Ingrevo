# Ingrevo Web App

**Shop Smarter. Shop Safer.**

A modern, responsive web application for smart ingredient and allergen awareness in supermarkets.

## Features

### 🏠 Home Page
- Futuristic hero section with animated gradients
- Feature highlights
- How it works section
- Call-to-action areas

### 📷 Scan Page
- **Camera Scanning**: Real-time barcode scanning with device camera
- **Manual Entry**: Input barcodes manually
- **Instant Analysis**: View product details, ingredients, and allergen information
- **AI Health Score**: Intelligent health scoring system
- **Allergen Alerts**: Red banner warnings for detected allergens
- **Success Indicators**: Green alerts for safe products

### 👤 Profile Page
- **Dietary Preferences**: Vegan, vegetarian, gluten-free, etc.
- **Allergen Management**: Toggle your allergen sensitivities
- **Scan History**: Track all previously scanned products
- **Saved Products**: Collection of safe items
- **Settings**: Notification preferences and privacy controls

### 🔄 Recommendations Page
- **Smart Alternatives**: AI-powered product recommendations
- **Comparison Tools**: Side-by-side product comparisons
- **Health Score Ratings**: Color-coded health indicators
- **Filter Options**: Filter by allergen-free, healthier, similar products

### ℹ️ About/Contact Page
- Company mission and values
- Team profiles
- Technology overview
- Contact form and FAQs

## Design Features

### 🎨 Visual Design
- **Color Scheme**: White/teal theme with soft gradients
- **Animations**: Smooth transitions and floating elements
- **Cards**: Floating card design with shadows
- **Buttons**: Rounded buttons with hover effects
- **Icons**: Font Awesome 6.4.0 integration

### 📱 Responsive Design
- **Mobile**: Optimized for phones (< 480px)
- **Tablet**: Adaptive layout for tablets (< 768px)
- **Desktop**: Full-featured experience (> 1024px)

### ⚡ Alert System
- **Allergen Alerts**: Red gradient banners with warning icons
- **Success Alerts**: Green gradient with check icons
- **AI Tips**: Blue info cards with robot icon
- **Notifications**: Toast notifications for user actions

## Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Custom properties, animations, gradients
- **JavaScript (ES6+)**: Vanilla JS with modern features

### Features
- **Camera API**: Navigator.mediaDevices for camera access
- **LocalStorage**: Save user preferences and products
- **Mock Data**: Sample products and user profiles
- **Responsive Images**: Adaptive layouts

## File Structure

```
app/
├── home.html                 # Landing page
├── scan.html                 # Product scanning page
├── profile.html              # User profile management
├── recommendations.html      # Product alternatives
├── about.html               # Company information
├── app-style.css            # Main stylesheet
├── app-script.js            # Common functionality
├── scan-script.js           # Scanning features
├── profile-script.js        # Profile management
├── recommendations-script.js # Recommendations logic
└── about-script.js          # About page features
```

## Getting Started

### Installation

1. Clone the repository
2. Navigate to the app directory
3. Open `home.html` in a modern web browser

### Usage

#### Scanning Products
1. Go to Scan page
2. Choose Camera Scan or Manual Entry
3. For camera: Grant camera permissions
4. Scan barcode or enter manually
5. View instant results with allergen alerts

#### Managing Profile
1. Navigate to Profile page
2. Set dietary preferences
3. Configure allergen sensitivities
4. View scan history
5. Manage saved products

#### Finding Alternatives
1. After scanning a product
2. Click "View Alternatives"
3. Browse recommendations
4. Compare health scores
5. Save preferred products

## Mock Data

### Sample Barcodes
- `123456789012` - Organic Whole Milk (Safe)
- `987654321098` - Peanut Butter Cookies (Contains allergens)

### User Allergen Profile
Default sensitivities: Peanuts, Gluten, Eggs

## Features Highlights

### Camera Scanning
- Real-time video feed
- Animated scan frame
- Auto-detection simulation
- Capture and analyze

### Health Scoring
- AI-powered analysis
- 0-100 scale rating
- Visual progress circle
- Breakdown by category

### Allergen Detection
- 14+ common allergens tracked
- Color-coded badges
- User-specific warnings
- Safe/Contains indicators

### Recommendations
- AI-generated alternatives
- Best match highlighting
- Health score comparisons
- Price and nutrition data

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

- [ ] Firebase integration for real data
- [ ] Barcode scanner library integration
- [ ] User authentication
- [ ] Product database API
- [ ] Social sharing features
- [ ] Shopping list integration
- [ ] Meal planning tools
- [ ] Nutrition tracking

## Credits

- **Design**: Modern futuristic UI with teal/white theme
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Inter & Space Grotesk from Google Fonts

## License

© 2025 Ingrevo. All rights reserved.

---

**Shop Smarter. Shop Safer.**
