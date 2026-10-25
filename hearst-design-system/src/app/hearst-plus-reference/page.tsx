import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ProductHeader, streams, totalMagazineStories } from "@/components/product-story-shell";
import { lifestyleRiverStories } from "@/components/lifestyle-river-data";
import ProductStoryPage from "@/app/about-hearst-magazines/page";
import WhyHearstPlusPage from "@/app/why-hearst-plus/page";
import AccessibilityAiPage from "@/app/hearst-plus/accessibility-ai/page";
import AdLogicPage from "@/app/ad-logic/page";
import BlueprintPage from "@/app/hearst-product-blueprint/page";
import HearstArticleBlueprintPage from "@/app/hearst-article-blueprint/page";
import TokenArchitecturePage from "@/app/token-architecture/page";
import HdsBrandFrameworkPage from "@/app/hds-brand-framework/page";
import ArchitecturePage from "@/app/architecture/page";
import AiInHdsPage from "@/app/ai-in-hds/page";
import ConstitutionPage from "@/app/constitution/page";
import DesignAgentPage from "@/app/design-agent/page";
import { ReferenceNavigation } from "./reference-navigation";

export const metadata: Metadata = {
  title: "Hearst+ Product Reference",
  description: "Evidence-based definition of the Hearst+ reader prototype, its implemented behavior, data sources, boundaries, and supporting documents.",
};

