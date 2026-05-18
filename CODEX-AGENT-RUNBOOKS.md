# Codex Agent Runbooks for the Hearst Design System

This file translates the existing `.cursor/skills/` agents into a Codex operating model.

The Cursor skills remain useful domain references. This runbook answers the operational questions Codex needs on each task:

- Which agent mode should handle the request?
- Which files are in scope?
- Which files are forbidden?
- Which checks are required?
- What evidence must be reported before the work is considered done?

## Routing Rules

Start by classifying the request. Use the narrowest agent that can complete the work.

| Request type | Primary agent | Supporting agents |
|---|---|---|
| Change color, font, spacing, or token values | Token Architect | QA Review |
| Add a publication or brand mode | Token Architect | Publication Stylist, QA Review, Figma Sync, Pencil Design |
| Build or fix React component styling | Component Builder | Grid System, Storybook Documenter, QA Review |
| Build or fix layout and column behavior | Grid System | Component Builder, QA Review |
| Add or update stories or MDX docs | Storybook Documenter | Component Builder, QA Review |
| Push variables to Figma | Figma Sync | QA Review |
| Update `.pen` specs or Pencil variables | Pencil Design | QA Review |
| Prepare deploy, build, or release evidence | Release Agent | QA Review |
| Review cross-publication rendering | QA Review | Token Architect, Component Builder |

If a request spans multiple agents, sequence them. Do not let every agent touch every file.

## Shared Preflight

Before editing:

1. Check `git status --short --branch`.
2. Identify unrelated modified files and leave them alone.
3. Read the relevant existing implementation before changing it.
4. Confirm whether the task touches generated files.
5. Choose the smallest file ownership boundary that can complete the request.

When the work touches `.pen` files:

- Do not read `.pen` files with shell tools.
- Use Pencil tools only.
- Take a visual screenshot after major visual changes.

When the work touches tokens:

- Edit JSON source files under `hearst-design-system/tokens/`.
- Regenerate generated outputs through scripts.
- Do not manually edit `src/lib/brands.ts` or `src/lib/tokens.css`.

## Shared Evidence Format

Every completed task should report the evidence that matches its risk.

Use this shape in PR descriptions, handoff notes, or final summaries:

```text
Change:
- What changed

Files:
- Files intentionally edited

Validation:
- Command or check: result

Brand coverage:
- Brand slug: what was checked

Known gaps:
- Anything not verified or intentionally left out
```

For small documentation-only changes, validation can be `not run: documentation-only`.

## Token Architect

Use for token source-of-truth work.

Source reference:
- `.cursor/skills/hearst-token-architect/SKILL.md`
- `.cursor/rules/designer-tokens.md`

Allowed files:
- `hearst-design-system/tokens/core/**/*.json`
- `hearst-design-system/tokens/semantic/**/*.json`
- `hearst-design-system/tokens/brands/**/*.json`
- `hearst-design-system/src/lib/brands.ts` only as generated output
- `hearst-design-system/src/lib/tokens.css` only as generated output
- Token reference docs when the request is documentation-related

Forbidden actions:
- Manually editing generated `src/lib/brands.ts`
- Manually editing generated `src/lib/tokens.css`
- Renaming token keys without explicit migration approval
- Deleting token keys in designer self-serve workflows
- Treating Figma or Pencil as token source of truth

Required checks:
- `npm run build-tokens`
- `npm run tokens:check`
- `npm run tokens:validate` when structure changes

Minimum brand coverage:
- Changed brand
- One adjacent category brand
- One unrelated brand

Completion evidence:
- Token file changed
- Generated files updated by script if applicable
- Check results
- Brands verified

## Publication Stylist

Use when translating a publication identity into the shared token contract.

Allowed files:
- `hearst-design-system/tokens/brands/{slug}.json`
- `hearst-design-system/tokens/brands/_meta.json`
- `hearst-design-system/tokens/publications.json`
- Brand notes or audit docs

Forbidden actions:
- Creating one-off component forks for brand expression without review
- Encoding publication-specific behavior in shared component logic when tokens can express it
- Adding a new publication without launch QA

Required checks:
- Compare publication identity inputs against current tokens
- Confirm logo availability
- Confirm typography overrides
- Run Token Architect checks for any token changes
- Run `npm run publications:validate` after manifest, logo, Pencil, or font metadata changes

