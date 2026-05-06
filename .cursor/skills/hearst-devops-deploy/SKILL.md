---
name: hearst-devops-deploy
description: Deploy the Hearst design system to Netlify, manage build pipeline, Storybook sub-path deployment, Git operations. Use when deploying, fixing build issues, managing CI/CD, or running Git commits.
---

# Hearst DevOps / Deploy

**Working directory:** `hearst-design-system/` (run all commands from project root or `hearst-design-system/`)

## Hosting

- **Netlify:** hearst-design-system.netlify.app — Next.js style guide + **Storybook at `/storybook`**
- **Local dev Storybook:** `npm run storybook` → http://localhost:6006

## netlify.toml Configuration

```toml
[build]
  base = "hearst-design-system"
  command = "npm run build && npx storybook build -o .next/static/sb --quiet && node scripts/fix-storybook-paths.mjs"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/storybook/index.json"
  to = "/_next/static/sb/index.json"
  status = 200
  force = true

[[redirects]]
  from = "/storybook/iframe.html"
  to = "/_next/static/sb/iframe.html"
  status = 200
  force = true

[[redirects]]
  from = "/storybook"
  to = "/_next/static/sb/index.html"
  status = 200
  force = true

[[redirects]]
  from = "/storybook/"
  to = "/_next/static/sb/index.html"
  status = 200
  force = true

[[headers]]
  for = "/_next/static/sb/index.json"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

Production Storybook URL: **https://hearst-design-system.netlify.app/storybook/**  
Canonical redirects send bare `/_next/static/sb/index.html` → `/storybook` so bookmarks stay clean.

## Build Pipeline

1. `npm run build` — Next.js production build
2. `npx storybook build -o .next/static/sb --quiet` — Storybook into `.next/static/sb`
3. `node scripts/fix-storybook-paths.mjs` — rewrite relative paths to absolute (`/_next/static/sb/`)

## Known Issues

- `@netlify/plugin-nextjs` intercepts routes — use Netlify `[[redirects]]` for Storybook (status **200** rewrite for `/storybook`, not 301 to static path)
- If Storybook shows blank in production, confirm `fix-storybook-paths.mjs` ran during the Netlify build

## Deploy Commands

```bash
# Deploy via Netlify (triggered by git push)
git add . && git commit -m "message" && git push

# Or trigger manual deploy
# Netlify auto-deploys from main branch
```

## Git Workflow

- Main branch auto-deploys to production
- Commit messages should describe the "why" not the "what"
- Run `build-tokens` and `tokens:check` before committing if tokens were changed
- After merge: run `push-figma` and `push-pencil` to sync consumers

## Designer Branch Workflow

Designers editing tokens in Cursor must follow this workflow:

1. Create a branch: `git checkout -b tokens/{description}`
2. Edit token values (never commit to `main` directly)
3. Run `npm run build-tokens && npm run tokens:check`
4. Commit and push the branch
5. Open a PR for developer review
6. Developer merges after review, then runs `push-figma` + `push-pencil`

## .gitignore (relevant entries)

- `/storybook-static`
- `/public/storybook`
- `node_modules/`
- `.next/`

## Rules

- ALWAYS include both Next.js build AND Storybook build in deploy
- NEVER skip `fix-storybook-paths.mjs` — Storybook will be broken without it
- Verify the main app AND `/storybook` after deploy
