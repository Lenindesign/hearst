---
name: token-mapping
description: Use to report how hardcoded style values on a page, file or diff map onto the Hearst Design System's semantic tokens, such as "are we using our tokens here", "which hardcoded colors map to which tokens", a token audit, reviewing a pull request for new hard-coded colors, or planning a token migration. It never edits. Replacing the values is a separate change.
---

# Token mapping (HDS)

A read-only report that lands raw values (hex, px, shadows) on the Hearst Design System's token list. Classes, normalising and tolerances are in `references/mapping-rules.md`. "Check the tokens on the settings page" is enough of an ask. Find the values and the list yourself.

Adapted from [design.how](https://github.com/arla6ka/design.how) `skills/token-mapping` (MIT, see `LICENSE`). The HDS changes are the token sources below, scopes alongside modes, the `Scoped` class and the gap threshold that leaves it out.

## The HDS token list

Read the list from these, in this order. Never fill it from memory or from a framework default (shadcn, Tailwind palette).

1. `hearst-design-system/src/app/globals.css`: custom properties on `:root`, `.dark`, `.hearst-plus-theme` and `@theme`, plus scoped wrappers (`[data-destination-mode]`, `[data-brand]`).
2. `hearst-design-system/src/lib/theme-css-vars.ts` (`brandToCssVars`) applied to the themes in `src/lib/theme-options.ts` and the publications in `src/lib/brands.ts`. Most semantic tokens (`--primary`, `--card`, `--muted-foreground`, `--palette-*`, `--component-*`, `--hp-*`) only get values at runtime, and they differ by brand and by color mode.
3. `hearst-design-system/tokens/`: the DTCG source. Where it disagrees with the runtime value, the runtime value is what ships; report the disagreement in Source.
4. Purposes: token names plus `AIDLC-docs/DESIGN-SYSTEM-SPEC.md`, `STYLE.md` (semantic token rules, nearest wrapper wins) and `BRAND_STYLES.md` (brand colors and scoped art direction). No token carries a written description, so mark every purpose taken from a name as inferred.

A good starting set of values is the repository's own audit: `npx tsx scripts/audit-tokens.ts --ci` (new fingerprints against `reports/token-audit-baseline.json`). It scans `src/components` only; say so in Coverage if `src/app` or `globals.css` was not read.

## Steps

1. **Find the list.** As above. Record which sources you read and how. If a read fails, say so and stop.
2. **Find the values.** What the person named, else the branch diff, else the audit's new fingerprints, else the product code. Record each with its file, line, property and job.
3. **Resolve.** Follow every alias to its final value in each mode (light, dark) and each scope (the brand or destination wrapper the element renders under; the nearest wrapper wins). Portaled dialogs render under `<body>` and may not inherit a page wrapper: check, and mark the scope inferred when you cannot tell. Write down every disagreement between two sources.
4. **Normalise** both sides (lengths to px, colours to OKLCH compared by delta E OK) with code, never by eye: `node .agents/skills/token-mapping/scripts/oklch.mjs <color>` and `--delta <a> <b>`. Run it by that `.agents` path: through the `.claude/skills` link it prints nothing. It does not read `color-mix()`, `lab()` or `color()`: resolve those with a browser's computed style and say so in Source.
5. **Classify** each row once per mode and scope. Purpose first, then value.
   - Exact: the token's job covers the row and the values match.
   - Semantic: the job covers it and the value is inside tolerance. State the difference in numbers.
   - Ambiguous: two or more tokens fit and nothing picks one. Name every candidate.
   - Scoped: the value is deliberate art direction for one route, module or campaign (for example the Brutalist home, the Delish onboarding modal, the A&E spotlight). `BRAND_STYLES.md` says scoped art direction lives in its named scoped configuration, not in a shared component. Name the configuration it should move to; never invent a token name for it.
   - Gap: no token's job covers it, or the only fitting token is out of tolerance, and it is not Scoped. A gap never gets a new name.
6. **Count and close.** Count Scoped rows apart from gaps. When true gaps (Scoped excluded) are over 30% of rows and number 12 or more, say the list may be the wrong one, still deliver the table, and lead with `Status: not actionable (gap threshold)`. Otherwise lead with `Status: actionable` and the number of rows that can be swapped now (Exact plus Semantic).

## Report

Summary, Swap now (Exact and Semantic rows, ready for a pull request), Mapping, Scoped (grouped by the configuration each should move to), Do not use (a token whose value matches but whose job differs), Ambiguous, Gaps, Bugs found (for example a contrast failure seen while resolving), For a person to decide, Source. Last line `Coverage:` with what was scanned and what was not. Run on its own, the chat reply gives the answer with its numbers and one prompt the person can paste to take the next step. Save the report under `output/token-mapping/<date>-<scope>.md` only when the person asks for a file.

## Rules

- A match on value before purpose is wrong. Wrong: `#6b7280` mapped to a border token because the hex is equal. Right: it is text, so the candidates are text tokens (`--muted-foreground`), and the border token goes in Do not use.
- A semantic token wins over the primitive it aliases. Map to a primitive (`--palette-brand-*`, `--brand-*`) only when no semantic token covers the job, and say so.
- A palette class (`text-slate-500`) names a value and no job. It gets a row, counted apart from raw values.
- Anything inferred rather than read, such as a job taken from a class name or a scope taken from the route, is marked inferred.
- A value that is right in light mode and wrong in dark mode is two rows. A dark row that fails contrast also goes in Bugs found.
- Counts carry their unit: occurrences, lines or mapping rows.

## Stops

Stop and report on these only. No list could be read. One name has two values in the same mode and scope. Two sources disagree and no project rule says which wins (report both). Return what stopped it, the groundwork so far, and the shortest message that unblocks it.

## Done

Every row has a job, a class and a reason. Every ambiguous row names two or more candidates; every Scoped row names its configuration. Nothing in the repo changed (`git status` is the same before and after, unless the person asked for a saved report). The last line reads `Coverage:`.