const referencePages = [
  { id: "product-story", title: "Product story", href: "/about-hearst-magazines/", summary: "Sets the reader proposition and source-attribution principle. It maps the six reader sections, reviewer journeys, configured source routes, sample story, and current prototype proof.", keyPoints: ["The six destinations are Lifestyle, Autos, Fashion & Luxury, Enthusiast & Wellness, Local News, and A&E Family; source coverage differs by destination.", "The demonstrated flows include cross-source discovery, publication or local-source routes, an in-app reader for supported stories, and source links where available.", "Reader actions such as save, hide, follow, and More Like This use prototype reader state; they are not production-account changes.", "The Delish example is a checked-in public RSS snapshot record with attribution and an external source link, not a live CMS story.", "The page proposes three reviewer journeys and describes source attribution as a product rule; it reports no measured discovery or return lift."], status: "Product description plus implementation examples. It explicitly says discovery and return-visit lift have not been measured.", evidence: "src/app/about-hearst-magazines/page.tsx · src/components/product-story-shell.tsx · src/components/lifestyle-river-data.ts" },
  { id: "why-hearst-plus", title: "Why Hearst+", href: "/why-hearst-plus/", summary: "Frames daily return as the first product question, then describes how a reader could discover stories, shape the mix, and continue across sources. A paid membership path is a future commercial hypothesis.", keyPoints: ["The strategic question is whether a reader returns for a useful cross-source experience, not whether the prototype itself proves habitual use.", "The proposed value exchange connects editorial discovery, explicit reader controls, and continuity across selected destinations while preserving publication identity.", "The page presents return behavior as the first product test and membership or upgrades as a future commercial hypothesis.", "Retention, registration lift, willingness to pay, and discovery impact are not measured outcomes in the repository."], status: "Strategic case and proposed evaluation. Retention, registration lift, and willingness to pay are not established by the prototype.", evidence: "src/app/why-hearst-plus/page.tsx · PRODUCT.md · src/app/api/reader-profile/route.ts" },
  { id: "accessibility-ai", title: "Accessibility and AI", href: "/hearst-plus/accessibility-ai/", summary: "Provides a review method using standards, semantic structure, Storybook states, browser automation, keyboard and assistive-technology checks, AI-assisted inspection, and human validation. Examples cover landmarks, recommendations, carousels, dialogs, loading, and visual constraints.", keyPoints: ["WCAG 2.2 AA is the stated baseline; WAI-ARIA APG is the pattern reference for custom interactions.", "The proposed QA loop builds semantic HTML first, tests keyboard behavior, reviews Storybook states, runs automated scans, inspects the accessibility tree, asks AI to inspect evidence, then validates with people.", "Examples specify one main landmark, understandable recommendation reasons, inactive carousel slides hidden from focus and assistive technology, and dialogs that trap and restore focus and support Escape.", "The page calls for keyboard-complete controls, stable loading/empty/error/focus/dark/mobile states, readable zoom and phone layouts, captions, and human screen-reader review.", "AI is an assistant for identifying likely gaps in supplied evidence, not the final accessibility authority."], status: "Practice guidance and checklist. The page says it is not formal certification; it does not report a completed WCAG conformance audit or add an AI feature to the reader.", evidence: "src/app/hearst-plus/accessibility-ai/page.tsx · Storybook and browser-review workflow described on that page" },
  { id: "ad-logic", title: "Ad logic", href: "/ad-logic/", summary: "Documents the implemented contextual matcher: destination inventory, active-filter and reader-profile signals, daypart, nearby-story overlap, ID tie-break, and image fallback. River placements recur after every five editorial cards; a desktop reader rail can use eligible destination inventory.", keyPoints: ["Only the active destination's configured prototype catalog is eligible; an empty catalog produces no ad.", "Scoring adds 28 for an active non-For-You filter match, 16 per followed-topic match, 14 per saved-tag or More Like This match, 12 per preferred-topic match, and 10 per preferred-tag match.", "Nearby stories within two positions add 8 per matching topic and 6 per matching tag. Ties sort by ad ID; the best-overlap nearby image is used with the configured image as fallback.", "River units recur after editorial cards 5, 10, 15, and so on. An eligible desktop article may also show a destination-scoped right-rail unit, with an Advertisement disclosure.", "Catalog sponsor names, offers, CTAs, and images are demonstration data. Production still needs ad-server, privacy/consent, campaign, frequency-cap, impression/click, and revenue systems."], status: "Selection and placement logic exist in the prototype. Sponsor names, creative, CTA copy, and catalog entries are examples; this is not a connected ad server or booked campaign system.", evidence: "src/components/home-page.tsx · src/app/ad-logic/page.tsx" },
  { id: "product-blueprint", title: "Product blueprint", href: "/hearst-product-blueprint/", summary: "Maps source ingestion, normalization, eligibility, additive ranking, diversity, progressive delivery, reader surfaces, routes, technology, and candidate measures. It distinguishes the checked-in snapshot from read-only Personalize article and video recommendations.", keyPoints: ["The blueprint counts 859 records in checked-in magazine datasets, 29 magazine brands, and six reader streams; these are repository/configuration counts, not live inventory.", "Snapshot records are normalized and checked for eligibility; read-only Personalize article/video recommendations are a separate source path with local-snapshot fallback.", "The ranking model combines popularity, recency, selected interests, saves, More Like This, daypart, return context, and editorial starting context, then applies a diversity pass.", "The river progressively appends content; supported surfaces include destinations, story cards, reader routes, video, galleries, communities, and shopping.", "Local email profiles remain browser-local. Optional verified Google profiles may sync prototype state through the server profile store; this is not a production account service.", "Candidate measures are proposals. Scheduled monitored feed refresh, consent, analytics collection, CMS publishing, experimentation, and production account operations are not established integrations."], status: "Implementation reference. Production scheduling and feed monitoring, consent, analytics collection, CMS publishing, experimentation, and production account operations remain requirements.", evidence: "src/app/hearst-product-blueprint/page.tsx · src/lib/hearst-personalization-model.ts · src/lib/personalize-live-feed.ts" },
  { id: "article-system", title: "Article system", href: "/hearst-article-blueprint/", summary: "Presents the article-reading proposition: keep the source story intact and make relevant next steps easier. The page includes a proposed acquisition-to-learning loop and compares card examples from magazine RSS snapshots with explicitly curated local-news and configured A&E examples.", keyPoints: ["The core proposition is to deliver the full editorial story, then make a relevant next step—continue reading, save, shop, or return—easy.", "The page frames an acquisition → activation → learning loop and describes standard and immersive reading modes, revenue opportunities, and future work.", "Card examples cover Lifestyle, Autos, Fashion & Luxury, Enthusiast & Wellness, Local News, and A&E Family; provenance labels distinguish public RSS snapshots from curated WBAL and configured A&E examples.", "Source identity and attribution remain part of the card and reading experience; sample examples should not be read as uniformly live data.", "Retention, session value, commerce outcomes, and portfolio learning are future measurement questions, not reported results."], status: "A mixture of implemented article/card examples and future experience strategy. Retention, session value, commerce outcomes, and portfolio learning are not measured results.", evidence: "src/app/hearst-article-blueprint/page.tsx · src/components/article-blueprint-card-samples.tsx · src/components/article-blueprint-experience.tsx" },
  { id: "token-architecture", title: "Token architecture", href: "/token-architecture/", summary: "Explains the token path in this repository: core, semantic, and brand JSON; validation; generated TypeScript and CSS; ThemeProvider; and the Tailwind semantic bridge. It also lists hardening work such as CI drift checks, versioned packages, ownership, and deprecation rules.", keyPoints: ["Core scales live under tokens/core, shared semantic roles under tokens/semantic, and publication values under tokens/brands.", "Validation checks references, required keys, brand coverage, accidental removals, and structural changes before generated output is trusted.", "scripts/build-from-tokens.ts generates brand TypeScript and CSS custom properties; ThemeProvider selects data-brand and light/dark values; Tailwind utilities map through the semantic CSS-variable bridge.", "Change source JSON, rebuild, validate, review generated diffs, and verify representative brands, color modes, keyboard focus, and breakpoints.", "The page identifies CI drift enforcement, versioned packages, ownership, deprecation windows, and consumer-level audits as hardening still needed; its release description is not evidence of an actual deployment."], status: "Current source/build/runtime layers are described alongside production-hardening recommendations. The page's release path is a documented workflow, not evidence that a specific commit has been deployed.", evidence: "tokens/ · scripts/build-from-tokens.ts · src/components/theme-provider.tsx · src/app/globals.css · package.json" },
  { id: "hds-brand-framework", title: "HDS brand framework", href: "/hds-brand-framework/", summary: "Defines an ownership model: HDS provides shared foundations and behavior, brand teams provide editorial identity, and product teams compose those parts. It contains component-contract guidance, themed examples, and a proposed rollout sequence.", keyPoints: ["HDS owns shared foundations, tokens, components, accessibility, and behavior; brand teams own publication identity and editorial expression; product teams assemble supported components into experiences.", "A component should keep a stable interface while theme values change through brand tokens; product code supplies intent and content, while components own markup and interaction behavior.", "The framework gives themed examples and a phased adoption proposal; those examples illustrate the model, not proof all brands/components are shipped.", "The intended balance is shared implementation with visible, source-appropriate brand identity rather than a generic cross-brand skin."], status: "Design-system framework and illustrative brand samples. The proposed organizational rollout is not proof that every component or brand sample is released in the app.", evidence: "src/app/hds-brand-framework/page.tsx · tokens/brands/ · src/lib/theme-options.ts" },
  { id: "app-architecture", title: "App architecture", href: "/architecture/", summary: "Describes shared Hearst architecture through a layered model, global runtime modules, and two broad archetypes: Home/Index and Article/Detail. It includes route and content-card examples across the publication portfolio.", keyPoints: ["The model separates shared tokens/primitives, global modules, page compositions, and publication themes.", "It describes two broad page archetypes: Home/Index for discovery and Article/Detail for reading.", "Examples show shared navigation, rails, feed/card modules, and brand presentation across portfolio routes.", "This is a conceptual platform model; current routes and code are the evidence for what is actually implemented in this checkout."], status: "A platform architecture view broader than Hearst+. Treat claims such as exhaustive two-template coverage or real-time behavior as this document's model, not as a verified inventory of every current runtime route.", evidence: "src/app/architecture/page.tsx · src/components/architecture-page.tsx · current route implementation in src/app/" },
  { id: "ai-in-design-systems", title: "AI in Design Systems", href: "/ai-in-hds/", summary: "Assesses AI as useful for scaffolding, code generation, and documentation while identifying brand judgment and token-schema governance as human- and system-controlled areas.", keyPoints: ["AI can accelerate repetitive scaffolding, implementation drafts, and documentation when given bounded system rules and concrete source material.", "Token schemas, approved brand values, accessibility requirements, and component contracts should be deterministic and validated rather than autonomously redefined.", "Brand voice, visual judgment, and editorial meaning require accountable human review.", "The page is a workflow position paper; it does not report measured productivity gains or describe AI as a live reader feature."], status: "An analytical position and workflow guidance, not a test result or live Hearst+ reader capability. Token and design decisions still need deterministic validation and human review.", evidence: "src/app/ai-in-hds/page.tsx · src/components/ai-in-hds-page.tsx · token validation scripts in package.json" },
  { id: "design-constitution", title: "Design Constitution", href: "/constitution/", summary: "States HDS rules for system boundaries, editorial integrity, accessible behavior, responsive patterns, token governance, and review. It also repeats some architecture and agent-workflow material found on other pages.", keyPoints: ["The eight articles cover: five-layer boundaries; editorial aesthetic; Home/Index and Article/Detail archetypes; card/media contracts; multi-brand token governance; feed allocation/deduplication; accessibility/performance; and agent/verification protocol.", "The rules prohibit brand-specific hardcoding in shared primitives, generic editorial UI treatments, duplicate story placements, and token-schema bypasses.", "The document specifies patterns such as semantic landmarks, keyboard-operable dialogs, reduced-motion support, and validated generated token outputs.", "Some numbers and mandates (including broad brand coverage and feed caps) are governance statements; current implementation must be checked independently before claiming conformance."], status: "Governance requirements. Their presence in the document does not prove every current component conforms; conformance requires a scoped review and results.", evidence: "src/app/constitution/page.tsx · src/components/constitution-page.tsx · APP_RULES.md" },
  { id: "design-agent-architecture", title: "Design Agent page review", href: "/design-agent/", summary: "Audits the repository's Design Agent route. The route installs a theme and renders a static React page; the former diagram and prompt control did not execute the workflow they described.", keyPoints: ["The page component rendered a static workflow illustration and fixed prompt text.", "The focus controls only changed visual emphasis. The prompt button copied a string; neither action invoked an AI model or agent process.", "This page contained no implementation for company knowledge retrieval, automated quality gates, Jira creation, or production delivery.", "Those proposed capabilities are not treated as operating product functions without implementation evidence."], status: "Repository implementation review. Conclusions are limited to the route and component cited; this page does not claim a repository-wide audit of every external service.", evidence: "src/app/design-agent/page.tsx · src/components/design-agent-page.tsx" },
  { id: "hearst-plus-design-system", title: "Hearst+ Design System", href: "/", summary: "The source list points this label to the site root. The root redirects to /hearst-plus/.", keyPoints: ["The listed entry is a product link, not a distinct documentation page; the application root redirects to the Hearst+ reader.", "The central system boundary is HDS for shared foundations and Hearst+ for the application and product-specific patterns.", "The concrete token, brand, accessibility, and component guidance is brought together in the adjacent sections of this consolidated reference."], status: "Not a separate design-system document. HDS foundation and Hearst+ application boundaries are documented in PRODUCT.md and the HDS references above.", evidence: "src/app/page.tsx · PRODUCT.md · APP_RULES.md" },
];

