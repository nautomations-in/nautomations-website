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
      window.location.href = 'mailto:nautomations.in@gmail.com?subject=' +
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
