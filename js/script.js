// ===================== N Automations — Site JS =====================

document.addEventListener('DOMContentLoaded', () => {

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Navbar scroll state
  const navbar = document.getElementById('navbar');
  const toTop = document.getElementById('toTop');
  const onScroll = () => {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 30);
    if (toTop) toTop.classList.toggle('show', y > 500);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop && toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // Scroll reveal animation
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // FAQ accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    const setHeight = () => { a.style.maxHeight = item.classList.contains('open') ? a.scrollHeight + 'px' : '0px'; };
    setHeight();
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = '0px';
      });
      if (!isOpen) {
        item.classList.add('open');
        setHeight();
      }
    });
  });
  window.addEventListener('resize', () => {
    faqItems.forEach(item => {
      if (item.classList.contains('open')) {
        const a = item.querySelector('.faq-a');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  // Contact form (placeholder submit handling)
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(form);
      const body = [
        'Name: ' + (f.get('fname') || ''),
        'Email: ' + (f.get('femail') || ''),
        'Company: ' + (f.get('fcompany') || ''),
        'Interested in: ' + (f.get('finterest') || ''),
        '',
        f.get('fmessage') || ''
      ].join('\n');
      window.location.href = 'mailto:info@nautomations.in?subject=' +
        encodeURIComponent('Automation enquiry — ' + (f.get('fname') || 'Website')) +
        '&body=' + encodeURIComponent(body);
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Opening your email app…';
      setTimeout(() => { btn.textContent = original; }, 3000);
    });
  }

  // Smooth anchor scroll offset for fixed navbar
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const offset = 84;
          const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

});


