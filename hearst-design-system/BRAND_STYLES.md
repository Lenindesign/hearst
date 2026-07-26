# Hearst Brand Style Registry

This registry documents the brand layer used by the Hearst reader prototypes. Read it with `DESIGN-SYSTEM-SPEC.md`, `PRODUCT.md`, `STYLE.md`, and `APP_RULES.md` before changing brand colors, fonts, logos, mastheads, or theme behavior.

## Inheritance model

1. **Native Hearst foundation:** shared layout, spacing, component anatomy, interaction behavior, accessibility, responsive rules, and semantic token roles.
2. **Brand layer:** publication colors, typography, logo assets, and explicitly approved brand treatments.
3. **Scoped surface exception:** a documented treatment such as Hearst+ Videos dark mode. Exceptions are applied last and cannot leak outside their named surface.

Brand identity changes appearance, not product behavior. A card, sidebar row, carousel, masthead, or reader should keep the same structure and interaction model when the active brand changes.

The brand layer extends the Hearst Design System foundation used by the application. It does not replace the foundation or establish a publication-specific component library.

## Implementation sources

- Canonical HDS publication tokens: `tokens/brands/{slug}.json`
- Canonical publication registry metadata: `tokens/brands/_meta.json`
- Generated outputs, never edit directly: `src/lib/brands.ts` and `src/lib/tokens.css`
- App-only destination theme compositions: `src/lib/theme-options.ts`
- Semantic CSS mapping, font aliases, and dark-mode derivation: `src/lib/theme-css-vars.ts`
- Masthead logos and compact brand icons: `src/lib/logos.ts`
- Font loading and font-face declarations: `src/app/layout.tsx` and `src/app/globals.css`

Do not edit generated TypeScript or CSS. For a publication, update its canonical token JSON and rebuild the generated outputs. For an app-only destination composition, update `src/lib/theme-options.ts`. Then validate and synchronize this registry.

## Destination route and theme map

The route names and internal theme slugs are intentionally different in two places. Use this map rather than inferring a theme from a URL.

| Route | Destination mode | Theme slug |
|---|---|---|
| `/hearst-plus/` | All / Hearst+ | `hearst-all` |
| `/hearst-lifestyle/` | Lifestyle | `hearst-lifestyle` |
| `/hearst-autos/` | Autos | `hearst-plus` |
| `/hearst-flux/` | Fashion & Luxury | `hearst-flux` |
| `/hearst-ew/` | Enthusiast & Wellness | `hearst-ew` |

## Native default style guide

- **Structure:** shared destination masthead, navigation, carousel, river, sidebars, cards, reader, and responsive breakpoints.
- **Color roles:** brand primary, brand secondary, page background, default content, subtle content, borders, interactive states, and knockout content.
- **Typography roles:** body/UI (`--font-brand`), editorial secondary (`--font-brand-secondary`), and headline (`--font-headline` plus weight and stretch).
- **Interaction:** use the shared editorial-link and complete-row behavior owned by `STYLE.md`.
- **Logos:** use the registered SVG without stretching or substituting another brand. Normalize masthead logos by visual height, not total width.
- **Fallback:** use the White Label/native token for a missing role. Missing publication logos remain absent until the correct asset is registered.

## Hearst destination themes

The **HDS page token** is the theme's published background value. The prototype application canvas remains `#F4F2EE` unless a scoped rule in `APP_RULES.md` overrides it.

### Identity

| Theme | Slug | Primary | Secondary | HDS page token | Logo |
|---|---|---:|---:|---:|---|
| Hearst Magazines / Hearst+ | `hearst-all` | `#2D75B9` | `#DCEBFA` | `#F4F8FC` | `/logos/hearst-plus.svg` |
| Hearst Autos | `hearst-plus` | `#1B5F8A` | `#D8EAF4` | `#F3F7FA` | `/logos/hearst-autos.svg` |
| Hearst Lifestyle | `hearst-lifestyle` | `#7A2E57` | `#F7C6D9` | `#F7EFE7` | `/logos/hearst-lifestyle.svg` |
| Hearst Fashion & Luxury | `hearst-flux` | `#000000` | `#EDEDED` | `#F7F7F7` | `/logos/hearst-fashion-luxury.svg` |
| Hearst Enthusiast & Wellness | `hearst-ew` | `#E50022` | `#FFE0E4` | `#FFF5F6` | `/logos/hearst-ew-official.svg` |

### Typography

