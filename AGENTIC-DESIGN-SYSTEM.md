# Hearst Agentic Design System

This is the working charter for turning the current Hearst design-system repo into an agentic design system for all Hearst publications.

The goal is not just a shared component library. The goal is a governed system where designers, engineers, and AI agents can safely change brand tokens, produce production-ready components, verify them across publications, and keep Figma, Pencil, Storybook, and shipped code aligned.

## Current Foundation

The repo already has the right ingredients:

- Brand coverage through `hearst-design-system/tokens/brands/*.json`
- A canonical publication manifest at `hearst-design-system/tokens/publications.json`
- Shared token layers in `hearst-design-system/tokens/core/` and `hearst-design-system/tokens/semantic/`
- Generated runtime output in `hearst-design-system/src/lib/brands.ts` and `hearst-design-system/src/lib/tokens.css`
- A Next.js design-system app with brand switching and component previews
- Storybook documentation and QA pages
- Pencil `.pen` files for design specs and brand work
- Figma and Pencil sync scripts
- Token audit and component indexing scripts
- Local agent instructions in `.cursor/skills/`

The next step is to make this system explicit, enforceable, and repeatable across every publication.

Codex operating details live in [CODEX-AGENT-RUNBOOKS.md](CODEX-AGENT-RUNBOOKS.md). That runbook maps each agent role to file ownership, forbidden actions, required checks, and completion evidence.

## System Principles

1. Git is the source of truth.
   Tokens, component metadata, implementation, and review evidence live in Git. Figma and Pencil are consumers, not authorities.

2. Publications are modes, not forks.
   Each publication gets its own brand layer, but shared components and semantic contracts stay common.

3. Agents operate inside narrow ownership boundaries.
   A token agent edits token JSON. A component agent edits component code. A QA agent verifies output. No agent should own the whole system at once.

4. Every change produces evidence.
   Token changes need validation. Component changes need stories and audit output. Release changes need cross-brand verification.

5. Designers can self-serve safely.
   Simple brand value edits should be possible through guarded agent workflows, branch review, and automated checks.

## Agent Roles

### Token Architect

Owns:
- `hearst-design-system/tokens/**/*.json`
- Token naming and hierarchy
- `npm run build-tokens`
- `npm run tokens:check`
- `npm run tokens:validate`

Can do:
- Change brand values
- Add a new publication brand file
- Add or refine semantic tokens
- Validate token consistency

Cannot do:
- Edit generated `src/lib/brands.ts`
- Edit generated `src/lib/tokens.css`
- Rename token keys without an explicit migration plan

### Publication Stylist

Owns:
- Brand identity translation
- Publication-specific token decisions
- Brand QA notes

Can do:
- Compare publication expression across components
- Recommend missing brand tokens
- Map existing brand guidance into token values

Cannot do:
- Fork shared components for one publication without review
- Encode brand behavior outside token layers

### Component Builder

Owns:
- `hearst-design-system/src/components/**`
- Component metadata files
- Component usage patterns

Can do:
- Build reusable editorial components
- Replace hardcoded styling with tokens
- Add responsive variants
- Create component metadata

Cannot do:
- Introduce brand-specific conditionals when tokens can solve the problem
- Add hardcoded publication colors

### Storybook Documenter

Owns:
- `hearst-design-system/src/stories/**`
- Storybook usage docs
- Component examples

Can do:
- Add stories for components and templates
- Document component behavior
- Add brand-switchable examples

Cannot do:
- Treat Storybook-only styling as production implementation

### Figma Sync Agent

Owns:
- `hearst-design-system/scripts/push-to-figma.ts`
- Figma variable sync flow
- Figma variable collection hygiene

Can do:
- Push Git tokens to Figma
- Debug variable drift
- Validate brand modes

Cannot do:
- Treat Figma values as the source of truth

### Pencil Design Agent

Owns:
- `.pen` component specs and design handoff pages
- Pencil variable usage

Can do:
- Build token-bound design specs
- Audit Pencil designs for hardcoded values
- Sync tokens into Pencil

Cannot do:
- Read or modify `.pen` files outside Pencil tools

### QA Review Agent

Owns:
- Release verification
- Cross-publication checks
- Accessibility and token usage evidence

Can do:
- Run token and component audits
- Verify at least three representative brands per change
- Report brand, expected result, actual result, and evidence

Cannot do:
- Approve changes without visible output or audit evidence

### Release Agent

Owns:
- Build, deploy, and release notes
- PR hygiene
- Post-merge sync

Can do:
- Run builds
- Prepare PR descriptions
- Trigger deploys
- Coordinate Figma and Pencil sync after merge

