// ===============================================
// HERO ANIMATION MODULE - Ghost Text Effect
// ===============================================

const HeroAnimation = (() => {
  const init = () => {
    const ghostEl = document.querySelector('.title-line.accent');
    if (!ghostEl) return;
    
    // Set initial state
    ghostEl.style.opacity = '0';
    ghostEl.style.filter = 'blur(20px)';
    ghostEl.style.willChange = 'opacity, filter';
    
    const FADE_IN_MS = 1400;
    const HOLD_MS = 1800;
    const FADE_OUT_MS = 1000;
    const PAUSE_MS = 600;
    const BLUR_MAX = 20;
    
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const easeInCubic = (t) => t * t * t;
    
    const ghostAnimate = (duration, easing, onTick, onDone) => {
      let startTime = null;
      
      const step = (ts) => {
        if (!startTime) startTime = ts;
        const raw = Math.min((ts - startTime) / duration, 1);
        onTick(easing(raw));
        
        if (raw < 1) {
          requestAnimationFrame(step);
        } else {
          if (onDone) onDone();
        }
      };
      
      requestAnimationFrame(step);
    };
    
    const runGhostCycle = () => {
      // Phase 1 - Fade in from blur
      ghostAnimate(FADE_IN_MS, easeOutCubic, (p) => {
        ghostEl.style.opacity = p;
        ghostEl.style.filter = `blur(${(BLUR_MAX * Math.pow(1 - p, 2)).toFixed(2)}px)`;
      }, () => {
        ghostEl.style.opacity = '1';
        ghostEl.style.filter = 'blur(0px)';
        
        // Phase 2 - Hold solid
        setTimeout(() => {
          // Phase 3 - Fade out to blur
          ghostAnimate(FADE_OUT_MS, easeInCubic, (p) => {
            ghostEl.style.opacity = 1 - p;
            ghostEl.style.filter = `blur(${(BLUR_MAX * Math.pow(p, 1.8)).toFixed(2)}px)`;
          }, () => {
            ghostEl.style.opacity = '0';
            ghostEl.style.filter = `blur(${BLUR_MAX}px)`;
            
            // Phase 4 - Pause then repeat
            setTimeout(runGhostCycle, PAUSE_MS);
          });
        }, HOLD_MS);
      });
    };
    
    // Start after 400ms
    setTimeout(runGhostCycle, 400);
  };
  
  return { init };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', HeroAnimation.init);
