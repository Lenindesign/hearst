# Hearst Prototype Design Context

This file is the design-context bridge for Impeccable and other design tooling. It is intentionally concise. The detailed canonical rules live in the linked vault documents.

## Foundation

This application is built on top of the Hearst Design System. Hearst+ and the destination prototypes compose existing Hearst Design System foundations, components, semantic tokens, typography roles, icons, variants, and responsive conventions.

Do not create a parallel component or token system. Before introducing an app-specific primitive, confirm that the need cannot be handled through an existing Hearst Design System component, variant, composition, or semantic token.

## Required design references

- `DESIGN-SYSTEM-SPEC.md`: canonical HDS token architecture, generated outputs, and component contracts.
- `STYLE.md`: shared visual hierarchy, interaction behavior, responsive rules, masthead normalization, text clamps, and theme exceptions.
- `BRAND_STYLES.md`: native inheritance plus each destination and publication's colors, typography, and logo assets.
- `APP_RULES.md`: product behavior, personalization, feeds, readers, and scoped exceptions that affect design.
- `DECISION_LOG.md`: historical context for approved design decisions.

Read the relevant sections before changing a destination, brand page, carousel, river, sidebar, card, video index, masthead, or reader.

This file is an automatically loaded design-tool bridge. When its summary conflicts with a detailed reference, update and follow the canonical owner identified in `VAULT_HOME.md`.

## Inheritance order

1. Hearst Design System foundation.
2. Destination or publication brand theme.
3. Hearst+ application composition.
4. Explicitly documented surface exception.

An exception applies only to its named surface and cannot leak into another destination, tab, RSS/story page, or reader.

## Essential interaction rules

- Editorial links change to the active theme primary color without underlines.
- Keyboard interactions retain a visible focus ring.
- Complete story rows are clickable, not only their headline text.
- Shared components keep consistent behavior across light, dark, and brand themes.

## Essential visual rules

- Use semantic tokens instead of hardcoded publication colors or fonts in shared components.
- Normalize destination masthead wordmarks by visual height, not total width.
- Carousel headlines use a maximum of three lines; carousel summaries use a maximum of two.
- River-card summaries use a maximum of three lines.
- Hearst+ Videos dark mode and AutoWeek title color are documented exceptions, not global defaults.

## Verification expectation

For shared UI changes, verify the normal light destination, the relevant brand theme, keyboard focus, responsive behavior, and any affected scoped exception. Confirm that the change does not leak into readers or unrelated destinations.
