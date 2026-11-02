# Martech hand-off

Everything below is scaffolded **off**. To ship it, set `enabled: true` on `consent.cmp` and on each route in `stardust/martech-contract.json`, then re-run `deploy/scripts/martech-scaffold.mjs` and `dynamics/scripts/dynamics-check.mjs` to confirm the enabled tags load. Enabled tags load on `www.logitech.com` only; preview with `?martech=on` (add `&consent=accept` to grant every category).

## Consent

- **CMP:** OneTrust · `data-domain-script` = `a5d4a538-21e6-485f-9f0b-0bab76c31f5c`
- **Model `owner-decision`:** no evidence of consent gating inside the tag manager. Keep the source behaviour (route `category` null), or set a route `category` to a consent group id to load that tag manager only once the group is granted.
- **Consent checks read by the model (evidence only; the model above comes from parsed evidence and does not change):** confirm each with the owner before choosing route categories.
  - Tealium rule Per-tag load rules gated on OneTrust consent groups checks `C0002`, `C0003`, `C0004` — read by the model at webtags.logitech.com/logi/prod/utag.js utag.loader.cfg (offset ~223460) and utag.cond cases reading cp.OptanonConsent / js_page.OnetrustActiveGroups (offset ~49208)
- **Categories** (default rule set of 3 geo rule sets — the CMP applies them, nothing to port): `C0001` Strictly Necessary Cookies (always active) · `C0002` Analytics Cookies (active) · `C0003` Functional Cookies (active) · `C0004` Marketing Cookies (active) · `C0005` Social Media Cookies (active)

## Routes

| id | vendor | src | CMP groups listing its host | enabled |
|---|---|---|---|---|
| tealium | Tealium | `https://webtags.logitech.com/logi/prod/utag.js` | C0001 | false |

Also seen, not routed (loaded by the tag manager or inline on the source — confirm each still fires): analytics: Google Analytics / Ads · analytics: session replay · marketing: Marketo Munchkin · marketing: ad / retargeting pixel.

## Rewrite before go-live

Nothing found (or no tag-manager library read).

## Data layer

The source pages expose `dataLayer`, `utag_data`; keep the same global names.
Data elements read these data-layer paths: `utag_data: page_name, page_type, page_category_name, site_locale, site_country, site_language, link_text, link_url …`.
Ask the owner for the tagging plan (solution design reference): each event, its payload and the interaction that pushes it. With it, add each push in the block that owns the interaction.

## Tag-manager notes (read by the model, not parsed)

**Tealium:** Tealium profile logitech/logi/prod (ut4, build 202610292328) is self-hosted on webtags.logitech.com and injects the Google gtag/Ads/Floodlight, Meta, Reddit, Marketo, Quantum Metric, Bizible, ZoomInfo, Impact and Siteimprove tags; its load rules read the OneTrust cookie (`OptanonConsent` C0002/C0003/C0004), so consent gating already happens inside Tealium (per-tag). The migrated pages must set `utag_data` with the same keys before utag.js loads, or the owner remaps the UDO in Tealium.

Confirm everything read by the model against the owner's tagging plan.
