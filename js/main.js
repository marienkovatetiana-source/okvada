/* =========================================================
   Okvada — общий JS для всех страниц
   header, language menu, mobile menu, footer-аккордеон,
   cookie banner + settings, появление секций
   ========================================================= */

// Флаг «пользователь отключил анимации в системе».
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Header: тень после прокрутки ---------- */

const header = document.querySelector('#header');
const hero = document.querySelector('.hero');

function updateHeader() {
  // На Home — после hero, на остальных — сразу после 8 px прокрутки
  const limit = hero ? hero.offsetHeight - header.offsetHeight : 8;
  header.classList.toggle('is-scrolled', window.scrollY > limit);
}

if (header) {
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

/* ---------- Блокировка прокрутки + оверлей ---------- */

const overlay = document.querySelector('[data-overlay]');
const root = document.documentElement;

function lockPage(isLocked) {
  root.classList.toggle('is-locked', isLocked);
  overlay.classList.toggle('is-open', isLocked);
}


function trapFocus(dialog, event) {
  if (event.key !== 'Tab') return;
  const items = dialog.querySelectorAll('a[href], button:not([disabled]), select, input:not([disabled])');
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/* ---------- Mobile menu ---------- */

const menu = document.querySelector('[data-menu]');
const menuOpenBtn = document.querySelector('[data-menu-open]');
const menuCloseBtn = document.querySelector('[data-menu-close]');

function openMenu() {
  menu.classList.add('is-open');
  menuOpenBtn.setAttribute('aria-expanded', 'true');
  lockPage(true);
  menuCloseBtn.focus();
}

function closeMenu() {
  menu.classList.remove('is-open');
  menuOpenBtn.setAttribute('aria-expanded', 'false');
  lockPage(false);
  menuOpenBtn.focus();
}

if (menu) {
  menuOpenBtn.addEventListener('click', openMenu);
  menuCloseBtn.addEventListener('click', closeMenu);
  menu.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
    trapFocus(menu, event);
  });
}

/* ---------- Language menu (desktop) ---------- */

const lang = document.querySelector('[data-lang]');

if (lang) {
  const langBtn = lang.querySelector('[data-lang-btn]');
  const langMenu = lang.querySelector('[data-lang-menu]');
  const langCurrent = lang.querySelector('[data-lang-current]');
  const options = lang.querySelectorAll('[data-lang-option]');
  const langSelect = document.querySelector('[data-lang-select]');

  const toggleLang = (isOpen) => {
    langMenu.classList.toggle('is-open', isOpen);
    langBtn.setAttribute('aria-expanded', String(isOpen));
  };

  // Прототип: меняем только подпись. DE-версию подключим позже.
  const setLang = (code) => {
    langCurrent.textContent = code;
    options.forEach((item) => {
      item.setAttribute('aria-checked', String(item.dataset.langOption === code));
    });
    if (langSelect) langSelect.value = code;
  };

  langBtn.addEventListener('click', () => {
    const isOpen = !langMenu.classList.contains('is-open');
    toggleLang(isOpen);
    if (isOpen) options[0].focus();
  });

  options.forEach((item) => {
    item.addEventListener('click', () => {
      setLang(item.dataset.langOption);
      toggleLang(false);
      langBtn.focus();
    });
  });

  lang.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      toggleLang(false);
      langBtn.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!lang.contains(event.target)) toggleLang(false);
  });

  if (langSelect) {
    langSelect.addEventListener('change', () => setLang(langSelect.value));
  }
}

/* ---------- Footer: аккордеон на мобильном (открыт один) ---------- */

const footerToggles = document.querySelectorAll('.footer__toggle');

footerToggles.forEach((btn) => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    footerToggles.forEach((other) => {
      other.setAttribute('aria-expanded', 'false');
      document.getElementById(other.getAttribute('aria-controls')).classList.remove('is-open');
    });
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      document.getElementById(btn.getAttribute('aria-controls')).classList.add('is-open');
    }
  });
});

/* ---------- Cookie banner + settings ---------- */

const cookieBanner = document.querySelector('[data-cookie-banner]');
const cookieSettings = document.querySelector('[data-cookie-settings]');
const analyticsBox = document.querySelector('[data-consent-analytics]');
const COOKIE_KEY = 'okvada-consent';

