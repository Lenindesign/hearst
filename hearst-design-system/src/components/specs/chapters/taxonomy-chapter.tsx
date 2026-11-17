import { Col, ColGroup, NumberedList, SmallNote } from "@/components/specs/chapters/chapter-parts";
import {
  brandFamilies,
  familyHomeCohort,
  getProposedBrandFamily,
  getProposedInterest,
  readerInterests,
  taxonomyStories,
} from "@/components/specs/chapters/taxonomy-data";
import { SpecChapter, SpecColumns, SpecFilm, SpecFinding, SpecProse, SpecSection, SpecSheet, SpecTable } from "@/components/specs/spec-kit";
import { LiveViewport } from "@/components/specs/live/live-kit";
import {
  getHearstAllBrands,
  getHearstBrandRoute,
  getHearstDestinationRoute,
  getHearstSectionBrands,
  hearstDestinationCategoryLabels,
  hearstReaderSectionLabels,
  hearstReaderSections,
} from "@/lib/hearst-routes";

/**
 * Reader taxonomy proposal (HP-TAX-PROP · Draft · 2026-11-17). The current
 * taxonomy is read from the production route registry, and every story count
 * from the validated feed snapshots, when the page is built.
 */
function countBy<T>(items: readonly T[], key: (item: T) => string | undefined) {
  return items.reduce<Record<string, number>>((counts, item) => {
    const value = key(item);
    if (value) counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function topTopics(brandSlug: string, limit = 3) {
  const counts = countBy(
    taxonomyStories.filter((story) => story.brandSlug === brandSlug),
    (story) => story.topic,
  );
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([topic, count]) => `${topic} ${count}`)
    .join(" · ");
}

const currentRows = hearstReaderSections.map(({ mode, label }) => [
  label,
  <code key="route">{getHearstDestinationRoute(mode)}</code>,
  getHearstSectionBrands(mode).length,
  hearstDestinationCategoryLabels[mode].filter((category) => category !== "For You" && category !== "Saved").join(", "),
]);

const brandRows = hearstReaderSections.flatMap(({ mode, label }) =>
  getHearstSectionBrands(mode).map(({ brand, brandSlug }) => {
    const family = getProposedBrandFamily(brandSlug);
    const moves = family ? familyHomeCohort[family.id] !== mode : false;
    return [
      brand,
      label,
      <code key="route">{getHearstBrandRoute(brandSlug)}</code>,
      topTopics(brandSlug) || "No stories in today's snapshot",
      family ? (moves ? <b key="family">{family.label} (moves)</b> : family.label) : "—",
    ];
  }),
);

const familyRows = brandFamilies.map((family) => {
  const names = family.brands.map(
    (slug) => getHearstAllBrands().find((brand) => brand.brandSlug === slug)?.brand ?? slug,
  );
  return [family.label, names.join(", "), family.categories, family.theme];
});

const interestCounts = countBy(taxonomyStories, (story) => getProposedInterest(story));
const interestBrandCounts = (interest: string) => {
  const counts = countBy(
    taxonomyStories.filter((story) => getProposedInterest(story) === interest),
    (story) => story.brand,
  );
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([brand, count]) => `${brand} ${count}`)
    .join(" · ");
};
const unmappedCount = taxonomyStories.filter((story) => !getProposedInterest(story)).length;

const interestRows = readerInterests.map(({ label, route, theme }) => [
  label,
  <code key="route">{route}</code>,
  interestCounts[label] ?? 0,
  interestBrandCounts(label),
  theme,
]);

const link = "underline underline-offset-4";

/** Start of each beat in the chapter film (public/specs/taxonomy-film.mp4), in seconds. */
const filmChapters = [
  [0, "The layer stack"],
  [11, "Today: four cohort names"],
  [17, "The reader masthead"],
  [22, "Regroup: 29 brands"],
  [35, "Eight interests"],
  [46, "Three lookups and the topic map"],
  [57, "Routes and phases"],
  [68, "The drawing sheets"],
] as const;

const surfaceRows = [
  ["Utility bar switcher and brand menus", <><code>utility-bar.tsx</code> (labels hard-coded in three places)</>, "One tab per group; brands listed by group"],
  ["Phone menu: Browse Hearst+ and Browse brands", <><code>home-page.tsx</code></>, <><code>hearstReaderSections</code>, brands grouped by group</>],
  ["Reader masthead carousel", <><code>home-page.tsx</code>, Storybook <code>HearstPlusContentReaderMasthead</code></>, "One item per group; lockup tinted with the group color"],
  ["Destination banners and lockups", <><code>logos.ts</code>, <code>BRAND_STYLES.md</code></>, "Live-text descriptor, so a rename is cheap. The compact phone signatures for Fashion & Luxury and E&W have the name baked into the SVG"],
  ["Themes and headline faces", <><code>theme-options.ts</code>, typography design doc</>, "Each group has its own palette and headline face"],
  ["Routes", <><code>/hearst-{"{mode}"}/{"{category}"}/</code>, <code>/{"{prefix}"}/{"{brand}"}/</code></>, <>The group prefix is in every brand URL. <code>/brands/{"{slug}"}/</code> already exists as a redirect shim</>],
  ["Category filter", <code key="c">story-feed-filter.ts</code>, <>Matches <code>story.topic</code>, and also matches the group <b>label strings</b></>],
  ["Onboarding interests", <code key="c">onboarding-modal.tsx</code>, <>Leaves out the group names by <b>matching strings</b></>],
  ["Feeds and video", <>four <code>*-river-data.ts</code> files, <code>hearst-video-feed.ts</code></>, "Inventory stored per group. The video lists already put Cosmopolitan and Seventeen under Fashion & Luxury and Prevention under E&W"],
  ["Ads", <><code>selectContentReaderAdvertisement()</code></>, <>Ad inventory keyed by <code>getHearstBrandSection()</code>, the cohort</>],
  ["Analytics", <code key="c">product-analytics.ts</code>, <>Every event carries <code>destination</code> = group mode</>],
  ["Other", <><code>social-graph-config.ts</code>, Events filter, personalization defaults, OG images, spec chapters</>, "Labels and colors per group"],
] as const;

const comparisonRows = [
  ["Reader clarity", "Better names, still brand-first", "Best", "Best"],
  ["Fits PRODUCT.md (interests before brands)", "Partly", "Yes", "Yes"],
  ["Keeps destination themes and type", "Yes", "No, or ad hoc", "Yes, borrowed by interest"],
  ["Ad cohorts", "Seven brands differ from their cohort; needs a map", "Fully separate", "Fully separate, cohort unchanged"],
  ["URL churn", "Group routes and moved brands", "All group routes", "All group routes, once"],
  ["New data work", "None", "Topic normalization", "Topic normalization and a theme map"],
  ["Build effort", "Small", "Large", "Large, ships in phases"],
] as const;

export function TaxonomyChapter() {
  return (
    <SpecChapter
      id="taxonomy"
      number="10"
      kicker="HDS · Hearst+ reader taxonomy · Proposal"
      title="Reader taxonomy"
      lede={
        <p>
          Hearst+ groups its publications into four destinations named after internal sales cohorts: {Object.values(hearstReaderSectionLabels).join(", ")}. Those names work for ads and measurement, not for readers. This chapter maps where the taxonomy lives, what each brand actually publishes, and compares three reader-facing alternatives. It is a proposal: nothing here is implemented.
        </p>
      }
      meta={[
        ["Doc", "HP-TAX-PROP · Draft · 2026-11-17"],
        ["Status", <b key="status">Proposal for owner review. App code, routes and vault rules are unchanged.</b>],
        ["Source", <><code>hearst-routes.ts</code>, the four feed snapshots, <code>taxonomy-data.ts</code> (proposal only)</>],
        ["Drawing", <><a href="/specs/taxonomy-drawing.html" className={link}>HP-TAX-001</a> · 2 sheets</>],
        ["Counts", <>{taxonomyStories.length} stories in today&rsquo;s validated snapshot, read when the page is built</>],
      ]}
      contents={[
        ["Live reference", "#taxonomy-live"],
        ["Film", "#taxonomy-film"],
        ["Drawing", "#taxonomy-drawing"],
        ["Where it lives", "#taxonomy-surfaces"],
        ["Brands today", "#taxonomy-brands"],
        ["Option A", "#taxonomy-option-a"],
        ["Option B", "#taxonomy-option-b"],
        ["Option C", "#taxonomy-option-c"],
        ["Comparison", "#taxonomy-comparison"],
        ["Recommendation", "#taxonomy-recommendation"],
        ["Open questions", "#taxonomy-questions"],
      ]}
    >
      <SpecSection
        id="taxonomy-live"
        kicker="10 · Live reference"
        title="Today's taxonomy, as readers see it."
        intro={<p>The production Hearst+ home. The utility bar carries the four cohort names; hover one to see its brand menu. The table below is read from the production route registry.</p>}
      >
        <LiveViewport
          src="/hearst-plus/"
          title="Hearst+ home with the current destination switcher"
          widths={[{ width: 390, label: "390 phone" }, { width: 1280, label: "1280 xl" }]}
          defaultWidth={1280}
          height={420}
        />
        <SpecTable
          caption="Current destinations from hearst-routes.ts"
          headers={["Destination", "Route", "Brands", "Category row"]}
          rows={currentRows}
          numeric={[2]}
          codeFirst={false}
        />
      </SpecSection>

      <SpecSection id="taxonomy-film" kicker="10.0 · Walkthrough" title="How the proposal works" intro={<p>The film builds the layer stack, shows today&rsquo;s cohort names in the utility bar and masthead, moves the 29 brands into five families, grows the eight interests from today&rsquo;s counts, then follows a story through the three lookups, the route migration and the phases. It ends on the two drawing sheets.</p>}>
        <SpecFilm
          src="/specs/taxonomy-film.mp4"
          poster="/specs/taxonomy-film-poster.jpg"
          label="Reader taxonomy film · 1:21 · no sound. Captions at the top of each scene say what is happening; codes match the drawing."
          caption={<p><b className="text-foreground">Reader taxonomy film · 1:21 · no sound.</b> A proposal, so it is not part of the combined film at the top of the page. Pick a chapter to jump to it. <a href="/specs/taxonomy-film.mp4" className={link}>Download the taxonomy film</a>.</p>}
          chapters={filmChapters}
        />
      </SpecSection>

      <SpecSection
        id="taxonomy-drawing"
        kicker="10.0 · Drawing HP-TAX-001 · Draft · Sheets 1–2"
        title="The drawing"
        intro={<p>Sheet 1 is the structure: the exploded layer stack, the utility bar now and proposed, the masthead descriptor and the cohort-to-family regroup matrix. Sheet 2 is the logic: the three lookups, the topic map, route migration, the phases and the open decisions. The full drawing with its notes is in <a href="/specs/taxonomy-drawing.html" className={link}>taxonomy-drawing.html</a>.</p>}
      >
        <SpecSheet
          src="/specs/taxonomy-drawing-sheet-1.jpg"
          width={1936}
          height={1232}
          href="/specs/taxonomy-drawing.html"
          alt="Drawing sheet 1, structure: the exploded stack from stories and hidden cohorts up to brands, families, interests and reader surfaces; the utility bar with four cohort slots and with eight interest slots; the masthead lockup with its live-text descriptor; the matrix of four cohorts by five families with the five brands that move; and count tables."
        />
        <SpecSheet
          src="/specs/taxonomy-drawing-sheet-2.jpg"
          width={1936}
          height={1232}
          href="/specs/taxonomy-drawing.html"
          alt="Drawing sheet 2, logic: a story feeding three lookups (cohort to ads, analytics and ingestion; interest to the utility bar, masthead and onboarding; family to the brand directory and theme); the topic map with the autos rule; the route migration table; the three phases with the option A stop line; and tables comparing the options, listing open decisions and theme borrowing."
        />
      </SpecSection>

      <SpecSection
        id="taxonomy-surfaces"
        kicker="10.1 · Inventory"
        title="Where the taxonomy lives"
        intro={<p>Everything starts from <code>getHearstBrandSection()</code> in <code>hearst-routes.ts</code>. That one function answers two different questions: which brands a reader browses together, and which ad cohort a brand belongs to.</p>}
      >
        <SpecTable caption="Surfaces that depend on the four destinations" headers={["Surface", "Where", "Dependency"]} rows={surfaceRows} codeFirst={false} />
        <SpecFinding title="First step for any option: split the two layers">
          <p>Keep <code>getHearstBrandSection()</code> as the hidden cohort for ads, ingestion and the analytics <code>destination</code> field, and add a separate reader-facing grouping. The feed filter and onboarding match label strings, so even a rename must switch them to match on the mode key.</p>
        </SpecFinding>
      </SpecSection>

      <SpecSection
        id="taxonomy-brands"
        kicker="10.2 · Inventory"
        title="What each brand publishes"
        intro={<p>Top feed topics per brand in today&rsquo;s snapshot, with the Option A family each brand would join. <b className="text-foreground">Moves</b> marks brands whose reader family differs from their sales cohort.</p>}
      >
        <SpecTable
          caption="Brands, current destination, top topics and proposed family"
          headers={["Brand", "Destination today", "Brand route", "Top topics (stories)", "Option A family"]}
          rows={brandRows}
          codeFirst={false}
          minWidth="56rem"
        />
        <SmallNote>Local News and A&amp;E Family sit outside the four destinations and are not affected by any option. Topic strings come from each brand&rsquo;s feed (&ldquo;Gear&rdquo;, &ldquo;Life&rdquo;, &ldquo;What To Buy&rdquo;), so an interest layer needs a normalization map.</SmallNote>
      </SpecSection>

      <SpecSection
        id="taxonomy-option-a"
        kicker="10.3 · Option A"
        title="Rename and regroup: five reader families"
        intro={<p>Keep the structure (a group is a route, a theme and a brand menu) and fix the names and the misfiled brands. Each brand sits in one family.</p>}
      >
        <SpecTable caption="Option A families" headers={["Family", "Brands", "Category row", "Theme it inherits"]} rows={familyRows} codeFirst={false} minWidth="52rem" />
        <SpecColumns>
          <Col>
            <ColGroup title="How it reads">
              <ul>
                <li><b>Nav</b>: All · Home &amp; Food · Style &amp; Culture · Health &amp; Fitness · Cars · Tech &amp; Gear · Local News</li>
                <li><b>URLs</b>: <code>/hearst-plus/home-and-food/</code>; brand pages move to <code>/brands/{"{slug}"}/</code>, so a brand can change family without changing its URL</li>
                <li><b>Reader masthead</b>: HEARST+ | Style &amp; Culture, tinted with the family color</li>
              </ul>
            </ColGroup>
          </Col>
          <Col>
            <ColGroup title="What breaks">
              <ul>
                <li>Redirects for every old group route and moved brand</li>
                <li>New art or live text for the compact phone signatures</li>
                <li>A fifth theme for Tech &amp; Gear, or fold it into Health &amp; Fitness</li>
                <li>Still brand-first: &ldquo;dinner&rdquo; or &ldquo;fall fashion&rdquo; still means guessing a group</li>
              </ul>
            </ColGroup>
          </Col>
        </SpecColumns>
      </SpecSection>

      <SpecSection
        id="taxonomy-option-b"
        kicker="10.4 · Option B"
        title="Interest sections: topics replace groups"
        intro={<p>Sections become cross-brand story filters on normalized topics. A brand shows up wherever it publishes, so Good Housekeeping appears under Food, Home and Shopping. Counts use the proposal&rsquo;s topic map on today&rsquo;s snapshot.</p>}
      >
        <SpecTable
          caption="Option B interests with story counts"
          headers={["Interest", "Route", "Stories", "Top sources (stories)", "Theme in Option C"]}
          rows={interestRows}
          numeric={[2]}
          codeFirst={false}
          minWidth="56rem"
        />
        {unmappedCount > 0 ? <SmallNote>{unmappedCount} stories have a topic the map does not cover yet.</SmallNote> : null}
        <SpecColumns>
          <Col>
            <ColGroup title="How it reads">
              <ul>
                <li><b>Nav</b>: For You · Food · Home &amp; Design · Style &amp; Beauty · Health &amp; Fitness · Cars · Culture · Shopping · Tech &amp; Gear · Videos · Local News</li>
                <li><b>URLs</b>: <code>/hearst-plus/food/recipes/</code>, built on the existing All category routes</li>
                <li><b>Reader masthead</b>: HEARST+ | Food; the active item follows the story&rsquo;s topic, not its brand</li>
                <li><b>Onboarding</b>: the interest picker and the navigation finally use the same words</li>
              </ul>
            </ColGroup>
          </Col>
          <Col>
            <ColGroup title="What breaks">
              <ul>
                <li>Destination themes and headline faces lose their home</li>
                <li>A topic map to maintain as feeds change; maybe tags too</li>
                <li>Cars dominates the inventory; Travel and Beauty alone are too thin for sections</li>
                <li>The brand directory needs its own home</li>
              </ul>
            </ColGroup>
          </Col>
        </SpecColumns>
      </SpecSection>

      <SpecSection
        id="taxonomy-option-c"
        kicker="10.5 · Option C"
        title="Interests up front, brand families underneath"
        intro={<p>Option B&rsquo;s interests become the primary navigation. Option A&rsquo;s five families stay as headings in the brand directory and as theme sources, not as a navigation level.</p>}
      >
        <SpecColumns columns={3}>
          <Col>
            <ColGroup title="Reader layer">
              <ul>
                <li>Utility bar, reader masthead and onboarding use interests</li>
                <li>Each interest borrows the theme of the family it overlaps most (Food → Lifestyle, Cars → Autos, Health &amp; Fitness → E&amp;W)</li>
                <li>Brand pages at <code>/brands/{"{slug}"}/</code> in their own publication style</li>
              </ul>
            </ColGroup>
          </Col>
          <Col>
            <ColGroup title="Brand directory">
              <ul>
                <li>Browse brands, the phone menu and the onboarding brand picker are grouped under the five family names</li>
                <li>Families are metadata: moving a brand is one line and no redirect</li>
              </ul>
            </ColGroup>
          </Col>
          <Col>
            <ColGroup title="Hidden layer">
              <ul>
                <li><code>getHearstBrandSection()</code> stays the cohort for ads, ingestion and analytics</li>
                <li>New <code>getReaderInterest(story)</code> and <code>getBrandFamily(brand)</code> drive what readers see</li>
                <li>Events gain an <code>interest</code> field next to <code>destination</code></li>
              </ul>
            </ColGroup>
          </Col>
        </SpecColumns>
      </SpecSection>

      <SpecSection id="taxonomy-comparison" kicker="10.6 · Comparison" title="The three options side by side">
        <SpecTable caption="Option comparison" headers={["", "A: Rename and regroup", "B: Interest sections", "C: Interests and families"]} rows={comparisonRows} codeFirst={false} minWidth="48rem" />
      </SpecSection>

      <SpecSection id="taxonomy-recommendation" kicker="10.7 · Recommendation" title="Option C, in three steps">
        <SpecProse>
          <NumberedList>
            <li><b>Split the layers and rename.</b> Add a reader grouping next to the cohort, switch the feed filter and onboarding to match on keys, ship the Option A names and regrouping, and move brand pages to <code>/brands/{"{slug}"}/</code> with redirects. This step alone gives you Option A.</li>
            <li><b>Add the interest layer.</b> Use the topic map, build <code>/hearst-plus/{"{interest}"}/</code> on the existing All category routes, and switch the utility bar, reader masthead and onboarding to interests. Families stay only in the brand directory.</li>
            <li><b>Retire the group routes.</b> Redirect each <code>/hearst-{"{group}"}/{"{category}"}/</code> to the closest interest, then update the vault, Storybook and these specs.</li>
          </NumberedList>
          <p>You can stop after step 1 and still have a clear improvement.</p>
        </SpecProse>
      </SpecSection>

      <SpecSection id="taxonomy-questions" kicker="10.8 · Decisions" title="Open questions for the owner">
        <SpecProse>
          <NumberedList>
            <li><b>Labels.</b> &ldquo;Home &amp; Food&rdquo; or separate Food and Home? &ldquo;Style &amp; Beauty&rdquo; or Style? &ldquo;Health &amp; Fitness&rdquo; or Wellness? Cars or Autos? Culture or Entertainment?</li>
            <li><b>Tech &amp; Gear.</b> Its own family and theme, or fold Popular Mechanics and Best Products into another? Where does Oprah Daily belong?</li>
            <li><b>URL migration.</b> Is <code>/brands/{"{slug}"}/</code> the canonical brand URL? Do the <code>hearst-</code> prefixes go? Are 301s in <code>next.config.ts</code> and Netlify enough, or must shared demo links stay exact?</li>
            <li><b>Ad cohorts.</b> Should the right-rail ad follow the story&rsquo;s cohort (today) or the page&rsquo;s interest, when an interest mixes cohorts?</li>
            <li><b>Analytics.</b> Keep <code>destination</code> as the cohort and add <code>interest</code>, or rename it?</li>
            <li><b>Brands in two places.</b> Should every brand also have one home interest for its theme and breadcrumbs?</li>
            <li><b>Themes.</b> Should interests borrow family themes, or use the Hearst+ shell and keep themes for brand pages?</li>
            <li><b>Category rows.</b> Subtopics under each interest (Food → Recipes, Cooking, Drinks), or format tabs (Videos, Shopping)?</li>
          </NumberedList>
        </SpecProse>
        <SmallNote>This chapter is an exploration, so its film is not part of the combined film at the top of the page. Add it there once a direction is chosen.</SmallNote>
      </SpecSection>
    </SpecChapter>
  );
}
