import { Col, ColGroup, FindingList, NumberedList, SmallNote, TaggedFinding } from "@/components/specs/chapters/chapter-parts";
import { SpecChapter, SpecColumns, SpecFilm, SpecSection, SpecSheet, SpecTable } from "@/components/specs/spec-kit";

/** Featured story carousel spec (HP-CAR-SPEC · Rev A · 2026-11-11), converted from public/specs/carousel-spec.html. */

/**
 * A measured card color with an "Aa" sample in its text color. The hex values
 * are the documented output of getFeaturedCardColors, shown as data, not new
 * design colors.
 */
function CardSwatch({ card, text }: { card: string; text: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className="inline-block h-[22px] w-10 rounded-[4px] border border-border text-center text-[11px] font-bold leading-[20px]" style={{ background: card, color: text }}>
        Aa
      </span>
      <code>{card.toUpperCase()}</code>
    </span>
  );
}

const cardColors = [
  ["Hearst+ home", "Index", "Brand-wall banner", "#00142b", "#FFFFFF"],
  ["Lifestyle index", "Index", "Section banner", "#a62c37", "#FFFFFF"],
  ["Autos index", "Index", "Section banner", "#34454c", "#FFFFFF"],
  ["Fashion & Luxury index", "Index", "Section banner", "#0d1014", "#FFFFFF"],
  ["Enthusiast & Wellness index", "Index", "Section banner, darkened from #819238", "#5f6b29", "#FFFFFF"],
  ["Cosmopolitan", "Brand", "Brand bar color", "#d70000", "#FFFFFF"],
  ["Men’s Health", "Brand", "Brand bar color", "#d2232e", "#FFFFFF"],
  ["Car and Driver", "Brand", "Brand bar color", "#121212", "#FFFFFF"],
  ["ELLE", "Brand", "Brand bar color", "#000000", "#FFFFFF"],
  ["MotorTrend", "Brand", "Supplemental profile, darkened from #e90c17", "#ce0b14", "#FFFFFF"],
  ["Esquire", "Brand", "Brand bar color with its own on-brand text", "#ff3a30", "#121212"],
  ["Good Housekeeping", "Brand", "Light brand color, dark text", "#53c2be", "#121212"],
  ["Autoweek", "Brand", "Light brand color, dark text", "#ffc84e", "#121212"],
] as const;

const cardColorRows = cardColors.map(([page, context, source, card, text]) => [
  page,
  context,
  source,
  <CardSwatch key="card" card={card} text={text} />,
  <code key="text">{text}</code>,
]);

const sizeRows = [
  ["390", "358 × 399", "215", "346 × 224", "24 / 28 · 3 lines", "Pause 44"],
  ["640", "608 × 557", "365", "572 × 240", "24 / 28 · 2 lines", "3 × 28"],
  ["768", "404 × 434", "242", "368 × 240", "32 / 36 · 3 lines", "3 × 28"],
  ["1024", "660 × 588", "396", "624 × 240", "32 / 36 · 2 lines", "3 × 28"],
  ["1280", "552 × 523", "331", "516 × 240", "32 / 36 · 2 lines", "3 × 28"],
  ["1440", "632 × 571", "379", "596 × 240", "32 / 36 · 2 lines", "3 × 28"],
] as const;

const inputRows = [
  ["Autoplay", "One slide every 6.5 s. The timer restarts on every slide change."],
  ["Pauses while", "The pointer is over the carousel, or a finger is down."],
  ["Pauses until Resume", "Focus enters the carousel (except on the Pause button itself), or the reader presses Pause."],
  ["Never plays", "Reduced motion; the button is disabled and says why."],
  ["Swipe (Today’s Picks only)", <>Horizontal only (<code>|dx| &gt; 1.2 × |dy|</code>, <code>touch-pan-y</code>). The slide follows up to 24% of its width. It moves on past <code>min(64, 14% of W)</code>, or on a flick of 24 px at 0.45 px/ms or faster. The click after a swipe is suppressed.</>],
  ["Trackpad", "Horizontal wheel deltas add up; 55 moves one slide, then input locks for 520 ms. A pause longer than 180 ms or a change of direction resets the sum."],
] as const;

