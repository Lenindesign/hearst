import { Col, ColGroup, FindingList, TaggedFinding } from "@/components/specs/chapters/chapter-parts";
import { SpecChapter, SpecColumns, SpecFilm, SpecSection, SpecSheet, SpecTable } from "@/components/specs/spec-kit";

/** Content reader spec (HP-READ-SPEC · Rev A · 2026-11-11), converted from public/specs/reader-spec.html. */
const breakpointRows = [
  ["0", "Full viewport · radius 0", "Row 69 · Close 44 · filters scroll", "Article only · padding 16", "358 at 390"],
  ["sm 640", "Inset 24 · radius 8", "Row 64 · Close 28 · filters centered", "Article only · card padding 28", "560 at 640"],
  ["md 768", "Unchanged", "Unchanged", "Grid padding 24 · headline 48 / 52", "672 at 768"],
  ["lg 1024", "Unchanged", "Destinations row appears", "Article | ad rail 300", "612 at 1024"],
  ["xl 1280", "Unchanged", "Unchanged", "Context rail 300 | article | ad rail · padding 48", "504 at 1280 · 632 at 1440"],
  ["1408", "The shell reaches 1360 and centers; the scrim stays full-bleed.", "", "", ""],
] as const;

const keyboardRows = [
  ["Open", <>The page outside is isolated (<code>use-modal-isolation</code>). Focus moves to Close on the next frame.</>],
  ["Tab / Shift+Tab", "Moves through the reader and wraps from last to first and back."],
  ["Escape · scrim · Close", "Closes the reader."],
  ["P", "Opens the ambient (premium) reader for the story in view, unless focus is in a text field or a modifier is held."],
  ["Nested gallery or ambient reader", "The reader stops handling Escape and Tab while the top layer owns focus."],
  ["After closing", "Focus returns to the live opener; if it is gone after a route change, to the element with the stored aria-label; for carousel stories, to the matching carousel dot. It retries every 50 ms for up to 3 s while the route remounts."],
] as const;

const tokenRows = [
  ["Scrim", <><code>--foreground</code> at 55% + blur 8</>, "oklab(0.145 …) / .55"],
  ["Shell", <code key="c">--background</code>, "rgb(236 233 227)"],
  ["Article card", <><code>bg-card</code> · <code>border-border</code></>, "#FFFFFF · rgb(214 218 219)"],
  ["Comments", <><code>--hp-neutral-surface</code> → <code>--palette-neutral-100</code></>, "rgb(245 245 245)"],
  ["Kicker, active filter", <><code>--primary</code> (brand)</>, "per brand"],
  ["Headline", <><code>--font-headline</code>, weight 800</>, "Barlow Semi Condensed (Men’s Health)"],
  ["Dark Flux", <><code>--content-reader-article-surface</code>, video-feed tokens</>, "dark mode only"],
] as const;

