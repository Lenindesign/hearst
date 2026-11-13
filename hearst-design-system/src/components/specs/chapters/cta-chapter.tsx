import { ButtonBrandPreview, ButtonStyleLink } from "@/components/cta-specs/button-brand-preview";
import { SpecChapter, SpecFilm, SpecSection, SpecSheet, SpecTable } from "@/components/specs/spec-kit";
import { brands } from "@/lib/brands";
import { PROD_STORYBOOK_URL } from "@/lib/storybook-links";

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
  ["0", "Square", "Cosmopolitan and most publication themes"],
  ["4", "Soft corner", "Car and Driver; Hearst+ product surfaces (.hearst-plus-theme)"],
  ["64", "Pill (renders as H ÷ 2)", "Esquire"],
] as const;

/** Read from the brand tokens (src/lib/brands.ts), so this table always matches what the Button renders. */
const ctaTypeRows = brands
  .filter((brand) => brand.componentTokens["component-button-font-family"])
  .map((brand) => {
    const t = brand.componentTokens;
    return [
      brand.name,
      String(t["component-button-font-family"]),
      String(t["component-button-font-weight"]),
      t["component-button-text-transform"] === "uppercase" ? "Uppercase" : "As written",
      String(t["component-button-letter-spacing"]),
      `${t["component-button-radius-default"] ?? 0}`,
    ] as const;
  });

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
  ["ALL CAPS", "Brands whose live CTAs are set in capitals get them from the brand token component-button-text-transform: uppercase. Write the label in sentence case in code; screen readers keep it. Don’t type caps or add CSS uppercase in a component. Button optically centers labels without descenders by default (capAlignedLabel=\"auto\").", "Car and Driver · Bicycling · Runner’s World"],
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

