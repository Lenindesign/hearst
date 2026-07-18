# Hearst Prototype App Rules

These rules capture durable product and interface decisions for the Hearst reader prototypes. Apply them across desktop and mobile unless a later decision explicitly replaces them.

## Theme and surfaces

- The default page canvas is `#F4F2EE`; content modules use white surfaces.
- AutoWeek uses dark neutral `#242424` for editorial and module-title text on light surfaces. Keep AutoWeek yellow `#FFC84E` for utility backgrounds, active navigation underlines, numbered badges, carousel indicators, and other brand accents; do not use the yellow as foreground title text on white.
- Hearst Fashion & Luxury, including `/hearst-flux/`, its category views, and its brand routes, loads in dark mode by default.
- Exception: the `Videos` tab inside the Hearst+ home destination (`/hearst-plus/`) loads its feed area and complete navigation header in dark mode by default because it is a video-index experience. The utility bar, masthead, category navigation, compact sticky navigation, controls, active states, and Hearst+ logo all use the scoped dark treatment. This exception must not change non-video tabs, other destinations, RSS/story pages, or readers. This tab intentionally shows every configured video source across supported sections and brands by default.
- Video feeds must be scoped contextually: the Hearst+ home `Videos` tab shows all configured video brands, destination pages show only video brands assigned to that destination, and brand pages keep their selected brand context while still showing the sibling video brands available inside that section. Do not let the all-destination video inventory leak into Lifestyle, Autos, Fashion & Luxury, Enthusiast & Wellness, or individual brand routes.
- The `Videos by brand` sidebar module filters only the active video queue in place. Entering the Hearst+ home `Videos` tab clears any article-river brand filter so the default view shows all configured video brands. Brand choices made after entering the Videos tab must not navigate to a brand route or collapse the queue into an empty state. The Hearst+ home `Videos` tab is an index, so it does not suppress items with article-river `Hide` preferences; those preferences still apply to the normal article river.
- Topic labels inside `Your Daily Habit` use the same sidebar-heading color token as the module title, including the light blue treatment on the dark Videos surface.
- On the dark Videos surface, all blue section titles and video-brand eyebrows use the light-blue `--hp-sidebar-heading` token; this treatment stays scoped to the Videos view and must not leak into RSS or reader pages.
- Video feed fallbacks may only count and render stories with playable video media. Do not use article-only local fallback stories as video inventory because that creates misleading source counts and empty video queues.
- The Hearst+ home `Videos` tab sits flush with the footer when it reaches the bottom of the page. Do not introduce a light spacer between the black video exception surface and the footer.
- Every Hearst destination carousel blends current Personalize articles and playable API videos when they match the active destination, topic, brand, or reader signals. Before applying its format and brand-diversity safeguards, the carousel must rescore every eligible slide with the same personalization model as the river: followed topics and brands, saved and hidden stories, More Like This behavior, time of day, return visits, popularity, freshness, and diversity. Keep the five-slide format with three editorial anchors, one current article, and one playable video when both live formats are available; fill missing formats with the best contextual story. Brand pages remain restricted to their selected brand for live articles, and destination video inventory must remain section-scoped. Deduplicate live stories against the editorial pool. Outside the carousel, alternate live article and video formats when possible and cap live/API insertions below 30% of the blended river.
- The stakeholder demo console uses white content panels and includes a plain-language personalization rules section. Keep its explanation synchronized with the implemented eligibility, scoring, return-visit, behavior, slideshow, diversity, and exclusion logic so it can serve as a reliable stakeholder talk track.
- On refresh, do not render the default static river while the saved reader account and personalization profile are hydrating. Keep the masthead and navigation stable, show a neutral layout-preserving feed skeleton, and mount the river only after hydration so readers see one personalized content state instead of a static-to-dynamic story swap.
- Video cards do not show a generic `Watch` chip in their metadata row. Every stacked video card places the source brand icon immediately before the brand and topic metadata; featured and dedicated video-index cards retain their existing duration and play controls.
- Gallery stories retain their gallery behavior and imagery but do not show a generic `Gallery` type chip on river cards.
- Standard article stories do not show a generic `Article` type chip on river cards; retain the editorial signal, source brand, topic, and byline metadata.
- Every river-card summary displays a maximum of three lines with an ellipsis, including standard, specs, gallery, shopping, recipe, brand-spotlight, related-story, and live/API cards. Variants that already use a shorter limit may keep it. Preserve the full source summary in the story reader.
- Exclude the MotorTrend video `Qualcomm's Dynamic Electric Vehicle Charging: An Innovation Story` from every app surface, including destination carousels, rivers, video indexes, sidebars, and readers.
- Exclude the Men's Health story `I Didn’t Let Chronic Pain Stop Me From Losing 115 Pounds. Here’s How I Did It.` from every app surface, including destination carousels, rivers, rankings, sidebars, and readers.
- The standalone `/hearst-plus/live-feed/` and `/hearst-plus/motortrend-videos/` routes remain source-focused QA views. They must not become the primary navigation model for Hearst+.
- The reader modal theme follows the active article section rather than the page underneath it: Fashion & Luxury uses dark mode, while Lifestyle, Autos, and Enthusiast & Wellness use light mode.
- Switching sections inside an open reader immediately updates the complete modal theme, including its shell, rails, masthead, article surface, logo, and controls.
- The Fashion & Luxury logo is white when it appears in the dark reader masthead.
- Fashion & Luxury article surfaces use a dark editorial surface with light, readable text so the reading column remains part of the section's dark-mode experience.
- Article surfaces for Lifestyle, Autos, and Enthusiast & Wellness remain white with dark, readable text.
- An explicit reader theme toggle may override the section default for the current experience.

