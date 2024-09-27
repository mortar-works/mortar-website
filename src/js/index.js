import '../scss/main.scss';

function toggleBurger() {
  const burger = document.querySelector('header .hamburger');
  const header = document.querySelector('header');

  const method = burger.classList.contains('is-active') ? 'remove' : 'add';
  burger.classList[method]('is-active');
  header.classList[method]('nav-active');
}

window.addEventListener('load', (event) => {
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

  // Load more insights functionality
  const loadMoreButton = document.querySelector('#load-more-insights');
  const insightList = document.querySelectorAll('#insight-list li');
  const preloader = document.querySelector('#insights-preloader');
  let visibleInsights = 6; // Initially show 6 insights

  if (loadMoreButton && insightList) {
    loadMoreButton.addEventListener('click', () => {
      // Show the preloader with fade-in effect
      if (preloader) {
        preloader.classList.add('active');
      }

      // Simulate loading delay with setTimeout
      setTimeout(() => {
        // Load the next set of 6 insights
        for (let i = visibleInsights; i < visibleInsights + 6; i++) {
          if (insightList[i]) {
            insightList[i].classList.remove('hidden');
          }
        }

        visibleInsights += 6;

        // Hide the preloader with fade-out effect
        setTimeout(() => {
          if (preloader) {
            preloader.classList.remove('active');
          }
        }, 600); // Keep the spinner for an additional 600ms

        // Hide the load more button if all items are shown
        if (visibleInsights >= insightList.length) {
          loadMoreButton.style.display = 'none';
        }
      }, 1000); // 1000ms delay to simulate loading (spinner will last longer)
    });
  }
});
