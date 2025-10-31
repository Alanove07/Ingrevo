/**
 * Ingrevo About Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeAboutPage();
});

/**
 * Initialize about page
 */
function initializeAboutPage() {
    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const answer = item.querySelector('.faq-answer');
            const icon = question.querySelector('i');
            
            // Toggle active class
            item.classList.toggle('active');
            
            // Toggle answer visibility
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            } else {
                answer.style.maxHeight = '0';
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
    
    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

/**
 * Handle contact form submission
 */
function handleContactSubmit(e) {
    e.preventDefault();
    
    showNotification('Sending message...', 'info');
    
    // Simulate form submission
    setTimeout(() => {
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        e.target.reset();
    }, 1500);
}

// Add about page specific styles
const style = document.createElement('style');
style.textContent = `
    .about-page {
        padding-top: 0;
    }
    
    .about-hero {
        background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
        padding: 6rem 0;
        text-align: center;
        color: var(--white);
        position: relative;
        overflow: hidden;
    }
    
    .about-hero::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -20%;
        width: 600px;
        height: 600px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
    }
    
    .about-hero-content {
        position: relative;
        z-index: 1;
    }
    
    .about-hero h1 {
        color: var(--white);
        margin-bottom: 1rem;
    }
    
    .lead {
        font-size: 1.25rem;
        opacity: 0.95;
    }
    
    .mission-section {
        padding: var(--section-padding) 0;
    }
    
    .mission-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: center;
    }
    
    .mission-text h2 {
        margin-bottom: 1.5rem;
    }
    
    .mission-text p {
        color: var(--gray-600);
        line-height: 1.8;
        margin-bottom: 1rem;
    }
    
    .mission-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
        margin-top: 2rem;
    }
    
    .mission-stats .stat h3 {
        color: var(--primary);
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }
    
    .mission-stats .stat p {
        color: var(--gray-600);
        margin: 0;
    }
    
    .mission-image {
        display: flex;
        justify-content: center;
    }
    
    .image-placeholder {
        width: 100%;
        height: 400px;
        background: linear-gradient(135deg, var(--primary-light) 0%, var(--secondary) 100%);
        border-radius: var(--radius-xl);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 6rem;
        color: rgba(255, 255, 255, 0.5);
    }
    
    .values-section {
        padding: var(--section-padding) 0;
        background: var(--gray-50);
    }
    
    .values-section h2 {
        text-align: center;
        margin-bottom: 3rem;
    }
    
    .values-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
    }
    
    .value-card {
        background: var(--white);
        padding: 2rem;
        border-radius: var(--radius-xl);
        text-align: center;
    }
    
    .value-icon {
        width: 4rem;
        height: 4rem;
        background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
        color: var(--white);
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        margin: 0 auto 1.5rem;
    }
    
    .value-card h3 {
        margin-bottom: 0.75rem;
    }
    
    .value-card p {
        color: var(--gray-600);
        margin: 0;
    }
    
    .team-section {
        padding: var(--section-padding) 0;
    }
    
    .team-section h2 {
        text-align: center;
        margin-bottom: 0.5rem;
    }
    
    .section-subtitle {
        text-align: center;
        color: var(--gray-600);
        margin-bottom: 3rem;
    }
    
    .team-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 2rem;
    }
    
    .team-card {
        background: var(--white);
        padding: 2rem;
        border-radius: var(--radius-xl);
        text-align: center;
        box-shadow: var(--shadow);
    }
    
    .team-avatar {
        width: 100px;
        height: 100px;
        background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
        color: var(--white);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        margin: 0 auto 1.5rem;
    }
    
    .team-card h3 {
        margin-bottom: 0.5rem;
        font-size: 1.125rem;
    }
    
    .role {
        color: var(--primary);
        font-weight: 600;
        font-size: 0.875rem;
        margin-bottom: 0.75rem;
    }
    
    .bio {
        color: var(--gray-600);
        font-size: 0.875rem;
        margin-bottom: 1rem;
    }
    
    .team-card .social-links {
        justify-content: center;
    }
    
    .technology-section {
        padding: var(--section-padding) 0;
        background: var(--gray-50);
    }
    
    .technology-section h2 {
        text-align: center;
        margin-bottom: 3rem;
    }
    
    .tech-features {
        max-width: 900px;
        margin: 0 auto;
    }
    
    .tech-feature {
        display: flex;
        gap: 2rem;
        padding: 2rem;
        background: var(--white);
        border-radius: var(--radius-xl);
        margin-bottom: 1.5rem;
    }
    
    .tech-icon {
        width: 4rem;
        height: 4rem;
        background: linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%);
        color: var(--white);
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        flex-shrink: 0;
    }
    
    .tech-info h3 {
        margin-bottom: 0.5rem;
    }
    
    .tech-info p {
        color: var(--gray-600);
        margin: 0;
    }
    
    .contact-section {
        padding: var(--section-padding) 0;
    }
    
    .contact-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
    }
    
    .contact-info h2 {
        margin-bottom: 1rem;
    }
    
    .contact-info > p {
        color: var(--gray-600);
        margin-bottom: 2rem;
    }
    
    .contact-methods {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-bottom: 3rem;
    }
    
    .contact-method {
        display: flex;
        gap: 1.5rem;
        align-items: start;
    }
    
    .method-icon {
        width: 3rem;
        height: 3rem;
        background: rgba(20, 184, 166, 0.1);
        color: var(--primary);
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        flex-shrink: 0;
    }
    
    .method-info h4 {
        margin-bottom: 0.25rem;
    }
    
    .method-info a {
        color: var(--primary);
    }
    
    .method-info p {
        color: var(--gray-600);
        margin: 0;
    }
    
    .social-section h4 {
        margin-bottom: 1rem;
    }
    
    .social-links-large {
        display: flex;
        gap: 1rem;
    }
    
    .social-link {
        width: 3rem;
        height: 3rem;
        border-radius: var(--radius-lg);
        background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
        color: var(--white);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        transition: all var(--transition-fast);
    }
    
    .social-link:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
    }
    
    .contact-form-container {
        background: var(--white);
        padding: 2.5rem;
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
    }
    
    .contact-form h3 {
        margin-bottom: 1.5rem;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    
    .faq-section {
        padding: var(--section-padding) 0;
        background: var(--gray-50);
    }
    
    .faq-section h2 {
        text-align: center;
        margin-bottom: 3rem;
    }
    
    .faq-list {
        max-width: 800px;
        margin: 0 auto;
    }
    
    .faq-item {
        background: var(--white);
        border-radius: var(--radius-lg);
        margin-bottom: 1rem;
        overflow: hidden;
    }
    
    .faq-question {
        width: 100%;
        padding: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: none;
        border: none;
        text-align: left;
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-fast);
    }
    
    .faq-question:hover {
        background: var(--gray-50);
    }
    
    .faq-question i {
        color: var(--primary);
        transition: transform var(--transition-fast);
    }
    
    .faq-answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height var(--transition-base);
    }
    
    .faq-answer p {
        padding: 0 1.5rem 1.5rem;
        color: var(--gray-600);
        margin: 0;
    }
    
    @media (max-width: 1024px) {
        .team-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    
    @media (max-width: 768px) {
        .mission-content,
        .contact-grid {
            grid-template-columns: 1fr;
        }
        
        .values-grid,
        .team-grid {
            grid-template-columns: 1fr;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);