const narrativeOrder = [
  "why-hearst-plus",
  "product-story",
  "product-blueprint",
  "article-system",
  "hds-brand-framework",
  "app-architecture",
  "token-architecture",
  "hearst-plus-design-system",
  "accessibility-ai",
  "ad-logic",
  "design-constitution",
  "ai-in-design-systems",
  "design-agent-architecture",
] as const;

const chapterById: Record<(typeof narrativeOrder)[number], string> = {
  "why-hearst-plus": "The case",
  "product-story": "The reader",
  "product-blueprint": "The experience",
  "article-system": "The experience",
  "hds-brand-framework": "The foundation",
  "app-architecture": "The foundation",
  "token-architecture": "The foundation",
  "hearst-plus-design-system": "The foundation",
  "accessibility-ai": "Trust and value",
  "ad-logic": "Trust and value",
  "design-constitution": "Trust and value",
  "ai-in-design-systems": "Delivery and limits",
  "design-agent-architecture": "Delivery and limits",
};
const chapterOrder = [...new Set(narrativeOrder.map((id) => chapterById[id]))];

const chapterOpeningById: Partial<Record<(typeof narrativeOrder)[number], string>> = {
  "why-hearst-plus": "The case is a hypothesis: a source-aware reader may make discovery more useful and earn another visit. This prototype makes parts of that experience inspectable; it does not establish return behavior or paid demand.",
  "product-story": "The intended reader moves among selected Hearst sources. This section shows the configured destinations, source identity, example journeys, and what the current prototype can demonstrate.",
  "product-blueprint": "Follow the path from checked-in sources and recommendations through eligibility, ranking, and reader surfaces. The blueprint distinguishes implemented flows from production integrations that are still needed.",
  "hds-brand-framework": "The foundation combines shared Hearst Design System rules with publication identity and product composition. The framework describes ownership; its examples do not prove every brand or component is shipped.",
  "accessibility-ai": "This section sets out accessibility practice and contextual ad behavior. It separates review guidance and prototype matching logic from completed audits or connected commercial systems.",
  "ai-in-design-systems": "The final sections separate proposed AI-assisted work from what the repository actually runs, ending with a review of the Design Agent route’s implementation limits.",
};

