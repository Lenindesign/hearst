import { Col, ColGroup, FindingList, NumberedList, SmallNote, TaggedFinding } from "@/components/specs/chapters/chapter-parts";
import {
  dailyHabit,
  daypartLeads,
  defaultLead,
  formatAge,
  inventoryRows,
  picksCandidates,
  poolSources,
  popularityTies,
  riverBuiltAt,
  riverFirstPage,
  riverFirstPageBrands,
  signedOutProfile,
  todaysPicks,
  trending,
} from "@/components/specs/chapters/river-data";
import { SpecChapter, SpecColumns, SpecFilm, SpecSection, SpecSheet, SpecTable } from "@/components/specs/spec-kit";
import { LiveViewport } from "@/components/specs/live/live-kit";
import { TODAYS_PICKS_FRESHNESS_WINDOW_HOURS } from "@/lib/river-selection";

/**
 * River logic spec (HP-RIVER-SPEC · Rev A · 2026-11-20). Every story, count and
 * score below is produced by the production selection code on today's validated
 * feed when the page is built (river-data.ts). Weights are quoted from
 * hearst-personalization-model.ts with the file named beside each table.
 */
const builtOn = riverBuiltAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Los_Angeles" });
const link = "underline underline-offset-4";

/** Start of each beat in the chapter film (public/specs/river-film.mp4), in seconds. */
const filmChapters = [
  [0, "The sheet"],
  [5, "Pipeline"],
  [12, "Pool"],
  [18, "Score"],
  [25, "Variety"],
  [31, "Cadence"],
  [37, "Modules"],
  [44, "Grow"],
  [50, "The drawing"],
] as const;
const short = (title: string, n = 64) => (title.length > n ? `${title.slice(0, n - 1)}…` : title);

const inventoryTable = inventoryRows.map((row) => [
  row.label,
  row.total,
  row.brands,
  row.within24,
  row.within72,
  row.within168,
  row.newestHours === undefined ? "—" : `${row.newestHours} h`,
]);

const scoreRows = [
  ["Popularity", "story.popularity", "55–100", "Imported per story; see F1"],
  ["Recency", "age ≤ 6 h · ≤ 24 h · ≤ 72 h · ≤ 7 d", "48 · 36 · 18 · 8", "+12 more if published since the last visit (return visits)"],
  ["Followed topic", "story topic is (or starts with) a followed topic", "18 · 34 after onboarding", ""],
  ["Followed brand", "story brand is followed", "16", ""],
  ["Saved tags", "tags shared with saved tags", "14 + 6 per extra · 24 + 6 after onboarding", "Extra capped at 24"],
  ["More like this", "tags shared with boosted tags", "22 + 8 per extra · 34 + 8 after onboarding", "Extra capped at 32"],
  ["Time of day", "daypart topic · kind · tag", "16 · 10 · 8", "Morning 5–12, afternoon 12–17, evening 17–22, late night"],
  ["Editorial lead", "destination's default lead, first morning visit", "24", "Not after onboarding"],
  ["Fresh since last visit", "return visit, not the previous lead, age ≤ return hours + 4", "24", ""],
  ["New edition", "first visit of a new day, not the previous lead", "28 for next-day topics · 10", ""],
  ["Previous lead", "the lead from the last visit", "−140", "Keeps the lead moving"],
  ["Hidden", "reader hid the story", "−500 · removed", "Hidden stories are filtered out before ranking"],
] as const;

const riverTable = riverFirstPage.map(({ story, score, age }, index) => [
  index + 1,
  short(story.title),
  story.brand,
  formatAge(age),
  score.popularity,
  score.recency,
  score.followedTopic + score.followedBrand + score.savedTag + score.moreLikeThis,
  score.timeOfDay,
  score.total,
]);

const picksTable = todaysPicks.map((story, index) => [index + 1, short(story.title), story.brand, `${story.age} h`]);
const habitTable = dailyHabit.map((story, index) => [index + 1, short(story.title), story.brand, story.popularity]);
const trendingTable = trending.map((story, index) => [index + 1, short(story.title), story.brand, story.popularity, story.signal]);
const daypartTable = daypartLeads.map(({ label, story, score }) => [label, short(story.title, 56), story.brand, score.timeOfDay, score.total]);