export function ReaderChapter() {
  return (
    <SpecChapter
      id="reader"
      number="07"
      kicker="HDS · Hearst+ content reader · Spec"
      title="Content reader"
      lede={<p>This spec covers the Hearst+ story reader: the modal shell that opens over the page, its sticky masthead, the context rail, the article card, the ad rail and the endless story queue. It gives each part&rsquo;s anatomy, the columns at each breakpoint, scroll and queue behavior, keyboard and focus rules, and tokens. Values come from the component source and from measuring the running app.</p>}
      meta={[
        ["Doc", "HP-READ-SPEC · Rev A · 2026-11-11"],
        ["Drawing", <><a href="/specs/reader-drawing.html" className="underline underline-offset-4">HP-READ-001</a> · 2 sheets</>],
        ["Source", <><code>content-reader-dialog-shell.tsx</code>, <code>content-reader-masthead.tsx</code>, <code>content-reader-context-rail.tsx</code>, <code>content-reader-advertisement.tsx</code>, <code>home-page.tsx</code> (reader)</>],
        ["Measured", <>Playwright · Chromium · <code>/read/&#123;story&#125;</code> opened from <code>/hearst-plus/</code> · viewports 390, 640, 768, 1024, 1280, 1440 · light mode</>],
      ]}
      contents={[
        ["Film", "#reader-film"],
        ["Anatomy", "#reader-anatomy"],
        ["Breakpoints", "#reader-breakpoints"],
        ["Scroll and queue", "#reader-scroll"],
        ["Keyboard and focus", "#reader-keyboard"],
        ["Tokens", "#reader-tokens"],
        ["Findings", "#reader-findings"],
      ]}
    >
      <SpecSection id="reader-film" kicker="07.0 · Walkthrough" title="How the reader works" intro={<p>The film animates the reader on a wireframe drawn from the measured geometry: opening, the shell, the masthead, the columns at each width, the article, scrolling, the story queue, focus and the layer order. It ends on the two drawing sheets.</p>}>
        <SpecFilm
          src="/specs/reader-film.mp4"
          poster="/specs/reader-film-poster.jpg"
          label="Content reader film · 2:06 · no sound."
          caption={<p><b className="text-foreground">Content reader film · 2:06 · no sound.</b> Captions at the top of each scene say what is happening; dimensions use the drawing&apos;s codes. Pick a chapter to jump to it.</p>}
          chapters={[
            [0, "Opening a story"],
            [10, "The shell: inset and 1360 max"],
            [22, "Masthead, desktop and phone"],
            [34, "Columns by breakpoint"],
            [50, "Article anatomy"],
            [64, "Scrolling and back to top"],
            [78, "The story queue and active story"],
            [94, "Focus, keyboard and closing"],
            [106, "Layer order"],
            [114, "The drawing sheets"],
          ]}
        />
      </SpecSection>

      <SpecSection id="reader-anatomy" kicker="07.1 · Drawing HP-READ-001 · Rev A · Sheet 1" title="Anatomy" intro={<p>The reader is one dialog, named Story reader, portaled to the body. A scrim covers the page; the shell sits on it and is itself the scroll container. Inside, a sticky masthead sits over a grid of up to three columns. The full drawing is in <a href="/specs/reader-drawing.html" className="font-semibold text-foreground underline underline-offset-4">reader-drawing.html</a>.</p>}>
        <SpecSheet
          src="/specs/reader-drawing-sheet-1.jpg"
          width={1936}
          height={1209}
          href="/specs/reader-drawing.html"
          alt="Drawing sheet 1, structure: the reader at 1440 and at 390 with dimensions, the columns at each breakpoint, details of the article top, the action bar and the close control, and variable tables."
        />
        <SpecColumns>
          <Col>
            <ColGroup title="1 · Scrim and shell">
              <ul>
                <li><b>Scrim</b>: <code>fixed inset-0 z-[200]</code>, <code>bg-foreground/55</code> with <code>backdrop-blur-sm</code> (8). A full-size click catcher under the shell closes the reader.</li>
                <li><b>Shell</b>: full viewport below 640 (<code>h-[100dvh]</code>, no radius). From 640 it sits 24 inside every edge with radius 8 and <code>shadow-2xl</code>. It stops at 1360 and centers (from a 1408 viewport).</li>
                <li><b>Scrolling</b>: the shell scrolls (<code>overflow-y-auto overscroll-contain</code>, stable scrollbar gutter), not the page. It carries the brand&apos;s CSS variables and <code>data-mode</code>.</li>
              </ul>
            </ColGroup>
            <ColGroup title="2 · Masthead">
              <ul>
                <li><b>Box</b>: <code>sticky top-0 z-[110]</code>, background, 1 px bottom border.</li>
                <li><b>Top row</b>: 64 tall from 640 (padding 12 / 24), 69 below 640 (padding 12 / 16). Logo slot up to 230 wide; destinations or publications from 1024; round Close, 28 from 640 and 44 below.</li>
                <li><b>Filter row</b>: 46 tall. Topic filters hug their labels, 24 apart, centered from 640; below 640 they scroll sideways. The active one has a 2 px underline.</li>
              </ul>
            </ColGroup>
          </Col>
          <Col>
            <ColGroup title="3 · Grid and rails">
              <ul>
                <li><b>Outer grid</b>: padding 16 / 24 (24 / 24 from 768, 48 / 24 from 1280), gap 16 across and 32 down. From 1280: <code>300 | 1fr</code>, adding the context rail.</li>
                <li><b>Inner grid</b> (per story): from 1024, <code>1fr | 300</code>, adding the ad rail.</li>
                <li><b>Context rail</b>: Trending, Saved and Suggested cards, padding 16, radius 8, 16 apart. Sticky at top 128, at most <code>100dvh − 160</code> tall, scrolls inside itself.</li>
                <li><b>Ad rail</b>: one 300 × 600 unit, radius 8, border 1: 268 of media over a body padded 24. Sticky at top 128.</li>
              </ul>
            </ColGroup>
            <ColGroup title="4 · Article">
              <ul>
                <li><b>Card</b>: border 1, radius 8, padding 20 (28 from 640).</li>
                <li><b>Lead media</b>: 16:9, radius 4, opens the fullscreen gallery. Car stories use a gallery grid, video stories a 16:9 player.</li>
                <li><b>Text column</b>: max 768, centered. Kicker 11 / 16 bold, 12 above the headline. Headline T1: 32 / 36, and 48 / 52 from 768.</li>
                <li><b>Action bar</b>: 1 px rules above and below, padding 12, 24 from the headline and the body. Byline on the left; Ambient reader, Save and Comments on the right, 28 round, 8 apart (44 below 640, where the bar wraps to 146).</li>
                <li><b>Body</b>: 18 / 28, 24 between paragraphs; subheads 22 / 28 (28 / 32 from 768). Comments sit 32 below, padding 16 (20 from 640), radius 8.</li>
              </ul>
            </ColGroup>
          </Col>
        </SpecColumns>
      </SpecSection>

      <SpecSection id="reader-breakpoints" kicker="07.2 · What changes where" title="Breakpoints">
        <SpecTable caption="Content reader: what changes at each breakpoint" headers={["From", "Shell", "Masthead", "Columns", "Article width (measured)"]} rows={breakpointRows} minWidth="48rem" />
      </SpecSection>

      <SpecSection id="reader-scroll" kicker="07.3 · Drawing HP-READ-001 · Sheet 2" title="Scroll and the story queue">
        <SpecSheet
          src="/specs/reader-drawing-sheet-2.jpg"
          width={1936}
          height={1208}
          href="/specs/reader-drawing.html"
          alt="Drawing sheet 2, logic: viewport placement at three sizes, the layer order, the story queue with the reading anchor and sentinel, active-story rules, the focus flow, article width by viewport, thresholds and keyboard."
        />
        <SpecColumns>
          <Col>
            <ColGroup title="Sticky parts">
              <ul>
                <li>The masthead sticks at the top of the shell. Both rails stick 128 down and follow the story they belong to.</li>
                <li><b>Back to top</b> appears once the shell has scrolled more than 320. It sits 32 from the bottom and <code>max(32, (100vw − 1360) ÷ 2 + 32)</code> from the right; 44 round below 640, 28 from 640. It scrolls the shell smoothly to 0.</li>
              </ul>
            </ColGroup>
            <ColGroup title="The queue">
              <ul>
                <li>The reader opens with one story. A sentinel with a 600 px root margin mounts the next story when the end comes within 600, one at a time, until the queue runs out.</li>
                <li>Stories are separated by an <b>Up next</b> rule: 40 above and below, hairlines either side of the kicker.</li>
              </ul>
            </ColGroup>
          </Col>
          <Col>
            <ColGroup title="Which story is active">
              <ul>
                <li>The reading anchor is <code>min(0.45 × shell height, 420)</code> from the top of the shell.</li>
                <li>A story can win only with at least <code>min(240, 0.35 × shell height)</code> visible. The one that holds the anchor wins; otherwise the one whose top is nearest to it.</li>
                <li>On a change the reader replaces the history entry with <code>/read/&#123;id&#125;</code> (no new back-button step), and the context rail and ad follow the new story.</li>
              </ul>
            </ColGroup>
          </Col>
        </SpecColumns>
      </SpecSection>

      <SpecSection id="reader-keyboard" kicker="07.4 · Accessibility" title="Keyboard and focus">
        <SpecTable caption="Content reader keyboard and focus" headers={["Moment", "What happens"]} rows={keyboardRows} codeFirst={false} />
      </SpecSection>

      <SpecSection id="reader-tokens" kicker="07.5 · Tokens" title="Tokens">
        <SpecTable caption="Content reader tokens" headers={["Part", "Token", "Rendered (light, Men’s Health)"]} rows={tokenRows} codeFirst={false} />
      </SpecSection>

      <SpecSection id="reader-findings" kicker="07.6 · For the design system team" title="Findings" intro={<p>These come from comparing the measurements with the source. Nothing has been changed in code.</p>}>
        <FindingList>
          <TaggedFinding id="reader-f1" tag="F1 · LAYOUT" title="The article is narrowest at 1280">
            <p>At 1280 both 300 rails are on, so the article is 504 wide with a 446 text column, narrower than at 768 (672) or 1024 (612). Here the measured 30-Day Challenge headline takes two lines at 48 px; longer headlines take three. <b>Options:</b> bring the context rail in from 1440 instead of 1280, or keep it at 1280 and use 48 → 24 grid padding there.</p>
          </TaggedFinding>
          <TaggedFinding id="reader-f2" tag="F2 · NEEDS A DECISION" title={"Two different \"story in view\" rules"}>
            <p>The URL and context rail use an anchor at <code>min(0.45 × height, 420)</code>. The P shortcut picks its story with an anchor at <code>min(180, 0.25 × height)</code>. Near a story boundary, P can open a different story from the one the URL shows. <b>Fix:</b> share one helper for both.</p>
          </TaggedFinding>
          <TaggedFinding id="reader-f3" tag="F3 · PHONE" title="The action bar wraps to 146 on phones">
            <p>Below 640 the byline and the three 44 px actions don&apos;t fit on one line, so the bar is 146 tall at 390 and pushes the body down. <b>Option:</b> put the actions on their own row by design (byline above, actions in a fixed 44 row), so the height is predictable.</p>
          </TaggedFinding>
        </FindingList>
      </SpecSection>
    </SpecChapter>
  );
}
