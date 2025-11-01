# 🎨 Theme System - Quick Start Guide

## How to Use the Theme Toggle

### For Users:

1. **Locate the Theme Toggle Button**
   - Look for the moon (🌙) or sun (☀️) icon in the top-right corner of the navigation bar
   - It's present on all pages: Home, Profile, Recommendations, About, and Scan

2. **Toggle the Theme**
   - **Click once** to switch between light and dark mode
   - The icon changes automatically:
     - 🌙 Moon = Currently in Light Mode (click to go dark)
     - ☀️ Sun = Currently in Dark Mode (click to go light)

3. **Your Preference is Saved**
   - The app remembers your choice
   - Your preference persists across page navigation
   - It works even after closing the browser

---

## Visual Changes

### Light Mode (Default)
- ✨ Clean white backgrounds
- 🖤 Dark text for readability
- 💡 Bright and airy feel
- Perfect for daytime use

### Dark Mode
- 🌙 Dark navy backgrounds
- 💫 Light text for contrast
- 🎯 Reduced eye strain
- Ideal for nighttime use

---

## Test Page

Visit `app/theme-test.html` to see:
- Live theme switching
- Color variable values
- Component examples
- System status information

---

## Technical Info

### Keyboard Shortcut
Currently none - click the button to toggle

### Auto-Detection
The app respects your system's dark mode preference if you haven't set a preference yet.

### Browser Support
Works in all modern browsers:
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Opera

---

## Troubleshooting

### Theme not saving?
- Check if localStorage is enabled in your browser
- Clear cache and try again

### Wrong theme on load?
- Your system preference may be overriding
- Click the toggle once to set your preference

### Button not working?
- Ensure JavaScript is enabled
- Check console for errors (F12)
- Try refreshing the page

---

## What Gets Themed

Everything! Including:
- 📄 Page backgrounds
- 🎴 Cards and components
- 📝 Forms and inputs
- 🔘 Buttons
- 🏷️ Badges and tags
- 📊 Tables
- 🎯 Modals and overlays
- 🎨 Icons and graphics
- ⚡ Animations

---

## Examples

### Navigation Bar
- **Light:** White background with dark text
- **Dark:** Dark slate background with light text

### Cards
- **Light:** White cards with subtle gray borders
- **Dark:** Dark cards with lighter borders for contrast

### Buttons
- **Light:** Teal buttons on light backgrounds
- **Dark:** Same teal buttons with enhanced glow effect

### Forms
- **Light:** Light gray input backgrounds
- **Dark:** Dark input fields with light text

---

## Pro Tips

1. 💡 **Try both themes** - See which one you prefer!
2. 🌙 **Use dark mode at night** - Reduces eye strain
3. ☀️ **Use light mode in bright environments** - Better visibility
4. 🔄 **Switch anytime** - No need to refresh
5. 🎨 **Brand colors stay the same** - Teal accent in both modes

---

## For Developers

### Adding Theme Support to New Components

1. **Use CSS Variables:**
```css
.my-component {
    background: var(--bg-card);
    color: var(--text-primary);
    border: 1px solid var(--border-light);
}
```

2. **Add Dark Mode Override (if needed):**
```css
body.dark-mode .my-component {
    /* specific dark mode adjustments */
}
```

3. **That's it!** The component will automatically theme.

### Listen for Theme Changes

```javascript
window.addEventListener('themeChanged', (e) => {
    console.log('Theme:', e.detail.theme);
    // Your code here
});
```

### Get Current Theme

```javascript
const isDark = document.body.classList.contains('dark-mode');
const theme = localStorage.getItem('theme');
```

---

## Files Modified

See `THEME_IMPLEMENTATION.md` for complete details.

---

## Questions?

Check the browser console (F12) for theme system logs:
- 🎨 Theme system initialized
- ✨ Theme switched to: [dark/light]
- 🌙 Dark mode loaded from preferences
- ☀️ Light mode active

---

**Enjoy your new theme system!** 🎉
