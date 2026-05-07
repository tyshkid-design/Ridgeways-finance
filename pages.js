/* =============================================
   RIDGEWAYS FINANCE — pages.js
   Shared JS for all inner pages
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. TABS ── */
  document.querySelectorAll('[id$="Tabs"] .tab-btn, .tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const tabGroup = this.closest('.tabs');
      if (!tabGroup) return;

      // Deactivate all buttons in this group
      tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const target = this.dataset.tab;

      // Find all tab panels in the parent section/container
      const container = tabGroup.closest('section, .container, .page-body, .page-body-gray') || document;
      const allPanels = container.querySelectorAll('.tab-panel');

      allPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === 'tab-' + target) panel.classList.add('active');
      });

      // Special case for news page — filter cards
      if (target !== 'all') {
        const allCards = document.querySelectorAll('.news-card[data-category], .product-card[data-category]');
        if (allCards.length) {
          const activePanel = document.getElementById('tab-' + target);
          if (activePanel && activePanel.children.length === 0) {
            // Clone matching cards into the panel
            const matching = document.querySelectorAll(`[data-category="${target}"]`);
            activePanel.innerHTML = '<div class="news-grid"></div>';
            const grid = activePanel.querySelector('.news-grid') || activePanel;
            matching.forEach(card => grid.appendChild(card.cloneNode(true)));
          }
        }
      }
    });
  });


  /* ── 2. ACCORDION ── */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function () {
      const item = this.closest('.accordion-item');
      const isOpen = item.classList.contains('open');

      // Close all in same accordion
      const accordion = item.closest('.accordion');
      if (accordion) {
        accordion.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      }

      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });


  /* ── 3. SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 70);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => obs.observe(el));
  }




  /* ── 5. BACK TO TOP ── */
  const btn = document.getElementById('backToTop');
  if (btn) {
    window.addEventListener('scroll', () => {
      btn.classList.toggle('show', window.scrollY > 400);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }


  /* ── 6. STICKY HEADER SHADOW ── */
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10
        ? '0 4px 30px rgba(26,92,56,0.15)'
        : '0 2px 20px rgba(26,92,56,0.09)';
    });
  }


  /* ── 7. SMOOTH SCROLL for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });

        // Update sidebar nav active state
        document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });


  /* ── 8. ANIMATED COUNTERS ── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObs.observe(el));
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const isFloat = el.dataset.count.includes('.');
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = eased * target;
      el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }


  /* ── 9. FORM VALIDATION HELPERS ── */
  document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(el => {
    el.addEventListener('input', function () {
      if (this.value.trim()) {
        this.classList.remove('error');
        this.classList.add('success');
      } else {
        this.classList.remove('success');
      }
    });
    el.addEventListener('blur', function () {
      if (!this.value.trim() && this.closest('.form-group')?.querySelector('.form-label span')) {
        this.classList.add('error');
      }
    });
  });


  /* ── 10. SIDEBAR ACTIVE LINK on scroll ── */
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');
  if (sidebarLinks.length) {
    window.addEventListener('scroll', () => {
      let current = '';
      document.querySelectorAll('section[id], div[id]').forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 150) current = sec.id;
      });
      sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) link.classList.add('active');
      });
    });
  }


  /* ── 11. CARD HOVER RIPPLE for loan/product cards ── */
  document.querySelectorAll('.loan-card, .product-card').forEach(card => {
    card.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = card.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute;width:${size}px;height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top - size/2}px;
        background:rgba(26,92,56,0.07);border-radius:50%;
        transform:scale(0);animation:ripple 0.5s ease-out;pointer-events:none;
      `;
      card.style.position = 'relative';
      card.style.overflow = 'hidden';
      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  // Inject ripple keyframe
  if (!document.getElementById('rippleStyle')) {
    const s = document.createElement('style');
    s.id = 'rippleStyle';
    s.textContent = '@keyframes ripple { to { transform:scale(2.5); opacity:0; } }';
    document.head.appendChild(s);
  }


  /* ── 12. RANGE INPUT live display ── */
  document.querySelectorAll('input[type="range"]').forEach(range => {
    range.addEventListener('input', function () {
      // Dispatch custom event for pages that listen
      this.dispatchEvent(new Event('change'));
    });
  });


  /* ── 13. ACTIVE NAV LINK based on current page ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });


  /* ── 14. NUMBER INPUT formatting ── */
  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('blur', function () {
      const val = parseFloat(this.value);
      if (!isNaN(val) && val < 0) this.value = 0;
    });
  });


  /* ── 15. AUTO-CLOSE ALERTS after 8 seconds ── */
  setTimeout(() => {
    document.querySelectorAll('.alert').forEach(alert => {
      if (alert.id && (alert.id.includes('Success') || alert.id.includes('Error'))) {
        // Don't auto-close these — they're user-triggered
        return;
      }
      alert.style.transition = 'opacity 0.5s';
      alert.style.opacity = '0';
      setTimeout(() => { if (alert.parentNode) alert.style.display = 'none'; }, 500);
    });
  }, 8000);

});
