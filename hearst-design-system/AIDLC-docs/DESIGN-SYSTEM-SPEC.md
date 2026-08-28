# Hearst Design System specification

This document defines the current source hierarchy, token architecture,
component contract, Storybook role, and delivery evidence for the Hearst Design
System and Hearst+.

It is a repository specification, not proof of a deployed release. When this
document and executable behavior differ, current production components, routes,
canonical token files, and verified automation are the evidence to reconcile.

## 1. Authority

| Surface | Authority | Role |
| --- | --- | --- |
| Canonical token values | `tokens/` | Reviewed editing surface for core, semantic, component, publication, and typography decisions |
| Production behavior | Routed application and production React components | Interaction, state, responsive, accessibility, and content behavior |
| Generated application tokens | `src/lib/tokens.css` and `src/lib/brands.ts` | Runtime outputs; never edit by hand |
| Storybook | Production-backed stories and documentation | Executable component specification and stakeholder review surface |
| Figma | Downstream design consumer | Exploration and optional published Variables |
| Pencil | Optional downstream design/inspection consumer | Bounded `.pen` artifacts when a team explicitly uses them |
| GitHub workflow | `../.github/workflows/hearst-design-system-quality.yml` | Current repository quality and application-build automation |

Figma and Pencil do not override canonical Git tokens or shipped production
behavior. A design artifact can support a specification but cannot substitute
for a production import site, executable interaction, or responsive route.

## 2. Product and component scope

The design system supports Hearst+ and shared reader-facing patterns across
publication themes. Hearst+ remains a personalized editorial reader, not a CMS,
analytics dashboard, or production identity service.

The component hierarchy is:

1. **HDS primitives** — accessible controls and low-level content anatomy in
   `src/components/ui/`.
2. **Editorial patterns** — reusable article, gallery, recipe, vehicle,
   shopping, guide, and video treatments.
3. **Product modules** — Hearst+ navigation, discovery, reader, action,
   recommendation, advertising, onboarding, and personalization boundaries.
4. **Templates** — route composition, feed orchestration, ranking, delivery,
   and destination behavior.

A component belongs at the lowest layer that fully owns its behavior. Do not
create page-local markup when a production component already owns the contract.

Public Hearst+ components and helpers are exported from
`src/components/hearst-plus/index.ts`. New public APIs should be typed,
additive where possible, and independent of story fixture shapes.

## 3. Storybook contract

Storybook organizes production components; it is not an independent component
implementation or a proposal gallery.

Every production-backed story must:

- import the same component or composition used by the application;
- identify its production source, route, or ownership boundary;
- use deterministic production-aligned content or label a synthetic
  interaction state;
- exercise meaningful behavior instead of rendering only static markup;
- inherit destination foundation tokens before publication overrides;
- cover applicable default, hover, focus-visible, active, selected, disabled,
  permission, loading, empty, error, retry, success, destructive, and recovery
  states;
- verify 320px, 390px, tablet, and desktop behavior where responsive;
- include keyboard and focus assertions for important interactions;
- document exceptions and unavailable evidence.

Unverified or exploratory work belongs in `src/storybook-candidates`, which the
Storybook configuration intentionally does not index.

When Storybook and production differ, update Storybook to match production
unless a separate production change has been explicitly requested and approved.

The current component inventory and audit depth are maintained in
**Hearst Plus / Components / Inventory**.

## 4. Token architecture

### Canonical locations

```text
tokens/
├── core/
│   └── global.json
├── semantic/
│   ├── aliases.json
│   ├── color/
│   ├── component/
│   ├── layout/
│   ├── misc/
│   └── typography/
└── brands/
    ├── _meta.json
    └── {publication-slug}.json
```

The current checkout contains 435 core tokens, 13 semantic JSON files, and 29
publication-theme JSON files. Counts are diagnostic, not compatibility
promises.

### Token shape

Canonical flat entries use:

```json
{
  "component-card-background-default": {
    "type": "color",
    "value": "#111111"
  }
}
```

Supported values in the current application generator include colors, numbers,
and strings. Reference or composite behavior requires explicit generator and
validation coverage.

### Naming

Names describe intent, not a screen or raw value:

```text
{layer}-{category}-{element}-{variant}-{state}
```

Examples:

- `palette-background-page`
- `palette-content-default`
- `component-button-background-primary-solid-default`
- `component-button-background-primary-solid-hover`
- `component-navigation-utility-content-accent`
- `space-md`
- `font-family-default`

The canonical JSON key is the cross-tool identity. CSS adds `--`; Figma may use
slash grouping; Pencil references may add `$`.

Detailed naming and usage rules live in **Foundation / Token Naming** and
**Foundation / Token Usage**.

## 5. Production generation

