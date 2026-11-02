# Dynamics parity check — https://main--73326f3f--aemcoder.aem.live — 2026-11-02T21:45:17.064Z

Replayed 10 checks over 10 features · pass 10 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| Tealium tag stack (utag.js) and every tag it injects | T | scaffolded-awaiting-owner | martech | PASS | no tag host requested (2 gated · 1 cross-site host(s) blocked) |  |
| OneTrust CMP (C0001–C0005) | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 2 gated host pattern(s) before consent | www.logitech.com:200×2 |
| Footer email subscription form | F | interim | dom-count | PASS | 1 × #footer-bar-email-subscription-form input[type=email] (min 1) | www.logitech.com:200×2 |
| Header Shop mega panel (hover / keyboard) and mobile navigation drawer | M | done | dom-count | PASS | 24 × header #desktop-nav-panel-0 a (min 20) | www.logitech.com:200×2 |
| Header Shop mega panel (hover / keyboard) and mobile navigation drawer | M | done | dom-count | PASS | 1 × header button.menu-btn[aria-expanded] (min 1) | www.logitech.com:200×2 |
| Sign-in / account / cart (SFCC) | X | interim | dom-count | PASS | 5 × header .tool-items > li (min 4) | www.logitech.com:200×2 |
| Locale selector | I18N | interim | dom-count | PASS | 2 × a[href*='change-location'] (min 1) | www.logitech.com:200×2 |
| Client framework hydration; hero/banner videos autoplay | CR | done | no-page-errors | PASS | none on 2 page(s) |  |
| Client framework hydration; hero/banner videos autoplay | CR | done | video-plays | PASS | iframe/video: false · video playing (Δt 0.81s) | www.logitech.com:200×2 |
| martech: consent + tag routing | T | scaffolded-off | martech | PASS | no tag host requested (2 gated · 1 cross-site host(s) blocked) |  |

## Features without checks

- Timed 15% off email modal (M) — interim · owner: keep or drop the timed marketing modal
- AI shopping assistant / chat (A) — interim · owner: host the shopping-agent API for the new origin or keep the launcher off
