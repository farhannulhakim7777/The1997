// ===============================================
// THE 1997 COFFEE & SPACE — MAIN JAVASCRIPT
// ===============================================

// ─── 1. PAGE LOAD ────────────────────────────────────────────────────────────

window.addEventListener('load', function () {
  document.body.style.opacity = '1';
  console.log('✨ The 1997 Coffee & Space — Loaded ☕');
});


// ─── DOMContentLoaded — semua logic di sini ──────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {


  // ─── 2. SMOOTH SCROLL ────────────────────────────────────────────────────

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      var navbar    = document.getElementById('navbar');
      var navHeight = navbar ? navbar.offsetHeight : 0;
      window.scrollTo({ top: target.offsetTop - navHeight, behavior: 'smooth' });

      // Tutup menu mobile setelah klik link
      closeMenu();
    });
  });


  // ─── 3. NAVBAR — HAMBURGER ───────────────────────────────────────────────

  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('navLinks');

  function openMenu() {
    if (!hamburger || !navLinks) return;
    navLinks.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    var spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = 'rotate(45deg) translateY(8px)';
    spans[1].style.opacity   = '0';
    spans[1].style.transform = 'scaleX(0)';
    spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
  }

  function closeMenu() {
    if (!hamburger || !navLinks) return;
    navLinks.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    var spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity   = '1';
    spans[1].style.transform = 'none';
    spans[2].style.transform = 'none';
  }

  if (hamburger && navLinks) {
    // Toggle saat klik hamburger
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation(); // cegah event naik ke document
      navLinks.classList.contains('active') ? closeMenu() : openMenu();
    });

    // Tutup saat klik di luar navbar
    document.addEventListener('click', function (e) {
      var navbar = document.getElementById('navbar');
      if (navbar && !navbar.contains(e.target)) {
        closeMenu();
      }
    });

    // Tutup saat tekan Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }


  // ─── 4. GHOST REVEAL — Coffee & Space ───────────────────────────────────
  // Semua logic di sini karena perlu DOM sudah siap

  var ghostEl = document.querySelector('.title-line.accent');

  if (ghostEl) {
    // Set initial state via JS — tidak perlu di CSS
    ghostEl.style.opacity = '0';
    ghostEl.style.filter  = 'blur(20px)';
    ghostEl.style.willChange = 'opacity, filter';

    var FADE_IN_MS  = 1400;
    var HOLD_MS     = 1800;
    var FADE_OUT_MS = 1000;
    var PAUSE_MS    = 600;
    var BLUR_MAX    = 20;

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
    function easeInCubic(t)  { return t * t * t; }

    function ghostAnimate(duration, easing, onTick, onDone) {
      var startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var raw = Math.min((ts - startTime) / duration, 1);
        onTick(easing(raw));
        if (raw < 1) {
          requestAnimationFrame(step);
        } else {
          if (onDone) onDone();
        }
      }
      requestAnimationFrame(step);
    }

    function runGhostCycle() {
      // FASE 1 — muncul dari kabur
      ghostAnimate(FADE_IN_MS, easeOutCubic, function (p) {
        ghostEl.style.opacity = p;
        ghostEl.style.filter  = 'blur(' + (BLUR_MAX * Math.pow(1 - p, 2)).toFixed(2) + 'px)';
      }, function () {
        ghostEl.style.opacity = '1';
        ghostEl.style.filter  = 'blur(0px)';

        // FASE 2 — diam solid
        setTimeout(function () {

          // FASE 3 — menghilang ke kabur
          ghostAnimate(FADE_OUT_MS, easeInCubic, function (p) {
            ghostEl.style.opacity = 1 - p;
            ghostEl.style.filter  = 'blur(' + (BLUR_MAX * Math.pow(p, 1.8)).toFixed(2) + 'px)';
          }, function () {
            ghostEl.style.opacity = '0';
            ghostEl.style.filter  = 'blur(' + BLUR_MAX + 'px)';

            // FASE 4 — jeda lalu ulang
            setTimeout(runGhostCycle, PAUSE_MS);
          });

        }, HOLD_MS);
      });
    }

    // Mulai setelah 400ms supaya halaman sudah render
    setTimeout(runGhostCycle, 400);
  }


  // ─── 5. GALLERY LIGHTBOX ─────────────────────────────────────────────────

  document.querySelectorAll('.gallery-item').forEach(function (item) {
    item.addEventListener('click', function () {
      var img = this.querySelector('img');
      var src = img ? img.src : null;
      if (!src) return;

      var lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML =
        '<div class="lightbox-content">' +
          '<img src="' + src + '" alt="Gallery Image">' +
          '<button class="lightbox-close" aria-label="Tutup">&times;</button>' +
        '</div>';

      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(function () {
        lightbox.style.opacity = '1';
        lightbox.querySelector('.lightbox-content').style.transform = 'scale(1)';
      });

      function closeLightbox() {
        lightbox.style.opacity = '0';
        lightbox.querySelector('.lightbox-content').style.transform = 'scale(0.9)';
        setTimeout(function () {
          if (lightbox.parentNode) lightbox.remove();
          document.body.style.overflow = '';
        }, 300);
      }

      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
      });

      lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);

      document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
          closeLightbox();
          document.removeEventListener('keydown', escHandler);
        }
      });
    });
  });


  // ─── 6. WHATSAPP FORM ────────────────────────────────────────────────────

  var form = document.getElementById('whatsappForm');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name    = document.getElementById('name').value.trim();
      var phone   = document.getElementById('phone').value.trim();
      var date    = document.getElementById('date').value;
      var time    = document.getElementById('time').value;
      var message = document.getElementById('message').value.trim();

      if (!name || !phone || !date || !time) {
        alert('Lengkapi semua data terlebih dahulu');
        return;
      }

      var formattedDate = new Date(date).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      });

      var whatsappText =
        '\uD83C\uDF38 *Reservation Request* \uD83C\uDF38\n\n' +
        '*Name:* ' + name + '\n' +
        '*Phone:* ' + phone + '\n' +
        '*Date:* ' + formattedDate + '\n' +
        '*Time:* ' + time + '\n' +
        '*Special Requests:*\n' + (message || '-') + '\n\n' +
        'Thank you for choosing The 1997 Coffee & Space! \u2615\u2728';

      var waUrl = 'https://wa.me/6285117689797?text=' + encodeURIComponent(whatsappText);
      window.open(waUrl, '_blank');
      showSuccessMessage();
      form.reset();
    });
  }


  // ─── 7. FORM INPUT ANIMATIONS ────────────────────────────────────────────

  document.querySelectorAll('.contact-form input, .contact-form textarea').forEach(function (input) {
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


  // ─── 8. CAROUSEL ─────────────────────────────────────────────────────────

  document.querySelectorAll('.carousel-container').forEach(initCarousel);


}); // end DOMContentLoaded


