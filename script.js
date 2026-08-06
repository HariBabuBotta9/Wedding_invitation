/* =========================================================
 * Hari ❤ Varshini — Telugu Wedding Invitation
 * script.js  (vanilla, no dependencies)
 * ========================================================= */

/* ----------  Configuration  ----------
 * Wedding date/time for the countdown (Muhurtham).
 * Format: local time — Andhra Pradesh (IST, UTC+05:30) → 2026-08-21 03:56
 */
const WEDDING_ISO       = '2026-08-21T03:56:00+05:30';
const RECEPTION_ISO     = '2026-08-20T19:00:00+05:30';

/* ----------  Google Apps Script Web App URL  ----------
 *
 *   1. Open Code.gs (in this project) in Google Apps Script:
 *      https://script.google.com/  →  New Project → paste Code.gs
 *   2. Deploy → New deployment → type: Web app
 *      "Execute as"        : Me
 *      "Who has access"    : Anyone
 *   3. Copy the Web app URL and paste it below (replace the placeholder):
 */
const GOOGLE_SHEETS_URL = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEBAPP_URL_HERE';

/* =========================================================
 *  1. WELCOME OVERLAY
 * ========================================================= */
(function welcome() {
  const overlay = document.getElementById('welcome');
  const site    = document.getElementById('site');
  const btn     = document.getElementById('openInvitationBtn');

  // Trigger reveal animations right away
  requestAnimationFrame(() => {
    overlay.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  });

  btn.addEventListener('click', () => {
    overlay.classList.add('hide');
    site.hidden = false;
    // scroll to top of the site
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    setTimeout(() => overlay.remove(), 900);

    // Kick off reveal observer for the site
    initReveal();
    initPetals();
    initCountdown();
    initGlow();
  });
})();

/* =========================================================
 *  2. SCROLL REVEAL
 * ========================================================= */
function initReveal() {
  // Anything already in the viewport (or above it) reveals right away — no
  // waiting for a scroll gesture. This matters on the initial site reveal
  // AND for browsers that never fire IntersectionObserver on off-screen items.
  const revealAll = () => {
    document.querySelectorAll('.site .reveal').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.95) el.classList.add('in');
    });
  };
  revealAll();

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.site .reveal').forEach(el => io.observe(el));

  // Safety net: if for any reason (headless preview, print, etc.) the observer
  // never fires, guarantee visibility after 3 s.
  setTimeout(() => {
    document.querySelectorAll('.site .reveal:not(.in)').forEach(el => el.classList.add('in'));
  }, 3000);
}

/* =========================================================
 *  3. NAV — mobile menu, active states, theme toggle
 * ========================================================= */
(function nav() {
  const burger  = document.getElementById('navToggle');
  const links   = document.querySelector('.nav__links');
  const themeBt = document.getElementById('themeToggle');

  burger?.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  links?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });

  // Theme
  const stored = localStorage.getItem('hv-theme');
  if (stored) document.documentElement.setAttribute('data-theme', stored);
  themeBt?.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', cur);
    localStorage.setItem('hv-theme', cur);
  });
})();

/* =========================================================
 *  4. COUNTDOWN TIMER
 * ========================================================= */
function initCountdown() {
  const target = new Date(WEDDING_ISO).getTime();
  const els = {
    d: document.querySelector('[data-cd="d"]'),
    h: document.querySelector('[data-cd="h"]'),
    m: document.querySelector('[data-cd="m"]'),
    s: document.querySelector('[data-cd="s"]'),
  };
  if (!els.d) return;

  function pad(n) { return String(Math.max(0, n)).padStart(2, '0'); }

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      els.d.textContent = els.h.textContent = els.m.textContent = els.s.textContent = '00';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff / 3600000) % 24;
    const m = Math.floor(diff / 60000) % 60;
    const s = Math.floor(diff / 1000) % 60;
    els.d.textContent = pad(d);
    els.h.textContent = pad(h);
    els.m.textContent = pad(m);
    els.s.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);
}

