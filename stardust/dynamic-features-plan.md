# Dynamic features plan — www.logitech.com/en-us

| phase | deliverable | authoring contract | verification | owner decision | effort |
|---|---|---|---|---|---|
| D1 chrome | header menus/drawer, footer accordions (rebuild-native runtime) | nav/footer documents | chrome-compare on the published origin, motion parity | none | in C0 foundation |
| D2 martech | `scripts/martech.js` via `martech-scaffold.mjs`, everything off | `stardust/martech-contract.json` | `dynamics-check.mjs` martech feature: `/` requests no route/CMP host | tags & consent (#1) | small |
| D3 newsletter | subscribe widget, local capture + "no backend connected" message | widget config only | dynamics-check form presence | newsletter backend (#2) | small |
| D4 interim links | account/cart/locale links to the source origin; shopping assistant launcher off; timed modal off | nav document | content-presence in the gate | #3–#6 | none |
