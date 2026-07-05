// ===============================================
// FORM MODULE - WhatsApp Form & Validation
// ===============================================

const FormManager = (() => {
  const init = () => {
    const form = document.getElementById('whatsappForm');
    if (!form) return;
    
    form.addEventListener('submit', handleSubmit);
    
    // Input animations
    form.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        if (!input.value) {
          input.parentElement.classList.remove('focused');
        }
      });
      
      input.addEventListener('click', (e) => {
        createRipple(e, input);
      });
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const form = e.target;
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const message = document.getElementById('message').value.trim();
    
    if (!name || !phone || !date || !time) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }
    
    const formattedDate = new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    const whatsappText = `
🌸 *Reservation Request* 🌸

*Name:* ${name}
*Phone:* ${phone}
*Date:* ${formattedDate}
*Time:* ${time}
*Special Requests:*
${message || '-'}

Thank you for choosing The 1997 Coffee & Space! ☕✨
    `.trim();
    
    const waUrl = `https://wa.me/6285117689797?text=${encodeURIComponent(whatsappText)}`;
    window.open(waUrl, '_blank');
    
    showSuccessMessage();
    form.reset();
  };
  
  const showSuccessMessage = () => {
    const msg = document.createElement('div');
    msg.className = 'success-message';
    msg.innerHTML = '<i class="fas fa-check-circle"></i><p>Redirecting to WhatsApp...</p>';
    document.body.appendChild(msg);
    
    requestAnimationFrame(() => {
      msg.classList.add('active');
    });
    
    setTimeout(() => {
      msg.classList.remove('active');
      setTimeout(() => {
        if (msg.parentNode) msg.remove();
      }, 300);
    }, 3000);
  };
  
  const showNotification = (text, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<p>${text}</p>`;
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
      notification.classList.add('active');
    });
    
    setTimeout(() => {
      notification.classList.remove('active');
      setTimeout(() => {
        if (notification.parentNode) notification.remove();
      }, 300);
    }, 3000);
  };
  
  const createRipple = (event, element) => {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 182, 217, 0.4);
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
      pointer-events: none;
      width: ${size}px;
      height: ${size}px;
      left: ${event.clientX - rect.left - size / 2}px;
      top: ${event.clientY - rect.top - size / 2}px;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) ripple.remove();
    }, 600);
  };
  
  return { init };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', FormManager.init);
