import '../scss/main.scss';

function toggleBurger(){
  const burger = document.querySelector('header .hamburger');
  const header = document.querySelector('header');

  const method = burger.classList.contains('is-active') ? "remove" : "add";
  burger.classList[method]('is-active');
  header.classList[method]('nav-active');
}

window.addEventListener('load', (event) => {
  document.querySelectorAll('header nav a').forEach( el => {
    el.addEventListener('click', event => el.scrollIntoView({behavior: 'smooth'}));
  });

  const burger = document.querySelector('header .hamburger');
  burger.addEventListener('click', toggleBurger);

  // close menu when link clicked on mobile
  document.querySelectorAll('header nav li a').forEach( a => {
    a.addEventListener('click', e => {
      if( document.querySelector('header').classList.contains('nav-active') ){
        toggleBurger();
      }
    });
  });

  // New Code for Load More Insights
  const loadMoreBtn = document.getElementById('load-more-btn');
  const moreInsights = document.getElementById('more-insights');

  // Check if the Load More button exists (in case there are fewer than 9 insights)
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      moreInsights.classList.remove('hidden');  // Show the hidden insights
      loadMoreBtn.style.display = 'none';  // Hide the button once clicked
    });
  }
});
