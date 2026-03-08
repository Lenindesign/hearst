# Hearst Design System

A comprehensive white-label design system for Hearst magazine brands, built with [Pencil](https://pencil.io) and informed by Figma source files.

## Structure

```
hearst/
├── hearst-brands.pen          # Main Pencil design file (design system + organisms + home page templates)
├── hearst-brands2.pen         # Secondary Pencil design file
├── brands/                    # Brand logo SVGs (29 Hearst brands)
├── hearst-design-system/      # Next.js code implementation
├── *.py                       # Utility scripts for batch operations, auditing, and SVG extraction
├── *.json                     # Batch operation data and brand configuration
└── README.md
```

## Pencil Design File (`hearst-brands.pen`)

The main design file contains:

### Foundations
- **Typography** — Font scales, families, and text styles using `$font-family-default` and `$font-family-serif` tokens
- **Layout** — Grid system, spacing scale, and responsive breakpoints

### Components (Atomic)
- Card (Vertical, Horizontal)
- Button (Primary, Secondary, Outline, Ghost, Destructive)
- Badge (Primary, Neutral, Success, Warning, Danger, Highlight)
- Accordion, Carousel, Chip, Divider, Form Label, Image, Media, Input, Link, Pagination

### Organisms (New Section Components)
- **Trending Card** — Vertical + Horizontal variants with numbered badge, image, title, metadata, star ratings, bookmark
- **Right Rail Vertical Card** — Full article card with image, eyebrow, title, description, author, CTA button, recipe section
- **Collection List** — Desktop (vertical list) + Mobile (horizontal scroll) with branded header
- **Trending** — Desktop (5-card horizontal row) + Mobile (5-card vertical column)
- **Big Card** — Desktop (666px image) + Mobile (320px) hero/feature card
- **Right Rail** — Desktop (300×600 ad + card list) + Mobile (300×250 ad + card list)

### Home Page Templates
- **Desktop 1440** — Full-width home page with all sections
- **Laptop 1024** — Responsive adaptation
- **Tablet 768** — Tablet-optimized layout
- **Mobile 320** — Mobile-first compact layout

### Brand Style Guides
29 Hearst brand themes with individual color palettes, typography, and logo treatments.

## Design Tokens

All components use semantic design tokens for dynamic theming:

| Token | Purpose |
|-------|---------|
| `$brand-1` | Primary brand color |
| `$font-family-default` | Sans-serif body font |
| `$font-family-serif` | Serif display font |
| `$content-default` | Primary text color |
| `$content-subtle` | Secondary text color |
| `$content-knockout` | Inverse text (on dark) |
| `$content-on-brand` | Text on brand color |
| `$background-page` | Page background |
| `$background-subtle` | Subtle background |
| `$palette-neutral-*` | Neutral color scale (100–900) |
| `$space-*` | Spacing scale (2xs–4xl) |

## Brands

29 Hearst magazine brands with SVG logos:

Autoweek, Best Products, Biography, Car and Driver, Cosmopolitan, Country Living, Delish, Elle Decor, Esquire, Good Housekeeping, Harper's Bazaar, House Beautiful, Men's Health, Oprah Daily, Popular Mechanics, Prevention, Road & Track, Runner's World, Seventeen, Town & Country, Veranda, Woman's Day, Women's Health, and more.

## Scripts

| Script | Purpose |
|--------|---------|
| `audit-brands.py` | Audit brand token coverage |
| `compare-variables.py` | Compare design token variables across brands |
| `extract-svg-for-pencil.py` | Extract SVG paths for Pencil import |
| `gen-logo-ops.py` | Generate batch operations for logo insertion |
| `gen-all-logo-ops.py` | Generate operations for all brand logos |

## Tech Stack

- **Design Tool**: [Pencil](https://pencil.io)
- **Source Design**: Figma
- **Code Implementation**: Next.js + TypeScript + Tailwind CSS
- **Icons**: Lucide
