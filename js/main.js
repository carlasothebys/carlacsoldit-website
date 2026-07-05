/* ═══════════════════════════════════════════════
   CARLA CHRISTENSON — Main JavaScript
   Clean single-file, no duplicate declarations
   ═══════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════
   0. SCROLL RESTORATION LOCK — runs before everything else
   Prevents ihf-kestrel.js (SPA router) and the browser
   from auto-scrolling to a saved position on load.
   'manual' means only our code controls scroll — nothing
   resets it to 0 or a cached position automatically.
════════════════════════════════════════════════════ */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

/* ════════════════════════════════════════════════════
   1. UTILITY — scroll to section with sticky-bar offset
════════════════════════════════════════════════════ */
function scrollToSection(href) {
  const target = document.querySelector(href);
  if (!target) return;
  const siteNavH  = (document.getElementById('siteNav') || { offsetHeight: 80 }).offsetHeight;
  const qnavBarEl = document.getElementById('qnavBar');
  const qnavBarH  = (qnavBarEl && !qnavBarEl.classList.contains('qnav-hidden'))
                    ? qnavBarEl.offsetHeight : 0;
  const totalOffset = siteNavH + qnavBarH + 8;
  const targetY = target.getBoundingClientRect().top + window.scrollY - totalOffset;
  window.scrollTo({ top: targetY, behavior: 'smooth' });
}

/* ════════════════════════════════════════════════════
   2. MOBILE DRAWER
════════════════════════════════════════════════════ */
const hamburger   = document.getElementById('navHamburger');
const drawer      = document.getElementById('mobileDrawer');
const drawerClose = document.getElementById('drawerClose');
const overlay     = document.getElementById('drawerOverlay');

function openMobileDrawer() {
  if (!drawer) return;
  drawer.classList.add('open');
  if (overlay) overlay.classList.add('open');
  /* STABILITY FIX: add class instead of setting overflow directly.
     scrollbar-gutter:stable in CSS prevents the page-width jump
     that occurred when the scrollbar disappeared on overflow:hidden. */
  document.body.classList.add('drawer-open');
}
function closeMobileDrawer() {
  if (!drawer) return;
  drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  document.body.classList.remove('drawer-open');
}

hamburger   && hamburger.addEventListener('click', openMobileDrawer);
drawerClose && drawerClose.addEventListener('click', closeMobileDrawer);
overlay     && overlay.addEventListener('click', closeMobileDrawer);

/* ════════════════════════════════════════════════════
   3. STICKY NAV — darken on scroll
════════════════════════════════════════════════════ */
const siteNav = document.getElementById('siteNav');
window.addEventListener('scroll', () => {
  if (!siteNav) return;
  siteNav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ════════════════════════════════════════════════════
   4. SMOOTH-SCROLL — all anchor links on the page
════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || href.length < 2) return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      scrollToSection(href);
      closeMobileDrawer();
    }
  });
});

/* ════════════════════════════════════════════════════
   5. REVEAL ON SCROLL
════════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
        .forEach(el => revealObserver.observe(el));

/* ════════════════════════════════════════════════════
   6. COUNTER ANIMATION (one definition, used everywhere)
════════════════════════════════════════════════════ */
function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  if (isNaN(target)) return;
  const suffix   = el.getAttribute('data-suffix') || '';
  const prefix   = el.getAttribute('data-prefix') || '';
  const duration = 1800;
  const start    = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    const value    = Math.floor(ease * target);
    el.textContent = prefix + (target >= 1000 ? value.toLocaleString() : value) + (progress >= 1 ? suffix : '');
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ════════════════════════════════════════════════════
   7. HERO VIDEO FALLBACK
════════════════════════════════════════════════════ */
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  const showFallback = () => {
    heroVideo.style.display = 'none';
    const fb = document.querySelector('.hero-img-fallback');
    if (fb) fb.style.display = 'block';
  };
  heroVideo.addEventListener('error', showFallback);
  setTimeout(() => { if (heroVideo.readyState < 2) showFallback(); }, 4000);
}

/* ════════════════════════════════════════════════════
   8. FLOATING CTA BAR
════════════════════════════════════════════════════ */
/* Float bar handled inline in index.html (id=floatCtaBar / floatCtaDismiss) */

/* ════════════════════════════════════════════════════
   9. HOME VALUE ESTIMATOR (3-step form)
════════════════════════════════════════════════════ */
let currentEstStep = 1;

function estNext(step) {
  const cur  = document.getElementById('estStep' + step);
  const next = document.getElementById('estStep' + (step + 1));
  if (cur)  cur.classList.remove('active');
  if (next) { next.classList.add('active'); currentEstStep = step + 1; }
  const bar = document.getElementById('estProgBar');
  if (bar) bar.style.width = ((step + 1) / 3 * 100) + '%';
}

