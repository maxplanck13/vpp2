/* ═══════════════════════════════════════════════════════════════
   VPACK PULP PRODUCTS — Full Interactive Engine
   Feature list:
   01. Splash Screen with progress bar
   02. Custom cursor (dot + ring)
   03. Leaf cursor trail
   04. Scroll progress bar
   05. Sticky navbar + active section highlight
   06. Typewriter hero headline
   07. Smooth anchor scroll
   08. Hamburger menu (mobile)
   09. Scroll reveal with stagger
   10. Animated counters
   11. Rating bar fill animation
   12. Product card filter with animation
   13. Confetti burst on order button click
   14. Ripple click effect on all buttons
   15. Magnetic buttons (desktop)
   16. Hero image parallax on scroll
   17. Toast notification surprise pop-ups
   18. Logo easter egg — leaf rain
   19. Gradient orb parallax
   20. Back-to-top button
═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────── */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const rand = (min, max) => Math.random() * (max - min) + min;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/* Inject global keyframes once */
const injectKeyframes = (name, css) => {
    if (!document.getElementById('kf-' + name)) {
        const s = document.createElement('style');
        s.id   = 'kf-' + name;
        s.textContent = css;
        document.head.appendChild(s);
    }
};

injectKeyframes('rainFall', `
    @keyframes rainFall {
        0%   { opacity:1; transform:translate(-50%,-50%) scale(1) rotate(0deg); }
        100% { opacity:0; transform:translate(-50%,-50%) translateY(130vh) scale(0.5) rotate(720deg); }
    }
`);

/* ─────────────────────────────────────────────────
   01. SPLASH SCREEN
   Hides after 2 seconds (or when page fully loaded)
───────────────────────────────────────────────── */
const splash = qs('#splash');

const hideSplash = () => {
    splash.classList.add('hidden');
    // After transition ends, remove from layout
    splash.addEventListener('transitionend', () => {
        splash.remove();
    }, { once: true });
};

// Hide at 2.2s regardless -- feels snappy
const splashTimer = setTimeout(hideSplash, 2200);

window.addEventListener('load', () => {
    clearTimeout(splashTimer);
    setTimeout(hideSplash, 1800);
});

/* ─────────────────────────────────────────────────
   02. CUSTOM CURSOR (desktop only)
───────────────────────────────────────────────── */
const cursorDot  = qs('#cursorDot');
const cursorRing = qs('#cursorRing');

let mouseX = 0, mouseY = 0;
let ringX   = 0, ringY  = 0;

if (cursorDot && window.innerWidth > 900) {
    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top  = mouseY + 'px';
    });

    // Ring lags behind dot for elastic feel
    const animateRing = () => {
        ringX += (mouseX - ringX) * 0.14;
        ringY += (mouseY - ringY) * 0.14;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top  = ringY + 'px';
        requestAnimationFrame(animateRing);
    };
    animateRing();

    // Hover state on interactive elements
    const hoverEls = 'a, button, .product-card, .green-card, .review-card, .filter-btn, .back-to-top';
    document.addEventListener('mouseover', e => {
        if (e.target.closest(hoverEls)) {
            document.body.classList.add('cursor-hover');
        }
    });
    document.addEventListener('mouseout', e => {
        if (e.target.closest(hoverEls)) {
            document.body.classList.remove('cursor-hover');
        }
    });

    // Click feedback
    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
}

/* ─────────────────────────────────────────────────
   03. LEAF CURSOR TRAIL
   Emits a tiny emoji leaf on mouse move (throttled)
───────────────────────────────────────────────── */
const trailContainer = qs('#leafTrail');
const trailEmojis    = ['🍃','🌿','🍂','🌱','🍀'];
let   lastTrailTime  = 0;
const TRAIL_THROTTLE = 60; // ms between leaves

if (trailContainer && window.innerWidth > 900) {
    document.addEventListener('mousemove', e => {
        const now = Date.now();
        if (now - lastTrailTime < TRAIL_THROTTLE) return;
        lastTrailTime = now;

        const leaf = document.createElement('span');
        leaf.className   = 'trail-leaf';
        leaf.textContent = trailEmojis[Math.floor(Math.random() * trailEmojis.length)];
        leaf.style.left  = e.clientX + 'px';
        leaf.style.top   = e.clientY + 'px';
        leaf.style.fontSize = rand(0.7, 1.3) + 'rem';
        leaf.style.animationDuration = rand(0.5, 0.9) + 's';

        trailContainer.appendChild(leaf);
        setTimeout(() => leaf.remove(), 900);
    });
}

