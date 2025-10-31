# How to Create Admin Accounts

Since you're now using **Email/Password authentication** instead of Google Sign-In, you need to create admin user accounts in Firebase.

## 📋 Method 1: Firebase Console (Recommended for Admin Setup)

### Step 1: Go to Firebase Console
1. Visit [Firebase Console](https://console.firebase.google.com/project/ingrevo-98c4c/authentication/users)
2. Navigate to **Authentication** → **Users** tab

### Step 2: Add User Manually
1. Click **"Add user"** button
2. Enter email: `admin@ingrevo.com` (or your preferred email)
3. Enter password: Create a strong password
4. Click **"Add user"**

### Step 3: Test Login
1. Go back to your login page
2. Use the email and password you just created
3. Click "Sign In"

---

## 📋 Method 2: Enable Self-Registration (Optional)

If you want users to register themselves, you can create a registration page.

### Create `register.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - Ingrevo Admin</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="login-container">
        <div class="logo-section">
            <h1 class="brand-title">Create Admin Account</h1>
            <p class="brand-subtitle">Register for Ingrevo Admin Portal</p>
        </div>

        <div class="login-card">
            <form id="register-form" class="login-form">
                <div class="form-group">
                    <label for="reg-email">Email Address</label>
                    <input type="email" id="reg-email" required>
                </div>

                <div class="form-group">
                    <label for="reg-password">Password</label>
                    <input type="password" id="reg-password" required minlength="6">
                </div>

                <div class="form-group">
                    <label for="reg-confirm">Confirm Password</label>
                    <input type="password" id="reg-confirm" required>
                </div>

                <button type="submit" class="login-btn">Create Account</button>
            </form>

            <p style="text-align: center; margin-top: 1rem;">
                <a href="index.html" style="color: #0891B2;">Already have an account? Sign in</a>
            </p>

            <div id="error-message" class="error-message" style="display: none;">
                <p id="error-text"></p>
            </div>
        </div>
    </div>

    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
    <script src="firebase-config.js"></script>
    
    <script>
        document.getElementById('register-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirm = document.getElementById('reg-confirm').value;
            
            if (password !== confirm) {
                showError('Passwords do not match');
                return;
            }
            
            if (password.length < 6) {
                showError('Password must be at least 6 characters');
                return;
            }
            
            try {
                await firebase.auth().createUserWithEmailAndPassword(email, password);
                alert('Account created! Redirecting to login...');
                window.location.href = 'index.html';
            } catch (error) {
                showError(error.message);
            }
        });
        
        function showError(msg) {
            document.getElementById('error-text').textContent = msg;
            document.getElementById('error-message').style.display = 'block';
        }
    </script>
</body>
</html>
```

Then add a link to registration on your main login page if needed.

---

## 📋 Method 3: Using Firebase CLI (For Developers)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Use Firebase Auth Emulator for testing
firebase emulators:start --only auth
```

---

## 🔐 Recommended Admin Accounts

Create these accounts for testing:

| Email | Password | Role |
|-------|----------|------|
| admin@ingrevo.com | (Your secure password) | Main Admin |
| test@ingrevo.com | Test123456! | Testing |
| manager@ingrevo.com | (Your secure password) | Manager |

---

## ⚠️ Important Security Notes

1. **Enable Email/Password Sign-In in Firebase:**
   - Go to Firebase Console → Authentication → Sign-in method
   - Enable "Email/Password" provider
   - Click Save

2. **Password Requirements:**
   - Minimum 6 characters (Firebase default)
   - Recommend using strong passwords with letters, numbers, symbols

3. **Disable Public Registration:**
   - If you only want specific admins, DON'T create a public registration page
   - Manually create accounts in Firebase Console

4. **Email Verification (Optional but Recommended):**
   - You can enable email verification for added security
   - Users must verify their email before accessing the system

---

## 🚀 Quick Test Account

For immediate testing, create this account in Firebase Console:

**Email:** `admin@ingrevo.com`  
**Password:** `Ingrevo2025!`

Then try logging in with these credentials on your login page.

---

## 📞 Need Help?

If you encounter issues:
1. Check Firebase Console → Authentication → Sign-in method
2. Ensure "Email/Password" is **enabled**
3. Check browser console (F12) for error messages
4. Verify Firebase config in `firebase-config.js` is correct
