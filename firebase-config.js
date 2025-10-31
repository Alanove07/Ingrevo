/**
 * Firebase Configuration File
 * Purpose: Initialize Firebase app with project credentials
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to Firebase Console: https://console.firebase.google.com/
 * 2. Create a new project or select existing one
 * 3. Click on "Web" icon to add web app
 * 4. Copy the configuration object
 * 5. Replace the placeholder values below with your actual Firebase config
 * 6. Enable Authentication > Sign-in method > Google in Firebase Console
 * 
 * SECURITY NOTE:
 * These keys are safe to expose in client-side code as they are not secret.
 * Use Firebase Security Rules to protect your database.
 */

// Firebase configuration object
// Your actual Firebase project credentials for Ingrevo
const firebaseConfig = {
    apiKey: "AIzaSyDAmeRJEcjufUaMIiip4i9s-P5UnkPBZ60",
    authDomain: "ingrevo-98c4c.firebaseapp.com",
    projectId: "ingrevo-98c4c",
    storageBucket: "ingrevo-98c4c.firebasestorage.app",
    messagingSenderId: "869635670979",
    appId: "1:869635670979:web:1050f7e90f6ca91fb3b376",
    measurementId: "G-NQY7XTBDLF"
};

// Initialize Firebase
let app;
try {
    app = firebase.initializeApp(firebaseConfig);
    console.log("✅ Firebase initialized successfully");
} catch (error) {
    console.error("❌ Firebase initialization error:", error);
    // Show user-friendly error on the page
    if (document.getElementById('error-message')) {
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('error-text').textContent = 
            'Firebase configuration error. Please contact the administrator.';
    }
}

// Initialize Firebase Authentication
const auth = firebase.auth();

// Optional: Enable persistence (keeps users logged in across sessions)
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .catch((error) => {
        console.error("Authentication persistence error:", error);
    });

// Export for use in other scripts
window.firebaseApp = app;
window.firebaseAuth = auth;
