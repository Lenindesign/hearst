import type React from "react";

import { SpanTable, SpecCallout, SpecNote, SpecTag, span } from "@/components/specs/chapters/blocks-nav-kit";
import { PATTERN_MEASUREMENTS } from "@/components/specs/chapters/blocks-pattern-data";
import { SpecChapter, SpecColumns, SpecFilm, SpecFinding, SpecProse, SpecSection, SpecSheet, SpecSubhead, SpecTable } from "@/components/specs/spec-kit";

const link = "underline underline-offset-4";

/* ---------- Foundations ---------- */

const surfaceRows = [
  [<code key="t">--hp-surface</code>, "#FFFFFF", "Card and widget surface"],
  [<code key="t">--hp-background</code>, "#ECE9E3", "Page canvas"],
  [<code key="t">--hp-shadow-card</code>, "0 2px 6px rgb(15 23 42 / .05)", <>Every Hearst+ card and widget. Any element with this class gets <code>border-width: 0 !important</code> (globals.css), so the shadow and surface separate the card from the page.</>],
  [<><code>--hp-radius-card</code> → <code>--radius</code></>, "8px", <>Card corners (production cards use the literal <code>rounded-[8px]</code>)</>],
  [<code key="t">--border</code>, "#C7D9EA", "Inner dividers, thumbnail rims"],
  [<code key="t">--muted</code>, "#EDF4FB", "Image placeholder fill"],
] as const;

const typeColorRows = [
  [<code key="t">--font-headline</code>, "Schibsted Grotesk 800", <>Card headlines (<code>.headline</code>)</>],
  [<code key="t">--hp-font-ui</code>, "Inter", "Meta, summaries, UI"],
  [<code key="t">--text-token-4xs</code>, "0.688rem = 11.008px", "Source/byline line, widget titles"],
  [<code key="t">--primary</code>, "#2B6FAF", "Kickers, links, focus ring base, selected states"],
  [<code key="t">--muted-foreground</code>, "#5B6676", "Meta and summary text"],
  [<code key="t">--foreground</code>, "#121212", "Headlines"],
  [<code key="t">--ring</code>, "#BDDDFC", <>Focus ring token (cards use <code>ring-primary/60</code>)</>],
] as const;

const spacingRows = [
  [<>Spacing unit <code>--spacing</code></>, "0.25rem = 4px", <>Tailwind utilities resolve as n × 4: <code>gap-2</code> 8, <code>gap-3</code> 12, <code>p-4</code> 16, <code>p-5</code> 20.</>],
  ["Viewport breakpoints", "sm 640 · md 768 · lg 1024 · xl 1280", "Card padding steps at sm, headline type at md (UI-TYPE-001). 2xl is retired. Pattern columns don't use viewport breakpoints (see container queries)."],
  ["Container queries", "20rem · 32rem · hp-block 536 / 812 / 1088 · 820 / 1100", <><code>story-meta</code> &lt; 20rem hides the byline. <code>compact-photo-gallery</code> ≥ 32rem shows 3 rows. In blocks (<code>@container/hp-block</code>), card rows and grids set their columns at 536, 812 and 1088px of block width. The Feature + Sidebar and Three-Column layouts switch at 820 and 1100.</>],
  ["Touch minimum", <>44px (<code>min-h-11</code>)</>, "The meta link and the save button grow to 44 below sm."],
  ["Motion", "250ms ease-out", <>Card media scales on hover; this is turned off under <code>prefers-reduced-motion</code>.</>],
] as const;

/* ---------- Story card ---------- */

const storyFilmChapters = [
  [0, "The card and its four slots"],
  [8, "Anatomy and hit area"],
  [20, "Vertical rhythm and height formula"],
  [34, "Headline and summary lines"],
  [46, "Meta row and save button"],
  [60, "Breakpoints: base, sm, md"],
  [74, "Layers and click targets"],
  [86, "Shadow envelope and radius"],
  [96, "States"],
  [106, "In a row: columns and heights"],
  [116, "The drawing sheet"],
] as const;

const measuredRows = [
  ["Content padding", "16 (p-4)", "20 (p-5)", "20 (p-5)"],
  ["Meta row height", "16 · 44 with save", "16 · 32 with save", "16 · 32 with save"],
  ["Meta → headline / headline → summary", "8 / 8", "8 / 8", "8 / 8"],
  ["Headline size / line", "20 / 24", "20 / 24", "24 / 28"],
  ["Summary size / line", "16 / 24", "16 / 24", "16 / 24"],
  ["Sample card (W × H)", "326 × 371.4", "—", "672 × 502"],
] as const;

const stateRows = [
  ["Rest", "Shadow only, no border."],
  ["Hover", <>Headline underlines (offset 4) and media scales to 1.025 over 250ms ease-out. The code also sets <code>hover:border-primary/50</code>, but it has no effect because the border is forced to 0.</>],
  ["Focus-visible", <>The hit-area button shows a 2px inset ring, <code>ring-primary/60</code>, rounded 8. The headline also underlines (<code>group-focus-within</code>).</>],
  ["Saved", <>The bookmark icon fills and turns <code>text-primary</code>, with <code>aria-pressed=true</code>. The button only renders when <code>onSave</code> is passed; the library sample doesn&rsquo;t pass it.</>],
  ["Reduced motion", "No media scale."],
  ["Loading / no image", <>The image slot falls back to <code>bg-muted</code>. The skeleton for a whole card is out of scope here; see <code>feed-states.tsx</code>.</>],
] as const;

/* ---------- Patterns ---------- */

const patternColumnRows = [
  ["< 536", "1", "1", "stacked", "stacked"],
  ["536–811", "2", "2", "stacked", "stacked"],
  ["812–819", "3 (4th card hidden)", "2", "stacked", "stacked"],
  ["820–1087", "3 (4th card hidden)", "2", "1.8fr | 1fr, list stretches", "rail + ad | feature"],
  ["1088–1099", "4", "4", "1.8fr | 1fr", "rail + ad | feature"],
  ["≥ 1100", "4", "4", "1.8fr | 1fr", "rail | feature | ad"],
] as const;

const blocksFilmChapters = [
  [0, "A block = pattern + cards"],
  [9, "01 · Featured + Row"],
  [20, "02 · Card Row"],
  [31, "03 · Feature + Sidebar"],
  [42, "04 · River with Hero"],
  [53, "05 · Three-Column Feature Row"],
  [64, "06 · Featured Video + Four"],
  [75, "07 · Grid"],
  [86, "08 · River"],
  [97, "The breakpoint rules"],
] as const;