## Reader modal

- The modal masthead shows the contextual Hearst section logo for the article being read.
- The category row below the masthead uses the categories for that contextual section.
- The other Hearst section controls in the masthead switch the article collection, logo, and category row inside the open modal. They do not navigate away from the current page or close the modal.
- Reader articles lazy-load as one continuous queue, while the masthead remains sticky.
- Article headlines should preserve the source copy but use responsive sizing that avoids awkward, overly heavy wrapping.
- The reader action bar sits directly below the article headline and before the introduction or article body across article, video, loading, and fallback states.
- Story reader URLs use `/read/{storyId}/`. When a story is opened from an in-app page, links must append a safe same-origin `from` path and closing the reader returns to that captured entry page. Direct/shared `/read/{storyId}/` URLs without a safe `from` fall back to the story’s source brand route. Never allow external or nested `/read/` return targets.

## Featured carousel

- Featured carousel headlines display a maximum of three lines at every breakpoint. Truncate longer source headlines with an ellipsis in the carousel only; preserve the full source headline in story cards and the reader.
- Featured carousel summaries display a maximum of two lines at every breakpoint. Truncate longer summaries with an ellipsis in the carousel only; preserve the full summary in story cards and the reader.
- Headlines in the `Today's edit` strip display a maximum of three lines at every breakpoint, with an ellipsis when truncated. Preserve the full source headline in the destination story and reader.
- The featured carousel supports touch swiping on mobile with visible drag feedback.
- Vertical page scrolling must continue to work when a gesture begins inside the carousel.
- A tap opens the story; a completed horizontal swipe changes slides and must not accidentally open a story.
- Carousel content must fit the mobile viewport without horizontal page overflow.

## Navigation and branding

- Every destination category tab except the external Games experience has a shareable, trailing-slash URL under its destination route, such as `/hearst-plus/home/`, `/hearst-lifestyle/food/`, `/hearst-autos/reviews/`, `/hearst-flux/style/`, and `/hearst-ew/fitness/`. Category routes preserve the parent destination theme, scoped article/video inventory, active navigation state, and filtered river behavior.
- Normalize Hearst destination mastheads by the visible `HEARST` path bounds, not by each SVG artboard or overall logo width: `22px` on mobile and `34px` on desktop, with `16px` mobile and `23px` desktop in the compact sticky state. Apply per-artwork geometry because Lifestyle and Fashion & Luxury use 42-unit artboards for their italic descriptors, while the newer Hearst+ and older Autos/E&W letterforms have slightly different cap bounds inside their 36-unit artboards. The visible top and bottom of `HEARST` must align across every destination; descriptors and the plus sign may extend independently. Wide desktop marks must receive enough horizontal space to preserve this cap height and their aspect ratio instead of being compressed by a generic width cap. On narrow screens, Fashion & Luxury and Enthusiast & Wellness use their existing compact destination signatures so the same HEARST cap height fits between the masthead controls without distortion or overflow. Selected-brand mastheads retain the shared visual-height target appropriate to their own artwork.
- Contextual navigation stays readable and horizontally scrollable on narrow screens rather than wrapping into multiple rows.
