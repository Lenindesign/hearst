# Security Compliance Matrix — Single-Brand Destinations (Hearst+)

**Framework:** OWASP Top 10 (2021) · **Companion to:** `tech-env-single-brand-destinations.md` (Security Basics) · **Draft for Inception · August 25, 2026**

> **Why OWASP Top 10:** this is a public, read-mostly web content app on a managed platform (Netlify) with optional Google sign-in and no owned regulated data — a lightweight web-app baseline fits better than NIST 800-53 / PCI-DSS / HIPAA, which are **Not Applicable** (no payments, no PHI, no federal data). Status values: **Addressed** (control exists), **Gap** (action required), **N/A** (justified), **Deferred** (later phase).

| # | Category | Applicability | How This Project Addresses It | Status | Owner / Action |
|---|---|---|---|---|---|
| A01 | Broken Access Control | Med | Reader-scoped only; no admin/ops roles in this MVP. `reader-profile` reads/writes are keyed to the reader's own `syncId` and validated. | **Addressed** (scope-limited) | Confirm a reader cannot read/write another reader's profile by forging `syncId`. |
| A02 | Cryptographic Failures | Med | HTTPS enforced (HTTP upgraded); Netlify Blobs encrypted at rest; no secrets in client bundles. **Gap:** `*.h-cdn.co` allows `http` in `next.config.ts remotePatterns`. | **Gap** | Eng: drop the `http` image pattern; verify no mixed content. |
| A03 | Injection | High | Content is fetched server-side and rendered as data; no SQL (no relational DB). **Risk:** four divergent hand-rolled RSS/HTML parsers with inconsistent entity decoding (audit E3/D1) → XSS/parse risk if untrusted markup is rendered. | **Gap** | Eng: consolidate to one escaped `lib/rss-parse.ts`; sanitize any HTML rendered into the Article body. |
| A04 | Insecure Design | Med | Feed adapter is timeout-guarded with fallbacks; single-brand mode ships behind a feature flag; contracts consumed as-is. **Risk:** silent error swallowing hides upstream failures (audit E2). | **Addressed / partial** | Eng: log before returning fallbacks; keep the fallback-not-blank contract. |
| A05 | Security Misconfiguration | High | Image hosts pinned via `remotePatterns`; static cache headers set in `netlify.toml`. **Gaps:** no explicit CSP documented; `http` host allowed; `NEXT_PUBLIC_*` surface must be reviewed. | **Gap** | Eng: define a CSP aligned to `remotePatterns`; audit `NEXT_PUBLIC_*` for anything not meant to be public. |
| A06 | Vulnerable & Outdated Components | High | Dependencies on current majors (Next 16, React 19). **Gap:** no dependency scanning in CI today. | **Gap** | Eng: add `npm audit`/Dependabot with a patch SLA (tech-env §6). |
| A07 | Identification & Authentication Failures | Med | Google Sign-In; ID token verified server-side (issuer/aud/length) in `api/auth/google`. Auth is optional. **Gap:** no first-party session lifetime/refresh defined. | **Addressed / partial** | Product+Eng: define session lifetime, refresh, and sign-out before production. |
| A08 | Software & Data Integrity Failures | Med | Google token signature verified; no untrusted deserialization. **Risk:** daily feed-refresh workflow force-pushes generated data to `main` with `contents: write` (audit B10). | **Gap** | Eng: move feed refresh to a reviewed PR or tighten workflow credentials. |
| A09 | Security Logging & Monitoring Failures | Med | Some routes log errors; Amplitude captures product analytics. **Gap:** no consistent auth/write audit logging or alerting. | **Gap** | Eng: log auth events + `reader-profile` writes; add basic alerting on route errors. |
| A10 | Server-Side Request Forgery (SSRF) | Med | Server routes fetch **external** feeds/articles by URL; the N+1 article hydration fetches arbitrary article URLs from feeds (audit F2). Risk if feed URLs are attacker-influenced. | **Gap** | Eng: allow-list fetchable hosts (reuse `remotePatterns` hosts), block internal/link-local ranges, cap redirects. |

## Not Applicable (justified)
- **PCI-DSS** — no payment card handling in this MVP (commerce automation is Phase 3).
- **HIPAA** — no protected health information.
- **FedRAMP / NIST 800-53** — not a government system; no federal data.
- **VPC / Security Groups / Private Endpoints** — managed Netlify platform; no self-managed network.

## Deferred (later phase)
- Fraud / abuse prevention and rate-limiting hardening beyond platform defaults.
- Full Identity/CRM integration security review (Phase 2).
- Formal privacy/consent (GDPR/CCPA) sign-off with Privacy/Legal for expanded reader data.

## Priority gaps to close before production
1. **A03/A10** — one shared, escaped feed parser + a fetch host allow-list (highest risk: injection + SSRF from feed-driven fetches).
2. **A06** — dependency scanning in CI (cheap, high value).
3. **A05** — a documented CSP and removal of the `http` image host.
4. **A08** — stop force-pushing generated data to `main`.

---

*Draft for inception. Statuses reflect the current codebase (per the code audit); ratify owners and SLAs at the AIDLC inception workshop.*
