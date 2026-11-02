<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-11-02T19:17:42.508Z · input stardust/current/_dynamics.json (1 pages, 49 findings) · target probe https://main--73326f3f--aemcoder.aem.page -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-logitecheurope-us-6-evergage-com | A | unknown third-party host logitecheurope.us-6.evergage.com | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-unknown-third-party-host-alb-reddit-com | A | unknown third-party host alb.reddit.com | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 3 | a-unknown-third-party-host-logitech-cfzu-net | A | unknown third-party host logitech.cfzu.net | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 4 | a-unknown-third-party-host-www-google-com | A | unknown third-party host www.google.com | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 5 | a-unknown-third-party-host-agenticapplications-googleapis-co | A | unknown third-party host agenticapplications.googleapis.com | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 6 | a-unknown-third-party-host-fh-118116076e9a4c2a96a99fbb70bea2 | A | unknown third-party host fh-118116076e9a4c2a96a99fbb70bea2a0.ecs.us-west-2.on.aws | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 7 | a-unknown-third-party-host-r4-cloud-yellow-ai | A | unknown third-party host r4.cloud.yellow.ai | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 8 | a-first-party-api-get-en-us-api-shopping-agent-rollout | A | first-party API GET /en-us/api/shopping-agent-rollout | 1/1 (reach 1/1) | data-fed | block | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 9 | a-first-party-api-get-en-us-api-sfcc-auth | A | first-party API GET /en-us/api/sfcc-auth | 1/1 (reach 1/1) | data-fed | — | needs-backend | pending | decided-out | none (session-bound off-origin) | **dead on target (404)** |
| 10 | a-first-party-api-post-en-us-api-shopping-agent-token | A | first-party API POST /en-us/api/shopping-agent-token | 1/1 | data-fed | block | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 11 | a-first-party-api-post-v1-p | A | first-party API POST /v1/p | 1/1 (reach 1/1) | data-fed | block | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 12 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 1/1 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 13 | a-cms-app-settings-object-utag-data | A | CMS / app settings object utag_data | 1/1 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 14 | cr-client-framework-sveltekit | CR | client framework sveltekit | 1/1 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 15 | f-form-footer-bar-email-subscription-form-no-action-js-wired | F | form "footer-bar-email-subscription-form" → no action (JS-wired) (2 fields) | 1/1 | client-only | widget | self | pending | client-compute | none |  |
| 16 | f-form-subscribe-form-no-action-js-wired-1-fields | F | form "subscribe-form" → no action (JS-wired) (1 fields) | 1/1 | client-only | widget | self | pending | client-compute | none |  |
| 17 | i18n-locale-variants-en-ie-en-us-en-in-en-ae-en-za-no-no-zh- | I18N | locale variants en-ie,en-us,en-in,en-ae,en-za,no-no,zh-cn,nl-be,el-gr,en-my,nl-nl,en-eu,en-au,ja-jp,de-ch,hu-hu,fr-ca,es-es,en-nz,ar-ae,pl-pl,en-sa,fr-be,en-sg,it-ch,tr-tr,fr-fr,vi-vn,en-gb,fi-fi,en-ca,en-ch,de-at,fr-ch,cs-cz,en-ph,de-de,zh-tw,zh-hk,pt-br,ko-kr,en-hk,es-mx,it-it,es-ar,sv-se,id-id,da-dk,th-th,x-default | 1/1 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 18 | m-modal-trigger-aria-haspopup-chrome-only-button-content | M | modal trigger aria-haspopup (chrome only) → button:content | 1/1 (reach 11/1) | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 19 | t-consent-onetrust | T | consent: OneTrust | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 20 | t-unknown-third-party-host-cdn-evgnet-com | T | unknown third-party host cdn.evgnet.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 21 | t-unknown-third-party-host-agents-cloud-google-com | T | unknown third-party host agents.cloud.google.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 22 | t-unknown-third-party-host-cdn-bizible-com | T | unknown third-party host cdn.bizible.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 23 | t-marketing-marketo-munchkin | T | marketing: Marketo Munchkin | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 24 | t-unknown-third-party-host-www-gstatic-com | T | unknown third-party host www.gstatic.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 25 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 26 | t-unknown-third-party-host-siteimproveanalytics-com | T | unknown third-party host siteimproveanalytics.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 27 | t-unknown-third-party-host-www-redditstatic-com | T | unknown third-party host www.redditstatic.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 28 | t-analytics-adobe-analytics-experience-cloud-id | T | analytics: Adobe Analytics / Experience Cloud ID | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 29 | t-unknown-third-party-host-cdn-tkrconnector-com | T | unknown third-party host cdn.tkrconnector.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 30 | t-unknown-third-party-host-m-servedby-buysellads-com | T | unknown third-party host m.servedby-buysellads.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 31 | t-unknown-third-party-host-utt-impactcdn-com | T | unknown third-party host utt.impactcdn.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 32 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 33 | t-unknown-third-party-host-cdn-bizibly-com | T | unknown third-party host cdn.bizibly.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 34 | t-unknown-third-party-host-cdn-yellowmessenger-com | T | unknown third-party host cdn.yellowmessenger.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 35 | t-unknown-third-party-host-6016578-global-siteimproveanalyti | T | unknown third-party host 6016578.global.siteimproveanalytics.io | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 36 | t-unknown-third-party-host-ws-zoominfo-com | T | unknown third-party host ws.zoominfo.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 37 | t-analytics-session-replay | T | analytics: session replay | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 38 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 39 | t-unknown-third-party-host-www-ojrq-net | T | unknown third-party host www.ojrq.net | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 40 | t-unknown-third-party-host-www-facebook-com | T | unknown third-party host www.facebook.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 41 | t-unknown-third-party-host-adservice-google-com | T | unknown third-party host adservice.google.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 42 | t-unknown-third-party-host-r4-app-yellow-ai | T | unknown third-party host r4.app.yellow.ai | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 43 | t-unknown-third-party-host-r4-ym-uploads-s3-us-west-2-amazon | T | unknown third-party host r4-ym-uploads.s3-us-west-2.amazonaws.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 44 | t-unknown-third-party-host-services-google-com | T | unknown third-party host services.google.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 45 | t-unknown-third-party-host-gstatic-com | T | unknown third-party host gstatic.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 46 | t-unknown-third-party-host-ces-googleapis-com | T | unknown third-party host ces.googleapis.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 47 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 1/1 | embed-passthrough | embed | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |
| 48 | x-sign-in-account-links | X | sign-in / account links | 1/1 | decided-out | — | needs-backend | pending | decided-out | auth / commerce on the new host? |  |
| 49 | x-commerce-signals-cart-true-prices-10 | X | commerce signals (cart: true, prices: 10) | 1/1 | decided-out | — | needs-backend | pending | decided-out | auth / commerce on the new host? |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 6 row(s) — read-settings, settled-dom-snapshot, client-compute, chrome-interaction.
- **One owner decision batch:** 41 row(s) — inspect the XHR, add a vendor row · which tier for the target host; consumer on the migrated pages? · none (session-bound off-origin) · scope of the locale trees · CMP domain script reuse on the new host · which tags run on the new host; property ids.
- **Already delivered by the capture pipeline:** 0 row(s) — no work.
- **Host-bound on the target:** 4 of 4 probed API paths — the off-origin data work.
- **Martech:** no CMP · 0/0 route(s) enabled by the owner — `stardust/martech-handoff.md`.

## Phases

- **tags** — 28
- **detect** — 9
- **off-origin data** — 3
- **register** — 3
- **client tools** — 2
- **capture** — 1
- **locale wave** — 1
- **interactive** — 1
- **embeds** — 1
