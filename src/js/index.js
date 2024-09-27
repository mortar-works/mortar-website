import '../scss/main.scss';

function toggleBurger() {
  const burger = document.querySelector('header .hamburger');
  const header = document.querySelector('header');

  const method = burger.classList.contains('is-active') ? 'remove' : 'add';
  burger.classList[method]('is-active');
  header.classList[method]('nav-active');
}

window.addEventListener('load', (event) => {
  document.querySelectorAll('header nav a').forEach(el => {
    el.addEventListener('click', event => el.scrollIntoView({ behavior: 'smooth' }));
  });

  const burger = document.querySelector('header .hamburger');
  burger.addEventListener('click', toggleBurger);

  // Close menu when link clicked on mobile
  document.querySelectorAll('header nav li a').forEach(a => {
    a.addEventListener('click', e => {
      if (document.querySelector('header').classList.contains('nav-active')) {
        toggleBurger();
      }
    });
  });
});

// Load More Insights Functionality
window.addEventListener('DOMContentLoaded', () => {
  const loadMoreButton = document.getElementById('load-more-insights');
  const insightListItems = Array.from(document.querySelectorAll('#insight-list li.hidden'));

  let currentIndex = 9; // We initially show 9 insights

  if (loadMoreButton) {
    loadMoreButton.addEventListener('click', () => {
      // Reveal the next batch of 9 insights
      const nextBatch = insightListItems.slice(currentIndex, currentIndex + 9);

      nextBatch.forEach(insight => {
        insight.classList.remove('hidden');
      });

      currentIndex += 9;

      // Hide the button if no more insights are left to show
      if (currentIndex >= insightListItems.length) {
        loadMoreButton.style.display = 'none';
      }
    });
  }
});
