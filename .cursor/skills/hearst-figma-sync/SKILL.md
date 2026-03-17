---
name: hearst-figma-sync
description: Push Hearst design tokens to Figma variables, manage variable collections and modes, verify sync status. Use when running push-figma, troubleshooting Figma variable issues, or checking Figma sync state.
---

# Hearst Figma Sync

**Working directory:** `hearst-design-system/` (run all commands from project root or `hearst-design-system/`)

## Role

Figma is a **CONSUMER**, not a source of truth. Tokens flow one way: **Git → Figma**.

## Figma File

| Property | Value |
|----------|-------|
| File key | `XFDMnMs6TI0uvAwyJnDZA1` |
| Collection name | "Hearst Design System" |
| Brand modes | 29 (one per brand) |
| URL | https://www.figma.com/design/XFDMnMs6TI0uvAwyJnDZA1/Hearst-Tokens |

## Related: Resin Component Library

| Property | Value |
|----------|-------|
| File key | `j9rEb1JK8RdH7bs1Q74qJK` |
| Purpose | Hearst's internal CMS component library (separate system, read-only for us) |
| Variables | Own variables with 29 brand modes in an "alias" collection |
| Rule | Keep separate from our consumer-facing tokens |

## Scripts

| Command | Script | Purpose |
|---------|--------|---------|
| `npm run push-figma` | `scripts/push-to-figma.ts` | Main push script |
| — | `scripts/push-figma-batches.ts` | Batched push for large payloads (splits into 6 batches to avoid API limits) |

## MCP Tools Available

| Tool | Purpose |
|------|---------|
| `getlocalvariables` | Read all variables from a file |
| `getpublishedvariables` | Read published variables |
| `postvariables` | Create/update variables (has payload size limits) |
| `getfilenodes` | Read node structure |
| `getfile` | Read file metadata |

## Variable Scopes

| Variable type | Recommended scopes |
|---------------|---------------------|
| Color | `ALL_FILLS`, `STROKE_COLOR` |
| Number | `ALL_SCOPES` (covers spacing, sizing, radius) |
| String | `ALL_SCOPES` (font families, weights) |
| Font variables | `ALL_SCOPES` (not `FONT_FAMILY` alone) |

## Known Limitations

- Figma `STRING` variables cannot control `fontFamily` in the properties panel (Figma limitation)
- Font variables (`font/primary`, `font/secondary`, `font/headline`) should have scope `ALL_SCOPES` for maximum flexibility
- `postvariables` payload must be split into batches (max ~6 batches) to avoid 413 errors
- MCP `postvariables` may fail with schema validation errors — use direct REST API calls via `push-figma-batches.ts` as fallback

## Workflow

1. Tokens are edited in Git and built with `build-tokens`
2. Run `npm run push-figma` to sync to Figma
3. Verify in Figma: check variable panel shows correct values per brand mode
4. Designers switch brands via the variable mode selector

## Rules

- **NEVER** edit Figma variables directly — always push from Git
- **NEVER** treat Figma as source of truth
- After pushing, verify at least 3 brands show correct colors/fonts
- If push fails with 413, use the batched script
