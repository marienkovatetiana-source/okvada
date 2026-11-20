# Компоненты (CSS-классы)

Статичная вёрстка: компонент = класс в `css/components.css` (поля формы Contact — `css/contact.css`, карточка кейса — `css/home.css`). Новые параллельные классы (`.btn`, `.card`) не заводим: роль кнопки выполняет `.pill`, роль карточки — `.case`. Всё только на токенах из `css/tokens.css`. Историй Storybook нет (не используем).

Общий фокус: `:focus-visible` в `base.css` (контур 2 px `--color-teal`, отступ 3 px); у отдельных компонентов свой, ниже.

## Кнопка `.pill`
Для чего: главное действие (отправка, CTA, cookie). Разметка: `<a|button class="pill"><span class="pill__label">…</span><svg class="icon">…</svg></a>`.
| Вариант | Класс | Вид |
|---|---|---|
| основная | `.pill` | фон `navy`, текст `surface` |
| второстепенная | `.pill--outline` | фон `canvas`, рамка `navy` |
| на всю ширину | `+ .pill--block` / `--block-center` | |
Состояния:
- default; **hover** — фон `navy-raised` (outline: `muted`), стрелка сдвигается на 3 px;
- **focus** — контур teal (глобальный), стрелка сдвигается;
- **active** — круг стрелки сжимается (scale .94);
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