/** Redraws the measured card rectangles of one pattern at 0.14:1, one figure per inner width. */
function PatternFigures({ pattern }: { pattern: string }) {
  const S = 0.14;
  const rows = PATTERN_MEASUREMENTS[pattern] ?? [];
  return (
    <div className="flex flex-wrap items-end gap-4 rounded-card bg-muted p-4">
      {rows.map((m) => {
        const w = m.w;
        const h = Math.max(...m.items.map((i) => i[1] + i[3]));
        const svgW = Math.ceil(w * S) + 2;
        const svgH = Math.ceil(h * S) + 2;
        return (
          <figure key={`${m.vw}-${w}`} className="m-0">
            <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} role="img" aria-label={`${pattern} at inner width ${w}px: ${m.items.length} items`}>
              <rect x={0.5} y={0.5} width={w * S + 1} height={h * S + 1} className="fill-none stroke-border" strokeDasharray="3 3" />
              {m.items.map(([x, y, iw, ih], index) => (
                <rect key={index} x={1 + x * S} y={1 + y * S} width={Math.max(1, iw * S)} height={Math.max(1, ih * S)} rx={1} className="fill-card stroke-muted-foreground" strokeWidth={1} />
              ))}
            </svg>
            <figcaption className="mt-1.5 text-[11px] font-medium leading-[1.35] tabular-nums text-muted-foreground">
              inner {w} · vw {m.vw}
              <br />
              {m.items.length} items
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}

function Subhead5({ children }: { children: React.ReactNode }) {
  return <h5 className="type-k1 text-muted-foreground">{children}</h5>;
}

/** One layout pattern (the HTML's `article.block`). */
function PatternBlock({
  id,
  label,
  title,
  summary,
  anatomy,
  responsive,
  pattern,
  states,
}: {
  id: string;
  label: React.ReactNode;
  title: string;
  summary: React.ReactNode;
  anatomy: React.ReactNode;
  responsive: React.ReactNode;
  pattern: string;
  states?: React.ReactNode;
}) {
  return (
    <article id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 space-y-5 rounded-card bg-card p-5 shadow-[var(--hp-shadow-card)] sm:p-6">
      <div className="max-w-3xl">
        <p className="type-k1 text-muted-foreground">{label}</p>
        <h4 id={`${id}-title`} className="headline mt-2 text-xl leading-tight">{title}</h4>
        <p className="mt-2 leading-7 text-muted-foreground">{summary}</p>
      </div>
      <SpecColumns>
        <div>
          <Subhead5>Anatomy</Subhead5>
          <ul>{anatomy}</ul>
        </div>
        <div>
          <Subhead5>Responsive rule</Subhead5>
          <ul>{responsive}</ul>
        </div>
      </SpecColumns>
      <PatternFigures pattern={pattern} />
      {states ? (
        <div className="space-y-2">
          <Subhead5>States</Subhead5>
          <SpecNote>{states}</SpecNote>
        </div>
      ) : null}
    </article>
  );
}

/* ---------- Variants, card types, widgets ---------- */

const variantRows = [
  ["standard", <code key="p">layoutOverride=&quot;cards&quot;</code>, "16:9, clipped by R1", <code key="b">p-4 · sm:p-5</code>, "type-t3 20/24 · md 24/28, ≤ 3 lines", "type-d2 16/24, ≤ 2 lines", "01 lead + row, 03 lead, 04 lead, 05, 07"],
  ["compact", <code key="p">compact</code>, "4:3, video stories included (play button and duration kept)", <code key="b">p-3</code>, "text-lg, tight, ≤ 3 lines", "none", "02"],
  ["list", <><code>layoutOverride=&quot;list&quot;</code> + <code>editorialRow</code></>, <>4:3, 28% wide, <code>rounded-card-inner</code></>, <><code>p-4 · sm:p-5</code>, gap 16</>, "lg · sm:xl, ≤ 3 lines", "sm / 24, ≤ 3 lines", "03 stack, 04, 08"],
  ["featured", <code key="p">featured</code>, "16:9", <code key="b">p-5 · sm:p-6 · lg:p-8</code>, "as standard", "base / 28", "06"],
  ["video", <>story with <code>videoUrl</code></>, "16:9 poster, 56px play, duration pill", span(4, "Same body as the variant it's used in. The media layer sits above the hit area (z-20), so play has its own click.")],
] as const;

const cardTypeRows = [
  ["01", <><b>Article</b><br /><code>LifestyleRiverCard</code></>, "See Story card above.", "r 8 · padding 20 / 16 · 16:9", "326 × 371.4 → 672 × 502", "hover, focus, saved, reduced motion"],
  ["02", <><b>Video</b><br /><code>LifestyleRiverCard</code> · kind video</>, <>Poster at 16:9 on black with a 15% scrim, a 56px play button (<code>bg-black/70</code>, 24px icon), and a duration pill at top-right (12px bold, tabular figures). Body as on Article.</>, "Media layer at z-20, above the hit area, so play has its own click.", "326 × 397 → 672 × 552.5", <>poster → playing (<code>AdaptiveVideo</code> with controls and autoplay); poster-only fallback with no <code>videoUrl</code></>],
  ["03", <><b>Community</b><br /><code>CommunityHomeRiverCard</code></>, <>Optional 16:9 poster. Host row: 20px round icon, xs bold. Title <code>xl · sm:2xl</code>, ≤ 3 lines. Body sm / 24, ≤ 3 lines. Footer row: reply count and a &ldquo;Join the conversation&rdquo; link.</>, <>Padding <code>p-4 · sm:p-5</code>. Footer has <code>border-t</code>, <code>px-4 py-3</code>, controls ≥ 36 (<code>min-h-9</code>).</>, "326 × 459 → 672 × 596. List layout: 112 | 1fr (168 at sm), 4:3 r 6.", <>Hover turns the title <code>text-primary</code> and scales media 1.02. Focus ring is <code>primary/35</code>.</>],
  ["04", <><b>Event</b><br /><code>EventTile</code> (HDS <code>ArticleCard</code> lg)</>, <>Image, title <code>2xl · sm:3xl</code>, summary ≤ 4 lines, brand marks, a &ldquo;Plan your visit&rdquo; / &ldquo;Explore the coverage&rdquo; footer.</>, <><code>rounded-card</code> (8) and <code>--hp-shadow-card</code>, with no ring at rest (was r 11.2 with a ring outline before F8).</>, "326 × 616 → 672 × 706", "upcoming vs past copy; image scales 1.015 over 300ms on hover"],
  ["05", <><b>Make, Model &amp; Year</b><br /><code>LifestyleRiverCard</code> + rating</>, "Article card plus a Car and Driver rating badge at the end of the headline row (see Detail C on the sheet).", <>gap 12, <code>items-end</code>; the badge sizes to its content</>, "326 × 397 → 672 × 558.5", "The badge shows only when a verified rating exists."],
  ["06", <><b>Photo Gallery</b><br /><code>CompactPhotoGalleryCard</code></>, <>A 16:9 image grid (2fr | 1fr, 2px gaps on <code>--border</code>), then a <code>p-4</code> body with the same meta row and headline.</>, "The body doesn't step to 20 at sm, unlike Article.", "Container < 32rem: 2 rows. ≥ 32rem: 3 rows, adding a fourth image. 326 × 406 → 672 × 532.5.", "Until the gallery preview is ready, it renders as an Article card."],
  ["07", <><b>Shorts</b><br /><code>VerticalVideoCarousel</code></>, <>A titled carousel of 9:16 vertical cards, each with a 32px play button at bottom-left (<code>white/90</code>) and a duration chip at bottom-right.</>, <>Card width 164 (180 at sm), gap 12. The 9:16 media frame carries <code>rounded-card</code> and <code>--hp-shadow-card</code>.</>, "Horizontal scroll with mandatory snap and a hidden scrollbar. 2 cards visible at 390, 4 or more at desktop.", "Without short-form stories, it falls back to a single 9:16 card (r 8, max 320)."],
  ["08", <><b>Advertisement</b><br /><code>ContextualRiverAdvertisement</code></>, <>16:9 creative with an overlaid disclosure row (<code>p-4</code>), body <code>p-4 · sm:p-5</code>, CTA button.</>, <>r 8 · <code>--hp-shadow-card</code> · CTA <code>min-h-11</code>, r 4, <code>px-4 py-2</code>, sm semibold.</>, "672 × 516.5 at desktop", <>Hover drops CTA opacity to 80%; focus ring <code>primary/40</code>.</>],
  ["09", <><b>Brand Spotlight</b><br /><code>BrandPromotionRiverModule</code></>, <>Header with wordmark, &ldquo;Brand spotlight&rdquo; kicker and summary (<code>p-5 · sm:p-6</code>, <code>border-b</code>). Body: a 4:3 lead (r 8) plus a list of three rows (square thumb r 8, 88px / 112px at sm, rows <code>py-4</code> with dividers).</>, <><code>section</code>, r 8, <code>--hp-shadow-card</code>. The A&amp;E family uses a dark override (#0D1014).</>, "Body becomes 2 columns (0.95fr | 1fr, gap 20) at viewport ≥ 1201. Below that it stacks. Rows go single-column when the container is under 120px.", "Returns nothing when there's no matching promotion or lead story."],
  ["10", <><b>Award announcement</b><br /><code>StoryAwardCard</code> · <code>StoryAwardRibbon</code></>, <>Full-width river card in the awarding publication&rsquo;s card colors. Photo 3:2 with an optional 112px seal (left 16 · top 16, 20 at sm), then a panel <code>p-5 · sm:p-6 · lg:p-8</code>: K1 award eyebrow with a trophy icon, T2 headline (≤ 4 lines), D2 deck (≤ 3), M1 byline and read time, a &ldquo;Read why it won&rdquo; label and an &ldquo;Also:&rdquo; related-story link. The ribbon is a 28px K1 pill (trophy, year, award name) at top-left of the winner&rsquo;s other card photos.</>, <>r 8 · <code>--hp-shadow-card</code>. Colors from <code>getFeaturedCardColors</code> (MotorTrend: red darkened to 5.5:1 with white). Data: <code>src/lib/story-awards.ts</code>.</>, "Photo stacks above the panel below a 720px card width; at 720 and up the photo (1.1fr, min 400px tall) sits beside the panel (1fr).", "Whole card opens the winner; the related link (44px) opens its own story; hover zooms the photo 2.5% and underlines the headline; no seal when the photo already shows the award mark; gone after the award's end date."],
] as const;

const widgetRows = [
  ["01", <><b>Trending Stories</b><br /><code>TrendingStoryRail</code></>, "Title row, then ranked rows: 48px thumbnail (r 6, bordered) with a 20px rank badge (round, ring 1) and a 12px bold title (line 1.35, ≤ 3 lines) with meta.", <>Row min height 80 (<code>min-h-20</code>), <code>py-3</code>, gap 12. 5 rows = 453 tall at 360.</>, "Fills the sidebar column width.", "Title underlines on hover or focus. Renders nothing with no stories."],
  ["02", <><b>Saved Items</b><br /><code>SavedItemsModule</code></>, "With saves: the Trending rail layout with a bookmark in the title, up to 3 rows. Empty: the message, an optional Browse For You button, then “Suggested for you” rows (48px thumbnail r 6, 12px bold title clamped to 2 lines, brand line, and a bookmark save button that's 44 below sm and 32 above).", "3 rows = 291 tall with saves", "Collapses below lg like the other discovery widgets; the collapsed header reads the empty message.", "with saves / empty; Browse For You hidden on an unfiltered For You view"],
  ["03", <><b>Explore Communities</b><br /><code>CommunityJoinedGroupsCard</code></>, "Title row, then group rows: 20px brand icon (r 4), 12px bold name (≤ 4 lines), member context and a join action.", <>Rows <code>min-h-11</code>, <code>py-2</code>, gap 12, with dividers. 326 tall at 360.</>, "Fills the column width.", <>joined vs not joined (read from localStorage); an empty message on <code>bg-muted/50</code>, <code>px-3 py-3</code>.</>],
  ["04", <><b>Event Discovery</b><br /><code>DiscoverySidebarCard</code></>, "Title, then event rows: 48px thumbnail (r 5) with an xs bold title (≤ 2 lines) and an 11px date.", <>Rows <code>min-h-16</code> (64), <code>py-3</code>, gap 12, with dividers. 294 tall at lg.</>, <><b>Below lg (1024): collapses</b> to a 44px disclosure row (title, 2-line summary, 44px expand toggle). Measured 76 to 85 collapsed.</>, <>collapsed / expanded (<code>aria-expanded</code>)</>],
  ["05", <><b>Local News</b><br /><code>DiscoverySidebarCard</code></>, <>Market header (10px caps title plus the market name), a <code>StoryRow</code> (48px thumbnail), and a &ldquo;View all local news&rdquo; link (<code>border-t pt-3</code>).</>, "195 tall at lg", "Collapses below lg, same as Event Discovery.", "collapsed / expanded"],
  ["06", <><b>Advertisement</b><br /><code>AdSample</code></>, <>16:9 creative with a 9px caps &ldquo;Advertisement&rdquo; label, then a <code>p-3</code> body (9px caps kicker, base headline, xs copy).</>, <><code>article</code>, r 7, 292 tall at 360</>, "Fills the column width.", "Static demo creative"],
] as const;

/* ---------- Findings ---------- */

const rowRuleRows = [
  ["< 536", "1", "358 → 1"],
  ["≥ 536 = 2·260 + 16", "2", "720 → 2 × 352"],
  ["≥ 812 = 3·260 + 32", "3", "976 → 3 × 314.7"],
  ["≥ 1088 = 4·260 + 48", "4", "1184 → 4 × 284 · 1264 → 4 × 304"],
] as const;

const findingRows = [
  ["F1", <>Pattern previews use <code>StorySample</code>, not the production card.</>, "The library renders the production section components (S1).", "AGENTS.md: compose HDS components, no parallel system", "Done · 2026-11-06"],
  ["F2", <>Radius is hard-coded (7 / 8 / 11.2); <code>--hp-radius-card</code> isn&rsquo;t used.</>, <><code>rounded-card</code> utility, plus <code>--hp-radius-inner</code> and a codemod (S1).</>, "Token governance (Constitution Art. V)", "Done · 2026-11-06"],
  ["F3", "Cards in a row don't match heights.", "Stretch to the row height, top-aligned. Production already does this.", <>Production <code>cardGrid</code>, <code>stretchToFeature</code></>, "Done · 2026-11-06"],
  ["F4", "4-up appears only on very wide screens.", "Not a production bug; fixed for the library by the row rule.", "Measured production widths", "Done · 2026-11-06"],
  ["F5", "Patterns key off the viewport.", "Container queries at 540 / 820 / 1100 (S1); rows and grids moved to 536 / 812 / 1088 with the 16 layout gap.", <>Container queries (<code>hp-block</code>)</>, "Done · 2026-11-06"],
  ["F6", "The story card's hover border never shows.", <>Delete <code>hover:border-primary/50</code> and <code>border border-border</code> from the card. Hover stays as the headline underline plus a 1.025 media scale.</>, "STYLE.md: modules have no outline stroke, including on hover", "Done · 2026-11-06"],
  ["F7", "Saved Stories disappears when empty.", <>New shared <code>SavedItemsModule</code> (<code>saved-items-module.tsx</code>) replaces three separate copies: the blocks home sidebar, <code>LifestyleDiscoverySidebar</code> and the reader context rail. Empty, it shows &ldquo;Save stories to build your reading list.&rdquo;, a <b>Browse For You</b> action (hidden when the reader is already on an unfiltered For You), and three ranked, unsaved, non-hidden suggestions, each with its own open and save actions. Saving one swaps in the real list. The library widget has a With saves / Empty switch.</>, "APP_RULES: Saved empty state; Saved Items uses the homepage empty state", "Done · 2026-11-06"],
  ["F8", <>Event card: r 11.2 with a <code>ring-1</code> outline.</>, <>Event: <code>EventTile</code> now uses the Hearst+ surface (<code>rounded-card</code>, <code>--hp-shadow-card</code>, <code>ring-0</code> at rest, focus ring kept). Shorts: no change needed. The first measurement read the outer wrapper; the 9:16 media inside already has the card radius and shadow.</>, "STYLE.md: no outline stroke on modules; focus through rings", "Done · 2026-11-06"],
  [<>F11 <SpecTag>new</SpecTag></>, "Save icon: the old rule required a heart, which reads as “like” for a save-for-later action.", <>Decided 2026-11-06: save uses the <b>bookmark</b> (outline / fill) on the card save button, story action row, reader action bar, Shorts and image viewers, and Saved Items headings and suggestions. The heart is kept for likes and favorites. Library navigation moves to the <b>books</b> icon. <code>APP_RULES.md</code> and <code>DECISION_LOG.md</code> are updated.</>, "APP_RULES save icon rule (changed); Constitution Art. IV bookmark action", "Done · 2026-11-06"],
  [<>F12 <SpecTag>new</SpecTag></>, <>Some headlines change color on hover: the Community card (<code>text-primary</code>) and the production Card Row (<code>--hp-sidebar-heading</code>).</>, "Keep the headline color and underline on hover or focus, like the story card.", "STYLE.md: headlines keep color; underline is the cue", "Done · 2026-11-06"],
  ["F9", "No timestamp on the card; the Constitution's river contract asks for one.", <><b>Recommend</b> an optional date slot in the meta row after the byline, short and absolute (e.g. &ldquo;Jul 20&rdquo;, Pacific). It hides with the byline below a 20rem container and is omitted when the source date is invalid, never generated.</>, "Constitution Art. IV; APP_RULES date rules", "Decide · editorial"],
  ["F10", "Kicker blue: the Constitution says #2D75B9; the token is #2B6FAF.", <><b>Recommend</b> keeping the token and changing the Constitution to name <code>--primary</code>, not a hex. Neither blue reaches 4.5:1 for 11px text on the #ECE9E3 canvas (#2B6FAF 4.34, #2D75B9 3.98), though both pass on white cards. So add a canvas kicker token at <b>#2A6CAB</b>: 4.52 on the canvas, 5.48 on white.</>, "Constitution Art. II; WCAG 1.4.3", "Decide · brand"],
  [<>F13 <SpecTag>new</SpecTag></>, <>STYLE.md says content cards show no per-card Save, but production passes <code>onSave</code> to every block card.</>, <><b>Recommend</b> keeping one bookmark toggle in the meta row and clarifying STYLE.md to allow a single save control while still banning action rows. The alternative is to remove it and save only from the reader.</>, "STYLE.md content-card rule vs production", "Decide · product"],
] as const;

export function BlocksChapter() {
  return (
    <SpecChapter
      id="blocks"
      number="05"
      kicker="HDS · Hearst+ building blocks · Spec"
      title="Blocks, cards and widgets"
      lede={<p>This spec covers the parts that make up Hearst+ home page sections: 8 layout patterns, 10 card types and 6 sidebar widgets from the Building Blocks Library. Each entry gives the part&rsquo;s anatomy, the tokens it uses, how it responds to width, and its states. Values come from the component source and from measuring the running app.</p>}
      meta={[
        ["Doc", "HP-BLOCKS-SPEC · Rev B · 2026-11-09"],
        ["Route", <code key="r">/hearst-plus/blocks/library/</code>],
        ["Source", <><code>blocks-library-experience.tsx</code>, <code>home-page.tsx</code>, <code>globals.css</code></>],
        ["Measured", "Playwright · Chromium · viewports 390, 768, 1024, 1280, 1440, 1600 · fonts loaded · light mode"],
      ]}
      contents={[
        ["Composition model", "#blocks-model"],
        ["Foundations", "#blocks-foundations"],
        ["Story card", "#blocks-story-card"],
        ["Patterns", "#blocks-patterns"],
        ["Card variants", "#blocks-variants"],
        ["Card types", "#blocks-cards"],
        ["Widgets", "#blocks-widgets"],
        ["Findings & solutions", "#blocks-findings"],
      ]}
    >
      {/* ---------- 00 Model ---------- */}
      <SpecSection id="blocks-model" kicker="05.0 · How the parts combine" title="Composition model">
        <SpecColumns columns={3}>
          <div>
            <SpecSubhead>Pattern = placement</SpecSubhead>
            <SpecNote className="mt-2">A pattern sets where cards go, how many show, their proportions and the gaps between them. It says nothing about what a card contains.</SpecNote>
          </div>
          <div>
            <SpecSubhead>Card type = content</SpecSubhead>
            <SpecNote className="mt-2">A card type decides the fields and actions shown: an article, a video, a community thread, an event, an ad. Any card type can fill any pattern slot of a matching shape.</SpecNote>
          </div>
          <div>
            <SpecSubhead>Widget = sidebar module</SpecSubhead>
            <SpecNote className="mt-2">A widget is a self-contained module for a sidebar column. Widgets stack in any order inside a sidebar slot (for example, the side rail of Three-Column Feature).</SpecNote>
          </div>
        </SpecColumns>
        <SpecNote>In the library, every preview sits in a frame with <code>rounded-[8px] bg-muted/60</code> and padding of <code>p-3 · sm:p-5 · lg:p-7</code> (12 · 20 · 28). The frame is library chrome, not part of the block. Content width inside the frame (the &ldquo;inner W&rdquo; below) is the width the pattern actually gets.</SpecNote>
      </SpecSection>

      {/* ---------- 01 Foundations ---------- */}
      <SpecSection id="blocks-foundations" kicker="05.1 · Shared tokens" title="Foundations" intro={<p>All blocks render inside <code>.hearst-plus-theme</code>. The values below are what <code>getComputedStyle</code> returned on the library route. Brand themes can override them.</p>}>
        <SpecColumns>
          <div className="min-w-0 space-y-3">
            <SpecSubhead>Surface, shadow, radius</SpecSubhead>
            <SpecTable caption="Surface, shadow and radius tokens" headers={["Token", "Resolved", "Used for"]} rows={surfaceRows} codeFirst={false} minWidth="32rem" />
          </div>
          <div className="min-w-0 space-y-3">
            <SpecSubhead>Type and color</SpecSubhead>
            <SpecTable caption="Type and color tokens" headers={["Token", "Resolved", "Used for"]} rows={typeColorRows} codeFirst={false} minWidth="32rem" />
          </div>
        </SpecColumns>
        <SpecSubhead>Spacing and breakpoints</SpecSubhead>
        <SpecTable caption="Spacing, breakpoints, container queries, touch and motion" headers={["Name", "Value", "Notes"]} rows={spacingRows} codeFirst={false} minWidth="48rem" />
      </SpecSection>

      {/* ---------- 02 Story card ---------- */}
      <SpecSection
        id="blocks-story-card"
        kicker="05.2 · Card type 01 · Drawing HP-CARD-001 · Rev D"
        title="Story card"
        intro={<p>The Article card type is the production river card: <code>LifestyleRiverCard</code> in <code>home-page.tsx</code>, rendered with <code>layoutOverride=&quot;blocks&quot;</code>. Video, Make/Model/Year and Gallery cards are variations of it. The full dimensional drawing is in <a href="/specs/story-card-drawing.html" className={link}>story-card-drawing.html</a>. The film below walks through it part by part.</p>}
      >
        <SpecSheet
          src="/specs/story-card-drawing.png"
          width={1760}
          height={1098}
          href="/specs/story-card-drawing.html"
          alt="Dimensional drawing sheet of the story card: plan views at sm and base breakpoints, exploded layer stack, meta row detail, shadow envelope, states, radius details and token tables."
        />
        <div id="blocks-story-card-film" className="scroll-mt-28">
          <SpecFilm
            src="/specs/story-card-film.mp4"
            poster="/specs/story-card-film-poster.jpg"
            label="Story card film · 2:07 · no sound. The drawing explained part by part: slots, spacing, the height formula, line clamps, the meta row, breakpoints, layers, shadow, radius, states and row behavior."
            caption={<p><b className="text-foreground">Story card film · 2:07 · no sound.</b> The drawing explained part by part: slots, spacing, the height formula, line clamps, the meta row, breakpoints, layers, shadow, radius, states and row behavior. Pick a chapter to jump to it. <a href="/specs/story-card-film.mp4" className={link}>Download the story card film</a>.</p>}
            chapters={storyFilmChapters}
          />
        </div>
        <SpecColumns>
          <div>
            <SpecSubhead>Anatomy (top to bottom)</SpecSubhead>
            <ul>
              <li><b>Container</b>: <code>article</code>, <code>rounded-[8px]</code>, <code>--hp-surface</code>, <code>--hp-shadow-card</code>, <code>overflow-hidden</code>, border 0.</li>
              <li><b>Media</b>: fills W at 16:9 (<code>aspect-video</code>, <code>object-cover</code>). Its top corners are clipped by the container radius.</li>
              <li><b>Meta row</b> (<code>.story-meta-row</code>, z-20): 16px brand icon (r 3) · 6 gap · &ldquo;Brand · Topic&rdquo; (truncates) · &ldquo;· Byline&rdquo; (hidden below a 20rem container) · optional save button at the end. Text uses <code>type-m1</code> (12/16, 600, +0.4px).</li>
              <li><b>Headline</b>: <code>.headline type-t3</code> (20/24, then 24/28 from md 768), clamped to 3 lines, underlines on hover or focus. On vehicle stories a rating badge sits at the end of the row (gap 12, aligned to the bottom).</li>
              <li><b>Summary</b>: <code>type-d2</code> (16/24, +0.2px), clamped to 2 lines, <code>--muted-foreground</code>.</li>
              <li><b>Hit area</b>: an invisible <code>button</code> covers the whole card (<code>absolute inset-0</code>, z-10). The meta row sits above it, so the brand link and save button get their own clicks.</li>
            </ul>
          </div>
          <div className="min-w-0 space-y-3">
            <SpecSubhead>Measured values</SpecSubhead>
            <SpecTable caption="Story card measured values by breakpoint" headers={["Part", "Base < 640", "sm 640–767", "md ≥ 768"]} rows={measuredRows} codeFirst={false} minWidth="32rem" />
            <SpecNote>Height = W·9/16 + 2·padding + meta row + 8 + n·headline line + 8 + m·summary line. The 672 sample (no save, 1 headline line, 1 summary line): 378 + 40 + 16 + 8 + 28 + 8 + 24 = 502. The 326 sample (save, 2 + 2 lines): 183.4 + 32 + 44 + 8 + 48 + 8 + 48 = 371.4. Both match the measurements exactly (2026-11-09).</SpecNote>
          </div>
        </SpecColumns>
        <SpecSubhead>States</SpecSubhead>
        <SpecTable caption="Story card states" headers={["State", "Treatment"]} rows={stateRows} codeFirst={false} />
      </SpecSection>

      {/* ---------- 03 Patterns ---------- */}
      <SpecSection
        id="blocks-patterns"
        kicker="05.3 · Layout patterns"
        title="Patterns"
        intro={<p>Every pattern is now a mode of the production block <code>EditorialHomepageSection</code> (<code>home-page.tsx</code>), and the library renders that component directly. Columns follow the block&rsquo;s own width through the container <code>hp-block</code>, not the viewport. The film below walks through every pattern. Each figure redraws the measured card rectangles at 0.14:1 for every inner width the library produced (inner W = preview width minus the frame padding, measured 2026-11-09).</p>}
      >
        <SpecTable
          caption="Pattern columns by block width"
          headers={["Block width", "Row (.hp-block-row)", "Grid (.hp-block-grid)", "Feature + Sidebar", "Three-Column"]}
          rows={patternColumnRows}
          codeFirst={false}
          minWidth="48rem"
        />
        <SpecNote>Row and grid thresholds come from a 260px minimum card and the 16px layout gap (<code>--layout-gap</code>): 2·260 + 16 = 536, 3·260 + 32 = 812, 4·260 + 48 = 1088. Feature + Sidebar and Three-Column keep their own 820 and 1100 switches (<code>@min-[820px]</code>, <code>@min-[1100px]</code>), with a 20px gap between their columns. Grid items stretch, so cards in a row share the tallest card&rsquo;s height. Cards use <code>content-start</code>, so the spare height collects below the text and media and meta rows stay aligned. Card Row at production widths (computed with the 16 gap): 358 → 1, 720 → 2 × 352, 976 → 3 × 314.7, 1184 → 4 × 284, 1264 → 4 × 304, every row with equal heights.</SpecNote>

        <div id="blocks-film" className="scroll-mt-28">
          <SpecFilm
            src="/specs/blocks-film.mp4"
            poster="/specs/blocks-film-poster.jpg"
            label="Blocks film · 1:48 · no sound. How blocks hold cards: each of the 8 patterns morphs through block widths 326, 664, 978 and 1138, with column widths and gaps measured in the Blocks Library on 2026-11-09."
            caption={<p><b className="text-foreground">Blocks film · 1:48 · no sound.</b> How blocks hold cards: each of the 8 patterns morphs through block widths 326, 664, 978 and 1138, with column widths and gaps measured in the Blocks Library on 2026-11-09. Pick a chapter to jump to it. <a href="/specs/blocks-film.mp4" className={link}>Download the blocks film</a>.</p>}
            chapters={blocksFilmChapters}
          />
        </div>

        <PatternBlock
          id="blocks-p-featured-four"
          label={<>Pattern 01 · featured-four · mode <code>featureFirstGrid</code></>}
          title="Featured + Row"
          summary="A section heading, a full-width lead story, then a row of up to four cards."
          pattern="Featured + Row"
          anatomy={<>
            <li><b>Heading:</b> <code>headline text-4xl</code> section title, with a 12px caps selection label at the end.</li>
            <li><b>Lead:</b> a standard story card (16:9, see Story card), then a 16px gap.</li>
            <li><b>Row:</b> <code>.hp-block-row</code> holding four standard cards, with a 16px gap (<code>--layout-gap</code>).</li>
          </>}
          responsive={<>
            <li>The row follows the table above: 1, 2, 3 or 4 columns. With 3 columns the fourth card is hidden, so a row is never partial.</li>
            <li>The lead stays full width at every size.</li>
          </>}
          states="Row cards stretch to one height. Hover underlines the headline and scales the media 1.025; focus shows the inset ring; the bookmark save button sits in the meta row."
        />

        <PatternBlock
          id="blocks-p-four-card-row"
          label={<>Pattern 02 · four-card-row · mode <code>cardGrid</code></>}
          title="Card Row"
          summary="A section heading and a row of up to four compact cards."
          pattern="Card Row"
          anatomy={<>
            <li><code>.hp-block-row</code>, 16px gap (<code>--layout-gap</code>).</li>
            <li>Compact story cards (<code>LifestyleRiverCard compact</code>): 4:3 media, 12px padding, text-lg headline clamped to 3 lines, no summary.</li>
          </>}
          responsive={<li>1 → 2 → 3 → 4 columns at 536, 812 and 1088. At 3 columns the fourth card is hidden.</li>}
          states="Same as Pattern 01."
        />

        <PatternBlock
          id="blocks-p-feature-sidebar"
          label={<>Pattern 03 · feature-sidebar · mode <code>featureSidebar</code></>}
          title="Feature + Sidebar"
          summary="A lead story beside a stack of four horizontal stories."
          pattern="Feature + Sidebar"
          anatomy={<>
            <li>Grid with a 20px gap. The lead is a standard card.</li>
            <li>The stack holds four list cards (<code>layoutOverride=&quot;list&quot;</code>, <code>editorialRow</code>, no summary or byline) at a 12px gap.</li>
          </>}
          responsive={<>
            <li>Below a 820px block: one column, lead first.</li>
            <li>From 820: columns <code>minmax(0,1.8fr) | minmax(0,1fr)</code>. The stack becomes <code>grid-rows-4</code> at full height, so the four cards together match the lead (<code>stretchToFeature</code>). Production: 615 | 341 at 976, and 800 | 444 at 1264.</li>
          </>}
        />

        <PatternBlock
          id="blocks-p-hero-three"
          label={<>Pattern 04 · hero-three-horizontal · mode <code>riverWithHero</code></>}
          title="River with Hero"
          summary="A section heading, a full-width lead story, then three horizontal story cards."
          pattern="River with Hero"
          anatomy={<>
            <li>Lead: a standard card. Then a 12px gap and three list cards (<code>editorialRow</code>), also 12px apart.</li>
            <li>List card: grid <code>28% | 1fr</code>, 4:3 media at r 6 (<code>rounded-card-inner</code>), padding <code>p-4 · sm:p-5</code>, headline <code>lg · sm:xl</code> clamped to 3 lines, summary clamped to 3.</li>
          </>}
          responsive={<li>One column at every width. The media column is 28% of the card width, so card height grows with width.</li>}
        />

        <PatternBlock
          id="blocks-p-three-col"
          label="Pattern 05 · three-column-feature · library composition"
          title="Three-Column Feature Row"
          summary={<>A discovery rail, a central feature and a contextual ad slot. It&rsquo;s built from production parts: <code>TrendingStoryRail</code>, a one-story <code>EditorialHomepageSection</code> and <code>ContextualRiverAdvertisement</code>.</>}
          pattern="Three-Column Feature Row"
          anatomy={<>
            <li>Rail: Trending widget, 5 ranked rows.</li>
            <li>Center: heading and standard lead card.</li>
            <li>Ad: contextual river advertisement (16:9 creative, disclosure, CTA).</li>
          </>}
          responsive={<>
            <li>Below 820: stacked (rail, feature, ad).</li>
            <li>820–1099: rail and ad stack in the left column (min 240) beside the feature, which spans both rows.</li>
            <li>From 1100: <code>.75fr | 1.6fr | .75fr</code> (min 240 for the side columns). The center column never drops under ~480.</li>
          </>}
        />

        <PatternBlock
          id="blocks-p-video-four"
          label="Pattern 06 · featured-video-four · library composition"
          title="Featured Video + Four"
          summary="A featured playable video, then four video cards."
          pattern="Featured Video + Four"
          anatomy={<>
            <li>Featured: <code>LifestyleRiverCard featured</code>. A video story renders the 16:9 poster with a 56px play button and a duration pill.</li>
            <li>Then a 20px gap and <code>.hp-block-grid</code> with four video story cards.</li>
          </>}
          responsive={<li>Grid: 1 → 2 → 4 columns at 536 and 1088. There&rsquo;s no 3-column step, so four cards always fill their rows.</li>}
          states={<>poster → playing (inline <code>AdaptiveVideo</code>). Stories without a <code>videoUrl</code> show their poster with no play button.</>}
        />

        <PatternBlock
          id="blocks-p-grid"
          label={<>Pattern 07 · four-card-grid · mode <code>grid</code> (new)</>}
          title="Grid"
          summary="Standard story cards in a grid that wraps."
          pattern="Grid"
          anatomy={<li><code>.hp-block-grid</code>, 16px gap (<code>--layout-gap</code>), any number of standard cards (the library shows 8).</li>}
          responsive={<li>1 → 2 → 4 columns at 536 and 1088. Rows stretch to their tallest card.</li>}
        />

        <PatternBlock
          id="blocks-p-river"
          label={<>Pattern 08 · horizontal-story-list · mode <code>river</code> (new)</>}
          title="River"
          summary="A section heading and a stack of horizontal story cards."
          pattern="River"
          anatomy={<li>List cards (<code>editorialRow</code>) at a 12px gap. Each has its meta row, headline and summary, plus the bookmark save button when saving is available.</li>}
          responsive={<li>One column at every width. Media is 28% of the card width.</li>}
        />
      </SpecSection>

      {/* ---------- 04 Variants ---------- */}
      <SpecSection id="blocks-variants" kicker="05.4 · Inside the patterns" title="Story card variants" intro={<p>Patterns use one card component, <code>LifestyleRiverCard</code>. The library&rsquo;s separate <code>StorySample</code> and the inline Card Row card are gone.</p>}>
        <SpanTable caption="Story card variants" headers={["Variant", "Props", "Media", "Body", "Headline", "Summary", "Used in"]} rows={variantRows} minWidth="64rem" />
        <SpecNote>Every variant: <code>rounded-card</code> (8), <code>--hp-surface</code>, <code>--hp-shadow-card</code>, no border. The meta row is a 16px brand icon, &ldquo;Brand · Topic · Byline&rdquo; (byline hidden below 20rem) and an optional bookmark save button.</SpecNote>
      </SpecSection>

      {/* ---------- 05 Card types ---------- */}
      <SpecSection id="blocks-cards" kicker="05.5 · Content components" title="Card types" intro={<p>The library renders each type at up to 672px wide (<code>max-w-2xl</code>), except Shorts and Brand Spotlight. Heights are the library samples.</p>}>
        <SpecTable caption="Card types" headers={["#", "Type · component", "Anatomy", "Tokens and sizes", "Responsive", "States"]} rows={cardTypeRows} codeFirst={false} minWidth="72rem" />
      </SpecSection>

      {/* ---------- 06 Widgets ---------- */}
      <SpecSection id="blocks-widgets" kicker="05.6 · Sidebar modules" title="Widgets" intro={<p>Shared shell (<code>DiscoverySidebarCard</code> and its siblings): <code>section</code>, r 8, <code>--hp-surface</code>, <code>--hp-shadow-card</code>, padding 16 (<code>p-4</code>). The title is <code>type-k1</code> (11/16, 700, caps, +0.1em), in <code>--hp-sidebar-heading</code>, which falls back to <code>--primary</code>. The library preview caps widgets at 360px wide.</p>}>
        <SpecTable caption="Sidebar widgets" headers={["#", "Widget · component", "Anatomy", "Sizes", "Responsive", "States"]} rows={widgetRows} codeFirst={false} minWidth="72rem" />
      </SpecSection>

      {/* ---------- 07 Findings ---------- */}
      <SpecSection
        id="blocks-findings"
        kicker="05.7 · For the design system team"
        title="Findings and solutions"
        intro={<p>Each finding was checked against the production blocks page (<code>/hearst-plus/blocks/</code>, measured at 390 to 1920) and the rule documents. Production renders sections with <code>EditorialHomepageSection</code> inside a column of up to 1264px. Nothing has been changed in code yet.</p>}
      >
        <SpecCallout><b>Applied 2026-11-06 (uncommitted):</b> <code>rounded-card</code> and <code>rounded-card-inner</code> tokens in <code>globals.css</code> <code>@theme</code>, registered in <code>cn()</code>. 106 card-surface radii switched from <code>rounded-[8px]</code> / <code>rounded-[7px]</code>. Dead <code>hover:border-*</code> classes removed from 9 cards. Event card surface fixed. Bookmark save icons (rev C; the heart is reserved for likes). Headline hover changed from a color change to an underline. Every card checked renders at 8px, including brand pages.</SpecCallout>

        <SpecColumns columns={3}>
          <div>
            <SpecSubhead>Done · 10</SpecSubhead>
            <SpecNote className="mt-2">F1–F8, F11 and F12, all uncommitted. S1 covers F1, F3, F4 and F5.</SpecNote>
          </div>
          <div>
            <SpecSubhead>Needs a decision · 3</SpecSubhead>
            <SpecNote className="mt-2">F9 card timestamp, F10 kicker blue, F13 save control on cards.</SpecNote>
          </div>
          <div>
            <SpecSubhead>Biggest lever</SpecSubhead>
            <SpecNote className="mt-2">One story card with variants, plus one row rule based on container width (S1 below), resolves F1–F5 together.</SpecNote>
          </div>
        </SpecColumns>

        <div id="blocks-s1" className="scroll-mt-28">
          <SpecFinding title="S1 · One card, one row rule">
            <p className="type-k1">Solution S1 · resolves F1 · F2 · F3 · F4 · F5 · Done 2026-11-06</p>
            <p>Today there are <b>three</b> implementations of the story card. There&rsquo;s <code>LifestyleRiverCard</code> and the library&rsquo;s <code>StorySample</code>. There&rsquo;s also an inline card inside the production Card Row (<code>EditorialHomepageSection</code>, <code>cardGrid</code>), with 4:3 media at r 6, <code>p-3</code>, a text-lg headline and no summary. The library shows patterns the home page doesn&rsquo;t actually ship.</p>
            <div className="pt-4 text-foreground">
              <SpecColumns>
                <div>
                  <h5 className="type-k1 text-muted-foreground">Card</h5>
                  <ul>
                    <li>Make <code>LifestyleRiverCard</code> the only story card, with four variants: <b>standard</b> (today&rsquo;s card), <b>compact</b> (the row card: 4:3 media, 12 padding, no summary), <b>horizontal</b> (the list layout) and <b>hero</b> (overlay).</li>
                    <li>Make the library a thin wrapper that renders the real <code>EditorialHomepageSection</code> modes with sample stories, and delete <code>StorySample</code>.</li>
                    <li><b>Radius:</b> add <code>--radius-card: var(--hp-radius-card)</code> to <code>@theme</code> so cards use the class <code>rounded-card</code>. Inner media uses a derived <code>--hp-radius-inner: calc(var(--hp-radius-card) − 2px)</code> (= 6). Codemod <code>rounded-[8px]</code> on <code>hp-shadow-card</code> surfaces (240 uses in <code>src</code>) and retire <code>rounded-[7px]</code> (8 uses, all in the library and one onboarding modal).</li>
                    <li><b>Height:</b> cards in a row stretch to the tallest one, as the production grid already does (four cards at 1440 are all 357 tall). The article gets <code>h-full</code>, and content stays top-aligned with no pinned footer.</li>
                  </ul>
                </div>
                <div className="min-w-0 space-y-3">
                  <h5 className="type-k1 text-muted-foreground">Row rule (container, not viewport)</h5>
                  <SpecNote>Column count follows the row&rsquo;s own width, using a minimum card width of 260 and the 16px layout gap (<code>--layout-gap</code>; this rule first shipped with a 20 gap):</SpecNote>
                  <SpecTable caption="Row rule by row width" headers={["Row width", "Columns", "Production check"]} rows={rowRuleRows} codeFirst={false} minWidth="28rem" />
                  <SpecNote>Card Row keeps one line and hides the extra cards. Grid and Featured Video + Four wrap onto more rows. Feature + Sidebar goes side by side at ≥ 820 (production switches at lg, giving a 615 | 341 split). Three-Column uses three columns only at ≥ 1100. Between 820 and 1100 it drops to two (feature + rail, ad below), so the center column is never under ~480. The library&rsquo;s 2-up at 326 (157px cards) goes away.</SpecNote>
                </div>
              </SpecColumns>
            </div>
            <p className="pt-2 text-sm"><SpecTag>F4 answer</SpecTag> The 64rem threshold isn&rsquo;t a problem in production: the column is 1184–1264, so it gets 4 cards from a 1280 viewport. It only looked broken inside the narrower library frame. With S1, the library and production agree because both read the container width.</p>
          </SpecFinding>
        </div>

        <SpecTable caption="Findings, recommended solutions and status" headers={["#", "Finding", "Recommended solution", "Rule source", "Status"]} rows={findingRows} codeFirst={false} minWidth="64rem" />

        <SpecProse>
          <SpecSubhead>Suggested order</SpecSubhead>
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-6">
            <li>Tokens: <code>--radius-card</code>, <code>--hp-radius-inner</code> and the radius codemod (F2). This is low risk and unblocks the rest.</li>
            <li>Rule fixes in place: F6, F8, F11, F12. Small diffs, each backed by an existing rule.</li>
            <li>F7, the Saved empty state. <b>Done.</b></li>
            <li>S1: consolidate the card, add the container row rule, and switch the library to production components (F1, F3, F4, F5). <b>Done.</b> Patterns now render <code>EditorialHomepageSection</code>; <code>StorySample</code> and <code>.pattern-card-row</code> are removed.</li>
            <li>F9, F10, F13 once decided. Record each in <code>DECISION_LOG.md</code> and its canonical owner (STYLE.md, APP_RULES.md or the Constitution).</li>
          </ol>
          <SpecSubhead>Not measured here</SpecSubhead>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-6">
            <li>Dark mode and brand-theme overrides. Values above are the default Hearst+ light theme.</li>
            <li>Skeleton and loading states of the home river (<code>feed-states.tsx</code>).</li>
          </ul>
        </SpecProse>
      </SpecSection>
    </SpecChapter>
  );
}
