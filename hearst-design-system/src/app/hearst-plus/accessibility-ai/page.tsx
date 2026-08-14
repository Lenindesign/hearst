import type { Metadata } from "next";
import Link from "next/link";
import { ProductFooter } from "@/components/product-story-shell";

export const metadata: Metadata = {
  title: "Hearst+ Accessibility and AI",
  description:
    "A Hearst+ guide to digital accessibility best practices, standards, Storybook review, and AI-assisted QA.",
};

const standards = [
  {
    name: "WCAG 2.2 AA",
    role: "Baseline standard",
    copy: "Use it to define measurable expectations for perceivable, operable, understandable, and robust experiences.",
    href: "https://www.w3.org/TR/WCAG22/",
  },
  {
    name: "WAI-ARIA APG",
    role: "Pattern reference",
    copy: "Use it when a custom interaction needs a documented keyboard model, roles, names, and states.",
    href: "https://www.w3.org/WAI/ARIA/apg/",
  },
  {
    name: "Playwright",
    role: "Flow regression",
    copy: "Use role locators, keyboard steps, screenshots, and ARIA snapshots to verify behavior like a reader or an AI browser agent.",
    href: "https://playwright.dev/docs/aria-snapshots",
  },
  {
    name: "Storybook",
    role: "Human review companion",
    copy: "Use isolated stories to review components, states, themes, and edge cases with designers, engineers, editorial partners, and accessibility reviewers.",
    href: "https://storybook.js.org/docs/writing-tests/accessibility-testing",
  },
  {
    name: "axe-core",
    role: "Automated scan",
    copy: "Use automated checks to catch common defects, then pair them with keyboard, screen-reader, zoom, and human review.",
    href: "https://playwright.dev/docs/accessibility-testing",
  },
];

const hearstExamples = [
  {
    title: "The feed has one clear main landmark",
    practice: "Keep page structure predictable for screen readers, keyboard users, search, and AI agents.",
    example:
      "Hearst+ destination pages keep the primary feed surface inside a single main landmark with the page H1 in that landmark.",
  },
  {
    title: "Recommendations explain themselves",
    practice: "Use plain language so personalization is understandable, not mysterious.",
    example:
      "For You cards expose one quiet reason such as a followed topic, followed brand, or new story in today's edition.",
  },
  {
    title: "Carousels expose only the active slide",
    practice: "Avoid giving assistive technology several off-screen items that look equally active.",
    example:
      "Inactive featured slides remain rendered for animation, but are hidden from sequential focus and assistive technology.",
  },
  {
    title: "Modals isolate focus and restore it",
    practice: "Every overlay should have a clear name, one close control, trapped focus, Escape behavior, and focus return.",
    example:
      "Search, reader, gallery, onboarding, profile, and personalization overlays restore focus to the control that opened them.",
  },
  {
    title: "Progressive loading stays polite",
    practice: "Infinite content should not trap users, shift context, or hide status from assistive technology.",
    example:
      "The Hearst+ river appends small batches as the reader approaches the sentinel and exposes loading, retry, and end states accessibly.",
  },
  {
    title: "Visual polish has measurable constraints",
    practice: "Contrast, reduced motion, readable line length, and no horizontal overflow are design requirements, not cleanup tasks.",
    example:
      "Hearst+ light surfaces target AA-readable text on the warm canvas and verify phone widths at 320px and 390px.",
  },
];

const aiQaLoop = [
  ["1", "Build semantically", "Use native links, buttons, labels, headings, lists, landmarks, and dialogs before adding ARIA."],
  ["2", "Test as a user", "Run keyboard flows for tab order, focus visibility, Escape, Enter, reader modals, search, and carousels."],
  ["3", "Review states in Storybook", "Use stories for isolated human review of empty states, loading states, error states, focus states, dark themes, and mobile compositions."],
  ["4", "Scan automatically", "Add axe-style scans to catch missing names, invalid ARIA, contrast problems, duplicate IDs, and form issues."],
  ["5", "Inspect the accessibility tree", "Use Playwright role locators and ARIA snapshots so regressions are caught where assistive technology reads the page."],
  ["6", "Ask AI to review evidence", "Give AI screenshots, DOM snapshots, accessibility snapshots, Storybook states, and acceptance criteria so it can find likely gaps."],
  ["7", "Keep humans in the loop", "Validate screen-reader experience, cognitive clarity, editorial meaning, captions, and real-device mobile behavior."],
];

