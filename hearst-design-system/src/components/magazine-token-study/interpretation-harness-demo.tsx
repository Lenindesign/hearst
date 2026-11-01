"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type InspectionTarget = "image" | "headline" | "summary" | "byline" | "date";
type PreviewWidth = 390 | 640 | 960;
type PreviewBrand = "hearst-plus" | "car-and-driver";

const targetLabels: Record<InspectionTarget, string> = {
  image: "Hero image · img",
  headline: "Headline · h1",
  summary: "Summary · p",
  byline: "Byline · p",
  date: "Publication date · time",
};

const widths: PreviewWidth[] = [390, 640, 960];

export function InterpretationHarnessDemo() {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<InspectionTarget>("headline");
  const [headline, setHeadline] = useState("The electric SUV built for a bigger kind of adventure");
  const [summary, setSummary] = useState("Three rows, a quiet cabin, and useful range make this family EV feel ready for the long way home.");
  const [byline, setByline] = useState("By Hannah Elliott");
  const [date, setDate] = useState("2026-10-31");
  const [imageAlt, setImageAlt] = useState("A red sports car on a sunlit road");
  const [brand, setBrand] = useState<PreviewBrand>("car-and-driver");
  const [width, setWidth] = useState<PreviewWidth>(640);
  const [computed, setComputed] = useState({
    font: "—", size: "—", lineHeight: "—", color: "—", weight: "—", width: "—",
    height: "—", objectFit: "—", ratio: "—",
  });
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previewRefs = useRef<Record<InspectionTarget, HTMLElement | null>>({
    image: null, headline: null, summary: null, byline: null, date: null,
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const node = previewRefs.current[target];
    if (!node) return;
    const style = window.getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    setComputed({
      font: style.fontFamily.split(",")[0].replaceAll('"', ""),
      size: style.fontSize,
      lineHeight: style.lineHeight,
      color: style.color,
      weight: style.fontWeight,
      width: `${Math.round(rect.width)}px`,
      height: `${Math.round(rect.height)}px`,
      objectFit: node instanceof HTMLImageElement ? style.objectFit : "—",
      ratio: node instanceof HTMLImageElement && rect.height > 0 ? (rect.width / rect.height).toFixed(2) : "—",
    });
  }, [target, headline, summary, byline, date, imageAlt, width, brand, open]);

  const close = () => setOpen(false);
  const targetOptions = Object.keys(targetLabels) as InspectionTarget[];
  const computedRows: [string, string][] = target === "image"
    ? [["Alt text", imageAlt], ["Object fit", computed.objectFit], ["Aspect ratio", computed.ratio], ["Rendered size", `${computed.width} × ${computed.height}`]]
    : [["Font", computed.font], ["Font size", computed.size], ["Line height", computed.lineHeight], ["Weight", computed.weight], ["Color", computed.color], ["Rendered width", computed.width]];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-8 inline-flex min-h-11 items-center justify-center border border-primary bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Try the interpretation harness
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="interpretation-harness-title"
        onClose={close}
        onCancel={close}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
        className="m-auto max-h-[min(92dvh,900px)] w-[min(1180px,calc(100%-2rem))] max-w-none overflow-auto border border-border bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/60"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-background px-5 py-4 md:px-7">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-primary">Browser-native prototype</p>
            <h2 id="interpretation-harness-title" className="mt-1 text-xl font-semibold">Interpretation harness</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Inspect a complete editorial card in the browser. No AI service or external page is connected.</p>
          </div>
          <button type="button" onClick={close} aria-label="Close interpretation harness" className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-2xl leading-none hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary">×</button>
        </div>

        <div className="grid lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="border-b border-border bg-muted/30 p-5 lg:border-b-0 lg:border-r md:p-6" aria-label="Harness controls">
            <label className="block text-xs font-semibold" htmlFor="harness-target">Inspect card element</label>
            <select id="harness-target" value={target} onChange={(event) => setTarget(event.target.value as InspectionTarget)} className="mt-2 min-h-11 w-full border border-border bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-primary">
              {targetOptions.map((item) => <option key={item} value={item}>{targetLabels[item]}</option>)}
            </select>

            {target === "headline" ? (
              <label className="mt-5 block text-xs font-semibold" htmlFor="harness-headline">Headline text
                <textarea id="harness-headline" value={headline} onChange={(event) => setHeadline(event.target.value)} rows={3} className="mt-2 w-full resize-y border border-border bg-background px-3 py-2 text-sm font-normal leading-5 focus-visible:outline-2 focus-visible:outline-primary" />
              </label>
            ) : null}
            {target === "summary" ? (
              <label className="mt-5 block text-xs font-semibold" htmlFor="harness-summary">Summary text
                <textarea id="harness-summary" value={summary} onChange={(event) => setSummary(event.target.value)} rows={4} className="mt-2 w-full resize-y border border-border bg-background px-3 py-2 text-sm font-normal leading-5 focus-visible:outline-2 focus-visible:outline-primary" />
              </label>
            ) : null}
            {target === "byline" ? (
              <label className="mt-5 block text-xs font-semibold" htmlFor="harness-byline">Byline
                <input id="harness-byline" value={byline} onChange={(event) => setByline(event.target.value)} className="mt-2 min-h-11 w-full border border-border bg-background px-3 text-sm font-normal focus-visible:outline-2 focus-visible:outline-primary" />
              </label>
            ) : null}
            {target === "date" ? (
              <label className="mt-5 block text-xs font-semibold" htmlFor="harness-date">Publication date
                <input id="harness-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-2 min-h-11 w-full border border-border bg-background px-3 text-sm font-normal focus-visible:outline-2 focus-visible:outline-primary" />
              </label>
            ) : null}
            {target === "image" ? (
              <label className="mt-5 block text-xs font-semibold" htmlFor="harness-alt">Image alt text
                <input id="harness-alt" value={imageAlt} onChange={(event) => setImageAlt(event.target.value)} className="mt-2 min-h-11 w-full border border-border bg-background px-3 text-sm font-normal focus-visible:outline-2 focus-visible:outline-primary" />
              </label>
            ) : null}

            <fieldset className="mt-6">
              <legend className="text-xs font-semibold">Card width</legend>
              <div className="mt-2 grid grid-cols-3 gap-1">
                {widths.map((item) => (
                  <button key={item} type="button" aria-pressed={width === item} onClick={() => setWidth(item)} className={`min-h-10 border px-2 text-xs font-semibold ${width === item ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted"}`}>{item}px</button>
                ))}
              </div>
            </fieldset>

            <label className="mt-6 block border-t border-border pt-4 text-xs font-semibold" htmlFor="harness-brand">Brand theme
              <select id="harness-brand" value={brand} onChange={(event) => setBrand(event.target.value as PreviewBrand)} className="mt-2 min-h-11 w-full border border-border bg-background px-3 text-sm font-normal focus-visible:outline-2 focus-visible:outline-primary">
                <option value="hearst-plus">Hearst+ default</option>
                <option value="car-and-driver">Car and Driver</option>
              </select>
              <span className="mt-2 block font-normal leading-5 text-muted-foreground">Switches the card’s headline font and brand color using the selected theme.</span>
            </label>

            <div className="mt-6 border-t border-border pt-4">
              <p className="text-xs font-semibold">Semantic structure</p>
              <pre className="mt-2 overflow-x-auto border border-border bg-background p-3 text-[11px] leading-5 text-muted-foreground">{`<article>\n  <img />\n  <h1>${headline}</h1>\n  <p>${summary}</p>\n  <p>${byline}</p>\n  <time>${date}</time>\n</article>`}</pre>
            </div>
          </aside>

          <div className="min-w-0 p-5 md:p-7">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[.14em] text-primary">Live browser preview</p>
                <p className="mt-1 text-sm text-muted-foreground">Inspecting: <code className="font-mono text-foreground">{targetLabels[target]}</code></p>
              </div>
              <span className="text-xs text-muted-foreground">Card width: up to {width}px</span>
            </div>

            <div className="mt-4 bg-muted/40 p-3 md:p-5">
              <article data-brand={brand === "car-and-driver" ? "car-and-driver" : undefined} className="mx-auto w-full overflow-hidden rounded-[8px] bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)] [container-type:inline-size]" style={{ maxWidth: `${width}px` }}>
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <Image
                    ref={(node) => { previewRefs.current.image = node; }}
                    src="/images/hearst-autos-onboarding.avif"
                    alt={imageAlt}
                    width={1600}
                    height={900}
                    sizes="(max-width: 640px) 100vw, 960px"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-5 sm:p-7">
                  <p className={`text-xs font-extrabold uppercase tracking-[.12em] ${brand === "car-and-driver" ? "text-[var(--brand-primary)]" : "text-primary"}`}>{brand === "car-and-driver" ? "Car and Driver" : "Hearst+"} <span aria-hidden="true">·</span> EVs</p>
                  <h1 ref={(node) => { previewRefs.current.headline = node; }} className={`harness-card-headline mt-3 line-clamp-3 text-[clamp(1.5rem,4.5cqi,2rem)] font-bold leading-[1.08] tracking-[-.02em] text-foreground ${brand === "hearst-plus" ? "font-[var(--hp-font-headline)]" : ""}`}>{headline}</h1>
                  <p ref={(node) => { previewRefs.current.summary = node; }} className="mt-3 line-clamp-3 max-w-[68ch] text-[clamp(1rem,2.2cqi,1.125rem)] leading-[1.55] text-muted-foreground">{summary}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
                    <p ref={(node) => { previewRefs.current.byline = node; }} className="font-medium text-foreground">{byline}</p>
                    <span aria-hidden="true">·</span>
                    <time ref={(node) => { previewRefs.current.date = node; }} dateTime={date}>
                      {date ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`)) : "Choose a date"}
                    </time>
                  </div>
                </div>
              </article>
            </div>

            <section className="mt-5" aria-labelledby="computed-style-title">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 id="computed-style-title" className="text-sm font-semibold">Computed in this browser</h3>
                <span className="text-[11px] text-muted-foreground">Measured from the selected card element</span>
              </div>
              <dl className={`mt-3 grid grid-cols-2 gap-px border border-border bg-border ${target === "image" ? "sm:grid-cols-4" : "sm:grid-cols-3 lg:grid-cols-6"}`}>
                {computedRows.map(([label, value]) => (
                  <div key={label} className="min-w-0 bg-background p-3">
                    <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</dt>
                    <dd className="mt-1 break-words font-mono text-xs">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <p className="mt-5 border border-border bg-muted/40 p-4 text-xs leading-5 text-muted-foreground">This demo shows the inspection pattern on a full card. It does not read a live magazine site, infer a full design system, or generate production code; those connections need explicit browser capture, source access, and validation.</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
