# Hearst Prototype Agent Instructions

The project root is also the Obsidian knowledge vault. Treat the repository Markdown as the canonical product and design memory; do not rely on conversation history alone.

This application is built on top of the Hearst Design System. Prefer existing Hearst Design System foundations, components, semantic tokens, typography roles, icons, variants, and responsive conventions. App-specific patterns may compose them but must not create a parallel design system.

Before changing any destination, brand page, carousel, river, sidebar, card, video index, masthead, or reader:

1. Read `VAULT_HOME.md` for the knowledge map and source-of-truth order.
2. Read `DESIGN-SYSTEM-SPEC.md` before changing HDS foundations, tokens, typography roles, components, or generated theme outputs.
3. Read `PRODUCT.md` for product purpose and design principles.
4. Read `DESIGN.md` for the concise design-tool context and Hearst Design System inheritance model.
5. Read the relevant sections of `STYLE.md` for shared visual, responsive, theme, and interaction rules.
6. Read `BRAND_STYLES.md` when colors, fonts, logos, icons, mastheads, or brand inheritance are involved.
7. Read `APP_RULES.md` for personalization, content, feed, reader, route, and scoped-exception behavior.
8. Check `DECISION_LOG.md` when the reason or history behind a rule matters.

Keep rule ownership clear:

- HDS token architecture and component contracts belong in `DESIGN-SYSTEM-SPEC.md`.
- Product intent belongs in `PRODUCT.md`.
- Concise design-tool context belongs in `DESIGN.md`.
- Shared visual and interaction rules belong in `STYLE.md`.
- Brand identity belongs in `BRAND_STYLES.md`.
- Product behavior and scoped exceptions belong in `APP_RULES.md`.
- Historical context belongs in `DECISION_LOG.md`.

When guidance is repeated in a bridge or summary document, the owner listed above remains canonical. Update the canonical owner first, then synchronize any summary that still needs the rule for discoverability.

When a user establishes a durable rule, update the appropriate canonical file in the same change. Preserve documented exceptions and never let one destination or brand treatment leak into another surface.
