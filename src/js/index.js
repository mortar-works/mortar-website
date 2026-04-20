import '../scss/main.scss';

function initRotatingEmoji() {
  const el = document.getElementById('rotating-emoji');
  if (!el) return;
  const emojis = ['🌍', '🙏', '❤️', '👏'];
  const durations = [10000, 1800, 1800, 1800];
  let index = 0;
  el.style.transition = 'opacity 0.2s ease';
  function next() {
    el.style.opacity = '0';
    setTimeout(() => {
      index = (index + 1) % emojis.length;
      el.textContent = emojis[index];
      el.style.opacity = '1';
      setTimeout(next, durations[index]);
    }, 200);
  }
  setTimeout(next, durations[0]);
}

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

function initArticleToc() {
  const toc = document.getElementById('article-toc');
  if (!toc || !document.querySelector('.article-content')) return;

  const article = document.querySelector('.article-content');
  const header = document.querySelector('header');
  const headings = Array.from(article.querySelectorAll('h2, h3'));

  if (headings.length === 0) return;

  // Ensure each heading has an ID
  headings.forEach((h) => {
    if (!h.id) {
      h.id = h.textContent.trim().toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }
  });

  // Build TOC links
  headings.forEach((h) => {
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    toc.appendChild(a);
  });

  // Set scroll-margin-top so headings land below the sticky header
  function updateScrollMargins() {
    const offset = (header ? header.offsetHeight : 0) + 24;
    headings.forEach((h) => { h.style.scrollMarginTop = offset + 'px'; });
  }
  updateScrollMargins();
  window.addEventListener('resize', updateScrollMargins, { passive: true });

  // Smooth scroll on TOC link click
  toc.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(a.getAttribute('href').slice(1));
      if (target) {
        const headerHeight = header ? header.offsetHeight : 0;
        smoothScrollTo(target.getBoundingClientRect().top + window.scrollY - headerHeight, 1200);
      }
    });
  });

  // Highlight active TOC link on scroll
  const tocLinks = Array.from(toc.querySelectorAll('a'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        tocLinks.forEach((a) => {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, {
    rootMargin: '-10% 0px -80% 0px',
    threshold: 0
  });

  headings.forEach((h) => observer.observe(h));
}

window.addEventListener('load', (event) => {
  initRotatingEmoji();
  initArticleToc();

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

  // Back to top button
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.removeAttribute('hidden');
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      smoothScrollTo(0, 1200);
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
  // Track pending cssText-reset timers per menu so animateIn can cancel them
  const menuCloseTimers = new WeakMap();

  const isDesktop = () => !document.querySelector('header').classList.contains('nav-active');

  function animateIn(menu, fromX) {
    // Cancel any stale cssText reset scheduled by a previous animateOut
    clearTimeout(menuCloseTimers.get(menu));
    menuCloseTimers.delete(menu);

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
    const tid = setTimeout(() => {
      menuCloseTimers.delete(menu);
      menu.style.cssText = '';
      if (inner) inner.style.cssText = '';
    }, DURATION);
    menuCloseTimers.set(menu, tid);
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

    // Use pointerenter/leave so touch taps don't trigger the hover-open path
    item.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse' && isDesktop()) { clearTimeout(closeTimer); openAt(index); }
    });

    item.addEventListener('pointerleave', (e) => {
      if (e.pointerType === 'mouse' && isDesktop()) {
        closeTimer = setTimeout(() => { if (activeIndex === index) closeAll(); }, 150);
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
        const isTouch = e.pointerType === 'touch' || e.pointerType === 'pen';
        if (isTouch) {
          // Touch: mouseenter won't have fired, so just open (never close on first tap)
          if (activeIndex !== index) openAt(index);
        } else {
          // Mouse click: toggle open/close
          if (activeIndex === index) { closeAll(); } else { openAt(index); }
        }
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


  // Insights filter + pagination
  const filterButtons = document.querySelectorAll('.insight-filter');
  const insightItems = Array.from(document.querySelectorAll('#insight-list li'));
  const paginationContainer = document.getElementById('insights-pagination');
  const ITEMS_PER_PAGE = 12;
  let currentFilter = 'all';
  let currentPage = 1;

  function getFilteredItems() {
    return insightItems.filter(item =>
      currentFilter === 'all' || item.dataset.category.split(' ').includes(currentFilter)
    );
  }

  function renderPage() {
    const filtered = getFilteredItems();
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    insightItems.forEach(item => { item.style.display = 'none'; });
    filtered.slice(start, end).forEach(item => { item.style.display = ''; });

    renderPagination(totalPages, filtered.length);
  }

  function renderPagination(totalPages, totalItems) {
    if (!paginationContainer) return;
    if (totalPages <= 1) { paginationContainer.innerHTML = ''; return; }

    let html = `<div class="pagination-info">${totalItems} articles</div><div class="pagination-controls">`;
    html += `<button class="pagination-btn pagination-prev" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>`;
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="pagination-btn ${i === currentPage ? 'is-active' : ''}" data-page="${i}">${i}</button>`;
    }
    html += `<button class="pagination-btn pagination-next" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>`;
    html += '</div>';
    paginationContainer.innerHTML = html;

    paginationContainer.querySelectorAll('.pagination-btn:not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => {
        currentPage = parseInt(btn.dataset.page);
        renderPage();
        document.getElementById('insights')?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function applyFilter(filter) {
    currentFilter = filter;
    currentPage = 1;
    filterButtons.forEach(b => b.classList.remove('is-active'));
    const activeBtn = Array.from(filterButtons).find(b => b.dataset.filter === filter);
    if (activeBtn) activeBtn.classList.add('is-active');
    renderPage();
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });

  // Pre-select filter from URL query param (e.g. ?filter=case-study)
  const urlFilter = new URLSearchParams(window.location.search).get('filter');
  if (urlFilter && filterButtons.length) {
    applyFilter(urlFilter);
  } else if (insightItems.length) {
    renderPage();
  }

  // Insights search functionality
  const searchInput = document.querySelector('.insight-search-input');

  function applySearch(query) {
    const q = query.toLowerCase().trim();
    insightItems.forEach(item => {
      const title = item.querySelector('.insight-title')?.textContent.toLowerCase() || '';
      const desc = item.querySelector('.insight-description')?.textContent.toLowerCase() || '';
      const kws = Array.from(item.querySelectorAll('.insight-keyword')).map(el => el.textContent.toLowerCase()).join(' ');
      const matches = !q || title.includes(q) || desc.includes(q) || kws.includes(q);
      item.style.display = matches ? '' : 'none';
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => applySearch(searchInput.value));

    // Pre-populate search from URL query param (e.g. ?search=data+management)
    const urlSearch = new URLSearchParams(window.location.search).get('search');
    if (urlSearch) {
      searchInput.value = urlSearch;
      applySearch(urlSearch);
    }
  }

  // Keyword clicks on content cards — navigate to /content/?search=keyword
  document.querySelectorAll('.insight-keyword[data-keyword]').forEach(span => {
    span.style.cursor = 'pointer';
    span.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = '/content/?search=' + encodeURIComponent(span.dataset.keyword);
    });
  });

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

  // Services tab switcher / mobile accordion
  const serviceNavItems = document.querySelectorAll('.service-nav-item');
  const servicePanels   = document.querySelectorAll('.service-panel');
  const servicesContent = document.querySelector('.services-content');

  const serviceIsMobile = () => window.innerWidth < 768;

  function restorePanelsToContent() {
    servicePanels.forEach(panel => {
      panel.style.height = '';
      servicesContent.appendChild(panel);
    });
  }

  function openPanel(panel, btn) {
    btn.classList.add('is-active');
    btn.insertAdjacentElement('afterend', panel);
    // Measure real content height, then animate from 0 to that value
    panel.style.height = 'auto';
    const h = panel.scrollHeight;
    panel.style.height = '0';
    panel.getBoundingClientRect(); // force reflow
    panel.classList.add('is-active');
    panel.style.height = h + 'px';
    panel.addEventListener('transitionend', () => {
      if (panel.classList.contains('is-active')) panel.style.height = 'auto';
    }, { once: true });
  }

  function closePanel(panel) {
    // Pin to current height first so transition has a start point
    panel.style.height = panel.scrollHeight + 'px';
    panel.getBoundingClientRect(); // force reflow
    panel.classList.remove('is-active');
    panel.style.height = '0';
    panel.addEventListener('transitionend', () => {
      if (!panel.classList.contains('is-active')) {
        panel.style.height = '';
        servicesContent.appendChild(panel);
      }
    }, { once: true });
  }

  function initServicesAccordion() {
    const activeBtn = document.querySelector('.service-nav-item.is-active');
    if (activeBtn) {
      const panel = document.querySelector(`.service-panel[data-service="${activeBtn.dataset.service}"]`);
      activeBtn.insertAdjacentElement('afterend', panel);
      panel.classList.add('is-active');
      panel.style.height = 'auto'; // no animation on initial load
    }
  }

  serviceNavItems.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target    = btn.dataset.service;
      const panel     = document.querySelector(`.service-panel[data-service="${target}"]`);
      const wasActive = btn.classList.contains('is-active');

      if (serviceIsMobile()) {
        // Find and close any currently open panel
        const openPanel_ = document.querySelector('.services-nav .service-panel.is-active');
        const openBtn    = document.querySelector('.service-nav-item.is-active');
        if (openBtn)  openBtn.classList.remove('is-active');
        if (openPanel_) closePanel(openPanel_);

        if (!wasActive) openPanel(panel, btn);
      } else {
        serviceNavItems.forEach((b) => b.classList.remove('is-active'));
        servicePanels.forEach((p)   => p.classList.remove('is-active'));
        btn.classList.add('is-active');
        panel.classList.add('is-active');
      }
    });
  });

  // Restore panels to desktop layout on resize
  let servicesLastMobile = serviceIsMobile();
  window.addEventListener('resize', () => {
    const nowMobile = serviceIsMobile();
    if (servicesLastMobile !== nowMobile) {
      if (!nowMobile) {
        restorePanelsToContent();
        serviceNavItems.forEach((b) => b.classList.remove('is-active'));
        servicePanels.forEach((p)   => p.classList.remove('is-active'));
        serviceNavItems[0].classList.add('is-active');
        servicePanels[0].classList.add('is-active');
      }
      servicesLastMobile = nowMobile;
    }
  });

  // Init accordion on mobile page load
  if (serviceIsMobile()) initServicesAccordion();

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

  // Featured work — second row tiles fade in left to right on scroll
  const featuredGrid = document.querySelector('.featured-grid');
  if (featuredGrid) {
    const featuredTiles = Array.from(
      featuredGrid.querySelectorAll('.featured-tile:not(.featured-tile--large)')
    );
    const featuredRowObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          featuredTiles.forEach((tile) => tile.classList.add('is-visible'));
          featuredRowObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    featuredRowObserver.observe(featuredGrid);
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

    // Fetch request to submit form data to Netlify Forms
    const params = new URLSearchParams(formData);
    params.append('form-name', 'contact');

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
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
      <p>Many thanks for your enquiry!<br>We will be in touch soon.</p>
      <button id="closeModal">OK</button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('closeModal').addEventListener('click', function() {
    modal.remove();
  });
}

});

// ─── Grid snake animation (homepage topline only) ────────────────────────────
(function() {
  return; // disabled — preserved for later
  if (document.body.id !== 'homepage') return;

  const CELL = 44;
  // head → tail: orange, purple, yellow, pink — each progressively fainter
  const SEGMENT_COLORS = [
    'rgba(254,109,106,0.28)',  // mortar orange  (head)
    'rgba(43,28,90,0.16)',     // mortar purple
    'rgba(255,227,44,0.14)',   // mortar yellow
    'rgba(252,168,147,0.88)',  // mortar pink    (tail)
  ];
  const MOVE_MS = 175;
  const BLINK_MS = 360;
  const BLINK_TOGGLES = 6;

  const DIRS = [[1,0],[-1,0],[0,1],[0,-1]];

  function randomDir(current) {
    const rev = [-current[0], -current[1]];
    const opts = DIRS.filter(d => !(d[0] === rev[0] && d[1] === rev[1]));
    return opts[Math.floor(Math.random() * opts.length)];
  }

  function randomSteps() {
    return 4 + Math.floor(Math.random() * 7);
  }

  function init() {
    const section = document.getElementById('topline');
    if (!section) return;

    // Wrapper inherits the same edge-fade mask as the ::before grid
    const wrap = document.createElement('div');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.style.cssText = [
      'position:absolute', 'inset:0', 'pointer-events:none', 'z-index:0', 'overflow:hidden',
      'mask-image:linear-gradient(to right,transparent 0%,black 25%,black 75%,transparent 100%)',
      '-webkit-mask-image:linear-gradient(to right,transparent 0%,black 25%,black 75%,transparent 100%)',
    ].join(';');
    section.appendChild(wrap);

    // One div per segment — positioned in CSS pixels so they snap to the grid exactly
    const segs = SEGMENT_COLORS.map(color => {
      const el = document.createElement('div');
      el.style.cssText = [
        'position:absolute',
        `width:${CELL}px`, `height:${CELL}px`,
        `background:${color}`,
        'display:none', 'pointer-events:none',
      ].join(';');
      wrap.appendChild(el);
      return el;
    });

    let cols = 0, rows = 0;

    function resize() {
      cols = Math.floor(section.offsetWidth  / CELL);
      rows = Math.floor(section.offsetHeight / CELL);
    }
    resize();
    window.addEventListener('resize', resize);

    let snake = [];
    let dir = [1, 0];
    let stepsLeft = 0;
    let state = 'moving';
    let blinkToggle = 0;
    let headVisible = true;
    let lastMoveTime = 0;
    let lastBlinkTime = 0;

    function start() {
      const x = 2 + Math.floor(Math.random() * Math.max(1, cols - 4));
      const y = 1 + Math.floor(Math.random() * Math.max(1, rows - 2));
      snake = [[x, y]];
      dir = DIRS[Math.floor(Math.random() * DIRS.length)];
      stepsLeft = randomSteps();
      state = 'moving';
      headVisible = true;
    }

    function tick(now) {
      if (state === 'moving') {
        if (now - lastMoveTime < MOVE_MS) return;
        lastMoveTime = now;

        const [hx, hy] = snake[0];
        const nx = hx + dir[0];
        const ny = hy + dir[1];

        if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) {
          dir = randomDir(dir);
          stepsLeft = randomSteps();
          return;
        }

        snake.unshift([nx, ny]);
        if (snake.length > SEGMENT_COLORS.length - 1) snake.pop();

        stepsLeft--;
        if (stepsLeft <= 0) {
          state = 'pausing';
          blinkToggle = 0;
          headVisible = true;
          lastBlinkTime = now;
        }
      } else {
        if (now - lastBlinkTime < BLINK_MS) return;
        lastBlinkTime = now;
        headVisible = !headVisible;
        blinkToggle++;
        if (blinkToggle >= BLINK_TOGGLES) {
          state = 'moving';
          headVisible = true;
          dir = randomDir(dir);
          stepsLeft = randomSteps();
          lastMoveTime = now;
        }
      }
    }

    function draw() {
      segs.forEach((el, i) => {
        const pos = snake[i];
        if (!pos || (i === 0 && !headVisible)) {
          el.style.display = 'none';
        } else {
          el.style.display = 'block';
          el.style.left = (pos[0] * CELL) + 'px';
          el.style.top  = (pos[1] * CELL) + 'px';
        }
      });
    }

    if (cols > 0 && rows > 0) start();

    function loop(now) {
      if (snake.length === 0 && cols > 0 && rows > 0) start();
      tick(now);
      draw();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

