# 🛒 Ingrevo - Smart Ingredient Safety System

## 📋 Project Overview

**Ingrevo** is a smart hypermarket ingredient safety system that analyzes product ingredients, allergens, and chemicals. This web platform serves as the internal admin portal for:

- 📊 Collecting and managing survey data from customers and stores
- 🗄️ Storing ingredient & product datasets
- 👥 Managing admin access and user feedback
- 📈 Viewing analytics and system usage (future feature)

---

## 🚀 Current Status

**Version:** 1.0 (Foundation & Login System Only)

### ✅ Implemented Features
- Login page with Google Sign-In authentication
- Firebase Authentication integration
- User session management with localStorage
- Responsive design (mobile, tablet, desktop)
- Modern UI with animations and loading states
- Error handling with user-friendly messages
- Session persistence (7-day expiration)

### 🔜 Planned Features (Future Updates)
- Admin dashboard with navigation
- Survey data collection and management
- Ingredient database interface
- Product dataset management
- Analytics and reporting
- User feedback system
- Firebase Firestore integration
- Real-time data synchronization

---

## 📁 Project Structure

```
/ingrevo-site/
│
├── index.html              # Public landing page (MAIN ENTRY POINT)
├── home-style.css          # Landing page styling
├── home-script.js          # Landing page interactions
├── login.html              # Admin login page
├── style.css               # Login page styling
├── login.js                # Email/Password authentication logic
├── firebase-config.js      # Firebase initialization (configured)
├── README.md               # Project documentation (this file)
├── SETUP_ADMIN_ACCOUNTS.md # Guide for creating admin accounts
│
├── /assets/                # Logo, icons, and images
│   └── logo.png            # Ingrevo logo (placeholder)
│
├── /admin/                 # Admin dashboard files (future)
│   ├── dashboard.html      # Main admin dashboard (to be created)
│   ├── surveys.html        # Survey management page (to be created)
│   ├── ingredients.html    # Ingredient database page (to be created)
│   └── analytics.html      # Analytics & reports (to be created)
│
└── /scripts/               # Additional JavaScript modules (future)
    └── (future utility scripts)
```

---

## 🔧 Setup Instructions

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for Firebase SDK)
- Firebase account (free tier is sufficient)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"** or select an existing project
3. Follow the setup wizard:
   - Enter project name: `Ingrevo` (or your preferred name)
   - Enable Google Analytics (optional)
   - Create project

### Step 2: Add Web App to Firebase

1. In your Firebase project, click the **Web icon** (`</>`) to add a web app
2. Register your app:
   - App nickname: `Ingrevo Admin Portal`
   - Do NOT check "Firebase Hosting" (unless you plan to use it)
3. Copy the Firebase configuration object (looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-ABC123XYZ"
};
```

### Step 3: Enable Google Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Google** provider
3. Toggle **Enable**
4. Add your support email
5. Save

### Step 4: Configure the Project

1. Open `firebase-config.js` in your code editor
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",                    // Paste your apiKey
    authDomain: "YOUR_PROJECT.firebaseapp.com",     // Paste your authDomain
    projectId: "YOUR_PROJECT_ID",                   // Paste your projectId
    storageBucket: "YOUR_PROJECT.appspot.com",      // Paste your storageBucket
    messagingSenderId: "YOUR_SENDER_ID",            // Paste your messagingSenderId
    appId: "YOUR_APP_ID",                           // Paste your appId
    measurementId: "YOUR_MEASUREMENT_ID"            // Paste your measurementId
};
```

3. Save the file

### Step 5: Add Your Logo (Optional)

1. Create or obtain your Ingrevo logo image
2. Save it as `logo.png` in the `/assets/` folder
3. Recommended size: 512x512px or 1024x1024px (will be scaled down)
4. If no logo is provided, a placeholder will be shown automatically

### Step 6: Run the Project

