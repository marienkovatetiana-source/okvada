# Okvada — final UI design decisions (30 Oct 2026, updated 4 Nov 2026)

Figma file: Okvada (06ISviKP4JoWAxecNOgJUb). Full card: page 03.2 · Docs → "Final UI — design decisions" (273:3347).
Visual direction approved. Copy, photos and video are still prototype placeholders — revise when real content arrives.
This doc holds only current decisions. When a decision is dropped, its line is deleted, not archived.

## Colour
- Light theme everywhere. Navy = primary accent, teal = secondary.
- Dark card panels use footer navy: panel bg/inverse-strong, inner cards bg/inverse.
- One dark accent block per page; never two dark blocks in a row. Section backgrounds alternate canvas / muted / surface (set in masters).

## Headings
- Label = 8 px teal dot + mono caps. Two-line editorial heading, second line indented.
- Second line grey only in page heroes; teal in all other sections and on single-section system pages.
- No numbering on section eyebrows or page index links (Services: FULL LOADS, GROUPAGE, OUR FLEET; hero index without 01–05). Numbered cards and steps stay: What we offer, How we work, form steps, timelines.

## Buttons & arrows
- Pill (navy) for primary, Pill outline (white + navy circle) for header/secondary. Pill has a Loading state (loader in the arrow circle).
- Arrow circle component: Direction (Right / Left / Down / Up) × Style (Outline, On dark, On accent, Filled, Navy) × Size 36/40/48. Up exists only in Navy 48 and Filled 48 (used by Back to top).
- Media toggle component (03 · Components): Icon = Pause / Play, 56 navy circle (bg/inverse, size/control/lg), white 24 icon.
- Back to top: Arrow circle Up 48, fixed bottom-right, 32 px from the edges on desktop / 16 px on mobile. Navy on light sections, Filled (light circle, navy arrow) over the dark block and the footer. Only on long pages: Home, Services, About, Careers, Contact (mobile). Not on Thank you, Legal, Terms, Privacy, 404.
- Touch targets: visual sizes follow the mockup (arrow links 40, tabs 38, Media toggle 56, Pill 48, Back to top 48); the 44 px hit area is extended invisibly, without shifting the layout.
- Mobile carousels (Cases, What we offer) have no swipe hint: the next card peeking in is the cue.

## Radius scale
- 2xl 20 / xl 16 (mobile): large containers. xl 16 / lg 12: photos, cards, maps. lg 12 / md 8: cards inside panels. full 999: pills, circles.
- Square on purpose: stat tiles (60+, 10th) and dissolving hero photos.

## Spacing (audit 3 Nov 2026)
- All section paddings and gutters are bound to Layout tokens; no raw values on section roots.
- Section padding: desktop 96 / 96 (`section/desktop`); mobile 32 top / 48 bottom (`section/mobile-top`, `section/mobile-bottom`) — 80 px between sections on mobile, air kept at background changes. No extra gap between sections.
- Page heroes (Services, About, Careers, Contact): 64 top (`space/3xl`) / 96 bottom desktop; 32 / 48 mobile.
- System pages (Legal, Terms, Privacy, Thank you): 64 top / 128 bottom desktop; 32 / 48 mobile. 404: 128 / 128 desktop, 64 / 64 mobile.
- Heading → content: 56 desktop / 32 mobile (`section/heading-desktop`, `section/heading-mobile`) wherever content sits under the heading block. Inside two-column blocks (photo | text: FTL, LTL, Trailer, Requirements, Apply) heading → lead stays 20–24.
- Lists under a heading are wrapped in their own frame (Driver FAQ → Questions, Transit times mobile → Content), so the list gap stays separate from the heading gap.
- Geography: 24 px between intro paragraph and stats; mobile stats are two equal columns, labels wrap.
- Raw values kept on purpose: Hero top 170 desktop / 104 mobile (under the header), About gap 28, Why Okvada panel inset 14 (aligned with tab text).

## Auto layout (4 Nov 2026)
- Every section master on 03.1 is built in auto layout, including Hero editorial, About editorial and Why Okvada.
- Overlays on photos and maps (chips, badges, status cards, stat tiles, case card tag/content, route card) sit in the auto-layout flow; photos, fades and overlays behind them are absolute children.
- Free-form on purpose: maps and dot grids, icons, the Hero photo layers, word band, giant "okvada" and mini map (absolute inside the hero).
- Staggered card rows (Cases, What we offer mobile) keep the step through transparent "Offset" slots with top padding 48 / 44 / 40.
- About editorial: Stats | Photo | Aside 28 px apart, Aside bottom-aligned; mobile Head → 32 → Photo, Stats, Aside 24 apart.
- Why Okvada: heading → tabs 56 / 32, tabs → content 48 desktop / 24 mobile.

## Home order
Hero editorial → About → Client stories → Why Okvada → What we carry → Proof → Geography → Careers teaser → Let's work together.
- Hero: video (planned), giant "okvada", Pill CTA, corridor mini-map aligned to CTA bottom (desktop) / live pill (mobile).
- Cases anonymous (no logos without written consent).
- Why Okvada: 4 auto-advancing tabs. Tabs 02–04 copy is generated in code (listed in "To confirm with client").
- Why Okvada pause: Media toggle centred on the photo, hidden by default (section property "Pause control"). Desktop: appears on hover and keyboard focus, click pauses. Mobile: tap on the photo pauses, Pause flashes ~1 s. While paused, Play stays visible. Tapping a tab or arrow also stops autoplay.
- Geography mobile map: "Weekly corridor" legend sits right under the live strip (top 50 inside the map), clear of the Hamburg label. The corridor line may cross the Rhauderfehn label — on purpose.

## Inner pages
- Shared inner hero; spec rows; timelines; certificates show status only (no public PDFs).

## States (04 · UI → section "States")
- Cookie banner on first visit; Cookie settings: desktop modal / mobile bottom sheet (Necessary always on, Analytics opt-in).
- Language menu open on desktop header (EN / DE); mobile uses the native select in the Mobile menu.
- Mobile menu open over a 60 % navy overlay (Mobile menu is 375 wide).
- Contact form: Error, Sending (Pill Loading), Failed (Form alert + "Try again"). Lead form has a State property.
- Thank you outside office hours: same layout as Thank you, no reply-time promise.
- Why Okvada: hover with Pause (desktop), paused with Play (mobile).
- FAQ sections show the first question open.
- Back to top: Services desktop (Filled over the dark Fleet block) and mobile (Navy on a light section).

## Wireframes
Low-fi detached snapshots (grey bars) — document the early stage; UI is the source of truth.

## Motion (dev)
- Tabs auto-advance 5–6 s, top line = progress, autoplay stops after one full cycle; prefers-reduced-motion: no autoplay. Map truck dot synced with route card; hero video + mini-map dot.
- Hero: photo zooms in slowly, no parallax on the photo (video planned). Giant "okvada" is static and overlaps the truck as in the mockup.
- Sections fade in on scroll; images have fixed aspect ratio and load lazily below the fold, so nothing jumps. No count-up numbers, no copy or elements beyond the mockup.
- Back to top: fades in after one screen of scroll, smooth scroll to the top on click, hidden while the cookie banner is open. Switches to Filled over the dark block and the footer.
- Kept on purpose: pulsing dots on live pills, live status cross-fade every 4 s (Geography), photo zoom on hover (Cases, Services), card lift on hover (Cases).
