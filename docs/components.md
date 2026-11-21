# Компоненты (CSS-классы)

Статичная вёрстка: компонент = класс в `css/components.css` (поля формы Contact — `css/contact.css`, карточка кейса — `css/home.css`). Новые параллельные классы (`.btn`, `.card`) не заводим: роль кнопки выполняет `.pill`, роль карточки — `.case`. Всё только на токенах из `css/tokens.css`. Историй Storybook нет (не используем).

Общий фокус: `:focus-visible` в `base.css` (контур 2 px `--color-teal`, отступ 3 px); у отдельных компонентов свой, ниже.

## Единая система hover и focus (20 Nov)
Одно правило на тип элемента; новый компонент берёт правило своего типа, а не придумывает своё.
| Тип | Hover | Focus (`:focus-visible`) | Active |
|---|---|---|---|
| Основная кнопка `.pill` | заливка `teal`, текст `navy`, кружок `navy` со стрелкой `teal`, стрелка +4 px | контур teal 2 px, отступ 3 px (глобальный) + стрелка +4 px | scale 0.98 |
| Второстепенная `.pill--outline` | инверсия: фон `navy`, текст `surface`, кружок `teal` | то же | scale 0.98 |
| Ссылка со стрелкой `.link-arrow` | кружок заливается `navy`, подпись `teal-text`, стрелка +2 px | то же | — |
| Пункт меню `.nav__link` | текст `teal-text` и увеличение ×1.05, без линии; у активного пункта: `teal-text` + постоянная линия `teal` 2 px, без увеличения | то же | — |
| Пункт мобильного меню | фон `muted`, текст и стрелка `teal-text`, стрелка +3 px | то же | — |
| Текстовая ссылка на светлом (ink / navy) | `teal-text` | то же | — |
| Текстовая ссылка `teal-text` (`.text-btn`, `.faq__show-all`) | `navy` | то же | — |
| Ссылка на тёмном (футер, оглавление, контакты менеджера) | `teal` (+ подчёркивание у контактов) | то же | — |
| Круглая кнопка-стрелка `button.arrow-circle` | заливка `navy`, иконка `surface` | то же | — |
Teal как текст на светлом не используется (1.8–1.95 : 1): на светлом он только линия или заливка с navy-текстом. Disabled — без hover.

## Иерархия текста и теги
- Абзацы-описания (`.t-body-m`, `.t-body-l`) — `navy`; `ink-muted` (`.text-secondary`) только для подписей, меток и данных (`.t-body-s`, `.t-data`) и акцентной строки заголовка.
- Тег `.tag` — тёмная плашка: фон `navy`, текст `surface`, без отдельной рамки (рамка того же цвета держит размер).

## Кнопка `.pill`
Для чего: главное действие (отправка, CTA, cookie). Разметка: `<a|button class="pill"><span class="pill__label">…</span><svg class="icon">…</svg></a>`.
| Вариант | Класс | Вид |
|---|---|---|
| основная | `.pill` | фон `navy`, текст `surface`; hover — teal (см. систему выше) |
| второстепенная | `.pill--outline` | фон `canvas`, рамка `navy` |
| на всю ширину | `+ .pill--block` / `--block-center` | |
Состояния:
- default; **hover** — заливка teal / инверсия, стрелка +4 px (таблица выше);
- **focus** — контур teal (глобальный), стрелка сдвигается;
- **active** — кнопка сжимается (scale 0.98);
- **loading** — `.is-loading`: текст заменяется «Sending…», круг крутится, клики отключены;
- **disabled** — `aria-disabled="true"` (кнопка остаётся в фокусе; пояснение рядом через `aria-describedby`) или атрибут `disabled`: фон и рамка `line`, текст `ink-muted` (5.4 : 1), курсор `not-allowed`, без hover.
Контраст: `surface` на `navy` 15.4; `navy` на `canvas` 14.3; disabled `ink-muted` на `line` 5.4.

