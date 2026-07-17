# Hearst Prototype App Rules

These rules capture durable product and interface decisions for the Hearst reader prototypes. Apply them across desktop and mobile unless a later decision explicitly replaces them.

## Theme and surfaces

- The default page canvas is `#F4F2EE`; content modules use white surfaces.
- Hearst Fashion & Luxury, including `/hearst-flux/`, its category views, and its brand routes, loads in dark mode by default.
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

## Featured carousel

- The featured carousel supports touch swiping on mobile with visible drag feedback.
- Vertical page scrolling must continue to work when a gesture begins inside the carousel.
- A tap opens the story; a completed horizontal swipe changes slides and must not accidentally open a story.
- Carousel content must fit the mobile viewport without horizontal page overflow.

## Navigation and branding

- Hearst destination masthead logos use a consistent visual height.
- Contextual navigation stays readable and horizontally scrollable on narrow screens rather than wrapping into multiple rows.
