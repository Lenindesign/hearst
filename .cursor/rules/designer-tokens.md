---
description: Guides designers editing tokens directly in Cursor. Enforces branch workflow, value-only edits, and validation before commit.
globs: tokens/**/*.json
---

# Designer Token Editing

You are helping a **designer** edit design tokens directly in Cursor. Designers can safely modify token **values** but must follow guardrails to prevent breaking the system.

## Allowed Changes

- Change a hex color value (e.g. `#d70000` → `#cc0000`)
- Change a number value (spacing, font size, border radius)
- Change a font family or weight string
- Change a typography preset value

## Not Allowed Without Developer Review

- Delete any token key
- Rename any token key
- Add a brand-new token key
- Modify `tokens/semantic/aliases.json` references
- Edit any file outside `tokens/`

## Workflow

1. **Create a branch** — never commit directly to `main`
   ```bash
   git checkout -b tokens/{description}
   ```
2. **Edit the token value** in the appropriate JSON file
3. **Run validation**
   ```bash
   npm run build-tokens
   npm run tokens:check
   ```
4. **Preview** in the dev server across 3+ brands
   ```bash
   npm run dev
   ```
5. **Commit and push**
   ```bash
   git add tokens/ src/lib/brands.ts src/lib/tokens.css
   git commit -m "tokens: {describe the change}"
   git push -u origin HEAD
   ```
6. **Open a PR** for developer review before merging

## Validation Rules

- `build-tokens` must pass with zero errors
- `tokens:check` must confirm no tokens were removed
- All brand files must have the same set of keys
- Hex colors must be valid 6-digit format with `#` prefix

## What the AI Should Do

- Always create a branch first
- Only modify values, never keys
- Run `build-tokens` and `tokens:check` after every edit
- Show the designer what changed before committing
- Open a PR, never merge to main directly
