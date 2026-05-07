/* ============================================
   Kapë Production - script.js
   Inspired by seastarfilm.com
   ============================================ */

// Wait for fonts to load before initializing animations
document.fonts.ready.then(() => {
    initSVGStrokeDraw();
    initScrollReveal();
    init3DScrollWords();
    initFAQ();
    initTeamCarousel();
    initFloatingSupport();
    initSmoothScroll();
    initNavbarScroll();
    initMobileMenu();
    initEntranceAnimations();
});

// ---- GSAP Registration ----
gsap.registerPlugin(ScrollTrigger);

// ---- SVG Stroke Draw Fallback ----
function initSVGStrokeDraw() {
    const svgText = document.querySelector('.svg-draw-text text');
    if (svgText && svgText.getTotalLength) {
        try {
            const length = svgText.getTotalLength();
            svgText.style.strokeDasharray = length;
            svgText.style.strokeDashoffset = -length;
        } catch (e) {
            // Fallback to CSS animation values
        }
    }
}

// ---- Scroll Reveal Letter Animation ----
function initScrollReveal() {
    const headings = document.querySelectorAll('[data-scroll-reveal]');
    
    headings.forEach(heading => {
        const text = heading.textContent;
        heading.innerHTML = '';
        
        const chars = [];
        const words = text.split(' ');
        
        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.whiteSpace = 'nowrap';
            
            for (let i = 0; i < word.length; i++) {
                const span = document.createElement('span');
                span.classList.add('char');
                span.textContent = word[i];
                span.style.opacity = '0.15';
                span.style.display = 'inline-block';
                wordSpan.appendChild(span);
                chars.push(span);
            }
            
            heading.appendChild(wordSpan);
            
            // Add space between words
            if (wordIndex < words.length - 1) {
                const space = document.createTextNode(' ');
                heading.appendChild(space);
            }
        });
        
        gsap.to(chars, {
            opacity: 1,
            stagger: 0.05,
            scrollTrigger: {
                trigger: heading,
                start: "top 85%",
                end: "top 40%",
                scrub: true
            }
        });
    });
}

// ---- 3D Scroll Words Animation ----
function init3DScrollWords() {
    const words = document.querySelectorAll('.scroll-3d-word');
    
    words.forEach((word, index) => {
        const z = parseFloat(word.dataset.z) || 0;
        const rotateYStart = parseFloat(word.dataset.rotateYStart) || 0;
        const rotateYEnd = parseFloat(word.dataset.rotateYEnd) || 0;
        const rotateXStart = parseFloat(word.dataset.rotateXStart) || 0;
        
        // Set initial position
        gsap.set(word, {
            transform: `translateZ(${z}px) rotateY(${rotateYStart}deg) rotateX(${rotateXStart}deg)`
        });
        
        // Animate on scroll
        gsap.to(word, {
            transform: `translateZ(${z}px) rotateY(${rotateYEnd}deg) rotateX(0deg)`,
            scrollTrigger: {
                trigger: word,
                start: "top 90%",
                end: "+=90%",
                scrub: true
            }
        });
    });
    
    // Position words vertically
    const container = document.querySelector('.scroll-3d-container');
    if (container && words.length > 0) {
        const containerHeight = container.offsetHeight || window.innerHeight * 4;
        const spacing = containerHeight / (words.length + 1);
        
        words.forEach((word, index) => {
            const topPos = spacing * (index + 1);
            word.style.top = `${topPos}px`;
        });
    }
}

// ---- FAQ Accordion ----
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    otherQuestion.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            question.setAttribute('aria-expanded', !isActive);
        });
    });
}

// ---- Team Carousel ----
function initTeamCarousel() {
    const carousel = document.getElementById('teamCarousel');
    const prevBtn = document.getElementById('teamPrev');
    const nextBtn = document.getElementById('teamNext');
    
    if (!carousel || !prevBtn || !nextBtn) return;
    
    const scrollAmount = carousel.offsetWidth * 0.8;
    
    prevBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
    
    // Touch/drag support
    let isDown = false;
    let startX;
    let scrollLeft;
    
    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.style.cursor = 'grabbing';
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });
    
    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.style.cursor = 'grab';
    });
    
    carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.style.cursor = 'grab';
    });
    
    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });
    
    carousel.style.cursor = 'grab';
}

// ---- Floating Support Button ----
function initFloatingSupport() {
    const supportBtn = document.getElementById('supportBtn');
    const supportModal = document.getElementById('supportModal');
    const supportClose = document.getElementById('supportClose');
    
    if (!supportBtn || !supportModal) return;
    
    supportBtn.addEventListener('click', () => {
        supportModal.classList.toggle('active');
    });
    
    if (supportClose) {
        supportClose.addEventListener('click', () => {
            supportModal.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (!supportBtn.contains(e.target) && !supportModal.contains(e.target)) {
            supportModal.classList.remove('active');
        }
    });
}

// ---- Smooth Scroll ----
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                // Close mobile menu if open
                document.getElementById('mobileMenu').classList.remove('active');
                
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ---- Navbar Scroll Effect ----
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}

// ---- Mobile Menu ----
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!hamburger || !mobileMenu) return;
    
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });
}

// ---- Entrance Animations ----
function initEntranceAnimations() {
    // About section
    const aboutText = document.querySelector('.about-text');
    const aboutImage = document.querySelector('.about-image');
    
    if (aboutText) {
        gsap.from(aboutText, {
            x: -60,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: aboutText,
                start: 'top 75%'
            }
        });
    }
    
    if (aboutImage) {
        gsap.from(aboutImage, {
            scale: 1.05,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: aboutImage,
                start: 'top 75%'
            }
        });
    }
    
    // Mission/Vision cards
    const mvCards = document.querySelectorAll('.mv-card');
    mvCards.forEach((card, index) => {
        gsap.from(card, {
            y: 60,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 80%'
            }
        });
    });
    
    // Why features
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        gsap.from(item, {
            x: 40,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 80%'
            }
        });
    });
    
    // Value cards
    const valueCards = document.querySelectorAll('.value-card');
    valueCards.forEach((card, index) => {
        gsap.from(card, {
            y: 60,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            }
        });
    });
    
    // Service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        gsap.from(card, {
            y: 60,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            }
        });
    });
    
    // Work cards
    const workCards = document.querySelectorAll('.work-card');
    workCards.forEach((card, index) => {
        gsap.from(card, {
            y: 80,
            opacity: 0,
            duration: 1,
            delay: index * 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 80%'
            }
        });
    });
    
    // Team cards
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach((card, index) => {
        gsap.from(card, {
            x: 60,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#teamCarousel',
                start: 'top 70%'
            }
        });
    });
    
    // Client logos
    const clientLogos = document.querySelectorAll('.client-logo');
    clientLogos.forEach((logo, index) => {
        gsap.from(logo, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.05,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: logo,
                start: 'top 90%'
            }
        });
    });
    
    // FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
        gsap.from(item, {
            y: 20,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 85%'
            }
        });
    });
    
    // CTA content
    const ctaContent = document.querySelector('.cta-content');
    if (ctaContent) {
        gsap.from(ctaContent, {
            scale: 0.95,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: ctaContent,
                start: 'top 70%'
            }
        });
    }
    
    // Section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        gsap.from(header, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: header,
                start: 'top 80%'
            }
        });
    });
}

// ---- Reinitialize on resize ----
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 200);
});