Cannot do:
- Skip validation because a change is documentation-only if generated files changed

## Publication Model

Every publication should resolve into the same contract:

```text
publication
  slug
  displayName
  logo
  fontHeadline
  fontBody
  fontSecondary
  brandPalette
  semanticOverrides
  componentOverrides
  editorialModes
```

The system should support at least these publication classes:

- Editorial magazine brands
- Commerce brands
- Autos brands
- Food and lifestyle brands
- White-label and partner experiences

The contract should avoid one-off component forks. When a publication needs a distinct expression, the first question should be whether a token, semantic alias, component variant, or editorial mode can express it.

## Core Workflows

### Workflow 1: Change a Publication Token

1. Designer or PM requests the value change.
2. Token Architect identifies the token and brand file.
3. Agent edits only the value, not the key.
4. Agent runs token build and validation.
5. QA verifies at least three brands: the changed brand, one adjacent brand, and one unrelated brand.
6. PR includes changed files, screenshots or notes, and validation output.
7. After merge, Release Agent syncs to Figma and Pencil.

### Workflow 2: Add a New Publication

1. Publication Stylist collects identity inputs: logo, primary colors, typefaces, voice, and example pages.
2. Token Architect creates `tokens/brands/{slug}.json` and updates `_meta.json`.
3. Component Builder verifies existing components render with the new brand.
4. Storybook Documenter adds the brand to examples if needed.
5. QA runs publication launch checks.
6. Release Agent ships and syncs downstream tools.

### Workflow 3: Build a Shared Editorial Component

1. Component Builder checks existing components and metadata first.
2. Component is built with semantic tokens and responsive constraints.
3. Metadata file documents purpose, variants, tokens, dependencies, and caveats.
4. Storybook Documenter adds brand-switchable stories.
5. QA runs token audit and visual checks across representative brands.

### Workflow 4: Audit a Publication

1. QA selects a publication and a set of templates or components.
2. Agent checks color, typography, spacing, responsive behavior, and hardcoded styling.
3. Findings are grouped as token gaps, component gaps, content/template gaps, or tooling gaps.
4. Fixes become small PRs with evidence.

## Governance

### Required Checks

Every token or component PR should include:

- Token build status
- Token validation status
- Audit status
- Brands tested
- Components or pages reviewed
- Known gaps

### Review Rules

- Token key changes require explicit migration notes.
- Generated files should only change through the build scripts.
- Components must consume semantic tokens or documented CSS variables.
- New components need metadata and Storybook coverage.
- Publication-specific exceptions must be written down.

## First Production Slice

The first useful version should not try to cover every workflow at once. It should prove the full loop for a small but representative set.

Recommended pilot:

- Brands: `cosmopolitan`, `car-and-driver`, `esquire`, `good-housekeeping`, `delish`
- Templates: article page, home page, card collection, right rail, newsletter/signup
- Components: button, card, badge, nav, carousel, pagination, input
- Outputs: Next.js app, Storybook, Pencil spec, Figma variables, token dashboard

Definition of done:

- A designer can request a token change in plain English.
- The agent edits the correct Git token file.
- Generated files rebuild successfully.
- The change is visible in the app and Storybook.
- QA verifies representative brands.
- The change can be synced to Figma and Pencil.

## Near-Term Backlog

1. Create a canonical publication manifest.
   First version added at `hearst-design-system/tokens/publications.json`, with `npm run publications:validate` checking token files, logos, Pencil files, font override pointers, and runtime logo mappings.

2. Add agent runbooks to this repo.
   First version added in `CODEX-AGENT-RUNBOOKS.md`; next step is to convert repeated runbook flows into scripts or reusable task templates.

3. Strengthen component metadata.
   Ensure each reusable component has a metadata file with usage rules, tokens consumed, variants, and accessibility notes.

4. Add automated brand matrix checks.
   Generate a simple report showing which components have been visually checked against which brands.

5. Create a publication onboarding workflow.
   A single command or agent flow should add a new publication, validate tokens, and produce a first preview.

6. Add design-token migration policy.
   Define how to rename, deprecate, or replace tokens without breaking publications.

7. Make QA output reviewable.
   Store audit reports and visual notes in `reports/` so PR reviewers can inspect evidence.

## Working Agreement

We should build this incrementally:

1. Stabilize the token contract.
2. Instrument the components.
3. Make agents narrow and reliable.
4. Prove the loop on five representative publications.
5. Scale to the full Hearst portfolio.

The system should be judged by whether a real publication change can move from request to reviewed PR to synced design tools without manual re-interpretation.
