(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

window.addEventListener('DOMContentLoaded', () => {
  // Animate filters
  const filters = document.querySelectorAll('#filters .filter');
  filters.forEach((filter, i) => {
    filter.classList.add('animated-fadeInUp', `animated-delay-${i+1}`);
  });

  // Animate all listing cards
  const cards = document.querySelectorAll('.listing-card');
  cards.forEach((card, i) => {
    card.classList.add('animated-popIn', `animated-delay-${(i%8)+1}`);
  });

  // Animate navbar and footer
  const navbar = document.querySelector('.navbar');
  if(navbar) navbar.classList.add('animated-fadeIn');
  const footer = document.querySelector('.f-info');
  if(footer) footer.classList.add('animated-fadeIn', 'animated-delay-6');

  // Animate flash messages
  const flash = document.querySelector('.alert');
  if(flash) flash.classList.add('animated-fadeInUp', 'animated-delay-2');

  // Ripple effect on filter click
  filters.forEach(filter => {
    filter.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${e.offsetX}px`;
      ripple.style.top = `${e.offsetY}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Surprise Me button logic
  const surpriseBtn = document.getElementById('surpriseBtn');
  if(surpriseBtn) {
    surpriseBtn.onclick = function() {
      window.location.href = '/listings/booked';
    };
  }

  // Help Care button logic (animated, with links)
  const helpCareBtn = document.getElementById('helpCareBtn');
  if(helpCareBtn) {
    helpCareBtn.addEventListener('click', () => {
      const helpModal = document.createElement('div');
      helpModal.style.position = 'fixed';
      helpModal.style.left = 0;
      helpModal.style.top = 0;
      helpModal.style.width = '100vw';
      helpModal.style.height = '100vh';
      helpModal.style.background = 'rgba(0,0,0,0.35)';
      helpModal.style.zIndex = 9999;
      helpModal.style.display = 'flex';
      helpModal.style.alignItems = 'center';
      helpModal.style.justifyContent = 'center';
      helpModal.innerHTML = `
        <div style="background:linear-gradient(135deg,#fff 60%,#e6f7ff 100%);padding:2.5rem 2rem 2rem 2rem;border-radius:1.5rem;max-width:95vw;width:400px;box-shadow:0 8px 32px #007bff33;position:relative;animation:popIn 0.7s cubic-bezier(0.23,1,0.32,1);">
          <button id="closeHelpModal" style="position:absolute;top:1rem;right:1rem;background:none;border:none;font-size:1.5rem;color:#007bff;cursor:pointer;">&times;</button>
          <h4 style="color:#007bff;font-weight:bold;margin-bottom:1rem;">Help & Care Center</h4>
          <ul style="padding-left:1.2rem;line-height:2;">
            <li><a href="/faq" style="color:#007bff;font-weight:bold;" target="_blank"><i class='fa-solid fa-circle-question me-1'></i>FAQ</a></li>
            <li><a href="/listings/booked" style="color:#fe424d;font-weight:bold;" target="_blank"><i class='fa-solid fa-bed me-1'></i>My Booked Hotels</a></li>
            <li><a href="/listings" style="color:#fe424d;font-weight:bold;" target="_blank"><i class='fa-solid fa-hotel me-1'></i>All Hotels</a></li>
            <li><a href="mailto:support@wanderlust.com?subject=Support%20Request" style="color:#007bff;font-weight:bold;" target="_blank"><i class='fa-solid fa-envelope me-1'></i>Email Support</a></li>
            <li><a href="/privacy" style="color:#007bff;font-weight:bold;" target="_blank"><i class='fa-solid fa-user-shield me-1'></i>Privacy Policy</a></li>
            <li><a href="/terms" style="color:#007bff;font-weight:bold;" target="_blank"><i class='fa-solid fa-file-contract me-1'></i>Terms & Conditions</a></li>
            <li><a href="https://wa.me/1234567890?text=Hi%20Wanderlust%20Support!" style="color:#25d366;font-weight:bold;" target="_blank"><i class='fa-brands fa-whatsapp me-1'></i>WhatsApp Support</a></li>
            <li><a href="tel:+911234567890" style="color:#007bff;font-weight:bold;" target="_blank"><i class='fa-solid fa-phone me-1'></i>Call Support</a></li>
          </ul>
          <div style="margin-top:1.5rem;text-align:center;">
            <button onclick="window.location.reload()" style="background:#007bff;color:#fff;border:none;padding:0.6rem 1.2rem;border-radius:1rem;font-weight:bold;">Reload Page</button>
          </div>
        </div>
      `;
      document.body.appendChild(helpModal);
      document.getElementById('closeHelpModal').onclick = () => helpModal.remove();
    });
  }
});

// Add ripple effect CSS
const rippleStyle = document.createElement('style');
rippleStyle.innerHTML = `
.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(110, 231, 255, 0.25);
  transform: scale(0);
  animation: ripple-anim 0.6s linear;
  pointer-events: none;
  width: 80px; height: 80px;
  left: 0; top: 0;
  z-index: 100;
}
@keyframes ripple-anim {
  to { transform: scale(2.5); opacity: 0; }
}`;
document.head.appendChild(rippleStyle);