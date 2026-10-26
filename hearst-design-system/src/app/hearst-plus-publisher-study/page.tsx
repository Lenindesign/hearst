import type { Metadata } from "next";
import Link from "next/link";
import { HearstPlusStudyShell, StudySection, StudySource } from "@/components/hearst-plus-study-shell";

export const metadata: Metadata = {
  title: "Hearst+ Publisher Impact Study",
  description: "Research and a measurement model for ensuring Hearst+ strengthens the 29 original Hearst magazine brands.",
};

export default function HearstPlusPublisherStudyPage() {
  return (
    <HearstPlusStudyShell
      eyebrow="Hearst+ · Publisher impact study · 25 October 2026"
      title="Can Hearst+ help the original brands?"
      description="What aggregation research can tell us, where it can hurt publisher value, and how to make benefit measurable for each of Hearst’s 29 magazine brands."
    >
      <section className="grid gap-8 md:grid-cols-[.85fr_1.15fr]" aria-labelledby="publisher-study-finding">
        <div><p className="text-xs font-bold uppercase tracking-[.15em] text-primary">Finding</p><h2 id="publisher-study-finding" className="mt-3 font-serif text-3xl leading-tight md:text-4xl">Discovery can grow a brand. Full in-app consumption can replace its visit.</h2></div>
        <div className="space-y-4 text-sm leading-7 text-muted-foreground md:text-base">
          <p>Published research finds both audience expansion and business stealing. The outcome changes with the format, excerpt depth, audience, and publisher economics. The studies available here mostly examine news sites, not a group of magazine titles owned by one company.</p>
          <p className="font-semibold text-foreground">There is no evidence that a canonical tag, source logo, or 29-brand portfolio guarantees that each original site will benefit. The defensible policy is to make source traffic intentional, share in-app value under clear terms, and evaluate results title by title.</p>
        </div>
      </section>

      <StudySection eyebrow="Research evidence" title="The evidence is mixed, and none of it is a Hearst forecast.">
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-muted/60 text-foreground"><tr><th className="p-3 font-semibold">Study</th><th className="p-3 font-semibold">Finding</th><th className="p-3 font-semibold">Limit</th></tr></thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              <tr><td className="p-3 font-medium text-foreground">Roos, Mela &amp; Shachar (2020)</td><td className="p-3">A model of links among five U.S. celebrity-news sites found a small positive aggregate traffic effect, while some readers became less likely to visit a linked site.</td><td className="p-3">U.S. celebrity sites, frequent readers, browsing data from late 2009; modeled effects, not a 29-title magazine app.</td></tr>
              <tr><td className="p-3 font-medium text-foreground">Athey, Mobius &amp; Pal (NBER 28746)</td><td className="p-3">After Google News shut down in Spain, affected users consumed less news and recorded fewer page views at other publishers; the reduction was concentrated at smaller publishers.</td><td className="p-3">An external news aggregator and a country-specific natural experiment; not internal brand discovery or licensed full reads.</td></tr>
              <tr><td className="p-3 font-medium text-foreground">Calzada &amp; Gil (2019)</td><td className="p-3">Research across Spain and Germany found effects on visits and ad economics that vary by outlet; the authors identify a net market-expansion effect.</td><td className="p-3">Different legal and competitive setting, and no direct measure of a Hearst-owned bundle’s title-level value transfer.</td></tr>
              <tr><td className="p-3 font-medium text-foreground">Jeon &amp; Nasr (2016)</td><td className="p-3">Their competition model identifies readership expansion versus business stealing; publisher profits are ambiguous.</td><td className="p-3">A theoretical newspaper-market model, not a forecast for Hearst magazine economics.</td></tr>
            </tbody>
          </table>
        </div>
        <p><strong className="text-foreground">Interpretation:</strong> Links and previews are plausible discovery tools; reproducing a complete content experience in the aggregator adds a substitution risk. Public research cannot quantify the net change for Hearst.</p>
      </StudySection>

      <StudySection eyebrow="The search question" title="Canonical metadata does not create a publisher visit.">
        <p>A canonical URL is a search-engine signal about which similar page should represent a set. It does not redirect readers, log a source-site page view, share ad revenue, or guarantee which URL a search engine selects. Google specifically says `rel=canonical` is not recommended to prevent duplication from syndicated partners because the pages are often different; its guidance points to blocking indexing as the more effective option. SEO owners should set the right search policy for each actual content mode, rather than applying one blanket canonical rule.</p>
        <p>Measure four things separately: source identity displayed to readers, outbound click, source-site engaged visit, and downstream commercial value. A click does not prove a page loaded or was read. For in-app reading, use a publisher credit or revenue-share rule; do not call it a source-site page view.</p>
        <p className="flex flex-wrap gap-x-4 gap-y-2"><a className="font-semibold text-foreground underline underline-offset-4" href="https://developers.google.com/search/docs/crawling-indexing/canonicalization" target="_blank" rel="noreferrer">Google: canonicalization</a><a className="font-semibold text-foreground underline underline-offset-4" href="https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting" target="_blank" rel="noreferrer">Google: syndicated content and canonicals</a><a className="font-semibold text-foreground underline underline-offset-4" href="https://support.google.com/analytics/answer/13566436" target="_blank" rel="noreferrer">GA4: outbound clicks</a></p>
      </StudySection>

      <StudySection eyebrow="Where value shifts" title="A portfolio can grow while one title loses.">
        <div className="grid gap-px border border-border bg-border md:grid-cols-2">
          <div className="bg-background p-5"><h3 className="font-semibold text-foreground">Reading stays in Hearst+</h3><p className="mt-2">Full articles, galleries, and video may satisfy the need without generating a brand-site visit or its ad impressions.</p></div>
          <div className="bg-background p-5"><h3 className="font-semibold text-foreground">A direct relationship is bypassed</h3><p className="mt-2">The app may skip a publication’s newsletter, registration, app-install, or subscription opportunity.</p></div>
          <div className="bg-background p-5"><h3 className="font-semibold text-foreground">Titles compete inside the portfolio</h3><p className="mt-2">Engagement can shift among brands. A combined Hearst+ number can conceal a decline for an individual title, format, or audience segment.</p></div>
          <div className="bg-background p-5"><h3 className="font-semibold text-foreground">Content rights differ by format</h3><p className="mt-2">Text, photos, video, galleries, commerce, and community posts need separate permissions and value rules. A source URL is not a republication license.</p></div>
        </div>
        <p>Risk and opportunity will differ across 29 brands with different audiences, ad economics, subscription propositions, and formats. Participation should be decided by brand and content mode.</p>
      </StudySection>

      <StudySection eyebrow="Publisher-first model" title="Preview first. License in-app use. Credit the source.">
        <ol className="grid gap-px border border-border bg-border md:grid-cols-3">
          <li className="bg-background p-5"><span className="font-mono text-xs text-primary">01</span><h3 className="mt-2 font-semibold text-foreground">Discovery preview</h3><p className="mt-2">Keep the publisher, author, and source visible. Default to a concise preview and a direct “Continue on [Brand]” link.</p></li>
          <li className="bg-background p-5"><span className="font-mono text-xs text-primary">02</span><h3 className="mt-2 font-semibold text-foreground">Licensed in-app access</h3><p className="mt-2">Use full article, video, or gallery experiences only with brand-approved rights, search treatment, ad model, and commercial credit.</p></li>
          <li className="bg-background p-5"><span className="font-mono text-xs text-primary">03</span><h3 className="mt-2 font-semibold text-foreground">Brand-level accountability</h3><p className="mt-2">Report referrals and source-side engagement separately from in-app use; provide agreed revenue credit and a pause path for each title.</p></li>
        </ol>
        <p>Possible credit models include a negotiated share of net Hearst+ ad/sponsorship revenue, an agreed fee for qualifying in-app use, or a hybrid with referral and conversion reporting. No reviewed evidence establishes a universal rate. Agree on terms with each publisher before launch.</p>
      </StudySection>

      <StudySection eyebrow="How to prove it" title="Measure incremental outcomes for each brand.">
        <p>Set a baseline and outcome thresholds with each pilot brand. Use a randomized exposure or defensible holdout where feasible. Compare the source-site and Hearst+ outcomes together; do not rely on attribution labels alone to prove incrementality.</p>
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[700px] border-collapse text-left text-sm">
            <thead className="bg-muted/60 text-foreground"><tr><th className="p-3 font-semibold">Layer</th><th className="p-3 font-semibold">Measure</th><th className="p-3 font-semibold">Guardrail</th></tr></thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              <tr><td className="p-3 font-medium text-foreground">Source site</td><td className="p-3">Engaged visits, page views, ad revenue/yield, subscriptions, registrations, and newsletter signups.</td><td className="p-3">Keep any decline within that title’s pre-agreed tolerance or pause its content mode.</td></tr>
              <tr><td className="p-3 font-medium text-foreground">Hearst+</td><td className="p-3">Reader usefulness, return visits, source clicks, licensed in-app use, and credited value.</td><td className="p-3">Do not improve in-app engagement by suppressing source identity or referrals.</td></tr>
              <tr><td className="p-3 font-medium text-foreground">Portfolio</td><td className="p-3">Incremental audience and total monetization, by brand and format.</td><td className="p-3">Portfolio gains cannot offset an unapproved loss at an individual title.</td></tr>
            </tbody>
          </table>
        </div>
        <p>Define attribution windows, controls, confidence requirements, and pause rules before the pilot. Reconcile Hearst+ outbound clicks with publisher landing events where possible. Include commercial credit for content consumed in Hearst+.</p>
      </StudySection>

      <section className="border-t border-border pt-6" aria-labelledby="publisher-sources">
        <p className="text-xs font-bold uppercase tracking-[.15em] text-primary">Source material</p>
        <h2 id="publisher-sources" className="mt-2 font-serif text-3xl leading-tight md:text-4xl">Studies and guidance</h2>
        <ol className="mt-5 divide-y divide-border border-y border-border">
          <StudySource href="https://journals.sagepub.com/doi/10.1177/0022243720913029" title="Roos, Mela & Shachar (2020), Journal of Marketing Research">The Effect of Links and Excerpts on Internet News Consumption. Model of browsing and linking across five U.S. celebrity-news sites.</StudySource>
          <StudySource href="https://www.nber.org/papers/w28746" title="Athey, Mobius & Pal, NBER Working Paper 28746">The Impact of News Aggregators on Internet News Consumption. Natural experiment around Google News’s shutdown in Spain.</StudySource>
          <StudySource href="https://pubsonline.informs.org/doi/10.1287/mksc.2019.1150" title="Calzada & Gil (2019), Marketing Science">What Do News Aggregators Do? Evidence from Google News in Spain and Germany.</StudySource>
          <StudySource href="https://www.aeaweb.org/articles?id=10.1257/mic.20140151" title="Jeon & Nasr (2016), American Economic Journal: Microeconomics">News Aggregators and Competition among Newspapers on the Internet.</StudySource>
          <StudySource href="https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting" title="Google Search Central">Canonicalization troubleshooting guidance for syndicated content.</StudySource>
          <StudySource href="https://support.google.com/analytics/answer/13566436" title="Google Analytics Help">Measure outbound clicks separately from destination-side engagement.</StudySource>
        </ol>
      </section>

      <section className="border-t border-border pt-6">
        <p className="text-sm leading-6 text-muted-foreground">This is desk research, not a review of Hearst’s production analytics or licensing agreements. The recommendation remains a hypothesis until tested against brand-level audience and revenue data.</p>
        <Link href="/hearst-plus-subscription-study/" className="mt-4 inline-flex min-h-11 items-center font-semibold text-foreground underline underline-offset-4">Read the subscription feasibility study</Link>
      </section>
    </HearstPlusStudyShell>
  );
}
