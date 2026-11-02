
## 2026-11-02 — logitech.com/en-us single-page replica (rollout H)
- **Prototype canon can hide a whole behaviour.** The archetype passed every static gate while its Shop mega panel was `display: none` everywhere and the mobile menu button was inert; only a click/hover probe of the source vs the build showed it (D2). Static gates and content-diff never open a menu — run a trigger-by-trigger open check on the header before the archetype is approved.
- **unit-geometry caches the origin inventory per slug, not per width** (`stardust/current/measure/<slug>-units.json`): the 360 roster run reused the 1440 inventory and failed `units`; a blocked 403 origin read was cached the same way. Move the cache aside between widths and after any 403.
- **chrome-explore's real-Chrome tier got 403 from an Akamai-fronted source while bundled Chromium loaded it**; the recorded header contract was taken on the error page and produced false "static header" reds. Check the `[live-session] WARNING: HTTP 403` line before trusting a contract.
- **gate-all selects `status: deployed` rows from state.json**, which no state writer sets in the replica flow; a one-row `--state` file (first-page-first shape) is the working path.
- **EDS renders a `json-ld` metadata row natively** as `<script type="application/ld+json">` — no scripts.js code needed to carry a source's structured data.
- **verify.mjs asks for `/<slug>/` when the migrated file is `<slug>/index.html`**; a `/<slug>/` → `/<slug>` redirect row answers it (and real visitors).