| Theme | Body/UI | Editorial | Headline | Runtime status |
|---|---|---|---|---|
| Hearst Magazines / Hearst+ | Inter | Inter | Newsreader 700 | Loaded |
| Hearst Autos | Inter | Inter | Barlow Condensed 700 | Loaded |
| Hearst Lifestyle | Inter | Newsreader | Newsreader 700 | Loaded |
| Hearst Fashion & Luxury | Inter | Newsreader | Modern MT Pro 400 | Loaded |
| Hearst Enthusiast & Wellness | Inter | Newsreader | Knockout Condensed 900 | Proprietary asset pending; League Gothic / Barlow Condensed fallback |

## Publication brand themes

The registry is split into narrower identity and typography tables so it remains usable in Obsidian mobile.

### Identity

| Brand | Slug | Primary | Secondary | HDS page token | Logo |
|---|---|---:|---:|---:|---|
| White Label | `white-label` | `#000000` | `#FFFFFF` | `#FFFFFF` | Native text fallback |
| AutoWeek | `autoweek` | `#FFC84E` | `#EB3135` | `#FFFFFF` | `/logos/autoweek.svg` |
| Best Products | `best-products` | `#1C1C9B` | `#E22D21` | `#FFFFFF` | `/logos/bestproducts.svg` |
| Bicycling | `bicycling` | `#067EA7` | `#F8D811` | `#FFFFFF` | `/logos/bicycling.svg` |
| Biography | `biography` | `#A00000` | `#FFFFFF` | `#FFFFFF` | `/logos/biography.svg` |
| Car and Driver | `car-and-driver` | `#1B5F8A` | `#00A4DB` | `#FFFFFF` | `/logos/caranddriver.svg` |
| Cosmopolitan | `cosmopolitan` | `#D70000` | `#F6D3E5` | `#FFFFFF` | `/logos/cosmo.svg` |
| Country Living | `country-living` | `#0A5C80` | `#CDE5F0` | `#FFFFFF` | `/logos/country.svg` |
| Delish | `delish` | `#004685` | `#FFC035` | `#FFFFFF` | `/logos/delish.svg` |
| ELLE Decor | `elle-decor` | `#3777BC` | `#FFFFFF` | `#FFFFFF` | `/logos/elle-decor.svg` |
| ELLE | `elle` | `#000000` | `#F5F5F4` | `#FFFFFF` | `/logos/elle.svg` |
| Esquire | `esquire` | `#FF3A30` | `#F5F6F8` | `#FFFFFF` | `/logos/esquire.svg` |
| FRE | `fre` | `#000000` | `#FFFFFF` | `#FFFFFF` | Native text fallback |
| Good Housekeeping | `good-housekeeping` | `#53C2BE` | `#198294` | `#FFFFFF` | `/logos/good-housekeeping.svg` |
| Harper's BAZAAR | `harpers-bazaar` | `#000000` | `#AA0703` | `#FFFFFF` | `/logos/harpers.svg` |
| House Beautiful | `house-beautiful` | `#242D39` | `#FBFAFA` | `#FFFFFF` | `/logos/house.svg` |
| Men's Health | `mens-health` | `#D2232E` | `#FFF200` | `#FFFFFF` | `/logos/mens.svg` |
| Oprah Daily | `oprah-daily` | `#E61957` | `#166534` | `#FFFFFF` | `/logos/oprah.svg` |
| Popular Mechanics | `popular-mechanics` | `#1C6A65` | `#F04E3E` | `#FFFFFF` | `/logos/popular.svg` |
| Prevention | `prevention` | `#44C1C5` | `#EAF4F5` | `#FFFFFF` | `/logos/prevention.svg` |
| Redbook | `redbook` | `#D30C4F` | `#69DCBF` | `#FFFFFF` | `/logos/redbook.svg` |
| Road & Track | `road-and-track` | `#BB322F` | `#1B1A1A` | `#FFFFFF` | `/logos/roadandtrack.svg` |
| Runner's World | `runners-world` | `#59E7ED` | `#FF7D46` | `#FFFFFF` | `/logos/runners.svg` |
| Seventeen | `seventeen` | `#FF92DE` | `#EEFFAE` | `#FFFFFF` | `/logos/seventeen.svg` |
| The Pioneer Woman | `the-pioneer-woman` | `#8B376C` | `#F4EDD8` | `#FFFFFF` | `/logos/pioneer.svg` |
| Town & Country | `town-and-country` | `#9A0500` | `#030929` | `#F1F2F4` | `/logos/town.svg` |
| Veranda | `veranda` | `#F3EAD9` | `#FFFFFF` | `#FFFFFF` | `/logos/veranda.svg` |
| Woman's Day | `womans-day` | `#683D85` | `#D80900` | `#FFFFFF` | `/logos/womans.svg` |
| Women's Health | `womens-health` | `#1D4ED8` | `#EBFF7C` | `#FFFFFF` | `/logos/womenshealth.svg` |

### Typography

