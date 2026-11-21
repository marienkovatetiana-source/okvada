# Okvada

A website for Okvada, a Lithuanian road freight company: full truck loads and groupage across Europe, own Mercedes-Benz fleet, head office in Kaunas and a service point in Germany.

This is a real project for a real client. The repository keeps the original version as designed and built, before any content updates by the client.

**My role:** UI design in Figma and front-end development, from layout to a working static site.

**Live demo:** https://marienkovatetiana-source.github.io/okvada/

## Pages

Home, Services, About, Careers, Contact, Thank you, Legal notice, Terms of carriage, Privacy policy, 404.

## What is inside

- **Design system in code.** Colours, type, spacing, radii, shadows, motion and z-index are CSS custom properties in `css/tokens.css`. Components (buttons, arrow links, form fields, cards, accordion, cookie banner, menus) share one hover, focus and disabled system.
- **Responsive.** Mobile first: 320–767 mobile, 768–1199 tablet, 1200 and up desktop. The content container stops growing at 1440.
- **Motion with restraint.** Reveal on scroll, section overlap and a stacked card list on desktop, auto-advancing tabs. All of it is off for `prefers-reduced-motion`.
- **Accessibility.** Semantic landmarks, visible `:focus-visible`, dialogs with focus trap and Esc, labelled icon buttons, form errors tied to fields.
- **Performance.** No frameworks, self-hosted fonts (woff2, `font-display: swap`), WebP images with `srcset` and `sizes`, explicit image dimensions so the layout does not jump.
- **SEO basics.** Canonical links, Open Graph and Twitter tags, favicons, `robots.txt`, `sitemap.xml`, JSON-LD (Organization, LocalBusiness).
- **Older browsers.** Fallbacks for `color-mix`, container query units and `svh`.

## Key decisions

- **Tokens instead of raw values.** Every colour, size, radius, shadow, duration and z-index comes from a named token in `css/tokens.css`; no colour is written outside that file. Why: a design change is made in one place, and the layout stays consistent across ten pages.
- **Motion kept short and optional.** One easing and four durations, a fixed list of effects, no parallax, no counters. Desktop-only effects (section overlap, stacked cards) switch off on smaller screens and for `prefers-reduced-motion`. Why: movement should support reading, not compete with it.
- **Mobile first, simplified tablet.** The layout is built for 375, then widened. Tablet reuses the desktop blocks with fewer columns, and heavier effects start at 1200. Why: the small screen is the hardest case, so solving it first keeps the content focused, and one simple tablet layout is easier to keep correct than a third design.
- **Plain HTML, CSS and JS.** No runtime framework. Why: the pages are easy to read and port into a CMS theme later, and nothing has to hydrate before the content shows.

## Result

- 10 pages, about 7,200 lines of CSS and 800 lines of JS, no runtime dependencies.
- Home loads about 11 kB of gzipped CSS and 5 kB of gzipped JS, before images and fonts.
- Fonts are self-hosted (five woff2 files, about 117 kB) and photos are WebP with two sizes each.
- Page heights were compared at 375 and 1440 after each change, so edits do not shift the layout.

## Stack

Plain HTML, CSS and JavaScript. Vite is used only to bundle and minify; there is no runtime framework.

## Run locally

```bash
npm install
npm run dev      # development server
npm run build    # production build into dist/
npm run preview  # serve dist/ locally
```

## Structure

```
index.html, services.html, about.html, ...   pages
css/        tokens, base, components and one stylesheet per page
js/         shared behaviour (main.js) and page scripts
assets/     icons sprite, fonts, images, map graphics
docs/       design decisions, token notes, component states (in Russian)
```

## Notes

- This is a design and front-end showcase. The contact form validates and shows its states (sending, error, failed, success) but does not send anything.
- The language switcher shows EN / DE, but only the English version exists. A German version is planned.
- Cookie and analytics settings are interface only; no analytics are loaded.
