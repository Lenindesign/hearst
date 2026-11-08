import type { Metadata } from "next";

import { ButtonBrandPreview, ButtonStyleLink } from "@/components/cta-specs/button-brand-preview";
import { ProductFooter, ProductHeader } from "@/components/product-story-shell";
import { PROD_STORYBOOK_URL } from "@/lib/storybook-links";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "CTA Specifications | Hearst+",
  description: "The shared Button primitive: measured sizes, padding, radius tokens, variants, states, label casing and a dimensional drawing.",
};

const storybookUrl = `${PROD_STORYBOOK_URL.split("?")[0]}?path=/story/hearst-plus-hds-primitives-button--all-sizes&globals=brand:cosmopolitan`;

/** Measured in Storybook (Chromium, fonts loaded) under Cosmopolitan, Esquire and Hearst+. Identical in all three. */
const sizeRows = [
  ["xs", "h-6", "24", "8", "6", "4", "12", "12 / 16", "Dense tooling only"],
  ["sm", "h-7", "28", "10", "6", "4", "14", "12.8 / 19.2", "Compact desktop rows"],
  ["default", "h-8", "32", "10", "8", "6", "16", "14 / 20", "Standard desktop action"],
  ["lg", "h-9", "36", "10", "12", "6", "16", "14 / 20", "Prominent desktop action"],
  ["touch", "min-h-11", "44", "16", "14", "8", "16", "14 / 20", "Phones and primary actions"],
] as const;

const iconRows = [
  ["icon-xs", "24 × 24", "12", "6"],
  ["icon-sm", "28 × 28", "16", "6"],
  ["icon", "32 × 32", "16", "8"],
  ["icon-lg", "36 × 36", "16", "10"],
  ["icon-touch", "44 × 44", "16", "14"],
] as const;

const variantRows = [
  ["default", "Primary", "primary-solid", "The one main action in a task area."],
  ["secondary", "Secondary", "secondary-solid", "A strong alternative, or a pressed / expanded toggle."],
  ["outline", "Outline", "neutral-outlined", "Neutral secondary action; the most used variant."],
  ["ghost", "Ghost", "neutral-transparent", "Low-emphasis action inside dense UI."],
  ["link", "Link", "primary-transparent", "Inline action that reads as text; underlines on hover."],
  ["destructive", "Destructive", "destructive role", "Removal or irreversible actions; confirm when the impact warrants it."],
] as const;

const radiusRows = [
  ["0", "Square", "Cosmopolitan, Car and Driver and most publication themes"],
  ["4", "Soft corner", "Hearst+ product surfaces (.hearst-plus-theme)"],
  ["64", "Pill (renders as H ÷ 2)", "Esquire"],
] as const;

const stateRows = [
  ["Hover", "Swaps to the variant's -hover background, border and content tokens.", ":hover"],
  ["Active / expanded", "Swaps to the -active tokens; also applies while aria-expanded=\"true\".", ":active, aria-expanded"],
  ["Focus visible", "Border takes the ring color plus a 3 px ring at 50% opacity. Never remove it.", "focus-visible:ring-3"],
  ["Disabled", "50% opacity and no pointer events. Explain the unmet requirement nearby.", "disabled"],
  ["Loading", "Spinner takes the leading icon slot; aria-busy and disabled stop duplicate submits.", "loading prop"],
  ["Invalid", "Destructive border and ring when the control's form value is invalid.", "aria-invalid"],
] as const;

const casingRules = [
  ["Sentence case", "Default for every action. Start with a verb and say what happens.", "Save story · Estimate payment · Join this week’s challenge"],
  ["Title Case", "Only to keep a proper name or a brand-owned phrase intact.", "Open Men’s Health · Read the Daily Brief"],
  ["ALL CAPS", "Short utility labels where a brand requires it. Type the caps; don’t use CSS uppercase. Button optically centers labels without descenders by default (capAlignedLabel=\"auto\").", "SIGN IN · PLAY"],
] as const;

const checklist = [
  "Navigation is a link; an action or state change is a button. Links borrow the look with buttonVariants().",
  "Use the shared Button. Don’t hand-roll heights, padding, radius or colors.",
  "On phones use touch or icon-touch, or give a dense control a 44 px hit area.",
  "Write a short sentence-case label that starts with a verb and names what happens: “Read the review”, not “Click here”.",
  "Reuse the approved label for the intent: Sign up, Start free trial, Save story, Watch video, See all {thing}.",
  "One primary action per task area; demote the rest to outline, ghost or link.",
  "Icon-only buttons and repeated labels like “Read more” need a unique accessible name.",
  "New-tab links are for third parties only and say so; ad links add rel=\"sponsored\".",
  "Async actions use loading; toggles change their label and aria-pressed (Save → Saved).",
  "Check hover, active, focus-visible, disabled, loading and invalid in at least two brands with different radii.",
] as const;

