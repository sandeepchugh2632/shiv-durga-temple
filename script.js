/* ============================================================
   Shiv Durga Hindu Temple – Interactive Scripts
   ============================================================ */

'use strict';

// ── Navbar scroll effect ──────────────────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ── Mobile menu toggle ────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');

  // Animate hamburger to X
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  });
});

// ── Active nav link on scroll ─────────────────────────────────
const sections = document.querySelectorAll('section[id]');

function setActiveNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-links a[href="#${id}"]`);

    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.style.color = 'var(--gold)';
      } else {
        link.style.color = '';
      }
    }
  });
}

window.addEventListener('scroll', setActiveNav, { passive: true });

// ── Back to Top button ────────────────────────────────────────
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

// ── Scroll-triggered fade-in animations ──────────────────────
const fadeEls = document.querySelectorAll(
  '.service-card, .deity-card, .event-card, .gallery-item, ' +
  '.about-image-wrap, .about-content, .stat-item, ' +
  '.info-block, .contact-form-wrap, .mini-deity, .feature-item'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Stagger children within same parent
      const siblings = [...entry.target.parentElement.children];
      const index    = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

// ── Animated counter (Stats section) ─────────────────────────
const counters = document.querySelectorAll('.stat-number');
let counted    = false;

function animateCounters() {
  counters.forEach(counter => {
    const target   = parseInt(counter.getAttribute('data-target'), 10);
    const duration = 1800;
    const step     = Math.ceil(target / (duration / 16));
    let current    = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = current.toLocaleString();
    }, 16);
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !counted) {
    counted = true;
    animateCounters();
    statsObserver.disconnect();
  }
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) statsObserver.observe(statsSection);

// ── Ticker duplication for infinite loop ─────────────────────
const tickerContent = document.querySelector('.ticker-content');
if (tickerContent) {
  // Duplicate text for seamless loop
  tickerContent.innerHTML += tickerContent.innerHTML;
}

// ── Contact form ──────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn  = contactForm.querySelector('button[type="submit"]');
    const orig = btn.textContent;

    btn.textContent = '✓ Message Sent! We will contact you soon.';
    btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 4000);
  });
}

// ── Smooth scroll with offset for fixed navbar ────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const navHeight = navbar.offsetHeight;
    const top       = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Ticker pause on hover ─────────────────────────────────────
const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack && tickerContent) {
  tickerTrack.addEventListener('mouseenter', () => {
    tickerContent.style.animationPlayState = 'paused';
  });
  tickerTrack.addEventListener('mouseleave', () => {
    tickerContent.style.animationPlayState = 'running';
  });
}

// ── Hero Photo Slideshow ──────────────────────────────────────
(function () {
  const slideshow = document.getElementById('heroSlideshow');
  if (!slideshow) return;

  const slides     = slideshow.querySelectorAll('.hss-slide');
  const dots       = slideshow.querySelectorAll('.hss-dot');
  const prevBtn    = document.getElementById('hssPrev');
  const nextBtn    = document.getElementById('hssNext');
  const currentNum = document.getElementById('hssCurrentNum');
  const TOTAL      = slides.length;
  const INTERVAL   = 4200; // ms between auto-advance

  let current    = 0;
  let timer      = null;
  let isAnimating = false;

  // Touch/swipe state
  let touchStartX = 0;
  let touchEndX   = 0;

  function goTo(index) {
    if (isAnimating || index === current) return;
    isAnimating = true;

    slides[current].classList.remove('active');
    dots[current].classList.remove('active');

    current = (index + TOTAL) % TOTAL;

    slides[current].classList.add('active');
    dots[current].classList.add('active');
    if (currentNum) currentNum.textContent = current + 1;

    // Reset animation lock after transition
    setTimeout(() => { isAnimating = false; }, 800);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startTimer() {
    timer = setInterval(next, INTERVAL);
  }

  function resetTimer() {
    clearInterval(timer);
    startTimer();
  }

  // Button controls
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetTimer(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetTimer(); });

  // Dot controls
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      goTo(idx);
      resetTimer();
    });
  });

  // Pause on hover
  slideshow.addEventListener('mouseenter', () => clearInterval(timer));
  slideshow.addEventListener('mouseleave', () => { clearInterval(timer); startTimer(); });

  // Touch / swipe support
  slideshow.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slideshow.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next(); else prev();
      resetTimer();
    }
  }, { passive: true });

  // Keyboard left/right when slideshow is focused
  slideshow.setAttribute('tabindex', '0');
  slideshow.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { next(); resetTimer(); }
    if (e.key === 'ArrowLeft')  { prev(); resetTimer(); }
  });

  // Start the auto-play
  startTimer();
})();

// ── Hero Events Panel Slideshow ───────────────────────────────
(function () {
  const wrap = document.getElementById('hepSlidesWrap');
  if (!wrap) return;
  const dots = document.querySelectorAll('.hep-slider-dot');
  let current = 0;
  const total = dots.length;

  function goTo(idx) {
    current = (idx + total) % total;
    wrap.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Auto-rotate every 5s
  let timer = setInterval(() => goTo(current + 1), 5000);
  wrap.parentElement.addEventListener('mouseenter', () => clearInterval(timer));
  wrap.parentElement.addEventListener('mouseleave', () => {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  });
})();

// ── Subtle parallax on hero ───────────────────────────────────
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  }, { passive: true });
}
