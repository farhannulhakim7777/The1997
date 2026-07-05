// ===============================================
// LIGHTBOX MODULE - Gallery Image Viewer
// ===============================================

const Lightbox = (() => {
  let currentLightbox = null;
  
  const init = () => {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const src = img ? img.src : null;
        if (src) open(src);
      });
    });
  };
  
  const open = (src) => {
    if (currentLightbox) close();
    
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <img src="${src}" alt="Gallery Image">
        <button class="lightbox-close" aria-label="Close">&times;</button>
      </div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    currentLightbox = lightbox;
    
    requestAnimationFrame(() => {
      lightbox.classList.add('active');
    });
    
    // Close events
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) close();
    });
    
    lightbox.querySelector('.lightbox-close').addEventListener('click', close);
    
    document.addEventListener('keydown', escHandler);
  };
  
  const close = () => {
    if (!currentLightbox) return;
    
    currentLightbox.classList.remove('active');
    document.body.style.overflow = '';
    
    setTimeout(() => {
      if (currentLightbox && currentLightbox.parentNode) {
        currentLightbox.remove();
      }
      currentLightbox = null;
    }, 300);
    
    document.removeEventListener('keydown', escHandler);
  };
  
  const escHandler = (e) => {
    if (e.key === 'Escape') close();
  };
  
  return { init, open, close };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', Lightbox.init);
