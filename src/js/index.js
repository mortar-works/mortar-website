import '../scss/main.scss';

function toggleBurger() {
  const burger = document.querySelector('header .hamburger');
  const header = document.querySelector('header');

  const method = burger.classList.contains('is-active') ? 'remove' : 'add';
  burger.classList[method]('is-active');
  header.classList[method]('nav-active');
  document.body.classList[method]('menu-open');
}

window.addEventListener('load', (event) => {
  // Burger Menu Navigation
  document.querySelectorAll('header nav a').forEach((el) => {
    if (el.getAttribute('href') && el.getAttribute('href').includes('#')) {
      el.addEventListener('click', (event) =>
        el.scrollIntoView({ behavior: 'smooth' })
      );
    }
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

  // Nav dropdowns (Solutions, Company, etc.)
  const closeAllDropdowns = () => {
    document.querySelectorAll('.nav-dropdown-menu.is-open').forEach((menu) => {
      menu.classList.remove('is-open');
      menu.closest('.nav-has-dropdown').querySelector('.nav-dropdown-toggle').setAttribute('aria-expanded', 'false');
    });
  };

  document.querySelectorAll('.nav-has-dropdown').forEach((dropdown) => {
    const toggle = dropdown.querySelector('.nav-dropdown-toggle');
    const menu = dropdown.querySelector('.nav-dropdown-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.contains('is-open');
      closeAllDropdowns();
      menu.classList.toggle('is-open', !isOpen);
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });

    dropdown.addEventListener('mouseleave', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', closeAllDropdowns);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns();
  });

  // Mobile accordion for Solutions subheadings
  document.querySelectorAll('.nav-dropdown-menu--wide .dropdown-subheading').forEach((heading) => {
    heading.addEventListener('click', (e) => {
      e.stopPropagation();
      heading.closest('.dropdown-column').classList.toggle('is-open');
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

  // Load more case studies functionality (Updated Code)
  const loadMoreCaseStudiesButton = document.querySelector('#load-more-casestudies');
  const caseStudiesList = document.querySelectorAll('.case-studies-grid .case-study-link');
  const caseStudiesPreloader = document.querySelector('#case-studies-preloader');
  let visibleCaseStudies = 4; // Number of initially visible case studies

  // Hide case studies beyond the first 4 when the page loads
  caseStudiesList.forEach((caseStudy, index) => {
    if (index >= visibleCaseStudies) {
      caseStudy.classList.add('hidden'); // Ensure the hidden class is applied to those beyond the 4th
    }
  });

  if (loadMoreCaseStudiesButton && caseStudiesList) {
    loadMoreCaseStudiesButton.addEventListener('click', () => {
      caseStudiesPreloader.classList.remove('hidden');

      setTimeout(() => {
        for (let i = visibleCaseStudies; i < visibleCaseStudies + 4; i++) {
          if (caseStudiesList[i]) {
            caseStudiesList[i].classList.remove('hidden');
          }
        }

        visibleCaseStudies += 4;
        caseStudiesPreloader.classList.add('hidden');

        if (visibleCaseStudies >= caseStudiesList.length) {
          loadMoreCaseStudiesButton.style.display = 'none';
        }
      }, 800); // Simulate a 0.8s delay for loading
    });
  }

  // Services tab switcher
  const serviceNavItems = document.querySelectorAll('.service-nav-item');
  const servicePanels = document.querySelectorAll('.service-panel');

  serviceNavItems.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.service;
      serviceNavItems.forEach((b) => b.classList.remove('is-active'));
      servicePanels.forEach((p) => p.classList.remove('is-active'));
      btn.classList.add('is-active');
      document.querySelector(`.service-panel[data-service="${target}"]`).classList.add('is-active');
    });
  });

  // Vision tab switcher
  const visionTabs = document.querySelectorAll('.vision-tab');
  const visionPanels = document.querySelectorAll('.vision-panel');

  visionTabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      visionTabs.forEach((b) => b.classList.remove('is-active'));
      visionPanels.forEach((p) => p.classList.remove('is-active'));
      btn.classList.add('is-active');
      document.querySelector(`.vision-panel[data-tab="${target}"]`).classList.add('is-active');
    });
  });

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

// Contact Form Handling with Formspree Integration
const contactForm = document.getElementById('contactForm');
const contactPreloader = document.getElementById('contact-preloader'); // Preloader reference

if (contactForm) {
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const submitButton = contactForm.querySelector('button[type="submit"]');
    
    // Disable the submit button and show spinner
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    contactPreloader.classList.remove('hidden'); // Show the spinner

    // Fetch request to submit form data to Formspree
    fetch('https://formspree.io/f/mnnqqnev', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      // Ensure the spinner is shown for at least 500ms
      setTimeout(() => {
        // Enable the submit button and hide the spinner
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
        contactPreloader.classList.add('hidden'); // Hide the spinner

        if (response.ok) {
          showConfirmationModal();
          contactForm.reset();  // Optionally reset the form after submission
        } else {
          alert('Oops! There was a problem submitting the form. Please try again.');
        }
      }, 800); // Set a delay of 500ms before hiding the spinner
    }).catch(error => {
      // Ensure the spinner is shown for at least 500ms
      setTimeout(() => {
        // Enable the submit button and hide the spinner
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
        contactPreloader.classList.add('hidden'); // Hide the spinner
        alert('Oops! Something went wrong.');
      }, 500); // Set a delay of 500ms before hiding the spinner in case of an error
    });
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