async function estSubmit() {
  const get  = id => document.getElementById(id)?.value.trim() || '';
  const name = get('estName'), phone = get('estPhone'), email = get('estEmail');

  if (!name || (!phone && !email)) {
    alert('Please provide your name and at least a phone number or email so Carla can reach you.');
    return;
  }

  const btn = document.querySelector('#estForm .btn-gold');
  if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

  const fd = new FormData();
  ['estName','estPhone','estEmail','estAddress','estBeds','estBaths','estSqft','estGoal','estType']
    .forEach(id => fd.append(id.replace('est','').toLowerCase(), get(id) || 'Not provided'));
  fd.append('access_key', 'ca3cfd69-3be2-4167-8505-64b328513e99');
  fd.append('source',   'Home Value Estimator — carlacsoldit.com');
  fd.append('subject',  `🏠 Home Valuation Request from ${name}`);

  try {
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST', body: fd, headers: { Accept: 'application/json' }
    });
    await fetch('tables/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, phone, email,
        address: get('estAddress'), beds: get('estBeds'), baths: get('estBaths'),
        sqft: get('estSqft'), goal: get('estGoal'), property_type: get('estType'),
        source: 'home_value_estimator', submitted: new Date().toISOString()
      })
    }).catch(() => {});

    document.getElementById('estStep3')?.classList.remove('active');
    document.getElementById('estSuccess')?.classList.add('active');
    const bar = document.getElementById('estProgBar');
    if (bar) bar.style.width = '100%';

  } catch (err) {
    alert('Something went wrong. Please call Carla directly at (561) 307-9966.');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Get My Home Valuation →'; }
  }
}

window.estNext   = estNext;
window.estSubmit = estSubmit;

/* ════════════════════════════════════════════════════
   10. CONTACT FORM
════════════════════════════════════════════════════ */
async function submitContact() {
  const get  = id => document.getElementById(id)?.value.trim() || '';
  const name = get('cfName'), phone = get('cfPhone'), email = get('cfEmail');

  if (!name || (!phone && !email)) {
    alert('Please provide your name and a way to reach you.');
    return;
  }

  const btn = document.querySelector('#contactForm .btn-gold');
  if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

  const fd = new FormData();
  fd.append('access_key', 'ca3cfd69-3be2-4167-8505-64b328513e99');
  fd.append('name',     name);
  fd.append('phone',    phone    || 'Not provided');
  fd.append('email',    email    || 'Not provided');
  fd.append('interest', get('cfInterest') || 'Not specified');
  fd.append('message',  get('cfMessage')  || 'No message');
  fd.append('source',   'Contact Form — carlacsoldit.com');
  fd.append('subject',  `🏡 New Inquiry from ${name}`);

  try {
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST', body: fd, headers: { Accept: 'application/json' }
    });
    await fetch('tables/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, phone, email,
        interest: get('cfInterest'), message: get('cfMessage'),
        source: 'contact_form', submitted: new Date().toISOString()
      })
    }).catch(() => {});

    const successEl = document.getElementById('cfSuccess');
    if (successEl) { successEl.style.display = 'block'; }
    ['cfName','cfPhone','cfEmail','cfInterest','cfMessage'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

  } catch (err) {
    alert('Something went wrong. Please call Carla at (561) 307-9966.');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Send Message →'; }
  }
}
window.submitContact = submitContact;

/* ════════════════════════════════════════════════════
   11. PARALLAX HERO
   STABILITY FIX: use requestAnimationFrame to batch the
   transform write — prevents scroll-jank from forced
   layout/style recalculation on each scroll event.
   Also disabled on mobile (< 900px) to prevent iOS jitter.
════════════════════════════════════════════════════ */
const heroMedia = document.querySelector('.hero-media');
if (heroMedia) {
  let parallaxTicking = false;
  let lastScrollY = 0;

  function applyParallax() {
    /* Only apply on desktop — mobile parallax causes iOS jitter */
    if (window.innerWidth < 900) {
      heroMedia.style.transform = '';
      parallaxTicking = false;
      return;
    }
    if (lastScrollY < window.innerHeight) {
      /* translateZ(0) keeps the element on its compositor layer */
      heroMedia.style.transform = `translateY(${lastScrollY * 0.25}px) translateZ(0)`;
    }
    parallaxTicking = false;
  }

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!parallaxTicking) {
      parallaxTicking = true;
      requestAnimationFrame(applyParallax);
    }
  }, { passive: true });
}