function SectionHeading({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-muted-foreground">{eyebrow}</p>
      <h2 id={id} className="headline mt-3 text-3xl leading-tight sm:text-4xl">{title}</h2>
      {children ? <p className="mt-3 leading-7 text-muted-foreground">{children}</p> : null}
    </div>
  );
}

function SpecTable({ caption, headers, rows, numeric = [] }: { caption: string; headers: string[]; rows: readonly (readonly string[])[]; numeric?: number[] }) {
  return (
    <div className="overflow-x-auto rounded-card bg-card shadow-[var(--hp-shadow-card)]">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={header} scope="col" className={cn("border-b border-border px-4 py-3 text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-muted-foreground", numeric.includes(index) && "text-right")}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-b border-border last:border-b-0">
              {row.map((cell, index) => (
                <td key={`${row[0]}-${index}`} className={cn("px-4 py-3 align-top leading-6", index === 0 && "font-semibold", numeric.includes(index) && "text-right tabular-nums")}>
                  {index === 0 ? <code>{cell}</code> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const sectionClass = "scroll-mt-24 space-y-6 border-t border-border pt-10";

export default function CTASpecsPage() {
  return (
    <div className="hearst-plus-theme min-h-screen bg-background font-sans text-foreground">
      <ProductHeader current="cta-specs" />
      <main className="mx-auto max-w-[1360px] space-y-14 px-5 py-10 md:px-10 md:py-16">
        <header className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-muted-foreground">HDS primitives · Button</p>
          <h1 className="headline mt-4 text-balance text-4xl leading-[1.05] sm:text-6xl">CTA specifications</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            Every call to action in Hearst+ comes from one primitive, <code className="text-foreground">ui/button.tsx</code>. Its geometry is the same in every brand; the brand theme only changes color and corner radius through tokens. All values on this page were measured from the rendered component in Storybook.
          </p>
          <nav aria-label="On this page" className="mt-7 flex flex-wrap gap-2">
            {[["Live reference", "#live"], ["Drawing", "#drawing"], ["Sizes", "#sizes"], ["Variants", "#variants"], ["States", "#states"], ["Label case", "#label-case"], ["Checklist", "#checklist"]].map(([label, href]) => (
              <ButtonStyleLink key={href} href={href} variant="ghost" className="px-3">{label}</ButtonStyleLink>
            ))}
          </nav>
        </header>

        <section aria-labelledby="live" className={sectionClass}>
          <SectionHeading id="live" eyebrow="01 · Live reference" title="The real component, under a real brand theme.">
            These are the production Button and the same brand-token merge Storybook uses. Switch brands to see the radius token move between square, soft and pill while every size stays put.
          </SectionHeading>
          <ButtonBrandPreview />
          <ButtonStyleLink href={storybookUrl} external>Open the Button stories in Storybook</ButtonStyleLink>
        </section>

        <section aria-labelledby="drawing" className={sectionClass}>
          <SectionHeading id="drawing" eyebrow="02 · Dimensional drawing" title="UI-BTN-001 · action button.">
            Plan of the touch size with a trailing icon, radius detail, the full size ladder, icon-only sizes, the 44 px hit area, layers, loading and states. Every code on the sheet is listed in its tables.
          </SectionHeading>
          <figure className="min-w-0">
            <div className="overflow-x-auto rounded-card bg-white shadow-[var(--hp-shadow-card)]">
              {/* eslint-disable-next-line @next/next/no-img-element -- static vector drawing */}
              <img
                src="/specs/button-drawing.svg"
                width={1700}
                height={1060}
                alt="Dimensional drawing of the action button: plan view at 4:1 with S3 16 padding, G3 8 gap, I1 16 icon and 44 minimum height; radius detail for 0, 4 and pill; size ladder 24, 28, 32, 36 and 44; icon-only squares; hit-area detail; exploded layers; loading and six states, with spacing, size, type, radius and state tables."
                className="block h-auto w-full min-w-[960px]"
              />
            </div>
            <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
              <span>Rev A · 2026-11-07 · CSS px · scale noted per view</span>
              <ButtonStyleLink href="/specs/button-drawing.html">Open the full sheet with notes</ButtonStyleLink>
            </figcaption>
          </figure>
          <figure className="min-w-0">
            <video
              src="/specs/button-film.mp4"
              poster="/specs/button-drawing.svg"
              controls
              muted
              playsInline
              preload="metadata"
              aria-label="Motion film of the action button drawing: the plan draws in from the icon end, the camera pulls back, the three layers lift apart, the full sheet resolves, then the camera tours the size ladder, icon-only sizes and hit area, loading and optical-centering details, states, and variable tables before pulling back to the full sheet."
              className="block aspect-video w-full rounded-card bg-white shadow-[var(--hp-shadow-card)]"
            />
            <figcaption className="mt-3 text-sm text-muted-foreground">Motion film · 29.5 s · the plan draws in, the layers lift, the sheet resolves, then a detail tour: size ladder, icon-only sizes and hit area, loading, optical centering, states and tables.</figcaption>
          </figure>
        </section>

        <section aria-labelledby="sizes" className={sectionClass}>
          <SectionHeading id="sizes" eyebrow="03 · Sizes" title="Five text sizes, five icon-only sizes.">
            Only touch and icon-touch reach the 44 px touch minimum. The other sizes are for pointer-first, dense layouts; on phones, give them a 44 px hit area or use touch.
          </SectionHeading>
          <SpecTable
            caption="Text button sizes"
            headers={["Size", "Utility", "Height", "Side pad", "Icon-side pad", "Gap", "Icon", "Type / line", "Use"]}
            rows={sizeRows}
            numeric={[2, 3, 4, 5, 6]}
          />
          <SpecTable
            caption="Icon-only button sizes"
            headers={["Size", "Box", "Icon", "Inset (Z − I) ÷ 2"]}
            rows={iconRows}
            numeric={[2, 3]}
          />
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            All sizes: 1 px border, font weight 500, width hugs the label. Radius comes from <code className="text-foreground">--component-button-radius-default</code> and renders as min(token, height ÷ 2).
          </p>
          <SpecTable caption="Radius token values by theme" headers={["Token", "Shape", "Where"]} rows={radiusRows} />
        </section>

        <section aria-labelledby="variants" className={sectionClass}>
          <SectionHeading id="variants" eyebrow="04 · Variants and color" title="Pick the intent; the theme picks the color.">
            Each variant reads a family of component tokens: <code className="text-foreground">--component-button-{"{background,border,content}"}-{"{family}"}-{"{default,hover,active}"}</code>. Never hardcode a brand color on a CTA.
          </SectionHeading>
          <SpecTable caption="Button variants" headers={["Variant", "Name", "Token family", "When to use"]} rows={variantRows} />
        </section>

        <section aria-labelledby="states" className={sectionClass}>
          <SectionHeading id="states" eyebrow="05 · States" title="Same geometry in every state.">
            States only swap tokens, opacity and the focus ring, so nothing shifts when a button is hovered, pressed or loading.
          </SectionHeading>
          <SpecTable caption="Button states" headers={["State", "Behavior", "Trigger"]} rows={stateRows} />
        </section>

        <section aria-labelledby="label-case" className={sectionClass}>
          <SectionHeading id="label-case" eyebrow="06 · Label case" title="Sentence case is the default.">
            Labels are short, start with a verb and say what happens next.
          </SectionHeading>
          <SpecTable caption="Label casing rules" headers={["Treatment", "When to use it", "Examples"]} rows={casingRules} />
        </section>

        <section aria-labelledby="checklist" className={sectionClass}>
          <SectionHeading id="checklist" eyebrow="07 · Checklist" title="Before you ship a CTA." />
          <ol className="grid gap-3 md:grid-cols-2">
            {checklist.map((item, index) => (
              <li key={item} className="flex gap-4 rounded-card bg-card p-5 leading-6 shadow-[var(--hp-shadow-card)]">
                <span className="font-bold tabular-nums text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Today the app renders the primitive at 182 call sites, and 3 links borrow its look through <code className="text-foreground">buttonVariants()</code>.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonStyleLink href="/specs/blocks-spec.html">Open the blocks, cards and widgets spec</ButtonStyleLink>
            <ButtonStyleLink href="/hearst-plus-reference/">Open the Hearst+ product reference</ButtonStyleLink>
          </div>
        </section>
      </main>
      <ProductFooter />
    </div>
  );
}