/* =========================================================
 *  5. FALLING PETALS (canvas)
 * ========================================================= */
function initPetals() {
  const canvas = document.getElementById('petals');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Petal colors: rose, jasmine (white/cream), marigold (orange/yellow), lotus pink
  const colors = [
    '#c97488', // rose
    '#e7a9b6', // lotus pink
    '#f6f2e8', // jasmine (cream white)
    '#ffb347', // marigold
    '#e29b47', // deep marigold
    '#b48a3c', // gold
  ];

  let W = 0, H = 0, dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const petalCount = Math.min(Math.floor((W * H) / 22000), 60);
  const petals = Array.from({ length: petalCount }, () => spawn(true));

  function spawn(initial) {
    return {
      x: Math.random() * W,
      y: initial ? Math.random() * H : -20,
      size: 8 + Math.random() * 10,
      color: colors[(Math.random() * colors.length) | 0],
      vy: 0.4 + Math.random() * 1.1,
      vx: -0.4 + Math.random() * 0.8,
      rot: Math.random() * Math.PI * 2,
      vr: -0.02 + Math.random() * 0.04,
      wob: Math.random() * Math.PI * 2,
      wobSpd: 0.01 + Math.random() * 0.02,
      opacity: 0.6 + Math.random() * 0.4,
      shape: Math.random() < 0.4 ? 'jasmine' : 'petal',
    };
  }

  function drawPetal(p) {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    if (p.shape === 'jasmine') {
      // 5-petaled small flower
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.ellipse(0, -p.size * 0.5, p.size * 0.25, p.size * 0.4, (i / 5) * Math.PI * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.rotate((Math.PI * 2) / 5);
      }
      // yellow center
      ctx.fillStyle = '#e2b04b';
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.18, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // simple petal (teardrop)
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.4, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
      // vein
      ctx.strokeStyle = 'rgba(0,0,0,.15)';
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(0, -p.size); ctx.lineTo(0, p.size);
      ctx.stroke();
    }
    ctx.restore();
  }

  let raf;
  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (const p of petals) {
      p.wob += p.wobSpd;
      p.x += p.vx + Math.sin(p.wob) * 0.6;
      p.y += p.vy;
      p.rot += p.vr;
      if (p.y > H + 30 || p.x < -30 || p.x > W + 30) Object.assign(p, spawn(false));
      drawPetal(p);
    }
    raf = requestAnimationFrame(frame);
  }
  frame();

  // Pause when hero not in view (perf)
  const hero = document.getElementById('hero');
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { if (!raf) frame(); }
    else { cancelAnimationFrame(raf); raf = null; }
  }, { threshold: 0.02 });
  io.observe(hero);
}

/* =========================================================
 *  6. GLOWING PARTICLES (decorative, subtle)
 * ========================================================= */
function initGlow() {
  // Nothing dynamic — handled by CSS on .hero__particles.
  // Placeholder for future JS-driven glow if desired.
}

/* =========================================================
 *  7. GALLERY LIGHTBOX
 * ========================================================= */
(function lightbox() {
  const tiles   = document.querySelectorAll('.gtile');
  const box     = document.getElementById('lightbox');
  const img     = document.getElementById('lbImg');
  const cap     = document.getElementById('lbCap');
  const close   = document.getElementById('lbClose');
  const prev    = document.getElementById('lbPrev');
  const next    = document.getElementById('lbNext');
  if (!tiles.length) return;

  const items = Array.from(tiles).map(t => ({
    src: t.dataset.src,
    caption: t.dataset.caption || '',
  }));
  let idx = 0;

  function show(i) {
    idx = (i + items.length) % items.length;
    img.src = items[idx].src;
    cap.textContent = items[idx].caption;
    box.hidden = false;
    requestAnimationFrame(() => box.classList.add('show'));
    box.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function hide() {
    box.classList.remove('show');
    box.setAttribute('aria-hidden', 'true');
    setTimeout(() => { box.hidden = true; img.src = ''; }, 350);
    document.body.style.overflow = '';
  }

  tiles.forEach((t, i) => t.addEventListener('click', () => show(i)));
  close.addEventListener('click', hide);
  prev.addEventListener('click', () => show(idx - 1));
  next.addEventListener('click', () => show(idx + 1));
  box.addEventListener('click', (e) => { if (e.target === box) hide(); });
  window.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') hide();
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
  });
})();

