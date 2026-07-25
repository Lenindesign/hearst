# Hearst Prototype Knowledge Vault

This project directory is an Obsidian vault and the canonical knowledge base for the Hearst reader prototypes.

`AGENTS.md` requires Codex sessions working in this project to consult this vault before making interface changes.

## Start here

- [[DESIGN-SYSTEM-SPEC]]: canonical HDS token architecture, generated outputs, component contracts, and publication pipeline.
- [[PRODUCT]]: product purpose, audience, personality, and design principles.
- [[DESIGN]]: concise design-tool context and the Hearst Design System inheritance model.
- [[STYLE]]: native visual foundation, responsive behavior, interaction rules, and cross-theme styling.
- [[BRAND_STYLES]]: destination and publication colors, fonts, logos, and brand inheritance.
- [[APP_RULES]]: personalization, feeds, readers, content behavior, and scoped exceptions.
- [[DECISION_LOG]]: dated product and design decisions that may later graduate into a canonical rule file.

## Source-of-truth order

1. HDS foundation and token architecture: `DESIGN-SYSTEM-SPEC.md`
2. Product intent: `PRODUCT.md`
3. Design-tool context: `DESIGN.md` (summary bridge, not a competing source)
4. Shared visual behavior: `STYLE.md`
5. Brand identity: `BRAND_STYLES.md`
6. Product behavior and exceptions: `APP_RULES.md`
7. Decision history: `DECISION_LOG.md`

Do not create duplicate notes for rules already covered by these files. Update the canonical file and add a short dated entry to the decision log when the change needs historical context.

## Working agreements

- The application is built on top of the Hearst Design System and must compose its foundations, components, and semantic tokens before adding app-specific patterns.
- Brand token JSON under `tokens/brands/` is canonical for published HDS brand values. Generated CSS and TypeScript are outputs, not editing surfaces.
- Shared components inherit the native Hearst foundation before brand overrides are applied.
- Brand changes must use the current theme, font, and logo implementation sources documented in [[BRAND_STYLES]].
- New durable visual rules belong in [[STYLE]].
- New durable product behavior belongs in [[APP_RULES]].
- Conversation history and Codex memory may provide context, but neither replaces this repository knowledge base.

## Using this vault

Open `/Users/leninaviles/Projects/hearst/hearst-design-system` as a vault in Obsidian. The included configuration hides implementation-heavy directories so the knowledge graph stays focused on product and design documentation.

- New working notes go in `notes/`. They are non-canonical until their decisions are promoted into the appropriate owner above.
- Vault attachments go in `vault-assets/`. Do not place production application assets there.

## Reference and historical notes

- [[QA_AUDIT_REPORT]]: historical QA snapshot tied to its dated commit and environment.
- [[HEARST_LIFESTYLE_EXPERIENCE]]: historical Lifestyle POC description; current routes and rules live in the canonical files above.
- `README.md`: operational repository setup, validation, and deployment orientation.

Historical notes provide context only. They never override a canonical rule or current implementation source.
