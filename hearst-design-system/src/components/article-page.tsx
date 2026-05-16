"use client";

import React from "react";
import { useTheme } from "./theme-provider";
import { BrandLogo } from "./brand-logo";
import { cn } from "@/lib/utils";
import { brandLogos } from "@/lib/logos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LinkComponent } from "@/components/ui/link";
import { Separator } from "@/components/ui/separator";
import {
  ArticleCard,
  ArticleCardImage,
  ArticleCardContent,
  ArticleCardTitle,
  ArticleCardEyebrow,
} from "@/components/ui/article-card";
import { SiteFooter } from "./fre/site-footer";
import { GridOverlay, PageContainer, Grid, Col } from "@/components/ui/grid";
import { ArticleHero } from "./fre/article-hero";
import { ArticleByline } from "./fre/article-byline";
import { ArticleBody } from "./fre/article-body";
import { RelatedArticles, type RelatedArticle } from "./fre/related-articles";
import { AdPlaceholder } from "./fre/ad-placeholder";
import { ChevronDown, Mail, Search } from "lucide-react";

export interface SidebarItem {
  title: string;
  image: string;
  eyebrow?: string;
}

export interface ArticlePageContent {
  breadcrumbs: { label: string; href?: string }[];
  headline: string;
  dek?: string;
  heroImage: string;
  heroImageAlt?: string;
  heroImageCredit?: string;
  author: string;
  photographedBy?: string;
  publishedDate: string;
  body: React.ReactNode;
  relatedArticles?: RelatedArticle[];
  sidebarItems?: SidebarItem[];
  navLinks?: string[];
}

export interface ImmersiveArticleFact {
  label: string;
  value: string;
}

export interface ImmersiveArticleScene {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  imageAlt?: string;
  imageCredit?: string;
  quote?: string;
  align?: "left" | "right";
}

export interface ImmersiveArticleMediaItem {
  src: string;
  alt?: string;
  caption?: string;
  credit?: string;
  featured?: boolean;
}

export interface ImmersiveArticleContent extends ArticlePageContent {
  immersiveLabel?: string;
  immersiveKicker?: string;
  immersiveIntro?: React.ReactNode;
  introEyebrow?: string;
  posterQuoteEyebrow?: string;
  visualEssayEyebrow?: string;
  visualEssayTitle?: string;
  bodyRailEyebrow?: string;
  heroImageTreatment?: "contain" | "grid-crop" | "overlay";
  heroHeadlineScale?: "standard" | "compact" | "cover";
  heroHeadlineLines?: string[];
  flipHeroImage?: boolean;
  factRail?: ImmersiveArticleFact[];
  scenes: ImmersiveArticleScene[];
  mediaPair?: ImmersiveArticleMediaItem[];
}

function ArticleUtilityBar() {
  return (
    <div className="relative left-1/2 w-screen max-w-none -translate-x-1/2 bg-primary text-primary-foreground text-[length:var(--text-token-4xs)] font-semibold">
      <div className="mx-auto flex h-8 w-full max-w-[var(--width-content-max)] items-center justify-between px-4 md:px-6 lg:px-12">
        <div className="flex items-center gap-[var(--spacing-token-sm)]">
          {["Shop", "Newsletter", "Sign In"].map((label) => (
            <LinkComponent
              key={label}
              variant="neutral"
              underline={false}
              size="xs"
              className="opacity-90 text-primary-foreground hover:text-primary-foreground/80 font-semibold"
            >
              {label}
            </LinkComponent>
          ))}
        </div>
        <Button variant="secondary" size="xs" className="text-[length:var(--text-token-4xs)] font-semibold">
          Subscribe
        </Button>
      </div>
    </div>
  );
}

function ArticleNav({ navLinks }: { navLinks: string[] }) {
  const { brand } = useTheme();
  const logo = brandLogos[brand.slug];

  return (
    <div className="border-b border-border py-[var(--spacing-token-xs)]">
      <div className="flex items-center justify-between py-[var(--spacing-token-xs)]">
        <div className="w-10 shrink-0 md:w-[var(--width-sidebar-narrow)]" />
        <div className="min-w-0 flex-1 text-center md:flex-none">
          {logo ? (
            <BrandLogo slug={brand.slug} className="[&_svg]:h-10 [&_svg]:w-auto mx-auto" />
          ) : (
            <h1 className="text-[length:var(--text-token-2xl)] tracking-widest uppercase headline">
              {brand.name}
            </h1>
          )}
        </div>
        <div className="flex w-10 shrink-0 justify-end gap-[var(--spacing-token-xs)] md:w-[var(--width-sidebar-narrow)]">
          <Button variant="outline" size="icon-sm">
            <Search className="size-3.5" />
          </Button>
        </div>
      </div>
      <div className="max-w-full overflow-hidden">
        <nav className="flex max-w-full items-center justify-start gap-[var(--spacing-token-xl)] overflow-x-auto py-[var(--spacing-token-xs)] scrollbar-hide md:justify-center">
          {navLinks.map((link) => (
            <LinkComponent
              key={link}
              variant="neutral"
              underline={false}
              size="sm"
              className="whitespace-nowrap font-normal"
            >
              {link}
            </LinkComponent>
          ))}
        </nav>
      </div>
    </div>
  );
}

function ArticleSidebar({ items }: { items: SidebarItem[] }) {
  const { brand } = useTheme();

  return (
    <aside className="w-full min-w-0 space-y-[var(--spacing-token-2xl)]">
      {/* Top ad slot */}
      <div className="flex justify-center">
        <AdPlaceholder size="medium-rectangle" />
      </div>

      {/* Sidebar articles */}
      {items.length > 0 && (
        <div className="space-y-[var(--spacing-token-md)]">
          <h3 className="text-[length:var(--text-token-xs)] font-bold uppercase tracking-widest font-brand-secondary text-muted-foreground">
            More on {brand.name}
          </h3>
          <Separator />
          <div className="space-y-[var(--spacing-token-md)]">
            {items.map((item, i) => (
              <ArticleCard
                key={i}
                layout="vertical"
                size="sm"
                className="cursor-pointer ring-0 hover:ring-0 rounded-none bg-transparent"
              >
                <ArticleCardImage
                  src={item.image}
                  aspectRatio="16/9"
                  className="rounded-sm"
                />
                <ArticleCardContent className="px-0 pt-2 pb-0">
                  {item.eyebrow && (
                    <ArticleCardEyebrow>{item.eyebrow}</ArticleCardEyebrow>
                  )}
                  <ArticleCardTitle className="text-[length:var(--text-token-2xs)] leading-snug headline line-clamp-3">
                    {item.title}
                  </ArticleCardTitle>
                </ArticleCardContent>
              </ArticleCard>
            ))}
          </div>
        </div>
      )}

      {/* Sticky ad slot */}
      <div className="lg:sticky lg:top-[var(--spacing-token-md)] flex justify-center">
        <AdPlaceholder size="half-page" />
      </div>
    </aside>
  );
}

function ArticleNewsletter({ brandName }: { brandName: string }) {
  return (
    <div className="py-[var(--spacing-token-3xl)] px-[var(--spacing-token-xl)] lg:px-[var(--spacing-token-3xl)] space-y-[var(--spacing-token-xl)] bg-accent rounded-lg">
      <div className="space-y-[var(--spacing-token-xs)]">
        <p className="text-[length:var(--text-token-3xs)] font-bold uppercase tracking-widest font-brand-secondary text-foreground">
          Sign up for {brandName}&rsquo;s Newsletter
        </p>
        <h3 className="text-[length:var(--text-token-2xl)] lg:text-[length:var(--text-token-5xl)] leading-tight headline">
          Hear from our expert journalists.
        </h3>
      </div>
      <div className="flex flex-col sm:flex-row gap-0">
        <Input
          size="xl"
          placeholder="Enter your email here."
          leadingIcon={Mail}
          className="flex-1 [&>div]:rounded-none [&>div]:sm:rounded-l-sm [&>div]:border-border"
        />
        <Button size="lg" className="h-12 px-[var(--spacing-token-xl)] text-[length:var(--text-token-xs)] font-bold uppercase tracking-wider whitespace-nowrap rounded-none sm:rounded-r-sm">
          Sign Me Up
        </Button>
      </div>
      <p className="text-[length:var(--text-token-4xs)] leading-relaxed text-muted-foreground">
        By signing up, I agree to the{" "}
        <LinkComponent variant="neutral" underline size="xs" className="font-normal">Terms of Use</LinkComponent>{" "}
        and have reviewed the{" "}
        <LinkComponent variant="neutral" underline size="xs" className="font-normal">Privacy Notice</LinkComponent>.
      </p>
    </div>
  );
}

function ImmersiveHero({ content }: { content: ImmersiveArticleContent }) {
  return (
    <header className="relative left-1/2 min-h-[calc(100vh-4rem)] w-screen -translate-x-1/2 overflow-hidden bg-foreground text-background">
      <img
        src={content.heroImage}
        alt={content.heroImageAlt || content.headline}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.82)_0%,rgba(0,0,0,.58)_42%,rgba(0,0,0,.12)_100%)]" />
      <PageContainer className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col justify-end pb-[var(--spacing-token-3xl)] pt-[var(--spacing-token-3xl)]">
        <div className="max-w-[920px] space-y-[var(--spacing-token-lg)]">
          {content.breadcrumbs.length > 0 && (
            <nav className="flex flex-wrap items-center gap-[var(--spacing-token-2xs)] text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-background/75 font-brand-secondary">
              {content.breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="text-background/45">/</span>}
                  <span className={i === content.breadcrumbs.length - 1 ? "text-background" : ""}>
                    {crumb.label}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          )}
          {content.immersiveLabel && (
            <p className="text-[length:var(--text-token-3xs)] font-bold uppercase tracking-widest text-background/85 font-brand-secondary">
              {content.immersiveLabel}
            </p>
          )}
          <h1 className="max-w-[860px] text-[length:var(--text-token-6xl)] leading-[0.98] text-background headline md:text-[length:var(--text-token-7xl)] lg:text-[5rem]">
            {content.headline}
          </h1>
          {content.dek && (
            <p className="max-w-[640px] text-[length:var(--text-token-lg)] leading-relaxed text-background/85 lg:text-[length:var(--text-token-xl)]">
              {content.dek}
            </p>
          )}
          <div className="flex flex-col gap-[var(--spacing-token-md)] border-t border-background/25 pt-[var(--spacing-token-md)] text-[length:var(--text-token-3xs)] font-semibold uppercase tracking-widest text-background/75 font-brand-secondary sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p>By {content.author}</p>
              {content.photographedBy && <p>Photographed by {content.photographedBy}</p>}
              <p>{content.publishedDate}</p>
            </div>
            <div className="flex items-center gap-[var(--spacing-token-xs)] text-background">
              <span>Read the story</span>
              <ChevronDown className="size-4" aria-hidden="true" />
            </div>
          </div>
        </div>
        {content.heroImageCredit && (
          <p className="absolute bottom-[var(--spacing-token-sm)] right-[var(--spacing-token-md)] text-[length:var(--text-token-4xs)] text-background/65">
            {content.heroImageCredit}
          </p>
        )}
      </PageContainer>
    </header>
  );
}