/* ─────────────────────────────────────────────────
   04. SCROLL PROGRESS BAR
───────────────────────────────────────────────── */
const progressBar = qs('#scrollProgress');

const updateProgress = () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
};

window.addEventListener('scroll', updateProgress, { passive: true });

/* ─────────────────────────────────────────────────
   05. STICKY NAVBAR + ACTIVE SECTION HIGHLIGHT
───────────────────────────────────────────────── */
const navbar    = qs('#navbar');
const navLinks  = qsa('.nav-link[data-section]');
const sections  = qsa('section[id]');

const updateNavbar = () => {
    // Scrolled class
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // Active section
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 130) {
            current = sec.id;
        }
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === current);
    });

    updateProgress();
};

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

/* ─────────────────────────────────────────────────
   06. TYPEWRITER HERO HEADLINE
───────────────────────────────────────────────── */
const typewriterEl = qs('#typewriterEl');
const phrases = [
    'loves the Earth',
    'protects every egg',
    'chooses zero plastic',
    'thinks green first',
    'supports Indian farms',
];
let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;
let twTimer   = null;

const typeWrite = () => {
    const phrase = phrases[phraseIdx];

    if (!deleting) {
        typewriterEl.textContent = phrase.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === phrase.length) {
            // Pause at end, then start deleting
            deleting = true;
            twTimer  = setTimeout(typeWrite, 1800);
            return;
        }
        twTimer = setTimeout(typeWrite, 70);
    } else {
        typewriterEl.textContent = phrase.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
            deleting  = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            twTimer   = setTimeout(typeWrite, 380);
            return;
        }
        twTimer = setTimeout(typeWrite, 38);
    }
};

// Start after splash
setTimeout(typeWrite, 2400);

/* ─────────────────────────────────────────────────
   07. SMOOTH ANCHOR SCROLL (offset for fixed header)
───────────────────────────────────────────────── */
qsa('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = qs(href);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - 85;
        window.scrollTo({ top, behavior: 'smooth' });
        // Close mobile menu if open
        qs('#navLinks').classList.remove('open');
        qs('#hamburger').classList.remove('active');
    });
});

/* ─────────────────────────────────────────────────
   08. HAMBURGER MENU (mobile)
───────────────────────────────────────────────── */
const hamburger = qs('#hamburger');
const navLinksEl = qs('#navLinks');

hamburger.addEventListener('click', () => {
    navLinksEl.classList.toggle('open');
    hamburger.classList.toggle('active');
});

document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
        navLinksEl.classList.remove('open');
        hamburger.classList.remove('active');
    }
});

/* ─────────────────────────────────────────────────
   09. SCROLL REVEAL (with stagger support)
───────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.08, rootMargin: '0px 0px -55px 0px' });

qsa('.reveal').forEach(el => revealObserver.observe(el));

/* ─────────────────────────────────────────────────
   10. ANIMATED COUNTERS (easeOutExpo)
───────────────────────────────────────────────── */
const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

const animateCounter = (el, target, duration = 2000) => {
    const start    = performance.now();
    const isFloat  = el.hasAttribute('data-decimal');

    const tick = now => {
        const elapsed = now - start;
        const progress = clamp(elapsed / duration, 0, 1);
        const eased    = easeOutExpo(progress);
        const value    = isFloat
            ? (target * eased).toFixed(1)
            : Math.round(target * eased);
        el.textContent = value;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = isFloat ? target.toFixed(1) : target;
    };
    requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el  = entry.target;
        const val = parseFloat(el.dataset.count);
        animateCounter(el, val);
        counterObserver.unobserve(el);
    });
}, { threshold: 0.6 });

qsa('[data-count]').forEach(el => counterObserver.observe(el));

/* ─────────────────────────────────────────────────
   11. RATING BAR FILL ANIMATION
───────────────────────────────────────────────── */
const ratingSection = qs('.rating-overview');
if (ratingSection) {
    const barObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            qsa('.rbar-fill, .factor-bar', entry.target).forEach(bar => {
                bar.classList.add('animated');
            });
            barObserver.unobserve(entry.target);
        });
    }, { threshold: 0.3 });
    barObserver.observe(ratingSection);
}

/* ─────────────────────────────────────────────────
   12. PRODUCT CARD FILTER
───────────────────────────────────────────────── */
const filterBtns  = qsa('.filter-btn');
const productCards = qsa('.product-card[data-category]');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        productCards.forEach((card, i) => {
            const match = filter === 'all' || card.dataset.category === filter;
            if (match) {
                card.style.display = 'flex';
                // Stagger the appear animation
                setTimeout(() => {
                    card.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)';
                    card.style.opacity    = '1';
                    card.style.transform  = 'translateY(0) scale(1)';
                }, i * 60);
            } else {
                card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
                card.style.opacity    = '0';
                card.style.transform  = 'scale(0.9)';
                setTimeout(() => { card.style.display = 'none'; }, 280);
            }
        });
    });
});