Run:

```bash
npm run build-tokens
```

`scripts/build-from-tokens.ts` reads canonical core, publication, and
typography metadata and writes:

- `src/lib/brands.ts` — typed publication theme data;
- `src/lib/tokens.css` — CSS custom properties for the default and
  `[data-brand]` scopes.

`src/app/globals.css` imports the generated CSS. `ThemeProvider` and Storybook's
theme decorator select the appropriate `data-brand` scope and apply the
destination/publication layering used by the application.

Do not hand-edit generated output. Review its diff after canonical changes.

### Current coverage gap

`scripts/build-from-tokens.ts` does not directly read all 13 files under
`tokens/semantic/`. The relationship between semantic source files and shipped
CSS/TypeScript output is not yet protected by an explicit coverage test. Treat
semantic additions or removals as incomplete until generation and runtime
consumption are proven.

## 6. Tailwind and CSS consumption

Components consume semantic CSS custom properties directly or through the
Tailwind theme bridge in `src/app/globals.css`.

Preferred:

```tsx
<button className="bg-primary text-primary-foreground focus-visible:ring-ring" />
```

```css
.reader-card {
  background: var(--component-card-background-default);
  color: var(--palette-content-default);
}
```

Avoid:

- new hard-coded publication colors in component code;
- Tailwind arbitrary color values for canonical design decisions;
- raw palette values where a semantic or component token exists;
- inline values that bypass publication theming.

The token audit currently reports zero component-level hard-coded-color,
raw-color-function, or non-semantic-Tailwind violations. The original
689-finding baseline remains checked in as a historical regression ledger;
all 689 entries are resolved. Any new or reintroduced violation fails
`npm run tokens:audit:ci`; do not refresh the baseline to excuse new debt.

Brand and campaign art direction that is not a reusable system token must still
have one explicit, scoped owner. Cinematic article palettes live in
`src/lib/article-editorial-themes.ts`, Ambient Reader campaign palettes live in
`src/lib/ambient-interstitial-themes.ts`, Ambient Reader and production
content-reader surfaces live in `src/lib/ambient-reader-theme.ts` and
`src/lib/content-reader-theme.ts`, and HOT ROD event composition lives
in `src/lib/hot-rod-events.ts`. Rendering components consume those values
through scoped semantic CSS-variable contracts so they cannot leak into shared
themes.

## 7. Publication themes

The registered theme set is discovered from `tokens/brands/*.json`. The current
checkout contains 29 publication JSON files, including the white-label
fallback.

Theme resolution follows the application:

1. shared/core values;
2. destination foundation;
3. publication semantic and component overrides;
4. scoped product exceptions documented by the owning component or route.

Publication themes must not leak across destination boundaries. Adding a theme
requires canonical token data, typography metadata, registration, Storybook
coverage, and production-route verification.

## 8. Typography, assets, and icons

Typography metadata identifies intended family roles and weights. It does not
prove that a font is licensed, loaded, or rendered. Validate the actual
production asset and a production component.

Remote editorial imagery uses approved Hearst/CDN sources and production-aligned
fixtures. Do not replace missing brand assets with text approximations, emoji,
CSS drawings, or improvised SVG logos.

Phosphor is the official general-purpose icon set. Shared icon wrappers and
component APIs should preserve accessible names, consistent weight, and the
production size scale. Publication marks and product logos are brand assets,
not generic icons.

## 9. Figma delivery

Figma Variables are optional downstream output.

```bash
npm run push-figma > figma-payload.json
```

Despite the historical command name, `scripts/push-to-figma.ts` only prints a
payload. The current verified output contains one collection, 29 modes, 774
variables, and 22,432 mode values.

An approved Figma Variables API or connected-tool write is separate. After the
write, verify destination identity, variable names, modes, values, scopes,
WEB code syntax, failures, and the exact destination revision.

Do not expose credentials or private file identifiers in repository
documentation, screenshots, logs, or pull-request descriptions.

See **Delivery / Figma** for the current destination checklist and limitations.

## 10. Pencil delivery

Pencil is optional. It is not the mandatory handoff layer, the approved
specification for every component, or proof of pixel parity.

```bash
npm run push-pencil > pencil-payload.json
```

`scripts/push-to-pencil.ts` only prints a Pencil-compatible payload. The current
verified output contains 1,042 variables across 29 publication themes. It does
not select or modify a `.pen` file.

The repository contains `homepage-version3.pen`; its contents must be inspected
through Pencil editor tools. A separate legacy Token Studio path,
`scripts/sync-to-pencil.ts`, targets `../../hearst-brands.pen`, while
`scripts/sync-from-pencil.ts` can regenerate application output from legacy
`src/lib/pencil-variables.json`. These paths conflict with the ordinary
Git-to-production authority model and must be treated as legacy or migration
utilities until ownership and conflict resolution are documented.

