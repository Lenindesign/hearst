# Product

## Required Implementation References

Before changing the interface, read this file together with:

- `VAULT_HOME.md` for the project knowledge map and source-of-truth order.
- `DESIGN-SYSTEM-SPEC.md` for canonical HDS token architecture, generated outputs, and component contracts.
- `DESIGN.md` for the concise design-tool context and Hearst Design System inheritance model.
- `STYLE.md` for visual hierarchy, theming, responsive behavior, and interaction rules.
- `BRAND_STYLES.md` for native-style inheritance and each destination or publication's colors, fonts, and logos.
- `APP_RULES.md` for personalization, feeds, readers, content behavior, and scoped exceptions.

## Register

product

## Users

Hearst readers who want one daily destination for useful editorial content across brands. They arrive looking for relevance first: dinner ideas, wellness guidance, shopping help, home inspiration, entertainment, technology, and cars, not a publisher-by-publisher directory.

## Product Purpose

Hearst+ is a personalized cross-brand discovery app. It should combine the editorial quality of Hearst brands with the habit loop of a daily feed: morning brief, continuing reads, saved collections, trending stories, and recommendations that become more useful as the reader interacts with content.

## Current Prototype Truth

Hearst+ is a working reader prototype. It combines a validated snapshot of public Hearst RSS story metadata with read-only Personalize article and video recommendations, then applies implemented eligibility, additive ranking, diversity, progressive delivery, reader-overlay, gallery, and adaptive-video behavior.

Reader profile, preference, and stakeholder-control state is prototype data. The Personalize entry point starts with clear create-profile and sign-in choices, then asks for one or two interests and optional trusted brands before applying the preference. Browsing remains open without a profile. Local email demo profiles keep the reader&rsquo;s choices, saves, and history in that browser. Verified Google profiles can sync the same prototype state through the server profile store so the demo can carry saves across signed-in devices. For You river cards expose one quiet, source-backed explanation for their ranking without showing the stakeholder scoring model. High-value For You modules use a deterministic inventory allocation so Today&rsquo;s Picks, Today&rsquo;s Edit, Daily Habit, Trending Across Brands, and the river have distinct stories while small catalogs retain a usable feed. Stakeholder controls and technical explanation panels are hidden from the default reader experience and require explicit demo mode. A typed, browser-only product-event contract supports prototype measurement without sending data to a vendor. Production account infrastructure, consent, analytics collection, dashboards, CMS publishing, and experimentation are not completed integrations. The RSS catalog changes only after the import, byline-enrichment, and validation workflow succeeds; production delivery requires that workflow to be scheduled and monitored before each daily morning edition.

## Design System Architecture

This application is built on top of the Hearst Design System. Hearst+ and the destination prototypes are an application layer that composes Hearst Design System components, foundations, semantic tokens, typography roles, icons, and brand themes. The application may add product-specific patterns and documented surface exceptions, but it must not create a parallel or competing design system.

## Brand Personality

Editorial, personal, practical. The interface should feel like a tuned magazine app: readable, visual, confident, and useful without becoming a publisher dashboard.

## Anti-references

Avoid dashboard-first layouts, analytics cards above the fold, brand-first navigation as the primary model, generic publisher homepages, and social feeds that reward low-quality or anonymous engagement. The surface should not feel like a control panel.

## Design Principles

- Content leads the experience.
- Interests come before publisher brands.
- Every recommendation explains why it appeared.
- Editorial imagery must preserve storytelling value.
- Habit features stay subtle and elegant.

## Accessibility & Inclusion

Target WCAG AA contrast for text and controls. Support keyboard access, clear focus states, reduced motion alternatives, and readable layouts across desktop and mobile.