const orderedReferencePages = narrativeOrder.map((id) => {
  const page = referencePages.find((candidate) => candidate.id === id);
  if (!page) throw new Error(`Missing reference page: ${id}`);
  const index = narrativeOrder.indexOf(id);
  const startsChapter = index === 0 || chapterById[narrativeOrder[index - 1]] !== chapterById[id];
  return { ...page, chapter: chapterById[id], chapterOpening: startsChapter ? chapterOpeningById[id] : undefined };
});

const sourcePageComponents: Record<string, () => ReactNode> = {
  "product-story": ProductStoryPage,
  "why-hearst-plus": WhyHearstPlusPage,
  "accessibility-ai": AccessibilityAiPage,
  "ad-logic": AdLogicPage,
  "product-blueprint": BlueprintPage,
  "article-system": HearstArticleBlueprintPage,
  "token-architecture": TokenArchitecturePage,
  "hds-brand-framework": HdsBrandFrameworkPage,
  "app-architecture": ArchitecturePage,
  "ai-in-design-systems": AiInHdsPage,
  "design-constitution": ConstitutionPage,
  "design-agent-architecture": DesignAgentPage,
};

const blueprintSections = [
  ["Prototype truth", "scope"],
  ["Feed architecture", "system"],
  ["Eligibility & ranking", "ranking"],
  ["Content treatments", "models"],
  ["Routes & navigation", "routes"],
  ["Experience map", "journeys"],
  ["Design system", "design-system"],
  ["Technology", "technology"],
  ["Success framework", "measurement"],
  ["Production readiness", "delivery"],
] as const;