const signalSummary = inventoryRows
  .map((row) => `${row.label}: ${row.signals.map(([signal, count]) => `${signal} ${count}`).join(", ")}`)
  .join(" · ");

export function RiverChapter() {
  return (
    <SpecChapter
      id="river"
      number="11"
      kicker="HDS · Hearst+ story river and trending modules"
      title="River logic"
      lede={
        <p>
          Which stories the Hearst+ river and its trending modules show, and why. A daily import refreshes the catalog; the page scores every story for the reader in front of it, keeps brands and topics varied, fills the modules from the same ranked list, and grows the river as the reader scrolls. The tables below are today&rsquo;s actual selection, computed by the production code when this page was built.
        </p>
      }
      meta={[
        ["Doc", "HP-RIVER-SPEC · Rev A · 2026-11-20"],
        ["Built", <>{builtOn} · tables follow each daily feed refresh</>],
        ["Source", <><code>hearst-personalization-model.ts</code>, <code>river-selection.ts</code>, <code>story-module-allocation.ts</code>, <code>daily-edition.ts</code>, <code>home-page-feed-model.ts</code>, <code>stable-story-order.ts</code>, <code>scripts/import-*-rss.mjs</code></>],
        ["Rules", <><code>APP_RULES.md</code> › feeds, rivers and modules</>],
        ["Drawing", <><a href="/specs/river-drawing.html" className={link}>HP-RIVER-001</a> · 1 sheet</>],
        ["Reader", <>Tables reproduce a signed-out reader&rsquo;s first morning visit to <code>/hearst-plus/</code> (For You). A signed-in reader, a return visit or the video feed changes the order.</>],
      ]}
      contents={[
        ["Live reference", "#river-live"],
        ["Film", "#river-film"],
        ["Drawing", "#river-drawing"],
        ["From feed to river", "#river-pipeline"],
        ["Today's inventory", "#river-inventory"],
        ["The score", "#river-score"],
        ["Today's river", "#river-today"],
        ["Time of day", "#river-dayparts"],
        ["Trending modules", "#river-trending"],
        ["Findings", "#river-findings"],
      ]}
    >
      <SpecSection
        id="river-live"
        kicker="11 · Live reference"
        title="The real river, today."
        intro={<p>The production Hearst+ home in a frame that acts as the browser window. Today&rsquo;s Picks lead the page, Trending Across Brands sits in the left rail, and the river starts under the picks. The frame uses your browser&rsquo;s saved profile, so it can differ from the signed-out tables below.</p>}
      >
        <LiveViewport
          src="/hearst-plus/"
          title="Hearst+ home river at the selected window width"
          widths={[{ width: 390, label: "390 phone" }, { width: 1280, label: "1280 xl" }, { width: 1440, label: "1440" }]}
          defaultWidth={1280}
          height={900}
        />
      </SpecSection>

      <SpecSection id="river-film" kicker="11.0 · Walkthrough" title="How the river chooses stories" intro={<p>The film tours the logic sheet in pipeline order: the daily import, the pool, the score, variety, cadence, the modules and how the river grows.</p>}>
        <SpecFilm
          src="/specs/river-film.mp4"
          poster="/specs/river-film-poster.jpg"
          label="River logic film · 0:56 · no sound."
          caption={<p><b className="text-foreground">River logic film · 0:56 · no sound.</b> Captions at the top of each scene say what is happening; codes match the drawing. Pick a chapter to jump to it.</p>}
          chapters={filmChapters}
        />
      </SpecSection>

      <SpecSection
        id="river-drawing"
        kicker="11.0 · Drawing HP-RIVER-001 · Rev A · Sheet 1"
        title="The drawing"
        intro={<p>One logic sheet: the nine-step pipeline, the three pool sources, the score stack drawn to scale, the variety and cadence rules, how the modules split the ranked list, and how the river grows. The full drawing with its notes is in <a href="/specs/river-drawing.html" className={link}>river-drawing.html</a>.</p>}
      >
        <SpecSheet
          src="/specs/river-drawing-sheet-1.jpg"
          width={1936}
          height={1232}
          href="/specs/river-drawing.html"
          alt="River logic drawing: the pipeline from daily import to the growing river, the page pool, the score parts stacked to scale, the variety rule, the cadence of editorial and current stories, the module allocation and the growth of the river, with tables of score parts, sizes and times."
        />
      </SpecSection>

      <SpecSection
        id="river-pipeline"
        kicker="11.1 · Pipeline"
        title="From feed to river, every day"
        intro={<p>Nine steps run in order. Steps 1–2 happen once a day on the server; 3–9 run in the reader&rsquo;s browser on every visit and every filter change.</p>}
      >
        <SpecColumns>
          <Col>
            <ColGroup title="Once a day">
              <NumberedList>
                <li><b>Import.</b> At 10:15 UTC the feed workflow reads each brand&rsquo;s public RSS (and sitemap where listed), keeps image-backed stories with a real publication date, takes the newest per brand up to a target (Lifestyle 4–30 per brand, the other groups 200 in all) and writes one snapshot per group. It publishes only if validation and the build pass.</li>
                <li><b>Catalog.</b> Excluded stories are removed. Each group&rsquo;s snapshot stays in brand order, newest first within a brand.</li>
              </NumberedList>
            </ColGroup>
            <ColGroup title="On every visit">
              <NumberedList>
                <li><b>Pool.</b> The page starts with the first 20 stories of each group plus up to 10 per brand from the snapshot, and the video feed. Today: {poolSources.staticFirstPage} + {poolSources.localFeed} stories, {poolSources.merged} after de-duplication, from {poolSources.brands} brands.</li>
                <li><b>Score.</b> Every story gets a score for this reader: popularity, recency, followed topics and brands, saved and boosted tags, and the time of day (11.3).</li>
                <li><b>Variety.</b> Sorted by score, then never three in a row from the same brand or the same topic.</li>
              </NumberedList>
            </ColGroup>
          </Col>
          <Col>
            <ColGroup title="Shaping the page">
              <NumberedList>
                <li><b>Cadence.</b> Videos and current-feed stories interleave: five editorial stories, one current, one editorial, one current, then one current after every three editorial.</li>
                <li><b>Modules.</b> Today&rsquo;s Picks take five stories first, then Your Daily Habit takes the next three in river order and Trending Across Brands takes five by popularity, one per brand first. A story is used once; the river keeps at least four.</li>
                <li><b>Stable order.</b> Once shown, the order is kept for the visit. New stories append at the end; nothing above the reader moves. Changes from a read apply on the next visit.</li>
                <li><b>Grow.</b> The river shows 16 cards, then 4 more as the reader nears the end. Near the end of the loaded pool it asks the server for the next 32 stories of the catalog.</li>
              </NumberedList>
            </ColGroup>
            <SmallNote>Filters (For You, Style, a brand, Saved) run between steps 5 and 6 on the same ranked list. Brand pages use the same steps on that brand&rsquo;s stories.</SmallNote>
          </Col>
        </SpecColumns>
      </SpecSection>

      <SpecSection
        id="river-inventory"
        kicker="11.2 · Today"
        title="Today's inventory"
        intro={<p>The four validated snapshots behind the river, counted when this page was built. Age is measured from each story&rsquo;s publication time.</p>}
      >
        <SpecTable
          caption="Stories per group in today's validated snapshots"
          headers={["Group", "Stories", "Brands", "≤ 24 h", "≤ 72 h", "≤ 7 days", "Newest"]}
          rows={inventoryTable}
          numeric={[1, 2, 3, 4, 5, 6]}
          codeFirst={false}
        />
      </SpecSection>

      <SpecSection
        id="river-score"
        kicker="11.3 · Ranking"
        title="The score"
        intro={<p>Each story&rsquo;s score is the sum of these parts (<code>getLifestyleScoreBreakdown</code> in <code>hearst-personalization-model.ts</code>). Onboarding raises the weight of the reader&rsquo;s own choices. A signed-out reader starts from the destination&rsquo;s preset profile: on the Hearst+ home that is following {signedOutProfile.followedTopics.join(", ")} and {signedOutProfile.followedBrands.join(", ")} (F4).</p>}
      >
        <SpecTable
          caption="Story score parts and weights"
          headers={["Part", "When it applies", "Points", "Note"]}
          rows={scoreRows}
          codeFirst={false}
          minWidth="52rem"
        />
      </SpecSection>

      <SpecSection
        id="river-today"
        kicker="11.4 · Today"
        title="Today's river"
        intro={<p>The first 16 river cards for a signed-out reader&rsquo;s first morning visit, after Today&rsquo;s Picks, Your Daily Habit and Trending took theirs. Interest is followed topic + brand + saved tags + more like this. The video feed is not in these tables; the cadence slots its stories into the ranked list at positions 6, 8, 12 and every fourth after that, before the modules take theirs.</p>}
      >
        <SpecTable
          caption="First page of today's Hearst+ river with score parts"
          headers={["#", "Story", "Brand", "Age", "Popularity", "Recency", "Interest", "Daypart", "Score"]}
          rows={riverTable}
          numeric={[0, 4, 5, 6, 7, 8]}
          codeFirst={false}
          minWidth="60rem"
        />
        <SmallNote>Brands on this page: {riverFirstPageBrands.map(([brand, count]) => `${brand} ${count}`).join(" · ")}.</SmallNote>
      </SpecSection>

      <SpecSection
        id="river-dayparts"
        kicker="11.5 · Context"
        title="Time of day"
        intro={<p>The same reader at four times of day. Each daypart favors its own topics, card kinds and tags, worth up to 34 points; the rest of the score is unchanged.</p>}
      >
        <SpecTable
          caption="Top story of the ranking by daypart"
          headers={["Daypart", "Top story", "Brand", "Daypart points", "Score"]}
          rows={daypartTable}
          numeric={[3, 4]}
          codeFirst={false}
        />
      </SpecSection>

      <SpecSection
        id="river-trending"
        kicker="11.6 · Modules"
        title="Trending modules"
        intro={<p>Every module draws from the same ranked list as the river, so a story appears once on the page. Today&rsquo;s selection for the same signed-out first visit:</p>}
      >
        <SpecColumns>
          <Col>
            <ColGroup title="Today's Picks (lead slider, 5)">
              <ul>
                <li>Hearst+ For You only. Candidates are stories published in the last {TODAYS_PICKS_FRESHNESS_WINDOW_HOURS} hours (today: {picksCandidates.length}). If none qualify, the newest stories are used instead.</li>
                <li>Sorted by the reader&rsquo;s score, one per publication first. The daily edition then takes the top story and fills the other four with a new brand and a new topic each where it can, then a new brand, then a new topic.</li>
                <li>Fixed for the day: the five are saved as today&rsquo;s edition in the browser and reused on every visit until the date changes. Yesterday&rsquo;s picks go last.</li>
              </ul>
            </ColGroup>
            <ColGroup title="Your Daily Habit (3)">
              <ul>
                <li>The next three stories in river order that no other module took.</li>
              </ul>
            </ColGroup>
          </Col>
          <Col>
            <ColGroup title="Trending Across Brands (5 · 3 below 1140)">
              <ul>
                <li>Sorted by <code>popularity</code>, one story per brand first, then any. Ties keep river order. On a brand page it shows that brand&rsquo;s stories only.</li>
                <li>Today {popularityTies} stories in the pool share the top value, 100, so the order among them comes from the river (F1, F5).</li>
              </ul>
            </ColGroup>
            <ColGroup title="Trending in the reader (5)">
              <ul>
                <li>In the story reader&rsquo;s context rail: stories that share a tag with the open story, by popularity, after three same-brand and three same-topic stories are set aside for other modules. Topped up to five.</li>
              </ul>
            </ColGroup>
          </Col>
        </SpecColumns>
        <SpecTable caption="Today's Picks today" headers={["#", "Story", "Brand", "Published"]} rows={picksTable} numeric={[0]} codeFirst={false} />
        <SpecTable caption="Your Daily Habit today" headers={["#", "Story", "Brand", "Popularity"]} rows={habitTable} numeric={[0, 3]} codeFirst={false} />
        <SpecTable caption="Trending Across Brands today" headers={["#", "Story", "Brand", "Popularity", "Signal label"]} rows={trendingTable} numeric={[0, 3]} codeFirst={false} />
      </SpecSection>

      <SpecSection id="river-findings" kicker="11.7 · For the product team" title="Findings" intro={<p>From reading the selection code against today&rsquo;s data. Nothing has been changed in code.</p>}>
        <FindingList>
          <TaggedFinding id="river-f1" tag="F1 · NEEDS DATA" title="Popularity is not real traffic">
            <p>The import sets <code>popularity = max(55, 100 − index mod 46)</code>, where index is the story&rsquo;s position in the snapshot (brand order, newest first). So &ldquo;Trending&rdquo; and &ldquo;Most Popular&rdquo; sort by import position, not by readers. <b>Recommend</b> importing a real signal (page views or engaged time from Amplitude) and keeping the formula only as a fallback.</p>
          </TaggedFinding>
          <TaggedFinding id="river-f2" tag="F2 · LABELS" title="Signal labels rotate every fourth story">
            <p>The card label (<i>Most Popular, Trending, Editor Pick, Continue</i>) is assigned by position, one in four each. Today: {signalSummary}. A card can say Trending without trending. <b>Recommend</b> deriving labels from the score parts that actually fired, or hiding them until F1 lands.</p>
          </TaggedFinding>
          <TaggedFinding id="river-f3" tag="F3 · FRESHNESS" title="Recency uses the age at import time">
            <p><code>story.age</code> is computed when the snapshot is written, so a story imported at 10:15 UTC still counts as 0 hours old at 10 PM. The recency tiers (48 · 36 · 18 · 8) can be off by up to a day. Today&rsquo;s Picks already recompute age from <code>publishedAt</code>. <b>Fix:</b> compute age from <code>publishedAt</code> at ranking time everywhere.</p>
          </TaggedFinding>
          <TaggedFinding id="river-f4" tag="F4 · NEEDS A DECISION" title="New readers are ranked as if they follow eight things">
            <p>A signed-out reader uses the preset profile: four followed topics, four followed brands, seven saved tags and five boosted tags, worth up to about 100 points before the reader has done anything. That is a strong editorial default dressed as personalization. <b>Decide</b> whether new readers should start neutral (popularity, recency and time of day only) until onboarding or the first reads.</p>
          </TaggedFinding>
          <TaggedFinding id="river-f5" tag="F5 · TRENDING" title="Trending ties are broken by river order">
            <p>{popularityTies} stories share popularity 100 today, so the five trending slots go to the first story per brand among them in the reader&rsquo;s river order. Trending therefore moves with personalization rather than with readers. Fixed by F1.</p>
          </TaggedFinding>
          <TaggedFinding id="river-f6" tag="F6 · DEAD RULE" title="The editorial lead story is gone">
            <p>The Hearst+ home gives +24 to its default lead (<code>{defaultLead.id}</code>) on a first morning visit. {defaultLead.inPool ? "It is in today's pool." : "It is not in today's pool, so the rule does nothing."} <b>Recommend</b> letting editors pick the day&rsquo;s lead in the feed data instead of a hard-coded id.</p>
          </TaggedFinding>
          <TaggedFinding id="river-f7" tag="F7 · LOADING" title="Extra pages arrive in catalog order">
            <p>When the reader scrolls past the loaded pool, the server returns the next 32 stories of the catalog as stored: all Lifestyle brands first on the Hearst+ home, in brand order. New pages are ranked before they append, but a long scroll fills with the groups that come first. <b>Option:</b> page through a pre-ranked or interleaved catalog.</p>
          </TaggedFinding>
        </FindingList>
      </SpecSection>
    </SpecChapter>
  );
}
