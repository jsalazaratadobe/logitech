---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-11-02T19:16:48Z
  againstInput: https://www.logitech.com/en-us
  readArtifacts:
    - stardust/current/pages/en-us.json
    - stardust/current/_computed-styles.json
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.logitech.com/en-us (no direct invocation, no creative decisions).

Synthesized (bounded-single): current/pages/en-us.json + Phase-3 CSS lift (stardust/replica/tokens.json) → PRODUCT.md · DESIGN.md · DESIGN.json (at 2026-11-02T19:16:48Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md (empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Decision — link targets outside the one-page scope (E2 link audit, 2026-11-02)
Scope is exactly one page (/en-us). Every other internal target on the page, the nav and the footer (75 distinct www.logitech.com URLs) is a SCOPE EXTENSION, not a capture gap: it stays pointed at the source origin (https://www.logitech.com/…), never root-relative, so nothing on the delivered site 404s. Delivered-origin targets (/en-us, 6 banner videos) answer 200; / , /index.html and /en-us/ redirect to /en-us. External hosts (logitechg.com, support.logi.com, social) are kept verbatim from the source.
