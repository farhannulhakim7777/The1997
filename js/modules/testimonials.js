// ===============================================
// TESTIMONIALS MODULE - Slider
// ===============================================

const Testimonials = (() => {
  let currentSlide = 0;
  let track = null;
  let slides = [];
  let dots = [];
  let autoPlayInterval = null;
  
  const init = () => {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;
    
    track = slider.querySelector('.testimonials-track');
    slides = Array.from(track.querySelectorAll('.testimonial-card'));
    dots = Array.from(slider.querySelectorAll('.testimonials-dot'));
    
    if (slides.length === 0) return;
    
    // Navigation buttons
    const prevBtn = slider.querySelector('.testimonials-btn.prev');
    const nextBtn = slider.querySelector('.testimonials-btn.next');
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      resetAutoPlay();
    });
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      resetAutoPlay();
    });
    
    // Dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetAutoPlay();
      });
    });
    
    // Auto play
    startAutoPlay();
    
    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
  };
  
  const goToSlide = (index) => {
    if (!track || slides.length === 0) return;
    
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    
    currentSlide = index;
    const slideWidth = slides[0].offsetWidth + 32; // width + gap
    track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    
    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  };
  
  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);
  
  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayInterval = setInterval(nextSlide, 5000);
  };
  
  const stopAutoPlay = () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  };
  
  const resetAutoPlay = () => {
    stopAutoPlay();
    startAutoPlay();
  };
  
  return { init, goToSlide, nextSlide, prevSlide };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', Testimonials.init);