Completion evidence:
- Publication slug and display name
- Fonts and primary palette mapped
- Open token gaps listed
- Brand preview status

## Component Builder

Use for React components, templates, and production UI implementation.

Source reference:
- `.cursor/skills/hearst-frontend-component/SKILL.md`

Allowed files:
- `hearst-design-system/src/components/**`
- `hearst-design-system/src/lib/component-metadata.ts`
- Component `.metadata.ts` files
- Component-specific styles when already part of the implementation pattern

Forbidden actions:
- Hardcoding publication colors
- Editing generated token outputs by hand
- Adding brand-specific conditionals before checking whether a token or variant solves the need
- Adding a new reusable component without metadata

Required checks:
- `npm run audit` for styling or component changes
- `npm run index` after adding or substantially changing component metadata
- App or Storybook preview when visual behavior changes

Minimum brand coverage:
- `cosmopolitan`
- `car-and-driver`
- `esquire`

Completion evidence:
- Component behavior changed
- Tokens used
- Metadata added or updated
- Audit result
- Brand preview notes

## Grid System

Use for page-level layout, columns, containers, and responsive spatial behavior.

Source reference:
- `.cursor/skills/hearst-grid-system/SKILL.md`

Allowed files:
- `hearst-design-system/src/components/ui/grid.tsx`
- `hearst-design-system/src/components/ui/grid.metadata.ts`
- Layout templates using `PageContainer`, `Grid`, and `Col`
- `hearst-design-system/src/stories/Grid*`

Forbidden actions:
- Hand-rolling page-level grids where the primitives should be used
- Using dynamic Tailwind class strings like `col-span-${n}`
- Changing the 4/8/12 column contract without explicit approval
- Making grid mechanics brand-aware

Required checks:
- Verify mobile, tablet, and desktop behavior
- Check overlap stories if overlap props changed
- Confirm no new unbounded layout shift is introduced

Completion evidence:
- Breakpoints checked
- Grid primitives used or reason documented
- Storybook coverage if the contract changed

## Storybook Documenter

Use for stories, MDX guides, Storybook structure, and docs.

Source reference:
- `.cursor/skills/hearst-storybook-docs/SKILL.md`

Allowed files:
- `hearst-design-system/src/stories/**`
- `hearst-design-system/.storybook/**`
- Story-specific docs and examples

Forbidden actions:
- Treating Storybook-only CSS as production component implementation
- Adding stories that bypass brand theming when the component is brand-aware
- Relying on Storybook config hot reload after changing config

Required checks:
- `npm run storybook` for visual docs changes when feasible
- `npm run build-storybook` for config or deployment-sensitive changes

Completion evidence:
- Story path and title
- Brands or controls verified
- Any known Storybook-only constraints

## Figma Sync Agent

Use when Git tokens need to be pushed to Figma variables.

Source reference:
- `.cursor/skills/hearst-figma-sync/SKILL.md`

Allowed files:
- `hearst-design-system/scripts/push-to-figma.ts`
- `hearst-design-system/scripts/push-figma-batches.ts`
- Figma sync docs

Forbidden actions:
- Editing Figma variables as source values
- Pulling values from Figma into Git as truth without review
- Mixing the consumer-facing design-system variables with the Resin component library variables

Required checks:
- Run or dry-run the sync path requested
- Verify at least three brand modes after push
- Use batched push path if payload limits are hit

Completion evidence:
- Sync command used
- Brands checked in Figma
- Any failed variables or fallback path

## Pencil Design Agent

Use for `.pen` files, token-bound design specs, and handoff pages.

Source reference:
- `.cursor/skills/hearst-pencil-design/SKILL.md`

Allowed surfaces:
- Pencil MCP tools
- `hearst-brands.pen`
- Brand-specific `.pen` files
- Pencil sync scripts

Forbidden actions:
- Reading `.pen` files with shell tools
- Editing `.pen` files outside Pencil tools
- Hardcoding hex values into Pencil specs
- Skipping screenshot verification after visual changes

Required checks:
- Confirm active Pencil document
- Use `$variable` references
- Capture screenshot after major changes
- Run relevant sync script if the request changes variables

Completion evidence:
- Document touched
- Nodes or sections changed
- Screenshot or visual verification status
- Variables used

## QA Review Agent

