import type { Metadata } from "next";
import Link from "next/link";
import { HearstPlusStudyShell, StudySection, StudySource } from "@/components/hearst-plus-study-shell";

export const metadata: Metadata = {
  title: "Hearst+ Subscription Feasibility Study",
  description: "Public evidence and a research plan for testing a Hearst+ membership without undermining the original magazine brands.",
};

export default function HearstPlusSubscriptionStudyPage() {
  return (
    <HearstPlusStudyShell
      eyebrow="Hearst+ · Subscription feasibility study · 25 October 2026"
      title="Would readers pay for Hearst+?"
      description="A feasibility study of bundle demand, brand-subscription risks, and the research needed to decide whether an optional paid membership can create new value."
    >
      <section className="grid gap-8 md:grid-cols-[.85fr_1.15fr]" aria-labelledby="subscription-study-conclusion">
        <div><p className="text-xs font-bold uppercase tracking-[.15em] text-primary">Executive conclusion</p><h2 id="subscription-study-conclusion" className="mt-3 font-serif text-3xl leading-tight md:text-4xl">Test an optional membership. Keep discovery free.</h2></div>
        <div className="space-y-4 text-sm leading-7 text-muted-foreground md:text-base">
          <p>Public research suggests bundles can appeal to some readers, but it does not show that a bundle of 29 brands will sell, what it should cost, or whether it will add value beyond existing title subscriptions. Price and a distinct recurring benefit matter more than brand count alone.</p>
          <p className="font-semibold text-foreground">Recommendation: keep free discovery as the reach and referral layer. Test a paid tier only for a specific, brand-approved set of benefits. Preserve individual title subscriptions and prove incremental revenue and retained use before scaling.</p>
        </div>
      </section>

      <StudySection eyebrow="Market and consumer evidence" title="A bundle may help, but ‘more brands’ is not a complete offer.">
        <div className="grid gap-px border border-border bg-border md:grid-cols-3">
          <div className="bg-background p-5"><p className="font-mono text-xs text-primary">17%</p><h3 className="mt-2 font-semibold text-foreground">Paid for online news</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">The 2026 Reuters Institute report found 17% across a 20-country basket had paid for online news in the last year, compared with 18% in 2025. That is a news measure, not magazine-subscription demand.</p></div>
          <div className="bg-background p-5"><p className="font-mono text-xs text-primary">81%</p><h3 className="mt-2 font-semibold text-foreground">Cited direct content benefit</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Among people paying for online news, 81% said direct benefits from content they wanted were at least part of the reason they paid.</p></div>
          <div className="bg-background p-5"><p className="font-mono text-xs text-primary">2,125</p><h3 className="mt-2 font-semibold text-foreground">Australian weekly news users</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">A 2026 choice experiment found price mattered most. Non-news digital services added value; adding more brands increased modeled utility, while more topic categories such as cooking or travel added relatively little.</p></div>
        </div>
        <p>The choice experiment measured hypothetical choices, not actual paid purchases. These findings are useful for shaping a Hearst study, but should not be used as Hearst conversion or pricing estimates.</p>
      </StudySection>

      <StudySection eyebrow="Options to compare" title="Keep free access, paid membership, and title subscriptions distinct.">
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-muted/60 text-foreground"><tr><th className="p-3 font-semibold">Model</th><th className="p-3 font-semibold">Reader proposition</th><th className="p-3 font-semibold">What it can do</th><th className="p-3 font-semibold">Risk to test</th></tr></thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              <tr><td className="p-3 font-medium text-foreground">Free discovery</td><td className="p-3">Personalized river, previews, and direct brand links.</td><td className="p-3">Build reach, habit, referrals, and ad-supported value.</td><td className="p-3">May not create direct reader revenue.</td></tr>
              <tr><td className="p-3 font-medium text-foreground">Optional Hearst+ membership</td><td className="p-3">A distinct cross-brand member proposition plus only approved premium content.</td><td className="p-3">Add recurring revenue and cross-brand convenience.</td><td className="p-3">May replace brand subscriptions or visits if access overlaps.</td></tr>
              <tr><td className="p-3 font-medium text-foreground">Individual brand access</td><td className="p-3">Choose or upgrade a subscription to a specific title.</td><td className="p-3">Preserve title-level customer relationships and value.</td><td className="p-3">More complex entitlements and checkout.</td></tr>
              <tr><td className="p-3 font-medium text-foreground">Paid-only all-access app</td><td className="p-3">One fee unlocks the complete cross-brand inventory.</td><td className="p-3">Simple bundle promise.</td><td className="p-3">Highest paywall friction and greatest potential to substitute for brands.</td></tr>
            </tbody>
          </table>
        </div>
        <p>Do not assume “all 29 brands” is valuable enough by itself. The paid offer should solve a recurring reader need and state clearly what is included. Keep premium, exclusive, or high-converting brand content out until the source brand opts in and its value is accounted for.</p>
      </StudySection>

      <StudySection eyebrow="Hearst+ prototype context" title="The current trial is a placeholder, not a validated price.">
        <p>The newsstand concept currently says seven days free, then <strong className="text-foreground">$X.XX per month</strong>, and labels the figure “Prototype pricing.” The button displays a local confirmation; it does not create an account or process a payment. This should not be interpreted as an approved price, final trial length, or evidence of reader demand.</p>
        <p>The actual pricing range should be selected after finance and subscription teams assemble current title prices, contribution margins, offer economics, subscriber overlap, and competitive alternatives.</p>
      </StudySection>

      <StudySection eyebrow="Proposed research" title="Combine reader interviews, choice testing, and an actual opt-in pilot.">
        <ol className="grid gap-px border border-border bg-border md:grid-cols-2">
          <li className="bg-background p-5"><span className="font-mono text-xs text-primary">01 · Baseline</span><h3 className="mt-2 font-semibold text-foreground">Know current subscription economics</h3><p className="mt-2">Collect price, conversion, churn, renewal, margin, and subscriber-overlap data by title. Include site advertising and direct conversion value for the candidate content.</p></li>
          <li className="bg-background p-5"><span className="font-mono text-xs text-primary">02 · Interviews</span><h3 className="mt-2 font-semibold text-foreground">Find the job a membership should do</h3><p className="mt-2">Talk with cross-brand readers, single-title subscribers, free readers, and lapsed subscribers. Learn what they pay for, use repeatedly, and would not want a bundle to replace.</p></li>
          <li className="bg-background p-5"><span className="font-mono text-xs text-primary">03 · Choice experiment</span><h3 className="mt-2 font-semibold text-foreground">Compare offers at tested prices</h3><p className="mt-2">Randomize a choice-based survey with a “none” option. Compare free discovery, optional membership, and individual title access. Test benefit mix, ads, billing cadence, and transparent terms. Set sample size through power analysis.</p></li>
          <li className="bg-background p-5"><span className="font-mono text-xs text-primary">04 · Paid pilot</span><h3 className="mt-2 font-semibold text-foreground">Validate real behavior over multiple cycles</h3><p className="mt-2">Offer approved benefits at a real price, with clear renewal and cancellation terms. Use a free-access holdout; measure paid activation, sustained use, cancellations, contribution, and each brand’s outcomes.</p></li>
        </ol>
        <p>A “would you pay?” survey is not enough. Use choices among concrete alternatives and confirm them through actual, voluntary purchase behavior before calling the concept viable.</p>
      </StudySection>

      <StudySection eyebrow="Success criteria" title="A bigger subscriber count is not enough.">
        <p><strong className="text-foreground">Primary outcome:</strong> incremental contribution per eligible reader after acquisition, payment, service, content, and publisher-credit costs.</p>
        <p><strong className="text-foreground">Reader outcome:</strong> members activate and repeatedly use the benefits they paid for, then remain paid beyond the introductory offer.</p>
        <p><strong className="text-foreground">Brand guardrails:</strong> measure source-site engaged visits and revenue, standalone subscriptions, and in-app value credit for every participating title. Agree the acceptable range before launch; do not let an average across Hearst hide a negative result for one brand.</p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>The offer attracts incremental paid demand beyond the free baseline.</li>
          <li>Retained paid contribution is positive after full operating costs.</li>
          <li>Every included brand receives its agreed value and meets its own guardrails.</li>
          <li>Protected standalone brand subscriptions are not materially displaced without explicit commercial agreement.</li>
          <li>Readers understand the terms, use the membership, and can cancel easily.</li>
        </ol>
        <p>A 2026 field experiment with more than one million newspaper readers found that auto-renewing trial terms reduced trial take-up by 35% and yielded fewer total paid subscribers over the 20-month observation than auto-cancel terms. This is one newspaper’s experiment, but it is a useful warning against judging a trial by short-term retention alone. <a className="font-semibold text-foreground underline underline-offset-4" href="https://www.aeaweb.org/articles?id=10.1257/aer.20230557" target="_blank" rel="noreferrer">Read the study</a>.</p>
      </StudySection>

      <section className="border-t border-border pt-6" aria-labelledby="subscription-sources">
        <p className="text-xs font-bold uppercase tracking-[.15em] text-primary">Sources</p>
        <h2 id="subscription-sources" className="mt-2 font-serif text-3xl leading-tight md:text-4xl">Research and references</h2>
        <ol className="mt-5 divide-y divide-border border-y border-border">
          <StudySource href="https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2026/dnr-executive-summary" title="Reuters Institute, Digital News Report 2026">Paying for online news, bundling, and reader-revenue context across 20 markets.</StudySource>
          <StudySource href="https://www.tandfonline.com/doi/full/10.1080/16522354.2026.2679885" title="Park et al. (2026), Journal of Media Business Studies">Back to the future? Consumer preferences for bundling news with other content. A choice experiment with 2,125 Australian weekly news users.</StudySource>
          <StudySource href="https://www.aeaweb.org/articles?id=10.1257/aer.20230557" title="Miller, Sahni & Strulov-Shlain, American Economic Review">Sophisticated Consumers with Inertia: Long-Term Implications from a Large-Scale Field Experiment.</StudySource>
          <StudySource href="https://journals.sagepub.com/doi/10.1177/0022243720913029" title="Roos, Mela & Shachar (2020), Journal of Marketing Research">Research on links and excerpts across five celebrity-news sites, relevant to the publisher-impact question.</StudySource>
          <StudySource href="https://www.hearst.com/magazines" title="Hearst Magazines">Public list of Hearst magazine brands. No Hearst customer-level pricing or revenue data was used in this study.</StudySource>
        </ol>
        <Link href="/hearst-plus-publisher-study/" className="mt-5 inline-flex min-h-11 items-center font-semibold text-foreground underline underline-offset-4">Read the publisher impact study</Link>
      </section>
    </HearstPlusStudyShell>
  );
}
