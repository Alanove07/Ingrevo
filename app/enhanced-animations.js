/**
 * Ingrevo Enhanced Animations & Interactions
 * Advanced JavaScript for scroll reveals, particle effects, and smooth interactions
 */

(function() {
    'use strict';

    // ===========================
    // Scroll Reveal Animation
    // ===========================
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.feature-card, .step, .team-member, .faq-item');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal');
                    setTimeout(() => {
                        entry.target.classList.add('active');
                    }, entry.target.dataset.delay || 0);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach((element, index) => {
            element.dataset.delay = index * 100; // Stagger animation
            revealObserver.observe(element);
        });
    }

    // ===========================
    // Navbar Scroll Effect
    // ===========================
    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide navbar on scroll down, show on scroll up
            if (currentScroll > lastScroll && currentScroll > 500) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
        });
    }

    // ===========================
    // Particle Background Effect
    // ===========================
    function createParticles(container, count = 20) {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            // Random animation delay and duration
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            
            // Random size
            const size = Math.random() * 4 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';

            particlesContainer.appendChild(particle);
        }

        container.appendChild(particlesContainer);
    }

    // ===========================
    // Smooth Counter Animation
    // ===========================
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toString().includes('K') ? target : Math.floor(target);
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    function initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    const text = entry.target.textContent;
                    const number = parseInt(text.replace(/\D/g, ''));
                    const suffix = text.replace(/[0-9]/g, '');
                    
                    let current = 0;
                    const increment = number / 100;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= number) {
                            entry.target.textContent = number + suffix;
                            clearInterval(timer);
                        } else {
                            entry.target.textContent = Math.floor(current) + suffix;
                        }
                    }, 20);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // ===========================
    // Magnetic Button Effect
    // ===========================
    function initMagneticButtons() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-outline');

        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ===========================
    // Parallax Effect
    // ===========================
    function initParallax() {
        const parallaxElements = document.querySelectorAll('.gradient-orb, .phone-mockup');

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;

            parallaxElements.forEach((element, index) => {
                const speed = (index + 1) * 0.1;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // ===========================
    // Cursor Trail Effect
    // ===========================
    function initCursorTrail() {
        const trail = [];
        const trailLength = 10;

        document.addEventListener('mousemove', (e) => {
            trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });

            if (trail.length > trailLength) {
                trail.shift();
            }

            renderTrail();
        });

        function renderTrail() {
            // Remove old trail elements
            document.querySelectorAll('.cursor-trail').forEach(el => el.remove());

            trail.forEach((point, index) => {
                const dot = document.createElement('div');
                dot.className = 'cursor-trail';
                dot.style.position = 'fixed';
                dot.style.left = point.x + 'px';
                dot.style.top = point.y + 'px';
                dot.style.width = '4px';
                dot.style.height = '4px';
                dot.style.borderRadius = '50%';
                dot.style.background = 'rgba(20, 184, 166, ' + (index / trailLength) + ')';
                dot.style.pointerEvents = 'none';
                dot.style.zIndex = '9999';
                dot.style.transition = 'all 0.3s ease';
                
                document.body.appendChild(dot);

                // Fade out and remove
                setTimeout(() => {
                    dot.style.opacity = '0';
                    setTimeout(() => dot.remove(), 300);
                }, 100);
            });
        }
    }

    // ===========================
    // Typing Animation
    // ===========================
    function initTypingAnimation() {
        const typingElements = document.querySelectorAll('[data-typing]');

        typingElements.forEach(element => {
            const text = element.getAttribute('data-typing');
            element.textContent = '';
            let index = 0;

            function type() {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                    setTimeout(type, 100);
                }
            }

            // Start typing when element is in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        type();
                        observer.unobserve(element);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(element);
        });
    }

    // ===========================
    // Card Tilt Effect
    // ===========================
    function initCardTilt() {
        const cards = document.querySelectorAll('.feature-card, .recommendation-card, .team-member');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }

    // ===========================
    // Loading Progress Bar
    // ===========================
    function initLoadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.id = 'loading-progress';
        progressBar.style.position = 'fixed';
        progressBar.style.top = '0';
        progressBar.style.left = '0';
        progressBar.style.width = '0';
        progressBar.style.height = '3px';
        progressBar.style.background = 'linear-gradient(90deg, #14B8A6, #06B6D4)';
        progressBar.style.zIndex = '10000';
        progressBar.style.transition = 'width 0.3s ease';
        document.body.appendChild(progressBar);

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    progressBar.style.opacity = '0';
                    setTimeout(() => progressBar.remove(), 300);
                }, 500);
            }
            progressBar.style.width = progress + '%';
        }, 200);
    }

    // ===========================
    // Enhanced Health Score Circle
    // ===========================
    function animateHealthScore() {
        const scoreCircles = document.querySelectorAll('.score-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const scoreValue = entry.target.parentElement.querySelector('.score-value');
                    const score = parseInt(scoreValue.textContent);
                    const circumference = 283;
                    const offset = circumference - (score / 100) * circumference;
                    
                    entry.target.style.strokeDashoffset = offset;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        scoreCircles.forEach(circle => observer.observe(circle));
    }

    // ===========================
    // Notification System
    // ===========================
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '1rem 1.5rem';
        notification.style.borderRadius = 'var(--radius-lg)';
        notification.style.background = type === 'success' ? 'var(--gradient-success)' : 'var(--gradient-primary)';
        notification.style.color = 'white';
        notification.style.boxShadow = 'var(--shadow-lg)';
        notification.style.zIndex = '10000';
        notification.style.animation = 'slideInRight 0.5s ease';
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
        .cursor-trail {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
    `;
    document.head.appendChild(style);

    // ===========================
    // Initialize All Effects
    // ===========================
    window.addEventListener('DOMContentLoaded', () => {
        initLoadingProgress();
        initScrollReveal();
        initNavbarScroll();
        initCounters();
        initMagneticButtons();
        initParallax();
        initTypingAnimation();
        initCardTilt();
        animateHealthScore();

        // Add particles to hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            createParticles(hero, 30);
        }

        // Add particles to about hero
        const aboutHero = document.querySelector('.about-hero');
        if (aboutHero) {
            createParticles(aboutHero, 20);
        }

        // Optional: Enable cursor trail (can be disabled for performance)
        // initCursorTrail();

        console.log('✨ Enhanced animations initialized');
    });

    // Export for external use
    window.IngrevoAnimations = {
        showNotification,
        animateCounter,
        createParticles
    };

})();
