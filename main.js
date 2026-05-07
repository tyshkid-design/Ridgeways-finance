/* =============================================
   RIDGEWAYS FINANCE — main.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. MOBILE NAV TOGGLE ── */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('mainNav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      nav.classList.toggle('mobile-open');
    });

    // Close nav when a link is clicked
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        nav.classList.remove('mobile-open');
      });
    });
  }


  /* ── 2. ACTIVE NAV LINK ON SCROLL ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  function setActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink);


  /* ── 3. SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ── 4. SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children if multiple in viewport at once
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ── 5. SAVINGS ITEMS TOGGLE ── */
  const savingsItems = document.querySelectorAll('.savings-item');
  const savingsHighlightTitle = document.getElementById('savingsHighlightTitle');
  const savingsHighlightDesc = document.getElementById('savingsHighlightDesc');

  const savingsData = {
    current: {
      title: 'Current Account',
      desc: 'Ideal for business transactions and personal use. Enjoy no withdrawal limits, free cheque clearing, and produce/salary processing.',
      rate: null,
      link: 'membership.html',
      btnLabel: 'Open a Current Account',
      details: [
        { label: 'Withdrawal Limits', value: 'None' },
        { label: 'Minimum Balance', value: 'KSh 1,000' },
        { label: 'Cheque Clearing', value: 'Free' },
        { label: 'Internet Banking', value: 'Included' },
      ]
    },
    savings: {
      title: 'Savings Account',
      desc: 'Everyday savings with competitive interest. Perfect for building an emergency fund or saving towards a specific goal.',
      rate: '5%',
      link: 'savings.html#savings',
      btnLabel: 'Open a Savings Account',
      details: [
        { label: 'Interest Rate', value: 'Up to 5% P.A.' },
        { label: 'Minimum Deposit', value: 'KSh 500' },
        { label: 'Withdrawals', value: 'Unlimited' },
        { label: 'Mobile Banking', value: 'Included' },
      ]
    },
    fixed: {
      title: 'Fixed Deposit Account',
      desc: 'Earn an attractive interest on your savings. Choose your preferred investment period and watch your money grow.',
      rate: '8.5%',
      link: 'savings.html#fixed',
      btnLabel: 'Open a Fixed Deposit',
      details: [
        { label: 'Minimum Period', value: '3 Months' },
        { label: 'Maximum Period', value: '12 Months' },
        { label: 'Minimum Deposit', value: 'KSh 10,000' },
        { label: 'Interest Payment', value: 'On Maturity' },
      ]
    },
    akiba: {
      title: 'Akiba Savings Account',
      desc: 'Goal-based savings account. Save for holidays, school fees, weddings, or long-term projects and earn competitive interest.',
      rate: '7%',
      link: 'savings.html#akiba',
      btnLabel: 'Open an Akiba Account',
      details: [
        { label: 'Interest Rate', value: 'Up to 7% P.A.' },
        { label: 'Minimum Monthly', value: 'KSh 1,000' },
        { label: 'Lock-in Period', value: 'Flexible' },
        { label: 'Premature Withdrawal', value: 'Allowed (penalty)' },
      ]
    },
    corporate: {
      title: 'Corporate Account',
      desc: 'Designed for welfare groups, companies, schools, hospitals and churches. Enjoy bulk transaction facilities and dedicated support.',
      rate: null,
      link: 'savings.html#corporate',
      btnLabel: 'Enquire About Corporate Account',
      details: [
        { label: 'Account Type', value: 'Institutional' },
        { label: 'Multi-Signatory', value: 'Supported' },
        { label: 'Bulk Payments', value: 'Available' },
        { label: 'Dedicated Manager', value: 'Assigned' },
      ]
    }
  };

  savingsItems.forEach(item => {
    item.addEventListener('click', () => {
      savingsItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const key = item.dataset.savings;
      const data = savingsData[key];
      if (!data) return;

      updateSavingsHighlight(data);
    });
  });

  function updateSavingsHighlight(data) {
    const box = document.getElementById('savingsHighlight');
    if (!box) return;

    const rateBlock = data.rate
      ? `<div class="interest-rate">
           <div class="rate-num">${data.rate}</div>
           <div class="rate-label">Interest Per Annum</div>
         </div>`
      : '';

    const tableRows = data.details.map(d =>
      `<li><span>${d.label}</span><strong>${d.value}</strong></li>`
    ).join('');

    box.innerHTML = `
      <h3>${data.title}</h3>
      <p>${data.desc}</p>
      ${rateBlock}
      <ul class="savings-table">${tableRows}</ul>
      <a href="${data.link}" class="btn-green">${data.btnLabel} →</a>
    `;

    // Animate the box
    box.style.opacity = '0';
    box.style.transform = 'translateY(10px)';
    requestAnimationFrame(() => {
      box.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      box.style.opacity = '1';
      box.style.transform = 'translateY(0)';
    });
  }


  /* ── 6. ANIMATED COUNTER (hero stats) ── */
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const isDecimal = el.dataset.count.includes('.');
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = eased * target;

      el.textContent = prefix + (isDecimal ? value.toFixed(1) : Math.floor(value)) + suffix;

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }


  /* ── 7. STICKY HEADER SHADOW ── */
  const header = document.querySelector('header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 4px 30px rgba(26,92,56,0.15)';
    } else {
      header.style.boxShadow = '0 2px 20px rgba(26,92,56,0.09)';
    }
  });


  /* ── 8. BACK TO TOP ── */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ── 9. LOAN CARD RIPPLE EFFECT ── */
  document.querySelectorAll('.loan-card').forEach(card => {
    card.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = card.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
        background: rgba(26, 92, 56, 0.08);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.5s ease-out;
        pointer-events: none;
      `;
      card.style.position = 'relative';
      card.style.overflow = 'hidden';
      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  // Inject ripple keyframe dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to { transform: scale(2.5); opacity: 0; }
    }
  `;
  document.head.appendChild(style);


  /* ── 10. USSD STEP HIGHLIGHT ON HOVER ── */
  const ussdSteps = document.querySelectorAll('.ussd-step');
  ussdSteps.forEach((step, i) => {
    step.style.transitionDelay = `${i * 0.05}s`;
    step.addEventListener('mouseenter', () => {
      step.style.background = 'rgba(201,162,39,0.12)';
      step.style.borderLeft = '3px solid #c9a227';
      step.style.paddingLeft = '11px';
    });
    step.addEventListener('mouseleave', () => {
      step.style.background = 'rgba(255,255,255,0.05)';
      step.style.borderLeft = 'none';
      step.style.paddingLeft = '14px';
    });
  });


  /* ── 11. PRODUCT CARD TILT EFFECT ── */
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const rotateX = ((y - midY) / midY) * -4;
      const rotateY = ((x - midX) / midX) * 4;
      card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease, box-shadow 0.3s';
    });
  });


  /* ── 12. NEWS CARD READ MORE LINK ── */
  document.querySelectorAll('.news-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      // Placeholder: open article or expand
      const title = card.querySelector('h3')?.textContent;
      if (title) console.log('Opening article:', title);
    });
  });

});
