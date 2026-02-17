// ===============================================
// THE 1997 COFFEE & SPACE — MAIN JAVASCRIPT
// Sections:
//  1. Page Load
//  2. Smooth Scroll
//  3. Navbar (mobile menu + hamburger)
//  4. Parallax
//  5. Gallery Lightbox
//  6. WhatsApp Form
//  7. Form Animations (focus / ripple)
//  8. Carousel (swipeable, momentum, spring)
// ===============================================


// ─── 1. PAGE LOAD ────────────────────────────────────────────────────────────

window.addEventListener('load', () => {
  document.body.style.opacity = '1';
  console.log('✨ The 1997 Coffee & Space — Loaded ☕');
});


// ─── 2. SMOOTH SCROLL ────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      const navHeight = document.querySelector('.navbar')?.offsetHeight ?? 0;
      window.scrollTo({ top: target.offsetTop - navHeight, behavior: 'smooth' });
    });
  });


  // ─── 3. NAVBAR ─────────────────────────────────────────────────────────────

  const navbar    = document.querySelector('.navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  function closeMenu() {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity   = '1';
    spans[2].style.transform = 'none';
  }

  function openMenu() {
    navLinks.classList.add('active');
    hamburger.classList.add('active');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = 'rotate(45deg) translateY(8px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
  }

  if (navbar && hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.contains('active') ? closeMenu() : openMenu();
    });

    // Close when clicking outside
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        closeMenu();
      }
    });

    // Close when a nav link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }


  // ─── 5. GALLERY LIGHTBOX ───────────────────────────────────────────────────

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function () {
      const src = this.querySelector('img')?.src;
      if (!src) return;

      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <img src="${src}" alt="Gallery Image">
          <button class="lightbox-close">&times;</button>
        </div>
      `;

      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';

      // Animate in
      requestAnimationFrame(() => {
        lightbox.style.opacity = '1';
        lightbox.querySelector('.lightbox-content').style.transform = 'scale(1)';
      });

      function closeLightbox() {
        lightbox.style.opacity = '0';
        lightbox.querySelector('.lightbox-content').style.transform = 'scale(0.9)';
        setTimeout(() => {
          lightbox.remove();
          document.body.style.overflow = '';
        }, 300);
      }

      lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
      lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);

      document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
          closeLightbox();
          document.removeEventListener('keydown', escHandler);
        }
      });
    });
  });


  // ─── 6. WHATSAPP FORM ──────────────────────────────────────────────────────

  const form = document.getElementById('whatsappForm');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const name    = document.getElementById('name').value.trim();
      const phone   = document.getElementById('phone').value.trim();
      const date    = document.getElementById('date').value;
      const time    = document.getElementById('time').value;
      const message = document.getElementById('message').value.trim();

      if (!name || !phone || !date || !time) {
        alert('Lengkapi semua data terlebih dahulu');
        return;
      }

      const formattedDate = new Date(date).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      });

      const whatsappText =
`🌸 *Reservation Request* 🌸

*Name:* ${name}
*Phone:* ${phone}
*Date:* ${formattedDate}
*Time:* ${time}
*Special Requests:*
${message || '-'}

Thank you for choosing The 1997 Coffee & Space! ☕✨`;

      const whatsappNumber = '6285117689797';
      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

      window.open(waUrl, '_blank');
      showSuccessMessage();
      form.reset();
    });
  }


  // ─── 7. FORM ANIMATIONS ────────────────────────────────────────────────────

  document.querySelectorAll('.contact-form input, .contact-form textarea').forEach(input => {
    input.addEventListener('focus', function () {
      this.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', function () {
      if (!this.value) this.parentElement.classList.remove('focused');
    });

    input.addEventListener('click', function (e) {
      createRipple(e, this);
    });
  });


  // ─── 8. CAROUSEL ───────────────────────────────────────────────────────────

  document.querySelectorAll('.carousel-container').forEach(initCarousel);

}); // end DOMContentLoaded


// ─── 4. PARALLAX (outside DOMContentLoaded — fires on scroll) ────────────────

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;

  const hero = document.querySelector('.hero');
  if (hero) hero.style.backgroundPositionY = scrolled * 0.5 + 'px';

  document.querySelectorAll('.float-circle').forEach((circle, i) => {
    circle.style.transform = `translateY(${scrolled * (0.1 + i * 0.05)}px)`;
  });
});


// ===============================================
// HELPER FUNCTIONS
// ===============================================

/** Show a brief success toast */
function showSuccessMessage() {
  const msg = document.createElement('div');
  msg.className = 'success-message';
  msg.innerHTML = `<i class="fas fa-check-circle"></i><p>Redirecting to WhatsApp...</p>`;
  document.body.appendChild(msg);

  requestAnimationFrame(() => {
    msg.style.opacity   = '1';
    msg.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    msg.style.opacity   = '0';
    msg.style.transform = 'translateY(-20px)';
    setTimeout(() => msg.remove(), 300);
  }, 3000);
}

/** Ink-ripple effect on form inputs */
function createRipple(event, element) {
  const ripple = document.createElement('span');
  const rect   = element.getBoundingClientRect();
  const size   = Math.max(rect.width, rect.height);

  ripple.style.width  = ripple.style.height = size + 'px';
  ripple.style.left   = (event.clientX - rect.left - size / 2) + 'px';
  ripple.style.top    = (event.clientY - rect.top  - size / 2) + 'px';
  ripple.classList.add('ripple');

  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  element.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
}


// ===============================================
// CAROUSEL ENGINE
// ===============================================

function initCarousel(container) {
  const track = container.querySelector('.carousel-track');
  if (!track) return;

  let isDragging     = false;
  let startX         = 0;
  let currentX       = 0;   // current translateX (px)
  let startTranslate = 0;   // translateX at drag start
  let velocity       = 0;
  let lastX          = 0;
  let lastTime       = 0;
  let rafID          = null;

  /* ── Helpers ── */

  function maxScroll() {
    return Math.max(0, track.scrollWidth - container.clientWidth);
  }

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function applyTranslate(x) {
    currentX = x;
    track.style.transform = 'translateX(' + x + 'px)';
    updateGradients();
  }

  function updateGradients() {
    const max = maxScroll();
    container.classList.toggle('can-scroll-left',  currentX < -4);
    container.classList.toggle('can-scroll-right', currentX > -(max - 4) && max > 0);
  }

  /* ── Momentum loop ── */

  function momentumTick() {
    if (Math.abs(velocity) < 0.2) {
      // Snap to edge if slightly out of bounds
      const max = maxScroll();
      if (currentX > 0)    applyTranslate(0);
      if (currentX < -max) applyTranslate(-max);
      rafID = null;
      return;
    }

    const max = maxScroll();
    let newX  = currentX + velocity;
    velocity *= 0.90; // friction (0.88 = heavy, 0.94 = floaty)

    // Hard stops at edges
    if (newX > 0)    { newX = 0;    velocity = 0; }
    if (newX < -max) { newX = -max; velocity = 0; }

    applyTranslate(newX);
    rafID = requestAnimationFrame(momentumTick);
  }

  /* ── Spring-back for rubber-band release ── */

  function springTo(target) {
    const STIFFNESS = 0.18;

    function tick() {
      const diff = target - currentX;
      if (Math.abs(diff) < 0.5) { applyTranslate(target); rafID = null; return; }
      applyTranslate(currentX + diff * STIFFNESS);
      rafID = requestAnimationFrame(tick);
    }

    rafID = requestAnimationFrame(tick);
  }

  /* ── Drag start ── */

  function onStart(clientX) {
    if (rafID) { cancelAnimationFrame(rafID); rafID = null; }

    isDragging     = true;
    startX         = clientX;
    startTranslate = currentX;
    lastX          = clientX;
    lastTime       = performance.now();
    velocity       = 0;

    track.classList.add('is-dragging');
  }

  /* ── Drag move ── */

  function onMove(clientX) {
    if (!isDragging) return;

    const delta = clientX - startX;
    const max   = maxScroll();
    let newX    = startTranslate + delta;

    // Rubber-band resistance at edges
    if (newX > 0)    newX = newX * 0.22;
    if (newX < -max) newX = -max + (newX + max) * 0.22;

    applyTranslate(newX);

    // Velocity sampling
    const now = performance.now();
    const dt  = now - lastTime;
    if (dt > 0) velocity = ((clientX - lastX) / dt) * 14;
    lastX    = clientX;
    lastTime = now;
  }

  /* ── Drag end ── */

  function onEnd() {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('is-dragging');

    const max = maxScroll();

    if (currentX > 0 || currentX < -max) {
      springTo(clamp(currentX, -max, 0));
    } else {
      rafID = requestAnimationFrame(momentumTick);
    }
  }

  /* ── Mouse events (bound on document so drag survives leaving the track) ── */

  track.addEventListener('mousedown', function (e) {
    e.preventDefault();
    onStart(e.clientX);
  });

  document.addEventListener('mousemove', function (e) {
    if (isDragging) onMove(e.clientX);
  });

  document.addEventListener('mouseup', function () {
    if (isDragging) onEnd();
  });

  /* ── Touch events ── */

  track.addEventListener('touchstart', function (e) {
    onStart(e.touches[0].clientX);
  }, { passive: true });

  track.addEventListener('touchmove', function (e) {
    if (isDragging) onMove(e.touches[0].clientX);
  }, { passive: true });

  track.addEventListener('touchend',    onEnd, { passive: true });
  track.addEventListener('touchcancel', onEnd, { passive: true });

  /* ── Resize guard ── */

  window.addEventListener('resize', function () {
    const max = maxScroll();
    if (currentX < -max) applyTranslate(-max);
    updateGradients();
  });

  /* ── Init ── */
  updateGradients();
}


// Ghost reveal — Coffee & Space
(function () {
  const el = document.querySelector('.title-line.accent');
  if (!el) return;

  const FADE_IN_MS  = 1400;
  const HOLD_MS     = 1800;
  const FADE_OUT_MS = 1000;
  const PAUSE_MS    = 600;
  const BLUR_MAX    = 20;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInCubic(t)  { return t * t * t; }

  function animate(duration, easing, onTick, onDone) {
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var raw = Math.min((ts - startTime) / duration, 1);
      onTick(easing(raw));
      if (raw < 1) requestAnimationFrame(step);
      else if (onDone) onDone();
    }
    requestAnimationFrame(step);
  }

  function runCycle() {
    animate(FADE_IN_MS, easeOutCubic, function (p) {
      el.style.opacity = p;
      el.style.filter  = 'blur(' + (BLUR_MAX * Math.pow(1 - p, 2)).toFixed(2) + 'px)';
    }, function () {
      el.style.opacity = 1;
      el.style.filter  = 'blur(0px)';
      setTimeout(function () {
        animate(FADE_OUT_MS, easeInCubic, function (p) {
          el.style.opacity = 1 - p;
          el.style.filter  = 'blur(' + (BLUR_MAX * Math.pow(p, 1.8)).toFixed(2) + 'px)';
        }, function () {
          el.style.opacity = 0;
          el.style.filter  = 'blur(' + BLUR_MAX + 'px)';
          setTimeout(runCycle, PAUSE_MS);
        });
      }, HOLD_MS);
    });
  }

  setTimeout(runCycle, 400);
})();