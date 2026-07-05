// ===============================================
// SCROLL REVEAL MODULE - Animation on Scroll
// ===============================================

const ScrollReveal = (() => {
  const init = () => {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    if (revealElements.length === 0) return;
    
    // Use Intersection Observer for better performance
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    revealElements.forEach(el => observer.observe(el));
  };
  
  return { init };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', ScrollReveal.init);