const corePosition = [
  "Digital accessibility is no longer only a compliance topic. It is also the structure that lets people, assistive technology, search, and AI agents understand the same product.",
  "Hearst+ is a useful example because it combines real editorial complexity: feeds, personalization, video, search, overlays, progressive loading, and mobile navigation.",
  "The standard is WCAG 2.2 AA, but the operating model is broader: semantic engineering, Storybook component review, automated scans, Playwright regression checks, AI-assisted review, and human validation.",
  "AI helps us move faster, but AI should not be the final accessibility authority. The final proof is whether people can perceive, operate, understand, and trust the experience.",
];

const storybookReasons = [
  {
    title: "It separates components from the full app",
    copy: "Reviewers can focus on one carousel, card, modal, search state, or reader control without needing to reproduce a complete journey first.",
  },
  {
    title: "It makes state review concrete",
    copy: "Stories can preserve loading, empty, error, long-text, reduced-motion, dark-theme, and phone-width states that are easy to miss in ordinary browsing.",
  },
  {
    title: "It supports collaborative human testing",
    copy: "Design, engineering, editorial, QA, and accessibility reviewers can look at the same state, discuss the same behavior, and document the same expected outcome.",
  },
  {
    title: "It connects human judgment to automation",
    copy: "Storybook accessibility checks can flag common defects while humans judge reading order, focus clarity, language, captions, and whether the content model makes sense.",
  },
];

function SectionHeader({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold text-[var(--hp-primary)]">{eyebrow}</p>
      <h2 className="mt-3 text-balance font-serif text-4xl font-bold leading-tight text-[var(--hp-text-headline)] md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 max-w-[70ch] text-pretty text-base leading-7 text-[var(--hp-text-secondary)]">
        {copy}
      </p>
    </div>
  );
}