const keyboardRows = [
  ["Tab order", "Active slide only: Open story (a full-slide button), Comments, then Previous, Pause, Next."],
  ["Other slides", <><code>aria-hidden</code> and <code>inert</code>, so they are skipped and not announced.</>],
  ["Status", "A live region reads “Story N of 5: title”. It is polite while paused or with reduced motion, and off while rotating."],
  ["Help text", "Screen readers hear: use the previous and next buttons (or swipe) to move between stories."],
  ["Arrow keys", "Not handled. Keyboard users move with Previous and Next."],
] as const;

const cardColorLink = <a href="#carousel-card-color" className="font-semibold text-foreground underline underline-offset-4">Text card color</a>;

const tokenRows = [
  ["Text card", <><code>cardColors</code> from <code>getFeaturedCardColors</code> (see {cardColorLink})</>, "#00142B home · #A62C37 Lifestyle · #34454C Autos · #0D1014 Flux · #5F6B29 E&W"],
  ["Summary", <code key="c">text-white/85</code>, "white 85%"],
  ["Pill and controls", <><code>bg-black/45</code> + blur</>, "black 45%"],
  ["Headline", <><code>--font-headline</code>, 800</>, "Schibsted Grotesk on Hearst+"],
  ["Focus", <><code>--primary</code> at 30% (slide), brand ring (comments)</>, "per brand"],
  ["Card shadow", "inline", "0 6 18 rgba(0,0,0,.2)"],
] as const;

