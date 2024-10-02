import '../scss/main.scss';

function toggleBurger() {
  const burger = document.querySelector('header .hamburger');
  const header = document.querySelector('header');

  const method = burger.classList.contains('is-active') ? 'remove' : 'add';
  burger.classList[method]('is-active');
  header.classList[method]('nav-active');
}

window.addEventListener('load', (event) => {
  // Burger Menu Navigation
  document.querySelectorAll('header nav a').forEach((el) => {
    el.addEventListener('click', (event) =>
      el.scrollIntoView({ behavior: 'smooth' })
    );
  });

  const burger = document.querySelector('header .hamburger');
  burger.addEventListener('click', toggleBurger);

  // Close menu when link is clicked on mobile
  document.querySelectorAll('header nav li a').forEach((a) => {
    a.addEventListener('click', (e) => {
      if (document.querySelector('header').classList.contains('nav-active')) {
        toggleBurger();
      }
    });
  });

  // Sticky menu code
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const stickyPoint = 50;

    if (window.scrollY > stickyPoint) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  });

  // Load more insights functionality
  const loadMoreButton = document.querySelector('#load-more-insights');
  const insightList = document.querySelectorAll('#insight-list li');
  const preloader = document.querySelector('#insights-preloader');
  let visibleInsights = 6;

  if (loadMoreButton && insightList) {
    loadMoreButton.addEventListener('click', () => {
      preloader.classList.remove('hidden');

      setTimeout(() => {
        for (let i = visibleInsights; i < visibleInsights + 6; i++) {
          if (insightList[i]) {
            insightList[i].classList.remove('hidden');
          }
        }

        visibleInsights += 6;
        preloader.classList.add('hidden');

        if (visibleInsights >= insightList.length) {
          loadMoreButton.style.display = 'none';
        }
      }, 800);
    });
  }

  // Partners Ticker Scrolling
  const ticker = document.querySelector('.partners-ticker');
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');

  if (ticker && leftArrow && rightArrow) {
    leftArrow.addEventListener('click', () => {
      ticker.scrollBy({ left: -200, behavior: 'smooth' });
    });

    rightArrow.addEventListener('click', () => {
      ticker.scrollBy({ left: 200, behavior: 'smooth' });
    });
  }

  // Contact Form Handling (New Code)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;

      if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        return;
      }

      // Show confirmation modal
      showConfirmationModal();
    });
  }

  function showConfirmationModal() {
    const modal = document.createElement('div');
    modal.classList.add('confirmation-modal');
    modal.innerHTML = `
      <div class="modal-content">
        <p>Many thanks for your enquiry! We will be in touch soon.</p>
        <button id="closeModal">OK</button>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('closeModal').addEventListener('click', function() {
      modal.remove();
    });
  }
});
