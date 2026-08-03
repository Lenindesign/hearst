# Hearst Prototype Design Context

This file is the concise design-tool bridge for Impeccable and other automatically loaded design workflows. It routes work to canonical documents and does not own detailed product or interface rules.

## Foundation

Hearst+ and the destination prototypes compose the Hearst Design System. Reuse its components, semantic tokens, typography, icons, variants, and responsive conventions before adding an application-specific primitive.

## Canonical owners

- `PRODUCT.md`: audience, purpose, prototype boundary, personality, and principles.
- `DESIGN-SYSTEM-SPEC.md`: HDS tokens, generated outputs, component contracts, and delivery evidence.
- `STYLE.md`: shared visual hierarchy, responsive presentation, accessibility, and interaction styling.
- `BRAND_STYLES.md`: brand identity, inheritance, routes, colors, typography, and logos.
- `APP_RULES.md`: feeds, personalization, readers, navigation, state, content eligibility, and product behavior.
- `DECISION_LOG.md`: historical context, not the current source of truth.

Read `PRODUCT.md`, then only the canonical sections required by the task. When this bridge conflicts with a canonical owner, follow the canonical owner and correct this file.

## Verification

Verify the changed surface at the relevant desktop and mobile widths, with keyboard focus, the applicable brand theme, and any named exception. Confirm that the change does not leak into unrelated destinations or readers.