#### Option A: Using Live Server (Recommended)
1. Install [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code
2. Right-click on `index.html`
3. Select **"Open with Live Server"**
4. Browser will open automatically at `http://localhost:5500`

#### Option B: Using Python HTTP Server
```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

#### Option C: Using Node.js HTTP Server
```bash
# Install globally
npm install -g http-server

# Run in project directory
http-server -p 8000

# Then open: http://localhost:8000
```

#### Option D: Direct File Opening (Not Recommended)
- Double-click `index.html`
- **Note:** Firebase Auth may not work properly with `file://` protocol

### Step 7: Test Login

1. Open the project in your browser
2. Click **"Continue with Google"** button
3. Select your Google account
4. If successful, you'll see a success message
5. Check browser console (`F12`) for logs

---

## 🎨 Technology Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Authentication** | Firebase Authentication (Google OAuth) |
| **Database** | Firebase Firestore (future) |
| **Storage** | Firebase Storage (future) |
| **Hosting** | Any static host (Firebase Hosting, Netlify, Vercel, etc.) |
| **Design** | Google Fonts (Poppins), Custom CSS |

---

## 🔐 Security Notes

### Firebase API Keys
- Firebase API keys in `firebase-config.js` are **safe to expose** in client-side code
- They are not secret keys and only identify your Firebase project
- Security is enforced through **Firebase Security Rules**

### Recommended Security Rules (Future Setup)

#### Firestore Rules Example:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### Storage Rules Example:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### User Session Management
- User data is stored in `localStorage` for convenience
- Sessions expire after 7 days automatically
- Use HTTPS in production to encrypt data in transit

---

## 🐛 Troubleshooting

### Issue: "Firebase not initialized" error
**Solution:** Make sure you've replaced the placeholder values in `firebase-config.js` with your actual Firebase credentials.

### Issue: "Popup blocked" error
**Solution:** Allow popups in your browser settings or try clicking the button again.

### Issue: "Unauthorized domain" error
**Solution:** 
1. Go to Firebase Console → Authentication → Settings
2. Under "Authorized domains", add your domain (e.g., `localhost` or your production domain)

### Issue: Logo not showing
**Solution:** 
- Check if `assets/logo.png` exists
- A placeholder will automatically appear if the logo is missing
- Ensure image path is correct

### Issue: Can't sign out
**Solution:** Open browser console and run:
```javascript
firebase.auth().signOut().then(() => {
    localStorage.clear();
    window.location.reload();
});
```

---

## 📱 Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Opera | 76+ |

---

## 🚀 Deployment

### Firebase Hosting (Recommended)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init hosting
```

4. Deploy:
```bash
firebase deploy
```

### Other Hosting Options
- **Netlify:** Drag and drop the project folder
- **Vercel:** Connect GitHub repo and deploy
- **GitHub Pages:** Push to `gh-pages` branch

---

## 📝 Next Steps

1. ✅ Complete Firebase setup
2. ✅ Test Google Sign-In
3. 🔜 Create admin dashboard (`/admin/dashboard.html`)
4. 🔜 Set up Firebase Firestore database
5. 🔜 Build survey collection interface
6. 🔜 Create ingredient database management
7. 🔜 Add analytics and reporting

---

## 👥 Team & Support

**Project:** Ingrevo  
**Version:** 1.0 (Login System Foundation)  
**Last Updated:** 2025  

For questions or support, please contact the Ingrevo development team.

---

## 📄 License

Internal use only - Ingrevo Admin Portal  
© 2025 Ingrevo. All rights reserved.

---

## 🎯 Quick Reference

### Useful Commands

```bash
# Check if Firebase is initialized (in browser console)
firebase.apps.length

# Get current user
firebase.auth().currentUser

# Sign out programmatically
firebase.auth().signOut()

# Clear localStorage
localStorage.clear()
```

### Important Files
- `index.html` → Login page UI
- `style.css` → All styling
- `login.js` → Authentication logic
- `firebase-config.js` → Firebase credentials

---

**Happy coding! 🎉**
