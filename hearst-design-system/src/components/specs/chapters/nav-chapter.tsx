import { SpanTable, SpecNote, span } from "@/components/specs/chapters/blocks-nav-kit";
import { SpecChapter, SpecColumns, SpecFilm, SpecFinding, SpecSection, SpecSheet, SpecSubhead, SpecTable } from "@/components/specs/spec-kit";

const filmChapters = [
  [0, "The header: three bands"],
  [10, "Utility bar, desktop and phone"],
  [22, "Mega menu: open, place, close"],
  [36, "Masthead: banner and logo row"],
  [48, "Section row and active topic"],
  [62, "Scrolling at 768 and up: compact nav"],
  [78, "Scrolling on phones: sticky row"],
  [90, "Breakpoints from 360 to 1440"],
  [104, "Phone drawer"],
  [116, "Search"],
  [126, "Layer order"],
  [134, "The drawing sheets"],
] as const;

const headerHeightRows = [
  ["Hearst+ home (banner, incl. bar)", "111 + 41", "88 + 41", "99 + 39", "121 + 39", "143 + 39", "157 + 39"],
  ["Brand page (bar + logo row)", "32 + 80 + 41", "32 + 96 + 41", span(4, <span className="tabular-nums">32 + 96 + 39</span>)],
] as const;

const breakpointRows = [
  ["0", "Pill scrolls inside itself; links 28 tall · gutters 16", "Controls 44; menu button left; banner 5:1", "Scrolls with fades; sticky at top 32", "Drawer available; search inset 12, top 64"],
  ["sm 640", "Links 24 tall, 12 px text; grid gap 12", "Controls 28; layout toggle; banner at art ratio; logo row 96", "Unchanged", "No drawer; search top 96"],
  ["md 768", "Gutters 24", "Unchanged", "Static, centered, 39 tall; no fades; compact copy on scroll", "Unchanged"],
  ["lg 1024", "Weather cell 72 → 192", "Unchanged", "Unchanged", "Mega menu “All” uses 4 columns"],
  ["xl 1280", <>Grid <code>1fr | auto | 1fr</code>; gutters 48</>, "Unchanged", "Unchanged", "Unchanged"],
  ["1360", span(4, "Content stops at 1360 and centers. The bar background and the banner stay full-bleed.")],
] as const;

const keyboardRows = [
  ["Mega menu", "Hover, or focus a destination", <><code>role=menu</code>; links are <code>menuitem</code>; <code>aria-expanded</code> on the trigger</>, "Escape, press outside, pointer leaves, focus leaves the bar", "Stays where it is"],
  ["Phone drawer", <>Menu button (<code>aria-expanded</code>)</>, "Focus starts on Close; Tab and Shift+Tab wrap inside; the page behind is isolated", "Escape, Close, scrim, or picking a link", "The menu button"],
  ["Search", <>Search button (<code>aria-expanded</code>)</>, "Focus in the input; ↑ ↓ move through results; Enter opens one; Tab wraps", "Escape, Close, scrim", "The search button (retried up to 4 × 50 ms after remount)"],
] as const;

const targetRows = [
  ["Masthead controls", "44 × 44", "28 × 28", "Touch size on phones"],
  ["Destination links", "≥ 28 tall", "≥ 24 tall", "Meets the 24 px utility-control rule (APP_RULES)"],
  ["Section links", "≥ 32 tall", "22 tall", <>See <a href="#nav-f2" className="underline underline-offset-4">F2</a></>],
  ["Drawer and search controls", "44", "44", "Close, tiles, theme action"],
] as const;

const tokenRows = [
  ["Utility bar background", <><code>--primary</code>; Hearst+ home <code>--hp-utility-bar</code> (<code>--palette-alert-info-1000</code>); transparent over the home banner at the top</>, <><code>--component-navigation-utility-background-knockout</code> with a white/10 bottom border</>],
  ["Utility bar content", <code>--primary-foreground</code>, <code>--component-navigation-utility-content-knockout</code>],
  ["Pill track · active link", "black / 10 · white fill, black text", "white / 6 · white fill, black text"],
  ["Mega menu surface", <><code>--background</code>, <code>--border</code></>, <code>--component-navigation-utility-megamenu-background-knockout</code>],
  ["Masthead row and section row", <><code>--hp-surface</code>, <code>--border</code></>, <code>--component-video-feed-background-default</code>],
  ["Section link · hover · active", <><code>--foreground</code> · <code>--primary</code> · <code>--hp-section-title</code> + <code>border-primary</code></>, <>knockout · accent · <code>--component-navigation-utility-content-accent</code></>],
  ["Type", span(2, <>Utility bar: <code>--text-token-4xs</code> base, links 11 / 12 px. Section links 14 / 20. Drawer headings <code>type-k1</code>. Search title <code>type-k1</code>.</>)],
] as const;

