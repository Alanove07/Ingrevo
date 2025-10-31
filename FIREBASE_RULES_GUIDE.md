# Firebase Security Rules Setup Guide

## 📋 Overview

The `firestore.rules` file contains comprehensive security rules for your Ingrevo Firebase project. These rules control who can read, write, update, and delete data in your Firestore database.

## 🔐 Security Model

### Authentication Levels

1. **Public Access** - Anyone (no authentication required)
   - Read products, ingredients, allergens
   - View public surveys

2. **Authenticated Users** - Logged in users
   - Read/write their own analytics
   - Update their own allergen preferences
   - Submit survey responses

3. **Admin Users** - Authenticated admin accounts
   - Full CRUD access to all collections
   - Manage products, ingredients, allergens
   - View all user data
   - Access analytics and reports

## 📚 Collection Rules Summary

| Collection | Public Read | User Read | User Write | Admin Full Access |
|------------|-------------|-----------|------------|-------------------|
| **products** | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| **ingredients** | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| **allergens** | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| **users** | ❌ No | ✅ Own only | ✅ Own profile | ✅ Yes |
| **survey** | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| **analytics** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| **surveyResponses** | ❌ No | ✅ Own only | ✅ Own only | ✅ Yes |
| **settings** | ❌ No | ❌ No | ❌ No | ✅ Yes |

## 🚀 Deployment Methods

### Method 1: Firebase Console (Recommended for Beginners)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Select your project: `ingrevo-98c4c`

2. **Navigate to Firestore**
   - Click "Firestore Database" in the left menu
   - Click on the "Rules" tab

3. **Copy Rules**
   - Open the `firestore.rules` file
   - Copy all the content

4. **Paste and Publish**
   - Paste into the Firebase Console editor
   - Click "Publish" button
   - Confirm the deployment

5. **Verify**
   - Check for any syntax errors
   - Rules should show as "Active"

### Method 2: Firebase CLI (For Developers)

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase (if not done)**
   ```bash
   firebase init firestore
   ```
   - Select your project
   - Choose `firestore.rules` as your rules file
   - Choose `firestore.indexes.json` for indexes

4. **Deploy Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

5. **Verify Deployment**
   ```bash
   firebase deploy --only firestore:rules --dry-run
   ```

## 🔍 Rule Explanations

### Products Collection
```javascript
// Anyone can view products (for mobile app)
allow read: if true;

// Only admins can create/update/delete
allow create, update, delete: if isAdmin();
```

**Why?** Products need to be publicly readable so the mobile app can display them without requiring login.

### Ingredients Collection
```javascript
// Public read for ingredient lookup
allow read: if true;

// Admin-only write for data integrity
allow create, update, delete: if isAdmin();
```

**Why?** Ingredients database should be publicly accessible but only admins should modify it to maintain data quality.

### Allergens Collection
```javascript
// Public read for allergen checking
allow read: if true;

// Admin-only write
allow create, update, delete: if isAdmin();
```

**Why?** Critical health information that must be accurate. Public read allows app to check allergens without authentication.

### Users Collection
```javascript
// Users can read their own data
allow read: if isOwner(userId) || isAdmin();

// Users can update only their allergen preferences
allow update: if isOwner(userId) && 
              onlyUpdating(['allergenTracking']);
```

**Why?** Privacy protection - users should only see their own data. They can update their allergen preferences but not their role or status.

### Analytics Collection
```javascript
// Users can log their own actions
allow create: if isSignedIn();

// Only admins can modify or delete
allow update, delete: if isAdmin();
```

**Why?** Allows the app to track user behavior while preventing tampering with analytics data.

## ✅ Validation Rules

### Product Validation
- `name` must be a string
- `barcode` must be a string
- `category` must be one of: dairy, bakery, snacks, beverages, frozen
- `status` must be: active or inactive

### Ingredient Validation
- `name` must be a string
- `category` must be one of: additive, preservative, natural, synthetic, flavor, coloring
- `riskLevel` must be one of: safe, low, medium, high
- `status` must be: active or inactive

### Allergen Validation
- `name` must be a string
- `severity` must be one of: low, medium, high

## 🧪 Testing Rules

### Test in Firebase Console

1. Go to Firestore Database → Rules
2. Click "Rules Playground" tab
3. Test different scenarios:

**Test Public Product Read:**
```
Location: /products/test123
Operation: get
Authenticated: No
Expected: Allow ✅
```

**Test Admin Product Write:**
```
Location: /products/test123
Operation: create
Authenticated: Yes (your admin email)
Expected: Allow ✅
```

**Test User Product Write:**
```
Location: /products/test123
Operation: create
Authenticated: Yes (regular user email)
Expected: Deny ❌
```

### Test with JavaScript

```javascript
// Test reading products (should work)
db.collection('products').get()
  .then(() => console.log('✅ Read products: Success'))
  .catch(err => console.error('❌ Read products: Failed', err));

// Test writing products as non-admin (should fail)
db.collection('products').add({name: 'Test'})
  .then(() => console.log('⚠️ Write products: Should have failed!'))
  .catch(err => console.log('✅ Write products: Correctly denied'));
```

## 🛡️ Security Best Practices

### ✅ DO:
- Keep rules updated as your app evolves
- Test rules thoroughly before deploying
- Use specific field validation
- Implement role-based access control
- Log security events in analytics

### ❌ DON'T:
- Use `allow read, write: if true` in production
- Store sensitive data in Firestore without encryption
- Allow users to modify their own roles
- Skip input validation
- Deploy without testing

## 🚨 Common Issues & Solutions

### Issue: "Permission Denied" when reading products
**Solution:** Check if rules are published. Products should have `allow read: if true`

### Issue: Admin can't write data
**Solution:** Verify admin authentication. Check that `request.auth.token.email` exists

### Issue: Rules won't deploy
**Solution:** Check syntax errors. Use Firebase Console editor for validation

### Issue: Users can see other users' data
**Solution:** Verify `isOwner()` function is being used correctly

## 📊 Monitoring

### Check Rule Usage
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Click "Usage" tab
4. Monitor read/write operations
5. Check for denied requests

### Security Alerts
Enable Cloud Logging to track:
- Failed authentication attempts
- Permission denied errors
- Unusual access patterns

## 🔄 Updating Rules

When you need to update rules:

1. **Test Locally First**
   ```bash
   firebase emulators:start --only firestore
   ```

2. **Update Rules File**
   - Edit `firestore.rules`
   - Add new validation or permissions

3. **Deploy**
   ```bash
   firebase deploy --only firestore:rules
   ```

4. **Verify**
   - Test in Firebase Console
   - Monitor for errors

## 📝 Rule Templates

### Add New Collection

```javascript
match /newCollection/{docId} {
  // Define who can read
  allow read: if isSignedIn();
  
  // Define who can write
  allow create: if isAdmin() && 
                  hasRequiredFields(['field1', 'field2']);
  
  // Define who can update
  allow update: if isAdmin();
  
  // Define who can delete
  allow delete: if isAdmin();
}
```

## 🎯 Next Steps

1. ✅ Deploy the rules to Firebase
2. ✅ Test each collection's access
3. ✅ Verify admin operations work
4. ✅ Test public read access
5. ✅ Monitor for security issues
6. ✅ Update as needed

## 📞 Support

- **Firebase Documentation**: https://firebase.google.com/docs/firestore/security/get-started
- **Rules Reference**: https://firebase.google.com/docs/reference/rules/
- **Best Practices**: https://firebase.google.com/docs/firestore/security/rules-conditions

---

**Your Ingrevo project is now secured with comprehensive Firebase Security Rules!** 🔐
