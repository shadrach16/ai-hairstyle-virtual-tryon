/* ============================================
   HAIR STUDIO LANDING PAGE — JAVASCRIPT
   Handles: scroll reveal, navbar, mobile menu, 
   analytics event tracking
   ============================================ */

(function () {
  'use strict';

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger animations
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, index * 100);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // --- Navbar Scroll Effect ---
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // --- Mobile Menu Toggle ---
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.setAttribute(
        'aria-expanded',
        navLinks.classList.contains('active').toString()
      );
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // --- Download Click Tracking ---
  const downloadButtons = document.querySelectorAll(
    '#hero-download-btn, #cta-download-btn, #nav-download-btn'
  );

  downloadButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // GA4 event
      if (typeof gtag === 'function') {
        gtag('event', 'download_click', {
          event_category: 'engagement',
          event_label: btn.id,
          value: 1,
        });
      }

      // Log to console for debugging
      console.log('[Analytics] Download click:', btn.id);
    });
  });

  // --- Smooth Scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  // --- Page Visit Tracking ---
  function trackVisit() {
    if (typeof gtag === 'function') {
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
      });
    }

    // Simple visit counter via localStorage (client-side)
    const visits = parseInt(localStorage.getItem('hs_visits') || '0', 10) + 1;
    localStorage.setItem('hs_visits', visits.toString());
  }

  trackVisit();

  // --- Animate Stats on Scroll ---
  function animateCounter(el, target, suffix = '') {
    let current = 0;
    const increment = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current + suffix;
    }, 30);
  }

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stats are already displayed via HTML, no counter animation needed
            // for text-based stats like "100+", "4.5★", "Free"
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(statsSection);
  }

  // --- FAQ accessibility enhancement ---
  document.querySelectorAll('.faq-item').forEach((item) => {
    item.addEventListener('toggle', function () {
      // Close others (optional accordion behavior)
      if (this.open) {
        document.querySelectorAll('.faq-item').forEach((other) => {
          if (other !== this && other.open) {
            other.open = false;
          }
        });
      }
    });
  });

})();
