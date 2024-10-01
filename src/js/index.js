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
    const sticky = header.offsetTop;
  
    console.log("Scroll Position:", window.scrollY); // Check scroll position
    console.log("Header offset:", sticky); // Check header's offset
  
    if (window.scrollY > sticky) {
      header.classList.add('sticky');
      console.log("Sticky class added");
    } else {
      header.classList.remove('sticky');
      console.log("Sticky class removed");
    }
  });

  // Load more insights functionality
  const loadMoreButton = document.querySelector('#load-more-insights');
  const insightList = document.querySelectorAll('#insight-list li');
  const preloader = document.querySelector('#insights-preloader');
  let visibleInsights = 6; // Initially show 6 insights

  if (loadMoreButton && insightList) {
    loadMoreButton.addEventListener('click', () => {
      // Show the preloader
      preloader.classList.remove('hidden');

      // Simulate loading delay with setTimeout
      setTimeout(() => {
        for (let i = visibleInsights; i < visibleInsights + 6; i++) {
          if (insightList[i]) {
            insightList[i].classList.remove('hidden');
          }
        }

        visibleInsights += 6;

        // Hide preloader after loading new items
        preloader.classList.add('hidden');

        // Hide the load more button if all items are shown
        if (visibleInsights >= insightList.length) {
          loadMoreButton.style.display = 'none';
        }
      }, 800); // 800ms delay to simulate slower loading
    });
  }

  // Partners Ticker Scrolling
  const ticker = document.querySelector('.partners-ticker'); // The ticker container
  const leftArrow = document.querySelector('.left-arrow');   // Left arrow button
  const rightArrow = document.querySelector('.right-arrow'); // Right arrow button

  if (ticker && leftArrow && rightArrow) {
    // Scroll left when the left arrow is clicked
    leftArrow.addEventListener('click', () => {
      ticker.scrollBy({ left: -200, behavior: 'smooth' });
    });

    // Scroll right when the right arrow is clicked
    rightArrow.addEventListener('click', () => {
      ticker.scrollBy({ left: 200, behavior: 'smooth' });
    });
  }
});
