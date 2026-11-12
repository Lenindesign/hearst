## What changed

<!-- One or two sentences: what a reader will see differently, and where (route, component, brand). -->

## Preview

<!-- Paste the Netlify deploy preview link for the page you changed. Storybook is at /storybook/ on the same preview. -->

## Checklist

Tick each box, or write "n/a" with a reason. The owner checks these before approving.

- [ ] **Vault updated.** If this change sets or changes a rule, the canonical doc says so in the same PR (`PRODUCT.md`, `STYLE.md`, `BRAND_STYLES.md`, `APP_RULES.md` or `AIDLC-docs/DESIGN-SYSTEM-SPEC.md`), with a `DECISION_LOG.md` entry if the reason matters. See `hearst-design-system/AGENTS.md` for which doc owns what.
- [ ] **Storybook updated.** Stories for any component, token or layout I changed still match the app (`hearst-design-system/src/stories/`), and they render on the preview's `/storybook/`.
- [ ] **Specs updated.** If I changed something that has a spec page (`/layout-specs/`, `/cta-specs/`, the reader, carousel or system specs), its tables, drawing and film still match. Use the `dimensional-drawing` and `dimensional-drawing-motion` skills.
- [ ] **Checked in the preview.** Phone (390), tablet (768) and desktop (1280+) widths, light and dark, with no sideways scrolling.
- [ ] **No new hard-coded colors.** `npx tsx scripts/audit-tokens.ts --ci` in `hearst-design-system/` reports no new fingerprints, or each new value is mapped with the `token-mapping` skill and explained here.
- [ ] **Type check passes.** `npx tsc --noEmit` in `hearst-design-system/`.
