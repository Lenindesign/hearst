import Link from "next/link";
import { ProductFooter, ProductHeader } from "./product-story-shell";

const pageBehavior = [
  ["Static architecture illustration", "The component renders diagram content from React markup. The diagram is explanatory content; this component does not execute the depicted workflow."],
  ["Preset prompt text", "The source contains a fixed prompt string. Copying that text does not start a model or delegate work to agents."],
  ["Repository page", "The route wraps this component in a theme provider and renders it as a web page."],
] as const;

const notDemonstrated = [
  "A model request or agent orchestration",
  "A connected company knowledge base",
  "Automated accessibility, design, or performance checks",
  "PRD or Jira issue creation",
  "Production code generation, review, or release",
] as const;

export function DesignAgentPageComponent() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <ProductHeader current="design-agent" />
      <main className="mx-auto max-w-[1360px] px-5 py-12 md:px-10 md:py-16">
        <header className="border-b border-border pb-8">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Implementation review · repository evidence</p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-tight tracking-[-.025em] md:text-6xl">What the Design Agent page actually demonstrates</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground">This route presents a proposed workflow as a static illustration. Its labels describe an intended system; the page code does not establish that the depicted agents, checks, knowledge services, or delivery integrations are running.</p>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section aria-labelledby="page-implements-heading">
            <h2 id="page-implements-heading" className="font-serif text-2xl leading-tight">Implemented on this page</h2>
            <dl className="mt-4 divide-y divide-border border-y border-border">
              {pageBehavior.map(([title, copy]) => <div key={title} className="grid gap-2 py-4 sm:grid-cols-[minmax(10rem,.7fr)_1.3fr]">
                <dt className="text-sm font-bold">{title}</dt>
                <dd className="text-sm leading-6 text-muted-foreground">{copy}</dd>
              </div>)}
            </dl>
          </section>

          <section aria-labelledby="not-demonstrated-heading">
            <h2 id="not-demonstrated-heading" className="font-serif text-2xl leading-tight">Not demonstrated by this page</h2>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {notDemonstrated.map((item) => <li key={item} className="py-4 text-sm leading-6 text-muted-foreground">{item}</li>)}
            </ul>
          </section>
        </div>

        <section className="mt-10 border-t border-border pt-6" aria-labelledby="evidence-heading">
          <h2 id="evidence-heading" className="text-xs font-bold uppercase tracking-[.16em] text-primary">Evidence to inspect</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">The route component only installs the theme and renders this page. The former diagram, focus filters, and prompt-copy control were removed because their presentation implied capabilities that this implementation did not provide.</p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
            <Link className="text-primary underline underline-offset-4" href="/hearst-plus-reference/#design-agent-architecture">Consolidated reference</Link>
            <span className="text-muted-foreground">src/app/design-agent/page.tsx</span>
            <span className="text-muted-foreground">src/components/design-agent-page.tsx</span>
          </div>
        </section>
      </main>
      <ProductFooter />
    </div>
  );
}
