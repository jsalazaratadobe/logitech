# Stardust journal — logitech.com/en-us replica

## Extract — single-page live capture of the US home page (2026-11-02)
- `crawl.mjs --pages en-us --dynamics`: 1/1 captured headless (no bot wall), HTTP 200, 38 headings, 96 CTAs; rendered DOM + full-page screenshot saved.
- Vision check: ok. Crawl screenshot shows the OneTrust consent banner and a timed "15% off" email modal; dismiss selectors recorded in `stardust/replica/dismiss.txt` for every live capture.
- Style census at 1440 + 360 → `current/_computed-styles.json`; cap-probe → `current/DESIGN.json` extensions.breakpoints (content max 1568px, shell fluid, probe 2560).
- Fonts: Brown Logitech Web Pan (licensed). Served by www.logitech.com with ACAO `*`; decision: reference it from the owner's own origin (no rehost), metric-close fallback after the brand name.
- Capture gaps: 71 first-level /en-us targets uncaptured — out of scope by run definition (one-page run).

## Preserve direction — bounded-single spec, empty register, dynamics triaged (2026-11-02)
- Bounded promotion branch (no `current/PRODUCT.md`): lifted the census into `stardust/replica/tokens.json` (palette 11, type ramp per 1440/360, buttons, radii, container 1568px) and synthesized `PRODUCT.md` / `DESIGN.md` / `DESIGN.json` at the root with provenance `bounded-single`; `DESIGN.json` added to `.hlxignore`.
- `stardust/direction.md` written (preserve mode); register empty — pure replica. No target breakpoints.
- Dynamics: detector 49 findings → curated to 9 features in `stardust/dynamic-features.md` + `-plan.md`; every row has a disposition; hands-off interim tiers, no decided-out rows.
- Martech (owner asked to keep tags/consent): server HTML carries no tag stack (SvelteKit injects it), so spec-martech ran against the rendered capture served locally; OneTrust domain script + 3 rule sets recorded. Project vendor table gained a generic self-hosted Tealium loader (`/utag.js`); gtag loaders are Tealium-injected and left out of the routes. Contract: OneTrust CMP + Tealium route, all disabled; tagNotes cite utag.js load rules gated on OptanonConsent. Scaffold of `scripts/martech.js` runs before deploy.
- Publish decision recorded in `stardust/eds-conversion-log.md`.