const link = "underline underline-offset-4";

export function NavChapter() {
  return (
    <SpecChapter
      id="nav"
      number="06"
      kicker="HDS · Hearst+ main navigation · Spec"
      title="Main navigation"
      lede={<p>This spec covers the Hearst+ header: the utility bar, the masthead, the section row, the compact nav that replaces it on scroll, the destination mega menu, the phone drawer and search. It gives each part&rsquo;s anatomy, sizes at each breakpoint, scroll behavior, keyboard and focus rules, and tokens. Values come from the component source and from measuring the running app.</p>}
      meta={[
        ["Doc", "HP-NAV-SPEC · Rev A · 2026-11-09"],
        ["Drawing", <><a href="/specs/nav-drawing.html" className={link}>HP-NAV-001</a> · 2 sheets</>],
        ["Source", <><code>utility-bar.tsx</code>, <code>home-page.tsx</code> (<code>MainNav</code>), <code>grid.tsx</code>, <code>globals.css</code></>],
        ["Measured", <>Playwright · Chromium · <code>/hearst-plus/</code> and a brand page · viewports 390, 640, 768, 1024, 1280, 1440 · light mode</>],
      ]}
      contents={[
        ["Film", "#nav-film"],
        ["Anatomy", "#nav-anatomy"],
        ["Breakpoints", "#nav-breakpoints"],
        ["Scroll behavior", "#nav-scroll"],
        ["Menus and overlays", "#nav-menus"],
        ["Keyboard and focus", "#nav-keyboard"],
        ["Tokens", "#nav-tokens"],
        ["Findings", "#nav-findings"],
      ]}
    >
      <SpecSection id="nav-film" kicker="06.0 · Walkthrough" title="How the header works" intro={<p>The film animates every behavior on a wireframe drawn from the measured geometry. It covers layout, the mega menu, scrolling at both sizes, breakpoints, the drawer, search and the layer order, and ends on the two drawing sheets.</p>}>
        <SpecFilm
          src="/specs/nav-film.mp4"
          poster="/specs/nav-film-poster.jpg"
          label="Main navigation film · 2:26 · no sound. Captions at the top of each scene say what is happening; dimensions use the drawing's codes."
          caption={<p><b className="text-foreground">Main navigation film · 2:26 · no sound.</b> Captions at the top of each scene say what is happening; dimensions use the drawing&rsquo;s codes. Pick a chapter to jump to it. <a href="/specs/nav-film.mp4" className={link}>Download the navigation film</a>.</p>}
          chapters={filmChapters}
        />
      </SpecSection>

      <SpecSection
        id="nav-anatomy"
        kicker="06.1 · Drawing HP-NAV-001 · Rev A · Sheet 1"
        title="Anatomy"
        intro={<p>The header has three bands. Only the utility bar stays on screen. The masthead scrolls away. The section row scrolls away from 768 and up, where a compact copy takes over; below 768 it sticks under the bar. The full drawing is in <a href="/specs/nav-drawing.html" className={link}>nav-drawing.html</a>.</p>}
      >
        <SpecSheet
          src="/specs/nav-drawing-sheet-1.jpg"
          width={1936}
          height={1208}
          href="/specs/nav-drawing.html"
          alt="Drawing sheet 1, structure: the header at 1280 and at 390 with dimensions, a breakpoint ruler, the exploded layer order, details of the destination pill, a section link and a header control, and variable tables."
        />
        <SpecColumns>
          <div className="space-y-8">
            <div>
              <SpecSubhead>1 · Utility bar</SpecSubhead>
              <ul>
                <li><b>Box</b>: <code>sticky top-0 z-50 h-8</code> (32 at every width), inside <code>PageContainer</code>.</li>
                <li><b>Grid</b>: <code>auto | minmax(0,1fr) | auto</code>, gap 8 (12 from 640). From 1280: <code>1fr | auto | 1fr</code>, so the pill centers on the page.</li>
                <li><b>Weather</b>: 72 wide (192 from 1024).</li>
                <li><b>Destination pill</b>: <code>rounded-full</code>, black at 10%. &ldquo;All&rdquo; sits outside the scroller; the other seven scroll inside the pill when it doesn&rsquo;t fit. A 1 × 16 divider sits before Local News. Links are 28 tall with 11 px text below 640, and 24 tall with 12 px text from 640; padding 4 / 8, gap 4. The active link is a white fill with semibold black text.</li>
                <li><b>Account</b>: hugs its label. &ldquo;Sign in / Sign up&rdquo; is 93 wide at 10 px below 640, and 116 at 12 px from 640. Signed in, it shows an avatar plus first name.</li>
              </ul>
            </div>
            <div>
              <SpecSubhead>2 · Masthead</SpecSubhead>
              <ul>
                <li><b>Banner</b> (Hearst+ and destinations): full-bleed art at its own ratio from 640 (W ÷ 11.54), and a 5:1 crop below 640. The lockup is centered. On the Hearst+ home the banner starts under the bar (<code>-mt-8 pt-8</code>).</li>
                <li><b>Logo row</b> (brand pages): <code>h-20 sm:h-24</code> (80 · 96) with the brand logo centered.</li>
                <li><b>Controls</b>: 12 below the bar on banners, vertically centered in the logo row. They are 44 × 44 below 640 and 28 × 28 from 640, radius 4, with a 14 icon. Left: the menu button (below 640) or the four layout toggles (from 640, gap 4). Right: theme and search, gap 8.</li>
              </ul>
            </div>
          </div>
          <div className="min-w-0 space-y-8">
            <div>
              <SpecSubhead>3 · Section row</SpecSubhead>
              <ul>
                <li><b>Box</b>: <code>py-1 md:py-2</code> plus a 1 px bottom border. 41 tall below 768, 39 from 768.</li>
                <li><b>Links</b>: 14 / 20 text, horizontal padding 2, gap 24. Each link is at least 32 tall below 768 and 22 from 768. Active: semibold, <code>--hp-section-title</code>, 2 px <code>border-primary</code> underline. On Hearst+ a 1 × 16 divider follows Videos.</li>
                <li><b>Below 768</b>: left-aligned and horizontally scrollable, with 24 px hatched fades on whichever side has more links.</li>
                <li><b>From 768</b>: hugs its links (739 on Hearst+) and is centered.</li>
              </ul>
            </div>
            <div className="space-y-3">
              <SpecSubhead>Measured header heights</SpecSubhead>
              <SpanTable caption="Measured header heights by viewport" headers={["Page", "390", "640", "768", "1024", "1280", "1440"]} rows={headerHeightRows} numeric={[1, 2, 3, 4, 5, 6]} />
              <SpecNote>Page gutters (<code>PageContainer</code>): 16 below 768, 24 from 768, 48 from 1280. Content stops at 1360 and centers.</SpecNote>
            </div>
          </div>
        </SpecColumns>
      </SpecSection>

      <SpecSection id="nav-breakpoints" kicker="06.2 · What changes where" title="Breakpoints">
        <SpanTable caption="What changes at each breakpoint" headers={["From", "Utility bar", "Masthead", "Section row", "Overlays"]} rows={breakpointRows} numeric={[0]} minWidth="48rem" />
      </SpecSection>

      <SpecSection id="nav-scroll" kicker="06.3 · Drawing HP-NAV-001 · Sheet 2" title="Scroll behavior">
        <SpecSheet
          src="/specs/nav-drawing-sheet-2.jpg"
          width={1936}
          height={1208}
          href="/specs/nav-drawing.html"
          alt="Drawing sheet 2, logic: the compact-nav hysteresis graph, the phone sticky row, mega menu placement, the phone drawer, the search dialog, section row scroll alignment, and threshold, menu, overlay and focus tables."
        />
        <SpecColumns columns={3}>
          <div>
            <SpecSubhead>768 and up · compact nav</SpecSubhead>
            <SpecNote className="mt-2">A second copy of the section row is <code>fixed top-8 z-40</code>. It turns on when <code>scrollY ≥ 96</code> and off when <code>scrollY ≤ 64</code>; between the two it keeps its state, so it never flickers. On: opacity 0 → 1 and translateY −8 → 0 over 250 ms, <code>cubic-bezier(.22,1,.36,1)</code>, and the original row is <code>invisible</code>. Off: <code>aria-hidden</code> and <code>inert</code>. Checked once per animation frame. Reduced motion: no transition.</SpecNote>
          </div>
          <div>
            <SpecSubhead>Below 768 · sticky row</SpecSubhead>
            <SpecNote className="mt-2">On destination pages the section row is <code>sticky top-8 z-30</code> and stops under the utility bar. There is no compact copy (it is <code>hidden</code> below md).</SpecNote>
          </div>
          <div>
            <SpecSubhead>Hearst+ home · bar fill</SpecSubhead>
            <SpecNote className="mt-2">The bar is transparent over the banner at <code>scrollY = 0</code> and fills with <code>--hp-utility-bar</code> as soon as <code>scrollY &gt; 0</code>, with a 200 ms color transition.</SpecNote>
          </div>
        </SpecColumns>
        <div className="space-y-2">
          <SpecSubhead>Keeping the active topic in view (below 768)</SpecSubhead>
          <SpecNote>On load, when the active topic changes and on resize, the row scrolls to <code>max(0, previous.left − 16)</code>. If the active link&rsquo;s end still falls past <code>scroll + width − 16</code>, it scrolls to <code>active.end − width + 16</code>. The fades show when <code>scrollLeft &gt; 1</code> (left) and <code>scrollLeft &lt; max − 1</code> (right). A wheel gesture that is mostly horizontal (<code>|dx| &gt; 1.15·|dy|</code>) is blocked, so trackpad swipes don&rsquo;t trigger browser back while the row holds its position.</SpecNote>
        </div>
      </SpecSection>

      <SpecSection id="nav-menus" kicker="06.4 · Mega menu · drawer · search" title="Menus and overlays">
        <SpecColumns>
          <div>
            <SpecSubhead>Destination mega menu</SpecSubhead>
            <ul>
              <li><b>Opens</b> when the pointer enters a destination link or keyboard focus lands on it. There is no caret. Click or Enter follows the link.</li>
              <li><b>Closes</b> when the pointer leaves the menu or the bar, on a press outside, on Escape, or when focus leaves the bar.</li>
              <li><b>Placement</b>: 8 below the bar (<code>top-full pt-2</code>). Width = <code>min(Wmax, bar − 24)</code>. Left = <code>clamp(trigger.left, 12, bar − width − 12)</code>.</li>
              <li><b>Wmax</b>: All and International 1152, Local News 1024, A&amp;E Family 672, each other destination 384.</li>
              <li><b>Surface</b>: <code>rounded-xl</code> (11.2), border, <code>shadow-2xl</code>, padding 16 (20 from 640). Max height <code>min(100dvh − 3rem, 680px)</code>, or <code>min(100dvh − 3.5rem, 720px)</code> from 640; scrolls inside.</li>
              <li><b>Layer</b>: <code>absolute z-60</code>, inside the bar&rsquo;s own z-50 layer.</li>
            </ul>
          </div>
          <div className="space-y-8">
            <div>
              <SpecSubhead>Phone drawer (below 640)</SpecSubhead>
              <ul>
                <li><b>Trigger</b>: the 44 menu button, on destination and brand pages that have brand filters.</li>
                <li><b>Surface</b>: a modal dialog portaled to <code>body</code>, <code>fixed inset-0 z-50</code>, black scrim at 45%. The panel is <code>min(91vw, 400px)</code> wide (355 at 390), on the left, full height. It appears without a transition.</li>
                <li><b>Contents</b>: an 80 header with a 44 Close button; Browse Hearst+ (2-column tiles, 44 tall, gap 8, radius 8); Browse brands; Continue Reading; Join Groups; a footer with the theme action (44).</li>
              </ul>
            </div>
            <div>
              <SpecSubhead>Search (every width)</SpecSubhead>
              <ul>
                <li>A modal dialog portaled to <code>body</code>, <code>fixed inset-0 z-50</code>, black scrim at 70% plus <code>backdrop-blur-sm</code>.</li>
                <li>The panel is inset 12 from each side and at most 672 wide, 64 from the top (96 from 640), with a 4 px <code>border-primary</code> top rule, radius 8 and max height <code>100dvh − 5rem</code>.</li>
              </ul>
            </div>
          </div>
        </SpecColumns>
      </SpecSection>

      <SpecSection id="nav-keyboard" kicker="06.5 · Accessibility" title="Keyboard and focus">
        <SpecTable caption="Keyboard and focus behavior by surface" headers={["Surface", "Open", "While open", "Close", "Focus returns to"]} rows={keyboardRows} codeFirst={false} minWidth="52rem" />
        <SpecTable caption="Target sizes" headers={["Target", "Below 640", "From 640", "Note"]} rows={targetRows} codeFirst={false} />
        <SpecNote>Landmarks: <code>nav aria-label=&quot;Hearst destination sections&quot;</code>, <code>nav aria-label=&quot;{"{Brand}"} sections&quot;</code>, the compact copy <code>&quot;{"{Brand}"} compact sections&quot;</code>, and the drawer&rsquo;s <code>&quot;Main navigation&quot;</code>. Active items use <code>aria-current=&quot;page&quot;</code>; filter buttons use <code>aria-pressed</code>.</SpecNote>
      </SpecSection>

      <SpecSection id="nav-tokens" kicker="06.6 · Color and type" title="Tokens">
        <SpanTable caption="Navigation color and type tokens" headers={["Part", "Light", "Dark / Videos"]} rows={tokenRows} minWidth="48rem" />
      </SpecSection>

      <SpecSection id="nav-findings" kicker="06.7 · For the design system team" title="Findings" intro={<p>These come from comparing the measurements with the component metadata and the rule documents. Nothing has been changed in code.</p>}>
        <div className="grid gap-4 lg:grid-cols-2">
          <div id="nav-f1" className="scroll-mt-28">
            <SpecFinding title="F1 · Doc drift · The utility bar is 32 tall on phones, not 44">
              <p><code>utility-bar.metadata.ts</code> says the mobile bar is 44 tall. The bar is <code>h-8 sm:h-8</code>, which measures 32 at 390, and its links are 28 tall. <b>Fix:</b> correct the caveat to &ldquo;32 bar, 28 links below 640&rdquo;, and drop the redundant <code>sm:h-8</code>.</p>
            </SpecFinding>
          </div>
          <div id="nav-f2" className="scroll-mt-28">
            <SpecFinding title="F2 · Needs a decision · Phone section links are 32 tall">
              <p>Section links have <code>min-h-8</code> (32) below 768, while masthead controls, drawer tiles and search controls are 44. The 24 px rule in APP_RULES covers utility controls only. <b>Option:</b> raise phone section links to <code>min-h-11</code>. The row would grow from 41 to 53 and the sticky header from 73 to 85.</p>
            </SpecFinding>
          </div>
          <div id="nav-f3" className="scroll-mt-28">
            <SpecFinding title="F3 · Layout · From 768 to 786 the section row runs into the gutters">
              <p>From 768 the row stops scrolling (<code>md:flex-none md:justify-center</code>) and hugs its 739 px of links. At 768 the container&rsquo;s inner width is 720, so the row sits 9.5 px into each 24 px gutter (measured x = 14.5). It fits from 787. A longer brand nav would spill further, and with no fades and no scroll a link could be cut off. <b>Fix:</b> keep <code>overflow-x-auto</code> and <code>min-w-0</code> from md, and center only when the links fit (for example <code>justify-content: safe center</code>).</p>
            </SpecFinding>
          </div>
          <div id="nav-f4" className="scroll-mt-28">
            <SpecFinding title="F4 · Doc drift · The home bar's navy doesn't match STYLE.md">
              <p>STYLE.md says the bar fills with <code>#012247</code>. <code>--hp-utility-bar</code> points to <code>--palette-alert-info-1000</code>, which renders as <code>rgb(3 17 43)</code> (#03112B). <b>Fix:</b> decide which value is right, then update either the token or STYLE.md.</p>
            </SpecFinding>
          </div>
          <div id="nav-f5" className="scroll-mt-28">
            <SpecFinding title="F5 · Doc drift · Weather is in the utility bar, not the masthead">
              <p>APP_RULES says the masthead&rsquo;s left slot shows local weather on tablet and desktop. In the app, weather is the utility bar&rsquo;s left cell (72, then 192 from 1024), and from 640 the masthead&rsquo;s left slot holds the layout toggle. <b>Fix:</b> update the APP_RULES line.</p>
            </SpecFinding>
          </div>
        </div>
      </SpecSection>
    </SpecChapter>
  );
}