// ─── PARALLAX (scroll event — di luar DOMContentLoaded) ──────────────────────

window.addEventListener('scroll', function () {
  var scrolled = window.pageYOffset;

  document.querySelectorAll('.float-circle').forEach(function (circle, i) {
    circle.style.transform = 'translateY(' + (scrolled * (0.08 + i * 0.04)) + 'px)';
  });
}, { passive: true });


// ===============================================
// HELPER FUNCTIONS
// ===============================================

function showSuccessMessage() {
  var msg = document.createElement('div');
  msg.className = 'success-message';
  msg.innerHTML = '<i class="fas fa-check-circle"></i><p>Redirecting to WhatsApp...</p>';
  document.body.appendChild(msg);

  requestAnimationFrame(function () {
    msg.style.opacity   = '1';
    msg.style.transform = 'translateY(0)';
  });

  setTimeout(function () {
    msg.style.opacity   = '0';
    msg.style.transform = 'translateY(-20px)';
    setTimeout(function () { if (msg.parentNode) msg.remove(); }, 300);
  }, 3000);
}

function createRipple(event, element) {
  var ripple = document.createElement('span');
  var rect   = element.getBoundingClientRect();
  var size   = Math.max(rect.width, rect.height);

  ripple.style.cssText =
    'position:absolute;border-radius:50%;' +
    'background:rgba(255,182,217,0.4);' +
    'transform:scale(0);' +
    'animation:ripple-animation 0.6s ease-out;' +
    'pointer-events:none;' +
    'width:' + size + 'px;height:' + size + 'px;' +
    'left:' + (event.clientX - rect.left - size / 2) + 'px;' +
    'top:' + (event.clientY - rect.top  - size / 2) + 'px;';

  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  element.appendChild(ripple);
  setTimeout(function () { if (ripple.parentNode) ripple.remove(); }, 600);
}


// ===============================================
// CAROUSEL ENGINE
// — deteksi arah swipe sebelum bergerak
// — preventDefault hanya saat swipe horizontal
// — tidak ganggu scroll vertikal halaman
// ===============================================