See **Delivery / Pencil** for safe handling and verification.

## 11. Change workflow

1. Identify the production component, route, state, and publication themes.
2. Search existing components and tokens before adding an API or token.
3. Change the smallest canonical owner.
4. Regenerate application output when token files change.
5. Update the production-backed Storybook specification.
6. Run the repository quality and application-build gates.
7. Review screenshots, accessibility, responsive behavior, public API impact,
   migration, and rollback.
8. Merge only after accountable review.
9. Generate Figma or Pencil payloads only when those destinations are required.
10. Perform and verify each authorized external write separately.
11. Publish through the authorized release process.
12. Verify the published artifact and exact source revision.

Use evidence-based status:

- **Proposed**
- **In review**
- **Merged**
- **Generated**
- **Verified in destination**
- **Released**

Do not describe a generated payload as synchronized, a merge as deployed, or a
passing Storybook build as a production release.

## 12. Quality gates

Run:

```bash
npm run quality
npm run build
```

The current `quality` command includes:

- token structure, validation, and no-regression hard-coded-style checks;
- publication metadata validation;
- unit tests;
- all indexed Storybook interaction and automated accessibility scenarios;
- Featured Carousel keyboard traversal;
- reviewed visual-regression cases;
- every indexed story at 320, 390, 768, and 1,280px for rendering and
  horizontal page overflow;
- every indexed documentation page at 390 and 1,280px for headings, render
  errors, browser errors, and horizontal page overflow.

The no-regression token audit is currently at zero known violations against
the retained 689-finding historical baseline.

The root GitHub workflow runs this quality command and then the application
build for matching pull requests, `main` pushes, and manual dispatch.

Automated success is not WCAG conformance and does not prove screen-reader
usability, 200% zoom, forced colors, reduced motion, touch behavior, or external
production parity. Record manual evidence for the changed journey.

See **Delivery / Quality** for the full evidence contract.

## 13. Governance and compatibility

Accountable review roles, story acceptance, public API classification,
deprecation, and pull-request evidence live in `CONTRIBUTING.md` and
**Delivery / Governance**.

Public changes are:

- **Patch** — compatible fix, documentation, or token correction;
- **Minor** — backward-compatible API, token, or variant;
- **Major** — removed or renamed export, prop, behavior, story ID, or
  canonical token.

Do not remove a public API in the release that deprecates it. Provide a
replacement and migration example, update `CHANGELOG.md`, retain compatibility
for at least one minor release and 30 days unless an emergency requires
otherwise, and remove only in an announced major release.

The repository currently has no `CODEOWNERS` file and no formal versioned
package release. Documented roles and deprecation windows therefore are policy,
not fully automated enforcement.

## 14. Release evidence

`CHANGELOG.md` keeps current work under **Unreleased** until a formal release is
established.

A release claim requires:

1. exact source revision;
2. passing quality and application build;
3. accountable review;
4. Storybook, responsive, accessibility, and visual evidence;
5. migration and rollback guidance where applicable;
6. authorized publication;
7. provider or registry success;
8. smoke tests of the published artifact or route.

Netlify build configuration exists in `../netlify.toml`. Repository
configuration alone does not prove provider connection, automatic deployment,
preview availability, or a successful deployed revision.

## 15. Known gaps

- No `CODEOWNERS` mapping enforces the documented review roles.
- No formal package artifact, registry, or versioned release workflow is
  established.
- No repository evidence proves Jira transitions or required Jira gates.
- No repository-owned pull-request Storybook preview workflow is present.
- Figma and Pencil writes do not produce a non-secret sync receipt.
- No round-trip test proves external design-tool values match canonical Git.
- Production generation does not explicitly cover every semantic JSON file.
- Legacy Pencil and Token Studio scripts retain conflicting upstream and
  destination paths.
- Manual screen-reader, zoom, forced-colors, reduced-motion, and touch evidence
  is not stored consistently.
- Visual baselines prove stability against reviewed local images, not every
  publication or live content combination.

## 16. Canonical references

- `PRODUCT.md` — product purpose, audience, and constraints.
- `APP_RULES.md` — interaction and application rules.
- `STYLE.md` — visual system and component-use rules.
- `BRAND_STYLES.md` — publication registry and theme requirements.
- `DESIGN.md` — concise design context.
- `CONTRIBUTING.md` — ownership, acceptance, compatibility, and deprecation.
- `CHANGELOG.md` — release-facing change record.
- `DECISION_LOG.md` — dated design-system decisions.
- Storybook **Start**, **Foundation**, **Components**, and **Delivery** sections
  — executable specifications and current evidence.