function readConsent() {
  try {
    return localStorage.getItem(COOKIE_KEY);
  } catch (error) {
    return null;
  }
}

function saveConsent(value) {
  try {
    localStorage.setItem(COOKIE_KEY, value);
  } catch (error) {
    // хранилище недоступно — просто закрываем баннер
  }
}

function openCookieSettings() {
  cookieSettings.classList.add('is-open');
  lockPage(true);
  if (analyticsBox) analyticsBox.checked = readConsent() === 'analytics';
  cookieSettings.querySelector('[data-cookie-settings-close]').focus();
}

function closeCookieSettings() {
  cookieSettings.classList.remove('is-open');
  lockPage(false);
}

if (cookieBanner) {
  if (!readConsent()) {
    // Показываем при первом визите с небольшой задержкой
    setTimeout(() => {
      cookieBanner.classList.add('is-open');
      updateBackToTop();
    }, 800);
  }

  document.querySelectorAll('[data-cookie-choice]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.cookieChoice;
      let value = 'necessary';
      if (choice === 'accept') value = 'analytics';
      if (choice === 'save' && analyticsBox.checked) value = 'analytics';
      saveConsent(value);
      cookieBanner.classList.remove('is-open');
      updateBackToTop();
      if (cookieSettings.classList.contains('is-open')) closeCookieSettings();
    });
  });

  document.querySelectorAll('[data-cookie-settings-open]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      openCookieSettings();
    });
  });

  cookieSettings.querySelector('[data-cookie-settings-close]').addEventListener('click', closeCookieSettings);
  cookieSettings.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeCookieSettings();
    trapFocus(cookieSettings, event);
  });
}

if (overlay) {
  overlay.addEventListener('click', () => {
    if (menu && menu.classList.contains('is-open')) closeMenu();
    if (cookieSettings && cookieSettings.classList.contains('is-open')) closeCookieSettings();
  });
}

/* ---------- Back to top ----------
   Показываем после одного экрана скролла, прячем при открытом cookie-баннере.
   Над тёмным блоком и футером ([data-dark]) — стиль Filled, на светлом — Navy. */

const backToTop = document.querySelector('[data-back-to-top]');
const darkBlocks = document.querySelectorAll('[data-dark]');

function isOverDark() {
  const btnRect = backToTop.getBoundingClientRect();
  const x = btnRect.left + btnRect.width / 2;
  const y = btnRect.top + btnRect.height / 2;

  for (const block of darkBlocks) {
    const rect = block.getBoundingClientRect();
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return true;
  }
  return false;
}

function updateBackToTop() {
  if (!backToTop) return;
  const bannerOpen = cookieBanner && cookieBanner.classList.contains('is-open');
  const scrolledScreen = window.scrollY > window.innerHeight;
  const dark = isOverDark();

  backToTop.classList.toggle('is-visible', scrolledScreen && !bannerOpen);
  backToTop.classList.toggle('arrow-circle--filled', dark);
  backToTop.classList.toggle('arrow-circle--navy', !dark);
}

if (backToTop) {
  window.addEventListener('scroll', updateBackToTop);
  window.addEventListener('resize', updateBackToTop);
  updateBackToTop();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}


const revealItems = document.querySelectorAll('.reveal');

if (!reduceMotion && 'IntersectionObserver' in window) {
  root.classList.add('reveal-ready');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => revealObserver.observe(item));
}

/* ---------- FAQ-аккордеон (Services, Careers) ----------
   Несколько вопросов могут быть открыты одновременно.
   «Show all 9 questions» (Services) показывает скрытые вопросы 7–9. */

const faq = document.querySelector('[data-faq]');

if (faq) {
  const faqButtons = faq.querySelectorAll('.faq__btn');

  faqButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const answer = document.getElementById(btn.getAttribute('aria-controls'));
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.hidden = isOpen;
    });
  });

  const moreBtn = faq.querySelector('[data-faq-more]');
  const morePanel = document.getElementById('faq-more');

  if (moreBtn && morePanel) {
    moreBtn.addEventListener('click', () => {
      morePanel.hidden = false;
      moreBtn.hidden = true;
      // Фокус на первый показанный вопрос, чтобы клавиатура не потерялась
      morePanel.querySelector('.faq__btn').focus();
    });
  }
}
