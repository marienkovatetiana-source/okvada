// Legal notice / Terms of carriage / Privacy policy: блок «On this page».
// Desktop — список ссылок (активный пункт подсвечен), mobile — нативный select, переход к пункту.

const tocLinks = document.querySelectorAll('[data-toc-link]');
const tocSelect = document.querySelector('[data-toc-select]');

function setActive(id) {
  tocLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === '#' + id;
    link.classList.toggle('is-active', isActive);

    if (isActive) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  if (tocSelect) {
    tocSelect.value = id;
  }
}

tocLinks.forEach((link) => {
  link.addEventListener('click', () => {
    setActive(link.getAttribute('href').slice(1));
  });
});

if (tocSelect) {
  tocSelect.addEventListener('change', () => {
    setActive(tocSelect.value);
    location.hash = tocSelect.value;
  });
}

// Открыли страницу сразу с якорем (например, privacy.html#cookies)
if (location.hash && document.getElementById(location.hash.slice(1))) {
  setActive(location.hash.slice(1));
}
