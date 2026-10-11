# Hearst+ hero slider functionality: design

The Today's Picks **hero slider** becomes a finite set of five **slides** with no wrap: it stops at both ends, and swiping past an end rubber-bands back. The pill and the dot row are replaced by one **position indicator**: segmented progress bars over the top of the image. Each segment fills during the **autoplay pass** and can be tapped to jump to its slide. A small pause toggle sits in the bars, and the bottom bar is removed. On desktop, Previous and Next arrows appear on the image's left and right edges on hover or keyboard focus, and are hidden at the ends. From the keyboard, the slide is one tab stop and Left and Right arrows move between slides. Hover, focus, being off screen and a hidden tab are passive pauses: the fill freezes and resumes in place. Any manual move or the pause toggle ends the pass for the visit. The pass stops on slide 5 with every segment filled. This builds on the content decisions of the earlier hero slider grill, which is still unfinished: five slides, 6.5s per slide, one pass, no slide actions, opened slides marked Read, a return visit starting on the first unread slide, and video playing in the reader. None of this is implemented yet.

## Terms

- **Hero slider**: the Today's Picks carousel at the top of the For You river (`FeaturedStoryCarousel` in `src/components/hearst-plus/featured-story-carousel.tsx`).
  Avoid: banner, hero carousel, lead module.
- **Slide**: one story or video in the hero slider; the whole slide opens the story.
  Avoid: card, panel, item.
- **Position indicator**: the control showing where the reader is among the five slides. Today it is two things: the "Today's Picks · 2 of 5" pill and the dot row below the slide. After this design it is the segmented progress bars.
  Avoid: pagination, dots, counter.
- **Autoplay pass**: the single automatic run through the slides, 6.5s each, decided in the earlier grill.
  Avoid: rotation, loop, cycle.

## Why

The goal was to settle how the hero slider behaves: navigation, controls, looping, gestures and keyboard. The earlier grill had settled what the slider contains and that autoplay runs a single pass. The component still carries behavior built for an endless carousel:
- **Looping:** clone slides on both ends let the track wrap forever.
- **Timer:** a `setInterval` restarts the full 6.5s on every resume.
- **Indicators:** there are two position indicators.
- **Controls:** a small top-right control cluster sits over the image.
- **Bottom bar:** it is built around a Follow button the earlier grill removed.
- **Keyboard:** there is no key handling.
- **Visibility:** autoplay keeps running off screen.

## Locked decisions

No question met all three durable gates (hard to reverse, surprising without context, a real trade-off). Every decision below is a routine choice.

## Routine choices

1. **Past the last slide (Q1: B):** there is no wrap anywhere. The slider stops at both ends, and Previous and Next stop at the edges (under Q8 the edge arrow is hidden rather than disabled).
   - **Why:** five daily picks are a finite edition, and "5 of 5" should feel complete. It also lets the clone-slide machinery go: clones, track-index offsets and transition snapping.
   - **Rejected:** wrap on manual navigation only (A); wrap everywhere, which is today's behavior (C).
   - **Cost:** going from slide 5 back to slide 1 needs the indicator (Q7) or several swipes.
2. **Position indicator and controls (Q2: A):** one indicator, segmented progress bars over the top of the image. The active segment's fill shows the autoplay time remaining, and the edition label ("Today's Picks") sits above the bars.
   - **Arrows:** they show on desktop hover only (placement in Q8).
   - **Pause:** a small pause toggle stays inside the bars, so moving content can be paused (WCAG 2.2.2).
   - **Removed:** the pill, the dot row and the whole bottom bar. Follow had already left the hero in the earlier grill.
   - **Rejected:** keeping the pill and dots and dropping only Follow (B); a pill only, with arrows and Pause always visible (C).
3. **Keyboard (Q3: A):**
   - **Focus:** the slide is one tab stop, and Left and Right arrows move slides while the slider has focus. The arrows must not fire while focus is in a text field elsewhere, and the slide gets a visible focus ring.
   - **Controls:** the progress segments, the pause toggle and the edge arrows stay tabbable.
   - **Screen readers:** the live status region announces manual moves only, never autoplay moves (the APG carousel pattern).
   - **Rejected:** no arrow keys (B); arrows plus Home and End with the indicator as a tablist (C), which adds roving tabindex for little gain on five slides.
4. **When autoplay pauses (Q4: C):** pauses come in two kinds.
   - **Passive pauses** (hover and focus) freeze the fill and resume from where it stopped.
   - **Active control** (any swipe, wheel or drag move, arrow click, arrow key, segment tap or the pause toggle) ends the autoplay pass for this visit.
   - **Timer:** the fill is driven by `requestAnimationFrame` (or a CSS animation with `animation-play-state`) instead of `setInterval`, so it can resume in place.
   - **Rejected:** freeze and resume on every pause (A); freeze, then restart the slide's full 6.5s (B).
   - **Cost:** after one swipe, the reader browses the remaining slides by hand.
5. **End of the pass (Q5: A):** the pass stops on slide 5 with every segment filled, and the reader browses back by hand.
   - **Rejected:** sliding back to the first unread slide (B), a surprise backwards jump; a "You're caught up" overlay (C), which covers the last story's image.
   - **Accepted limit:** a pass that starts mid-set because of the start-on-first-unread rule never auto-shows the earlier slides.