// ===== 3D tilt on cards =====
document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(el => {
      el.classList.add('tilt');
      el.addEventListener('mousemove', (ev) => {
        const r = el.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width - 0.5;
        const y = (ev.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(900px) rotateY(' + (x * 7).toFixed(2) + 'deg) rotateX(' + (-y * 7).toFixed(2) + 'deg) translateY(-3px)';
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  // ===== animated counters =====
  const counters = document.querySelectorAll('.hero-stats strong, .stat-item strong');
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        cio.unobserve(el);
        const text = el.textContent;
        const m = text.match(/^([0-9.,]+)(.*)$/);
        if (!m) return;
        const target = parseFloat(m[1].replace(/,/g, ''));
        const suffix = m[2];
        const dec = (m[1].split('.')[1] || '').length;
        const t0 = performance.now();
        const dur = 1200;
        const step = (t) => {
          const p = Math.min((t - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(dec) + suffix;
          if (p < 1) requestAnimationFrame(step); else el.textContent = text;
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cio.observe(el));
  }
});

// ===== land on #section links from other pages (after images load) =====
window.addEventListener('load', () => {
  if (location.hash.length > 1) {
    const target = document.querySelector(location.hash);
    if (target) {
      const top = target.getBoundingClientRect().top + window.pageYOffset - 84;
      window.scrollTo({ top, behavior: 'instant' });
    }
  }
});

// ===== Customized AI launch countdown (launch: 20 Oct 2026, IST) =====
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('aiDaysLeft');
  if (!el) return;
  const launch = new Date('2026-10-20T00:00:00+05:30');
  const days = Math.ceil((launch - new Date()) / 86400000);
  if (days > 0) {
    el.textContent = String(days);
  } else {
    el.textContent = 'Now';
    const span = el.nextElementSibling; if (span) span.textContent = 'Launching';
    const eb = document.getElementById('aiLaunchEyebrow'); if (eb) eb.textContent = 'Launching Now';
  }
});

// ===== N Automations logo: hover zoom + lightbox =====
// Hover zoom is CSS only (style.css v1.4). Click, tap, Enter or Space on the
// navbar or footer logo shows the big logo over a blurred page.
document.addEventListener('DOMContentLoaded', () => {
  const logoLinks = Array.from(document.querySelectorAll('.navbar .brand, .footer-brand .brand'))
    .filter(a => a.querySelector('.brand-logo'));
  if (!logoLinks.length) return;

  // Big logo lives next to the small one; its src is set on first open only
  const smallSrc = logoLinks[0].querySelector('.brand-logo').src;
  let largeSrc = 'assets/images/logo-large.png';
  try { largeSrc = new URL('logo-large.png', smallSrc).href; } catch (err) { /* keep the default */ }

  // Overlay, built once
  const box = document.createElement('div');
  box.className = 'logo-lightbox';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'N Automations logo');
  box.innerHTML =
    '<div class="logo-lightbox-card">' +
      '<img class="logo-lightbox-img" alt="N Automations logo" width="1024" height="919" decoding="async">' +
      '<button type="button" class="logo-lightbox-close" aria-label="Close">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>' +
      '</button>' +
    '</div>';
  document.body.appendChild(box);
  const card = box.querySelector('.logo-lightbox-card');
  const bigImg = box.querySelector('.logo-lightbox-img');
  const closeBtn = box.querySelector('.logo-lightbox-close');
  bigImg.addEventListener('load', () => bigImg.classList.add('is-loaded'));
  bigImg.addEventListener('error', () => { if (bigImg.src !== smallSrc) bigImg.src = smallSrc; });

  // Page scroll lock; pad by the scrollbar width so nothing jumps
  const navbarEl = document.getElementById('navbar');
  const toTopEl = document.getElementById('toTop');
  // The navbar animates its padding (style.css), so change it with transitions off
  const setNavPad = (v) => {
    if (!navbarEl) return;
    navbarEl.style.transition = 'none';
    navbarEl.style.paddingRight = v;
    void navbarEl.offsetWidth;
    navbarEl.style.transition = '';
  };
  const lockScroll = () => {
    const sb = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (sb > 0) {
      document.body.style.paddingRight = sb + 'px';
      setNavPad(sb + 'px');
      if (toTopEl) toTopEl.style.marginRight = sb + 'px';
    }
  };
  const unlockScroll = () => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    if (navbarEl && navbarEl.style.paddingRight) setNavPad('');
    if (toTopEl) toTopEl.style.marginRight = '';
  };

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isOpen = false;
  let opener = null;
  let hideTimer = 0;

  const openLogo = (link) => {
    if (isOpen) return;
    isOpen = true;
    opener = link;
    clearTimeout(hideTimer);
    if (!bigImg.getAttribute('src')) bigImg.src = largeSrc;
    lockScroll();
    box.hidden = false;
    void box.offsetWidth; // fade in from the closed state
    box.classList.add('open');
    closeBtn.focus({ preventScroll: true });
  };
  const closeLogo = () => {
    if (!isOpen) return;
    isOpen = false;
    box.classList.remove('open');
    unlockScroll();
    hideTimer = setTimeout(() => { if (!isOpen) box.hidden = true; }, reduceMotion.matches ? 0 : 450);
    if (opener) opener.focus({ preventScroll: true });
  };

  // The logo links now open the lightbox instead of navigating
  const isActivateKey = (e) => e.key === ' ' || e.key === 'Spacebar';
  logoLinks.forEach(link => {
    link.setAttribute('role', 'button');
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-label', 'View the N Automations logo');
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); openLogo(link); }
      else if (isActivateKey(e)) e.preventDefault(); // no page scroll
    });
    link.addEventListener('keyup', (e) => {
      if (isActivateKey(e)) { e.preventDefault(); openLogo(link); }
    });
  });

  // Capture phase: runs before the "#top" smooth-scroll handler on the home page
  document.addEventListener('click', (e) => {
    const link = e.target instanceof Element ? e.target.closest('a.brand') : null;
    if (!link || !logoLinks.includes(link)) return;
    e.preventDefault();
    e.stopPropagation();
    openLogo(link);
  }, true);

  // Click on the blurred backdrop closes; clicks on the logo card do nothing
  let pressOnCard = false;
  box.addEventListener('pointerdown', (e) => { pressOnCard = card.contains(e.target); });
  box.addEventListener('click', (e) => {
    if (!card.contains(e.target) && !pressOnCard) closeLogo();
    pressOnCard = false;
  });
  closeBtn.addEventListener('click', closeLogo);

  // Esc closes; Tab stays on the close button
  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape' || e.key === 'Esc') { e.preventDefault(); closeLogo(); }
    else if (e.key === 'Tab') { e.preventDefault(); closeBtn.focus(); }
  });
  document.addEventListener('focusin', (e) => {
    if (isOpen && !box.contains(e.target)) closeBtn.focus({ preventScroll: true });
  });
});
