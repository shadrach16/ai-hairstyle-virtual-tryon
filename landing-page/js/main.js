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

  // --- Scroll Depth Tracking (25%, 50%, 75%, 100%) ---
  // Tracks how far users scroll — key engagement signal for SEO
  const scrollDepthMarks = [25, 50, 75, 100];
  const scrollDepthFired = new Set();

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    scrollDepthMarks.forEach((mark) => {
      if (scrollPercent >= mark && !scrollDepthFired.has(mark)) {
        scrollDepthFired.add(mark);
        if (typeof gtag === 'function') {
          gtag('event', 'scroll_depth', {
            event_category: 'engagement',
            event_label: mark + '%',
            value: mark,
            non_interaction: true
          });
        }
      }
    });
  }, { passive: true });

  // --- Time on Page Tracking (15s, 30s, 60s, 120s milestones) ---
  // Users who stay longer = higher quality signal
  const timeMarks = [15, 30, 60, 120];
  const timeFired = new Set();
  const pageLoadTime = Date.now();

  const timeInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - pageLoadTime) / 1000);
    timeMarks.forEach((mark) => {
      if (elapsed >= mark && !timeFired.has(mark)) {
        timeFired.add(mark);
        if (typeof gtag === 'function') {
          gtag('event', 'time_on_page', {
            event_category: 'engagement',
            event_label: mark + 's',
            value: mark,
            non_interaction: true
          });
        }
      }
    });
    if (timeFired.size === timeMarks.length) clearInterval(timeInterval);
  }, 5000);

  // --- Exit Intent Detection (desktop only) ---
  // Fires when user moves mouse toward browser close/back
  let exitIntentFired = false;
  document.addEventListener('mouseout', (e) => {
    if (exitIntentFired) return;
    if (e.clientY <= 0 && e.relatedTarget === null) {
      exitIntentFired = true;
      if (typeof gtag === 'function') {
        gtag('event', 'exit_intent', {
          event_category: 'engagement',
          event_label: 'mouse_leave_top',
          value: Math.floor((Date.now() - pageLoadTime) / 1000)
        });
      }
    }
  });

  // --- Section Visibility Tracking ---
  // Tracks which sections users actually see (content engagement)
  const sections = document.querySelectorAll('section[id]');
  const sectionSeen = new Set();
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !sectionSeen.has(entry.target.id)) {
          sectionSeen.add(entry.target.id);
          if (typeof gtag === 'function') {
            gtag('event', 'section_view', {
              event_category: 'content',
              event_label: entry.target.id,
              non_interaction: true
            });
          }
        }
      });
    },
    { threshold: 0.3 }
  );
  sections.forEach((section) => sectionObserver.observe(section));

})();
