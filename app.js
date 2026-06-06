/* Gunderson & Partners — site JS */
(function(){
  'use strict';

  // ---------- HEADER ----------
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- MOBILE MENU ----------
  const burger = document.getElementById('burger');
  const mm = document.getElementById('mobileMenu');
  if (burger && mm) {
    burger.addEventListener('click', () => mm.classList.toggle('open'));
    mm.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => mm.classList.remove('open'))
    );
  }

  // ---------- FAQ ACCORDION ----------
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const a = q.nextElementSibling;
      const open = item.classList.contains('open');
      const parent = q.closest('.faq-wrap');
      parent.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        const ans = i.querySelector('.faq-a');
        if (ans) ans.style.maxHeight = null;
      });
      if (!open) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  // ---------- REVEAL ON SCROLL ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .reveal-scale, .stagger')
    .forEach(el => io.observe(el));

  // ---------- COUNTER ANIMATIONS ----------
  const counterIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const dur = 1500;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          const v = target * eased;
          el.textContent = prefix + (target >= 100 ? Math.round(v) : v.toFixed(1)) + suffix;
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = prefix + target + suffix;
        };
        requestAnimationFrame(tick);
        counterIo.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.counter').forEach(el => counterIo.observe(el));

  // ---------- RANGE SLIDER PROGRESS FILL ----------
  // Updates the CSS gradient on the track to show progress
  function updateSliderFill(slider) {
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = parseFloat(slider.value);
    const pct = ((val - min) / (max - min)) * 100;
    slider.style.setProperty('--pct', pct + '%');
  }
  document.querySelectorAll('input[type=range]').forEach(s => {
    updateSliderFill(s);
    s.addEventListener('input', () => updateSliderFill(s));
  });

  // ---------- SMOOTH NUMBER UPDATES ----------
  // Helper: animate a text value change with pulse
  function pulseEl(el) {
    el.classList.remove('pulse');
    void el.offsetWidth; // force reflow
    el.classList.add('pulse');
  }
  window.__pulseEl = pulseEl;

  // ---------- PARALLAX HERO ORBS ----------
  const orbs = document.querySelectorAll('.hero-orb');
  if (orbs.length) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY * 0.18;
          orbs.forEach((o, i) => {
            o.style.transform = `translate3d(0, ${y * (i === 0 ? 1 : -0.6)}px, 0)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ---------- FORM HANDLING ----------
  document.querySelectorAll('form.lead-form-el').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Basic validation
      const required = form.querySelectorAll('[required]');
      let ok = true;
      required.forEach(f => {
        if (!f.value.trim()) {
          f.style.borderColor = '#E8633A';
          ok = false;
        } else {
          f.style.borderColor = '';
        }
      });
      if (!ok) return;
      // Collect data
      const data = Object.fromEntries(new FormData(form).entries());
      console.log('Lead captured:', data);
      // TODO: wire to actual backend / GHL / Calendly
      // Show success
      const successEl = form.querySelector('.success-msg');
      const fieldsEl = form.querySelector('.form-fields');
      if (successEl && fieldsEl) {
        fieldsEl.style.display = 'none';
        successEl.classList.add('show');
      }
    });
  });
})();
