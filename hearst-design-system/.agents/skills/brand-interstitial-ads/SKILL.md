---
name: brand-interstitial-ads
description: Create or update full-screen Hearst Ambient Reader interstitial ads using verified assets and copy from an advertiser's official website. Use when a user asks for a new branded ad, a brand swap, a video-backed campaign, or a consistent split-layout ad treatment.
---

# Brand interstitial ads

Use this skill to produce a polished, reusable full-screen ad in the Hearst Ambient Reader. The ad must preserve the shared editorial template while allowing each advertiser's verified logo, palette, campaign image/video, copy, and destination to express the brand.

## Workflow

1. **Inspect the product first**
   - Read `APP_RULES.md` and locate the current interstitial component, advertiser configuration, and reader state that controls when it appears.
   - Preserve the existing cadence, dismissal behavior, focus handling, and route behavior unless the user explicitly asks to change them.

2. **Source brand material from the official site**
   - Use the official advertiser domain for logo, campaign copy, colors, imagery, video, and destination URL.
   - Prefer assets loaded by the official site itself. Record the source URL beside each constant or in the change summary.
   - Use an official direct video asset only when its URL is stable and playable in a native `<video>` element. Do not invent, proxy, or guess a video URL.
   - If no stable video is available, use a verified official still image as a fallback and state that limitation. Do not silently substitute unrelated footage.
   - Avoid scraping or copying legal language, pricing, or claims that are not clearly intended for the ad.

3. **Apply the shared template**
   - Full viewport overlay with `role="dialog"`, `aria-modal="true"`, and a unique title/description pair.
   - Two-column split at desktop: editorial copy on the left, full-bleed media on the right. Collapse into a readable stacked layout on small screens.
   - Pin the close button to the overall upper-right corner of the ad, not to the left content column. Keep it visible over media with sufficient contrast.
   - Left column order: advertiser logo, `Advertisement · [category]` eyebrow, campaign headline, concise supporting copy, and one primary CTA.
   - Right column order: video when verified, otherwise official still image; gradient/readability treatment; small campaign attribution at the bottom.
   - Keep the composition minimal: no extra “opens in new tab” label, secondary CTA, or decorative card/square around the ad unless explicitly requested.

4. **Implement safely**
   - Keep advertiser-specific values in clearly named constants or a small configuration object.
   - Use `target="_blank"` with `rel="noreferrer"` for external destinations.
   - Use `autoPlay muted loop playsInline preload="metadata"` for background video. Never rely on audio to communicate the campaign.
   - Add meaningful `alt` text for stills and an `aria-label` for decorative-but-informative video.
   - Respect reduced motion: disable or simplify video/motion when `prefers-reduced-motion: reduce` is active.
   - Do not expose secrets, tracking credentials, or private campaign endpoints in source.

5. **Verify before handoff**
   - Run TypeScript, focused ESLint, and `git diff --check`.
   - Check the ad at desktop and narrow mobile widths, including the close button, CTA, logo contrast, image cropping, and text wrapping.
   - Verify Escape closes the ad, focus lands on the close control, and the external CTA opens the intended official destination.
   - If a media URL fails, confirm the still fallback renders without layout shift.
   - Report whether the implementation uses video or an official still fallback. Never claim a video was added if it was not verified.

## Shared template details

See [template-spec.md](references/template-spec.md) for the exact layout, accessibility, media, and QA contract. Use it when implementing a new advertiser or reviewing an existing one.
