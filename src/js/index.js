import '../scss/main.scss';

function toggleBurger(){
  const burger = document.querySelector('header .hamburger');
  const nav = document.querySelector('header nav');

  if( burger.classList.contains('is-active') ){
    burger.classList.remove('is-active');
    nav.classList.remove('active');
  } else {
    burger.classList.add('is-active');
    nav.classList.add('active');
  }
}

window.addEventListener('load', (event) => {
  document.querySelectorAll('header nav a').forEach( el => {
    el.addEventListener('click', event => el.scrollIntoView({behavior: 'smooth'}));
  });

  const burger = document.querySelector('header .hamburger');
  burger.addEventListener('click', toggleBurger);
  burger.addEventListener('keypress', toggleBurger);
});