## Recreate + source-fidelity gate — home page archetype passes at 1440 and 360 (2026-11-02)
- `stardust/prototypes/en-us-proposed.html` + `canon.css`/`en-us.css` + `canon.js`/`en-us.js`, clean re-authoring from the capture; media harvested to `stardust/current/assets/img/` (map `media.json`); Brown referenced from the owner's origin.
- 4 rounds per width (3 iterations + a `--full` confirmation after mirroring live's `text-wrap: balance` on the headings that compute it). Final: 1440 pixel 0.51%, Δh 0, content 0🔴/0🟡, clip 0; 360 pixel 0.64%, Δh 0, content 0🔴/0🟡, clip 0; cap-probe PASS at 2560; gate-all prototype rows PASS both widths.
- Residuals (capture-state, logged in `stardust/replica/progress.json`): rotating promo toaster (360 header crop 3.25%), per-session footer support ID, late "Ask Logitech" button, hero video frame, third-party chat bubble.
- Motion: header hide/show on scroll, editorial parallax, hero video play-once + toggle, promo rotation; 10 hover families inert on live → no hover CSS.
- Instrument notes: gate-all needs `prototypePath` in state (ran on a state copy before approval); unit-geometry origin cache is not keyed by width — stale copies moved to `.work`.
- State: en-us approved (hands-off). `scripts/martech.js` scaffolded (all off).

## A-inventory — archetype rendered into the migrated tree, 1-page roster (2026-11-02)
- `migrate.mjs render en-us` → `stardust/migrated/en-us/index.html` (approved-page branch; 117 off-scope links stay to be repointed in E2); modules recorded (8 block ids).
- `inventory.mjs`: 1 page, 1 template, path `/en-us`; rollout.json site = aemcoder/73326f3f, live host main--73326f3f--aemcoder.aem.live.
- Source root `https://www.logitech.com/` 301 → `/en-us`: the page is delivered at `/en-us`; the redirects sheet carries `/` and `/index.html` → `/en-us` (D-site).

## B-block — 8 distinct blocks, each converted once on the archetype (2026-11-02)
- `blocks.mjs` + `plan.mjs`: quick-links, banner, editorial-cards, standard-cards, sustainability, category-cards, reasons, legal — all convert on en-us (representative).

## B2-dynamic — dynamic surface already triaged against today's evidence (2026-11-02)
- Detector evidence from 19:17Z today with `--target-origin` probed (4/4 first-party API paths host-bound); `stardust/dynamic-features.md` has a disposition on all 9 curated rows. Pre-import gate passes.

## C-deliver — foundation, archetype, gate-all and final units done; home page passes on the published origin (2026-11-02)
- Units: foundation (nav/footer live, styles frozen) → archetype en-us (live, pub3 1.28% / 0.61%) → cluster en-us (0 siblings) → gate-all → final.
- C-final applied the one queued foundation request: header tool icons now use the source's own data-URI glyphs (byte-identical encoding), "Shop your way" tiles are whole-card links. Chrome content-diff 🔴 13 → 8; the 8 left are granularity residuals (source duplicates labels/social/locale per layout; the build moves one authored copy, EW1). The "static vs sticky header at 390" finding was an instrument artifact: chrome-explore's source record was a 403 error page; a direct probe shows identical sticky/hide-on-scroll behaviour.
- gate-all (one-row `--state stardust/rollout/gate-state.json`, since state.json has no `deployed` writer): 1440 0.5% / 360 0.63%, Δh 0, clip 0, content 0, units pass. unit-geometry caches the origin inventory per slug, not per width — the first 360 run reused the 1440 inventory and failed `units`; the cache was cleared and 360 re-run.
- Next: D-site — the site root `/` still answers 404; deliver the home page as the root `index` document.

## D-site — root answers via the redirects sheet, chrome noindex, served sitemap matches (2026-11-02)
- Source root `https://www.logitech.com/` 301s to `/en-us` (browser-checked; curl gets 403), so `/redirects.json` carries `/` and `/index.html` → `/en-us` (PUT 201, preview + live 200); `curl -sIL` on `/` ends in 200 on aem.page and aem.live.
- `/nav` and `/footer` gained a `Robots | noindex` metadata row and were re-published (served `<meta name="robots" content="noindex">`).
- `assemble.mjs --verify-origin`: served sitemap 1 = assembled 1, extra 0, missing 0.

## D2-dynamic — header menus built, parity replayed on the published origin (2026-11-02)
- Found the header's Shop mega panel and mobile drawer had never been implemented (prototype canon `.mega { display: none }`, menu button inert). A subagent built both in blocks/header from the source's measured layout (panel crop vs source 0.008% at 1440, drawer 0.10% at 390, at-rest header 0 px). Re-gated: pub5 1440 0.51% / 360 0.45%; gate-all 1440 0.5% / 360 0.63% all four criteria PASS.
- Gate noise: the source began answering 403 to measuring browsers for a few minutes; one unit-geometry origin inventory came back as a 900px blocked page and was cached under the slug — moved aside, re-run. The eds-side reasons-grid text box read 83 px before the web font swapped (104 px settled, equal to source).
- `stardust/dynamics/parity.json`: 9 features, 10 checks — all PASS (`stardust/qa/dynamics-report.md`): martech gate (no tag host requested), consent-gate, newsletter form, menus, account/cart, locale, no page errors on `/` and `/en-us`, banner video playing. Owner rows stay interim / scaffolded-awaiting-owner.

## E-full-site — 1/1 page verified on aem.live (2026-11-02)
- verify.mjs requests `/en-us/` (migrated file is `en-us/index.html`), which 404s on EDS; added `/en-us/` → `/en-us` to the redirects sheet (also serves visitors), re-published; re-run with `--all`: 1 checked, 1 verified.
- Render check: banner video playing (dynamics-check video-plays Δt 0.81 s), promo bar rotates on its 5 s timer, no page errors on `/` and `/en-us`; gate table re-applied (1440 0.5% / 360 0.63% PASS).

## E2-link-audit — no 404 on the delivered origin; 75 source-origin targets kept as scope extension (2026-11-02)
- 100 distinct hrefs across /en-us, /nav, /footer: 7 delivered-origin targets all 200; 75 www.logitech.com targets repointed to the source by design (decision in direction.md); 23 external links kept verbatim (curl sees bot walls 403 on some logitech properties, 520 on twitter — source behaviour, unchanged).

## F-optimize — health 100/100, 0 open findings (2026-11-02)
- run-1: P2 ai-search/jsonld (no JSON-LD). The source carries two JSON-LD objects (BreadcrumbList, Organization); authored verbatim as a `json-ld` metadata row on /en-us, which the delivery pipeline renders natively as `<script type="application/ld+json">` (served payload equals the source's). A scripts.js emitter added first was redundant and reverted.
- run-2: health 100/100, open P1 0 · P2 0 · P3 0; gate clean.

## G-aem — nothing to fix (2026-11-02)
- autofix-aem dry-run: 0 candidates (the one finding was fixed in F); no project edits, no re-deploy.

## H-report — delivered: 1/1 page verified, 8/8 blocks, health 100 (2026-11-02)
- Pages 1 · verified 1 · failed 0 · to deliver 0. Templates 1 (Home page). Blocks 8/8 verified + header/footer. Quality: gate 1440 0.5% / 360 0.63% (Δh 0, clip 0, content 0), optimize 100/100, dynamics 10/10. Owner decisions open: tags & consent (scaffolded off), newsletter backend, timed modal, shopping agent, commerce, locale trees.
- Learnings appended to stardust/learnings.md (6 entries).

## I-dashboard — dashboard written (2026-11-02)
- stardust/rollout/dashboard/{index.html,data.json}: 1 page identified · prototyped · deployed · optimised.

## Handoff — https://www.logitech.com/en-us delivered and live; done-check complete (2026-11-02)
- Live: https://main--73326f3f--aemcoder.aem.live/en-us (root `/` → `/en-us`). Published-origin gate 1440 0.5% / 360 0.63%, Δh 0, clip 0, content 0; verified 1/1; optimize 100; dynamics 10/10; martech carried over with every part disabled (owner switches in stardust/martech-handoff.md).
- Residuals: 8 chrome content-diff granularity reds (source duplicates labels/social/locale per layout; the build moves one authored copy) — listed in stardust/rollout/foundation-requests.md.
- Runner done-check: complete, no gaps. state.json: en-us migrated.