/* ════════════════════════════════════════════════════
   12. TICKER PAUSE ON HOVER
════════════════════════════════════════════════════ */
const tickerInner = document.getElementById('tickerInner');
if (tickerInner) {
  tickerInner.addEventListener('mouseenter', () => tickerInner.style.animationPlayState = 'paused');
  tickerInner.addEventListener('mouseleave', () => tickerInner.style.animationPlayState = 'running');
}

/* ════════════════════════════════════════════════════
   13. QUICK-NAV BAR — search, pills, scroll-hide, active
════════════════════════════════════════════════════ */
(function () {
  const qnavBar      = document.getElementById('qnavBar');
  const qnavSearch   = document.getElementById('qnavSearch');
  const qnavClear    = document.getElementById('qnavClear');
  const qnavPills    = document.getElementById('qnavPills');
  const qnavDropdown = document.getElementById('qnavDropdown');
  if (!qnavBar || !qnavSearch || !qnavPills) return;

  /* Build pill index from DOM */
  const allPills = Array.from(qnavPills.querySelectorAll('.qnav-pill')).map(el => ({
    el,
    label:    el.textContent.trim(),
    href:     el.getAttribute('href'),
    keywords: (el.dataset.keywords || '') + ' ' + el.textContent.toLowerCase()
  }));

  /* ── Search dropdown ── */
  let focusIdx = -1;

  function renderDropdown(query) {
    const q = query.trim().toLowerCase();
    qnavDropdown.innerHTML = '';
    if (!q) { qnavDropdown.classList.remove('open'); focusIdx = -1; return; }

    const matches = allPills.filter(p => p.keywords.includes(q));
    if (!matches.length) {
      qnavDropdown.innerHTML = '<div class="qnav-drop-empty">No match — try "golf", "sold", or "network"</div>';
    } else {
      matches.forEach(p => {
        const item = document.createElement('a');
        item.className = 'qnav-drop-item';
        item.href = p.href;
        const icon = [...p.label][0].codePointAt(0) > 127 ? [...p.label][0] : '→';
        item.innerHTML = `<span class="qnav-drop-icon">${icon}</span>
          <span class="qnav-drop-label">${p.label.replace(/^.\s*/, '')}</span>
          <span class="qnav-drop-hint">${p.href.startsWith('#') ? 'This page' : 'New page'}</span>`;
        item.addEventListener('click', (e) => {
          e.preventDefault();
          qnavSearch.value = '';
          qnavClear.style.display = 'none';
          qnavDropdown.classList.remove('open');
          if (p.href.startsWith('#')) {
            scrollToSection(p.href);
          } else {
            window.location.href = p.href;
          }
        });
        qnavDropdown.appendChild(item);
      });
    }
    qnavDropdown.classList.add('open');
    focusIdx = -1;
  }

  qnavSearch.addEventListener('input', () => {
    qnavClear.style.display = qnavSearch.value ? 'block' : 'none';
    renderDropdown(qnavSearch.value);
  });
  qnavSearch.addEventListener('focus', () => {
    if (qnavSearch.value.trim()) renderDropdown(qnavSearch.value);
  });
  qnavSearch.addEventListener('keydown', e => {
    const items = qnavDropdown.querySelectorAll('.qnav-drop-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusIdx = Math.min(focusIdx + 1, items.length - 1);
      items.forEach((el, i) => el.classList.toggle('qnav-drop-focus', i === focusIdx));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusIdx = Math.max(focusIdx - 1, -1);
      items.forEach((el, i) => el.classList.toggle('qnav-drop-focus', i === focusIdx));
    } else if (e.key === 'Enter' && focusIdx >= 0) {
      e.preventDefault();
      items[focusIdx]?.click();
    } else if (e.key === 'Escape') {
      qnavDropdown.classList.remove('open');
      qnavSearch.blur();
    }
  });

  qnavClear.addEventListener('click', () => {
    qnavSearch.value = '';
    qnavClear.style.display = 'none';
    qnavDropdown.classList.remove('open');
    qnavSearch.focus();
  });

  document.addEventListener('click', e => {
    if (!qnavBar.contains(e.target)) qnavDropdown.classList.remove('open');
  });

  /* ── Active pill highlight on scroll — STABILIZED ──────────────
     STABILITY FIX (v3): The automatic active-pill scroll behavior
     (scrollIntoView and scrollLeft) has been fully disabled.
     Both caused vertical page bounce on iOS Safari and Android Chrome
     because the browser's scroll engine conflated the pill-bar's
     horizontal scroll with the page's vertical scroll position.

     What is preserved:
       · Pills are still clickable and navigate to sections.
       · The qnav-active CSS class is still toggled on scroll so the
         correct pill is visually highlighted — purely a class change,
         zero scroll side effects.

     What is removed:
       · No scrollLeft assignment during page scroll.
       · No scrollIntoView call of any kind.
       · No automatic pill-bar repositioning during page scroll.
       · The scroll listener below ONLY toggles a CSS class.
         It never moves any element or the page.
  ── */
  const sectionMap = allPills
    .filter(p => p.href.startsWith('#'))
    .map(p => ({ href: p.href, el: document.querySelector(p.href) }))
    .filter(p => p.el)
    .sort((a, b) => a.el.offsetTop - b.el.offsetTop);

  function updateActivePill() {
    const navH      = (document.getElementById('siteNav') || { offsetHeight: 80 }).offsetHeight;
    const qnavH     = qnavBar.offsetHeight || 48;
    const threshold = navH + qnavH + 16;
    let current = '';
    sectionMap.forEach(({ href, el }) => {
      if (el.getBoundingClientRect().top <= threshold) current = href;
    });
    /* CSS class toggle only — no scroll, no scrollLeft, no scrollIntoView */
    allPills.forEach(p => p.el.classList.toggle('qnav-active', p.href === current));
  }

  /* Passive scroll listener — class toggle only, zero movement side effects */
  let scrollTimer = null;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(updateActivePill, 150);
  }, { passive: true });

  updateActivePill();
})();

