# Ingrevo Admin Portal

**Read Beyond The Label!**

The Ingrevo Admin Portal is a comprehensive management system for the Ingrevo smart hypermarket ingredient safety platform.

## Features

### Dashboard
- Real-time statistics overview
- Product scan analytics
- Allergen alert monitoring
- Recent activity feed
- Interactive charts (Chart.js)

### Products Management
- Add, edit, and delete products
- Barcode scanning integration
- Ingredient tracking
- Allergen tagging
- Category management
- Import/Export functionality
- Advanced search and filters

### Admin Pages (Planned)
- **Ingredients Database**: Manage ingredient library with allergen associations
- **Allergens Management**: Configure allergen alerts and user preferences
- **Surveys**: Create and manage customer/store surveys
- **Analytics**: Deep insights into shopping trends and product data
- **Users**: Manage user accounts and permissions
- **Settings**: System configuration and preferences

## Getting Started

### Prerequisites
- Web browser (Chrome, Firefox, Safari, Edge)
- Firebase account with configured project
- Admin account credentials

### Setup Instructions

1. **Firebase Configuration**
   - Project ID: `ingrevo-98c4c`
   - Configuration file: `firebase-config.js`
   - Authentication: Email/Password enabled

2. **Create Admin Account**
   - Follow instructions in `SETUP_ADMIN_ACCOUNTS.md`
   - Use Firebase Console to create admin users

3. **Access the Portal**
   - Navigate to: `login.html`
   - Enter admin credentials
   - You'll be redirected to the dashboard

## File Structure

```
Ingrevo/
├── index.html              # Public landing page
├── login.html              # Admin authentication
├── firebase-config.js      # Firebase configuration
├── home-style.css          # Landing page styles
├── home-script.js          # Landing page scripts
├── style.css               # Login page styles
├── login.js                # Authentication logic
├── admin/
│   ├── dashboard.html      # Main admin dashboard
│   ├── dashboard.js        # Dashboard functionality
│   ├── products.html       # Products management
│   ├── products.js         # Products CRUD operations
│   ├── admin-style.css     # Admin portal styles
│   └── [other pages...]    # Additional admin pages
└── assets/
    └── logo.jpg            # Ingrevo logo
```

## Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with variables, flexbox, grid
- **Vanilla JavaScript**: No framework dependencies

### Backend Services
- **Firebase Authentication**: Email/password auth
- **Firebase Firestore**: Real-time database (configured)
- **Firebase Storage**: Image uploads (configured)

### Libraries & Tools
- **Font Awesome 6.4.0**: Icon library
- **Chart.js**: Data visualization
- **Google Fonts (Poppins)**: Typography

## Key Features

### Authentication
- Secure email/password login
- Session management (7-day expiration)
- "Remember me" functionality
- Password reset via email
- Auto-redirect if not authenticated

### Responsive Design
- Mobile-first approach
- Breakpoints: 968px, 640px
- Touch-friendly UI elements
- Collapsible sidebar navigation

### User Experience
- Smooth animations and transitions
- Loading states and feedback
- Toast notifications
- Modal dialogs for forms
- Inline validation

## Dashboard Features

### Statistics Cards
- Total Products: Real-time count
- Total Ingredients: Database size
- Allergen Alerts: Active warnings
- Total Users: Platform users

### Charts
- Product scans over time
- Allergen alert trends
- Weekly activity patterns

### Recent Alerts
- Priority-based alerts
- Time-stamped notifications
- Quick action buttons

### Product Table
- Paginated product list
- Inline allergen badges
- Quick edit/delete actions

### Top Allergens
- Visual progress bars
- Sorted by frequency
- Color-coded warnings

## Products Management

### Features
- **CRUD Operations**: Create, Read, Update, Delete
- **Search**: Real-time product search
- **Filters**: Category and allergen filters
- **Pagination**: Navigate large product lists
- **Bulk Actions**: Select multiple products
- **Import/Export**: CSV data transfer

### Product Fields
- Product Name
- Barcode (unique identifier)
- Category
- Brand
- Description
- Ingredients (comma-separated)
- Allergens (multiple selection)
- Product Image
- Status (Active/Inactive)

## Development Guidelines

### Adding New Admin Pages

1. **Create HTML File**
   ```html
   <!-- Copy structure from products.html -->
   <!-- Update active nav item -->
   <!-- Update page title -->
   ```

2. **Create JavaScript File**
   ```javascript
   // Follow pattern from products.js
   // Include authentication check
   // Implement CRUD operations
   ```

3. **Update Navigation**
   ```html
   <!-- Add link in sidebar of all pages -->
   ```

### Firebase Integration

Currently using sample data. To integrate with Firebase Firestore:

```javascript
// Example: Load products from Firestore
const db = firebase.firestore();
const productsRef = db.collection('products');

async function loadProducts() {
    const snapshot = await productsRef.get();
    products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    renderProducts();
}

// Example: Add product to Firestore
async function addProduct(productData) {
    await productsRef.add({
        ...productData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
}
```

### Styling Guidelines

- Use CSS variables for theming (defined in admin-style.css)
- Follow mobile-first responsive approach
- Maintain consistent spacing (1rem base unit)
- Use Font Awesome icons consistently
- Keep color scheme aligned with brand

## Security Considerations

### Authentication
- All admin pages check authentication on load
- Session expiration after 7 days
- Automatic redirect to login if not authenticated

### Data Validation
- Client-side form validation
- Required field checks
- Input sanitization (implement server-side)

### Best Practices
- Never commit Firebase credentials to public repos
- Implement proper Firebase Security Rules
- Use environment variables for sensitive data
- Enable HTTPS in production

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

### Phase 1 (Current)
- [x] Dashboard with statistics
- [x] Products management
- [ ] Complete Firebase integration

### Phase 2
- [ ] Ingredients database management
- [ ] Allergens configuration
- [ ] User management
- [ ] Settings page

### Phase 3
- [ ] Surveys and feedback system
- [ ] Advanced analytics dashboard
- [ ] Report generation
- [ ] Email notifications

### Phase 4
- [ ] Barcode scanner integration
- [ ] Mobile app API
- [ ] Real-time collaboration
- [ ] Audit logging

## Support

For issues or questions:
- Project Lead: Alanove Jenny Bazil
- Repository: [GitHub repository URL]

## License

Copyright © 2024 Ingrevo. All rights reserved.

---

**Ingrevo** - Making food shopping safer and smarter.
*Read Beyond The Label!*
