/* ============================================
   RM DIGITAL - Main JavaScript (UNIFICADO)
   Presencia Digital Inteligente
   - Navbar scroll
   - Mobile menu
   - Smooth scroll con offset
   - Animaciones (IntersectionObserver)
   - Parallax shapes
   - Counters stats
   - Cookies (banner + modal + localStorage)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Helpers
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ============================================
     NAVBAR SCROLL EFFECT
     ============================================ */
  const navbar = $('#navbar') || $('.navbar');
  const scrollThreshold = 50;

  const handleScroll = () => {
    if (!navbar) return;
    if (window.scrollY > scrollThreshold) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ============================================
     MOBILE MENU TOGGLE
     ============================================ */
  const menuToggle = $('#menuToggle') || $('.menu-toggle');
  const navMenu = $('#navMenu') || $('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Cerrar menú al dar click en links
    $$('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ============================================
     SMOOTH SCROLL (con offset por navbar fixed)
     - Solo aplica a anchors internos "#..."
     ============================================ */
  const smoothOffset = 80;
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;

      const target = $(href);
      if (!target) return;

      e.preventDefault();
      const pos = target.getBoundingClientRect().top + window.pageYOffset - smoothOffset;
      window.scrollTo({ top: pos, behavior: 'smooth' });
    });
  });

  /* ============================================
     SCROLL ANIMATIONS (fade-up)
     ============================================ */
  const fadeEls = $$('.fade-up');
  if (fadeEls.length) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          observer.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    fadeEls.forEach(el => obs.observe(el));
  }

  /* ============================================
     PARALLAX SHAPES (hero)
     - Si existen .shape
     ============================================ */
  const shapes = $$('.shape');
  if (shapes.length) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      shapes.forEach((shape, i) => {
        const speed = (i + 1) * 15;
        shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    });
  }

  /* ============================================
     STATS COUNTER (.stat-number)
     - Detecta sufijo desde el texto inicial (150+, 98%, 5 años)
     - O usa data-target si existe
     ============================================ */
  const statNumbers = $$('.stat-number');

  const parseStat = (el) => {
    const rawText = (el.textContent || '').trim();
    const targetAttr = el.getAttribute('data-target');

    // Si hay data-target, tomamos ese como número
    let target = targetAttr ? parseInt(targetAttr, 10) : NaN;

    // Sufijo: todo lo no numérico (excepto espacios) al final
    // Ej: "150+" => "+"
    // Ej: "98%" => "%"
    // Ej: "5 años" => " años"
    let suffix = '';
    if (rawText) {
      const m = rawText.match(/^(\d+)(.*)$/);
      if (m) {
        if (!targetAttr) target = parseInt(m[1], 10);
        suffix = (m[2] || '');
      }
    }

    if (!Number.isFinite(target)) return null;
    return { target, suffix };
  };

  const animateCounter = (el) => {
    const parsed = parseStat(el);
    if (!parsed) return;

    const { target, suffix } = parsed;
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const val = Math.floor(target * t);
      el.textContent = `${val}${suffix}`;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = `${target}${suffix}`;
    };

    requestAnimationFrame(tick);
  };

  if (statNumbers.length) {
    const statsObs = new IntersectionObserver((entries, observer) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          animateCounter(en.target);
          observer.unobserve(en.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(s => statsObs.observe(s));
  }

  /* ============================================
     COOKIE CONSENT
     - Funciona solo si existen los elementos
     - localStorage key: rm_cookie_consent
     ============================================ */
  const STORAGE_KEY = 'rm_cookie_consent';

  const cookieBanner = $('#cookieBanner');
  const cookieModal  = $('#cookieModal');

  // Si la página no tiene cookies (ej: algunas páginas internas), no hacemos nada.
  const hasCookieUI = cookieBanner && cookieModal;

  const getConsent = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  };

  const setConsent = (consent) => {
    const payload = {
      necessary: true,
      analytics: !!consent.analytics,
      marketing: !!consent.marketing,
      ts: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return payload;
  };

  const showBanner = () => { if (cookieBanner) cookieBanner.style.display = 'block'; };
  const hideBanner = () => { if (cookieBanner) cookieBanner.style.display = 'none'; };

  const openModal = () => {
    if (!cookieModal) return;

    const analyticsToggle = $('#cookieAnalytics');
    const marketingToggle = $('#cookieMarketing');

    const c = getConsent();
    if (analyticsToggle) analyticsToggle.checked = !!(c && c.analytics);
    if (marketingToggle) marketingToggle.checked = !!(c && c.marketing);

    cookieModal.style.display = 'flex';
    cookieModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!cookieModal) return;
    cookieModal.style.display = 'none';
    cookieModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (hasCookieUI) {
    const acceptBtn = $('#cookieAcceptBtn');
    const rejectBtn = $('#cookieRejectBtn');
    const configBtn = $('#cookieConfigBtn');
    const cookiePrefsLink = $('#cookiePrefsLink');
    const closeBtn = $('#cookieCloseBtn');
    const saveBtn = $('#cookieSaveBtn');
    const acceptAllBtn = $('#cookieAcceptAllBtn');
    const analyticsToggle = $('#cookieAnalytics');
    const marketingToggle = $('#cookieMarketing');

    // Init
    const c = getConsent();
    if (!c) showBanner();

    // Eventos
    if (acceptBtn) acceptBtn.addEventListener('click', () => {
      setConsent({ analytics: true, marketing: true });
      hideBanner();
    });

    if (rejectBtn) rejectBtn.addEventListener('click', () => {
      setConsent({ analytics: false, marketing: false });
      hideBanner();
    });

    if (configBtn) configBtn.addEventListener('click', openModal);

    if (cookiePrefsLink) cookiePrefsLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Click fuera del card cierra
    cookieModal.addEventListener('click', (e) => {
      if (e.target === cookieModal) closeModal();
    });

    if (saveBtn) saveBtn.addEventListener('click', () => {
      setConsent({
        analytics: !!(analyticsToggle && analyticsToggle.checked),
        marketing: !!(marketingToggle && marketingToggle.checked)
      });
      hideBanner();
      closeModal();
    });

    if (acceptAllBtn) acceptAllBtn.addEventListener('click', () => {
      if (analyticsToggle) analyticsToggle.checked = true;
      if (marketingToggle) marketingToggle.checked = true;
      setConsent({ analytics: true, marketing: true });
      hideBanner();
      closeModal();
    });
  }

  // Logs (opcional)
  // console.log('🚀 RM Digital - Presencia Digital Inteligente');
});
