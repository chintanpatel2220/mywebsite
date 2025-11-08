window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

const navToggle = document.querySelector('.nav-toggle');
const navigation = document.querySelector('.site-nav');

if (navToggle && navigation) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navigation.classList.toggle('open');
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('open');
    });
  });
}
