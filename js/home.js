/* =========================================================
   Okvada — Home: грузовик на картах,
   карточка маршрута, live-статусы, автотабы Why Okvada
   ========================================================= */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Движение точки по ломаной ----------
   Маршрут — список точек "x,y x,y ...". Считаем длины отрезков
   и по доле пути (0…1) находим координаты: обычная математика. */

function parseRoute(text) {
  return text.trim().split(' ').map((pair) => pair.split(',').map(Number));
}

function measure(points) {
  const lengths = [];
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    const dx = points[i][0] - points[i - 1][0];
    const dy = points[i][1] - points[i - 1][1];
    const len = Math.hypot(dx, dy);
    lengths.push(len);
    total += len;
  }
  return { lengths, total };
}

// Возвращает { x, y, segment } для доли пути progress
function pointAt(points, info, progress) {
  let distance = progress * info.total;
  for (let i = 0; i < info.lengths.length; i += 1) {
    if (distance <= info.lengths[i] || i === info.lengths.length - 1) {
      const t = Math.min(distance / info.lengths[i], 1);
      const [x1, y1] = points[i];
      const [x2, y2] = points[i + 1];
      return { x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t, segment: i, t };
    }
    distance -= info.lengths[i];
  }
  return { x: points[0][0], y: points[0][1], segment: 0, t: 0 };
}

const trucks = [...document.querySelectorAll('[data-truck]')].map((el) => {
  const points = parseRoute(el.dataset.route);
  return { el, points, info: measure(points) };
});

/* ---------- Карточка маршрута: синхронно с грузовиком ---------- */

// Города коридора и километры от Гамбурга (пример)
const CITIES = ['HAMBURG', 'KÖLN', 'ANTWERPEN', 'BRUXELLES', 'PARIS', 'LYON'];
const KM = [0, 412, 638, 684, 989, 1454];

const routeFill = document.querySelector('[data-route-fill]');
const routeHandle = document.querySelector('[data-route-handle]');
const routeDone = document.querySelector('[data-route-done]');
const routeEta = document.querySelector('[data-route-eta]');

function updateRouteCard(state) {
  if (!routeFill) return;
  const km = KM[state.segment] + (KM[state.segment + 1] - KM[state.segment]) * state.t;
  const share = km / KM[KM.length - 1];
  const percent = `calc((100% - 10px) * ${share.toFixed(4)})`;
  routeFill.style.width = percent;
  routeHandle.style.left = `calc(5px + ${percent})`;

  const passed = CITIES[state.t >= 1 ? state.segment + 1 : state.segment];
  routeDone.textContent = `${passed} · ${Math.round(km)} KM DONE`;
  routeEta.textContent = share >= 0.999 ? 'ARRIVED THU 14:30' : 'ETA THU 14:30';
}

/* ---------- Цикл анимации ---------- */

const TRIP = 24000;  // 24 с от Гамбурга до Лиона
const STOP = 2500;   // пауза в Лионе
let startTime = null;

function animateTrucks(now) {
  if (startTime === null) startTime = now;
  const elapsed = (now - startTime) % (TRIP + STOP);
  const progress = Math.min(elapsed / TRIP, 1);

  trucks.forEach((truck) => {
    const state = pointAt(truck.points, truck.info, progress);
    truck.el.setAttribute('transform', `translate(${state.x.toFixed(2)} ${state.y.toFixed(2)})`);
    if (truck.el.dataset.truck === 'desktop') updateRouteCard(state);
  });

  requestAnimationFrame(animateTrucks);
}

if (trucks.length) {
  if (reduceMotion) {
    // Без анимации ставим грузовик у Кёльна, как в макете
    trucks.forEach((truck) => {
      const state = pointAt(truck.points, truck.info, 0.28);
      truck.el.setAttribute('transform', `translate(${state.x} ${state.y})`);
    });
  } else {
    requestAnimationFrame(animateTrucks);
  }
}

/* ---------- Live strip: статусы сменяются каждые 4 с ---------- */

const liveStatus = document.querySelector('[data-live-status]');
const STATUSES = [
  'Truck 23 · Hamburg → Lyon · on time',
  'Truck 41 · Kaunas → Antwerpen · loading',
  'Truck 08 · Paris → Köln · on time',
  'Truck 17 · Rhauderfehn · service check',
];
let statusIndex = 0;

if (liveStatus && !reduceMotion) {
  setInterval(() => {
    liveStatus.classList.add('is-fading');
    setTimeout(() => {
      statusIndex = (statusIndex + 1) % STATUSES.length;
      liveStatus.textContent = STATUSES[statusIndex];
      liveStatus.classList.remove('is-fading');
    }, 400);
  }, 4000);
}

/* ---------- Why Okvada: автотабы ----------
   6 с на таб, прогресс — CSS-анимация линии сверху.
   Media toggle по центру фото: клик (desktop) или тап по фото (mobile) — пауза,
   на паузе виден Play. Клик по табу или стрелке останавливает автолистание.
   Автолистание останавливается после одного полного круга. */

