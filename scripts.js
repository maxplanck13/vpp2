/* =====================================================
   VPACK PULP PRODUCTS — Premium JavaScript Engine
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ─────────────────────────────────────────────
       1. FLOATING NATURE PARTICLES
       ───────────────────────────────────────────── */
    const canvas = document.getElementById('particles-canvas');
    const emojis = ['🍃', '🌿', '🍂', '🌱', '🌾', '🍀', '🐣'];
    const particleCount = 14;

    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        const leftPos = Math.random() * 100;
        const dur = 10 + Math.random() * 14;
        const delay = Math.random() * 15;
        p.style.setProperty('--dur', `${dur}s`);
        p.style.setProperty('--pd-delay', `${delay}s`);
        p.style.left = `${leftPos}%`;
        p.style.fontSize = `${0.8 + Math.random() * 1.4}rem`;
        canvas.appendChild(p);
    }


    /* ─────────────────────────────────────────────
       2. STICKY NAVBAR — Scrolled State + Active Link
       ───────────────────────────────────────────── */
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sections = document.querySelectorAll('section[id]');

    const updateNavbar = () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section highlighting
        let currentSection = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 120;
            if (window.scrollY >= top) {
                currentSection = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === currentSection) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();


    /* ─────────────────────────────────────────────
       3. SMOOTH ANCHOR SCROLL (offset for fixed header)
       ───────────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });

            // Close hamburger menu if open
            navLinksEl.classList.remove('open');
            hamburger.classList.remove('active');
        });
    });


    /* ─────────────────────────────────────────────
       4. HAMBURGER MENU (Mobile)
       ───────────────────────────────────────────── */
    const hamburger = document.getElementById('hamburger');
    const navLinksEl = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        navLinksEl.classList.toggle('open');
        hamburger.classList.toggle('active');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            navLinksEl.classList.remove('open');
            hamburger.classList.remove('active');
        }
    });


    /* ─────────────────────────────────────────────
       5. SCROLL REVEAL — IntersectionObserver
       ───────────────────────────────────────────── */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger children that have reveal class
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -60px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


    /* ─────────────────────────────────────────────
       6. ANIMATED COUNTERS
       ───────────────────────────────────────────── */
    const animateCount = (el, target, duration = 1800, suffix = '') => {
        let start = 0;
        const step = target / (duration / 16);
        const isDecimal = String(target).includes('.');

        const update = () => {
            start += step;
            if (start < target) {
                el.textContent = isDecimal ? Math.min(start, target).toFixed(1) + suffix : Math.floor(start) + suffix;
                requestAnimationFrame(update);
            } else {
                el.textContent = isDecimal ? target.toFixed(1) + suffix : target + suffix;
            }
        };
        requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const rawCount = parseFloat(el.dataset.count);
                animateCount(el, rawCount);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));


    /* ─────────────────────────────────────────────
       7. ANIMATED RATING BARS
       ───────────────────────────────────────────── */
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.rbar-fill, .factor-bar').forEach(bar => {
                    bar.classList.add('animated');
                });
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const ratingOverview = document.querySelector('.rating-overview');
    if (ratingOverview) barObserver.observe(ratingOverview);


    /* ─────────────────────────────────────────────
       8. PRODUCT CARD FILTER
       ───────────────────────────────────────────── */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card[data-category]');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            productCards.forEach(card => {
                const cat = card.dataset.category;
                if (filter === 'all' || cat === filter) {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 350);
                }
            });
        });
    });


    /* ─────────────────────────────────────────────
       9. BACK TO TOP BUTTON
       ───────────────────────────────────────────── */
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    /* ─────────────────────────────────────────────
       10. HERO IMAGE PARALLAX (subtle)
       ───────────────────────────────────────────── */
    const heroImg = document.querySelector('.hero-main-img');
    if (heroImg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroImg.style.transform = `scale(1.04) translateY(${scrolled * 0.06}px)`;
            }
        }, { passive: true });
    }


    /* ─────────────────────────────────────────────
       11. EASTER EGG — Leaf Rain on Logo Click
       ───────────────────────────────────────────── */
    const logoEl = document.querySelector('.logo');
    logoEl.addEventListener('click', () => {
        const emojisRain = ['🍃', '🌿', '🥚', '🌱', '🐣', '♻️'];
        for (let i = 0; i < 20; i++) {
            const raindrop = document.createElement('div');
            raindrop.textContent = emojisRain[Math.floor(Math.random() * emojisRain.length)];
            raindrop.style.cssText = `
                position: fixed;
                top: -30px;
                left: ${10 + Math.random() * 80}%;
                font-size: ${1 + Math.random()}rem;
                z-index: 9999;
                pointer-events: none;
                animation: rainFall ${0.8 + Math.random() * 1.5}s ease-in ${Math.random() * 0.5}s forwards;
            `;
            document.body.appendChild(raindrop);
            setTimeout(() => raindrop.remove(), 2500);
        }
    });

    // Add rain fall keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainFall {
            0%   { transform: translateY(0px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(130vh) rotate(720deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);


    /* ─────────────────────────────────────────────
       12. PRODUCT CARD MAGNETIC HOVER EFFECT
       ───────────────────────────────────────────── */
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const tiltX = (y / rect.height) * 4;
            const tiltY = -(x / rect.width) * 4;
            card.style.transform = `translateY(-10px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s ease, box-shadow 0.4s ease';
            setTimeout(() => {
                card.style.transition = '';
            }, 500);
        });
    });


    /* ─────────────────────────────────────────────
       13. SECTION BACKGROUND COLOR TRANSITION ON SCROLL
       ───────────────────────────────────────────── */
    const bgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.body.style.transition = 'background 0.8s ease';
            }
        });
    }, { threshold: 0.4 });

    document.querySelectorAll('section[id]').forEach(sec => bgObserver.observe(sec));


    /* ─────────────────────────────────────────────
       14. CONSOLE SIGNATURE (Surprise!)
       ───────────────────────────────────────────── */
    console.log('%c🌿 Vpack Pulp Products', 'color: #4A7055; font-size: 24px; font-weight: bold; font-family: serif;');
    console.log('%cSustainable packaging for a greener tomorrow.', 'color: #C9963A; font-size: 14px;');
    console.log('%c📍 Koothappar, Tamil Nadu | ♻️ Zero Plastic', 'color: #7A6352; font-size: 12px;');

});
