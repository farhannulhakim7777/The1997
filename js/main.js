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

window.addEventListener('load', function () {
  document.body.style.opacity = '1';
  console.log('✨ The 1997 Coffee & Space — Loaded ☕');
});


// ─── 2. SMOOTH SCROLL ────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      var navHeight = (document.querySelector('.navbar') || {}).offsetHeight || 0;
      window.scrollTo({ top: target.offsetTop - navHeight, behavior: 'smooth' });
    });
  });


  // ─── 3. NAVBAR ─────────────────────────────────────────────────────────────

  var navbar    = document.querySelector('.navbar');
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('navLinks');

  function closeMenu() {
    if (!navLinks || !hamburger) return;
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
    var spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity   = '1';
    spans[2].style.transform = 'none';
  }

  function openMenu() {
    if (!navLinks || !hamburger) return;
    navLinks.classList.add('active');
    hamburger.classList.add('active');
    var spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = 'rotate(45deg) translateY(8px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
  }

  if (navbar && hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.contains('active') ? closeMenu() : openMenu();
    });

    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) closeMenu();
    });

    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }


  // ─── 5. GALLERY LIGHTBOX ───────────────────────────────────────────────────

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
          '<button class="lightbox-close">&times;</button>' +
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
          lightbox.remove();
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


  // ─── 6. WHATSAPP FORM ──────────────────────────────────────────────────────

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
        '🌸 *Reservation Request* 🌸\n\n' +
        '*Name:* ' + name + '\n' +
        '*Phone:* ' + phone + '\n' +
        '*Date:* ' + formattedDate + '\n' +
        '*Time:* ' + time + '\n' +
        '*Special Requests:*\n' + (message || '-') + '\n\n' +
        'Thank you for choosing The 1997 Coffee & Space! ☕✨';

      var whatsappNumber = '6285117689797';
      var waUrl = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(whatsappText);

      window.open(waUrl, '_blank');
      showSuccessMessage();
      form.reset();
    });
  }


  // ─── 7. FORM ANIMATIONS ────────────────────────────────────────────────────

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


  // ─── 8. CAROUSEL ───────────────────────────────────────────────────────────

  document.querySelectorAll('.carousel-container').forEach(initCarousel);

}); // end DOMContentLoaded


// ─── 4. PARALLAX ─────────────────────────────────────────────────────────────

window.addEventListener('scroll', function () {
  var scrolled = window.pageYOffset;

  var hero = document.querySelector('.hero');
  if (hero) hero.style.backgroundPositionY = scrolled * 0.5 + 'px';

  document.querySelectorAll('.float-circle').forEach(function (circle, i) {
    circle.style.transform = 'translateY(' + (scrolled * (0.1 + i * 0.05)) + 'px)';
  });
});


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
    setTimeout(function () { msg.remove(); }, 300);
  }, 3000);
}

function createRipple(event, element) {
  var ripple = document.createElement('span');
  var rect   = element.getBoundingClientRect();
  var size   = Math.max(rect.width, rect.height);

  ripple.style.width  = ripple.style.height = size + 'px';
  ripple.style.left   = (event.clientX - rect.left - size / 2) + 'px';
  ripple.style.top    = (event.clientY - rect.top  - size / 2) + 'px';
  ripple.classList.add('ripple');

  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  element.appendChild(ripple);

  setTimeout(function () { ripple.remove(); }, 600);
}


// ===============================================
// CAROUSEL ENGINE
// Fix: deteksi arah swipe, preventDefault hanya
// saat horizontal, tidak ganggu scroll vertikal
// ===============================================

function initCarousel(container) {
  var track = container.querySelector('.carousel-track');
  if (!track) return;

  var isDragging     = false;
  var isDecided      = false;   // sudah tahu arah swipe (H atau V)?
  var isHorizontal   = false;   // arah swipe ditentukan horizontal?
  var startX         = 0;
  var startY         = 0;
  var currentX       = 0;
  var startTranslate = 0;
  var velocity       = 0;
  var lastX          = 0;
  var lastTime       = 0;
  var rafID          = null;

  // ── Helpers ──

  function maxScroll() {
    return Math.max(0, track.scrollWidth - container.clientWidth);
  }

  function clamp(val, lo, hi) {
    return Math.min(Math.max(val, lo), hi);
  }

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

  // ── Momentum ──

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

  // ── Spring back ──

  function springTo(target) {
    var STIFFNESS = 0.18;
    function tick() {
      var diff = target - currentX;
      if (Math.abs(diff) < 0.5) { applyTranslate(target); rafID = null; return; }
      applyTranslate(currentX + diff * STIFFNESS);
      rafID = requestAnimationFrame(tick);
    }
    rafID = requestAnimationFrame(tick);
  }

  // ── Drag start ──

  function onStart(x, y) {
    if (rafID) { cancelAnimationFrame(rafID); rafID = null; }

    isDragging     = true;
    isDecided      = false;
    isHorizontal   = false;
    startX         = x;
    startY         = y;
    startTranslate = currentX;
    lastX          = x;
    lastTime       = performance.now();
    velocity       = 0;

    track.classList.add('is-dragging');
  }

  // ── Drag move — deteksi arah dulu sebelum gerakkan ──

  function onMove(x, y, e) {
    if (!isDragging) return;

    var dx = x - startX;
    var dy = y - startY;

    // Tunggu minimal 5px gerak sebelum putuskan arah
    if (!isDecided) {
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
      isHorizontal = Math.abs(dx) > Math.abs(dy);
      isDecided    = true;
    }

    // Kalau swipe vertikal — lepaskan ke scroll halaman
    if (!isHorizontal) {
      isDragging = false;
      track.classList.remove('is-dragging');
      return;
    }

    // Swipe horizontal — cegah scroll halaman
    if (e && e.cancelable) e.preventDefault();

    var max  = maxScroll();
    var newX = startTranslate + dx;

    // Rubber-band di ujung
    if (newX > 0)    newX = newX * 0.22;
    if (newX < -max) newX = -max + (newX + max) * 0.22;

    applyTranslate(newX);

    // Velocity sampling
    var now = performance.now();
    var dt  = now - lastTime;
    if (dt > 0) velocity = ((x - lastX) / dt) * 14;
    lastX    = x;
    lastTime = now;
  }

  // ── Drag end ──

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

  // ── Mouse events — desktop only ──
  // Bound to track saja bukan document, cukup untuk desktop

  track.addEventListener('mousedown', function (e) {
    e.preventDefault();
    onStart(e.clientX, e.clientY);
  });

  // mousemove & mouseup ke window supaya drag tetap jalan kalau keluar track
  window.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    onMove(e.clientX, e.clientY, e);
  });

  window.addEventListener('mouseup', function () {
    if (isDragging) onEnd();
  });

  // ── Touch events — mobile ──
  // passive: false HANYA saat sudah tahu horizontal,
  // supaya bisa preventDefault dan cegah scroll halaman

  track.addEventListener('touchstart', function (e) {
    onStart(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });  // touchstart boleh passive

  track.addEventListener('touchmove', function (e) {
    if (!isDragging) return;
    onMove(e.touches[0].clientX, e.touches[0].clientY, e);
  }, { passive: false });  // HARUS non-passive agar bisa preventDefault

  track.addEventListener('touchend',    onEnd, { passive: true });
  track.addEventListener('touchcancel', onEnd, { passive: true });

  // ── Resize ──

  window.addEventListener('resize', function () {
    var max = maxScroll();
    if (currentX < -max) applyTranslate(-max);
    updateGradients();
  });

  // ── Init ──
  updateGradients();
}