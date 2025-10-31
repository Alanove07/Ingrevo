# Firebase Collections Integration Guide

## 📚 Collection Structure

Your Ingrevo project now uses the following Firebase Firestore collections:

### 1. **products** Collection
Stores all product information including ingredients and allergens.

**Document Structure:**
```javascript
{
  name: "Organic Milk",
  barcode: "8901234567890",
  category: "dairy",
  brand: "Fresh Farms",
  description: "Fresh organic whole milk",
  ingredients: ["Milk", "Vitamin D"],
  allergens: ["lactose"],
  status: "active",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 2. **ingredients** Collection
Database of all ingredients with allergen associations.

**Document Structure:**
```javascript
{
  name: "Wheat Flour",
  category: "natural",
  allergens: ["gluten"],
  riskLevel: "low",
  description: "Common grain ingredient",
  productsUsing: 0,
  status: "active",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 3. **allergens** Collection
Master list of allergen types tracked by the system.

**Document Structure:**
```javascript
{
  name: "Peanuts",
  icon: "fa-peanut",
  color: "#F59E0B",
  products: 0,
  users: 0,
  severity: "high",
  description: "Tree nut allergen - can cause severe reactions",
  createdAt: Timestamp
}
```

### 4. **users** Collection
User accounts and their allergen tracking preferences.

**Document Structure:**
```javascript
{
  name: "John Doe",
  email: "john.doe@email.com",
  role: "user",
  allergenTracking: ["peanuts", "lactose"],
  joinedDate: Timestamp,
  status: "active"
}
```

### 5. **survey** Collection
Customer surveys and feedback forms.

**Document Structure:**
```javascript
{
  title: "Customer Satisfaction Survey",
  type: "customer",
  status: "active",
  responses: 0,
  createdDate: Timestamp,
  endsOn: Timestamp
}
```

### 6. **analytics** Collection
Tracks user interactions, scans, and allergen alerts.

**Document Structure:**
```javascript
{
  type: "allergen_alert", // or "product_scan"
  user: "John Doe",
  product: "Organic Milk",
  allergen: "Lactose",
  severity: "medium",
  status: "resolved",
  dateTime: Timestamp
}
```

## 🚀 Quick Start

### Step 1: Initialize Sample Data

1. Open your admin portal (login.html)
2. Login with your admin account
3. Open browser console (F12)
4. Load the initialization script:

```javascript
// Option A: Include the script in dashboard.html
<script src="initialize-firebase.js"></script>

// Option B: Copy-paste from initialize-firebase.js into console
```

5. Run the initialization function:
```javascript
initializeFirebaseData()
```

6. Wait for success messages
7. Refresh the page

### Step 2: Verify Data

Navigate to each admin page to verify data loaded:
- **Dashboard**: Check statistics cards
- **Products**: Should show 5 sample products
- **Ingredients**: Should show 6 sample ingredients
- **Allergens**: Should show 8 allergen types
- **Users**: Should show 3 sample users

## 🔧 Updated Files

The following files now integrate with Firebase:

### Products Management
- `admin/products.js`
  - `loadProductsFromFirebase()` - Loads products from Firestore
  - `handleSubmit()` - Adds/updates products in Firestore
  - `deleteProduct()` - Deletes products from Firestore

### Ingredients Management
- `admin/ingredients.js`
  - `loadIngredientsFromFirebase()` - Loads ingredients
  - `handleSubmit()` - Adds/updates ingredients
  - `deleteIngredient()` - Deletes ingredients

### Allergens Management
- `admin/allergens.js`
  - `loadAllergensFromFirebase()` - Loads allergen types
  - `loadRecentAlerts()` - Loads recent allergen alerts from analytics

### Dashboard
- `admin/dashboard.js`
  - `loadDashboardData()` - Loads real-time statistics from all collections

## 📊 Firebase Security Rules

Recommended Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return isSignedIn() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Products - Admin write, all authenticated read
    match /products/{product} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }
    
    // Ingredients - Admin write, all authenticated read
    match /ingredients/{ingredient} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }
    
    // Allergens - Admin write, all authenticated read
    match /allergens/{allergen} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }
    
    // Users - Admin full access, users can read their own
    match /users/{userId} {
      allow read: if isSignedIn() && (request.auth.uid == userId || isAdmin());
      allow write: if isAdmin();
    }
    
    // Survey - Admin write, all authenticated read
    match /survey/{survey} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }
    
    // Analytics - Admin write, authenticated read
    match /analytics/{analytic} {
      allow read: if isSignedIn();
      allow write: if isSignedIn(); // Users can log their own analytics
    }
  }
}
```

## 🔍 Querying Data

### Get all products
```javascript
const db = firebase.firestore();
const snapshot = await db.collection('products').get();
const products = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));
```

### Get products by category
```javascript
const snapshot = await db.collection('products')
  .where('category', '==', 'dairy')
  .get();
```

### Get products with specific allergen
```javascript
const snapshot = await db.collection('products')
  .where('allergens', 'array-contains', 'peanuts')
  .get();
```

### Add new product
```javascript
await db.collection('products').add({
  name: "New Product",
  barcode: "1234567890",
  category: "snacks",
  allergens: ["gluten"],
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
});
```

### Update product
```javascript
await db.collection('products').doc(productId).update({
  name: "Updated Name",
  updatedAt: firebase.firestore.FieldValue.serverTimestamp()
});
```

### Delete product
```javascript
await db.collection('products').doc(productId).delete();
```

## 🎯 Real-time Listeners

For real-time updates, use listeners instead of one-time reads:

```javascript
// Listen to products collection
db.collection('products').onSnapshot((snapshot) => {
  const products = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  renderProducts(products);
});
```

## 🔐 Authentication Integration

All admin pages check authentication:
```javascript
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is logged in - load data
    loadData();
  } else {
    // Redirect to login
    window.location.href = '../login.html';
  }
});
```

## 📈 Analytics Tracking

Track user actions:

```javascript
// Track product scan
await db.collection('analytics').add({
  type: 'product_scan',
  product: productName,
  user: userName,
  dateTime: firebase.firestore.FieldValue.serverTimestamp()
});

// Track allergen alert
await db.collection('analytics').add({
  type: 'allergen_alert',
  user: userName,
  product: productName,
  allergen: allergenName,
  severity: 'high',
  status: 'active',
  dateTime: firebase.firestore.FieldValue.serverTimestamp()
});
```

## 🐛 Troubleshooting

### Data not loading?
1. Check browser console for errors
2. Verify Firebase configuration in `firebase-config.js`
3. Check Firestore security rules
4. Ensure collections are created and have data

### Permission denied errors?
1. Update Firestore security rules (see above)
2. Verify user is authenticated
3. Check user role in users collection

### Data not updating?
1. Check browser console for errors
2. Verify internet connection
3. Check Firebase quota limits
4. Verify document ID is correct

## 📝 Next Steps

1. **Customize Data**: Edit initialization script for your needs
2. **Add Indexes**: Create indexes for complex queries
3. **Setup Backups**: Enable automatic backups in Firebase Console
4. **Monitor Usage**: Check Firebase Console for usage stats
5. **Add Validation**: Implement data validation rules
6. **Test Security**: Test security rules thoroughly

## 🎉 Success!

Your Ingrevo admin portal is now fully integrated with Firebase Firestore! All CRUD operations (Create, Read, Update, Delete) work with real-time data from your Firebase project.

---

**Need Help?**
- Firebase Documentation: https://firebase.google.com/docs/firestore
- Ingrevo Documentation: See ADMIN_PORTAL_README.md