const articleSystemSections = [
  ["The opportunity", "opportunity"],
  ["How it works", "how-it-works"],
  ["Two ways to read", "reading-modes"],
  ["Revenue with trust", "revenue"],
  ["What comes next", "next"],
] as const;

const adLogicSections = [
  ["How it matches", "section-1"],
  ["Where it appears", "section-2"],
  ["What is connected", "section-3"],
] as const;

const hdsFrameworkSections = [
  ["The decision", "decision"],
  ["System model", "model"],
  ["Token source", "token-source"],
  ["Tech stack", "tech-stack"],
  ["Component build", "component-build"],
  ["Operating guide", "operating-guide"],
  ["Prompted playbook", "prompted-playbook"],
  ["Ownership", "ownership"],
  ["Brand samples", "samples"],
  ["Portfolio", "portfolio"],
  ["Governance", "governance"],
  ["Agents and skills", "agentic"],
  ["Pilot plan", "pilot"],
] as const;

const accessibilityAiSections = [
  ["Why it matters", "why"],
  ["Standards", "standards"],
  ["Hearst+ examples", "examples"],
  ["AI QA loop", "ai-qa"],
  ["Storybook", "storybook"],
  ["Core position", "position"],
] as const;

function HearstPlusSystemContent() {
  return <div className="border-y border-border py-8">
    <p className="text-sm font-bold text-primary">System boundary</p>
    <h3 className="mt-2 font-serif text-3xl">Hearst+ is the application layer built on HDS.</h3>
    <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">Hearst Design System supplies the shared foundations, semantic tokens, typography roles, icons, components, and brand themes. Hearst+ composes those foundations into its reader application and may define product-specific patterns. It is not a competing design system. The repository product definition and application rules are the source for this boundary; the root entry routes to the reader prototype, not to a separate design-system document.</p>
    <p className="mt-5 max-w-3xl font-mono text-xs leading-6 text-muted-foreground">Evidence: PRODUCT.md · APP_RULES.md · src/app/page.tsx</p>
  </div>;
}