export function CarouselChapter() {
  return (
    <SpecChapter
      id="carousel"
      number="08"
      kicker="HDS · Hearst+ featured story carousel · Spec"
      title="Featured story carousel"
      lede={<p>This spec covers the lead carousel used for Today’s Picks and for Featured stories on destinations and publications: the photo, the overlapping text card, the controls, the looping track, the parallax, autoplay, swipe, focus and the list layout. Values come from the component source and from measuring the running app.</p>}
      meta={[
        ["Doc", "HP-CAR-SPEC · Rev A · 2026-11-11"],
        ["Drawing", <><a href="/specs/carousel-drawing.html" className="underline underline-offset-4">HP-CAR-001</a> · 2 sheets</>],
        ["Source", <><code>featured-story-carousel.tsx</code>, <code>featured-story-carousel.metadata.ts</code>, <code>home-page.tsx</code>, <code>globals.css</code></>],
        ["Measured", <>Playwright · Chromium · <code>/hearst-plus/</code> and <code>/hearst-plus/full-width-hero/</code> · viewports 390, 640, 768, 1024, 1280, 1440 · light mode</>],
      ]}
      contents={[
        ["Film", "#carousel-film"],
        ["Anatomy", "#carousel-anatomy"],
        ["Card color", "#carousel-card-color"],
        ["Sizes", "#carousel-sizes"],
        ["Motion", "#carousel-motion"],
        ["Swipe and autoplay", "#carousel-input"],
        ["Keyboard and focus", "#carousel-keyboard"],
        ["Tokens", "#carousel-tokens"],
        ["Findings", "#carousel-findings"],
      ]}
    >
      <SpecSection id="carousel-film" kicker="08.0 · Walkthrough" title="How the carousel works" intro={<p>The film animates the carousel on a wireframe drawn from the measured geometry: its parts and sizes, the looping track, the parallax at a tenth of the speed, swipe, what pauses autoplay, focus, the list layout and one finding. It ends on the two drawing sheets.</p>}>
        <SpecFilm
          src="/specs/carousel-film.mp4"
          poster="/specs/carousel-film-poster.jpg"
          label="Featured story carousel film · 1:50 · no sound."
          caption={<p><b className="text-foreground">Featured story carousel film · 1:50 · no sound.</b> Captions at the top of each scene say what is happening; dimensions use the drawing&apos;s codes. Pick a chapter to jump to it.</p>}
          chapters={[
            [0, "The module: photo, card, controls"],
            [10, "Sizes at 640+ and on phones"],
            [22, "The track, autoplay and the loop"],
            [36, "Parallax, slowed down"],
            [48, "Swipe and trackpad"],
            [60, "What pauses autoplay"],
            [72, "Focus order and hidden slides"],
            [82, "List layout"],
            [90, "Finding: full-width hero"],
            [98, "The drawing sheets"],
          ]}
        />
      </SpecSection>

      <SpecSection id="carousel-anatomy" kicker="08.1 · Drawing HP-CAR-001 · Rev A · Sheet 1" title="Anatomy" intro={<p>One <code>article</code> with <code>aria-roledescription=&quot;carousel&quot;</code>, labelled with the edition (“Today’s Picks”) or “Featured stories”. It fills its column. The full drawing is in <a href="/specs/carousel-drawing.html" className="font-semibold text-foreground underline underline-offset-4">carousel-drawing.html</a>.</p>}>
        <SpecSheet
          src="/specs/carousel-drawing-sheet-1.jpg"
          width={1936}
          height={1209}
          href="/specs/carousel-drawing.html"
          alt="Drawing sheet 1, structure: the slide at 1440 and at 390 with dimensions, the list layout, details of the controls and the card text, and variable tables."
        />
        <SpecColumns>
          <Col>
            <ColGroup title="1 · Photo">
              <ul>
                <li><code>aspect-[5/3]</code>, radius 8, fills the slide. The image sits in a layer 110% wide starting at −5%, which carries the parallax.</li>
                <li>Hover zooms the image to 1.025 over 250 ms (off with reduced motion).</li>
              </ul>
            </ColGroup>
            <ColGroup title="2 · Text card">
              <ul>
                <li>Its color follows the page: the section banner on a section index, the brand color on a brand index (see {cardColorLink}). White or dark text, radius 8, shadow <code>0 6 18 rgba(0,0,0,.2)</code>.</li>
                <li>Inset 6 from each side (18 from 640), pulled up over the photo by 40 (48 from 640), fixed height 224 (240 from 640), padding 10 / 20 (12 / 24 from 640).</li>
                <li><b>Meta row</b>: brand icon 20, brand name bold, optional Video badge, and a comments button (min height 32), 14 / 20 semibold, 6 above the headline.</li>
                <li><b>Headline</b>: T2, 24 / 28 (32 / 36 from 768), 800, clamp 3, max <code>min(672, 100%)</code>. Car stories add a research rating on the right.</li>
                <li><b>Summary</b>: 14 / 17.7 (16 / 20.2 from 640), white at 85%, clamp 2, 12 below the headline.</li>
              </ul>
            </ColGroup>
          </Col>
          <Col>
            <ColGroup title="3 · Controls">
              <ul>
                <li>Top 20, inset 20, over the photo.</li>
                <li><b>Edition pill</b>: 24 tall, padding 4 / 10, 12 / 16 bold, black at 45% with blur. “Today’s Picks · 1 of 5”.</li>
                <li><b>Previous · Pause · Next</b>: round, 28, 6 apart, black at 45%, from 640. Below 640 only Pause shows, at 44.</li>
              </ul>
            </ColGroup>
            <ColGroup title="4 · Track">
              <ul>
                <li>Five stories plus a clone at each end (seven slides). The track moves by 100% per slide; the bottom padding of 24 leaves room for the card shadow.</li>
                <li>Only the active slide is operable; the others and the clones are <code>aria-hidden</code> and <code>inert</code>.</li>
              </ul>
            </ColGroup>
            <ColGroup title="5 · List layout">
              <ul>
                <li>In the river’s list mode each slide is a row on a card surface: <code>112 | 1fr</code>, 184 tall; from 640 <code>38% | 1fr</code>, 220 tall. Headline T3, clamp 3. The controls sit beside the photo.</li>
              </ul>
            </ColGroup>
          </Col>
        </SpecColumns>
      </SpecSection>

      <SpecSection id="carousel-card-color" kicker="08.1b · Context" title="Text card color" intro={<p>The text card has no fixed color. It inherits the color of the page it sits on, with the same logic as the masthead banners: on a section index it takes that section’s banner color, and on a brand’s index page it takes that brand’s color. So the same story card is red on the Lifestyle index, slate on Autos, and Esquire red on the Esquire page.</p>}>
        <SpecColumns>
          <Col>
            <ColGroup title="Where the color comes from">
              <NumberedList>
                <li><b>Brand index page</b> (<code>/lifestyle/cosmopolitan/</code>, <code>/autos/motortrend/</code> …): the brand’s bar color, <code>palette-background-utility</code> from its tokens. Brands outside the token set (MotorTrend, Bring a Trailer, HOT ROD) use their <code>supplementalBrandProfiles</code> primary.</li>
                <li><b>Section index</b> (Lifestyle, Autos, Fashion &amp; Luxury, Enthusiast &amp; Wellness): that section’s banner <code>background</code> in <code>destinationBanners</code>.</li>
                <li><b>Hearst+ home</b>: the brand-wall banner navy, <code>hearstPlusBrandWallBanner</code>.</li>
                <li><b>Anywhere else</b> (Newspapers, Hearst TV, A&amp;E channel pages): black, the component default.</li>
              </NumberedList>
            </ColGroup>
          </Col>
          <Col>
            <ColGroup title="Keeping the text readable">
              <ul>
                <li>If the brand’s own on-brand text color (<code>palette-content-default-link</code>) reaches 4.5:1 on its color, use it. Esquire gets black on its red.</li>
                <li>If the color is light (white text below 3:1) and <code>#121212</code> reaches 5.5:1, keep the color and use dark text (Good Housekeeping, Autoweek).</li>
                <li>Otherwise use white text and darken the color just enough for 5.5:1 (Enthusiast &amp; Wellness, MotorTrend).</li>
                <li>On brand pages the brand icon sits on a small white tile, so a red icon stays visible on a red card.</li>
              </ul>
            </ColGroup>
            <SmallNote>Source: <code>getFeaturedCardColors(destination, brandSlug)</code> in <code>src/lib/brand-banners.ts</code>, passed to the carousel as <code>cardColors</code>. The list layout keeps the card surface.</SmallNote>
          </Col>
        </SpecColumns>
        <SpecTable caption="Text card color by page" headers={["Page", "Context", "Source", "Card", "Text"]} rows={cardColorRows} codeFirst={false} minWidth="48rem" />
      </SpecSection>

      <SpecSection id="carousel-sizes" kicker="08.2 · Measured on the Hearst+ home" title="Sizes">
        <SpecTable caption="Featured story carousel sizes by viewport" headers={["Viewport", "Slide (W × H)", "Photo", "Card", "Headline", "Controls"]} rows={sizeRows} codeFirst={false} numeric={[0, 2]} />
        <SmallNote>The slide width comes from the page grid. At 768 the home river puts the carousel in a 404 column, which is why it is narrower there than at 640.</SmallNote>
      </SpecSection>

      <SpecSection id="carousel-motion" kicker="08.3 · Drawing HP-CAR-001 · Sheet 2" title="Motion">
        <SpecSheet
          src="/specs/carousel-drawing-sheet-2.jpg"
          width={1936}
          height={1208}
          href="/specs/carousel-drawing.html"
          alt="Drawing sheet 2, logic: the looping track with clones, parallax timing, what pauses autoplay, swipe thresholds, semantics and focus, the full-width hero finding and thresholds."
        />
        <SpecColumns>
          <Col>
            <ColGroup title="One step">
              <ul>
                <li>The track translates in 300 ms with <code>cubic-bezier(.2, 0, 0, 1)</code>.</li>
                <li>The <b>card</b> moves with the track and is offset by 10 px per slide of distance, so it leads.</li>
                <li>The <b>photo</b> layer starts 16 ms late and runs 284 ms, shifted against the motion by 8% of the slide (7.27% of its 110% layer). During a drag it moves 8% of the drag the other way.</li>
              </ul>
            </ColGroup>
          </Col>
          <Col>
            <ColGroup title="The loop">
              <ul>
                <li>Next from story 5 slides onto the clone of story 1. When the transition ends the track snaps to the real story 1 with the transition off, and turns it back on two frames later. Previous from story 1 does the same through the clone of story 5.</li>
                <li><b>Reduced motion</b>: no transitions, no parallax, no autoplay, no hover zoom.</li>
              </ul>
            </ColGroup>
          </Col>
        </SpecColumns>
      </SpecSection>

      <SpecSection id="carousel-input" kicker="08.4 · Input" title="Swipe and autoplay">
        <SpecTable caption="Featured story carousel swipe and autoplay rules" headers={["Rule", "Value"]} rows={inputRows} codeFirst={false} />
      </SpecSection>

      <SpecSection id="carousel-keyboard" kicker="08.5 · Accessibility" title="Keyboard and focus">
        <SpecTable caption="Featured story carousel keyboard and focus" headers={["Part", "Behavior"]} rows={keyboardRows} codeFirst={false} />
      </SpecSection>

      <SpecSection id="carousel-tokens" kicker="08.6 · Tokens" title="Tokens">
        <SpecTable caption="Featured story carousel tokens" headers={["Part", "Token", "Rendered"]} rows={tokenRows} codeFirst={false} />
      </SpecSection>

      <SpecSection id="carousel-findings" kicker="08.7 · For the design system team" title="Findings" intro={<p>These come from comparing the measurements with the source and the metadata. Nothing has been changed in code.</p>}>
        <FindingList>
          <TaggedFinding id="carousel-f1" tag="F1 · BUG" title="The full-width hero headline overflows on phones">
            <p>With <code>scrimDirection=&quot;left-to-right&quot;</code> (the full-width hero layout) the headline keeps a 33% max width and loses its line clamp. That rule was for text over the photo; the text now sits in its own card. At 390 the headline is 102 wide, breaks words in the middle (“Collabo-ration”) and its 272 px of content overflows the 224 card. At 1024 it is 297 wide and four lines. <b>Fix:</b> drop the 33% cap and keep <code>line-clamp-3</code>, or apply the cap only from 1024.</p>
          </TaggedFinding>
          <TaggedFinding id="carousel-f2" tag="F2 · PHONE" title="“Latest available” loses swipe, and phones lose every manual control">
            <p>Swipe is on only when the label is exactly “Today’s Picks”. When the feed falls back to “Latest available”, or on Featured stories, swipe is off. Below 640 Previous and Next are hidden, so a phone reader can only wait for autoplay or pause it. <b>Fix:</b> enable swipe for every edition, or show Previous and Next at 44 on phones.</p>
          </TaggedFinding>
          <TaggedFinding id="carousel-f3" tag="F3 · DOC DRIFT" title="The metadata lists scrim tokens the carousel no longer uses">
            <p><code>featured-story-carousel.metadata.ts</code> lists <code>--hp-image-scrim-soft</code>, <code>-strong</code> and <code>-solid</code>. The component no longer draws a scrim; the text sits in a black card, and <code>scrimDirection</code> only changes the headline width (see F1). <b>Fix:</b> update the metadata, and rename or remove the prop.</p>
          </TaggedFinding>
        </FindingList>
      </SpecSection>
    </SpecChapter>
  );
}
