---
name: hearst-pencil-design
description: Manage Hearst Pencil .pen files for component handoff and documentation. Update variables, build specs, create annotation pages, maintain documentation. Use when working with .pen files, creating component handoffs, or syncing tokens to Pencil.
---

# Hearst Pencil Design

**Working directory:** `/Users/leninaviles/Projects/hearst`

## Role

Pencil is the handoff layer between design and code. It uses production tokens and is a **CONSUMER** of Git tokens.

## Key Files

| File | Purpose |
|------|---------|
| `hearst-brands.pen` | Main design file with all components and documentation |
| `hearst-brands-car-and-driver.pen` | Brand-specific file |

## Variable Syntax

- Pencil uses `$variable-name` syntax (e.g. `$brand-1`, `$space-md`, `$font-primary`)
- In code, these map to CSS `var(--token-name, #fallback)`
- **Designers MUST use `$variable` references, never hardcode hex values**

## MCP Tools (user-pencil server)

**IMPORTANT:** Always read tool schemas before calling. Key tools:

| Tool | Purpose |
|------|---------|
| `get_editor_state()` | Check current state, active file, selection |
| `open_document(filePathOrNew)` | Open a .pen file or create new |
| `batch_get(patterns, nodeIds)` | Search/read nodes by pattern or ID |
| `batch_design(operations)` | Insert/copy/update/replace/move/delete nodes |
| `snapshot_layout` | Check computed layout rectangles |
| `get_screenshot` | Take screenshot of a node for visual verification |
| `get_guidelines(topic)` | Get design guidelines |
| `find_empty_space_on_canvas` | Find space for new content |
| `get_variables` | Read current variables/themes |
| `set_variables` | Add/update variables |

### batch_design Operation Syntax

Operations use a script syntax (one operation per line):

| Operation | Syntax | Example |
|-----------|--------|---------|
| Insert | `foo=I("parent", { ... })` | Add new node |
| Copy | `baz=C("nodeid", "parent", { ... })` | Copy existing node |
| Replace | `foo2=R("nodeid1/nodeid2", { ... })` | Replace node(s) |
| Update | `U(foo+"/nodeid", { ... })` | Update node properties |
| Delete | `D("dfFAeg2")` | Remove node |
| Move | `M("nodeid3", "parent", 2)` | Move node to new parent |
| Generate image | `G("baz", "ai", "...")` | AI-generated image |

### get_guidelines Topics

`code`, `table`, `tailwind`, `landing-page`, `slides`, `design-system`, `mobile-app`, `web-app`

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run push-pencil` | Push Git tokens to Pencil variables |
| `npm run sync-pencil` | Sync from Pencil |

## batch_design Tips

- Max ~25 operations per call
- Nodes in flexbox layouts ignore absolute x/y positioning
- Use `find_empty_space_on_canvas` before inserting large content
- **Always `get_screenshot` after major changes to verify visually**
- Icon names use lucide set (e.g. `circle-check` not `check-circle`)

## Annotation Patterns (from Resin analysis)

For creating annotated/spec pages:

- Create tooltip frames with token info (Pencil variable, CSS variable, Tailwind class, specs)
- Use thin line frames to connect tooltips to target elements
- Group annotations by section (Navigation, Hero, Footer, etc.)

## Rules

- **NEVER** hardcode hex values in Pencil — use `$variable` references
- **ALWAYS** verify with `get_screenshot` after visual changes
- Contents of .pen files are **encrypted** — use **ONLY** pencil MCP tools to read/write
- **Do NOT** use Read or Grep tools on .pen files
