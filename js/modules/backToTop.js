// ===============================================
// BACK TO TOP MODULE
// ===============================================

const BackToTop = (() => {
  let button = null;
  
  const init = () => {
    button = document.createElement('button');
    button.className = 'back-to-top';
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(button);
    
    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', updateVisibility, { passive: true });
  };
  
  const updateVisibility = () => {
    if (!button) return;
    
    const scrollPosition = window.pageYOffset;
    
    if (scrollPosition > 500) {
      button.classList.add('visible');
    } else {
      button.classList.remove('visible');
    }
  };
  
  return { init };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', BackToTop.init);