## Поле формы `.field`
Для чего: текст, e-mail, textarea. `.field > .field__label + .field__control (+ .field__error)`; textarea — `.field__control--textarea`.
Состояния: default (рамка 1.5 px `navy`, 15.4 : 1 на белом); focus (контур teal); **error** — `.field.is-error`: рамка 2 px `danger`, под полем `.field__error` (`danger`, 5.2 : 1); **disabled** — `:disabled`: фон `muted`, рамка `line`, текст `ink-muted`, `not-allowed`. Placeholder `ink-muted` (6.3 : 1).
Радиус `--radius-lg`, высота 48, размер текста `--text-body` (16, не меньше).

## Select `.select` / `.field__select`
Нативный `<select>` + иконка поверх. Рамка 1.5 px `ink-muted` (7.1 : 1; граница интерактивного элемента ≥ 3 : 1). Hover / focus — рамка `navy`. **Disabled** — `:disabled`: фон `muted`, рамка `line`, `not-allowed`.

## Чекбокс `.checkbox`
Скрытый `input` + `.checkbox__box`. Рамка `navy`, checked — заливка navy и галочка, `:focus-visible` — контур у бокса, `:disabled`, ошибка — рамка `danger` 2 px (`.is-error`).

## Карточка кейса `.case` (home)
Для чего: кейс с фото. Фото, плашка `.case__tag`, текст, `.arrow-circle`. Радиус `--radius-xl`. Hover — фото увеличивается, стрелка активна; `:focus-visible` — то же для клавиатуры. Disabled не применим (карточка не может быть отключена).

## Навигация
Desktop `.nav` (в шапке, от 1200 px): пункты hover, активный `is-active` + `aria-current="page"`. Mobile `.mobile-menu` (оверлей, `.is-open`, закрытие по Esc, focus trap): `.mobile-menu__link` hover / `is-active`. Кнопка меню — `.icon-btn` (hover: фон `muted`, зона 44 px).

## Что не проверено
Disabled проверен подстановкой атрибутов на Contact (вычисленные стили и скриншот); на страницах такого состояния сейчас нет — компонент готов, когда понадобится. Hover и focus реальных страниц не пересматривал: правил не менял.

## Перекрытие секций и стопка карточек (desktop, 20 Nov)
Включается только от 1200 px и при `prefers-reduced-motion: no-preference`; на mobile, tablet и у чувствительных к движению пользователей страница остаётся обычной. Чистый CSS (`position: sticky`) плюс 10 строк JS.
- **Перекрытие секций:** секции с `data-overlap` закрепляются, следующая секция наезжает на них с тенью `--shadow-up`. Где стоит: Home (hero → About, Careers → Final CTA), Services (`#ftl` → `#ltl`, `#faq` → Final CTA), About (последняя секция → Final CTA). `js/main.js` пишет высоту секции в `--stick-h`: секция выше экрана закрепляется нижним краем, её низ не прячется. Новая секция в перекрытии: добавить `data-overlap`, следующая секция должна быть в `<main>` напрямую.
- **Стопка карточек:** `.service-row` на Home («What we carry») — карточки surface с радиусом `2xl` и тенью `--shadow-raised`, закрепляются с шагом 32 px и наезжают друг на друга; при появлении «раскрываются» через `animation-timeline: view()` (если браузер умеет, иначе без раскрытия).

## Анимация: общий стиль (20 Nov)
- **Easing:** один, `--ease` (cubic-bezier .22 .61 .36 1). `linear` только для циклов и scroll-driven.
- **Скорость:** `--duration-fast` 150 мс (цвет, рамка, чекбокс, пункт списка) · `--duration` 250 мс (hover, выпадающее меню языка, аккордеон, затемнение, fade панелей) · `--duration-slow` 400 мс (мобильное меню, sheet, cookie, подъём карточек, смена live-статуса) · `--duration-slower` 700 мс (зум фото, смена фото в табах, появление секций).
- **Движение:** стрелка при hover +4 px, зум фото при hover ×1.05, нажатие кнопки ×0.98, появление секции — подъём на 24 px.
- **Циклы** (свой период у каждого, токенами не считаются): hero-zoom 24 с, tab-progress 6 с (равен интервалу автотабов в JS), pulse 1.8 с, spin 900 мс.
- Новая анимация берёт ступень по роли, не придумывает число. В JS задержки должны совпадать с CSS (смена live-статуса 400 мс = `--duration-slow`).
