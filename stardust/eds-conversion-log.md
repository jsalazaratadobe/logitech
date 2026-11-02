# EDS conversion log — logitech.com/en-us replica

## Publish decision (2026-11-02)
Decision (made by the run owner before the run, hands-off): **publish**. Every delivered page, the
redirects sheet and the chrome documents (nav, footer and their locale variants) go live on the
aem.live origin (deploy-batch.mjs without `--no-publish`, or POST https://admin.hlx.page/live/…).

## C0 foundation (2026-11-02)
Scope: foundation + header/footer blocks + authored `/nav` and `/footer` documents (no page body blocks).

- **styles/styles.css** — boilerplate demo layer replaced by canon.css tokens, reset (Tailwind-preflight
  border-box), type ramp (`.h1`–`.h5`, `.body-*`, `.rich-text`), `.wrap` / `.block-spacing`, `.btn` family
  and `.cta-dash`, values verbatim. Structural layer kept (body gate, chrome reservation). Additions that
  are runtime necessities, not design values: `img { height: auto }` (#36); `--nav-height` 89px / 113px
  at >= 1024 (measured prototype header heights); EDS buttons mapped strong = `.btn-solid`,
  em = `.btn-outline`, strong+em = `.btn-light`; edit-mode repaint snippets (Step 3 a/b).
  Section model: `main > .section` unconstrained (several prototype sections are full-bleed — blocks
  own their `.wrap`); `.default-content-wrapper` gets the wrap. std-cards / carousel-arrows (shared
  modules) are left to the block unit. BEM class names kebab-cased (`__`/`--` -> `-`) for stylelint.
- **styles/fonts.css** — Brown @font-face verbatim from canon.css, woff2 from www.logitech.com (never
  rehosted). Roboto boilerplate fonts removed. Font stack kept verbatim (line-level stylelint disable).
- **Decode tiers**: header/footer are template-slotted chrome (#95): block JS builds the prototype DOM
  and MOVES authored nodes (ul/li/p/h*) into slots; text is never rebuilt. `@ew-exempt all` declared
  (chrome documents are edited as their own pages). Footer email placeholder is text-as-metadata
  (`@ew-exempt`, read into placeholder/aria-label). Footer section roles are classified by content
  (heading+list = column, heading only = newsletter, icon list = social, list = legal, link+icon =
  wordmark, plain p = support id); header sections are ordered (promo, utility, brand, nav, Shop
  panel, tools).
- **Behaviour** (canon.js): scroll hide/show + shadow on `body > header` (sticky host); toaster rotation
  as a 5 s cross-fade between the authored `<li>`s (node-slotted replacement for canon.js's textContent
  swap). Footer social links + locale are ONE node each, moved between the desktop bar and the mobile
  slot at 840px; link columns render as the 7-col grid >= 840 and as accordions below (one DOM).
- **Legal trademark statement** is not in `/footer`: the rollout plan makes it a page block (`legal`).
- **Icons**: prototype SVGs saved under `icons/` (21 files); header/footer inline the currentColor ones,
  tool icons (fill black) stay as `<img>`. Logo sprite is a CSS background:
  `blocks/header/logi-logo-anim-dark.webp` (code asset). Favicon replaced with the captured one.
- **Links**: home/logo/wordmark -> `/en-us`; every other internal prototype href made absolute
  `https://www.logitech.com/...` (not delivered in this one-page run); external hosts kept.
- **Media**: Shop panel images uploaded to DA `media/nav/` (10 files, stardust/deploy/media-ledger.json).
- **Local harness** (repo served + nav/footer plain.html): header 0.00% pixel diff at 1440 and 360;
  footer-main same box sizes (1440x1003.6 / 360x1080.7) and element boxes identical, residual
  1.2-3.1% is sub-pixel anti-aliasing from the prototype's fractional page offset.
- **Open**: the Shop mega panel, mobile menu drawer, search / Ask Logitech / account UIs and the
  newsletter submission have no open-state styles or endpoint in the prototype (closed state only);
  they are wired for a11y (aria-expanded / hidden) but render as the prototype does. Newsletter POST is
  a dynamics decision. `.eslintignore` gains `stardust/` (tooling + captured artifacts, not served).

## C-archetype en-us (2026-11-02)
Scope: `/en-us` page body — 8 blocks + `content/en-us.html` (DA body format), media under DA `media/en-us/` (62 images,
stardust/deploy/media-ledger.json), hero videos committed under `video/en-us/` (code origin, never content.da.live — #103).

- **Decode tiers**: banner = template-slotted (one DOM; the prototype's duplicated mobile top/bottom and
  >= 840 overlay copies are one `.banner-content` re-ordered by CSS grid below 840); legal = template-slotted;
  sustainability + reasons = template-slotted intro + reconstructive items; quick-links, editorial-cards,
  standard-cards, category-cards = reconstructive (one unit per row, classified by heading/image/link).
- **Section heads** (standard-cards, sustainability, category-cards, reasons) are DEFAULT CONTENT before the
  block and reabsorbed by MOVING the wrapper's children (EW8); in-table head rows accepted as fallback.
- **Banner**: video links (.mp4, absolute code-origin URLs) + poster images authored as content; `@ew-exempt`
  the video links (text-as-metadata). Variant `lead` = page-top banner (heading above the video < 840px,
  625px cap). Behaviour (capture-state promise): autoplay muted playsinline, plays once (no loop), play/pause
  toggle with aria-label swap; the control dot pulses (`animate-pulse`) until `playing`. The terms line's
  `<small>` cannot survive DA: rendered via `.banner-body p:has(a) { font-size: smaller }`.
- **Responsive images**: prototype `<picture><source media>` pairs authored as two images (mobile, desktop);
  blocks wrap them `.media-m` / `.media-d` and switch at 1024px.
- **CTA dash** (editorial / reasons): the authored anchor carries the dash (`::after`) — the source's inner
  `<span>` is not authorable; its end padding moves to the anchor.
- **Std-cards module** (canon.css) is block-scoped inside standard-cards and sustainability (`--peek` columns);
  carousel arrows are generated controls (no authored text).
- `category-cards` header uses a div: the frozen foundation sizes every `header` element to `--nav-height`.
- **Links**: every internal prototype href absolute `https://www.logitech.com/...` (C0 rule); external kept.
- Lint: davids-model 0 🔴 (3 🟡 D1: banner/legal are bespoke components, kept as blocks); delivery-lint clean;
  media-reconcile 62 hosted; block-roundtrip --ew 0 🔴, editable 80/86 (6 exempt video links).
- qa-gate local: 49 ok, 1 expected fail — quick-links h=0 at 1440 (the source hides quick links >= 1024).
- **Published-origin gate** (`gate.sh … --main main`: the live `<main id="main-content">` and the EDS `<main>` are the
  symmetric root). 1440 pub1/pub2/pub3: pixel 0.51 / 0.51 / 1.28 % (top band = video frame timing), Δh 0, overflow ok,
  clip 0; main-root content-diff 🔴 8 → 0 after (a) banner < 840px copy rendered as presentational clones (the
  source duplicates eyebrow/heading/body/CTAs; EW4 stripInstrumentation — authored nodes stay in the overlay) and
  (b) std-card labels as an inner box inside the authored h2 (source `h2 > div.label`, padding replaces margin so the
  heading box measures 43px as the source). 360 pub3: pixel 0.61 %, Δh 0, overflow ok, clip 0, main 🔴 0.
  Remaining 12-13 🔴 are chrome (frozen header/footer) — foundation request filed.
- **Legal band** moves its block wrapper to the top of `body > footer` at decoration (source renders it inside the
  site footer); the emptied page section is removed.
- `stardust/replica/units.json` build selectors gained the EDS selectors (comma lists keep the prototype ones):
  unit-geometry 1440 32 units, 0 off → PASS. 360 unit-geometry measures the origin at its 1440 layout (same FAIL
  shape as the prototype round's 75 ✗) — instrument residual.
- Capture-state promises verified on aem.live: banner videos autoplay muted playsinline, loop=false, `ended` stops
  on the last frame with the label back to "Play video"; toggle swaps pause/play icon + aria-label; the control dot
  pulses while the mp4 is pending (throttled run) and stops on `playing`. Header toaster: 4 messages, one opaque at a
  time, advancing every 5 s, `transition: opacity 0.5s`.
