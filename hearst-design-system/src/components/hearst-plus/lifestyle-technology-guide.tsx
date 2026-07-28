import packageJson from "../../../package.json";

export function LifestylePersonalizationRulesGuide() {
  const rules = [
    {
      number: "1",
      title: "Start with eligible content",
      body: "Use stories from the active Hearst destination and category. Remove hidden, duplicate, excluded, or unplayable items before ranking begins.",
      proof: "Change destination, category, or brand filters.",
    },
    {
      number: "2",
      title: "Build an editorial baseline",
      body: "Popularity, freshness, and a configured editorial starting point keep a first visit useful even when little or no reader history exists.",
      proof: "Reset the demo to see the first-visit edition.",
    },
    {
      number: "3",
      title: "Add reader intent",
      body: "Followed topics and brands, saved-story tags, and More Like This behavior raise relevant stories. Hides remove a story from future consideration.",
      proof: "Apply a behavior preset, save, hide, or choose More Like This.",
    },
    {
      number: "4",
      title: "Adapt to the moment",
      body: "Time of day and return-visit freshness change the mission. The previous lead is deliberately reduced so the experience can feel new when a reader comes back.",
      proof: "Change the time or simulate a return visit.",
    },
    {
      number: "5",
      title: "Apply experience guardrails",
      body: "Brand and topic diversity prevent repetition. The slideshow keeps the personalized order while balancing editorial stories, current articles, and playable videos.",
      proof: "Compare the river and all five featured slides.",
    },
    {
      number: "6",
      title: "Explain the result",
      body: "The score panel shows why the current lead won. The same scoring model orders the river and rescoring happens again before the slideshow applies its mix rules.",
      proof: "Watch the score and lead update together.",
    },
  ];

  return (
    <section
      className="mt-4 overflow-hidden rounded-[8px] border border-border bg-card text-foreground"
      aria-labelledby="personalization-rules-title"
    >
      <div className="border-b border-border p-4 sm:p-5">
        <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
          How personalization works
        </p>
        <h2 id="personalization-rules-title" className="headline mt-1 text-2xl leading-tight">
          One ranking model, shaped by clear editorial guardrails.
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Personalization does not invent or rewrite content. It decides which eligible Hearst stories
          appear first, then the content model chooses the right card treatment. Use these six rules as
          the stakeholder talk track.
        </p>
      </div>

      <ol className="grid md:grid-cols-2 xl:grid-cols-3">
        {rules.map((rule) => (
          <li
            key={rule.number}
            className="border-b border-border p-4 last:border-b-0 md:[&:nth-child(odd)]:border-r xl:[&:nth-child(odd)]:border-r-0 xl:[&:not(:nth-child(3n))]:border-r xl:[&:nth-last-child(-n+3)]:border-b-0"
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {rule.number}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-bold leading-5">{rule.title}</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{rule.body}</p>
                <p className="mt-3 text-xs leading-5">
                  <span className="font-bold">Show it:</span>{" "}
                  <span className="text-muted-foreground">{rule.proof}</span>
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="border-t border-border bg-muted/50 px-4 py-3 text-xs leading-5 text-muted-foreground sm:px-5">
        <span className="font-bold text-foreground">Stakeholder summary:</span>{" "}
        editorial quality sets the foundation; reader behavior and context improve relevance; diversity,
        exclusions, and playable-media rules protect the final experience.
      </div>
    </section>
  );
}

export function LifestyleTechnologyGuide() {
  const dependencyVersion = (dependency: keyof typeof packageJson.dependencies) =>
    packageJson.dependencies[dependency].replace(/^[^0-9]*/, "");
  const devDependencyVersion = (dependency: keyof typeof packageJson.devDependencies) =>
    packageJson.devDependencies[dependency].replace(/^[^0-9]*/, "");
  const stack = [
    {
      label: "Application",
      title: `Next.js ${dependencyVersion("next")} + React ${dependencyVersion("react")}`,
      body: "The experience uses the Next.js App Router for pages, server-rendered entry points, route handlers, image optimization, and React-powered interaction.",
    },
    {
      label: "Language",
      title: `TypeScript ${devDependencyVersion("typescript")}`,
      body: "Typed story, video, profile, and personalization models keep data contracts explicit across server and browser code.",
    },
    {
      label: "Interface",
      title: `Tailwind CSS ${devDependencyVersion("tailwindcss")} + HDS tokens`,
      body: "Tailwind handles responsive composition while Hearst Design System semantic tokens control shared surfaces, typography, color, spacing, and brand themes.",
    },
    {
      label: "Components",
      title: `shadcn ${dependencyVersion("shadcn")} + Base UI ${dependencyVersion("@base-ui/react")}`,
      body: "Reusable controls follow shadcn/ui composition conventions and use accessible Base UI primitives, with Phosphor supplying the icon set.",
    },
    {
      label: "Content",
      title: "Hearst feeds + Personalize",
      body: "Server routes combine public Hearst RSS story metadata with playable Personalize video recommendations, then the product applies eligibility and ranking rules.",
    },
    {
      label: "Delivery",
      title: `Netlify Next.js plugin ${dependencyVersion("@netlify/plugin-nextjs")}`,
      body: "Production builds and Next.js server functions are deployed through Netlify's official Next.js integration, with optimized static assets served through its CDN.",
    },
  ];

  return (
    <section
      className="mt-4 overflow-hidden rounded-[8px] border border-border bg-card text-foreground"
      aria-labelledby="technology-guide-title"
    >
      <div className="border-b border-border p-4 sm:p-5">
        <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
          Technology
        </p>
        <h2 id="technology-guide-title" className="headline mt-1 text-2xl leading-tight">
          A modern web stack built on the Hearst Design System.
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          This is a working reader prototype, not a static mock. The interface, ranking behaviors,
          responsive layouts, video playback, and route transitions run in the browser against live or
          cached content feeds.
        </p>
      </div>

      <dl className="grid md:grid-cols-2 xl:grid-cols-3">
        {stack.map((item) => (
          <div
            key={item.label}
            className="border-b border-border p-4 last:border-b-0 md:[&:nth-child(odd)]:border-r xl:[&:nth-child(odd)]:border-r-0 xl:[&:not(:nth-child(3n))]:border-r xl:[&:nth-last-child(-n+3)]:border-b-0"
          >
            <dt className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
              {item.label}
            </dt>
            <dd>
              <h3 className="mt-2 text-sm font-bold leading-5">{item.title}</h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.body}</p>
            </dd>
          </div>
        ))}
      </dl>

      <div className="border-t border-border bg-muted/50 px-4 py-3 text-xs leading-5 text-muted-foreground sm:px-5">
        <span className="font-bold text-foreground">Executive note:</span>{" "}
        version labels above are read from the build manifest. Reader preferences and comments in this
        prototype are browser-local demo state; production identity, publishing, analytics, and consent
        systems are not represented as completed integrations.
      </div>
    </section>
  );
}