/* ─────────────────────────────────────────────────
   13. CONFETTI BURST on order button click
───────────────────────────────────────────────── */
const CONFETTI_COLORS = [
    '#3D6B47','#C0442A','#C49020','#F5EFE3',
    '#5F8F6C','#DC5A3D','#E0AE38','#2E4D36',
];

const spawnConfetti = (originX, originY, count = 38) => {
    for (let i = 0; i < count; i++) {
        const el   = document.createElement('div');
        el.className = 'confetti-piece';

        const angle  = rand(0, Math.PI * 2);
        const speed  = rand(110, 320);
        const cfX    = Math.cos(angle) * speed;
        const cfY    = Math.sin(angle) * speed - rand(100,200); // upward bias
        const dur    = rand(0.9, 1.7).toFixed(2);
        const delay  = rand(0, 0.12).toFixed(2);
        const rot    = rand(-720, 720).toFixed(0);
        const size   = rand(7, 13).toFixed(0);
        const color  = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        const shape  = Math.random() > 0.5 ? '50%' : '2px';

        el.style.cssText = `
            left: ${originX}px;
            top:  ${originY}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: ${shape};
            --cf-x: ${cfX}px;
            --cf-y: ${cfY}px;
            --cf-r: ${rot}deg;
            --cf-dur: ${dur}s;
            --cf-delay: ${delay}s;
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), (parseFloat(dur) + parseFloat(delay) + 0.2) * 1000);
    }
};

qsa('.confetti-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        const rect = btn.getBoundingClientRect();
        spawnConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
        showToast(
            '🎉',
            'Order request sent! S. Subramanian will reach you soon.',
            3500
        );
    });
});

/* ─────────────────────────────────────────────────
   14. RIPPLE CLICK EFFECT on buttons
───────────────────────────────────────────────── */
qsa('.ripple-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect   = this.getBoundingClientRect();
        const x      = e.clientX - rect.left;
        const y      = e.clientY - rect.top;
        const circle = document.createElement('span');
        const size   = Math.max(rect.width, rect.height) * 2.2;

        circle.className = 'ripple-circle';
        circle.style.cssText = `
            width:  ${size}px;
            height: ${size}px;
            left:   ${x - size / 2}px;
            top:    ${y - size / 2}px;
        `;
        this.appendChild(circle);
        setTimeout(() => circle.remove(), 650);
    });
});

/* ─────────────────────────────────────────────────
   15. MAGNETIC BUTTONS (desktop only)
   Buttons attract cursor within a radius
───────────────────────────────────────────────── */
if (window.innerWidth > 900) {
    const MAGNET_RADIUS   = 70;
    const MAGNET_STRENGTH = 0.38;

    qsa('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect   = btn.getBoundingClientRect();
            const cx     = rect.left + rect.width  / 2;
            const cy     = rect.top  + rect.height / 2;
            const dx     = e.clientX - cx;
            const dy     = e.clientY - cy;
            const dist   = Math.sqrt(dx * dx + dy * dy);

            if (dist < MAGNET_RADIUS) {
                const pull = (1 - dist / MAGNET_RADIUS);
                btn.style.transform = `translate(${dx * pull * MAGNET_STRENGTH}px, ${dy * pull * MAGNET_STRENGTH}px)`;
            }
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
            btn.style.transform  = 'translate(0,0)';
            setTimeout(() => { btn.style.transition = ''; }, 500);
        });
    });
}

/* ─────────────────────────────────────────────────
   16. HERO IMAGE PARALLAX on scroll
───────────────────────────────────────────────── */
const heroImg = qs('#heroImg');
const orb1    = qs('.orb1');
const orb2    = qs('.orb2');
const orb3    = qs('.orb3');

const heroParallax = () => {
    const scrolled = window.scrollY;
    const wh       = window.innerHeight;
    if (scrolled > wh) return;

    const pct = scrolled / wh; // 0–1

    if (heroImg) {
        heroImg.style.transform = `scale(1.04) translateY(${scrolled * 0.08}px)`;
    }
    // Orbs drift opposite directions
    if (orb1) orb1.style.transform = `translate(${pct * -30}px, ${pct * 40}px) scale(${1 + pct * 0.3})`;
    if (orb2) orb2.style.transform = `translate(${pct *  20}px, ${pct * -30}px)`;
    if (orb3) orb3.style.transform = `translate(${pct * -15}px, ${pct * 20}px)`;
};

window.addEventListener('scroll', heroParallax, { passive: true });

/* --- Section-level parallax on bg shapes (subtle) --- */
const bgShape = qs('.products-bg-shape');
if (bgShape) {
    const shapePara = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        const handleScroll = () => {
            const rect  = bgShape.parentNode.getBoundingClientRect();
            const shift = rect.top * -0.12;
            bgShape.style.transform = `translate(${shift}px, ${shift * 0.5}px)`;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    });
    shapePara.observe(bgShape);
}

/* ─────────────────────────────────────────────────
   17. TOAST NOTIFICATION SYSTEM
───────────────────────────────────────────────── */
const toastEl  = qs('#toast');
const toastMsg = qs('#toastMsg');
const toastEmoji = qs('#toastEmoji');
let toastTimeout = null;

const showToast = (emoji, message, duration = 3000) => {
    clearTimeout(toastTimeout);
    toastEmoji.textContent = emoji;
    toastMsg.textContent   = message;
    toastEl.classList.add('show');
    toastTimeout = setTimeout(() => toastEl.classList.remove('show'), duration);
};

/* Welcome toast after splash hides */
setTimeout(() => {
    showToast('🌿', 'Welcome! Scroll to explore our eco-products.', 4000);
}, 2700);

/* Surprise toasts on section entry */
const sectionToasts = {
    'products':       { emoji:'🛒', msg:'Tap any card to order instantly via WhatsApp!', shown: false },
    'sustainability': { emoji:'♻️', msg:'Every tray you buy plants hope for the planet.', shown: false },
    'about':          { emoji:'🏡', msg:'Family-run from Koothappar, Tamil Nadu 🇮🇳', shown: false },
    'reviews':        { emoji:'⭐', msg:'4.3 stars from verified buyers — quality you can trust!', shown: false },
};

const toastSectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id   = entry.target.id;
        const info = sectionToasts[id];
        if (info && !info.shown) {
            info.shown = true;
            showToast(info.emoji, info.msg, 3500);
        }
    });
}, { threshold: 0.45 });

Object.keys(sectionToasts).forEach(id => {
    const sec = qs(`#${id}`);
    if (sec) toastSectionObserver.observe(sec);
});

