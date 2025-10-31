/**
 * Ingrevo Home Page JavaScript
 * Purpose: Handle interactions on the landing page
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 Ingrevo home page loaded');

    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            }
        });
    });

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }

        lastScroll = currentScroll;
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const message = contactForm.querySelector('textarea').value;

            console.log('Contact form submitted:', { name, email, message });

            // Show success message
            alert('Thank you for contacting us! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();

            // TODO: Integrate with Firebase or backend API to store contact submissions
            // Example:
            // firebase.firestore().collection('contacts').add({
            //     name: name,
            //     email: email,
            //     message: message,
            //     timestamp: new Date()
            // });
        });
    }

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards
    document.querySelectorAll('.feature-card, .benefit-card, .step').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Dynamic stat counter animation (hero section)
    const stats = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;
        
        stats.forEach(stat => {
            const text = stat.textContent;
            const hasPercent = text.includes('%');
            
            if (hasPercent) {
                const target = parseInt(text);
                let current = 0;
                const increment = target / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target + '%';
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current) + '%';
                    }
                }, 30);
            }
        });
        
        statsAnimated = true;
    }

    // Trigger stats animation when hero is in view
    const heroObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateStats();
        }
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        heroObserver.observe(heroStats);
    }

    // Add active state to nav links based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Logo error handler
    const logoImages = document.querySelectorAll('.logo-small, .nav-logo img');
    logoImages.forEach(img => {
        img.onerror = function() {
            // Create placeholder if logo fails to load
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, #0891B2, #3B82F6);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 1.25rem;
            `;
            placeholder.textContent = 'I';
            this.parentNode.replaceChild(placeholder, this);
        };
    });

    // Add hover effect to CTA buttons
    const ctaButtons = document.querySelectorAll('.btn');
    ctaButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    console.log('✅ All interactions initialized');
});

// Utility: Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add scroll-to-top button (optional enhancement)
window.addEventListener('scroll', function() {
    if (window.pageYOffset > 500) {
        // Show scroll to top button
        // Implementation can be added if needed
    }
});
