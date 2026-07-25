# Ambient Reader branded interstitial template

## Layout contract

- Overlay: `fixed inset-0`, above reader chrome, with a solid brand-appropriate backdrop.
- Desktop grid: approximately `0.82fr 1.18fr`; the media side should receive the larger share.
- Mobile: stack copy above media, keep the CTA reachable without scrolling when practical.
- Close control: absolute upper-right of the full overlay (`right` and `top` offsets), minimum 44px target, visible over both columns.
- Copy column: generous padding, logo at top, headline in a display serif or approved brand typeface, one short paragraph, one CTA.
- Media column: `object-cover`, no nested card border, optional gradient only for text legibility.

## Media decision

1. A stable official MP4/WebM/HLS asset that plays in-browser: use `<video>` with autoplay muted loop playsInline.
2. An official campaign image but no stable video: use `<img>` and document the fallback.
3. Neither is verifiable: stop and ask for an approved asset; do not use a third-party image or guessed URL.

## Accessibility contract

- `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and `aria-describedby`.
- Close button has an accessible name and visible focus ring.
- Escape closes the interstitial before closing the underlying reader.
- Logo alt text names the advertiser; campaign media alt text describes the creative.
- Text and controls meet WCAG AA contrast against their actual background.
- Reduced-motion users receive a still image or paused media.

## Copy contract

- Eyebrow identifies the placement as an advertisement and names the category.
- Headline is taken from or faithfully adapted from official campaign language.
- Supporting copy is concise and avoids unsupported product claims.
- CTA says what happens next (for example, “Explore the collection” or “Discover Blancpain”).
- Attribution names the advertiser and campaign/collection.
