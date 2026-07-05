/* ═══════════════════════════════════════════════════════════════
   CARLA CHRISTENSON — Area Guide Unlock System
   Shows intro/about section free; gates all detail sections.
   Validates real name, phone, email before granting access.
   Sends lead to Formspree + tables/leads API.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const UNLOCK_KEY = 'carla_area_unlocked_v1';

  /* ── Validation ────────────────────────────────────────────── */
  function isRealPhone(raw) {
    // Just require at least 7 digits — accept any real-looking phone number
    const digits = raw.replace(/\D/g, '');
    if (digits.length < 7) return false;
    if (/^(\d)\1+$/.test(digits)) return false; // all same digit (e.g. 0000000)
    return true;
  }

  function isRealEmail(raw) {
    const email = raw.trim().toLowerCase();
    // Basic format check only — don't block real domains
    if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email)) return false;
    const fakeDomains = [
      'example.com','example.org','example.net','test.com','fake.com',
      'mailinator.com','guerrillamail.com','trashmail.com','yopmail.com',
      'temp-mail.org','throwaway.email','sharklasers.com','spam4.me'
    ];
    const domain = email.split('@')[1];
    if (fakeDomains.includes(domain)) return false;
    return true;
  }

  /* ── Save lead ─────────────────────────────────────────────── */
  async function saveLead(data) {
    const page = window.location.pathname.replace(/^\//, '') || 'area-guide';

    try {
      const fd = new FormData();
      fd.append('access_key', 'ca3cfd69-3be2-4167-8505-64b328513e99');
      fd.append('name',     data.name);
      fd.append('phone',    data.phone);
      fd.append('email',    data.email);
      fd.append('source',   `Area Guide Unlock — ${page} — carlacsoldit.com`);
      fd.append('subject',  `🔓 New Lead: ${data.name} unlocked ${page}`);
      await fetch('https://api.web3forms.com/submit', { method:'POST', body:fd, headers:{'Accept':'application/json'} });
    } catch(e) { console.warn('Web3Forms (non-blocking):', e); }

    try {
      await fetch('tables/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name, phone: data.phone, email: data.email,
          source: `area_unlock_${page}`, registered: new Date().toISOString()
        })
      });
    } catch(e) { console.warn('Lead table (non-blocking):', e); }
  }

  /* ── Unlock all gated sections ─────────────────────────────── */
  function unlockContent() {
    // Remove the gate wall
    const wall = document.getElementById('areaGateWall');
    if (wall) {
      wall.style.transition = 'opacity 0.4s ease';
      wall.style.opacity = '0';
      setTimeout(() => wall.remove(), 450);
    }
    // Show all locked sections
    document.querySelectorAll('.area-locked-section').forEach(el => {
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      el.style.display = 'block'; // must be explicit to override CSS rule
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
    localStorage.setItem(UNLOCK_KEY, 'true');

    // Toast
    const toast = document.createElement('div');
    toast.style.cssText = `
      position:fixed; bottom:28px; left:50%; transform:translateX(-50%) translateY(20px);
      background:#1a2e1a; color:#fff; font-family:'Raleway',sans-serif; font-size:0.88rem;
      padding:14px 28px; border-radius:8px; border:1px solid rgba(184,150,90,0.4);
      box-shadow:0 8px 32px rgba(0,0,0,0.5); z-index:9999; opacity:0;
      transition:opacity 0.3s ease, transform 0.3s ease;`;
    toast.innerHTML = '🔓 <strong>Full Access Granted</strong> — All area details are now visible.';
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity='1'; toast.style.transform='translateX(-50%) translateY(0)'; });
    setTimeout(() => { toast.style.opacity='0'; setTimeout(()=>toast.remove(),400); }, 4500);
  }

  /* ── Build + inject the modal HTML ────────────────────────── */
  function buildModal() {
    const pageTitle = document.title.split('|')[0].trim();

    const html = `
    <div id="areaUnlockOverlay" style="
      position:fixed;inset:0;background:rgba(0,0,0,0.72);
      backdrop-filter:blur(4px);z-index:9990;display:none;align-items:center;justify-content:center;">
    </div>
    <div id="areaUnlockModal" role="dialog" aria-modal="true" style="
      position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.95);
      width:min(480px,92vw);background:#0f1e2d;border:1px solid rgba(184,150,90,0.3);
      border-radius:14px;padding:36px 32px;box-shadow:0 24px 64px rgba(0,0,0,0.7);
      z-index:9991;display:none;opacity:0;transition:opacity 0.25s ease,transform 0.25s ease;
      font-family:'Raleway',sans-serif;">
      <button id="areaUnlockClose" aria-label="Close" style="
        position:absolute;top:14px;right:16px;background:none;border:none;
        color:rgba(255,255,255,0.4);font-size:1.3rem;cursor:pointer;line-height:1;">✕</button>

      <div style="text-align:center;margin-bottom:24px;">
        <div style="font-size:2rem;margin-bottom:10px;">🔓</div>
        <h2 style="font-family:'Playfair Display',serif;font-size:1.5rem;color:#fff;margin:0 0 10px;">
          Unlock the Full <em style="color:#B8965A;">Area Guide</em>
        </h2>
        <p style="color:rgba(255,255,255,0.55);font-size:0.85rem;line-height:1.6;margin:0;">
          Register free to see community pricing, membership fees, market data,
          and insider details for <strong style="color:rgba(255,255,255,0.8);">${pageTitle}</strong>.
        </p>
      </div>

      <form id="areaUnlockForm" novalidate>
        <div style="margin-bottom:14px;">
          <label for="auName" style="display:block;font-size:0.72rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-bottom:6px;">Full Name</label>
          <input id="auName" type="text" placeholder="First & Last Name" autocomplete="name" style="
            width:100%;box-sizing:border-box;background:rgba(255,255,255,0.06);
            border:1px solid rgba(255,255,255,0.15);border-radius:8px;
            padding:12px 14px;color:#fff;font-family:'Raleway',sans-serif;font-size:0.9rem;outline:none;">
          <div id="auNameErr" style="color:#f87171;font-size:0.75rem;margin-top:5px;display:none;"></div>
        </div>

        <div style="margin-bottom:14px;">
          <label for="auPhone" style="display:block;font-size:0.72rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-bottom:6px;">Phone Number</label>
          <input id="auPhone" type="tel" placeholder="(561) 000-0000" autocomplete="tel" style="
            width:100%;box-sizing:border-box;background:rgba(255,255,255,0.06);
            border:1px solid rgba(255,255,255,0.15);border-radius:8px;
            padding:12px 14px;color:#fff;font-family:'Raleway',sans-serif;font-size:0.9rem;outline:none;">
          <div id="auPhoneErr" style="color:#f87171;font-size:0.75rem;margin-top:5px;display:none;"></div>
        </div>

        <div style="margin-bottom:20px;">
          <label for="auEmail" style="display:block;font-size:0.72rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-bottom:6px;">Email Address</label>
          <input id="auEmail" type="email" placeholder="you@email.com" autocomplete="email" style="
            width:100%;box-sizing:border-box;background:rgba(255,255,255,0.06);
            border:1px solid rgba(255,255,255,0.15);border-radius:8px;
            padding:12px 14px;color:#fff;font-family:'Raleway',sans-serif;font-size:0.9rem;outline:none;">
          <div id="auEmailErr" style="color:#f87171;font-size:0.75rem;margin-top:5px;display:none;"></div>
        </div>

        <button id="auSubmit" type="submit" style="
          width:100%;background:#B8965A;color:#fff;font-family:'Raleway',sans-serif;
          font-weight:700;font-size:0.88rem;letter-spacing:0.06em;text-transform:uppercase;
          padding:14px 20px;border:none;border-radius:8px;cursor:pointer;
          transition:background 0.2s;">Unlock Full Access →</button>

        <div id="auSuccess" style="display:none;text-align:center;padding:16px 0;">
          <div style="font-size:1.8rem;margin-bottom:8px;">✅</div>
          <p style="color:#4ade80;font-weight:700;margin:0 0 4px;">Access Granted!</p>
          <p style="color:rgba(255,255,255,0.5);font-size:0.82rem;margin:0;">Loading full details…</p>
        </div>
      </form>

      <p style="text-align:center;color:rgba(255,255,255,0.28);font-size:0.7rem;margin:16px 0 0;">
        🔒 Your information is private and never sold. Carla may reach out to assist you.
      </p>
    </div>`;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);
  }

  /* ── Build the gate wall that sits between free and locked ─── */
  function buildGateWall(targetEl) {
    const wall = document.createElement('div');
    wall.id = 'areaGateWall';
    wall.style.cssText = `
      position:relative;z-index:10;margin:-60px 0 0;
      padding:0;pointer-events:none;`;

    wall.innerHTML = `
      <!-- Fade-out gradient overlay at top of wall -->
      <div style="height:160px;background:linear-gradient(to bottom,transparent,#0D1B2A);margin-bottom:0;"></div>

      <!-- Teaser bar -->
      <div style="
        background:#0D1B2A;padding:0 24px 60px;text-align:center;pointer-events:all;">
        <div style="
          max-width:640px;margin:0 auto;
          background:linear-gradient(135deg,rgba(184,150,90,0.12),rgba(184,150,90,0.05));
          border:1px solid rgba(184,150,90,0.35);border-radius:14px;
          padding:36px 32px;
          box-shadow:0 0 40px rgba(184,150,90,0.12),0 0 0 1px rgba(184,150,90,0.08);">
          <div style="font-size:2.2rem;margin-bottom:12px;">🔒</div>
          <h3 style="font-family:'Playfair Display',serif;font-size:1.4rem;color:#fff;margin:0 0 12px;font-weight:400;">
            Full Guide Is <em style="color:#B8965A;">Members Only</em>
          </h3>
          <p style="font-family:'Raleway',sans-serif;font-size:0.88rem;color:rgba(255,255,255,0.6);line-height:1.7;margin:0 0 24px;">
            Register free to unlock <strong style="color:rgba(255,255,255,0.85);">community pricing, membership fees, market data,
            insider comparisons, and Carla's full area analysis</strong> — the information every serious buyer needs.
          </p>
          <button id="areaGateBtn" type="button" style="
            background:#B8965A;color:#fff;font-family:'Raleway',sans-serif;
            font-weight:700;font-size:0.85rem;letter-spacing:0.08em;text-transform:uppercase;
            padding:14px 32px;border:none;border-radius:8px;cursor:pointer;
            box-shadow:0 4px 20px rgba(184,150,90,0.3);transition:background 0.2s;">
            Unlock Free Access →
          </button>
          <p style="font-family:'Raleway',sans-serif;font-size:0.7rem;color:rgba(255,255,255,0.25);margin:14px 0 0;">
            Free registration · No credit card · Instant access
          </p>
        </div>
      </div>`;

    targetEl.parentNode.insertBefore(wall, targetEl);
    return wall;
  }

  /* ── Open / close modal ────────────────────────────────────── */
  function openModal() {
    const overlay = document.getElementById('areaUnlockOverlay');
    const modal   = document.getElementById('areaUnlockModal');
    overlay.style.display = 'flex';
    modal.style.display   = 'block';
    requestAnimationFrame(() => {
      modal.style.opacity   = '1';
      modal.style.transform = 'translate(-50%,-50%) scale(1)';
    });
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('auName').focus(), 300);
  }

  function closeModal() {
    const overlay = document.getElementById('areaUnlockOverlay');
    const modal   = document.getElementById('areaUnlockModal');
    modal.style.opacity   = '0';
    modal.style.transform = 'translate(-50%,-50%) scale(0.95)';
    setTimeout(() => {
      overlay.style.display = 'none';
      modal.style.display   = 'none';
    }, 280);
    document.body.style.overflow = '';
  }

  /* ── Form validation & submit ──────────────────────────────── */
  function setErr(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.style.display = msg ? 'block' : 'none';
  }
  function clearErrs() {
    ['auNameErr','auPhoneErr','auEmailErr'].forEach(id => setErr(id,''));
  }
  function markInputError(id, hasErr) {
    const el = document.getElementById(id);
    if (el) el.style.borderColor = hasErr ? '#f87171' : 'rgba(255,255,255,0.15)';
  }

  function handleSubmit(e) {
    e.preventDefault();
    clearErrs();
    const name  = document.getElementById('auName').value.trim();
    const phone = document.getElementById('auPhone').value.trim();
    const email = document.getElementById('auEmail').value.trim();
    let valid = true;

    if (name.length < 2 || name.split(' ').filter(w=>w).length < 2) {
      setErr('auNameErr','Please enter your first and last name.');
      markInputError('auName', true); valid = false;
    } else markInputError('auName', false);

    if (!phone || !isRealPhone(phone)) {
      setErr('auPhoneErr','Please enter a valid 10-digit US phone number.');
      markInputError('auPhone', true); valid = false;
    } else markInputError('auPhone', false);

    if (!email || !isRealEmail(email)) {
      setErr('auEmailErr','Please enter a valid email address.');
      markInputError('auEmail', true); valid = false;
    } else markInputError('auEmail', false);

    if (!valid) return;

    saveLead({ name, phone, email });

    const btn = document.getElementById('auSubmit');
    btn.disabled = true;
    btn.textContent = 'Unlocking…';

    setTimeout(() => {
      document.getElementById('auSuccess').style.display = 'block';
      btn.style.display = 'none';
      setTimeout(() => {
        // GA4 — area guide content unlock lead
        if (typeof gtag === 'function') {
          gtag('event', 'generate_lead', {
            method: 'area_guide_unlock',
            page_path: window.location.pathname
          });
        }
        closeModal();
        unlockContent();
      }, 1800);
    }, 600);
  }

  /* ── Main init ─────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {

    // Already unlocked? Show everything immediately.
    if (localStorage.getItem(UNLOCK_KEY) === 'true') {
      document.querySelectorAll('.area-locked-section').forEach(el => {
        el.style.display = 'block'; // must be explicit to override CSS rule
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return; // no wall, no modal needed
    }

    // Find the first locked section — insert wall before it
    const firstLocked = document.querySelector('.area-locked-section');
    if (!firstLocked) return; // nothing to gate

    // Initially hide all locked sections (inline style reinforces CSS rule)
    document.querySelectorAll('.area-locked-section').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.display = 'none';
    });

    // Build wall + modal
    buildGateWall(firstLocked);
    buildModal();

    // Wire buttons
    document.getElementById('areaGateBtn').addEventListener('click', openModal);
    document.getElementById('areaUnlockClose').addEventListener('click', closeModal);
    document.getElementById('areaUnlockOverlay').addEventListener('click', (e) => {
      if (e.target === document.getElementById('areaUnlockOverlay')) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
    document.getElementById('areaUnlockForm').addEventListener('submit', handleSubmit);

    // Phone auto-format
    document.getElementById('auPhone').addEventListener('input', function() {
      let d = this.value.replace(/\D/g,'').slice(0,10);
      if (d.length >= 7)      this.value = `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
      else if (d.length >= 4) this.value = `(${d.slice(0,3)}) ${d.slice(3)}`;
      else                    this.value = d;
    });
  });

})();