| Brand | Body/UI | Editorial | Headline | Runtime status |
|---|---|---|---|---|
| White Label | SF Pro | SF Pro | SF Pro 700 | Loaded / system fallback |
| AutoWeek | SF Pro | SF Pro | Inter 700 | Loaded |
| Best Products | SF Pro | SF Pro | Inter 700 | Loaded |
| Bicycling | SF Pro | SF Pro | Velo Serif Display 700 | Loaded |
| Biography | SF Pro | SF Pro | Playfair Display 400 | Loaded |
| Car and Driver | Inter | Barlow Semi Condensed | Inter 800 | Loaded |
| Cosmopolitan | Basis Grotesque Pro | Chronicle Display | Chronicle Display 600 | Loaded |
| Country Living | Montserrat | Playfair Display | Playfair Display 400 | Loaded |
| Delish | TT Commons Pro | SF Pro | TT Commons Pro 700 | Loaded |
| ELLE Decor | SF Pro | Modern MT Pro | Modern MT Pro 400 | Loaded |
| ELLE | Neue Haas Unica Pro | Modern MT Pro | Modern MT Pro 400 | Loaded |
| Esquire | Lausanne | Lausanne | Lausanne 400 | Loaded |
| FRE | SF Pro | Georgia | SF Pro 700 | Loaded / system fallback |
| Good Housekeeping | Barlow Semi Condensed | Barlow Semi Condensed | Barlow Semi Condensed 800 | Loaded |
| Harper's BAZAAR | Helvetica Now Text | NewParis Text | NewParis Text 400 | Loaded |
| House Beautiful | Visuelt Pro | Apparel | SangBleu Sunrise 500 | Loaded |
| Men's Health | Manrope | SF Pro | Manrope 800 | Loaded |
| Oprah Daily | SF Pro | Juana | Juana 500 | Loaded |
| Popular Mechanics | SF Pro | Work Sans | United Sans Cd 400 | Loaded |
| Prevention | Poppins | SF Pro | Poppins 700 | Loaded |
| Redbook | SF Pro | SF Pro | SF Pro 700 | Loaded / system fallback |
| Road & Track | SF Pro | Roboto | Buzz 900 | Loaded |
| Runner's World | SF Pro | Futura Now Text | League Gothic 400 | Loaded |
| Seventeen | SF Pro | SF Pro | Inter 800 | Loaded |
| The Pioneer Woman | Livvic | Petrona | Livvic 700 | Loaded globally |
| Town & Country | Montserrat | Montserrat | Montserrat 600 | Loaded |
| Veranda | SF Pro | Playfair Display | Playfair Display 400 | Loaded |
| Woman's Day | SF Pro | Arvo | League Spartan 600 | Loaded |
| Women's Health | Altone | Apparel | Altone 700 | Loaded |

## Brand application rules

- The primary and secondary values above feed semantic tokens. Components must use semantic roles rather than referencing the raw hex values.
- Headline weight is part of the brand identity and must travel with the headline family.
- Use registered masthead SVGs at their intrinsic aspect ratio. Never constrain different wordmarks to the same width.
- Normalize masthead wordmarks by visual cap height and baseline. Destination qualifiers may extend the width without shrinking the Hearst wordmark.
- Use compact brand icons only in metadata, filters, and dense lists. Do not replace a masthead wordmark with an icon.
- Dark mode uses the accessible derived primary from `brandToCssVars`; do not assume the light primary has sufficient contrast on a dark surface.
- AutoWeek keeps the dark-neutral editorial-title exception documented in `STYLE.md` and `APP_RULES.md`.
- Hearst+ Videos keeps its scoped light-blue and white-logo exception documented in `STYLE.md` and `APP_RULES.md`.

### HOT ROD Events scoped composition

- `/autos/hot-rod/events/` and its event-series routes inherit the Hearst Autos 4/8/12 grid, component anatomy, body typography, utility navigation, focus treatment, and footer.
- The event surface may apply a tightly scoped HOT ROD editorial composition using red `#C8101E`, track black `#111111`, asphalt `#242424`, route cream `#F3EBDD`, and white. These values must stay inside the HOT ROD Events route root and must not alter shared Autos components or sibling publications.
- HOT ROD Events uses the existing Autos condensed headline role and neutral UI/body role. It does not introduce a separate font or component system.
- The route-line motif, dark photographic hero, and warm roadbook surface are editorial compositions. Controls, links, status labels, grids, and responsive behavior continue to use shared Hearst Design System foundations.

## Maintenance rule

When a brand color, font, logo, or icon changes:

1. Update the canonical token JSON for publication values or the app-only destination composition for destination values.
2. Validate contrast, font availability, logo rendering, and light/dark behavior.
3. Test the brand page, one destination surface, and the reader.
4. Update this registry in the same change.
5. Do not modify another brand unless the shared native foundation changed.