export default function HearstPlusReferencePage() {
  return (
    <div className="hearst-plus-theme hearst-plus-reference min-h-screen overflow-x-clip bg-background text-foreground">
      <ProductHeader current="reference" />
      <main>
        <section className="border-b border-border bg-card">
          <div className="mx-auto grid max-w-[1360px] gap-10 px-5 py-14 md:px-10 md:py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,.8fr)] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Stakeholder reference · implementation evidence</p>
              <h1 className="mt-5 max-w-4xl text-balance font-serif text-5xl leading-[.98] tracking-[-.025em] md:text-7xl">A clearer path to the next Hearst story.</h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">Hearst+ is intended for readers moving among selected Hearst editorial, local-news, and entertainment sources. Its proposed mechanism is one discovery and reading path that keeps each publication visible. Why review it now? A working prototype and checked-in content snapshots make the proposition concrete enough to inspect. The repository does not report research showing which readers value it, whether they return more often, register, or pay.</p>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">This reference follows the argument in order: the case, the reader, the experience, the systems behind it, and the evidence and limits that should guide the next decision.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/hearst-plus/" className="inline-flex min-h-11 items-center rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground">Open the prototype</Link>
              </div>
            </div>
            <aside aria-label="Decision framing" className="border border-primary bg-primary p-6 text-primary-foreground md:p-8">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-primary-foreground">Decision question</p>
              <h2 className="mt-4 font-serif text-2xl leading-tight">Should Hearst continue validating a shared, source-aware reader?</h2>
              <div className="mt-6 grid gap-5 border-t border-primary-foreground/25 pt-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.12em] text-primary-foreground">Evidence to inspect</p>
                  <p className="mt-2 text-sm leading-6 text-primary-foreground/80">Working routes and checked-in content snapshots make core flows concrete enough to review.</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
                    <Link href="#product-story" className="text-primary-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground">Reader experience</Link>
                    <Link href="#product-blueprint" className="text-primary-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground">How it works</Link>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.12em] text-primary-foreground">Known limits</p>
                  <p className="mt-2 text-sm leading-6 text-primary-foreground/80">The repository reports no research showing which readers value it, whether they return more often, register, or pay.</p>
                </div>
              </div>
            </aside>
            <div aria-label="Repository snapshot" className="border-t border-border pt-5 lg:col-span-2">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h2 className="text-xs font-bold uppercase tracking-[.16em] text-muted-foreground">Repository snapshot</h2>
                <p className="text-xs leading-5 text-muted-foreground">Checked-in data and configured routes, not audience or production metrics.</p>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4 md:grid-cols-4">
                <div className="border-t border-border pt-2"><dt className="text-xs leading-5 text-muted-foreground">Image-backed public RSS records across four magazine datasets</dt><dd className="mt-1 font-serif text-3xl tabular-nums">{totalMagazineStories}</dd></div>
                <div className="border-t border-border pt-2"><dt className="text-xs leading-5 text-muted-foreground">Configured reader sections</dt><dd className="mt-1 font-serif text-3xl tabular-nums">{streams.length}</dd></div>
                <div className="border-t border-border pt-2"><dt className="text-xs leading-5 text-muted-foreground">Source documents assembled below</dt><dd className="mt-1 font-serif text-3xl tabular-nums">{referencePages.length}</dd></div>
                <div className="border-t border-border pt-2"><dt className="text-xs leading-5 text-muted-foreground">Records in the checked-in Lifestyle dataset</dt><dd className="mt-1 font-serif text-3xl tabular-nums">{lifestyleRiverStories.length}</dd></div>
              </dl>
            </div>
            <p className="max-w-4xl border-t border-border pt-4 text-xs leading-5 text-muted-foreground lg:col-span-2">Evidence basis: checked-in application code, configuration, and content snapshots in this repository. Recommendation and feed results may vary at runtime. The examples below are identified by source and status.</p>
          </div>
        </section>

        <div className="mx-auto grid max-w-[1480px] gap-0 px-4 py-8 md:px-8 lg:grid-cols-[250px_minmax(0,1fr)]">
          <ReferenceNavigation items={orderedReferencePages.map((page) => ({
            id: page.id,
            title: page.title,
            chapter: page.chapter,
            subsections: page.id === "product-blueprint" ? blueprintSections
              : page.id === "article-system" ? articleSystemSections
              : page.id === "ad-logic" ? adLogicSections
              : page.id === "hds-brand-framework" ? hdsFrameworkSections
              : page.id === "accessibility-ai" ? accessibilityAiSections
              : undefined,
          }))} />
          <div className="min-w-0 divide-y divide-border lg:pl-8">
            {orderedReferencePages.map((page) => {
              const SourcePage = sourcePageComponents[page.id];
              return <section id={page.id} key={page.id} aria-labelledby={`${page.id}-heading`} className="scroll-mt-5 border-b-2 border-primary py-8 first:pt-2">
                <header className="mb-5 border-b border-border pb-4">
                  {page.chapterOpening && <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Chapter {String(chapterOrder.indexOf(page.chapter) + 1).padStart(2, "0")} · {page.chapter}</p>}
                  <h2 id={`${page.id}-heading`} className="mt-2 font-serif text-3xl leading-tight text-foreground md:text-4xl">{page.title}</h2>
                </header>
                {page.chapterOpening && <p className="mb-5 max-w-3xl border-b border-border pb-5 text-sm leading-6 text-muted-foreground md:text-base md:leading-7">{page.chapterOpening}</p>}
                <div className="reference-source min-w-0 overflow-hidden bg-background" data-doc-id={page.id}>
                  {SourcePage ? <SourcePage /> : <HearstPlusSystemContent />}
                </div>
              </section>;
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