const ADVANTAGES = [
  {
    title: ['60+ trucks.', 'All of them ours.'],
    bullets: [
      'Mercedes-Benz EURO 6 curtainsiders, 13.6 m',
      'GPS on every truck — tracking link with your order',
      'Maintained at our own service point in Rhauderfehn',
    ],
    tile: ['OWN FLEET · 2026', '60+', 'own Mercedes-Benz trucks with GPS, maintained at our own service point.', 'own trucks with GPS'],
  },
  {
    title: ['€300,000 cover.', 'On every load.'],
    bullets: [
      'CMR insurance up to €300,000 per load',
      'Claims handled by our team, not passed back to you',
      'Policy copy sent on request for supplier checks',
    ],
    tile: ['CMR COVER · 2026', '€300k', 'cargo cover per load, included in every rate.', 'cover per load'],
  },
  {
    title: ['Audited every year.', 'Ready for your tender.'],
    bullets: [
      'ISO 9001 quality and ISO 14001 environmental management',
      'TAPA TSR security standard for high-value cargo',
      'Certificate status and audit dates shared on request',
    ],
    tile: ['CERTIFICATES · 2026', '3', 'active certificates, valid until 2027.', 'active certificates'],
  },
  {
    title: ['One manager.', 'Booking to signed CMR.'],
    bullets: [
      'One contact for the quote, loading and delivery',
      'Status updates by email or messenger at every stop',
      'Signed CMR and invoice sent after delivery',
    ],
    tile: ['PER LOAD', '1', 'manager who follows your cargo from booking to signed CMR.', 'manager per load'],
  },
];

const adv = document.querySelector('[data-adv]');

if (adv) {
  const tabs = adv.querySelectorAll('[data-adv-tab]');
  const photos = adv.querySelectorAll('[data-adv-photo]');
  const panel = adv.querySelector('[data-adv-panel]');
  const title = adv.querySelector('[data-adv-title]');
  const bullets = adv.querySelector('[data-adv-bullets]');
  const tileLabel = adv.querySelector('[data-adv-tile-label]');
  const tileNum = adv.querySelector('[data-adv-tile-num]');
  const tileLong = adv.querySelector('[data-adv-tile-long]');
  const tileShort = adv.querySelector('[data-adv-tile-short]');
  const toggle = adv.querySelector('[data-adv-toggle]');
  const photoStage = adv.querySelector('[data-adv-photo-stage]');
  const isTouch = window.matchMedia('(hover: none)').matches;
  let flashTimer = null;

  let current = 0;
  let stepsDone = 0;

  function render(index) {
    const data = ADVANTAGES[index];
    panel.classList.add('is-switching');
    setTimeout(() => {
      title.innerHTML = data.title.map((line) => `<span>${line}</span>`).join('');
      bullets.innerHTML = data.bullets.map((item) => `<li>${item}</li>`).join('');
      [tileLabel.textContent, tileNum.textContent, tileLong.textContent, tileShort.textContent] = data.tile;
      panel.classList.remove('is-switching');
    }, 250);

    photos.forEach((photo, i) => photo.classList.toggle('is-active', i === index));
  }

  function select(index, byUser) {
    current = (index + tabs.length) % tabs.length;
    tabs.forEach((tab, i) => {
      const isActive = i === current;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tabs[current].id);
    render(current);
    // выбор вручную останавливает автопрокрутку
    if (byUser) stopAutoplay();
  }

  // Стоп: таб/стрелка или конец круга. Прогресс-линия заполнена.
  function stopAutoplay() {
    adv.classList.remove('is-paused');
    adv.classList.add('is-stopped');
    toggle.setAttribute('aria-label', 'Play');
  }

  // Пауза пользователем: линия замирает, Play виден постоянно
  function pauseAutoplay() {
    adv.classList.add('is-paused');
    toggle.setAttribute('aria-label', 'Play');
  }

  function playAutoplay() {
    toggle.setAttribute('aria-label', 'Pause');
    if (adv.classList.contains('is-paused')) {
      adv.classList.remove('is-paused'); // продолжаем с того же места
      return;
    }
    // после остановки — новый круг с текущего таба
    stepsDone = 0;
    adv.classList.remove('is-stopped');
    const bar = tabs[current].querySelector('.tab__progress');
    bar.style.animation = 'none';
    void bar.offsetWidth;
    bar.style.animation = '';
  }

  function toggleAutoplay() {
    const isRunning = !adv.classList.contains('is-paused') && !adv.classList.contains('is-stopped');
    if (!isRunning) {
      playAutoplay();
      return;
    }
    pauseAutoplay();
    // Mobile: Pause мелькает ~1 с, потом остаётся Play
    if (isTouch) {
      toggle.classList.add('is-flash');
      clearTimeout(flashTimer);
      flashTimer = setTimeout(() => toggle.classList.remove('is-flash'), 1000);
    }
  }

  // Конец CSS-анимации прогресса = переход к следующему табу.
  tabs.forEach((tab) => {
    tab.querySelector('.tab__progress').addEventListener('animationend', () => {
      stepsDone += 1;
      if (stepsDone >= tabs.length) {
        stopAutoplay(); // один полный круг — и стоп (WCAG 2.2.2)
        return;
      }
      select(current + 1, false);
    });

    tab.addEventListener('click', () => select(Number(tab.dataset.advTab), true));

    // Стрелки клавиатуры внутри tablist
    tab.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      const next = current + (event.key === 'ArrowRight' ? 1 : -1);
      select(next, true);
      tabs[current].focus();
    });
  });

  adv.querySelector('[data-adv-prev]').addEventListener('click', () => select(current - 1, true));
  adv.querySelector('[data-adv-next]').addEventListener('click', () => select(current + 1, true));

  if (reduceMotion) {
    // Без движения: автолистания нет, табы только по клику — кнопка не нужна
    stopAutoplay();
    toggle.hidden = true;
  } else {
    // Клик по кнопке или по фото (на телефоне кнопка не видна до тапа)
    photoStage.addEventListener('click', toggleAutoplay);
  }

  // Автопрокрутка стартует, только когда секция видна
  if ('IntersectionObserver' in window) {
    adv.classList.add('is-offscreen');
    const advObserver = new IntersectionObserver((entries) => {
      adv.classList.toggle('is-offscreen', !entries[0].isIntersecting);
    }, { threshold: 0.4 });
    advObserver.observe(adv);
  }
}
