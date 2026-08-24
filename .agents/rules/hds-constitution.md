# Hearst Design System (HDS) Design Constitution Rule

You are an AI assistant and design technologist working on the Hearst Design System (HDS). You must adhere to the 8 unbreakable articles of the **HDS Design Constitution**:

## 1. Respect the 5-Layer Stack
1. Token JSONs (`tokens/`) &rarr; 2. UI Primitives (`src/components/ui/`) &rarr; 3. Global Modules (`src/components/hearst-plus/`) &rarr; 4. Two Page Archetypes (Home & Article) &rarr; 5. 29+ Brand Themes (`tokens/brands/`). Never cross boundaries or hardcode brand styling into core primitives.

## 2. Zero "AI Slop"
- **Forbidden**: Multi-colored pastel rainbow borders (cyan, purple, pink), saturated neon badge fills, candy pill buttons, generic unstyled cards.
- **Mandated**: Hearst Navy (`#102A43`), Hearst Blue (`#2D75B9`), single-pixel slate grids (`gap-px bg-slate-200` with `bg-white p-6`), Newsreader serif headlines, 2px solid navy section dividers (`border-t-2 border-[#102A43] pt-6`).

## 3. The Two Core Page Archetypes
- **Template 1: Home & Index Discovery** (`/hearst-plus/`, `/hearst-lifestyle`, `/autos/delish`) — Multi-source feed blending, 4 layout variants (Curator, Mosaic, Stream, Editorial), companion sidebar rails (Discovery, Trending, Local News TV, Your Daily Habit).
- **Template 2: Article & Detail Reading** (`/read/[storyId]`) — Distraction-free reading, 4 reading modes (Standard 8+4, Immersive Feature, Ambient Snap Track, Dialog Shell), author bio context rail, fact sheets, verified commerce blocks.

## 4. Card Model Contracts
- Standard River Card: 16:9 ratio, topic kicker + middle dot + brand name, max 3-line clamped headline, 3-line dek summary, byline, timestamp, bookmark action.
- 5-Image Mosaic Gallery: 6-column composite grid (2 large top images + 3 bottom images with "+X" count overlay).
- 16:9 Video Card: Playable `<AdaptiveVideo />` player with duration timestamp.
- 9:16 Shorts Reel: Vertical 9:16 portrait looping player with sound controls.
- **Prohibited**: Generic `[ARTICLE]`, `[WATCH]`, or `[READ]` type chips.

## 5. Multi-Brand Token Governance
All styling must resolve through CSS custom properties (e.g., `var(--primary)`, `var(--font-headline)`). Injected at runtime via `data-brand="{brandSlug}"`.

## 6. Verification
All changes must pass TypeScript compilation (`npx tsc --noEmit`) and production build (`next build`).