Use before merge, after visual changes, and for cross-publication checks.

Source reference:
- `.cursor/skills/hearst-qa-review/SKILL.md`

Allowed files:
- Read broadly across implementation, tokens, stories, and reports
- `hearst-design-system/reports/**` when generating audit/index evidence

Forbidden actions:
- Approving visual changes without checking rendered output when feasible
- Reporting vague issues without brand slug, expected result, and actual result
- Fixing unrelated issues found during review unless requested

Required checks by task:
- Token change: `npm run build-tokens`, `npm run tokens:check`
- Component change: `npm run audit`
- Metadata change: `npm run index`
- Release: app build plus Storybook build path

Minimum brand coverage:
- One fashion/lifestyle brand
- One autos brand
- One neutral or black-forward brand

Default set:
- `cosmopolitan`
- `car-and-driver`
- `esquire`

Completion evidence:
- Findings ordered by severity
- File and line references for code review
- Brands checked
- Residual risk

## Release Agent

Use for builds, deploy readiness, Git hygiene, and post-merge sync.

Source reference:
- `.cursor/skills/hearst-devops-deploy/SKILL.md`

Allowed files:
- `hearst-design-system/netlify.toml`
- `hearst-design-system/scripts/fix-storybook-paths.mjs`
- Build/deploy docs
- Package scripts when the task explicitly changes pipeline behavior

Forbidden actions:
- Skipping Storybook build for deploy-sensitive changes
- Removing `fix-storybook-paths.mjs` from the deploy path
- Committing unrelated dirty files
- Deploying from an unreviewed branch unless explicitly requested

Required checks:
- `npm run build`
- `npm run build-storybook` or the Netlify-equivalent Storybook build path
- Verify `/storybook/` behavior after deploy-sensitive changes

Completion evidence:
- Build results
- Deploy path checked
- Git branch and commit status when relevant
- Post-merge Figma/Pencil sync status when tokens changed

## End-to-End Workflows

### Token Change

1. Token Architect edits source token JSON.
2. Token Architect runs build and token checks.
3. QA Review checks generated output and representative brands.
4. Storybook Documenter updates docs only if behavior or usage changed.
5. Release Agent prepares PR evidence.
6. After merge, Figma Sync and Pencil Design sync consumers.

### New Publication

1. Publication Stylist maps identity inputs to the publication contract.
2. Publication Stylist adds or updates the entry in `tokens/publications.json`.
3. Token Architect creates brand token file and metadata.
4. Run `npm run publications:validate` to confirm token, logo, Pencil, and font metadata wiring.
5. Component Builder confirms templates render without forks.
6. Storybook Documenter exposes the brand where needed.
7. QA Review runs launch matrix.
8. Release Agent ships, then Figma Sync and Pencil Design update consumers.

### New Shared Component

1. Component Builder checks existing components first.
2. Grid System joins if page-level layout is involved.
3. Component Builder implements with tokens and metadata.
4. Storybook Documenter adds brand-switchable stories.
5. QA Review runs audit and representative brand checks.
6. Release Agent handles build/deploy readiness.

### Publication Audit

1. QA Review selects the publication, templates, and components.
2. QA Review classifies findings as token gaps, component gaps, layout gaps, or tooling gaps.
3. Token Architect handles token gaps.
4. Component Builder or Grid System handles implementation gaps.
5. Storybook Documenter records any reusable guidance.

## Stop Conditions

Stop and ask for direction when:

- A token key needs to be renamed or deleted.
- A brand needs behavior that cannot be expressed by tokens, variants, or editorial modes.
- A `.pen` file appears corrupted or cannot be opened with Pencil tools.
- Figma sync would overwrite variables outside the Hearst Design System collection.
- Existing user changes conflict directly with the requested edit.
- The requested change would require deploying or pushing to production and the user has not asked for that.

## First Slice Operating Standard

Until a broader matrix exists, use this representative set for most visual checks:

- `cosmopolitan`
- `car-and-driver`
- `esquire`
- `good-housekeeping`
- `delish`

Use this component/template set for the pilot:

- Article page
- Home page
- Card and card collection
- Right rail
- Newsletter/signup
- Button
- Badge
- Nav
- Carousel
- Pagination
- Input

This is enough to prove the loop without pretending the entire portfolio is fully validated.