export function CtaChapter() {
  return (
    <SpecChapter
      id="cta"
      number="01"
      kicker="HDS primitives · Button"
      title="CTA specifications"
      lede={<p>Every call to action in Hearst+ comes from one primitive, <code className="text-foreground">ui/button.tsx</code>. Its geometry is the same in every brand; the brand theme changes color, corner radius and CTA typography (typeface, weight, case and tracking) through tokens. All values in this chapter were measured from the rendered component in Storybook.</p>}
      contents={[["Live reference", "#cta-live"], ["Drawing", "#cta-drawing"], ["Sizes", "#cta-sizes"], ["Variants", "#cta-variants"], ["States", "#cta-states"], ["Label case", "#cta-label-case"], ["Checklist", "#cta-checklist"]]}
    >
      <SpecSection id="cta-live" kicker="01.1 · Live reference" title="The real component, under a real brand theme." intro={<p>These are the production Button and the same brand-token merge Storybook uses. Switch brands to see the radius token move between square, soft and pill while every size stays put.</p>}>
        <ButtonBrandPreview />
        <ButtonStyleLink href={storybookUrl} external>Open the Button stories in Storybook</ButtonStyleLink>
      </SpecSection>

      <SpecSection id="cta-drawing" kicker="01.2 · Dimensional drawing" title="UI-BTN-001 · action button." intro={<p>Plan of the touch size with a trailing icon, radius detail, the full size ladder, icon-only sizes, the 44 px hit area, layers, loading and states. Every code on the sheet is listed in its tables.</p>}>
        <SpecSheet
          src="/specs/button-drawing.svg"
          width={1700}
          height={1060}
          href="/specs/button-drawing.html"
          caption="Rev A · 2026-11-07 · CSS px · scale noted per view"
          alt="Dimensional drawing of the action button: plan view at 4:1 with S3 16 padding, G3 8 gap, I1 16 icon and 44 minimum height; radius detail for 0, 4 and pill; size ladder 24, 28, 32, 36 and 44; icon-only squares; hit-area detail; exploded layers; loading and six states, with spacing, size, type, radius and state tables."
        />
        <SpecFilm
          src="/specs/button-film.mp4"
          poster="/specs/button-drawing.svg"
          label="Motion film of the action button drawing: the plan draws in from the icon end, the camera pulls back, the three layers lift apart, the full sheet resolves, then the camera tours the size ladder, icon-only sizes and hit area, loading and optical-centering details, states, and variable tables before pulling back to the full sheet."
          caption="Motion film · 29.5 s · the plan draws in, the layers lift, the sheet resolves, then a detail tour: size ladder, icon-only sizes and hit area, loading, optical centering, states and tables."
        />
      </SpecSection>

      <SpecSection id="cta-sizes" kicker="01.3 · Sizes" title="Five text sizes, five icon-only sizes." intro={<p>Only touch and icon-touch reach the 44 px touch minimum. The other sizes are for pointer-first, dense layouts; on phones, give them a 44 px hit area or use touch.</p>}>
        <SpecTable
          caption="Text button sizes"
          headers={["Size", "Utility", "Height", "Side pad", "Icon-side pad", "Gap", "Icon", "Type / line", "Use"]}
          rows={sizeRows}
          numeric={[2, 3, 4, 5, 6]}
        />
        <SpecTable caption="Icon-only button sizes" headers={["Size", "Box", "Icon", "Inset (Z − I) ÷ 2"]} rows={iconRows} numeric={[2, 3]} />
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          All sizes: 1 px border, width hugs the label. Radius comes from <code className="text-foreground">--component-button-radius-default</code> and renders as min(token, height ÷ 2). Weight is <code className="text-foreground">--component-button-font-weight</code> (500 when a theme does not set it); typeface, case and tracking come from the brand tokens below.
        </p>
        <SpecTable caption="Radius token values by theme" headers={["Token", "Shape", "Where"]} rows={radiusRows} />
        <h4 id="cta-type" className="scroll-mt-28 type-k1 text-muted-foreground">CTA typography by brand</h4>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          From <code className="text-foreground">component-button-font-family</code>, <code className="text-foreground">-font-weight</code>, <code className="text-foreground">-text-transform</code> and <code className="text-foreground">-letter-spacing</code>, captured from each publication&rsquo;s live CTA. Families the app doesn&rsquo;t serve fall back to the brand body font; Bicycling also scales Teko to the standard cap height. Section themes without these tokens keep the inherited family, weight 500, the label as written and normal tracking.
        </p>
        <SpecTable caption="CTA typography tokens by brand" headers={["Brand", "Typeface", "Weight", "Case", "Tracking", "Radius"]} rows={ctaTypeRows} numeric={[2, 5]} />
      </SpecSection>

      <SpecSection id="cta-variants" kicker="01.4 · Variants and color" title="Pick the intent; the theme picks the color." intro={<p>Each variant reads a family of component tokens: <code className="text-foreground">--component-button-{"{background,border,content}"}-{"{family}"}-{"{default,hover,active}"}</code>. Never hardcode a brand color on a CTA.</p>}>
        <SpecTable caption="Button variants" headers={["Variant", "Name", "Token family", "When to use"]} rows={variantRows} />
      </SpecSection>

      <SpecSection id="cta-states" kicker="01.5 · States" title="Same geometry in every state." intro={<p>States only swap tokens, opacity and the focus ring, so nothing shifts when a button is hovered, pressed or loading.</p>}>
        <SpecTable caption="Button states" headers={["State", "Behavior", "Trigger"]} rows={stateRows} />
      </SpecSection>

      <SpecSection id="cta-label-case" kicker="01.6 · Label case" title="Sentence case is the default." intro={<p>Labels are short, start with a verb and say what happens next.</p>}>
        <SpecTable caption="Label casing rules" headers={["Treatment", "When to use it", "Examples"]} rows={casingRules} />
      </SpecSection>

      <SpecSection id="cta-checklist" kicker="01.7 · Checklist" title="Before you ship a CTA.">
        <ol className="grid gap-3 md:grid-cols-2">
          {checklist.map((item, index) => (
            <li key={item} className="flex gap-4 rounded-card bg-card p-5 leading-6 shadow-[var(--hp-shadow-card)]">
              <span className="font-bold tabular-nums text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          On 2026-11-09 the app rendered the primitive at 202 call sites (stories excluded), and 3 links borrow its look through <code className="text-foreground">buttonVariants()</code>.
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonStyleLink href="/specs/#blocks">Open the blocks, cards and widgets spec</ButtonStyleLink>
          <ButtonStyleLink href="/hearst-plus-reference/">Open the Hearst+ product reference</ButtonStyleLink>
        </div>
      </SpecSection>
    </SpecChapter>
  );
}
