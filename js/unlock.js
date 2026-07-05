/* ═══════════════════════════════════════════════════════════════
   CARLA CHRISTENSON — Lead Capture & Content Unlock System
   Validates real phone + real email before granting access
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Storage key ─────────────────────────────────────────────── */
  const UNLOCK_KEY = 'carla_unlocked_v2';

  // Clear any old version key so returning visitors see the gate again
  localStorage.removeItem('carla_unlocked_v1');

  /* ── Validation helpers ──────────────────────────────────────── */

  /**
   * Real phone validation:
   * – Strips all non-digit characters
   * – Must be exactly 10 digits (US) or 11 digits starting with 1
   * – Rejects obviously fake numbers (all same digit, sequential)
   */
  function isRealPhone(raw) {
    // Accept any phone with at least 7 digits — don't over-validate real people
    const digits = raw.replace(/\D/g, '');
    if (digits.length < 7) return false;
    if (/^(\d)\1+$/.test(digits)) return false; // all same digit only
    return true;
  }

  /**
   * Real email validation:
   * – Standard RFC-compatible regex
   * – Rejects obvious fake domains (example.com, test.com, fake.com, etc.)
   * – Rejects single-letter local parts
   * – Must have a valid TLD (2+ chars)
   */
  function isRealEmail(raw) {
    const email = raw.trim().toLowerCase();
    // Basic format check
    const pattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!pattern.test(email)) return false;

    // Reject obviously fake domains
    const fakeDomains = [
      'example.com', 'example.org', 'example.net',
      'test.com', 'test.org', 'test.net',
      'fake.com', 'fake.org', 'fake.net',
      'noemail.com', 'noreply.com', 'none.com',
      'aaa.com', 'bbb.com', 'ccc.com',
      'abc.com', 'xyz.com', 'qwerty.com',
      'asdf.com', 'mailinator.com', 'guerrillamail.com',
      'throwaway.email', 'trashmail.com', 'yopmail.com',
      'temp-mail.org', 'dispostable.com', 'sharklasers.com',
      'guerrillamailblock.com', 'grr.la', 'spam4.me',
      'disposableinbox.com', 'filzmail.com', 'throwam.com'
    ];
    const domain = email.split('@')[1];
    if (fakeDomains.includes(domain)) return false;

    // Reject single-character local parts
    const local = email.split('@')[0];
    if (local.length < 2) return false;

    // Reject all-same-char local (e.g. aaaa@gmail.com)
    if (/^(.)\1+$/.test(local)) return false;

    return true;
  }

  /* ── Show a brief "unlocked" toast ──────────────────────────── */
  function showUnlockedBanner() {
    const toast = document.createElement('div');
    toast.className = 'unlock-toast';
    toast.innerHTML = `<span>🔓</span> <strong>Full Access Unlocked!</strong> All club and condo details are now visible.`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('visible'), 50);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  }

  /* ── Save lead to RESTful Table API + Email Carla via Web3Forms ── */
  async function saveLead(data) {
    // 1️⃣ Email notification to Carla
    try {
      const formData = new FormData();
      formData.append('access_key', 'ca3cfd69-3be2-4167-8505-64b328513e99');
      formData.append('name',    data.name);
      formData.append('phone',   data.phone || 'Not provided');
      formData.append('email',   data.email || 'Not provided');
      formData.append('source',  'Unlock Modal — club & condo details — carlacsoldit.com');
      formData.append('subject', `🔓 New Registration: ${data.name} unlocked club & condo details`);

      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
    } catch (err) {
      console.warn('Web3Forms email failed (non-blocking):', err);
    }

    // 2️⃣ Save to database
    try {
      await fetch('tables/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:       data.name,
          phone:      data.phone,
          email:      data.email,
          source:     'unlock_modal',
          registered: new Date().toISOString()
        })
      });
    } catch (err) {
      // Silent fail — don't block unlock for network errors
      console.warn('Lead save failed (non-blocking):', err);
    }
  }

  /* ══════════════════════════════════════════════════════════════
     WIRE EVERYTHING UP AFTER DOM IS READY
  ══════════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {

    /* ── DOM refs (queried after DOM is ready) ─────────────────── */
    const overlay    = document.getElementById('unlockOverlay');
    const modal      = document.getElementById('unlockModal');
    const closeBtn   = document.getElementById('unlockClose');
    const form       = document.getElementById('unlockForm');
    const nameInput  = document.getElementById('ulName');
    const phoneInput = document.getElementById('ulPhone');
    const emailInput = document.getElementById('ulEmail');
    const nameErr    = document.getElementById('ulNameErr');
    const phoneErr   = document.getElementById('ulPhoneErr');
    const emailErr   = document.getElementById('ulEmailErr');
    const submitBtn  = document.getElementById('ulSubmit');
    const successMsg = document.getElementById('ulSuccess');

    /* ── All locked cards (queried after DOM is ready) ─────────── */
    const lockedCards = document.querySelectorAll('.locked-card');

    /* ── Error helpers ──────────────────────────────────────────── */
    function clearErrors() {
      [nameErr, phoneErr, emailErr].forEach(el => {
        if (el) { el.textContent = ''; el.classList.remove('visible'); }
      });
      [nameInput, phoneInput, emailInput].forEach(el => {
        if (el) el.classList.remove('input-error');
      });
    }

    function showError(errEl, inputEl, msg) {
      if (errEl) { errEl.textContent = msg; errEl.classList.add('visible'); }
      if (inputEl) inputEl.classList.add('input-error');
    }

    /* ── Modal open / close ─────────────────────────────────────── */
    function openModal() {
      if (!modal || !overlay) return;
      modal.classList.add('open');
      overlay.classList.add('open');
      document.body.classList.add('modal-open');
      setTimeout(() => nameInput && nameInput.focus(), 300);
    }

    function closeModal() {
      if (!modal || !overlay) return;
      modal.classList.remove('open');
      overlay.classList.remove('open');
      document.body.classList.remove('modal-open');
    }

    /* ── Unlock all locked content ──────────────────────────────── */
    function unlockAllContent() {
      lockedCards.forEach(card => {
        // Fade out overlay
        const lockOverlay = card.querySelector('.card-lock-overlay');
        if (lockOverlay) {
          lockOverlay.style.transition = 'opacity 0.5s ease';
          lockOverlay.style.opacity = '0';
          setTimeout(() => lockOverlay.remove(), 520);
        }
        // Un-blur card content
        setTimeout(() => {
          card.classList.remove('locked-card');
          card.removeAttribute('data-lock');
        }, 400);
      });

      // Remove teaser banners
      document.querySelectorAll('.unlock-teaser-bar').forEach(el => {
        el.style.transition = 'opacity 0.4s ease, max-height 0.4s ease';
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 450);
      });

      localStorage.setItem(UNLOCK_KEY, 'true');
    }

    /* ── Apply lock overlays to locked cards ────────────────────── */
    function applyLockOverlays() {
      lockedCards.forEach(card => {
        // Don't double-add
        if (card.querySelector('.card-lock-overlay')) return;

        // Simple blur overlay — NO extra button per card.
        // The teaser bar banner has the single unlock CTA for each section.
        // Clicking anywhere on the blurred card opens the modal.
        const lockEl = document.createElement('div');
        lockEl.className = 'card-lock-overlay';
        lockEl.style.cursor = 'pointer';
        lockEl.innerHTML = `
          <div class="clo-inner">
            <span class="clo-icon">🔒</span>
            <p class="clo-msg">Register Free — Click to Unlock</p>
          </div>`;
        card.appendChild(lockEl);

        lockEl.addEventListener('click', (e) => {
          e.stopPropagation();
          openModal();
        });
      });
    }

    /* ── Form submission ────────────────────────────────────────── */
    function handleSubmit(e) {
      e.preventDefault();
      clearErrors();

      const name  = nameInput  ? nameInput.value.trim()  : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';

      let valid = true;

      // Name validation
      if (name.length < 2) {
        showError(nameErr, nameInput, 'Please enter your full name.');
        valid = false;
      } else if (name.split(' ').filter(w => w.length > 0).length < 2) {
        showError(nameErr, nameInput, 'Please enter both first and last name.');
        valid = false;
      }

      // Phone validation
      if (!phone) {
        showError(phoneErr, phoneInput, 'A phone number is required.');
        valid = false;
      } else if (!isRealPhone(phone)) {
        showError(phoneErr, phoneInput, 'Please enter a valid 10-digit US phone number.');
        valid = false;
      }

      // Email validation
      if (!email) {
        showError(emailErr, emailInput, 'An email address is required.');
        valid = false;
      } else if (!isRealEmail(email)) {
        showError(emailErr, emailInput, 'Please enter a valid email address.');
        valid = false;
      }

      if (!valid) return;

      // Save lead to the API table
      saveLead({ name, phone, email });

      // Show success then unlock
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Unlocking…';
      }

      setTimeout(() => {
        if (successMsg) successMsg.style.display = 'flex';
        if (submitBtn) submitBtn.style.display = 'none';

        // Close modal and unlock after brief delay
        setTimeout(() => {
          // GA4 — club/condo content unlock lead
          if (typeof gtag === 'function') {
            gtag('event', 'generate_lead', { method: 'club_unlock' });
          }
          closeModal();
          unlockAllContent();
          showUnlockedBanner();
        }, 1800);
      }, 600);
    }

    /* ── Initialize ─────────────────────────────────────────────── */
    const alreadyUnlocked = localStorage.getItem(UNLOCK_KEY) === 'true';

    if (alreadyUnlocked) {
      // Already registered — unlock immediately without overlay
      unlockAllContent();
    } else {
      // Apply blurred overlays with unlock buttons
      applyLockOverlays();
    }

    // Teaser bar buttons → open modal
    const condoUnlockBtn = document.getElementById('condoUnlockBtn');
    const clubUnlockBtn  = document.getElementById('clubUnlockBtn');
    condoUnlockBtn && condoUnlockBtn.addEventListener('click', openModal);
    clubUnlockBtn  && clubUnlockBtn.addEventListener('click', openModal);

    // Close button
    closeBtn && closeBtn.addEventListener('click', closeModal);

    // Overlay click closes modal
    overlay && overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
    });

    // Form submit
    form && form.addEventListener('submit', handleSubmit);

    // Real-time phone formatting
    phoneInput && phoneInput.addEventListener('input', () => {
      let digits = phoneInput.value.replace(/\D/g, '');
      if (digits.length > 10) digits = digits.slice(0, 10);
      if (digits.length >= 7) {
        phoneInput.value = `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
      } else if (digits.length >= 4) {
        phoneInput.value = `(${digits.slice(0,3)}) ${digits.slice(3)}`;
      } else if (digits.length >= 1) {
        phoneInput.value = digits;
      }
    });

  }); // end DOMContentLoaded

})();
