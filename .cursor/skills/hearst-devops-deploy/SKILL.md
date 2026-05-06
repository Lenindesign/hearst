---
name: hearst-devops-deploy
description: Deploy the Hearst design system to Netlify, manage build pipeline, Git operations. Use when deploying, fixing build issues, managing CI/CD, or running Git commits.
---

# Hearst DevOps / Deploy

**Working directory:** `hearst-design-system/` (run all commands from project root or `hearst-design-system/`)

## Hosting

- **Netlify:** hearst-design-system.netlify.app — Next.js style guide app only
- **Storybook:** not deployed; official catalog is **`npm run storybook`** → http://localhost:6006

## netlify.toml Configuration

```toml
[build]
  base = "hearst-design-system"
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/storybook"
  to = "/"
  status = 301
  force = true

[[redirects]]
  from = "/storybook/*"
  to = "/"
  status = 301
  force = true

[[redirects]]
  from = "/_next/static/sb"
  to = "/"
  status = 301
  force = true

[[redirects]]
  from = "/_next/static/sb/*"
  to = "/"
  status = 301
  force = true

[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

Legacy `/storybook` and `/_next/static/sb/*` URLs redirect to `/` because Storybook is not built on Netlify (use `npm run storybook` locally).

## Build Pipeline

1. `npm run build` — Next.js production build only

Optional locally: `npm run storybook` (dev) or `npm run build-storybook` (static output e.g. `storybook-static/`). Use `scripts/fix-storybook-paths.mjs` only if you serve a static Storybook build from a subpath.

## Known Issues

- `@netlify/plugin-nextjs` intercepts routes — prefer Netlify `[[redirects]]` over Next.js rewrites for edge cases

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

- Deploy includes **Next.js build** only; Storybook is **local**
- Verify the main app after deploy; verify Storybook with `npm run storybook` before merging UI changes
