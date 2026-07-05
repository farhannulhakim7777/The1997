// ===============================================
// MENU SLIDER MODULE - Simple Card Slider
// ===============================================

const MenuSlider = (() => {
  let currentIndex = 0;
  let track = null;
  let slides = [];
  let dots = [];
  let prevBtn = null;
  let nextBtn = null;
  let startX = 0;
  let isDragging = false;
  
  const init = () => {
    const slider = document.querySelector('.menu-slider');
    if (!slider) return;
    
    track = slider.querySelector('.menu-slider-track');
    slides = Array.from(track.querySelectorAll('.menu-slide'));
    prevBtn = slider.querySelector('.slider-btn.prev');
    nextBtn = slider.querySelector('.slider-btn.next');
    const dotsContainer = slider.querySelector('.slider-dots');
    
    if (slides.length === 0) return;
    
    // Create dots
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = 'slider-dot';
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });
    
    // Navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    
    // Touch/Swipe support
    track.addEventListener('touchstart', handleTouchStart, { passive: true });
    track.addEventListener('touchmove', handleTouchMove, { passive: false });
    track.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Mouse drag support
    track.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyDown);
    
    // Update initial state
    updateSlider();
  };
  
  const goToSlide = (index) => {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    
    currentIndex = index;
    updateSlider();
  };
  
  const updateSlider = () => {
    const slideWidth = slides[0].offsetWidth + 32; // width + gap
    const translateX = -(currentIndex * slideWidth);
    track.style.transform = `translateX(${translateX}px)`;
    
    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
    
    // Update buttons
    if (prevBtn) prevBtn.disabled = false;
    if (nextBtn) nextBtn.disabled = false;
  };
  
  const handleTouchStart = (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  };
  
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
  };
  
  const handleTouchEnd = (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }
  };
  
  const handleMouseDown = (e) => {
    startX = e.clientX;
    isDragging = true;
    track.style.cursor = 'grabbing';
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
  };
  
  const handleMouseUp = (e) => {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = 'grab';
    
    const endX = e.clientX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      goToSlide(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      goToSlide(currentIndex + 1);
    }
  };
  
  return { init, goToSlide };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', MenuSlider.init);