/* =========================================================
 *  8. MUSIC PLAYER
 * ========================================================= */
(function music() {
  const audio   = document.getElementById('audio');
  const player  = document.getElementById('player');
  const btn     = document.getElementById('playPause');
  const bar     = document.getElementById('playerBar');
  const vol     = document.getElementById('volSlider');
  if (!audio || !btn) return;

  audio.volume = parseFloat(vol.value);

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => {
        player.classList.add('playing');
        btn.setAttribute('aria-label', 'Pause music');
      }).catch(() => {
        toast('Music file not yet added.');
      });
    } else {
      audio.pause();
      player.classList.remove('playing');
      btn.setAttribute('aria-label', 'Play music');
    }
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    bar.style.width = ((audio.currentTime / audio.duration) * 100) + '%';
  });
  audio.addEventListener('ended', () => {
    // loop-friendly
    audio.currentTime = 0;
    audio.play();
  });

  vol.addEventListener('input', () => {
    audio.volume = parseFloat(vol.value);
  });

  // Click progress bar to seek
  const progress = document.querySelector('.player__progress');
  progress?.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const r = progress.getBoundingClientRect();
    audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
  });
})();

/* =========================================================
 *  9. BACK TO TOP
 * ========================================================= */
(function toTop() {
  const btn = document.getElementById('toTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* =========================================================
 *  10. VENUE — copy address
 * ========================================================= */
(function venue() {
  const btn   = document.getElementById('copyAddressBtn');
  const lbl   = document.getElementById('copyAddressLabel');
  const addr  = [
    'Madhu Gardens',
    'Brahman Cheruvu Road',
    'Penumantra Mandal',
    'West Godavari District',
    'Andhra Pradesh – 534238',
  ].join(', ');

  btn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(addr);
      lbl.textContent = 'Copied!';
      toast('Address copied to clipboard');
      setTimeout(() => (lbl.textContent = 'Copy Address'), 2000);
    } catch {
      toast('Could not copy — please copy manually.');
    }
  });
})();

/* =========================================================
 *  11. SHARE + COPY LINK
 * ========================================================= */
(function share() {
  const wa    = document.getElementById('whatsappShare');
  const cpy   = document.getElementById('copyLink');
  const cpyL  = document.getElementById('copyLinkLabel');

  const msg = `You're invited! 💛\n\nHari ❤ Varshini's Wedding\n21 August 2026 · 3:56 AM Muhurtham\nMadhu Gardens, West Godavari\n\n${location.href}`;

  wa?.addEventListener('click', () => {
    const url = 'https://wa.me/?text=' + encodeURIComponent(msg);
    window.open(url, '_blank', 'noopener');
  });

  cpy?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      cpyL.textContent = 'Link Copied!';
      toast('Invitation link copied');
      setTimeout(() => (cpyL.textContent = 'Copy Invitation Link'), 2000);
    } catch { toast('Could not copy the link'); }
  });
})();

/* =========================================================
 *  12. ADD TO CALENDAR + ICS DOWNLOAD
 * ========================================================= */
