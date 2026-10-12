# Hearst+ Newsstand landing page design

The Newsstand landing page (`/hearst-plus/newsstand/`) becomes a preview-first page. Its job is to get readers into the app, with the free trial as the follow-up. The page keeps its 3D rack hero. It cuts the brand panels from five to three, one per section: Good Housekeeping, Harper's Bazaar and Car and Driver. It ends on a solid white, full-bleed plans section that covers the rack completely. Every Preview action sends the reader to the brand they were looking at, or to the Hearst+ home feed when no brand is in view. Inside the app, a soft, dismissible trial banner appears after the reader has opened about three stories. Where that banner appears is still open.

## Terms

- **Rack**: the scroll-driven 3D magazine rack (three.js) that fills the page behind the content. *Avoid:* newsstand model, 3D scene.
- **Brand panel**: one of the full-screen scroll stops where a featured magazine slides out of the rack beside its pitch. *Avoid:* brand slide, feature section.
- **Plans section**: the closing stop. It holds the Hearst+ logo, the wall of brand logos, the trial offer and the action buttons. *Avoid:* pricing card, join card.

## Why

The page split readers' attention. The hero and plans section pushed Start your free trial. The brand panels pushed Preview in Hearst+. Every cover opened a modal with both, with print underneath. The scroll ran about eight screens before the offer. At the end, the plans card floated over the rack, and the rack poked out under the card and above the footer, so the page ended on a half-hidden prop instead of a clean close.

## Locked decisions

### Q1. The page's one action: Preview the app first, the trial as the follow-up (B)
Readers are asked to look inside Hearst+ before committing; the trial follows once they are in the app.
- Rejected A, *Start the free trial with Preview secondary*: a single trial ask is the most direct business outcome, but asks for commitment before the reader has seen the product.
- Rejected C, *both as equal choices everywhere*: two equal asks is today's problem; readers have no clear next step.

### Q4. Where Preview takes the reader: the brand in context, otherwise the home feed (C)
From a brand panel or a title modal, Preview opens that brand's publication route (`getHearstBrandRoute`). From the hero and the plans section, where no brand is in view, it opens the Hearst+ home feed (`/hearst-plus/`).
- Rejected A, *a guided interest pick on the landing page before the feed*: a tuned feed is persuasive but adds a screen between interest and content.
- Rejected B, *always the home feed*: fastest, but drops the brand the reader just showed interest in.

### Q9. How the trial follows up in the app: a soft banner after a few stories (A)
After the reader opens about three stories while previewing, a dismissible trial banner asks them to start the trial. The existing Try Hearst+ free link in the utility bar stays.
- Rejected B, *a metered wall that stops reading after N stories*: converts harder but turns "preview" into a bait-and-switch, and needs entitlement logic the prototype doesn't have.
- Rejected C, *only the utility-bar link*: easy to ignore; nothing responds to engagement.
- Still to tune: the exact story count, and how long a dismissal lasts.

## Routine choices

- **Q2. Scroll length:** three brand panels instead of five, chosen to show range, then the plans section. This cuts the scroll before the offer by about a third. The title modal's slider still lets readers browse every magazine.
- **Q3. Ending:** the plans section is full-bleed on a solid surface that covers the rack completely, followed by the footer. No part of the rack shows in the final frame.
- **Q5. Panel brands:** one per section:
  - Good Housekeeping (Lifestyle);
  - Harper's Bazaar (Fashion & Luxury);
  - Car and Driver (Autos).

  This drops Esquire and Cosmopolitan as panels; both stay on the rack and in the title slider. Enthusiast & Wellness has no panel.
- **Q6. Plans section content, in order:**
  1. The logo wall.
  2. **Preview the app** as the solid, primary button, going to the home feed.
  3. **Start free trial** beside it, as the outlined, secondary button.
  4. The price in small text under the trial.
  5. The quiet print link.
- **Q7. Hero buttons:** the primary button is **Preview Hearst+**, going to the home feed. **Start your 7-day free trial** becomes a secondary text link. This replaces today's trial-only hero button.
- **Q8. Title modal:** the buttons swap. A solid **Preview in Hearst+** (the title's brand route) comes first, and an outlined **Start free trial** comes second.
- **Q10. Plans surface:** white, so the logo wall keeps each brand's primary color and the price and buttons stay high-contrast.

## Verified facts

- **Current structure:** the page is the hero, then five brand panels, then the plans section (`#join`), all in `src/components/hearst-plus/newsstand/newsstand-experience.tsx`.
  - Each brand panel is a `data-stop` section `h-[120vh]` tall, so the scroll before the offer is about eight screens.
  - The five panels are Esquire, Cosmopolitan, Harper's Bazaar, Good Housekeeping and Car and Driver (`FEATURED_SLUGS` in `newsstand-catalog.ts`).
  - The right-edge dot navigation lists the featured brands and must follow the panel count.
- **Plans section today:** it is a card floating over the fixed rack canvas, so the rack shows below it before the footer.
- **Offer:** one `OFFER` object in `newsstand-experience.tsx` drives the price and trial line. While `OFFER.placeholder` is true, the page shows a "Prototype pricing" note. Trial buttons show an in-page confirmation; no account or payment is created.
- **Title modal:** in `newsstand-title-modal.tsx`, it slides through every title with arrows, arrow keys and swipes. Its Preview link uses `appRoute(slug)`, which wraps `getHearstBrandRoute` and is omitted when a title has no route (Biography).
- **Existing rules that change:** `APP_RULES.md` already treats the app as the product and print as secondary. These decisions change its current rule that "title modals offer `Start free trial` and `Preview in Hearst+`" (order flips) and the plans-section description (Preview becomes primary).

## Risks

- **Fewer trial starts on the page:** making Preview primary may lower trial starts from the page itself. The in-app banner (Q9) has to carry that conversion; measure both.
- **Rack choreography:** the rack scene (`rack-scene.js`) has five panel stops; cutting to three means changing its stops and the per-panel slide-out targets.
- **Dropped panels:** Esquire and Cosmopolitan lose their panels. Cosmopolitan has the most recognisable cover, so check that the hero rack still shows it prominently.
- **Banner across visits:** the trial banner needs per-reader state (stories opened, dismissed). Browser storage is enough for the prototype but won't follow a reader across devices.

## Deferred

None.

## Open threads

- **Q11. Where the trial banner appears in the app** (unanswered at finish). Options were:
  - A: at the end of the third story, in the reader (recommended);
  - B: a slim bar pinned to the bottom of the screen until dismissed;
  - C: a card inserted near the top of the feed.

  The recommendation was A, because the end of a story is the natural pause after the reader has got value. B nags and covers content on phones, and C is easy to scroll past. Decide this before building Q9.