/* ─────────────────────────────────────────────────
   18. LOGO EASTER EGG — leaf + egg rain on click
───────────────────────────────────────────────── */
const logoEl = qs('#logoLink');
let  easterClickCount = 0;

logoEl.addEventListener('click', e => {
    easterClickCount++;
    const rainEmojis = ['🍃','🌿','🥚','🌱','🐣','♻️','🍂','🏡','🌾'];

    for (let i = 0; i < 22; i++) {
        const drop = document.createElement('div');
        drop.textContent = rainEmojis[Math.floor(Math.random() * rainEmojis.length)];
        drop.style.cssText = `
            position:fixed;
            top:-40px;
            left:${8 + Math.random()*84}%;
            font-size:${0.9 + Math.random() * 1.4}rem;
            z-index:99998;
            pointer-events:none;
            user-select:none;
            animation:rainFall ${0.7 + Math.random()*1.5}s ease-in ${Math.random()*0.6}s forwards;
        `;
        document.body.appendChild(drop);
        setTimeout(() => drop.remove(), 2600);
    }

    // Special surprise on 3rd+ click
    if (easterClickCount === 3) {
        showToast('🐣', 'Wow, you really love eggs! Call us for a bulk deal 😄', 4500);
    } else if (easterClickCount === 1) {
        showToast('🌿', 'You found the easter egg! Click again for more fun 😊', 4000);
    }
});