export default function AccessibilityAiPage() {
  return (
    <div className="hearst-plus-theme min-h-screen bg-[var(--hp-background)] text-[var(--hp-text-primary)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--hp-action)] focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-[var(--hp-action-text)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--hp-focus)]"
      >
        Skip to accessibility guide
      </a>

      <header className="border-b border-[var(--hp-border)] bg-[var(--hp-surface)]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-5 py-4 md:px-8 lg:flex-row lg:items-center lg:justify-between">
          <Link
            href="/hearst-plus/"
            className="inline-flex min-h-11 items-center self-start text-lg font-bold text-[var(--hp-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hp-focus)]"
            aria-label="Open Hearst+"
          >
            HEARST+
          </Link>
          <nav aria-label="Page sections" className="-mx-3 flex min-w-0 overflow-x-auto text-sm font-semibold">
            {[
              ["Why it matters", "#why"],
              ["Standards", "#standards"],
              ["Hearst+ examples", "#examples"],
              ["AI QA loop", "#ai-qa"],
              ["Storybook", "#storybook"],
              ["Core position", "#position"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="inline-flex min-h-11 shrink-0 items-center px-3 text-[var(--hp-text-secondary)] hover:text-[var(--hp-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hp-focus)]"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section id="why" className="border-b border-[var(--hp-border)] bg-[var(--hp-surface)]">
          <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-16 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
            <div>
              <p className="text-sm font-semibold text-[var(--hp-primary)]">Digital accessibility in the AI era</p>
              <h1 className="mt-4 max-w-4xl text-balance font-serif text-5xl font-bold leading-none text-[var(--hp-text-headline)] md:text-7xl">
                Make Hearst+ understandable to every reader and every responsible agent.
              </h1>
              <p className="mt-6 max-w-[68ch] text-pretty text-lg leading-8 text-[var(--hp-text-secondary)]">
                Accessibility is the product discipline that makes an experience usable through sight, sound, keyboard,
                touch, assistive technology, and now AI-assisted browsing. Hearst+ is a strong sample because it has the
                hard parts: personalized feeds, editorial cards, search, readers, video, carousels, and progressive loading.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#position"
                  className="inline-flex min-h-11 items-center bg-[var(--hp-action)] px-5 text-sm font-bold text-[var(--hp-action-text)] hover:bg-[var(--hp-action-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hp-focus)]"
                >
                  Read the core position
                </a>
                <Link
                  href="/hearst-plus/"
                  className="inline-flex min-h-11 items-center border border-[var(--hp-border-strong)] px-5 text-sm font-bold text-[var(--hp-primary)] hover:bg-[var(--hp-control-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hp-focus)]"
                >
                  Open Hearst+
                </Link>
              </div>
            </div>

            <aside
              aria-labelledby="prototype-context"
              className="border border-[var(--hp-border)] bg-[var(--hp-background)] p-5"
            >
              <h2 id="prototype-context" className="text-base font-bold text-[var(--hp-text-headline)]">
                Prototype context
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--hp-text-secondary)]">
                This page uses Hearst+ as the product context for accessibility practice. Public standards define the
                baseline, Storybook and browser automation make review repeatable, and AI helps inspect evidence. This
                page does not claim formal certification.
              </p>
              <dl className="mt-6 grid gap-px bg-[var(--hp-border)] sm:grid-cols-3">
                {[
                  ["Baseline", "WCAG 2.2 AA"],
                  ["Method", "Semantic UI plus QA"],
                  ["AI role", "Assistant, not judge"],
                ].map(([term, description]) => (
                  <div key={term} className="bg-[var(--hp-surface)] p-4">
                    <dt className="text-xs font-semibold text-[var(--hp-primary)]">{term}</dt>
                    <dd className="mt-1 text-sm font-bold text-[var(--hp-text-headline)]">{description}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </section>

        <section className="border-b border-[var(--hp-border)]">
          <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                ["People", "Readers can perceive content, operate controls, understand personalization, and recover from errors."],
                ["Assistive tech", "Screen readers, switch controls, captions, keyboard navigation, and zoom work from the same semantic structure."],
                ["AI agents", "AI browser tools work better when roles, names, landmarks, labels, and state changes are clear."],
              ].map(([title, copy]) => (
                <article key={title} className="border-t-2 border-[var(--hp-primary)] bg-[var(--hp-surface)] p-5">
                  <h2 className="text-xl font-bold text-[var(--hp-text-headline)]">{title}</h2>
                  <p className="mt-3 text-sm leading-6 text-[var(--hp-text-secondary)]">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="standards" className="scroll-mt-20 border-b border-[var(--hp-border)] bg-[var(--hp-surface)]">
          <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-8 lg:py-20">
            <SectionHeader
              eyebrow="Standards and tools"
              title="Use standards to set the bar, then use tools to keep the bar visible."
              copy="The best accessibility program combines a formal standard, a pattern library, automated checks, browser regression tests, and human review. No single tool covers the full experience."
            />
            <div className="mt-10 grid gap-px bg-[var(--hp-border)] md:grid-cols-2">
              {standards.map((standard) => (
                <article key={standard.name} className="bg-[var(--hp-surface)] p-6">
                  <p className="text-sm font-semibold text-[var(--hp-primary)]">{standard.role}</p>
                  <h3 className="mt-2 text-2xl font-bold text-[var(--hp-text-headline)]">{standard.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--hp-text-secondary)]">{standard.copy}</p>
                  <a
                    href={standard.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex min-h-11 items-center text-sm font-bold text-[var(--hp-primary)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hp-focus)]"
                  >
                    Open reference
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="examples" className="scroll-mt-20 border-b border-[var(--hp-border)]">
          <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-8 lg:py-20">
            <SectionHeader
              eyebrow="Hearst+ as the example"
              title="Good accessibility is visible in product decisions, not only in audit reports."
              copy="These examples translate accessibility standards into practical product behavior. They are also the same signals AI tools can inspect when they review the app through browser snapshots."
            />
            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {hearstExamples.map((item) => (
                <article key={item.title} className="bg-[var(--hp-surface)] p-6">
                  <h3 className="text-xl font-bold text-[var(--hp-text-headline)]">{item.title}</h3>
                  <p className="mt-3 text-sm font-semibold text-[var(--hp-primary)]">{item.practice}</p>
                  <p className="mt-3 text-sm leading-6 text-[var(--hp-text-secondary)]">{item.example}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="ai-qa" className="scroll-mt-20 border-b border-[var(--hp-border)] bg-[var(--hp-surface)]">
          <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-8 lg:py-20">
            <SectionHeader
              eyebrow="AI-assisted QA"
              title="AI is best when it reviews evidence from the browser, not when it guesses from a screenshot."
              copy="The goal is to make accessibility observable. Storybook exposes component states, Playwright captures roles, names, keyboard behavior, screenshots, viewport dimensions, and snapshots, and AI can help read that evidence while humans confirm the lived experience."
            />
            <ol className="mt-10 grid gap-px bg-[var(--hp-border)]">
              {aiQaLoop.map(([number, title, copy]) => (
                <li key={title} className="grid gap-4 bg-[var(--hp-surface)] p-5 md:grid-cols-[4rem_0.5fr_1fr] md:items-start">
                  <span className="text-sm font-bold text-[var(--hp-primary)]">{number}</span>
                  <h3 className="font-bold text-[var(--hp-text-headline)]">{title}</h3>
                  <p className="text-sm leading-6 text-[var(--hp-text-secondary)]">{copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="storybook" className="scroll-mt-20 border-b border-[var(--hp-border)]">
          <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-8 lg:py-20">
            <SectionHeader
              eyebrow="Storybook as a companion"
              title="Storybook makes accessibility review easier to see, repeat, and discuss."
              copy="Hearst+ has many product states that are hard to catch from the main route alone. Storybook turns those states into reviewable examples, so human testers can evaluate the same component shape before it appears in a full reader journey."
            />
            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {storybookReasons.map((item) => (
                <article key={item.title} className="bg-[var(--hp-surface)] p-6">
                  <h3 className="text-xl font-bold text-[var(--hp-text-headline)]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--hp-text-secondary)]">{item.copy}</p>
                </article>
              ))}
            </div>
            <p className="mt-8 max-w-[76ch] text-sm leading-6 text-[var(--hp-text-secondary)]">
              In the Hearst+ workflow, Storybook is most useful when it sits beside real-route testing: Storybook for
              isolated component states and human review, Playwright for route behavior and regressions, axe checks for
              common defects, and screen-reader or keyboard review for lived usability.
            </p>
          </div>
        </section>

        <section className="border-b border-[var(--hp-border)]">
          <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-8 lg:py-20">
            <SectionHeader
              eyebrow="Best-practice checklist"
              title="The repeatable standard for Hearst+ accessibility work."
              copy="Use this checklist when reviewing a new component, editorial module, personalization pattern, or AI-assisted workflow."
            />
            <div className="mt-10 overflow-x-auto bg-[var(--hp-surface)]">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <caption className="sr-only">Accessibility and AI best-practice checklist</caption>
                <thead>
                  <tr className="border-b-2 border-[var(--hp-border-strong)]">
                    <th scope="col" className="py-4 pl-5 pr-4 font-bold text-[var(--hp-text-headline)]">Practice</th>
                    <th scope="col" className="px-4 py-4 font-bold text-[var(--hp-text-headline)]">Why it matters</th>
                    <th scope="col" className="px-4 py-4 font-bold text-[var(--hp-text-headline)]">How to test</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Semantic first", "Assistive technology and AI agents need reliable roles, names, and structure.", "Inspect role locators, headings, labels, landmarks, and ARIA snapshots."],
                    ["Keyboard complete", "Every reader action must work without a pointer.", "Tab through the flow, use Enter, Space, Escape, arrows, and focus return checks."],
                    ["Storybook states", "Humans need stable examples of the states that are hard to reach on demand.", "Review loading, empty, error, long-text, focus, dark-theme, and mobile stories before full-route QA."],
                    ["Readable and responsive", "Text, controls, and images must remain usable at phone widths and zoom.", "Verify 320px, 390px, desktop, no horizontal overflow, and visible focus."],
                    ["Explain personalization", "Readers need trust and control when AI or ranking influences content.", "Check every explanation maps to a real signal and avoid invented behavior claims."],
                    ["Automate without overclaiming", "Scans catch common defects but not lived usability.", "Run axe checks, Playwright flows, screenshots, and manual screen-reader spot checks."],
                  ].map(([practice, why, test]) => (
                    <tr key={practice} className="border-b border-[var(--hp-border)] align-top">
                      <th scope="row" className="py-4 pl-5 pr-4 font-bold text-[var(--hp-text-headline)]">{practice}</th>
                      <td className="px-4 py-4 leading-6 text-[var(--hp-text-secondary)]">{why}</td>
                      <td className="px-4 py-4 leading-6 text-[var(--hp-text-secondary)]">{test}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="position" className="scroll-mt-20 bg-[var(--hp-surface-deep)] text-white">
          <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-8 lg:py-20">
            <p className="text-sm font-semibold text-[var(--hp-primary-soft)]">Core accessibility position</p>
            <h2 className="mt-3 max-w-4xl text-balance font-serif text-4xl font-bold leading-tight md:text-5xl">
              The operating model for accessible, AI-ready Hearst+ experiences.
            </h2>
            <ol className="mt-10 grid gap-px bg-white/20">
              {corePosition.map((line, index) => (
                <li key={line} className="grid gap-4 bg-[var(--hp-surface-deep)] p-5 md:grid-cols-[3rem_1fr]">
                  <span className="font-mono text-sm text-[var(--hp-primary-soft)]">{String(index + 1).padStart(2, "0")}</span>
                  <p className="max-w-[82ch] text-pretty text-base leading-7 text-slate-100">{line}</p>
                </li>
              ))}
            </ol>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/hearst-plus/"
                className="inline-flex min-h-11 items-center bg-white px-5 text-sm font-bold text-[#384959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Open the Hearst+ prototype
              </Link>
              <a
                href="#standards"
                className="inline-flex min-h-11 items-center border border-white/45 px-5 text-sm font-bold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Review the standards
              </a>
            </div>
          </div>
        </section>
      </main>

      <ProductFooter />
    </div>
  );
}