function ImmersiveIntro({ content }: { content: ImmersiveArticleContent }) {
  if (!content.immersiveIntro && !content.immersiveKicker && !content.factRail?.length) {
    return null;
  }

  return (
    <section className="py-[var(--spacing-token-3xl)] lg:py-[calc(var(--spacing-token-3xl)*1.5)]">
      <Grid alignStart>
        <Col span="full" spanMd={3} spanLg={4}>
          <div className="space-y-[var(--spacing-token-md)] lg:sticky lg:top-[var(--spacing-token-xl)]">
            {content.immersiveLabel && (
              <p className="text-[length:var(--text-token-3xs)] font-bold uppercase tracking-widest text-primary font-brand-secondary">
                {content.immersiveLabel}
              </p>
            )}
            {content.immersiveKicker && (
              <h2 className="text-[length:var(--text-token-3xl)] leading-tight headline lg:text-[length:var(--text-token-5xl)]">
                {content.immersiveKicker}
              </h2>
            )}
          </div>
        </Col>
        <Col span="full" spanMd={5} spanLg={5}>
          {content.immersiveIntro && (
            <ArticleBody className="[&>p]:text-[length:var(--text-token-lg)] [&>p]:leading-[1.75]">
              {content.immersiveIntro}
            </ArticleBody>
          )}
        </Col>
        {content.factRail && content.factRail.length > 0 && (
          <Col span="full" spanMd={8} spanLg={3}>
            <dl className="divide-y divide-border border-y border-border">
              {content.factRail.map((fact) => (
                <div key={fact.label} className="py-[var(--spacing-token-md)]">
                  <dt className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-muted-foreground font-brand-secondary">
                    {fact.label}
                  </dt>
                  <dd className="mt-[var(--spacing-token-2xs)] text-[length:var(--text-token-sm)] font-semibold leading-snug text-foreground">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Col>
        )}
      </Grid>
    </section>
  );
}

function ImmersiveSceneBand({
  scene,
  index,
}: {
  scene: ImmersiveArticleScene;
  index: number;
}) {
  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 border-y border-background/15 bg-foreground text-background">
      <div className="mx-auto grid min-h-[92vh] max-w-[var(--width-content-max)] grid-cols-1 lg:grid-cols-12">
        <figure
          className={cn(
            "relative min-h-[58vh] overflow-hidden lg:col-span-7 lg:min-h-[92vh]",
            scene.align === "right" && "lg:order-2"
          )}
        >
          <img
            src={scene.image}
            alt={scene.imageAlt || scene.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.18)_0%,rgba(0,0,0,0)_48%,rgba(0,0,0,.42)_100%)]" />
          {scene.imageCredit && (
            <figcaption className="absolute bottom-[var(--spacing-token-sm)] right-[var(--spacing-token-sm)] text-[length:var(--text-token-4xs)] text-background/70">
              {scene.imageCredit}
            </figcaption>
          )}
        </figure>
        <div
          className={cn(
            "flex items-center px-4 py-[var(--spacing-token-3xl)] md:px-6 lg:col-span-5 lg:px-12",
            scene.align === "right" && "lg:order-1"
          )}
        >
          <div className="mx-auto max-w-[560px] space-y-[var(--spacing-token-lg)]">
            <p className="text-[length:var(--text-token-3xs)] font-bold uppercase tracking-widest text-background/65 font-brand-secondary">
              {String(index + 1).padStart(2, "0")} / {scene.eyebrow}
            </p>
            <h2 className="text-[length:var(--text-token-4xl)] leading-tight text-background headline lg:text-[length:var(--text-token-6xl)]">
              {scene.title}
            </h2>
            <p className="text-[length:var(--text-token-md)] leading-relaxed text-background/80 lg:text-[length:var(--text-token-lg)]">
              {scene.body}
            </p>
            {scene.quote && (
              <blockquote className="border-l-4 border-primary pl-[var(--spacing-token-lg)]">
                <p className="text-[length:var(--text-token-xl)] leading-snug text-background headline lg:text-[length:var(--text-token-2xl)]">
                  {scene.quote}
                </p>
              </blockquote>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ImmersiveMediaPair({ media }: { media: ImmersiveArticleMediaItem[] }) {
  if (media.length === 0) return null;

  return (
    <section className="py-[var(--spacing-token-3xl)]">
      <div className="grid gap-[var(--spacing-token-md)] md:grid-cols-2">
        {media.map((item, i) => (
          <figure key={`${item.src}-${i}`} className="space-y-[var(--spacing-token-xs)]">
            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
              <img
                src={item.src}
                alt={item.alt || ""}
                className="h-full w-full object-cover"
              />
            </div>
            {(item.caption || item.credit) && (
              <figcaption className="text-[length:var(--text-token-4xs)] leading-relaxed text-muted-foreground">
                {item.caption && <span className="italic">{item.caption}</span>}
                {item.caption && item.credit && <span> </span>}
                {item.credit && <span>{item.credit}</span>}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}

function ImmersiveBodySection({
  content,
  brandName,
}: {
  content: ImmersiveArticleContent;
  brandName: string;
}) {
  return (
    <section className="pb-[var(--spacing-token-3xl)] lg:pb-[calc(var(--spacing-token-3xl)*1.5)]">
      <Grid alignStart>
        <Col span="full" spanMd={2} spanLg={3}>
          <aside className="hidden space-y-[var(--spacing-token-md)] border-t border-border pt-[var(--spacing-token-md)] md:block lg:sticky lg:top-[var(--spacing-token-xl)]">
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-muted-foreground font-brand-secondary">
              Story spine
            </p>
            <ol className="space-y-[var(--spacing-token-sm)]">
              {content.scenes.map((scene, i) => (
                <li key={scene.eyebrow} className="text-[length:var(--text-token-3xs)] font-semibold uppercase tracking-widest text-foreground/70 font-brand-secondary">
                  {String(i + 1).padStart(2, "0")} {scene.eyebrow}
                </li>
              ))}
            </ol>
          </aside>
        </Col>
        <Col span="full" spanMd={6} spanLg={7}>
          <div className="space-y-[var(--spacing-token-3xl)]">
            <ArticleBody className="[&>p]:text-[length:var(--text-token-lg)] [&>p]:leading-[1.75]">
              {content.body}
            </ArticleBody>
            <div className="flex justify-center py-[var(--spacing-token-md)]">
              <AdPlaceholder size="inline" />
            </div>
            <ArticleNewsletter brandName={brandName} />
          </div>
        </Col>
      </Grid>
    </section>
  );
}

function EditorialBreadcrumbs({
  content,
  inverted = false,
}: {
  content: ImmersiveArticleContent;
  inverted?: boolean;
}) {
  if (content.breadcrumbs.length === 0) return null;

  return (
    <nav
      className={cn(
        "flex flex-wrap items-center gap-[var(--spacing-token-2xs)] text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest font-brand-secondary",
        inverted ? "text-background/80" : "text-muted-foreground",
      )}
    >
      {content.breadcrumbs.map((crumb, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className={inverted ? "text-background/55" : "text-border"}>/</span>}
          <span className={i === content.breadcrumbs.length - 1 ? (inverted ? "text-background" : "text-foreground") : ""}>
            {crumb.label}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
}

function EditorialImageCaption({
  caption,
  credit,
  className,
}: {
  caption?: string;
  credit?: string;
  className?: string;
}) {
  if (!caption && !credit) return null;

  return (
    <figcaption className={cn("text-[length:var(--text-token-4xs)] leading-relaxed text-muted-foreground", className)}>
      {caption && <span className="italic">{caption}</span>}
      {caption && credit && <span> </span>}
      {credit && <span>{credit}</span>}
    </figcaption>
  );
}

function EditorialFullBleedSection({
  children,
  className,
  innerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <section
      className={cn(
        "relative left-1/2 w-screen -translate-x-1/2 overflow-hidden",
        className,
      )}
    >
      <PageContainer className={cn("relative z-10", innerClassName)}>
        {children}
      </PageContainer>
    </section>
  );
}

type EditorialMood = "architecture" | "road" | "ranch" | "ride" | "food" | "profile" | "default";

function getEditorialMood(brandSlug: string): EditorialMood {
  if (brandSlug === "car-and-driver") return "road";
  if (brandSlug === "country-living") return "ranch";
  if (brandSlug === "bicycling") return "ride";
  if (brandSlug === "delish") return "food";
  if (brandSlug === "esquire") return "profile";
  if (brandSlug === "elle") return "architecture";
  return "default";
}

const editorialMoodStyles: Record<EditorialMood, {
  accent: string;
  softBg: string;
  midBg: string;
  darkBg: string;
  overlay: string;
  heroObject: string;
  headline: string;
}> = {
  architecture: {
    accent: "text-background",
    softBg: "bg-[#f5f0ea]",
    midBg: "bg-[#ede8df]",
    darkBg: "bg-[#252332]",
    overlay: "bg-gradient-to-r from-[#1e2435]/74 via-[#38425f]/38 to-[#2d3448]/18",
    heroObject: "object-[center_52%]",
    headline: "headline max-w-[1120px] text-[3.5rem] leading-[0.92] sm:text-[4.6rem] md:text-[5.7rem] lg:text-[7.3rem]",
  },
  road: {
    accent: "text-background",
    softBg: "bg-[#eef3f4]",
    midBg: "bg-[#dceaf0]",
    darkBg: "bg-[#0d1719]",
    overlay: "bg-gradient-to-r from-[#071113]/88 via-[#0b2732]/45 to-[#123e50]/12",
    heroObject: "object-center",
    headline: "[font-family:Inter,system-ui,sans-serif] max-w-[1080px] text-[3.75rem] font-extrabold leading-[0.88] sm:text-[5rem] md:text-[6.3rem] lg:text-[8rem]",
  },
  ranch: {
    accent: "text-[#e7c78b]",
    softBg: "bg-[#f6efe6]",
    midBg: "bg-[#e9dac6]",
    darkBg: "bg-[#1e1710]",
    overlay: "bg-gradient-to-r from-[#1e1710]/88 via-[#1e1710]/36 to-[#1e1710]/8",
    heroObject: "object-[center_38%]",
    headline: "headline max-w-[980px] text-[3.5rem] leading-[0.92] sm:text-[4.6rem] md:text-[5.65rem] lg:text-[7rem]",
  },
  ride: {
    accent: "text-[#8bd9ee]",
    softBg: "bg-[#eef8fb]",
    midBg: "bg-[#d8f0f6]",
    darkBg: "bg-[#062634]",
    overlay: "bg-gradient-to-r from-[#062634]/86 via-[#0c5367]/40 to-[#8bd9ee]/8",
    heroObject: "object-center",
    headline: "headline max-w-[1080px] text-[3.25rem] leading-[0.9] sm:text-[4.1rem] md:text-[5.1rem] lg:text-[6.25rem]",
  },
  food: {
    accent: "text-[#ffe167]",
    softBg: "bg-[#fff5d7]",
    midBg: "bg-[#ffe9a8]",
    darkBg: "bg-[#35150f]",
    overlay: "bg-gradient-to-r from-[#35150f]/82 via-[#6b2419]/34 to-[#f36d2f]/8",
    heroObject: "object-center",
    headline: "[font-family:Inter,system-ui,sans-serif] max-w-[1060px] text-[2.75rem] font-extrabold leading-[0.94] sm:text-[3.5rem] md:text-[4.35rem] lg:text-[5.35rem] xl:text-[6rem]",
  },
  profile: {
    accent: "text-[#f04a3a]",
    softBg: "bg-[#f4f0ed]",
    midBg: "bg-[#161313]",
    darkBg: "bg-[#050505]",
    overlay: "bg-gradient-to-r from-[#050505]/88 via-[#050505]/46 to-[#b52b22]/10",
    heroObject: "object-[center_18%]",
    headline: "[font-family:Inter,system-ui,sans-serif] max-w-[1080px] text-[3.25rem] font-extrabold uppercase leading-[0.88] sm:text-[4.2rem] md:text-[5.2rem] lg:text-[6.8rem]",
  },
  default: {
    accent: "text-primary",
    softBg: "bg-background",
    midBg: "bg-muted",
    darkBg: "bg-foreground",
    overlay: "bg-gradient-to-r from-foreground/82 via-foreground/40 to-foreground/8",
    heroObject: "object-center",
    headline: "headline max-w-[1040px] text-[3.35rem] leading-[0.92] sm:text-[4.4rem] md:text-[5.5rem] lg:text-[6.75rem]",
  },
};

function EditorialHero({ content }: { content: ImmersiveArticleContent }) {
  const cropHeroImage = content.heroImageTreatment === "grid-crop";
  const overlayHeroImage = content.heroImageTreatment === "overlay";
  const compactHeadline = content.heroHeadlineScale === "compact";
  const coverHeadline = content.heroHeadlineScale === "cover";
  const headlineLines = content.heroHeadlineLines ?? [content.headline];

  if (overlayHeroImage) {
    return (
      <header className="relative left-1/2 min-h-[760px] w-screen max-w-none -translate-x-1/2 overflow-hidden bg-foreground text-background md:min-h-[860px]">
        <img
          src={content.heroImage}
          alt={content.heroImageAlt || content.headline}
          className={cn(
            "absolute inset-0 h-full w-full object-cover object-center",
            content.flipHeroImage && "-scale-x-100",
          )}
        />
        <div
          className={cn(
            "absolute inset-0",
            coverHeadline
              ? "bg-gradient-to-r from-foreground/80 via-foreground/35 to-foreground/5"
              : "bg-gradient-to-b from-foreground/25 via-foreground/20 to-foreground/75",
          )}
        />
        {coverHeadline && (
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/15 via-transparent to-foreground/75" />
        )}
        <PageContainer className="relative z-10 flex min-h-[760px] flex-col justify-end py-[var(--spacing-token-3xl)] md:min-h-[860px] lg:py-[var(--spacing-token-6xl)]">
          <Grid alignStart gap="loose">
            <Col span="full" spanMd={7} spanLg={coverHeadline ? 10 : 8}>
              <div className="space-y-[var(--spacing-token-lg)]">
                <EditorialBreadcrumbs content={content} inverted />
                <div className="space-y-[var(--spacing-token-md)]">
                  {content.immersiveLabel && (
                    <p className="inline-flex border-b-2 border-background pb-[var(--spacing-token-2xs)] text-[length:var(--text-token-3xs)] font-bold uppercase tracking-widest text-background font-brand-secondary">
                      {content.immersiveLabel}
                    </p>
                  )}
                  <h1
                    className={cn(
                      "text-background",
                      coverHeadline
                        ? "max-w-[1120px] [font-family:Inter,system-ui,sans-serif] text-[3.35rem] font-extrabold leading-[0.84] sm:text-[4.25rem] md:text-[5.5rem] lg:text-[7.75rem] xl:text-[9rem]"
                        : "headline max-w-[980px] text-[length:var(--text-token-6xl)] leading-[0.94] md:text-[length:var(--text-token-7xl)] lg:text-[6.75rem]",
                    )}
                  >
                    {coverHeadline
                      ? headlineLines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))
                      : content.headline}
                  </h1>
                </div>
                {content.dek && (
                  <p className="max-w-[720px] text-[length:var(--text-token-lg)] font-semibold leading-relaxed text-background/90 lg:text-[length:var(--text-token-xl)]">
                    {content.dek}
                  </p>
                )}
                <div className="grid max-w-[760px] gap-[var(--spacing-token-sm)] border-t border-background/55 pt-[var(--spacing-token-md)] text-[length:var(--text-token-3xs)] font-semibold uppercase tracking-widest text-background/80 font-brand-secondary sm:grid-cols-3">
                  <div>
                    <span className="block text-background">By</span>
                    {content.author}
                  </div>
                  {content.photographedBy && (
                    <div>
                      <span className="block text-background">Photos</span>
                      {content.photographedBy}
                    </div>
                  )}
                  <div>
                    <span className="block text-background">Published</span>
                    {content.publishedDate}
                  </div>
                </div>
              </div>
            </Col>
            <Col span="full" spanMd={1} spanLg={4} className="flex items-end justify-end">
              <EditorialImageCaption
                credit={content.heroImageCredit}
                className="max-w-[280px] text-right text-background/80"
              />
            </Col>
          </Grid>
        </PageContainer>
      </header>
    );
  }

  if (coverHeadline) {
    return (
      <header className="overflow-hidden border-b border-border py-[var(--spacing-token-3xl)] lg:overflow-visible lg:py-[var(--spacing-token-5xl)]">
        <Grid gap="loose" alignStart className="items-start overflow-visible">
          <Col span="full" spanMd="full" spanLg={6} rowStartLg={1} className="relative z-20 overflow-visible">
            <div className="max-w-[760px] space-y-[var(--spacing-token-lg)]">
              <EditorialBreadcrumbs content={content} />
              <div className="space-y-[var(--spacing-token-md)]">
                {content.immersiveLabel && (
                  <p className="inline-flex border-b-2 border-primary pb-[var(--spacing-token-2xs)] text-[length:var(--text-token-3xs)] font-bold uppercase tracking-widest text-primary font-brand-secondary">
                    {content.immersiveLabel}
                  </p>
                )}
                <h1 className="[font-family:Inter,system-ui,sans-serif] text-[3.35rem] font-extrabold leading-[0.86] text-foreground sm:text-[4.25rem] md:text-[4.75rem] lg:text-[7.25rem] xl:text-[8rem]">
                  {headlineLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h1>
              </div>
              {content.dek && (
                <p className="max-w-[620px] text-[length:var(--text-token-lg)] leading-relaxed text-foreground/75 lg:text-[length:var(--text-token-xl)]">
                  {content.dek}
                </p>
              )}
              <div className="grid gap-[var(--spacing-token-sm)] border-t border-border pt-[var(--spacing-token-md)] text-[length:var(--text-token-3xs)] font-semibold uppercase tracking-widest text-muted-foreground font-brand-secondary sm:grid-cols-3">
                <div>
                  <span className="block text-foreground">By</span>
                  {content.author}
                </div>
                {content.photographedBy && (
                  <div>
                    <span className="block text-foreground">Photos</span>
                    {content.photographedBy}
                  </div>
                )}
                <div>
                  <span className="block text-foreground">Published</span>
                  {content.publishedDate}
                </div>
              </div>
            </div>
          </Col>
          <Col
            span="full"
            spanMd="full"
            spanLg={6}
            startLg={7}
            rowStartLg={1}
            className="relative z-30 lg:pt-[var(--spacing-token-sm)]"
          >
            <figure className="w-full space-y-[var(--spacing-token-xs)]">
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={content.heroImage}
                  alt={content.heroImageAlt || content.headline}
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute left-0 top-0 h-full w-[var(--spacing-token-xs)] bg-primary" />
              </div>
              <EditorialImageCaption
                credit={content.heroImageCredit}
                className="text-right"
              />
            </figure>
          </Col>
        </Grid>
      </header>
    );
  }

  return (
    <header className="border-b border-border py-[var(--spacing-token-3xl)] lg:py-[var(--spacing-token-6xl)]">
      <Grid gap="loose" alignStart={!cropHeroImage} className={cn(cropHeroImage && "items-stretch")}>
        <Col span="full" spanMd={4} spanLg={5}>
          <div className="max-w-[660px] space-y-[var(--spacing-token-lg)]">
            <EditorialBreadcrumbs content={content} />
            <div className="space-y-[var(--spacing-token-md)]">
              {content.immersiveLabel && (
                <p className="inline-flex border-b-2 border-primary pb-[var(--spacing-token-2xs)] text-[length:var(--text-token-3xs)] font-bold uppercase tracking-widest text-primary font-brand-secondary">
                  {content.immersiveLabel}
                </p>
              )}
              <h1 className={cn(
                "headline max-w-full text-[length:var(--text-token-6xl)] leading-[0.98] text-foreground md:text-[length:var(--text-token-7xl)]",
                compactHeadline ? "lg:text-[4.75rem]" : "lg:text-[5.75rem]",
              )}>
                {content.headline}
              </h1>
            </div>
            {content.dek && (
              <p className="max-w-[560px] text-[length:var(--text-token-lg)] leading-relaxed text-foreground/75 lg:text-[length:var(--text-token-xl)]">
                {content.dek}
              </p>
            )}
            <div className="grid gap-[var(--spacing-token-sm)] border-t border-border pt-[var(--spacing-token-md)] text-[length:var(--text-token-3xs)] font-semibold uppercase tracking-widest text-muted-foreground font-brand-secondary sm:grid-cols-3">
              <div>
                <span className="block text-foreground">By</span>
                {content.author}
              </div>
              {content.photographedBy && (
                <div>
                  <span className="block text-foreground">Photos</span>
                  {content.photographedBy}
                </div>
              )}
              <div>
                <span className="block text-foreground">Published</span>
                {content.publishedDate}
              </div>
            </div>
          </div>
        </Col>
        <Col
          span="full"
          spanMd={4}
          spanLg={cropHeroImage ? 6 : 7}
          startLg={cropHeroImage ? 7 : undefined}
          className={cn(cropHeroImage && "h-full")}
        >
          <figure className={cn("ml-auto w-full max-w-[560px] space-y-[var(--spacing-token-xs)]", cropHeroImage && "h-full max-w-none")}>
            <div className={cn("relative flex justify-center overflow-hidden bg-muted", cropHeroImage && "h-full min-h-[520px]")}>
              <img
                src={content.heroImage}
                alt={content.heroImageAlt || content.headline}
                className={cn(
                  cropHeroImage
                    ? "h-full w-full object-cover object-[center_24%]"
                    : "h-auto w-full object-contain",
                )}
              />
              <div className="absolute left-0 top-0 h-full w-[var(--spacing-token-xs)] bg-primary" />
            </div>
            <EditorialImageCaption
              credit={content.heroImageCredit}
              className="text-right"
            />
          </figure>
        </Col>
      </Grid>
    </header>
  );
}

function EditorialIntro({ content }: { content: ImmersiveArticleContent }) {
  if (!content.immersiveIntro && !content.immersiveKicker && !content.factRail?.length) {
    return null;
  }

  return (
    <EditorialFullBleedSection className="border-b border-border bg-background py-[var(--spacing-token-3xl)] lg:py-[var(--spacing-token-4xl)]">
      <Grid alignStart gap="loose">
        <Col span="full" spanMd={3} spanLg={4}>
          <div className="space-y-[var(--spacing-token-md)] lg:sticky lg:top-[var(--spacing-token-xl)]">
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary font-brand-secondary">
              {content.introEyebrow ?? "Before the interview"}
            </p>
            {content.immersiveKicker && (
              <h2 className="headline max-w-[420px] text-[length:var(--text-token-3xl)] leading-tight lg:text-[length:var(--text-token-5xl)]">
                {content.immersiveKicker}
              </h2>
            )}
          </div>
        </Col>
        <Col span="full" spanMd={5} spanLg={5}>
          {content.immersiveIntro && (
            <ArticleBody className="[&>p]:text-[length:var(--text-token-lg)] [&>p]:leading-[1.85]">
              {content.immersiveIntro}
            </ArticleBody>
          )}
        </Col>
        {content.factRail && content.factRail.length > 0 && (
          <Col span="full" spanMd={8} spanLg={3}>
            <dl className="grid grid-cols-2 gap-x-[var(--spacing-token-md)] gap-y-[var(--spacing-token-lg)] border-y border-border py-[var(--spacing-token-md)] lg:grid-cols-1">
              {content.factRail.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-muted-foreground font-brand-secondary">
                    {fact.label}
                  </dt>
                  <dd className="mt-[var(--spacing-token-2xs)] text-[length:var(--text-token-sm)] font-semibold leading-snug text-foreground">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Col>
        )}
      </Grid>
    </EditorialFullBleedSection>
  );
}

function EditorialChapter({
  scene,
  index,
}: {
  scene: ImmersiveArticleScene;
  index: number;
}) {
  const imageFirst = index % 2 === 0;

  return (
    <EditorialFullBleedSection className="border-t border-border bg-background py-[var(--spacing-token-3xl)] lg:py-[var(--spacing-token-6xl)]">
      <Grid alignStart gap="loose" className="items-center">
        <Col
          span="full"
          spanMd={4}
          spanLg={6}
          className={cn(!imageFirst && "lg:order-2")}
        >
          <figure className="space-y-[var(--spacing-token-xs)]">
            <div className="relative flex justify-center overflow-hidden bg-muted">
              <img
                src={scene.image}
                alt={scene.imageAlt || scene.title}
                className="h-auto max-h-[760px] max-w-full object-contain object-center"
              />
            </div>
            <EditorialImageCaption
              caption={scene.title}
              credit={scene.imageCredit}
            />
          </figure>
        </Col>
        <Col
          span="full"
          spanMd={4}
          spanLg={5}
          className={cn(!imageFirst && "lg:order-1")}
        >
          <div className="max-w-[560px] space-y-[var(--spacing-token-lg)]">
            <p className="text-[length:var(--text-token-3xs)] font-bold uppercase tracking-widest text-primary font-brand-secondary">
              {String(index + 1).padStart(2, "0")} / {scene.eyebrow}
            </p>
            <h2 className="headline text-[length:var(--text-token-4xl)] leading-tight lg:text-[length:var(--text-token-6xl)]">
              {scene.title}
            </h2>
            <p className="text-[length:var(--text-token-md)] leading-[1.85] text-foreground/75 lg:text-[length:var(--text-token-lg)]">
              {scene.body}
            </p>
            {scene.quote && (
              <blockquote className="border-t-2 border-primary pt-[var(--spacing-token-md)]">
                <p className="headline text-[length:var(--text-token-xl)] leading-snug text-foreground lg:text-[length:var(--text-token-2xl)]">
                  {scene.quote}
                </p>
              </blockquote>
            )}
          </div>
        </Col>
      </Grid>
    </EditorialFullBleedSection>
  );
}

function EditorialPosterQuote({ content }: { content: ImmersiveArticleContent }) {
  const quotedScene = content.scenes.find((scene) => scene.quote);
  const quote = quotedScene?.quote ?? content.dek;

  if (!quote) return null;

  return (
    <EditorialFullBleedSection className="border-y border-foreground bg-background py-[var(--spacing-token-4xl)] lg:py-[var(--spacing-token-6xl)]">
      <Grid alignStart gap="loose">
        <Col span="full" spanMd={2} spanLg={3}>
          <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary font-brand-secondary">
            {content.posterQuoteEyebrow ?? "Editorial pause"}
          </p>
        </Col>
        <Col span="full" spanMd={6} spanLg={9}>
          <blockquote className="grid gap-[var(--spacing-token-md)] py-[var(--spacing-token-xl)] md:grid-cols-[minmax(72px,120px)_1fr] md:items-start md:gap-[var(--spacing-token-lg)]">
            <span
              aria-hidden="true"
              className="headline pointer-events-none text-[7rem] leading-none text-primary/20 md:text-[10rem]"
            >
              &ldquo;
            </span>
            <div className="min-w-0">
              <p className="headline max-w-[920px] text-[length:var(--text-token-5xl)] leading-[0.98] text-foreground md:text-[length:var(--text-token-7xl)] lg:text-[5.5rem]">
                {quote}
              </p>
              {quotedScene && (
                <cite className="mt-[var(--spacing-token-lg)] block text-[length:var(--text-token-3xs)] font-bold uppercase tracking-widest text-muted-foreground not-italic font-brand-secondary">
                  {quotedScene.eyebrow}
                </cite>
              )}
            </div>
          </blockquote>
        </Col>
      </Grid>
    </EditorialFullBleedSection>
  );
}

function EditorialMediaEssay({ content }: { content: ImmersiveArticleContent }) {
  const { mediaPair: media } = content;

  if (!media || media.length === 0) return null;

  const featured = media.find((item) => item.featured);
  const supportingMedia = featured ? media.filter((item) => item !== featured) : media;

  return (
    <EditorialFullBleedSection className="border-b border-border bg-background py-[var(--spacing-token-3xl)] lg:py-[var(--spacing-token-6xl)]">
      <Grid alignStart gap="loose">
        <Col span="full" spanMd={3} spanLg={3}>
          <div className="max-w-[320px] space-y-[var(--spacing-token-sm)] lg:sticky lg:top-[var(--spacing-token-xl)]">
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary font-brand-secondary">
              {content.visualEssayEyebrow ?? "Visual notes"}
            </p>
            <h2 className="headline text-[length:var(--text-token-3xl)] leading-tight">
              {content.visualEssayTitle ?? "The portraits keep the story close to the body."}
            </h2>
          </div>
        </Col>
        {featured && (
          <Col span="full" spanMd="full" spanLg="full">
            <figure className="space-y-[var(--spacing-token-xs)]">
              <div className="relative flex justify-center overflow-hidden bg-muted">
                <img
                  src={featured.src}
                  alt={featured.alt || ""}
                  className="h-auto w-full object-contain object-center"
                />
              </div>
              <EditorialImageCaption
                caption={featured.caption}
                credit={featured.credit}
              />
            </figure>
          </Col>
        )}
        {supportingMedia.length > 0 && (
          <Col span="full" spanMd={5} spanLg={featured ? 6 : 9} startLg={featured ? 4 : undefined}>
            <div className={cn("grid gap-[var(--spacing-token-md)]", !featured && "md:grid-cols-2")}>
              {supportingMedia.map((item, i) => (
                <figure
                  key={`${item.src}-${i}`}
                  className={cn("space-y-[var(--spacing-token-xs)]", !featured && i === 1 && "md:mt-[var(--spacing-token-3xl)]")}
                >
                  <div className="relative flex justify-center overflow-hidden bg-muted">
                    <img
                      src={item.src}
                      alt={item.alt || ""}
                      className="h-auto max-h-[720px] max-w-full object-contain object-center"
                    />
                  </div>
                  <EditorialImageCaption
                    caption={item.caption}
                    credit={item.credit}
                  />
                </figure>
              ))}
            </div>
          </Col>
        )}
      </Grid>
    </EditorialFullBleedSection>
  );
}

function EditorialBodySection({
  content,
  brandName,
}: {
  content: ImmersiveArticleContent;
  brandName: string;
}) {
  return (
    <EditorialFullBleedSection className="bg-background py-[var(--spacing-token-3xl)] lg:py-[var(--spacing-token-6xl)]">
      <Grid alignStart gap="loose">
        <Col span="full" spanMd={2} spanLg={3}>
          <aside className="hidden space-y-[var(--spacing-token-md)] border-t border-border pt-[var(--spacing-token-md)] md:block lg:sticky lg:top-[var(--spacing-token-xl)]">
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-muted-foreground font-brand-secondary">
              {content.bodyRailEyebrow ?? "Reading path"}
            </p>
            <ol className="space-y-[var(--spacing-token-sm)]">
              {content.scenes.map((scene, i) => (
                <li key={scene.eyebrow} className="text-[length:var(--text-token-3xs)] font-semibold uppercase tracking-widest text-foreground/70 font-brand-secondary">
                  {String(i + 1).padStart(2, "0")} {scene.eyebrow}
                </li>
              ))}
            </ol>
          </aside>
        </Col>
        <Col span="full" spanMd={6} spanLg={6}>
          <div className="space-y-[var(--spacing-token-3xl)]">
            <ArticleBody className="[&>p]:text-[length:var(--text-token-lg)] [&>p]:leading-[1.85]">
              {content.body}
            </ArticleBody>
            <div className="flex justify-center py-[var(--spacing-token-md)]">
              <AdPlaceholder size="inline" />
            </div>
            <ArticleNewsletter brandName={brandName} />
          </div>
        </Col>
      </Grid>
    </EditorialFullBleedSection>
  );
}

function CarAndDriverEditorialHeadline({ content }: { content: ImmersiveArticleContent }) {
  if (content.headline === "Comparison Test: $30,000 Small Cars") {
    return (
      <div className="space-y-[var(--spacing-token-md)]">
        <p className="inline-flex border-b-4 border-primary pb-[var(--spacing-token-2xs)] [font-family:Inter,system-ui,sans-serif] text-[length:var(--text-token-sm)] font-extrabold uppercase tracking-widest text-primary">
          Comparison Test
        </p>
        <h1
          aria-label={content.headline}
          className="[font-family:Inter,system-ui,sans-serif] text-[4.15rem] font-extrabold leading-[0.9] text-foreground sm:text-[5.2rem] md:text-[6.25rem] lg:text-[7.1rem] xl:text-[7.7rem]"
        >
          <span className="block">$30,000</span>
          <span className="block whitespace-nowrap">Small Cars</span>
        </h1>
      </div>
    );
  }

  const lines = content.heroHeadlineLines ?? [content.headline];

  return (
    <h1
      aria-label={content.headline}
      className="[font-family:Inter,system-ui,sans-serif] text-[3.7rem] font-extrabold leading-[0.86] text-foreground sm:text-[5rem] md:text-[5.85rem] lg:text-[7.1rem] xl:text-[7.85rem]"
    >
      {lines.map((line, index) => (
        <span
          key={line}
          className={cn(
            "block",
            index === 0 && "text-[0.78em]",
            line === "Small Cars" && "whitespace-nowrap text-primary",
          )}
        >
          {line}
        </span>
      ))}
    </h1>
  );
}

function BrandHorizontalEditorialHero({
  content,
  brandSlug,
}: {
  content: ImmersiveArticleContent;
  brandSlug: string;
}) {
  const isCarAndDriver = brandSlug === "car-and-driver";
  const mood = getEditorialMood(brandSlug);
  const moodStyle = editorialMoodStyles[mood];

  return (
    <header
      className={cn(
        "relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b",
        isCarAndDriver ? "border-[#1f6386]/25 bg-[#eef3f4]" : cn("border-foreground/10", moodStyle.softBg),
      )}
    >
      <figure className="relative h-[42vh] min-h-[340px] overflow-hidden bg-muted md:h-[48vh] md:min-h-[460px] lg:h-[54vh] lg:min-h-[560px]">
        <img
          src={content.heroImage}
          alt={content.heroImageAlt || content.headline}
          style={content.flipHeroImage ? { transform: "scaleX(-1)" } : undefined}
          className={cn("h-full w-full object-cover", isCarAndDriver ? "object-center" : moodStyle.heroObject)}
        />
        <div
          className={cn(
            "absolute inset-0",
            isCarAndDriver
              ? "bg-gradient-to-b from-foreground/5 via-transparent to-foreground/30"
              : "bg-gradient-to-b from-foreground/0 via-foreground/5 to-foreground/38",
          )}
        />
        <PageContainer className="absolute inset-x-0 bottom-[var(--spacing-token-md)] z-10">
          <div className="max-w-[760px] space-y-[var(--spacing-token-md)]">
            <EditorialBreadcrumbs content={content} inverted />
            {content.immersiveLabel && (
              <p className="inline-flex border-b-2 border-background pb-[var(--spacing-token-2xs)] text-[length:var(--text-token-3xs)] font-bold uppercase tracking-widest text-background font-brand-secondary">
                {content.immersiveLabel}
              </p>
            )}
          </div>
        </PageContainer>
        <EditorialImageCaption
          credit={content.heroImageCredit}
          className="absolute bottom-[var(--spacing-token-md)] right-[var(--spacing-token-md)] max-w-[360px] text-right text-background/90"
        />
      </figure>

      <PageContainer className="relative py-[var(--spacing-token-2xl)] lg:py-[var(--spacing-token-4xl)]">
        <div aria-hidden className={cn("absolute left-0 top-0 h-full w-[var(--spacing-token-xs)]", isCarAndDriver ? "bg-primary" : mood === "profile" ? "bg-[#f04a3a]" : mood === "food" ? "bg-[#ffe167]" : mood === "ride" ? "bg-[#8bd9ee]" : "bg-primary")} />
        <Grid alignStart gap="loose">
          <Col span="full" spanMd={5} spanLg={8}>
            <div>
              {isCarAndDriver ? (
                <CarAndDriverEditorialHeadline content={content} />
              ) : (
                <h1 className={cn("text-foreground", moodStyle.headline)}>
                  {content.headline}
                </h1>
              )}
            </div>
          </Col>
          <Col span="full" spanMd={3} spanLg={4}>
            <div
              className={cn(
                "space-y-[var(--spacing-token-lg)] border-t pt-[var(--spacing-token-md)]",
                isCarAndDriver ? "border-[#1f6386]/35" : "border-foreground/35",
              )}
            >
              {content.dek && (
                <p
                  className={cn(
                    "text-[length:var(--text-token-lg)] font-semibold leading-relaxed lg:text-[length:var(--text-token-xl)]",
                    isCarAndDriver ? "text-foreground/80" : "text-foreground/72",
                  )}
                >
                  {content.dek}
                </p>
              )}
              <div className="space-y-[var(--spacing-token-sm)] text-[length:var(--text-token-3xs)] font-semibold uppercase tracking-widest text-muted-foreground font-brand-secondary">
                <div>
                  <span className="block text-foreground">By</span>
                  {content.author}
                </div>
                {content.photographedBy && (
                  <div>
                    <span className="block text-foreground">Photos</span>
                    {content.photographedBy}
                  </div>
                )}
                <div>
                  <span className="block text-foreground">Published</span>
                  {content.publishedDate}
                </div>
              </div>
            </div>
          </Col>
        </Grid>
      </PageContainer>
    </header>
  );
}

function CarAndDriverRoadTestSequence({ content }: { content: ImmersiveArticleContent }) {
  const [question, route, verdict] = content.scenes;
  const scoreSheet = content.mediaPair?.find((item) => item.featured);
  const cabin = content.mediaPair?.find((item) => !item.featured);

  return (
    <>
      {question && (
        <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#0d1719] text-background">
          <figure>
            <div className="relative min-h-[680px] overflow-hidden bg-foreground md:min-h-[760px] lg:min-h-[860px]">
              <img
                src={question.image}
                alt={question.imageAlt || question.title}
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#081012]/92 via-[#081012]/48 to-[#081012]/6" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#081012] via-[#081012]/76 to-transparent">
                <PageContainer className="py-[var(--spacing-token-2xl)] lg:py-[var(--spacing-token-4xl)]">
                  <Grid alignStart gap="loose">
                    <Col span="full" spanMd={6} spanLg={7}>
                      <div className="space-y-[var(--spacing-token-lg)]">
                        <div className="space-y-[var(--spacing-token-sm)]">
                          <p className="[font-family:Inter,system-ui,sans-serif] text-[length:var(--text-token-sm)] font-extrabold uppercase tracking-widest text-primary">
                            01 / The Constraint
                          </p>
                          <h2 className="[font-family:Inter,system-ui,sans-serif] text-[length:var(--text-token-5xl)] font-extrabold leading-[0.94] md:text-[length:var(--text-token-6xl)]">
                            Price is the plot.
                          </h2>
                        </div>
                        <div className="border-t border-background/30 pt-[var(--spacing-token-lg)]">
                          <h3 className="[font-family:Inter,system-ui,sans-serif] text-[length:var(--text-token-3xl)] font-extrabold leading-tight text-background md:text-[length:var(--text-token-5xl)]">
                            {question.title}
                          </h3>
                          <p className="mt-[var(--spacing-token-md)] max-w-[720px] text-[length:var(--text-token-lg)] leading-[1.65] text-background/78 md:text-[length:var(--text-token-xl)]">
                            {question.body}
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Grid>
                </PageContainer>
              </div>
            </div>
            <PageContainer className="py-[var(--spacing-token-sm)]">
              <EditorialImageCaption
                caption={question.quote}
                credit={question.imageCredit}
                className="text-background/70"
              />
            </PageContainer>
          </figure>
        </section>
      )}

      {route && (
        <EditorialFullBleedSection className="bg-[#eef3f4] py-[var(--spacing-token-4xl)] lg:py-[var(--spacing-token-6xl)]">
          <Grid alignStart gap="loose" className="items-center">
            <Col span="full" spanMd={4} spanLg={5}>
              <div className="space-y-[var(--spacing-token-lg)]">
                <p className="[font-family:Inter,system-ui,sans-serif] text-[length:var(--text-token-sm)] font-extrabold uppercase tracking-widest text-primary">
                  02 / The Route
                </p>
                <p className="[font-family:Inter,system-ui,sans-serif] text-[7rem] font-extrabold leading-none text-primary md:text-[9rem] lg:text-[11rem]">
                  600+
                </p>
                <h2 className="[font-family:Inter,system-ui,sans-serif] text-[length:var(--text-token-4xl)] font-extrabold leading-tight lg:text-[length:var(--text-token-5xl)]">
                  Miles turn preference into proof.
                </h2>
                <p className="max-w-[560px] text-[length:var(--text-token-lg)] leading-[1.75] text-foreground/72">
                  {route.body}
                </p>
              </div>
            </Col>
            <Col span="full" spanMd={4} spanLg={7}>
              <figure className="space-y-[var(--spacing-token-xs)]">
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  <img
                    src={route.image}
                    alt={route.imageAlt || route.title}
                    className="h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-y-0 left-0 w-[var(--spacing-token-xs)] bg-primary" />
                </div>
                <EditorialImageCaption
                  caption={route.title}
                  credit={route.imageCredit}
                />
              </figure>
            </Col>
          </Grid>
        </EditorialFullBleedSection>
      )}

      <EditorialFullBleedSection className="bg-background py-[var(--spacing-token-4xl)] lg:py-[var(--spacing-token-6xl)]">
        <Grid alignStart gap="loose">
          <Col span="full" spanMd={8} spanLg={12}>
            <div className="mb-[var(--spacing-token-xl)] max-w-[760px] space-y-[var(--spacing-token-md)]">
              <p className="[font-family:Inter,system-ui,sans-serif] text-[length:var(--text-token-4xs)] font-extrabold uppercase tracking-widest text-primary">
                03 / Evidence Board
              </p>
              <h2 className="[font-family:Inter,system-ui,sans-serif] text-[length:var(--text-token-4xl)] font-extrabold leading-tight md:text-[length:var(--text-token-6xl)]">
                The verdict has receipts.
              </h2>
            </div>
          </Col>
          {scoreSheet && (
            <Col span="full" spanMd={8} spanLg={12}>
              <figure className="space-y-[var(--spacing-token-sm)]">
                <div className="relative overflow-hidden border-y-4 border-foreground bg-background">
                  <img
                    src={scoreSheet.src}
                    alt={scoreSheet.alt || ""}
                    className="h-auto w-full object-contain object-center"
                  />
                </div>
                <EditorialImageCaption
                  caption={scoreSheet.caption}
                  credit={scoreSheet.credit}
                  className="max-w-[860px] text-[length:var(--text-token-sm)]"
                />
              </figure>
            </Col>
          )}
          {verdict && cabin && (
            <>
              <Col span="full" spanMd={4} spanLg={5}>
                <div className="space-y-[var(--spacing-token-lg)] pt-[var(--spacing-token-xl)]">
                  <p className="[font-family:Inter,system-ui,sans-serif] text-[length:var(--text-token-4xs)] font-extrabold uppercase tracking-widest text-primary">
                    04 / The Winner
                  </p>
                  <h2 className="[font-family:Inter,system-ui,sans-serif] text-[length:var(--text-token-4xl)] font-extrabold leading-tight lg:text-[length:var(--text-token-5xl)]">
                    {verdict.title}
                  </h2>
                  <p className="text-[length:var(--text-token-lg)] leading-[1.75] text-foreground/72">
                    {verdict.body}
                  </p>
                  {verdict.quote && (
                    <blockquote className="border-l-4 border-primary pl-[var(--spacing-token-md)]">
                      <p className="[font-family:Inter,system-ui,sans-serif] text-[length:var(--text-token-xl)] font-extrabold leading-tight text-foreground">
                        {verdict.quote}
                      </p>
                    </blockquote>
                  )}
                </div>
              </Col>
              <Col span="full" spanMd={4} spanLg={7}>
                <figure className="space-y-[var(--spacing-token-xs)] pt-[var(--spacing-token-xl)]">
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <img
                      src={cabin.src}
                      alt={cabin.alt || ""}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <EditorialImageCaption
                    caption={cabin.caption}
                    credit={cabin.credit}
                  />
                </figure>
              </Col>
            </>
          )}
        </Grid>
      </EditorialFullBleedSection>
    </>
  );
}

function ElleEditorialImageSequence({ content }: { content: ImmersiveArticleContent }) {
  const [site, room, ethic] = content.scenes;
  const media = content.mediaPair ?? [];
  const featured = media.find((item) => item.featured);
  const supporting = media.find((item) => !item.featured);

  return (
    <>
      {site && (
        <EditorialFullBleedSection className="bg-[#f5f0ea] py-[var(--spacing-token-4xl)] lg:py-[var(--spacing-token-6xl)]">
          <Grid alignStart gap="loose">
            <Col span="full" spanMd={3} spanLg={3}>
              <div className="space-y-[var(--spacing-token-md)] lg:sticky lg:top-[var(--spacing-token-xl)]">
                <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-foreground/60 font-brand-secondary">
                  01 / {site.eyebrow}
                </p>
                <h2 className="headline text-[length:var(--text-token-4xl)] leading-[0.98] lg:text-[length:var(--text-token-6xl)]">
                  {site.title}
                </h2>
              </div>
            </Col>
            <Col span="full" spanMd={5} spanLg={9}>
              <figure className="space-y-[var(--spacing-token-sm)]">
                <div
                  className="relative aspect-[16/9] overflow-hidden bg-muted"
                  style={{ marginLeft: "calc(50% - 50vw)", width: "100vw" }}
                >
                  <img
                    src={site.image}
                    alt={site.imageAlt || site.title}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <EditorialImageCaption
                  caption={site.body}
                  credit={site.imageCredit}
                  className="max-w-[820px]"
                />
              </figure>
            </Col>
          </Grid>
        </EditorialFullBleedSection>
      )}

      {room && (
        <EditorialFullBleedSection className="bg-background py-[var(--spacing-token-4xl)] lg:py-[var(--spacing-token-6xl)]">
          <Grid alignStart gap="loose" className="items-end">
            <Col span="full" spanMd={8} spanLg={12}>
              <figure className="space-y-[var(--spacing-token-sm)]">
                <div
                  className="relative min-h-[620px] overflow-hidden bg-muted"
                  style={{ marginLeft: "calc(50% - 50vw)", width: "100vw" }}
                >
                  <img
                    src={room.image}
                    alt={room.imageAlt || room.title}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/58 to-transparent p-[var(--spacing-token-lg)] md:p-[var(--spacing-token-3xl)]">
                    <div className="max-w-[860px] space-y-[var(--spacing-token-md)] text-background">
                      <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest font-brand-secondary">
                        02 / {room.eyebrow}
                      </p>
                      <h2 className="headline text-[length:var(--text-token-5xl)] leading-none md:text-[length:var(--text-token-7xl)]">
                        {room.title}
                      </h2>
                      <p className="max-w-[680px] text-[length:var(--text-token-lg)] leading-[1.7] text-background/82">
                        {room.body}
                      </p>
                    </div>
                  </div>
                </div>
                <EditorialImageCaption credit={room.imageCredit} />
              </figure>
            </Col>
          </Grid>
        </EditorialFullBleedSection>
      )}

      {(featured || supporting || ethic) && (
        <EditorialFullBleedSection className="bg-[#ede8df] py-[var(--spacing-token-4xl)] lg:py-[var(--spacing-token-6xl)]">
          <Grid alignStart gap="loose">
            <Col span="full" spanMd={3} spanLg={3}>
              <div className="space-y-[var(--spacing-token-sm)] lg:sticky lg:top-[var(--spacing-token-xl)]">
                <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-foreground/60 font-brand-secondary">
                  {content.visualEssayEyebrow ?? "Spatial notes"}
                </p>
                <h2 className="headline text-[length:var(--text-token-4xl)] leading-[0.98] lg:text-[length:var(--text-token-6xl)]">
                  {content.visualEssayTitle ?? "The building explains itself in light."}
                </h2>
              </div>
            </Col>
            {featured && (
              <Col span="full" spanMd={5} spanLg={9}>
                <figure className="space-y-[var(--spacing-token-sm)]">
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted lg:ml-0 lg:w-full" style={{ marginLeft: "calc(50% - 50vw)", width: "100vw" }}>
                    <img
                      src={featured.src}
                      alt={featured.alt || ""}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <EditorialImageCaption
                    caption={featured.caption}
                    credit={featured.credit}
                  />
                </figure>
              </Col>
            )}
            {supporting && (
              <Col span="full" spanMd={4} spanLg={6} startLg={4}>
                <figure className="mt-[var(--spacing-token-xl)] space-y-[var(--spacing-token-sm)]">
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    <img
                      src={supporting.src}
                      alt={supporting.alt || ""}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <EditorialImageCaption
                    caption={supporting.caption}
                    credit={supporting.credit}
                  />
                </figure>
              </Col>
            )}
            {ethic && (
              <Col span="full" spanMd={4} spanLg={5}>
                <div className="mt-[var(--spacing-token-xl)] space-y-[var(--spacing-token-lg)]">
                  <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-foreground/60 font-brand-secondary">
                    03 / {ethic.eyebrow}
                  </p>
                  <h2 className="headline text-[length:var(--text-token-4xl)] leading-tight">
                    {ethic.title}
                  </h2>
                  <p className="text-[length:var(--text-token-lg)] leading-[1.78] text-foreground/72">
                    {ethic.body}
                  </p>
                  {ethic.quote && (
                    <blockquote className="border-t border-foreground pt-[var(--spacing-token-md)]">
                      <p className="headline text-[length:var(--text-token-2xl)] leading-tight">
                        {ethic.quote}
                      </p>
                    </blockquote>
                  )}
                </div>
              </Col>
            )}
          </Grid>
        </EditorialFullBleedSection>
      )}
    </>
  );
}

function AdaptiveEditorialImageSequence({
  content,
  brandSlug,
}: {
  content: ImmersiveArticleContent;
  brandSlug: string;
}) {
  const mood = getEditorialMood(brandSlug);
  const moodStyle = editorialMoodStyles[mood];
  const [opening, detail, turn] = content.scenes;
  const media = content.mediaPair ?? [];
  const featured = media.find((item) => item.featured);
  const supporting = media.find((item) => !item.featured);

  return (
    <>
      {opening && (
        <section className={cn("relative left-1/2 w-screen -translate-x-1/2 overflow-hidden text-background", moodStyle.darkBg)}>
          <figure className="relative min-h-[680px] overflow-hidden bg-muted lg:min-h-[820px]">
            <img
              src={opening.image}
              alt={opening.imageAlt || opening.title}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className={cn("absolute inset-0", moodStyle.overlay)} />
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/12 via-transparent to-foreground/84" />
            <PageContainer className="relative z-10 flex min-h-[680px] items-end py-[var(--spacing-token-4xl)] lg:min-h-[820px] lg:py-[var(--spacing-token-6xl)]">
              <Grid alignStart gap="loose" className="w-full">
                <Col span="full" spanMd={6} spanLg={8}>
                  <div className="max-w-[920px] space-y-[var(--spacing-token-lg)]">
                    <p className={cn("text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest font-brand-secondary", moodStyle.accent)}>
                      01 / {opening.eyebrow}
                    </p>
                    <h2 className="headline text-[length:var(--text-token-4xl)] leading-[0.96] drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)] md:text-[length:var(--text-token-6xl)] lg:text-[length:var(--text-token-7xl)]">
                      {opening.title}
                    </h2>
                    <p className="max-w-[760px] text-[length:var(--text-token-lg)] leading-[1.7] text-background/84">
                      {opening.body}
                    </p>
                    {opening.quote && (
                      <blockquote className="max-w-[880px] border-t border-background/45 pt-[var(--spacing-token-md)]">
                        <p className="headline text-[length:var(--text-token-2xl)] leading-tight text-background lg:text-[length:var(--text-token-4xl)]">
                          {opening.quote}
                        </p>
                      </blockquote>
                    )}
                  </div>
                </Col>
                <Col span="full" spanMd={2} spanLg={4} className="flex items-end justify-end">
                  <EditorialImageCaption
                    credit={opening.imageCredit}
                    className="mt-[var(--spacing-token-lg)] max-w-[340px] text-right text-background/70"
                  />
                </Col>
              </Grid>
            </PageContainer>
          </figure>
        </section>
      )}

      {detail && (
        <EditorialFullBleedSection className={cn("py-[var(--spacing-token-4xl)] lg:py-[var(--spacing-token-6xl)]", moodStyle.softBg)}>
          <Grid alignStart gap="loose" className="items-center">
            <Col span="full" spanMd={4} spanLg={5}>
              <div className="space-y-[var(--spacing-token-lg)]">
                <p className={cn("text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest font-brand-secondary", mood === "food" ? "text-[#b8341f]" : mood === "ride" ? "text-[#0081a7]" : mood === "profile" ? "text-[#d7352d]" : "text-primary")}>
                  02 / {detail.eyebrow}
                </p>
                <p
                  aria-hidden="true"
                  className={cn(
                    "headline text-[8rem] leading-none opacity-15 md:text-[11rem] lg:text-[14rem]",
                    mood === "profile" ? "text-[#d7352d]" : "text-primary",
                  )}
                >
                  02
                </p>
                <h2 className="headline text-[length:var(--text-token-4xl)] leading-[0.98] lg:text-[length:var(--text-token-6xl)]">
                  {detail.title}
                </h2>
                <p className="max-w-[560px] text-[length:var(--text-token-lg)] leading-[1.78] text-foreground/74">
                  {detail.body}
                </p>
              </div>
            </Col>
            <Col span="full" spanMd={4} spanLg={7}>
              <figure className="space-y-[var(--spacing-token-sm)]">
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={detail.image}
                    alt={detail.imageAlt || detail.title}
                    className="h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-y-0 left-0 w-[var(--spacing-token-xs)] bg-primary" />
                </div>
                <EditorialImageCaption
                  caption={detail.quote ?? detail.title}
                  credit={detail.imageCredit}
                />
              </figure>
            </Col>
          </Grid>
        </EditorialFullBleedSection>
      )}

      {(turn || featured || supporting) && (
        <EditorialFullBleedSection className={cn("py-[var(--spacing-token-4xl)] lg:py-[var(--spacing-token-6xl)]", mood === "profile" ? "bg-[#050505] text-background" : moodStyle.midBg)}>
          <Grid alignStart gap="loose">
            <Col span="full" spanMd={8} spanLg={12}>
              <div className="mb-[var(--spacing-token-xl)] max-w-[920px] space-y-[var(--spacing-token-sm)]">
                <p className={cn("text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest font-brand-secondary", mood === "profile" ? "text-[#f04a3a]" : "text-primary")}>
                  {content.visualEssayEyebrow ?? "Visual notes"}
                </p>
                <h2 className="headline text-[length:var(--text-token-4xl)] leading-[0.98] md:text-[length:var(--text-token-5xl)] lg:text-[length:var(--text-token-6xl)]">
                  {content.visualEssayTitle ?? turn?.title}
                </h2>
              </div>
            </Col>
            {featured && (
              <Col span="full" spanMd={8} spanLg={12}>
                <figure className="space-y-[var(--spacing-token-sm)]">
                  <div
                    className="relative aspect-[16/9] overflow-hidden bg-muted"
                    style={{ marginLeft: "calc(50% - 50vw)", width: "100vw" }}
                  >
                    <img
                      src={featured.src}
                      alt={featured.alt || ""}
                      className="h-full w-full object-contain object-center"
                    />
                  </div>
                  <EditorialImageCaption
                    caption={featured.caption}
                    credit={featured.credit}
                    className={cn("max-w-[960px]", mood === "profile" && "text-background/68")}
                  />
                </figure>
              </Col>
            )}
            {turn && (
              <Col span="full" spanMd={4} spanLg={5} startLg={2}>
                <div className="mt-[var(--spacing-token-xl)] space-y-[var(--spacing-token-lg)]">
                  <p className={cn("text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest font-brand-secondary", mood === "profile" ? "text-[#f04a3a]" : "text-primary")}>
                    03 / {turn.eyebrow}
                  </p>
                  <h2 className="headline text-[length:var(--text-token-4xl)] leading-tight">
                    {turn.title}
                  </h2>
                  <p className={cn("text-[length:var(--text-token-lg)] leading-[1.78]", mood === "profile" ? "text-background/72" : "text-foreground/72")}>
                    {turn.body}
                  </p>
                  {turn.quote && (
                    <blockquote className={cn("border-t pt-[var(--spacing-token-md)]", mood === "profile" ? "border-background/45" : "border-foreground")}>
                      <p className="headline text-[length:var(--text-token-2xl)] leading-tight">
                        {turn.quote}
                      </p>
                    </blockquote>
                  )}
                </div>
              </Col>
            )}
            {supporting && (
              <Col span="full" spanMd={4} spanLg={5} startLg={7}>
                <figure className="mt-[var(--spacing-token-xl)] space-y-[var(--spacing-token-sm)]">
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    <img
                      src={supporting.src}
                      alt={supporting.alt || ""}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <EditorialImageCaption
                    caption={supporting.caption}
                    credit={supporting.credit}
                    className={cn(mood === "profile" && "text-background/68")}
                  />
                </figure>
              </Col>
            )}
          </Grid>
        </EditorialFullBleedSection>
      )}

      <EditorialPosterQuote content={content} />
    </>
  );
}

function BrandEditorialFeatureTemplate({
  content,
  showGridOverlay = false,
}: ArticleEditorialFeatureTemplateProps) {
  const { brand } = useTheme();
  const navLinks = content.navLinks ?? ["Home", "News", "Features", "Culture", "Style", "Health", "Food", "Travel"];

  return (
    <div className="min-h-screen bg-background font-brand">
      <PageContainer className="relative">
        {showGridOverlay && <GridOverlay />}
        <div className="relative z-10">
          <ArticleUtilityBar />
          <ArticleNav navLinks={navLinks} />
          <BrandHorizontalEditorialHero content={content} brandSlug={brand.slug} />
          <EditorialIntro content={content} />
          {brand.slug === "car-and-driver" ? (
            <CarAndDriverRoadTestSequence content={content} />
          ) : brand.slug === "elle" ? (
            <ElleEditorialImageSequence content={content} />
          ) : (
            <AdaptiveEditorialImageSequence content={content} brandSlug={brand.slug} />
          )}
          <EditorialBodySection content={content} brandName={brand.name} />

          {content.relatedArticles && content.relatedArticles.length > 0 && (
            <EditorialFullBleedSection className="bg-background pb-[var(--spacing-token-3xl)]">
              <RelatedArticles articles={content.relatedArticles} />
            </EditorialFullBleedSection>
          )}
        </div>
      </PageContainer>

      <ArticleFooter />
    </div>
  );
}

function CosmoHeroImage({ content }: { content: ImmersiveArticleContent }) {
  return (
    <figure className="h-full min-h-[620px] space-y-[var(--spacing-token-xs)] md:min-h-[780px] lg:min-h-[940px]">
      <div className="relative h-full overflow-hidden bg-[#14090b]">
        <img
          src={content.heroImage}
          alt={content.heroImageAlt || content.headline}
          className="h-full w-full scale-[1.015] object-cover object-[center_24%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#15090a]/44 via-transparent to-transparent" />
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-[#13080a]/52 to-transparent lg:block" />
        <div className="absolute inset-y-0 left-0 w-[var(--spacing-token-xs)] bg-primary" />
        <div
          aria-hidden
          className="absolute bottom-[var(--spacing-token-lg)] left-[var(--spacing-token-lg)] hidden text-[length:var(--text-token-4xs)] font-bold uppercase tracking-[0.42em] text-background/82 font-brand-secondary md:block"
          style={{ writingMode: "vertical-rl" }}
        >
          Gentleman / Desire / Volume
        </div>
      </div>
      <EditorialImageCaption
        credit={content.heroImageCredit}
        className="text-right text-[length:var(--text-token-3xs)] font-semibold"
      />
    </figure>
  );
}

function CosmoEditorialHeadline({ headline }: { headline: string }) {
  if (headline !== "Towa Bird Thinks We Should Talk About Queer Sex More") {
    return (
      <h1 className="headline max-w-[760px] text-[4.25rem] leading-[0.86] text-foreground sm:text-[5.25rem] md:text-[5.85rem] lg:text-[7.25rem] xl:text-[8.5rem]">
        {headline}
      </h1>
    );
  }

  return (
    <h1 aria-label={headline} className="headline max-w-[760px] text-foreground">
      <span className="block text-[4.6rem] leading-[0.78] sm:text-[5.7rem] md:text-[6.25rem] lg:text-[7.15rem] xl:text-[7.7rem]">
        Towa Bird
      </span>
      <span className="mt-[var(--spacing-token-md)] block max-w-[620px] text-[2.95rem] leading-[0.88] sm:text-[3.75rem] md:text-[4.15rem] lg:text-[4.65rem] xl:text-[4.95rem]">
        Thinks We Should
      </span>
      <span className="block max-w-[520px] text-[2.95rem] leading-[0.88] sm:text-[3.75rem] md:text-[4.15rem] lg:text-[4.65rem] xl:text-[4.95rem]">
        Talk About
      </span>
      <span className="mt-[var(--spacing-token-sm)] inline-block border-t-2 border-primary pt-[var(--spacing-token-xs)] text-[3.55rem] leading-[0.85] text-primary sm:text-[4.55rem] md:text-[5.15rem] lg:text-[6.2rem] xl:text-[6.9rem]">
        Queer Sex
      </span>
      <span className="block text-[3.55rem] leading-[0.82] sm:text-[4.55rem] md:text-[5.15rem] lg:ml-[var(--spacing-token-6xl)] lg:text-[6.2rem] xl:text-[6.9rem]">
        More
      </span>
    </h1>
  );
}

function CosmoEditorialHero({ content }: { content: ImmersiveArticleContent }) {
  return (
    <header className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b border-primary/20 bg-[#fff2f4] py-[var(--spacing-token-3xl)] lg:py-[var(--spacing-token-5xl)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[44vw] bg-[#13080a] lg:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[5.5rem] left-[4vw] hidden text-[11rem] font-black uppercase leading-none text-primary/[0.055] [font-family:Inter,system-ui,sans-serif] lg:block xl:text-[15rem]"
      >
        Gentleman
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -left-12 top-[18%] hidden text-[15rem] leading-none text-primary/[0.06] md:block lg:text-[23rem]"
      >
        &ldquo;
      </div>
      <PageContainer className="relative z-10">
        <Grid gap="loose" alignStart className="items-stretch">
          <Col span="full" spanMd={4} spanLg={7} className="relative z-20">
            <div className="flex flex-col justify-between py-[var(--spacing-token-md)] md:min-h-[760px] lg:min-h-[900px]">
              <div className="space-y-[var(--spacing-token-xl)]">
                <EditorialBreadcrumbs content={content} />
                <div className="space-y-[var(--spacing-token-lg)]">
                  {content.immersiveLabel && (
                    <p className="inline-flex border-b-2 border-primary pb-[var(--spacing-token-2xs)] text-[length:var(--text-token-3xs)] font-bold uppercase tracking-widest text-primary font-brand-secondary">
                      {content.immersiveLabel}
                    </p>
                  )}
                  <CosmoEditorialHeadline headline={content.headline} />
                </div>
                <div className="md:hidden">
                  <CosmoHeroImage content={content} />
                </div>
              </div>
              <div className="max-w-[680px] space-y-[var(--spacing-token-lg)] pt-[var(--spacing-token-2xl)]">
                {content.dek && (
                  <p className="text-[length:var(--text-token-xl)] font-semibold leading-[1.45] text-foreground/78 lg:text-[length:var(--text-token-2xl)]">
                    {content.dek}
                  </p>
                )}
                <div className="grid gap-[var(--spacing-token-sm)] border-t border-primary/25 pt-[var(--spacing-token-md)] text-[length:var(--text-token-3xs)] font-semibold uppercase tracking-widest text-muted-foreground font-brand-secondary sm:grid-cols-3">
                  <div>
                    <span className="block text-foreground">By</span>
                    {content.author}
                  </div>
                  {content.photographedBy && (
                    <div>
                      <span className="block text-foreground">Photos</span>
                      {content.photographedBy}
                    </div>
                  )}
                  <div>
                    <span className="block text-foreground">Published</span>
                    {content.publishedDate}
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col span="full" spanMd={4} spanLg={5} startLg={8} className="relative z-10 hidden md:block">
            <CosmoHeroImage content={content} />
          </Col>
        </Grid>
      </PageContainer>
    </header>
  );
}

function CosmoEditorialPrelude({ content }: { content: ImmersiveArticleContent }) {
  return (
    <EditorialFullBleedSection className="border-b border-primary/15 bg-background py-[var(--spacing-token-4xl)] lg:py-[var(--spacing-token-6xl)]">
      <Grid alignStart gap="loose">
        <Col span="full" spanMd={3} spanLg={3}>
          <div className="space-y-[var(--spacing-token-md)] lg:sticky lg:top-[var(--spacing-token-xl)]">
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary font-brand-secondary">
              {content.introEyebrow ?? "Before the interview"}
            </p>
            {content.immersiveKicker && (
              <h2 className="headline text-[length:var(--text-token-4xl)] leading-[0.98] lg:text-[length:var(--text-token-6xl)]">
                {content.immersiveKicker}
              </h2>
            )}
          </div>
        </Col>
        <Col span="full" spanMd={5} spanLg={6}>
          {content.immersiveIntro && (
            <ArticleBody className="[&>p]:text-[length:var(--text-token-xl)] [&>p]:leading-[1.75] [&>p]:text-foreground/82">
              {content.immersiveIntro}
            </ArticleBody>
          )}
        </Col>
        {content.factRail && content.factRail.length > 0 && (
          <Col span="full" spanMd={8} spanLg={3}>
            <dl className="grid grid-cols-2 gap-x-[var(--spacing-token-md)] gap-y-[var(--spacing-token-lg)] border-y border-foreground py-[var(--spacing-token-md)] lg:grid-cols-1">
              {content.factRail.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary font-brand-secondary">
                    {fact.label}
                  </dt>
                  <dd className="mt-[var(--spacing-token-2xs)] text-[length:var(--text-token-sm)] font-semibold leading-snug text-foreground">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Col>
        )}
      </Grid>
    </EditorialFullBleedSection>
  );
}

function CosmoEditorialChapter({
  scene,
  index,
}: {
  scene: ImmersiveArticleScene;
  index: number;
}) {
  const imageRight = index % 2 === 0;

  if (index === 0) {
    return (
      <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#100809] text-background">
        <figure className="relative min-h-[760px] overflow-hidden lg:min-h-[880px]">
          <img
            src={scene.image}
            alt={scene.imageAlt || scene.title}
            className="absolute inset-0 h-full w-full object-cover object-[center_22%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#100809]/92 via-[#100809]/56 to-[#100809]/10" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#100809] to-transparent" />
          <div
            aria-hidden
            className="absolute right-[5vw] top-[var(--spacing-token-3xl)] hidden text-[8rem] font-black uppercase leading-none text-background/[0.08] [font-family:Inter,system-ui,sans-serif] lg:block xl:text-[11rem]"
          >
            Seen
          </div>
          <PageContainer className="relative z-10 flex min-h-[760px] items-end py-[var(--spacing-token-4xl)] lg:min-h-[880px] lg:py-[var(--spacing-token-6xl)]">
            <Grid alignStart gap="loose" className="w-full">
              <Col span="full" spanMd={5} spanLg={7}>
                <div className="max-w-[820px] space-y-[var(--spacing-token-lg)]">
                  <p className="text-[length:var(--text-token-3xs)] font-bold uppercase tracking-widest text-primary font-brand-secondary">
                    {String(index + 1).padStart(2, "0")} / {scene.eyebrow}
                  </p>
                  <h2 className="headline text-[length:var(--text-token-5xl)] leading-[0.9] md:text-[length:var(--text-token-7xl)] lg:text-[7rem]">
                    {scene.title}
                  </h2>
                  <p className="max-w-[620px] text-[length:var(--text-token-lg)] leading-[1.75] text-background/82 lg:text-[length:var(--text-token-xl)]">
                    {scene.body}
                  </p>
                  {scene.quote && (
                    <blockquote className="max-w-[720px] border-t border-background/45 pt-[var(--spacing-token-md)]">
                      <p className="headline text-[length:var(--text-token-2xl)] leading-tight text-background lg:text-[length:var(--text-token-4xl)]">
                        {scene.quote}
                      </p>
                    </blockquote>
                  )}
                </div>
              </Col>
              <Col span="full" spanMd={3} spanLg={4} startLg={9} className="flex items-end justify-end">
                <EditorialImageCaption
                  credit={scene.imageCredit}
                  className="max-w-[320px] text-right text-background/72"
                />
              </Col>
            </Grid>
          </PageContainer>
        </figure>
      </section>
    );
  }

  return (
    <EditorialFullBleedSection className={cn("py-[var(--spacing-token-4xl)] lg:py-[var(--spacing-token-6xl)]", index === 1 ? "bg-foreground text-background" : "bg-[#fff7f7] text-foreground")}>
      <Grid alignStart gap="loose" className="items-center">
        <Col
          span="full"
          spanMd={4}
          spanLg={5}
          startLg={imageRight ? 1 : 8}
          rowStartLg={1}
          className={cn("relative z-10", imageRight && "lg:pr-[var(--spacing-token-xl)]")}
        >
          <div className="space-y-[var(--spacing-token-lg)]">
            <p className={cn("text-[length:var(--text-token-3xs)] font-bold uppercase tracking-widest font-brand-secondary", index === 1 ? "text-primary" : "text-primary")}>
              {String(index + 1).padStart(2, "0")} / {scene.eyebrow}
            </p>
            <h2 className="headline text-[length:var(--text-token-5xl)] leading-[0.92] lg:text-[length:var(--text-token-7xl)]">
              {scene.title}
            </h2>
            <p className={cn("text-[length:var(--text-token-lg)] leading-[1.8]", index === 1 ? "text-background/78" : "text-foreground/76")}>
              {scene.body}
            </p>
            {scene.quote && (
              <blockquote className={cn("border-l-4 pl-[var(--spacing-token-md)]", index === 1 ? "border-background" : "border-primary")}>
                <p className="headline text-[length:var(--text-token-2xl)] leading-tight">
                  {scene.quote}
                </p>
              </blockquote>
            )}
          </div>
        </Col>
        <Col
          span="full"
          spanMd={4}
          spanLg={6}
          startLg={imageRight ? 7 : 1}
          rowStartLg={1}
        >
          <figure className="space-y-[var(--spacing-token-xs)]">
            <div className="relative min-h-[620px] overflow-hidden bg-muted lg:min-h-[760px]">
              <img
                src={scene.image}
                alt={scene.imageAlt || scene.title}
                className="absolute inset-0 h-full w-full object-cover object-[center_24%]"
              />
              <div className={cn("absolute inset-y-0 w-[var(--spacing-token-xs)] bg-primary", imageRight ? "left-0" : "right-0")} />
            </div>
            <EditorialImageCaption
              caption={scene.title}
              credit={scene.imageCredit}
              className={cn(index === 1 && "text-background/72")}
            />
          </figure>
        </Col>
      </Grid>
    </EditorialFullBleedSection>
  );
}

function CosmoEditorialPosterQuote({ content }: { content: ImmersiveArticleContent }) {
  const quotedScene = content.scenes.find((scene) => scene.quote);
  const quote = quotedScene?.quote ?? content.dek;

  if (!quote) return null;

  return (
    <EditorialFullBleedSection className="bg-background py-[var(--spacing-token-5xl)] lg:py-[calc(var(--spacing-token-6xl)*1.25)]">
      <Grid alignStart gap="loose" className="items-center">
        <Col span="full" spanMd={2} spanLg={2}>
          <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary font-brand-secondary">
            {content.posterQuoteEyebrow ?? "Emotional pause"}
          </p>
        </Col>
        <Col span="full" spanMd={6} spanLg={10}>
          <blockquote className="relative min-h-[420px] border-y border-foreground py-[var(--spacing-token-2xl)]">
            <span
              aria-hidden="true"
              className="headline pointer-events-none absolute -left-2 -top-10 text-[13rem] leading-none text-primary md:text-[18rem] lg:text-[24rem]"
            >
              &ldquo;
            </span>
            <p className="headline relative ml-auto max-w-[920px] text-[length:var(--text-token-5xl)] leading-[0.94] text-foreground md:text-[length:var(--text-token-7xl)] lg:text-[6.75rem]">
              {quote}
            </p>
            {quotedScene && (
              <cite className="relative mt-[var(--spacing-token-xl)] block text-[length:var(--text-token-3xs)] font-bold uppercase tracking-widest text-primary not-italic font-brand-secondary">
                {quotedScene.eyebrow}
              </cite>
            )}
          </blockquote>
        </Col>
      </Grid>
    </EditorialFullBleedSection>
  );
}

function CosmoEditorialCollage({ content }: { content: ImmersiveArticleContent }) {
  const media = content.mediaPair ?? [];
  if (media.length === 0) return null;
  const [primary, secondary, ...rest] = media;

  return (
    <EditorialFullBleedSection className="border-y border-primary/20 bg-[#f5ece8] py-[var(--spacing-token-4xl)] lg:py-[var(--spacing-token-6xl)]">
      <Grid alignStart gap="loose">
        <Col span="full" spanMd={3} spanLg={3}>
          <div className="space-y-[var(--spacing-token-sm)] lg:sticky lg:top-[var(--spacing-token-xl)]">
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary font-brand-secondary">
              {content.visualEssayEyebrow ?? "Portrait sequence"}
            </p>
            <h2 className="headline text-[length:var(--text-token-4xl)] leading-[0.96] lg:text-[length:var(--text-token-6xl)]">
              {content.visualEssayTitle ?? "The portraits keep identity, style, and desire in the same frame."}
            </h2>
          </div>
        </Col>
        <Col span="full" spanMd={5} spanLg={9}>
          <div className="relative grid gap-[var(--spacing-token-lg)] md:grid-cols-12 md:items-start">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-[var(--spacing-token-lg)] top-[var(--spacing-token-xl)] hidden text-[6rem] font-black uppercase leading-none text-primary/[0.08] [font-family:Inter,system-ui,sans-serif] lg:block xl:text-[8rem]"
            >
              Volume
            </div>
            {primary && (
              <figure className="relative z-10 space-y-[var(--spacing-token-xs)] md:col-span-8">
                <div className="relative aspect-[4/5] overflow-hidden bg-muted md:aspect-[5/6]">
                  <img
                    src={primary.src}
                    alt={primary.alt || ""}
                    className="h-full w-full object-cover object-[center_24%]"
                  />
                  <div className="absolute left-0 top-0 h-full w-[var(--spacing-token-2xs)] bg-primary" />
                </div>
                <EditorialImageCaption
                  caption={primary.caption}
                  credit={primary.credit}
                />
              </figure>
            )}
            {secondary && (
              <figure className="relative z-20 space-y-[var(--spacing-token-xs)] md:col-span-6 md:col-start-7 md:-mt-[var(--spacing-token-6xl)] lg:-ml-[var(--spacing-token-3xl)]">
                <div className="relative aspect-[3/4] overflow-hidden border-[10px] border-[#f5ece8] bg-muted shadow-[0_24px_70px_rgba(25,8,8,0.18)]">
                  <img
                    src={secondary.src}
                    alt={secondary.alt || ""}
                    className="h-full w-full object-cover object-[center_24%]"
                  />
                  <div className="absolute right-0 top-0 h-full w-[var(--spacing-token-2xs)] bg-primary" />
                </div>
                <EditorialImageCaption
                  caption={secondary.caption}
                  credit={secondary.credit}
                />
              </figure>
            )}
            {rest.map((item, i) => (
              <figure key={`${item.src}-${i}`} className="space-y-[var(--spacing-token-xs)] md:col-span-5">
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={item.src}
                    alt={item.alt || ""}
                    className="h-full w-full object-cover object-[center_24%]"
                  />
                </div>
                <EditorialImageCaption
                  caption={item.caption}
                  credit={item.credit}
                />
              </figure>
            ))}
          </div>
        </Col>
      </Grid>
    </EditorialFullBleedSection>
  );
}

function CosmoEditorialBodySection({
  content,
  brandName,
}: {
  content: ImmersiveArticleContent;
  brandName: string;
}) {
  return (
    <EditorialFullBleedSection className="bg-background py-[var(--spacing-token-4xl)] lg:py-[var(--spacing-token-6xl)]">
      <Grid alignStart gap="loose">
        <Col span="full" spanMd={2} spanLg={3}>
          <aside className="hidden space-y-[var(--spacing-token-md)] border-t border-primary pt-[var(--spacing-token-md)] md:block lg:sticky lg:top-[var(--spacing-token-xl)]">
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary font-brand-secondary">
              {content.bodyRailEyebrow ?? "Emotional path"}
            </p>
            <ol className="space-y-[var(--spacing-token-sm)]">
              {content.scenes.map((scene, i) => (
                <li key={scene.eyebrow} className="text-[length:var(--text-token-3xs)] font-semibold uppercase tracking-widest text-foreground/70 font-brand-secondary">
                  {String(i + 1).padStart(2, "0")} {scene.eyebrow}
                </li>
              ))}
            </ol>
          </aside>
        </Col>
        <Col span="full" spanMd={6} spanLg={6}>
          <div className="space-y-[var(--spacing-token-4xl)]">
            <ArticleBody className="[&>h2]:headline [&>p]:text-[length:var(--text-token-lg)] [&>p]:leading-[1.95]">
              {content.body}
            </ArticleBody>
            <ArticleNewsletter brandName={brandName} />
          </div>
        </Col>
      </Grid>
    </EditorialFullBleedSection>
  );
}

function CosmoEditorialFeatureTemplate({
  content,
  showGridOverlay = false,
}: ArticleEditorialFeatureTemplateProps) {
  const { brand } = useTheme();
  const navLinks = content.navLinks ?? ["Love", "Pop Culture", "Style", "Beauty", "Features", "Astrology", "Shopping"];

  return (
    <div className="min-h-screen bg-background font-brand">
      <PageContainer className="relative">
        {showGridOverlay && <GridOverlay />}
        <div className="relative z-10">
          <ArticleUtilityBar />
          <ArticleNav navLinks={navLinks} />
          <CosmoEditorialHero content={content} />
          <CosmoEditorialPrelude content={content} />
          {content.scenes.map((scene, index) => (
            <CosmoEditorialChapter key={scene.eyebrow} scene={scene} index={index} />
          ))}
          <CosmoEditorialPosterQuote content={content} />
          <CosmoEditorialCollage content={content} />
          <CosmoEditorialBodySection content={content} brandName={brand.name} />

          {content.relatedArticles && content.relatedArticles.length > 0 && (
            <EditorialFullBleedSection className="bg-background pb-[var(--spacing-token-3xl)]">
              <RelatedArticles articles={content.relatedArticles} />
            </EditorialFullBleedSection>
          )}
        </div>
      </PageContainer>

      <ArticleFooter />
    </div>
  );
}

function ArticleFooter() {
  const { brand } = useTheme();
  const logo = brandLogos[brand.slug];

  const footerLogo = logo ? (
    <BrandLogo slug={brand.slug} className="[&_svg]:h-8 [&_svg]:w-auto" color="#fff" />
  ) : (
    brand.name
  );

  return (
    <div className="pt-[var(--spacing-token-3xl)]">
      <SiteFooter
        siteName={footerLogo}
        socialLinks={["YouTube", "Facebook", "Instagram", "Pinterest"]}
        legalLinks={["Privacy Notice", "Terms of Use", "Site Map"]}
        copyrightYear={2026}
      />
    </div>
  );
}

export interface ArticlePageTemplateProps {
  content: ArticlePageContent;
  /**
   * When true, shows the 4/8/12 column overlay inside the shared PageContainer
   * from the utility bar through related articles (aligned with nav + body).
   */
  showGridOverlay?: boolean;
}

export function ArticlePageTemplate({
  content,
  showGridOverlay = false,
}: ArticlePageTemplateProps) {
  const { brand } = useTheme();
  const navLinks = content.navLinks ?? ["Home", "News", "Features", "Culture", "Style", "Health", "Food", "Travel"];
  const sidebarItems = content.sidebarItems ?? [];

  return (
    <div className="min-h-screen font-brand bg-background">
      {/* One PageContainer + overlay so column guides run from utility through article (nav + leaderboard + body). */}
      <PageContainer className="relative">
        {showGridOverlay && <GridOverlay />}
        <div className="relative z-10">
          <ArticleUtilityBar />
          <ArticleNav navLinks={navLinks} />

          <div className="flex justify-center border-b border-border py-[var(--spacing-token-xl)]">
            <AdPlaceholder size="leaderboard" />
          </div>

          <div className="pt-[var(--spacing-token-2xl)] lg:pt-[var(--spacing-token-3xl)]">
            <Grid alignStart>
              <Col span="full" spanMd={5} spanLg={8}>
                <article className="min-w-0 space-y-[var(--spacing-token-2xl)] pb-[var(--spacing-token-3xl)]">
                  <ArticleHero
                    breadcrumbs={content.breadcrumbs}
                    headline={content.headline}
                    dek={content.dek}
                    image={content.heroImage}
                    imageAlt={content.heroImageAlt}
                    imageCredit={content.heroImageCredit}
                  />

                  <ArticleByline
                    author={content.author}
                    photographedBy={content.photographedBy}
                    publishedDate={content.publishedDate}
                  />

                  <ArticleBody>
                    {content.body}
                  </ArticleBody>

                  <div className="flex justify-center py-[var(--spacing-token-md)]">
                    <AdPlaceholder size="inline" />
                  </div>

                  <ArticleNewsletter brandName={brand.name} />
                </article>
              </Col>

              <Col span="full" spanMd={3} spanLg={4}>
                <ArticleSidebar items={sidebarItems} />
              </Col>
            </Grid>
          </div>

          {content.relatedArticles && content.relatedArticles.length > 0 && (
            <div className="pb-[var(--spacing-token-3xl)]">
              <RelatedArticles articles={content.relatedArticles} />
            </div>
          )}
        </div>
      </PageContainer>

      <ArticleFooter />
    </div>
  );
}

export interface ArticleImmersiveTemplateProps {
  content: ImmersiveArticleContent;
  showGridOverlay?: boolean;
}

export function ArticleImmersiveTemplate({
  content,
  showGridOverlay = false,
}: ArticleImmersiveTemplateProps) {
  const { brand } = useTheme();
  const navLinks = content.navLinks ?? ["Home", "News", "Features", "Culture", "Style", "Health", "Food", "Travel"];

  return (
    <div className="min-h-screen bg-background font-brand">
      <PageContainer className="relative">
        {showGridOverlay && <GridOverlay />}
        <div className="relative z-10">
          <ArticleUtilityBar />
          <ArticleNav navLinks={navLinks} />
        </div>
      </PageContainer>

      <ImmersiveHero content={content} />

      <PageContainer className="relative">
        {showGridOverlay && <GridOverlay />}
        <div className="relative z-10">
          <ImmersiveIntro content={content} />
        </div>
      </PageContainer>

      {content.scenes.map((scene, index) => (
        <ImmersiveSceneBand key={scene.eyebrow} scene={scene} index={index} />
      ))}

      <PageContainer className="relative">
        {showGridOverlay && <GridOverlay />}
        <div className="relative z-10">
          {content.mediaPair && <ImmersiveMediaPair media={content.mediaPair} />}
          <ImmersiveBodySection content={content} brandName={brand.name} />

          {content.relatedArticles && content.relatedArticles.length > 0 && (
            <div className="pb-[var(--spacing-token-3xl)]">
              <RelatedArticles articles={content.relatedArticles} />
            </div>
          )}
        </div>
      </PageContainer>

      <ArticleFooter />
    </div>
  );
}

export interface ArticleEditorialFeatureTemplateProps {
  content: ImmersiveArticleContent;
  showGridOverlay?: boolean;
}

export function ArticleEditorialFeatureTemplate({
  content,
  showGridOverlay = false,
}: ArticleEditorialFeatureTemplateProps) {
  const { brand } = useTheme();
  const navLinks = content.navLinks ?? ["Home", "News", "Features", "Culture", "Style", "Health", "Food", "Travel"];

  if (brand.slug === "cosmopolitan") {
    return (
      <CosmoEditorialFeatureTemplate
        content={content}
        showGridOverlay={showGridOverlay}
      />
    );
  }

  if (brand.slug === "car-and-driver" || brand.slug === "elle" || brand.slug === "bicycling" || brand.slug === "country-living" || brand.slug === "delish" || brand.slug === "esquire") {
    return (
      <BrandEditorialFeatureTemplate
        content={content}
        showGridOverlay={showGridOverlay}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background font-brand">
      <PageContainer className="relative">
        {showGridOverlay && <GridOverlay />}
        <div className="relative z-10">
          <ArticleUtilityBar />
          <ArticleNav navLinks={navLinks} />
          <EditorialHero content={content} />
          <EditorialIntro content={content} />
          {content.scenes.map((scene, index) => (
            <EditorialChapter key={scene.eyebrow} scene={scene} index={index} />
          ))}
          <EditorialPosterQuote content={content} />
          <EditorialMediaEssay content={content} />
          <EditorialBodySection content={content} brandName={brand.name} />

          {content.relatedArticles && content.relatedArticles.length > 0 && (
            <div className="pb-[var(--spacing-token-3xl)]">
              <RelatedArticles articles={content.relatedArticles} />
            </div>
          )}
        </div>
      </PageContainer>

      <ArticleFooter />
    </div>
  );
}
