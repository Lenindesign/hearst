# Hearst Prototype App Rules

These rules capture durable product and interface decisions for the Hearst reader prototypes. Apply them across desktop and mobile unless a later decision explicitly replaces them.

## Theme and surfaces

- The default page canvas is `#F4F2EE`; content modules use white surfaces.
- Hearst Fashion & Luxury, including `/hearst-flux/`, its category views, and its brand routes, loads in dark mode by default.
- Exception: the `Videos` tab inside the Hearst+ home destination (`/hearst-plus/`) loads its feed area in dark mode on a black full-bleed canvas by default because it is a video-index experience. Scope this exception to the Videos tab content wrapper only; it must not change the global Hearst+ page theme, masthead, top navigation, or non-video tabs. This tab intentionally shows every configured video source across supported sections and brands by default.
- Video feeds must be scoped contextually: the Hearst+ home `Videos` tab shows all configured video brands, destination pages show only video brands assigned to that destination, and brand pages keep their selected brand context while still showing the sibling video brands available inside that section. Do not let the all-destination video inventory leak into Lifestyle, Autos, Fashion & Luxury, Enthusiast & Wellness, or individual brand routes.
- The `Videos by brand` sidebar module filters only the active video queue in place. Entering the Hearst+ home `Videos` tab clears any article-river brand filter so the default view shows all configured video brands. Brand choices made after entering the Videos tab must not navigate to a brand route or collapse the queue into an empty state. The Hearst+ home `Videos` tab is an index, so it does not suppress items with article-river `Hide` preferences; those preferences still apply to the normal article river.
- Topic labels inside `Your Daily Habit` use the same sidebar-heading color token as the module title, including the light blue treatment on the dark Videos surface.
- On the dark Videos surface, all blue section titles and video-brand eyebrows use the light-blue `--hp-sidebar-heading` token; this treatment stays scoped to the Videos view and must not leak into RSS or reader pages.
- Video feed fallbacks may only count and render stories with playable video media. Do not use article-only local fallback stories as video inventory because that creates misleading source counts and empty video queues.
- The Hearst+ home `Videos` tab sits flush with the footer when it reaches the bottom of the page. Do not introduce a light spacer between the black video exception surface and the footer.
- Every Hearst destination carousel blends current Personalize articles and playable API videos when they match the active destination, topic, brand, or reader signals. Keep the five-slide format with three editorial anchors, one current article, and one playable video when both live formats are available; fill missing formats with the best contextual story. Brand pages remain restricted to their selected brand for live articles, and destination video inventory must remain section-scoped. Deduplicate live stories against the editorial pool. Outside the carousel, alternate live article and video formats when possible and cap live/API insertions below 30% of the blended river.
- Video cards do not show a generic `Watch` chip in their metadata row. Every stacked video card places the source brand icon immediately before the brand and topic metadata; featured and dedicated video-index cards retain their existing duration and play controls.
- Gallery stories retain their gallery behavior and imagery but do not show a generic `Gallery` type chip on river cards.
- Standard article stories do not show a generic `Article` type chip on river cards; retain the editorial signal, source brand, topic, and byline metadata.
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
- Hearst destination masthead logos use a consistent visual height.
- Contextual navigation stays readable and horizontally scrollable on narrow screens rather than wrapping into multiple rows.