/* ─────────────────────────────────────────────────
   19. PRODUCT CARD — 3D TILT on mouse move
───────────────────────────────────────────────── */
if (window.innerWidth > 900) {
    qsa('.product-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect  = card.getBoundingClientRect();
            const cx    = rect.left + rect.width  / 2;
            const cy    = rect.top  + rect.height / 2;
            const dx    = (e.clientX - cx) / (rect.width  / 2); // -1 to 1
            const dy    = (e.clientY - cy) / (rect.height / 2); // -1 to 1
            const tiltX = dy * -5;  // degrees
            const tiltY = dx *  5;

            card.style.transition = 'transform 0.1s ease';
            card.style.transform  = `translateY(-12px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.55s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease';
            card.style.transform  = 'translateY(0) rotateX(0) rotateY(0)';
        });
    });
}

/* ─────────────────────────────────────────────────
   20. BACK TO TOP BUTTON
───────────────────────────────────────────────── */
const backToTop = qs('#backToTop');

window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─────────────────────────────────────────────────
   BONUS A. Floating particles (background ambience)
───────────────────────────────────────────────── */
const particleCanvas = qs('#particles-canvas');
const particleEmojis = ['🍃','🌿','🍂','🌱','🌾','🍀'];

for (let i = 0; i < 16; i++) {
    const p   = document.createElement('div');
    p.className = 'particle';
    p.textContent = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];
    const dur   = (10 + Math.random() * 14).toFixed(1);
    const delay = (Math.random() * 16).toFixed(1);
    p.style.setProperty('--dur',      `${dur}s`);
    p.style.setProperty('--pd-delay', `${delay}s`);
    p.style.left     = `${Math.random() * 100}%`;
    p.style.fontSize = `${0.7 + Math.random() * 1.3}rem`;
    particleCanvas.appendChild(p);
}

/* ─────────────────────────────────────────────────
   BONUS B. Green card icon hover spin
───────────────────────────────────────────────── */
qsa('.green-card').forEach(card => {
    const icon = card.querySelector('.green-icon');
    if (!icon) return;
    card.addEventListener('mouseenter', () => {
        icon.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
        icon.style.transform  = 'scale(1.35) rotate(15deg)';
    });
    card.addEventListener('mouseleave', () => {
        icon.style.transform  = 'scale(1) rotate(0deg)';
    });
});

/* ─────────────────────────────────────────────────
   BONUS C. Hero explore button → confetti when clicked
───────────────────────────────────────────────── */
const heroExploreBtn = qs('#heroExploreBtn');
if (heroExploreBtn) {
    heroExploreBtn.addEventListener('click', e => {
        const rect = heroExploreBtn.getBoundingClientRect();
        spawnConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
    });
}

/* ─────────────────────────────────────────────────
   BONUS D. Review cards — subtle hover quote bounce
───────────────────────────────────────────────── */
qsa('.review-card').forEach(card => {
    const txt = card.querySelector('.review-text');
    if (!txt) return;
    card.addEventListener('mouseenter', () => {
        txt.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
        txt.style.transform  = 'scale(1.02)';
    });
    card.addEventListener('mouseleave', () => {
        txt.style.transform  = 'scale(1)';
    });
});

/* ─────────────────────────────────────────────────
   BONUS E. Footer brand name animated gradient text
───────────────────────────────────────────────── */
const footerLogo = qs('.footer-logo');
if (footerLogo) {
    footerLogo.style.cssText += `
        background: linear-gradient(90deg, #F5EFE3, #C49020, #3D6B47, #C0442A, #F5EFE3);
        background-size: 300% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: gradientShift 5s linear infinite;
    `;
    injectKeyframes('gradientShift', `
        @keyframes gradientShift {
            0%   { background-position: 0% center; }
            100% { background-position: 300% center; }
        }
    `);
}

/* ─────────────────────────────────────────────────
   BONUS F. Ticker strip pause on hover
───────────────────────────────────────────────── */
qsa('.ticker-strip').forEach(strip => {
    const track = strip.querySelector('.ticker-track, .ticker-track-reverse');
    if (!track) return;
    strip.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
    strip.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });
});

/* ─────────────────────────────────────────────────
   BONUS G. Section entrance — flash the section eyebrow
───────────────────────────────────────────────── */
const eyebrowObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const eyebrow = entry.target.querySelector('.section-eyebrow');
        if (eyebrow) {
            eyebrow.style.animation = 'none';
            eyebrow.style.transition = 'none';
            setTimeout(() => {
                eyebrow.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease';
                eyebrow.style.transform  = 'scale(1.15)';
                setTimeout(() => { eyebrow.style.transform = 'scale(1)'; }, 300);
            }, 200);
        }
        eyebrowObserver.unobserve(entry.target);
    });
}, { threshold: 0.5 });

qsa('.section-header').forEach(h => eyebrowObserver.observe(h));

/* ─────────────────────────────────────────────────
   CONSOLE SIGNATURE (surprise for devs!)
───────────────────────────────────────────────── */
console.log('%c🌿 VPACK PULP PRODUCTS', 'font-size:28px;font-weight:bold;color:#3D6B47;font-family:serif;');
console.log('%cSustainable · Biodegradable · Handcrafted in Tamil Nadu 🇮🇳', 'font-size:13px;color:#C49020;');
console.log('%c📍 Koothappar — 620014 | ☎ +91 94433 02468', 'font-size:11px;color:#6E5340;');
console.log('%c♻️ Zero plastic. 100%% recycled pulp. Every single tray.', 'font-size:11px;color:#C0442A;');
