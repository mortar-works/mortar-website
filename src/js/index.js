import '../scss/main.scss';

function toggleBurger() {
  const burger = document.querySelector('header .hamburger');
  const header = document.querySelector('header');

  const method = burger.classList.contains('is-active') ? 'remove' : 'add';
  burger.classList[method]('is-active');
  header.classList[method]('nav-active');
  document.body.classList[method]('menu-open');
}

function smoothScrollTo(targetY, duration) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();
  function ease(t) { return 1 - Math.pow(1 - t, 3); }
  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, startY + distance * ease(progress));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
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

  // Topline CTA — slow scroll to bottom of partners section
  const toplineCta = document.querySelector('.topline-cta');
  if (toplineCta) {
    toplineCta.addEventListener('click', (e) => {
      e.preventDefault();
      const partners = document.getElementById('partners');
      const header = document.querySelector('header');
      if (partners && header) {
        const targetY = partners.getBoundingClientRect().bottom + window.scrollY - header.offsetHeight;
        smoothScrollTo(targetY, 1000);
      }
    });
  }

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

  // Nav dropdowns — directional slide animation
  const dropdownItems = Array.from(document.querySelectorAll('.nav-has-dropdown'));
  let activeIndex = -1;
  let closeTimer = null;
  const SLIDE_PX = 20;
  const DURATION = 220;

  const isDesktop = () => !document.querySelector('header').classList.contains('nav-active');

  function animateIn(menu, fromX) {
    const inner = menu.querySelector('.dropdown-section, .dropdown-columns');
    // Outer panel: fade only — no transform so the tab stays anchored
    menu.style.transition = 'none';
    menu.style.opacity = '0';
    menu.style.visibility = 'visible';
    menu.style.pointerEvents = 'auto';
    // Inner content: slide from direction
    if (inner && fromX !== 0) {
      inner.style.transition = 'none';
      inner.style.transform = `translateX(${fromX}px)`;
      inner.style.opacity = '0';
    }
    requestAnimationFrame(() => requestAnimationFrame(() => {
      menu.style.transition = `opacity ${DURATION}ms ease`;
      menu.style.opacity = '1';
      if (inner && fromX !== 0) {
        inner.style.transition = `opacity ${DURATION}ms ease, transform ${DURATION}ms ease`;
        inner.style.transform = 'translateX(0)';
        inner.style.opacity = '1';
      }
    }));
  }

  function animateOut(menu, toX) {
    const inner = menu.querySelector('.dropdown-section, .dropdown-columns');
    menu.style.transition = `opacity ${DURATION}ms ease`;
    menu.style.opacity = '0';
    menu.style.pointerEvents = 'none';
    if (inner && toX !== 0) {
      inner.style.transition = `opacity ${DURATION}ms ease, transform ${DURATION}ms ease`;
      inner.style.transform = `translateX(${toX}px)`;
      inner.style.opacity = '0';
    }
    setTimeout(() => {
      menu.style.cssText = '';
      if (inner) inner.style.cssText = '';
    }, DURATION);
  }

  function openAt(index) {
    if (index === activeIndex) return;
    clearTimeout(closeTimer);
    const dir = activeIndex === -1 ? 0 : (index > activeIndex ? 1 : -1);

    if (activeIndex !== -1) {
      const oldItem = dropdownItems[activeIndex];
      const oldMenu = oldItem?.querySelector('.nav-dropdown-menu');
      const oldToggle = oldItem?.querySelector('.nav-dropdown-toggle');
      if (oldMenu) animateOut(oldMenu, dir * -SLIDE_PX);
      oldToggle?.setAttribute('aria-expanded', 'false');
    }

    const newItem = dropdownItems[index];
    const newMenu = newItem.querySelector('.nav-dropdown-menu');
    const newToggle = newItem.querySelector('.nav-dropdown-toggle');
    if (newMenu) animateIn(newMenu, dir * SLIDE_PX);
    newToggle?.setAttribute('aria-expanded', 'true');
    activeIndex = index;
  }

  function closeAll() {
    clearTimeout(closeTimer);
    if (activeIndex !== -1) {
      const item = dropdownItems[activeIndex];
      const menu = item?.querySelector('.nav-dropdown-menu');
      const toggle = item?.querySelector('.nav-dropdown-toggle');
      if (menu) animateOut(menu, 0);
      toggle?.setAttribute('aria-expanded', 'false');
    }
    activeIndex = -1;
  }

  dropdownItems.forEach((item, index) => {
    const toggle = item.querySelector('.nav-dropdown-toggle');
    const menu = item.querySelector('.nav-dropdown-menu');
    if (!toggle || !menu) return;

    item.addEventListener('mouseenter', () => {
      if (isDesktop()) { clearTimeout(closeTimer); openAt(index); }
    });

    item.addEventListener('mouseleave', () => {
      if (isDesktop()) {
        closeTimer = setTimeout(() => { if (activeIndex === index) closeAll(); }, 80);
      }
    });

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!isDesktop()) {
        // Mobile: accordion toggle
        const isOpen = menu.classList.contains('is-open');
        document.querySelectorAll('.nav-dropdown-menu.is-open').forEach((m) => {
          m.classList.remove('is-open');
          m.closest('.nav-has-dropdown')?.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          menu.classList.add('is-open');
          toggle.setAttribute('aria-expanded', 'true');
        }
      } else {
        // Desktop: click also toggles
        if (activeIndex === index) { closeAll(); } else { openAt(index); }
      }
    });
  });

  document.addEventListener('click', closeAll);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });

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

  // Insights filter functionality
  const filterButtons = document.querySelectorAll('.insight-filter');
  const insightItems = document.querySelectorAll('#insight-list li');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filter = btn.dataset.filter;
      insightItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Insights search functionality
  const searchInput = document.querySelector('.insight-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      insightItems.forEach(item => {
        const title = item.querySelector('.insight-title')?.textContent.toLowerCase() || '';
        const desc = item.querySelector('.insight-description')?.textContent.toLowerCase() || '';
        const matches = !query || title.includes(query) || desc.includes(query);
        item.style.display = matches ? '' : 'none';
      });
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

  // Logo tombola cycling
  const tombola = document.querySelector('.logo-tombola');
  if (tombola) {
    const logos = Array.from(tombola.querySelectorAll('.tombola-slide'));
    let currentIndex = 0;

    setInterval(() => {
      const nextIndex = (currentIndex + 1) % logos.length;
      const current = logos[currentIndex];
      const next = logos[nextIndex];

      current.classList.remove('is-current');
      current.classList.add('is-exiting');
      next.classList.add('is-current');

      setTimeout(() => {
        current.style.transition = 'none';
        current.classList.remove('is-exiting');
        current.offsetHeight; // force reflow
        current.style.transition = '';
        currentIndex = nextIndex;
      }, 450);
    }, 3000);
  }

  // Vision tabs — sticky on scroll + smooth scroll + active state
  const visionTabs = document.querySelectorAll('.vision-tab');
  const visionPanels = document.querySelectorAll('.vision-panel');
  const visionTabsBar = document.getElementById('vision-tabs-bar');
  const visionTabsPlaceholder = document.getElementById('vision-tabs-placeholder');
  const visionSection = document.getElementById('vision');
  const siteHeader = document.querySelector('header');

  function updateStickyTabs() {
    if (!visionTabsBar || !visionSection || !siteHeader) return;
    const headerHeight = siteHeader.offsetHeight;
    const tabsHeight = visionTabsBar.offsetHeight;
    const placeholderTop = visionTabsPlaceholder.getBoundingClientRect().top;
    const sectionBottom = visionSection.getBoundingClientRect().bottom;
    const triggerTop = visionTabsBar.classList.contains('is-sticky') ? placeholderTop : visionTabsBar.getBoundingClientRect().top;

    if (triggerTop <= headerHeight && sectionBottom > headerHeight + tabsHeight) {
      visionTabsBar.style.top = headerHeight + 'px';
      visionTabsBar.classList.add('is-sticky');
      visionTabsPlaceholder.style.height = tabsHeight + 'px';
      visionTabsPlaceholder.classList.add('is-visible');
    } else {
      visionTabsBar.classList.remove('is-sticky');
      visionTabsPlaceholder.classList.remove('is-visible');
    }
  }
  window.addEventListener('scroll', updateStickyTabs, { passive: true });
  updateStickyTabs();

  // Headline links (people / places / property) — smooth scroll to vision panels
  document.querySelectorAll('.headline-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
        const tabsHeight = visionTabsBar ? visionTabsBar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - tabsHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Smooth scroll on tab click
  visionTabs.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
        const tabsHeight = visionTabsBar ? visionTabsBar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - tabsHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Highlight active tab on scroll
  const visionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        visionTabs.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3 });

  visionPanels.forEach((panel) => visionObserver.observe(panel));

  // Typewriter animation for services heading
  const typewriterWord = document.getElementById('typewriter-word');
  const typewriterCursor = document.querySelector('.typewriter-cursor');
  const words = ['builders.', 'partners.', 'designers.', 'builders.'];
  let wordIndex = 0;
  let charIndex = words[0].length;
  let isDeleting = true;
  const typeSpeed = 150;
  const deleteSpeed = 90;
  const pauseAfterType = 1300;
  const pauseAfterDelete = 400;

  function typeWriter() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      charIndex--;
      typewriterWord.textContent = currentWord.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex++;
        setTimeout(typeWriter, pauseAfterDelete);
        return;
      }
      setTimeout(typeWriter, deleteSpeed);
    } else {
      charIndex++;
      typewriterWord.textContent = currentWord.slice(0, charIndex);
      if (charIndex === currentWord.length) {
        // Stop after typing the final "builders."
        if (wordIndex === words.length - 1) return;
        isDeleting = true;
        setTimeout(typeWriter, pauseAfterType);
        return;
      }
      setTimeout(typeWriter, typeSpeed);
    }
  }

  // Scroll fade-in for sections after topline
  const scrollFadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        scrollFadeObserver.unobserve(entry.target);

        // Start typewriter once services heading fades in
        if (entry.target.id === 'services' && typewriterWord && typewriterCursor) {
          setTimeout(() => {
            typewriterCursor.style.opacity = '1';
            typewriterCursor.style.animationPlayState = 'running';
            setTimeout(typeWriter, pauseAfterType);
          }, 600);
        }
      }
    });
  }, { threshold: 0 });

  ['partners', 'services', 'vision', 'insights'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) scrollFadeObserver.observe(el);
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