function initCarousel(container) {
  var track = container.querySelector('.carousel-track');
  if (!track) return;

  var isDragging   = false;
  var isDecided    = false;
  var isHorizontal = false;
  var startX       = 0;
  var startY       = 0;
  var currentX     = 0;
  var startTX      = 0;
  var velocity     = 0;
  var lastX        = 0;
  var lastTime     = 0;
  var rafID        = null;

  function maxScroll() {
    return Math.max(0, track.scrollWidth - container.clientWidth);
  }

  function clamp(v, lo, hi) { return Math.min(Math.max(v, lo), hi); }

  function applyTranslate(x) {
    currentX = x;
    track.style.transform = 'translateX(' + x + 'px)';
    updateGradients();
  }

  function updateGradients() {
    var max = maxScroll();
    container.classList.toggle('can-scroll-left',  currentX < -4);
    container.classList.toggle('can-scroll-right', currentX > -(max - 4) && max > 0);
  }

  function momentumTick() {
    if (Math.abs(velocity) < 0.2) {
      var max = maxScroll();
      if (currentX > 0)    applyTranslate(0);
      if (currentX < -max) applyTranslate(-max);
      rafID = null;
      return;
    }
    var max  = maxScroll();
    var newX = currentX + velocity;
    velocity *= 0.90;
    if (newX > 0)    { newX = 0;    velocity = 0; }
    if (newX < -max) { newX = -max; velocity = 0; }
    applyTranslate(newX);
    rafID = requestAnimationFrame(momentumTick);
  }

  function springTo(target) {
    function tick() {
      var diff = target - currentX;
      if (Math.abs(diff) < 0.5) { applyTranslate(target); rafID = null; return; }
      applyTranslate(currentX + diff * 0.18);
      rafID = requestAnimationFrame(tick);
    }
    rafID = requestAnimationFrame(tick);
  }

  function onStart(x, y) {
    if (rafID) { cancelAnimationFrame(rafID); rafID = null; }
    isDragging   = true;
    isDecided    = false;
    isHorizontal = false;
    startX       = x;
    startY       = y;
    startTX      = currentX;
    lastX        = x;
    lastTime     = performance.now();
    velocity     = 0;
    track.classList.add('is-dragging');
  }

  function onMove(x, y, e) {
    if (!isDragging) return;

    var dx = x - startX;
    var dy = y - startY;

    if (!isDecided) {
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
      isHorizontal = Math.abs(dx) > Math.abs(dy);
      isDecided    = true;
    }

    // Swipe vertikal → lepas ke halaman
    if (!isHorizontal) {
      isDragging = false;
      track.classList.remove('is-dragging');
      return;
    }

    // Swipe horizontal → cegah scroll halaman
    if (e && e.cancelable) e.preventDefault();

    var max  = maxScroll();
    var newX = startTX + dx;
    if (newX > 0)    newX = newX * 0.22;
    if (newX < -max) newX = -max + (newX + max) * 0.22;
    applyTranslate(newX);

    var now = performance.now();
    var dt  = now - lastTime;
    if (dt > 0) velocity = ((x - lastX) / dt) * 14;
    lastX    = x;
    lastTime = now;
  }

  function onEnd() {
    if (!isDragging) return;
    isDragging = false;
    isDecided  = false;
    track.classList.remove('is-dragging');

    var max = maxScroll();
    if (currentX > 0 || currentX < -max) {
      springTo(clamp(currentX, -max, 0));
    } else {
      rafID = requestAnimationFrame(momentumTick);
    }
  }

  // Mouse — desktop
  track.addEventListener('mousedown', function (e) {
    e.preventDefault();
    onStart(e.clientX, e.clientY);
  });

  window.addEventListener('mousemove', function (e) {
    if (isDragging) onMove(e.clientX, e.clientY, e);
  });

  window.addEventListener('mouseup', function () {
    if (isDragging) onEnd();
  });

  // Touch — mobile
  track.addEventListener('touchstart', function (e) {
    onStart(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  track.addEventListener('touchmove', function (e) {
    if (!isDragging) return;
    onMove(e.touches[0].clientX, e.touches[0].clientY, e);
  }, { passive: false }); // non-passive agar bisa preventDefault

  track.addEventListener('touchend',    onEnd, { passive: true });
  track.addEventListener('touchcancel', onEnd, { passive: true });

  window.addEventListener('resize', function () {
    var max = maxScroll();
    if (currentX < -max) applyTranslate(-max);
    updateGradients();
  }, { passive: true });

  updateGradients();
}