// ===============================================
// CAROUSEL MODULE - Touch-enabled Carousel
// ===============================================

const Carousel = (() => {
  const initCarousel = (container) => {
    const track = container.querySelector('.carousel-track');
    if (!track) return;
    
    let isDragging = false;
    let isDecided = false;
    let isHorizontal = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let startTX = 0;
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;
    let rafID = null;
    
    const maxScroll = () => Math.max(0, track.scrollWidth - container.clientWidth);
    const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
    
    const applyTranslate = (x) => {
      currentX = x;
      track.style.transform = `translateX(${x}px)`;
      updateGradients();
    };
    
    const updateGradients = () => {
      const max = maxScroll();
      container.classList.toggle('can-scroll-left', currentX < -4);
      container.classList.toggle('can-scroll-right', currentX > -(max - 4) && max > 0);
    };
    
    const momentumTick = () => {
      if (Math.abs(velocity) < 0.2) {
        const max = maxScroll();
        if (currentX > 0) applyTranslate(0);
        if (currentX < -max) applyTranslate(-max);
        rafID = null;
        return;
      }
      const max = maxScroll();
      const newX = currentX + velocity;
      velocity *= 0.90;
      if (newX > 0) { newX = 0; velocity = 0; }
      if (newX < -max) { newX = -max; velocity = 0; }
      applyTranslate(newX);
      rafID = requestAnimationFrame(momentumTick);
    };
    
    const springTo = (target) => {
      const tick = () => {
        const diff = target - currentX;
        if (Math.abs(diff) < 0.5) { applyTranslate(target); rafID = null; return; }
        applyTranslate(currentX + diff * 0.18);
        rafID = requestAnimationFrame(tick);
      };
      rafID = requestAnimationFrame(tick);
    };
    
    const onStart = (x, y) => {
      if (rafID) { cancelAnimationFrame(rafID); rafID = null; }
      isDragging = true;
      isDecided = false;
      isHorizontal = false;
      startX = x;
      startY = y;
      startTX = currentX;
      lastX = x;
      lastTime = performance.now();
      velocity = 0;
      track.classList.add('is-dragging');
    };
    
    const onMove = (x, y, e) => {
      if (!isDragging) return;
      
      const dx = x - startX;
      const dy = y - startY;
      
      if (!isDecided) {
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
        isHorizontal = Math.abs(dx) > Math.abs(dy);
        isDecided = true;
      }
      
      if (!isHorizontal) {
        isDragging = false;
        track.classList.remove('is-dragging');
        return;
      }
      
      if (e && e.cancelable) e.preventDefault();
      e.stopPropagation();
      
      const max = maxScroll();
      const newX = startTX + dx;
      if (newX > 0) newX = newX * 0.22;
      if (newX < -max) newX = -max + (newX + max) * 0.22;
      applyTranslate(newX);
      
      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 0) velocity = ((x - lastX) / dt) * 14;
      lastX = x;
      lastTime = now;
    };
    
    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      isDecided = false;
      track.classList.remove('is-dragging');
      
      const max = maxScroll();
      if (currentX > 0 || currentX < -max) {
        springTo(clamp(currentX, -max, 0));
      } else {
        rafID = requestAnimationFrame(momentumTick);
      }
    };
    
    // Mouse events
    track.addEventListener('mousedown', (e) => {
      e.preventDefault();
      onStart(e.clientX, e.clientY);
    });
    
    window.addEventListener('mousemove', (e) => {
      if (isDragging) onMove(e.clientX, e.clientY, e);
    });
    
    window.addEventListener('mouseup', () => {
      if (isDragging) onEnd();
    });
    
    // Touch events
    track.addEventListener('touchstart', (e) => {
      onStart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    
    track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      onMove(e.touches[0].clientX, e.touches[0].clientY, e);
    }, { passive: false });
    
    track.addEventListener('touchend', onEnd, { passive: true });
    track.addEventListener('touchcancel', onEnd, { passive: true });
    
    // Resize
    window.addEventListener('resize', () => {
      const max = maxScroll();
      if (currentX < -max) applyTranslate(-max);
      updateGradients();
    }, { passive: true });

    updateGradients();
  };

  const init = () => {
    // Re-initialize on resize to handle desktop/mobile switching
    const handleResize = () => {
      const carouselContainer = document.querySelector('.carousel-container');
      if (carouselContainer) {
        const isVisible = window.getComputedStyle(carouselContainer).display !== 'none';
        if (isVisible) {
          document.querySelectorAll('.carousel-container').forEach(initCarousel);
        }
      }
    };

    // Initial init
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
  };

  return { init };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', Carousel.init);
