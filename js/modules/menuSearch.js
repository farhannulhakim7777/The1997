// ===============================================
// MENU SEARCH MODULE - Filter & Search
// ===============================================

const MenuSearch = (() => {
  const init = () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Filter buttons
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category || 'all';
        
        // Update active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter menu
        filterMenu(category);
      });
    });
  };
  
  const filterMenu = (category) => {
    const slides = document.querySelectorAll('.menu-slide');
    
    slides.forEach(slide => {
      const slideCategory = slide.dataset.category || 'all';
      const matchesCategory = category === 'all' || slideCategory.includes(category);
      
      if (matchesCategory) {
        slide.style.display = '';
        slide.style.opacity = '1';
      } else {
        slide.style.display = 'none';
        slide.style.opacity = '0';
      }
    });
    
    // Reset slider position
    const menuSlider = window.MenuSlider;
    if (menuSlider) {
      menuSlider.goToSlide(0);
    }
  };
  
  return { init };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', MenuSearch.init);
