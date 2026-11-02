# Dynamic features — www.logitech.com/en-us (replica, one page)

Curated from `stardust/dynamics/dynamic-features.generated-plan.{md,json}` (49 detector rows, 2026-11-02).
Hands-off: every non-self row ships its interim tier and names its decision; none is written `decided-out`
(that takes the owner's statement). The static recreation continues regardless.

## Listings contract
none — the home page carries no listing block fed by an index.

## Features
| # | id | feature | class | reach | disposition | target | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | martech | Tealium tag stack (self-hosted utag.js) + every tag it injects: Google gtag/Ads/Floodlight/GA4, Meta, Reddit, Marketo Munchkin, Quantum Metric, Bizible, ZoomInfo, Impact, Siteimprove, Evergage, ad/retargeting pixels, runtime-injected tag iframes (rows 18–46, 0–6, 11–12) | T | 1/1 | embed-passthrough | runtime (`scripts/martech.js`) | needs-business-decision | scaffolded-awaiting-owner | martech | owner turns on `consent.cmp` + the Tealium route in `stardust/martech-contract.json` (tags on the new host; `utag_data` keys) | `stardust/martech-contract.json`, `stardust/martech-handoff.md`, `stardust/martech/` |
| 2 | consent-onetrust | OneTrust CMP (domain script a5d4a538…, 3 rule sets, C0001–C0005) | T | 1/1 | embed-passthrough | runtime | needs-business-decision | scaffolded-awaiting-owner | martech | owner enables `consent.cmp`; categories and geo rules stay in OneTrust | `stardust/martech/onetrust.json` |
| 3 | newsletter-subscribe | Email subscription forms (footer bar + "Subscribe to receive your special offer" modal), JS-wired, 1 field | F | 1/1 | client-only | widget | self (UI) / needs-backend (submission) | interim | forms | backend for submissions — interim: local capture with an explicit "no backend connected" message | rows 14, 15 |
| 4 | chrome-menus | Header menus / drawer (aria-haspopup triggers) | M | 1/1 | rebuild-native | runtime | self | done | chrome-interaction | none (the header contract is the spec) | row 17 |
| 5 | timed-offer-modal | Timed "15% off" email modal (welcomeModalConfig) | M | 1/1 | static-snapshot | runtime | needs-business-decision | interim | modal-loader | whether to keep the timed marketing modal; not shown until decided (gate captures dismiss it) | `stardust/replica/dismiss.txt`, crawl |
| 6 | shopping-agent | AI shopping assistant / chat (`/en-us/api/shopping-agent/*`, yellow.ai, agents.cloud.google.com, `/v1/p`) | A | 1/1 | static-snapshot | null | needs-business-decision | interim | off-origin-data | host-bound on the new origin (4/4 paths 404); keep the launcher off until the owner decides the assistant's backend | rows 7, 9, 10, 0–6 |
| 7 | account-cart | Sign-in / account / cart (SFCC session, `/en-us/api/sfcc-auth`, cart signals) | X | 1/1 | static-snapshot | runtime | needs-backend | interim | chrome-interaction | links keep pointing at the source commerce origin until the owner decides auth/commerce on the new host | rows 8, 47, 48 |
| 8 | locale-selector | Locale variants (en-ie, en-us, en-in, en-ae, …) | I18N | 1/1 | rebuild-native | runtime | needs-business-decision | interim | locale-tree | scope of the locale trees — interim: selector links to the source locales | row 16 |
| 9 | sveltekit-hydration | Client framework (SvelteKit) — page is server-rendered, content present at load | CR | 1/1 | static-snapshot | content | self | done | client-rendered-page | none (content captured settled) | row 13 |

## Decision batch
One message to the owner (hands-off: recorded as named assumptions, interim tiers ship):
1. **Tags & consent** — switch on OneTrust (`consent.cmp`) and the Tealium route in `stardust/martech-contract.json`; Tealium load rules already gate on OneTrust groups; the new pages must set `utag_data` with the same keys, or remap the UDO in Tealium. See `stardust/martech-handoff.md`.
2. **Newsletter backend** — which service receives subscription submissions (form UI ships, submission held locally).
3. **Timed offer modal** — keep or drop the "15% off" pop-up on the new site.
4. **Shopping assistant** — backend/host for the AI shopping agent and chat.
5. **Account & cart** — auth/commerce on the new host (interim: source-origin links).
6. **Locale scope** — which locale trees migrate (interim: links to source locales).

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| — | none: no owner statement yet; every row above ships an interim tier | — |
