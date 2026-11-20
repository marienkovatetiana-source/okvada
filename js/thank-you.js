// Thank you: вариант «вне рабочих часов» (Figma 294:28668 / 294:28798).
// Открывается по адресу thank-you.html#outside-hours — в макете это тот же экран с другими текстами.
// В WordPress вариант выбирает сервер по времени отправки (Mon–Fri 8:00–18:00 EET).

function showOutsideHours() {
  const isClosed = location.hash === '#outside-hours';

  document.querySelectorAll('[data-ty-office]').forEach((item) => {
    item.hidden = isClosed;
  });

  document.querySelectorAll('[data-ty-closed]').forEach((item) => {
    item.hidden = !isClosed;
  });
}

showOutsideHours();
window.addEventListener('hashchange', showOutsideHours);
