---
name: hearst-storybook-docs
description: Create and maintain Storybook stories and MDX documentation for the Hearst design system. Configure decorators, mocks, and brand theming in Storybook. Use when adding stories, documenting components, or updating Storybook configuration.
---

# Hearst Storybook Documentation Agent

**Working directory:** `hearst-design-system/` (run all commands from project root or `hearst-design-system/`)

## Stack

- Storybook 8.6 with React-Vite framework
- MDX support for documentation pages
- Brand theming via ThemeDecorator

## Configuration Files

| File | Purpose |
|------|---------|
| `.storybook/main.ts` | Stories glob, addons, Vite aliases for Next.js mocks |
| `.storybook/preview.tsx` | Decorators (ThemeDecorator), story sort order, global parameters |
| `.storybook/ThemeDecorator.tsx` | Wraps stories with ThemeContext.Provider, injects CSS variables per brand |
| `.storybook/mocks/next-link.tsx` | Mock for Next.js Link component (renders as `<a>`) |
| `.storybook/mocks/next-navigation.ts` | Mocks for usePathname, useRouter, useSearchParams, useParams |

## Story Sort Order (defined in preview.tsx)

```
Welcome, The Toolbox, Figma Integration, Pencil Integration, Foundation [Colors, Typography, Tokens], Templates, Components
```

## Creating Stories (.stories.tsx)

- Place in `src/stories/`
- Import components from `@/components/`
- Use `Meta` and `StoryObj` types from `@storybook/react`
- For full-page stories (like HomePage), use `parameters: { layout: "fullscreen" }` and wrap in a div with `style={{ margin: "-2rem", minHeight: "100vh" }}`
- The ThemeDecorator handles brand switching -- stories automatically get brand theming
- For components that use `useTheme()`, it works because ThemeDecorator provides ThemeContext

### Example Story

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "@/components/my-component";

const meta: Meta<typeof MyComponent> = {
  title: "Components/MyComponent",
  component: MyComponent,
};
export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {
  args: { label: "Click me" },
};
```

## Creating MDX Documentation

- Place in `src/stories/` or `src/` with `.mdx` extension (glob: `../src/**/*.mdx`)
- Use standard MDX format (markdown + JSX)
- Import `Meta` from `@storybook/blocks` for title
- Existing docs: `Welcome.mdx`, `Toolbox.mdx`, `FigmaIntegration.mdx`, `PencilIntegration.mdx`
- Do NOT use emojis in documentation -- use inline SVG logos for tool icons (see Toolbox.mdx for examples)

## Key Pattern: HomePageTemplate vs BrandHomePage

- `HomePageTemplate` -- the homepage content WITHOUT NavBar (use in Storybook)
- `BrandHomePage` -- includes NavBar (use in the main app)
- This split exists because Storybook stories should not include the global app navigation

## Vite Aliases (in main.ts)

| Alias | Resolves to |
|-------|--------------|
| `@` | `src/` |
| `next/link` | `.storybook/mocks/next-link.tsx` |
| `next/navigation` | `.storybook/mocks/next-navigation.ts` |

## Development

| Command | Purpose |
|---------|---------|
| `npm run storybook` | Dev server on port 6006 |
| `npm run build-storybook` | Production build (default output: `storybook-static/`) |

## Production deployment

Netlify builds Storybook into `.next/static/sb/` and serves it at **`/storybook`** (rewrite, URL stays `/storybook`). See **hearst-devops-deploy** skill for `netlify.toml`. Local dev remains **`npm run storybook`** → http://localhost:6006.

## Rules

- Do NOT use emojis in documentation -- use inline SVG logos for tool icons
- Stories should work with the brand switcher (ThemeDecorator handles this)
- After changes to `main.ts`, restart the Storybook dev server (hot reload does not pick up config changes)
- If Storybook shows blank page, clear cache: `rm -rf node_modules/.cache/storybook node_modules/.vite-storybook`
