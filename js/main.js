// ===============================================
// THE 1997 COFFEE & SPACE - ENHANCED JAVASCRIPT
// ===============================================

document.addEventListener('DOMContentLoaded', () => {

  // ================= SMOOTH SCROLL =================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute('href'))
      if (target) {
        const navHeight = document.querySelector('.navbar').offsetHeight
        const targetPosition = target.offsetTop - navHeight

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        })
      }
    })
  })

  // ================= NAVBAR BEHAVIOR =================
  const navbar = document.querySelector('.navbar')
  const hamburger = document.getElementById('hamburger')
  const navLinks = document.getElementById('navLinks')

  if (navbar && hamburger && navLinks) {
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active')
      hamburger.classList.toggle('active')

      // Animate hamburger
      const spans = hamburger.querySelectorAll('span')
      if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(8px)'
        spans[1].style.opacity = '0'
        spans[2].style.transform = 'rotate(-45deg) translateY(-8px)'
      } else {
        spans[0].style.transform = 'none'
        spans[1].style.opacity = '1'
        spans[2].style.transform = 'none'
      }
    })

    // Close menu when clicking outside
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active')
        hamburger.classList.remove('active')

        const spans = hamburger.querySelectorAll('span')
        spans[0].style.transform = 'none'
        spans[1].style.opacity = '1'
        spans[2].style.transform = 'none'
      }
    })

    // Close menu when link clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active')
        hamburger.classList.remove('active')

        const spans = hamburger.querySelectorAll('span')
        spans[0].style.transform = 'none'
        spans[1].style.opacity = '1'
        spans[2].style.transform = 'none'
      })
    })
  }

  // ================= GALLERY LIGHTBOX EFFECT =================
  const galleryItems = document.querySelectorAll('.gallery-item')

  galleryItems.forEach(item => {
    item.addEventListener('click', function () {
      const img = this.querySelector('img')
      const src = img.src

      // Create lightbox
      const lightbox = document.createElement('div')
      lightbox.className = 'lightbox'
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <img src="${src}" alt="Gallery Image">
          <button class="lightbox-close">&times;</button>
        </div>
      `

      document.body.appendChild(lightbox)
      document.body.style.overflow = 'hidden'

      // Animate in
      setTimeout(() => {
        lightbox.style.opacity = '1'
        lightbox.querySelector('.lightbox-content').style.transform = 'scale(1)'
      }, 10)

      // Close lightbox
      function closeLightbox () {
        lightbox.style.opacity = '0'
        lightbox.querySelector('.lightbox-content').style.transform = 'scale(0.9)'
        setTimeout(() => {
          lightbox.remove()
          document.body.style.overflow = ''
        }, 300)
      }

      lightbox.addEventListener('click', e => {
        if (e.target === lightbox) {
          closeLightbox()
        }
      })

      lightbox
        .querySelector('.lightbox-close')
        .addEventListener('click', closeLightbox)

      // Close with ESC key
      document.addEventListener('keydown', function escHandler (e) {
        if (e.key === 'Escape') {
          closeLightbox()
          document.removeEventListener('keydown', escHandler)
        }
      })
    })
  })

  // ================= WHATSAPP FORM =================
  const form = document.getElementById('whatsappForm')
  
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault()

      const name = document.getElementById('name').value.trim()
      const phone = document.getElementById('phone').value.trim()
      const date = document.getElementById('date').value
      const time = document.getElementById('time').value
      const message = document.getElementById('message').value.trim()

      if (!name || !phone || !date || !time) {
        alert('Lengkapi semua data terlebih dahulu')
        return
      }

      const formattedDate = new Date(date).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })

      const whatsappText = `🌸 *Reservation Request* 🌸

*Name:* ${name}
*Phone:* ${phone}
*Date:* ${formattedDate}
*Time:* ${time}
*Special Requests:*
${message || '-'}

Thank you for choosing The 1997 Coffee & Space! ☕✨`

      const whatsappNumber = '6285117689797'
      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`

      // Open WhatsApp
      window.open(waUrl, '_blank')

      // Show success message
      showSuccessMessage()
      
      // Reset form
      form.reset()
    })
  }

  // ================= FORM INPUT ANIMATIONS =================
  const formInputs = document.querySelectorAll(
    '.contact-form input, .contact-form textarea'
  )

  formInputs.forEach(input => {
    // Add floating label effect
    input.addEventListener('focus', function () {
      this.parentElement.classList.add('focused')
    })

    input.addEventListener('blur', function () {
      if (!this.value) {
        this.parentElement.classList.remove('focused')
      }
    })

    // Add ripple effect on click
    input.addEventListener('click', function (e) {
      createRipple(e, this)
    })
  })

}) // End of DOMContentLoaded

