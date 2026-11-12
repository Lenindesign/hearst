# Hearst Prototype Agent Instructions

The project root is also the Obsidian knowledge vault. Treat the repository Markdown as the canonical product and design memory; do not rely on conversation history alone.

This application is built on top of the Hearst Design System. Prefer existing Hearst Design System foundations, components, semantic tokens, typography roles, icons, variants, and responsive conventions. App-specific patterns may compose them but must not create a parallel design system.

Before changing any destination, brand page, carousel, river, sidebar, card, video index, masthead, or reader:

1. Read `PRODUCT.md` for product purpose and design principles.
2. Read `DESIGN.md` when a design workflow loads it or when the correct canonical owner is unclear.
3. Read only the relevant canonical sections for the task:
   - `AIDLC-docs/DESIGN-SYSTEM-SPEC.md` for HDS foundations, tokens, typography roles, components, or generated theme outputs.
   - `STYLE.md` for shared visual, responsive, accessibility, theme, or interaction styling.
   - `BRAND_STYLES.md` for colors, fonts, logos, icons, mastheads, routes, or brand inheritance.
   - `APP_RULES.md` for personalization, content, feeds, readers, navigation, state, eligibility, loading, or scoped product behavior.
4. Read `VAULT_HOME.md` when broader repository context or the complete knowledge map is needed.
5. Check `DECISION_LOG.md` only when the reason or history behind a current rule matters.

Do not load every canonical document for a narrowly scoped change.

Keep rule ownership clear:

- HDS token architecture and component contracts belong in `AIDLC-docs/DESIGN-SYSTEM-SPEC.md`.
- Product intent belongs in `PRODUCT.md`.
- Concise design-tool context belongs in `DESIGN.md`.
- Shared visual and interaction rules belong in `STYLE.md`.
- Brand identity belongs in `BRAND_STYLES.md`.
- Product behavior and scoped exceptions belong in `APP_RULES.md`.
- Historical context belongs in `DECISION_LOG.md`.

When guidance is repeated in a bridge or summary document, the owner listed above remains canonical. Update the canonical owner first, then synchronize any summary that still needs the rule for discoverability.

When a user establishes a durable rule, update the appropriate canonical file in the same change. Preserve documented exceptions and never let one destination or brand treatment leak into another surface.

## Working with collaborators

`main` is protected: every change from a collaborator goes through a pull request that the repository owner approves, and merging it publishes to production. Netlify builds a deploy preview for each pull request, including Storybook at `/storybook/`.

- Work on a branch and open a pull request. Fill in every item of the pull request checklist (`.github/pull_request_template.md`): vault, Storybook, specs, preview widths, and the type check.
- A change is not done until the vault, the Storybook stories, and any affected spec page agree with the app. Update them in the same pull request.
- Shared skills live in the repository so every collaborator's agent has the same tools: `.agents/skills/` (Codex) with links in `.claude/skills/` (Claude Code). Use `dimensional-drawing` for spec sheets and `dimensional-drawing-motion` for their films; spec sources live in `output/specs/` and publish to `public/specs/`.