6. **Swiping past an end (Q6: A):** the track rubber-bands. It follows the finger at reduced resistance, then springs back. The same applies to the trackpad wheel handler and pointer drag.
   - **Rejected:** a hard stop (B), which reads as frozen; passing the gesture through to category swipes (C). The track is marked `data-page-category-swipe-exempt`, and handing the gesture off at an edge would switch destinations by accident.
7. **Tapping a segment (Q7: A):** each segment is a button that jumps to its slide (a manual move, so it ends the pass under Q4).
   - **Hit area:** about 24px tall around the thin visible bar, meeting the `STYLE.md` 24px compact mobile target.
   - **Accessible name:** "Show story N: title", with `aria-current` on the active segment.
   - **Rejected:** display-only segments (B).
   - **Cost:** five more tab stops, and the top edge of the image becomes a tap zone that does not open the story.
8. **Desktop arrows (Q8: A):** Previous and Next are 44px, vertically centered on the image's left and right edges.
   - **Visibility:** they are revealed on hover and on keyboard focus, and also shown from `sm` up when the pointer is coarse (touch laptops without hover).
   - **At the ends:** the arrow at the first or last slide is hidden.
   - **Phones:** no arrows; phones swipe.
   - **Rejected:** a top-right pair beside the bars, always visible from `sm` up (B).
9. **Off screen or hidden tab (Q9: A):** a passive pause, like hover. The pass freezes when less than half the slider is visible (IntersectionObserver, threshold 0.5) or the tab is hidden (`visibilitychange`), and resumes in place when the slider returns.
   - **Rejected:** ending the pass when the slider leaves view (B); keeping today's behavior (C).

## Verified facts

Established by reading `src/components/hearst-plus/featured-story-carousel.tsx` (731 lines), not by asking:

- **Timer:** autoplay is a `setInterval` of 6500ms that is torn down and recreated on every pause or resume, so each resume restarts the full interval. It stops while `paused`, `hoverPaused`, `prefersReducedMotion` or `isDragging` is true, or when there is only one story.
- **Looping:** the track renders clone slides at both ends (`data-carousel-clone`, `aria-hidden`, `inert`) and offsets the track index by one to fake an infinite loop.
- **Gestures:** swipe, pointer drag and a captured `wheel` listener share a threshold of `min(52px, 11% of width)`. The wheel handler has a 420 to 720ms cooldown and a 240ms gesture reset. The track carries `data-page-category-swipe-exempt="true"`.
- **Controls:**
  - **Pill:** the top-left pill reads `{editionLabel} · N of 5`.
  - **Top-right cluster:** Previous and Next are 28px and hidden below `sm`; Pause is 44px on phones and 28px from `sm` up.
  - **Bottom bar:** the dot row (`indicatorPalette` optional colors, `aria-current`) and the Follow button.
- **Accessibility:**
  - **Carousel markup:** `aria-roledescription="carousel"` and `aria-describedby` swipe instructions.
  - **Status:** a status region with `aria-live="off"`.
  - **Keys:** no keyboard handler.
- **Visibility:** there is no IntersectionObserver or `visibilitychange` handling.
- **Reduced motion:** reduced-motion users already get no autoplay. Keep that, and also disable the fill animation and the rubber-band spring for them (show static segments, jump without easing).

## Implementation notes

1. **Remove the loop:** remove the clone slides and the track-index offset, and clamp `moveToIndex` to `0..length-1`.
2. **Timer:** replace `setInterval` with a progress timer (an elapsed-ms value driven by `requestAnimationFrame`) that the active segment's fill reads. Add a pass state, `running | frozen | ended`:
   - **Freeze:** hover, focus, off screen and a hidden tab freeze the timer and resume it in place.
   - **End:** manual moves and the pause toggle end the pass.
   - **Last slide:** reaching slide 5 ends it with every segment filled.
3. **Indicator and controls:**
   - **Remove:** the pill, the dot row and the bottom bar.
   - **Add:** the segmented bars with the edition label and the pause toggle, and edge arrows with hover, focus and coarse-pointer visibility, hidden at the ends.
4. **Keyboard:** add a keydown handler on the slider (Left and Right only, ignored when the event target is editable). Set the live region to announce manual moves.
5. **Gestures:** add rubber-band resistance at both ends to the swipe, drag and wheel handlers.
6. **Visibility:** add an IntersectionObserver (0.5) and a `visibilitychange` listener feeding the freeze state.
7. **Docs:** update `APP_RULES.md` (no wrap, pass rules), `STYLE.md` (indicator, arrow and hit-area rules) and the Storybook stories for the carousel (`HearstPlusFeaturedCarousel`). Add a decision-log entry.

## Risks

- **Discoverability of ending the pass:** a reader who swipes once loses the rest of the automatic pass and may not realize more slides are there. The segmented bars must stay visible enough to show it.
- **WCAG 2.2.2:** the pause toggle inside thin bars must keep a 24px hit area and a visible focus state, or the pause requirement is only met on paper.
- **Top-edge tap zone:** segment hit areas over the image top can catch taps meant to open the story. Keep them to the bar strip.
- **Arrow visibility on touch laptops:** the coarse-pointer rule must be checked on real hybrid devices. Hover-only arrows leave touch-laptop users without arrows if the media query misfires.
- **Removing clones changes the transition code:** the snapping logic and gesture unlock fallbacks were written around clones and need retesting for stuck states.

## Deferred

None. Every question was answered.

## Open threads

None. No discussion threads were opened during the session.
