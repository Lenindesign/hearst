---
name: hearst-devops-deploy
description: Deploy the Hearst design system to Netlify, manage build pipeline, handle Storybook sub-path deployment, Git operations. Use when deploying, fixing build issues, managing CI/CD, or running Git commits.
---

# Hearst DevOps / Deploy

**Working directory:** `hearst-design-system/` (run all commands from project root or `hearst-design-system/`)

## Hosting

- **Netlify:** hearst-design-system.app
- Next.js app + Storybook served from same domain

## netlify.toml Configuration

```toml
[build]
  base = "hearst-design-system"
  command = "npm run build && npx storybook build -o .next/static/sb --quiet && node scripts/fix-storybook-paths.mjs"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/storybook"
  to = "/_next/static/sb/index.html"
  status = 301
  force = true

[[headers]]
  for = "/_next/static/sb/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## Build Pipeline

1. `npm run build` — Next.js production build
2. `npx storybook build -o .next/static/sb --quiet` — Storybook into Next.js static dir
3. `node scripts/fix-storybook-paths.mjs` — rewrite relative paths to absolute

## Storybook Sub-Path Deployment

- Storybook is built into `.next/static/sb/`
- `fix-storybook-paths.mjs` rewrites `href="./` and `src="./` to `href="/_next/static/sb/`
- Netlify redirect sends `/storybook` → `/_next/static/sb/index.html` (301)
- CDN headers cache Storybook assets immutably

## Known Issues

- `@netlify/plugin-nextjs` intercepts routes — do NOT use Next.js rewrites for Storybook
- Storybook's built HTML uses relative paths — the fix script is required
- If Storybook shows blank in production, check that `fix-storybook-paths.mjs` ran successfully

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
- Verify both the main app AND `/storybook` work after deploy
- Do NOT use Next.js rewrites for Storybook (conflicts with @netlify/plugin-nextjs)