/* ════════════════════════════════════════════════════
   14. NETWORKING PHOTO GALLERY — Lightbox
════════════════════════════════════════════════════ */
(function () {
  const gallery  = document.getElementById('netGallery');
  const lightbox = document.getElementById('netLightbox');
  const lbImg    = document.getElementById('nlbImg');
  const lbCap    = document.getElementById('nlbCaption');
  const lbCount  = document.getElementById('nlbCounter');
  const lbClose  = document.getElementById('nlbClose');
  const lbPrev   = document.getElementById('nlbPrev');
  const lbNext   = document.getElementById('nlbNext');
  if (!gallery || !lightbox) return;

  const items = Array.from(gallery.querySelectorAll('.ng-item'));
  let current = 0;

  function open(idx) {
    current = ((idx % items.length) + items.length) % items.length;
    const img = items[current].querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    if (lbCap)   lbCap.textContent   = items[current].dataset.caption || '';
    if (lbCount) lbCount.textContent = (current + 1) + ' / ' + items.length;
    lightbox.classList.add('open');
    /* STABILITY FIX: use class instead of inline style
       so scrollbar-gutter:stable prevents page-width jump */
    document.body.classList.add('drawer-open');
  }
  function close() {
    lightbox.classList.remove('open');
    document.body.classList.remove('drawer-open');
  }

  items.forEach((item, i) => item.addEventListener('click', () => open(i)));
  lbClose && lbClose.addEventListener('click', close);
  lbPrev  && lbPrev.addEventListener('click',  e => { e.stopPropagation(); open(current - 1); });
  lbNext  && lbNext.addEventListener('click',  e => { e.stopPropagation(); open(current + 1); });
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  open(current - 1);
    if (e.key === 'ArrowRight') open(current + 1);
    if (e.key === 'Escape')     close();
  });

  let tx = 0;
  lightbox.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend',   e => {
    const diff = tx - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? open(current + 1) : open(current - 1);
  });
})();

/* ════════════════════════════════════════════════════
   15. SCROLL DEPTH TRACKING
   Fires GA4 scroll events at 25 / 50 / 75 / 90 percent.
   Each threshold fires exactly once per page view.
   Uses IntersectionObserver for accuracy + no jank.
   Passive — zero layout impact.
════════════════════════════════════════════════════ */
(function () {
  if (typeof gtag !== 'function') return;

  const THRESHOLDS = [25, 50, 75, 90];
  const fired = {};

  /* Place a sentinel <div> at each depth percentage and observe it */
  function placeSentinel(pct) {
    const sentinel = document.createElement('div');
    sentinel.style.cssText =
      'position:absolute;left:0;width:1px;height:1px;pointer-events:none;visibility:hidden;';

    /* Position relative to the full document height after load */
    function setTop() {
      const docH   = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      sentinel.style.top = Math.floor(docH * (pct / 100)) + 'px';
    }

    /* Re-anchor if the page grows (lazy-loaded content, etc.) */
    setTop();
    window.addEventListener('load', setTop, { once: true });

    document.body.appendChild(sentinel);
    return sentinel;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const pct = Number(entry.target.dataset.scrollPct);
      if (fired[pct]) return;
      fired[pct] = true;
      gtag('event', 'scroll', { percent_scrolled: pct });
      observer.unobserve(entry.target); /* fire once only */
    });
  }, {
    threshold: 0,
    rootMargin: '0px'
  });

  /* Wait for DOM + initial paint before placing sentinels */
  function init() {
    THRESHOLDS.forEach(pct => {
      const s = placeSentinel(pct);
      s.dataset.scrollPct = pct;
      observer.observe(s);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