(function calendar() {
  const addBtn = document.getElementById('addCalendarBtn');
  const icsBtn = document.getElementById('downloadIcs');

  // Google Calendar URL
  function toGoogleTS(iso) {
    // Format: YYYYMMDDTHHmmssZ (UTC)
    return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  addBtn?.addEventListener('click', () => {
    const start = toGoogleTS(WEDDING_ISO);
    const end   = toGoogleTS(new Date(new Date(WEDDING_ISO).getTime() + 4 * 3600 * 1000).toISOString());
    const url = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent('Hari & Varshini — Wedding Muhurtham') +
      '&dates=' + start + '/' + end +
      '&details=' + encodeURIComponent('Sacred wedding of Hari & Varshini. Muhurtham at 3:56 AM.') +
      '&location=' + encodeURIComponent('Madhu Gardens, Brahman Cheruvu Road, Penumantra, West Godavari, Andhra Pradesh 534238');
    window.open(url, '_blank', 'noopener');
  });

  icsBtn?.addEventListener('click', () => {
    function fmt(iso) { return toGoogleTS(iso); }
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//HariVarshini//Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:reception-2026@harivarshini',
      'DTSTAMP:' + fmt(new Date().toISOString()),
      'DTSTART:' + fmt(RECEPTION_ISO),
      'DTEND:'   + fmt(new Date(new Date(RECEPTION_ISO).getTime() + 4*3600*1000).toISOString()),
      'SUMMARY:Hari & Varshini — Reception',
      'LOCATION:Madhu Gardens, Penumantra, West Godavari, Andhra Pradesh 534238',
      'DESCRIPTION:Reception celebration for Hari & Varshini.',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'UID:wedding-2026@harivarshini',
      'DTSTAMP:' + fmt(new Date().toISOString()),
      'DTSTART:' + fmt(WEDDING_ISO),
      'DTEND:'   + fmt(new Date(new Date(WEDDING_ISO).getTime() + 4*3600*1000).toISOString()),
      'SUMMARY:Hari & Varshini — Wedding Muhurtham',
      'LOCATION:Madhu Gardens, Penumantra, West Godavari, Andhra Pradesh 534238',
      'DESCRIPTION:Sacred wedding ceremony of Hari & Varshini.',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'HariVarshini-Wedding.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 2000);
    toast('Calendar file downloaded');
  });
})();

/* =========================================================
 *  13. RSVP FORM (Google Sheets integration)
 * ========================================================= */
(function rsvp() {
  const form   = document.getElementById('rsvpForm');
  const status = document.getElementById('rsvpStatus');
  const btn    = document.getElementById('rsvpSubmit');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.classList.remove('err');

    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    data.timestamp = new Date().toISOString();

    // Validation
    if (!data.name || !data.phone || !data.email) {
      status.classList.add('err');
      status.textContent = 'Please fill in your name, phone, and email.';
      return;
    }

    btn.disabled = true;
    status.textContent = 'Sending your blessings…';

    /* -----------------------------------------------------
     * ↓↓↓  GOOGLE SHEETS INTEGRATION  ↓↓↓
     *
     * The `GOOGLE_SHEETS_URL` constant at the top of this file
     * must point to your deployed Google Apps Script Web App.
     *
     * We use `mode: 'no-cors'` so the request works from any
     * origin (GitHub Pages / Netlify / Vercel) without a
     * preflight, at the cost of not being able to read the
     * response body — we assume success if the request itself
     * does not throw. This is the standard pattern for form-
     * to-sheet integrations.
     * ----------------------------------------------------- */
    try {
      if (GOOGLE_SHEETS_URL && GOOGLE_SHEETS_URL.startsWith('http')) {
        await fetch(GOOGLE_SHEETS_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(data),
        });
      } else {
        // Demo mode — no backend configured yet.
        await new Promise(r => setTimeout(r, 900));
        console.info('[RSVP demo mode] Submission payload:', data);
      }
      status.textContent = 'Thank You! Your RSVP has been received successfully.';
      form.reset();
    } catch (err) {
      status.classList.add('err');
      status.textContent = 'Something went wrong. Please try again.';
      console.error(err);
    } finally {
      btn.disabled = false;
    }
  });
})();

/* =========================================================
 *  14. TOAST utility
 * ========================================================= */
function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 2400);
}

/* =========================================================
 *  15. If site was already visible on load (e.g. dev refresh),
 *     ensure everything is initialised.
 * ========================================================= */
if (!document.getElementById('site')?.hidden) {
  document.addEventListener('DOMContentLoaded', () => {
    initReveal(); initPetals(); initCountdown();
  });
}