// ================= HELPER FUNCTIONS (Outside DOMContentLoaded) =================

// Success message animation
function showSuccessMessage () {
  const successMsg = document.createElement('div')
  successMsg.className = 'success-message'
  successMsg.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <p>Redirecting to WhatsApp...</p>
  `

  document.body.appendChild(successMsg)

  setTimeout(() => {
    successMsg.style.opacity = '1'
    successMsg.style.transform = 'translateY(0)'
  }, 10)

  setTimeout(() => {
    successMsg.style.opacity = '0'
    successMsg.style.transform = 'translateY(-20px)'
    setTimeout(() => successMsg.remove(), 300)
  }, 3000)
}

// Ripple effect function
function createRipple (event, element) {
  const ripple = document.createElement('span')
  const rect = element.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  ripple.style.width = ripple.style.height = size + 'px'
  ripple.style.left = x + 'px'
  ripple.style.top = y + 'px'
  ripple.classList.add('ripple')

  element.style.position = 'relative'
  element.style.overflow = 'hidden'
  element.appendChild(ripple)

  setTimeout(() => ripple.remove(), 600)
}

// ================= PARALLAX EFFECT =================
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset

  // Parallax for hero
  const hero = document.querySelector('.hero')
  if (hero) {
    hero.style.backgroundPositionY = scrolled * 0.5 + 'px'
  }

  // Parallax for floating circles
  const circles = document.querySelectorAll('.float-circle')
  circles.forEach((circle, index) => {
    const speed = 0.1 + index * 0.05
    circle.style.transform = `translateY(${scrolled * speed}px)`
  })
})

// ================= ADD DYNAMIC STYLES =================
// Add lightbox styles dynamically
const lightboxStyles = document.createElement('style')
lightboxStyles.textContent = `
  .lightbox {
    position: fixed;
    inset: 0;
    background: rgba(45, 52, 54, 0.95);
    backdrop-filter: blur(10px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    cursor: zoom-out;
  }
  
  .lightbox-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
    transform: scale(0.9);
    transition: transform 0.3s ease;
  }
  
  .lightbox-content img {
    max-width: 100%;
    max-height: 90vh;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  }
  
  .lightbox-close {
    position: absolute;
    top: -50px;
    right: 0;
    width: 40px;
    height: 40px;
    background: rgba(255, 182, 217, 0.9);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 28px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }
  
  .lightbox-close:hover {
    background: rgba(255, 133, 192, 1);
    transform: rotate(90deg) scale(1.1);
  }
`
document.head.appendChild(lightboxStyles)

// Add success message styles
const successStyles = document.createElement('style')
successStyles.textContent = `
  .success-message {
    position: fixed;
    top: 100px;
    right: 30px;
    background: linear-gradient(135deg, #FFB6D9, #FF9AC9);
    color: white;
    padding: 1.25rem 2rem;
    border-radius: 20px;
    box-shadow: 0 12px 32px rgba(255, 182, 217, 0.4);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 1rem;
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s ease;
  }
  
  .success-message i {
    font-size: 1.5rem;
  }
  
  .success-message p {
    margin: 0;
    font-weight: 600;
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    .success-message {
      right: 20px;
      left: 20px;
      top: 80px;
    }
  }
`
document.head.appendChild(successStyles)

// Add ripple styles
const rippleStyles = document.createElement('style')
rippleStyles.textContent = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 182, 217, 0.4);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
`
document.head.appendChild(rippleStyles)

// Add page load styles
const loadStyles = document.createElement('style')
loadStyles.textContent = `
  body {
    opacity: 0;
    transition: opacity 0.5s ease;
  }
`
document.head.appendChild(loadStyles)

// ================= PAGE LOAD ANIMATION =================
window.addEventListener('load', () => {
  document.body.style.opacity = '1'
})

console.log('✨ The 1997 Coffee & Space - Website Loaded Successfully! ☕')