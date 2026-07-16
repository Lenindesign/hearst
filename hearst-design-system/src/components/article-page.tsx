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
import { CheckCircle2, ChevronDown, CircleX, ExternalLink, Mail, Search } from "@/components/ui/icons";

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

type ImmersiveArticleImageTreatment = "before-after" | "product";

export interface ImmersiveArticleProductReview {
  award?: string;
  name: string;
  price?: string;
  retailer?: string;
  ctaLabel: string;
  href: string;
  pros?: string[];
  cons?: string[];
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
  layout?: "split" | "wide";
  imageFit?: "cover" | "contain";
  imagePosition?: string;
  imageTreatment?: ImmersiveArticleImageTreatment;
  productReview?: ImmersiveArticleProductReview;
}

export interface ImmersiveArticleMediaItem {
  src: string;
  alt?: string;
  caption?: string;
  credit?: string;
  featured?: boolean;
  fit?: "cover" | "contain";
  position?: string;
  treatment?: ImmersiveArticleImageTreatment;
  productReview?: ImmersiveArticleProductReview;
}

export interface ImmersiveArticleContent extends ArticlePageContent {
  displayMode?: "cinematic" | "photo-gallery";
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

function EditorialScrollNav({ navLinks }: { navLinks: string[] }) {
  const { brand } = useTheme();
  const logo = brandLogos[brand.slug];
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    let previousY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      const scrollingUp = currentY < previousY - 8;
      const scrollingDown = currentY > previousY + 8;

      if (currentY < 180 || scrollingDown) {
        setVisible(false);
      } else if (scrollingUp) {
        setVisible(true);
      }

      previousY = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-foreground/10 bg-background/88 px-[var(--spacing-token-md)] py-[var(--spacing-token-xs)] shadow-sm backdrop-blur-md transition duration-300",
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
      )}
    >
      <div className="mx-auto flex max-w-[var(--width-content-max)] items-center justify-between gap-[var(--spacing-token-md)]">
        <div className="min-w-0">
          {logo ? (
            <BrandLogo slug={brand.slug} className="[&_svg]:h-7 [&_svg]:w-auto" />
          ) : (
            <p className="headline text-[length:var(--text-token-lg)] uppercase tracking-widest">
              {brand.name}
            </p>
          )}
        </div>
        <nav className="hidden min-w-0 items-center justify-center gap-[var(--spacing-token-lg)] overflow-hidden md:flex">
          {navLinks.slice(0, 6).map((link) => (
            <LinkComponent
              key={link}
              variant="neutral"
              underline={false}
              size="xs"
              className="whitespace-nowrap font-semibold"
            >
              {link}
            </LinkComponent>
          ))}
        </nav>
        <Button variant="outline" size="icon-sm">
          <Search className="size-3.5" />
        </Button>
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

function EditorialBeforeAfterFrame({
  src,
  alt,
  className,
  imageClassName,
}: {
  src: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div className={cn("relative aspect-[2/1] overflow-hidden bg-muted", className)}>
      <img
        src={src}
        alt={alt || ""}
        className={cn("h-full w-full object-contain", imageClassName)}
      />
    </div>
  );
}

function EditorialProductFrame({
  src,
  alt,
  className,
  imageClassName,
}: {
  src: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div className={cn("relative aspect-[4/3] overflow-hidden bg-muted", className)}>
      <img
        src={src}
        alt={alt || ""}
        className={cn("h-full w-full object-contain", imageClassName)}
      />
    </div>
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
  if (["autoweek", "car-and-driver", "popular-mechanics", "road-and-track"].includes(brandSlug)) return "road";
  if (["country-living"].includes(brandSlug)) return "ranch";
  if (["bicycling", "mens-health", "runners-world", "womens-health"].includes(brandSlug)) return "ride";
  if (["delish", "the-pioneer-woman", "womans-day"].includes(brandSlug)) return "food";
  if (["biography", "esquire", "harpers-bazaar", "redbook", "seventeen", "town-and-country"].includes(brandSlug)) return "profile";
  if (["elle", "elle-decor", "house-beautiful", "veranda"].includes(brandSlug)) return "architecture";
  return "default";
}

type CinematicEditorialStyle = {
  shell: string;
  paper: string;
  wash: string;
  dark: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  heroOverlay: string;
  heroObject: string;
  titleClass: string;
  labelClass: string;
  bodyText: string;
  invertedAccent: string;
};

const cinematicEditorialStyles: Record<EditorialMood, CinematicEditorialStyle> = {
  architecture: {
    shell: "bg-[#f1eee8]",
    paper: "bg-[#f8f6f1]",
    wash: "bg-[#e6e0d7]",
    dark: "bg-[#232334]",
    accentText: "text-[#6f6d98]",
    accentBg: "bg-[#6f6d98]",
    accentBorder: "border-[#6f6d98]",
    heroOverlay: "bg-gradient-to-b from-[#111321]/6 via-[#111321]/8 to-[#111321]/48",
    heroObject: "object-[center_52%]",
    titleClass: "headline text-[length:var(--text-token-2xl)] leading-[0.94] md:text-[length:var(--text-token-4xl)] lg:text-[4.65rem]",
    labelClass: "font-brand-secondary",
    bodyText: "text-foreground/72",
    invertedAccent: "text-[#d9d5ff]",
  },
  road: {
    shell: "bg-[#eef3f4]",
    paper: "bg-[#f5f8f8]",
    wash: "bg-[#dceaf0]",
    dark: "bg-[#081314]",
    accentText: "text-[#1f6386]",
    accentBg: "bg-[#1f6386]",
    accentBorder: "border-[#1f6386]",
    heroOverlay: "bg-gradient-to-b from-[#061113]/0 via-[#061113]/12 to-[#061113]/58",
    heroObject: "object-center",
    titleClass: "[font-family:Inter,system-ui,sans-serif] text-[length:var(--text-token-2xl)] font-extrabold leading-[0.94] md:text-[length:var(--text-token-4xl)] lg:text-[4.65rem]",
    labelClass: "[font-family:Inter,system-ui,sans-serif]",
    bodyText: "text-foreground/76",
    invertedAccent: "text-[#8ed0ed]",
  },
  ranch: {
    shell: "bg-[#f6efe6]",
    paper: "bg-[#fbf7ef]",
    wash: "bg-[#eadbc8]",
    dark: "bg-[#211711]",
    accentText: "text-[#8b5a2f]",
    accentBg: "bg-[#8b5a2f]",
    accentBorder: "border-[#8b5a2f]",
    heroOverlay: "bg-gradient-to-b from-[#211711]/0 via-[#211711]/12 to-[#211711]/58",
    heroObject: "object-[center_40%]",
    titleClass: "headline text-[length:var(--text-token-2xl)] leading-[0.94] md:text-[length:var(--text-token-4xl)] lg:text-[4.65rem]",
    labelClass: "font-brand-secondary",
    bodyText: "text-foreground/73",
    invertedAccent: "text-[#f4d29a]",
  },
  ride: {
    shell: "bg-[#eef8fb]",
    paper: "bg-[#f8fcfd]",
    wash: "bg-[#d8f0f6]",
    dark: "bg-[#062634]",
    accentText: "text-[#0f88ac]",
    accentBg: "bg-[#0f88ac]",
    accentBorder: "border-[#0f88ac]",
    heroOverlay: "bg-gradient-to-b from-[#062634]/0 via-[#062634]/10 to-[#062634]/58",
    heroObject: "object-center",
    titleClass: "headline text-[length:var(--text-token-2xl)] leading-[0.94] md:text-[length:var(--text-token-4xl)] lg:text-[4.65rem]",
    labelClass: "font-brand-secondary",
    bodyText: "text-foreground/72",
    invertedAccent: "text-[#8bd9ee]",
  },
  food: {
    shell: "bg-[#fff4cf]",
    paper: "bg-[#fffaf0]",
    wash: "bg-[#ffe8a8]",
    dark: "bg-[#35150f]",
    accentText: "text-[#d44f1e]",
    accentBg: "bg-[#d44f1e]",
    accentBorder: "border-[#d44f1e]",
    heroOverlay: "bg-gradient-to-b from-[#35150f]/0 via-[#35150f]/14 to-[#35150f]/64",
    heroObject: "object-center",
    titleClass: "[font-family:Inter,system-ui,sans-serif] text-[length:var(--text-token-2xl)] font-extrabold leading-[0.94] md:text-[length:var(--text-token-4xl)] lg:text-[4.65rem]",
    labelClass: "[font-family:Inter,system-ui,sans-serif]",
    bodyText: "text-foreground/76",
    invertedAccent: "text-[#ffe167]",
  },
  profile: {
    shell: "bg-[#f2efec]",
    paper: "bg-[#f8f5f2]",
    wash: "bg-[#201a19]",
    dark: "bg-[#050505]",
    accentText: "text-[#c93326]",
    accentBg: "bg-[#c93326]",
    accentBorder: "border-[#c93326]",
    heroOverlay: "bg-gradient-to-b from-[#050505]/0 via-[#050505]/14 to-[#050505]/68",
    heroObject: "object-[center_20%]",
    titleClass: "[font-family:Inter,system-ui,sans-serif] text-[length:var(--text-token-2xl)] font-extrabold uppercase leading-[0.94] md:text-[length:var(--text-token-4xl)] lg:text-[4.65rem]",
    labelClass: "[font-family:Inter,system-ui,sans-serif]",
    bodyText: "text-foreground/72",
    invertedAccent: "text-[#f04a3a]",
  },
  default: {
    shell: "bg-[#fff2f4]",
    paper: "bg-[#fff8f9]",
    wash: "bg-[#f5e7e9]",
    dark: "bg-[#13080a]",
    accentText: "text-primary",
    accentBg: "bg-primary",
    accentBorder: "border-primary",
    heroOverlay: "bg-gradient-to-b from-[#13080a]/0 via-[#13080a]/10 to-[#13080a]/62",
    heroObject: "object-[center_24%]",
    titleClass: "headline text-[length:var(--text-token-2xl)] leading-[0.94] md:text-[length:var(--text-token-4xl)] lg:text-[4.65rem]",
    labelClass: "font-brand-secondary",
    bodyText: "text-foreground/72",
    invertedAccent: "text-primary",
  },
};

function getCinematicEditorialStyle(brandSlug: string) {
  return cinematicEditorialStyles[getEditorialMood(brandSlug)];
}

function EditorialProductReviewList({
  title,
  items,
  tone,
}: {
  title: string;
  items?: string[];
  tone: "positive" | "critical";
}) {
  if (!items?.length) return null;

  const positive = tone === "positive";
  const Icon = positive ? CheckCircle2 : CircleX;

  return (
    <div className="space-y-[var(--spacing-token-sm)] p-[var(--spacing-token-md)] lg:p-[var(--spacing-token-lg)]">
      <h4
        className={cn(
          "headline text-[length:var(--text-token-xl)] leading-none lg:text-[length:var(--text-token-2xl)]",
          positive ? "text-[#0f7a3b]" : "text-[#d72622]",
        )}
      >
        {title}
      </h4>
      <ul className="space-y-[var(--spacing-token-xs)]">
        {items.map((item) => (
          <li
            key={item}
            className="grid grid-cols-[1.15rem_1fr] gap-[var(--spacing-token-xs)] text-[length:var(--text-token-sm)] font-semibold leading-snug text-foreground lg:text-[length:var(--text-token-md)]"
          >
            <Icon
              aria-hidden="true"
              className={cn(
                "mt-0.5 size-4",
                positive ? "text-[#0f7a3b]" : "text-[#d72622]",
              )}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EditorialProductReviewModule({
  image,
  alt,
  title,
  review,
  dark,
  style,
}: {
  image: string;
  alt?: string;
  title: string;
  review?: ImmersiveArticleProductReview;
  dark: boolean;
  style: CinematicEditorialStyle;
}) {
  if (!review) {
    return (
      <EditorialProductFrame
        src={image}
        alt={alt || title}
        className={cn(
          "ring-1",
          dark ? "ring-background/16" : "ring-foreground/10",
        )}
      />
    );
  }

  const hasReviewGrid = Boolean(review.pros?.length || review.cons?.length);
  const hasPros = Boolean(review.pros?.length);
  const hasCons = Boolean(review.cons?.length);

  return (
    <div
      className={cn(
        "overflow-hidden border bg-background text-foreground shadow-sm",
        dark ? "border-background/16" : "border-foreground/12",
      )}
    >
      <div className="grid lg:grid-cols-[minmax(260px,1.05fr)_minmax(260px,0.82fr)]">
        <div className="relative min-h-[300px] border-b border-foreground/10 bg-white lg:min-h-[380px] lg:border-b-0 lg:border-r">
          <img
            src={image}
            alt={alt || title}
            className="absolute inset-0 h-full w-full object-contain p-[var(--spacing-token-lg)] lg:p-[var(--spacing-token-xl)]"
          />
        </div>
        <div className="flex flex-col justify-center gap-[var(--spacing-token-sm)] bg-[#f8fcfd] p-[var(--spacing-token-md)] lg:p-[var(--spacing-token-lg)]">
          {review.award && (
            <p className={cn("inline-flex w-fit bg-[#ffd51f] px-[var(--spacing-token-sm)] py-[var(--spacing-token-2xs)] text-[length:var(--text-token-2xs)] font-extrabold uppercase tracking-[0.18em] text-foreground", style.labelClass)}>
              {review.award}
            </p>
          )}
          <h3 className="headline text-[length:var(--text-token-3xl)] leading-[0.95] lg:text-[length:var(--text-token-4xl)]">
            {review.name}
          </h3>
          <div className="grid overflow-hidden border border-foreground/14">
            {review.price && (
              <div className="flex items-center bg-background px-[var(--spacing-token-md)] py-[var(--spacing-token-xs)] text-[length:var(--text-token-lg)] font-extrabold tracking-[0.16em]">
                {review.price}
              </div>
            )}
            <a
              href={review.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex min-h-12 items-center justify-between gap-[var(--spacing-token-sm)] px-[var(--spacing-token-md)] py-[var(--spacing-token-sm)] text-[length:var(--text-token-xs)] font-extrabold uppercase tracking-[0.14em] text-background no-underline transition hover:opacity-90",
                style.accentBg,
              )}
            >
              <span className="min-w-0 whitespace-normal leading-tight">{review.ctaLabel}</span>
              <ExternalLink aria-hidden="true" className="size-5 shrink-0" />
            </a>
          </div>
          {review.retailer && (
            <p className="text-[length:var(--text-token-4xs)] font-semibold uppercase tracking-widest text-muted-foreground">
              Buy from {review.retailer}
            </p>
          )}
        </div>
      </div>
      {hasReviewGrid && (
        <div className={cn("grid border-t border-foreground/10 bg-white", hasPros && hasCons && "md:grid-cols-2")}>
          {hasPros && (
            <EditorialProductReviewList title="Pros" items={review.pros} tone="positive" />
          )}
          {hasCons && (
          <div className={cn(hasPros && "border-t border-foreground/10 md:border-l md:border-t-0")}>
            <EditorialProductReviewList title="Cons" items={review.cons} tone="critical" />
          </div>
          )}
        </div>
      )}
    </div>
  );
}

function EditorialMetaGrid({ content, inverted = false }: { content: ImmersiveArticleContent; inverted?: boolean }) {
  const textClass = inverted ? "text-background/82" : "text-muted-foreground";
  const labelClass = inverted ? "text-background" : "text-foreground";

  return (
    <div className={cn("grid gap-[var(--spacing-token-sm)] text-[length:var(--text-token-3xs)] font-semibold uppercase tracking-widest font-brand-secondary sm:grid-cols-3", textClass)}>
      <div>
        <span className={cn("block", labelClass)}>By</span>
        {content.author}
      </div>
      {content.photographedBy && (
        <div>
          <span className={cn("block", labelClass)}>Photos</span>
          {content.photographedBy}
        </div>
      )}
      <div>
        <span className={cn("block", labelClass)}>Published</span>
        {content.publishedDate}
      </div>
    </div>
  );
}

function CinematicTitle({
  content,
  style,
  inverted = false,
}: {
  content: ImmersiveArticleContent;
  style: CinematicEditorialStyle;
  inverted?: boolean;
}) {
  const lines = content.heroHeadlineLines ?? [content.headline];

  return (
    <h1
      aria-label={content.headline}
      className={cn(
        style.titleClass,
        inverted ? "text-background" : "text-foreground",
      )}
    >
      {lines.map((line) => (
        <span
          key={line}
          className={cn(
            "block",
            line.length <= 12 && "md:whitespace-nowrap",
          )}
        >
          {line}
        </span>
      ))}
    </h1>
  );
}

function CinematicEditorialHero({
  content,
  brandSlug,
}: {
  content: ImmersiveArticleContent;
  brandSlug: string;
}) {
  const style = getCinematicEditorialStyle(brandSlug);
  const { brand } = useTheme();
  const logo = brandLogos[brand.slug];
  const portraitLed = content.heroImageTreatment === "grid-crop";
  const containHero = content.heroImageTreatment === "contain";
  const imageObject = portraitLed ? "object-[center_20%]" : containHero ? "object-contain" : style.heroObject;
  const figureRef = React.useRef<HTMLElement>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);
  const heroImageStyle = containHero
    ? ({
        "--hero-parallax-y": "0px",
        ...(content.flipHeroImage ? { transform: "scaleX(-1)" } : {}),
      } as React.CSSProperties)
    : ({
        "--hero-parallax-y": "0px",
        transform: `translate3d(0, var(--hero-parallax-y, 0px), 0) scale(1.08)${content.flipHeroImage ? " scaleX(-1)" : ""}`,
      } as React.CSSProperties);

  React.useEffect(() => {
    const figure = figureRef.current;
    const image = imageRef.current;
    if (!figure || !image) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const updateParallax = () => {
      frame = 0;

      if (reduceMotion.matches) {
        image.style.setProperty("--hero-parallax-y", "0px");
        return;
      }

      const rect = figure.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const progress = Math.min(
        Math.max((viewportHeight - rect.top) / (viewportHeight + rect.height), 0),
        1,
      );
      const offset = (progress - 0.42) * 190;
      image.style.setProperty("--hero-parallax-y", `${offset.toFixed(1)}px`);
    };

    const queueParallax = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(updateParallax);
      }
    };

    queueParallax();
    window.addEventListener("scroll", queueParallax, { passive: true });
    window.addEventListener("resize", queueParallax);
    reduceMotion.addEventListener("change", queueParallax);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queueParallax);
      window.removeEventListener("resize", queueParallax);
      reduceMotion.removeEventListener("change", queueParallax);
    };
  }, []);

  return (
    <header className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden text-background">
      <figure ref={figureRef} className="relative min-h-[820px] overflow-hidden bg-muted md:min-h-[880px] lg:min-h-[960px]">
        {containHero && (
          <img
            src={content.heroImage}
            alt=""
            aria-hidden="true"
            className={cn("absolute inset-x-0 top-[-12%] h-[124%] w-full scale-110 object-cover opacity-50 blur-xl saturate-75", style.heroObject)}
          />
        )}
        <img
          ref={imageRef}
          src={content.heroImage}
          alt={content.heroImageAlt || content.headline}
          style={heroImageStyle}
          className={cn(
            containHero ? "absolute inset-x-0 top-[11%] h-[54%] w-full drop-shadow-2xl will-change-transform" : "absolute inset-x-0 top-[-12%] h-[124%] w-full object-cover will-change-transform",
            imageObject,
          )}
        />
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-foreground/35 via-foreground/12 to-foreground/0" />
        <div className="absolute inset-x-0 bottom-0 h-[78%] bg-gradient-to-t from-foreground/90 via-foreground/45 to-foreground/0" />
        <PageContainer className="relative z-10 flex min-h-[820px] flex-col justify-between py-[var(--spacing-token-lg)] md:min-h-[880px] lg:min-h-[960px] lg:py-[var(--spacing-token-2xl)]">
          <div className="flex items-start justify-between gap-[var(--spacing-token-md)]">
            <div className="min-w-0">
              {logo ? (
                <BrandLogo
                  slug={brand.slug}
                  color="#fff"
                  className="[&_svg]:h-11 [&_svg]:w-auto md:[&_svg]:h-16 lg:[&_svg]:h-20"
                />
              ) : (
                <p className="headline text-[length:var(--text-token-2xl)] uppercase tracking-widest text-background">
                  {brand.name}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="icon-sm"
              className="border-background/35 bg-background/10 text-background backdrop-blur-sm hover:bg-background/20 hover:text-background"
            >
              <Search className="size-3.5" />
            </Button>
          </div>
          <Grid alignStart gap="loose" className="w-full items-end">
            <Col span="full" spanMd={5} spanLg={8}>
              <div className="max-w-[1120px] space-y-[var(--spacing-token-lg)]">
                <EditorialBreadcrumbs content={content} inverted />
                {content.immersiveLabel && (
                  <p className={cn("inline-flex border-b-2 border-background pb-[var(--spacing-token-2xs)] text-[length:var(--text-token-3xs)] font-bold uppercase tracking-widest text-background", style.labelClass)}>
                    {content.immersiveLabel}
                  </p>
                )}
                <CinematicTitle content={content} style={style} inverted />
              </div>
            </Col>
            <Col span="full" spanMd={3} spanLg={4}>
              <div
                className="space-y-[var(--spacing-token-lg)] border-t-2 pt-[var(--spacing-token-md)]"
                style={{ borderTopColor: "var(--brand-primary)" }}
              >
                {content.dek && (
                  <p className="text-[length:var(--text-token-lg)] font-semibold leading-[1.55] text-background/88 lg:text-[length:var(--text-token-xl)]">
                    {content.dek}
                  </p>
                )}
                <EditorialMetaGrid content={content} inverted />
                <EditorialImageCaption
                  credit={content.heroImageCredit}
                  className="text-background/76"
                />
              </div>
            </Col>
          </Grid>
        </PageContainer>
      </figure>
    </header>
  );
}

function CinematicEditorialPrelude({
  content,
  brandSlug,
}: {
  content: ImmersiveArticleContent;
  brandSlug: string;
}) {
  const style = getCinematicEditorialStyle(brandSlug);

  if (!content.immersiveIntro && !content.immersiveKicker && !content.factRail?.length) {
    return null;
  }

  return (
    <EditorialFullBleedSection className={cn("border-b border-foreground/10 py-[var(--spacing-token-4xl)] lg:py-[var(--spacing-token-6xl)]", style.paper)}>
      <Grid alignStart gap="loose">
        <Col span="full" spanMd={3} spanLg={4}>
          <div className="space-y-[var(--spacing-token-md)] lg:sticky lg:top-[var(--spacing-token-xl)]">
            <p className={cn("text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest", style.accentText, style.labelClass)}>
              {content.introEyebrow ?? "Before the story"}
            </p>
            {content.immersiveKicker && (
              <h2 className="headline max-w-[520px] text-[length:var(--text-token-4xl)] leading-[0.96] lg:text-[length:var(--text-token-6xl)]">
                {content.immersiveKicker}
              </h2>
            )}
          </div>
        </Col>
        <Col span="full" spanMd={5} spanLg={5}>
          {content.immersiveIntro && (
            <ArticleBody className="[&>p]:text-[length:var(--text-token-xl)] [&>p]:leading-[1.82] [&>p]:text-foreground/78">
              {content.immersiveIntro}
            </ArticleBody>
          )}
        </Col>
        {content.factRail && content.factRail.length > 0 && (
          <Col span="full" spanMd={8} spanLg={3}>
            <dl className={cn("grid grid-cols-2 gap-x-[var(--spacing-token-md)] gap-y-[var(--spacing-token-lg)] border-y py-[var(--spacing-token-md)] lg:grid-cols-1", style.accentBorder)}>
              {content.factRail.map((fact) => (
                <div key={fact.label}>
                  <dt className={cn("text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest", style.accentText, style.labelClass)}>
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

function CinematicSceneChapter({
  scene,
  index,
  brandSlug,
}: {
  scene: ImmersiveArticleScene;
  index: number;
  brandSlug: string;
}) {
  const style = getCinematicEditorialStyle(brandSlug);
  const dark = index % 2 === 1;
  const imageRight = index % 2 === 0;
  const label = `${String(index + 1).padStart(2, "0")} / ${scene.eyebrow}`;
  const labelClass = cn(
    "text-[length:var(--text-token-xs)] font-bold uppercase tracking-[0.22em] md:text-[length:var(--text-token-sm)]",
    dark ? "text-[var(--brand-6)]" : style.accentText,
    style.labelClass,
  );

  if (scene.layout === "wide") {
    if (scene.imageTreatment === "before-after" || scene.imageTreatment === "product") {
      return (
        <EditorialFullBleedSection
          className={cn("py-[var(--spacing-token-4xl)] lg:py-[var(--spacing-token-6xl)]", dark ? cn(style.dark, "text-background") : cn(style.paper, "text-foreground"))}
        >
          <Grid alignStart gap="loose">
            <Col span="full" spanMd={3} spanLg={4}>
              <div className="space-y-[var(--spacing-token-lg)] lg:sticky lg:top-[var(--spacing-token-xl)]">
                <p className={labelClass}>{label}</p>
                <h2 className="headline text-[length:var(--text-token-4xl)] leading-[0.94] lg:text-[length:var(--text-token-6xl)]">
                  {scene.title}
                </h2>
                <p className={cn("text-[length:var(--text-token-lg)] leading-[1.8]", dark ? "text-background/78" : style.bodyText)}>
                  {scene.body}
                </p>
                {scene.quote && (
                  <blockquote className={cn("border-l-4 pl-[var(--spacing-token-md)]", dark ? "border-background/70" : style.accentBorder)}>
                    <p className="headline text-[length:var(--text-token-xl)] leading-tight">
                      {scene.quote}
                    </p>
                  </blockquote>
                )}
              </div>
            </Col>
            <Col span="full" spanMd={5} spanLg={8}>
              <figure className="space-y-[var(--spacing-token-sm)]">
                {scene.imageTreatment === "before-after" ? (
                  <EditorialBeforeAfterFrame
                    src={scene.image}
                    alt={scene.imageAlt || scene.title}
                    className={cn("ring-1", dark ? "ring-background/16" : "ring-foreground/10")}
                  />
                ) : (
                  <EditorialProductReviewModule
                    image={scene.image}
                    alt={scene.imageAlt || scene.title}
                    title={scene.title}
                    review={scene.productReview}
                    dark={dark}
                    style={style}
                  />
                )}
                <EditorialImageCaption
                  caption={scene.title}
                  credit={scene.imageCredit}
                  className={cn(dark && "text-background/72")}
                />
              </figure>
            </Col>
          </Grid>
        </EditorialFullBleedSection>
      );
    }

    return (
      <EditorialFullBleedSection
        className={cn("py-[var(--spacing-token-3xl)]", dark ? cn(style.dark, "text-background") : cn(style.paper, "text-foreground"))}
        innerClassName="max-w-none px-0"
      >
        <figure className="relative">
          <div className="relative min-h-[620px] overflow-hidden bg-muted md:min-h-[760px] lg:min-h-[860px]">
            <img
              src={scene.image}
              alt={scene.imageAlt || scene.title}
              className={cn(
                "absolute inset-0 h-full w-full",
                scene.imageFit === "contain" ? "object-contain" : cn("object-cover", style.heroObject),
              )}
              style={scene.imagePosition ? { objectPosition: scene.imagePosition } : undefined}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-black/18 to-black/76" />
            <PageContainer className="absolute inset-x-0 bottom-0 z-10 pb-[var(--spacing-token-2xl)] md:pb-[var(--spacing-token-4xl)]">
              <Grid alignStart gap="loose">
                <Col span="full" spanMd={6} spanLg={7}>
                  <div className="space-y-[var(--spacing-token-md)] text-background">
                    <p className={cn(labelClass, "text-[var(--brand-6)]")}>{label}</p>
                    <h2 className="max-w-[880px] text-[length:var(--text-token-3xl)] font-extrabold leading-[0.96] md:text-[length:var(--text-token-5xl)] lg:text-[5rem]">
                      {scene.title}
                    </h2>
                    <p className="max-w-[760px] text-[length:var(--text-token-md)] font-medium leading-[1.75] text-background/84 md:text-[length:var(--text-token-xl)]">
                      {scene.body}
                    </p>
                    {scene.quote && (
                      <blockquote className="max-w-[820px] border-t border-background/45 pt-[var(--spacing-token-md)]">
                        <p className="text-[length:var(--text-token-xl)] font-bold leading-tight md:text-[length:var(--text-token-2xl)]">
                          {scene.quote}
                        </p>
                      </blockquote>
                    )}
                  </div>
                </Col>
              </Grid>
            </PageContainer>
          </div>
          <PageContainer className="pt-[var(--spacing-token-sm)]">
            <EditorialImageCaption
              caption={scene.title}
              credit={scene.imageCredit}
              className={cn(dark && "text-background/72")}
            />
          </PageContainer>
        </figure>
      </EditorialFullBleedSection>
    );
  }

  return (
    <EditorialFullBleedSection className={cn("py-[var(--spacing-token-4xl)] lg:py-[var(--spacing-token-6xl)]", dark ? cn(style.dark, "text-background") : cn(style.paper, "text-foreground"))}>
      <Grid alignStart gap="loose" className="items-center">
        <Col
          span="full"
          spanMd={4}
          spanLg={5}
          startLg={imageRight ? 1 : 8}
          rowStartLg={1}
          className="relative z-10"
        >
          <div className="space-y-[var(--spacing-token-lg)]">
            <p className={labelClass}>{label}</p>
            <h2 className="headline text-[length:var(--text-token-5xl)] leading-[0.92] lg:text-[length:var(--text-token-7xl)]">
              {scene.title}
            </h2>
            <p className={cn("text-[length:var(--text-token-lg)] leading-[1.8]", dark ? "text-background/78" : style.bodyText)}>
              {scene.body}
            </p>
            {scene.quote && (
              <blockquote className={cn("border-l-4 pl-[var(--spacing-token-md)]", dark ? "border-background/70" : style.accentBorder)}>
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
          spanLg={7}
          startLg={imageRight ? 6 : 1}
          rowStartLg={1}
        >
          <figure className="space-y-[var(--spacing-token-sm)]">
            {scene.imageTreatment === "before-after" || scene.imageTreatment === "product" ? (
              scene.imageTreatment === "before-after" ? (
                <EditorialBeforeAfterFrame
                  src={scene.image}
                  alt={scene.imageAlt || scene.title}
                  className={cn(
                    "ring-1",
                    dark ? "ring-background/16" : "ring-foreground/10",
                  )}
                />
              ) : (
                <EditorialProductReviewModule
                  image={scene.image}
                  alt={scene.imageAlt || scene.title}
                  title={scene.title}
                  review={scene.productReview}
                  dark={dark}
                  style={style}
                />
              )
            ) : (
              <div className="relative min-h-[560px] overflow-hidden bg-muted lg:min-h-[720px]">
                <img
                  src={scene.image}
                  alt={scene.imageAlt || scene.title}
                  className={cn(
                    "absolute inset-0 h-full w-full",
                    scene.imageFit === "contain" ? "object-contain" : cn("object-cover", style.heroObject),
                  )}
                  style={scene.imagePosition ? { objectPosition: scene.imagePosition } : undefined}
                />
                <div className={cn("absolute inset-y-0 w-[var(--spacing-token-xs)]", style.accentBg, imageRight ? "left-0" : "right-0")} />
              </div>
            )}
            <EditorialImageCaption
              caption={scene.title}
              credit={scene.imageCredit}
              className={cn(dark && "text-background/72")}
            />
          </figure>
        </Col>
      </Grid>
    </EditorialFullBleedSection>
  );
}

function CinematicQuoteInterlude({
  content,
  brandSlug,
}: {
  content: ImmersiveArticleContent;
  brandSlug: string;
}) {
  const style = getCinematicEditorialStyle(brandSlug);
  const quotedScene = content.scenes.find((scene) => scene.quote);
  const quote = quotedScene?.quote ?? content.dek;

  if (!quote) return null;

  return (
    <EditorialFullBleedSection className={cn("py-[var(--spacing-token-5xl)] lg:py-[calc(var(--spacing-token-6xl)*1.25)]", style.shell)}>
      <Grid alignStart gap="loose" className="items-center">
        <Col span="full" spanMd={2} spanLg={2}>
          <p className={cn("text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest", style.accentText, style.labelClass)}>
            {content.posterQuoteEyebrow ?? "Editorial pause"}
          </p>
        </Col>
        <Col span="full" spanMd={6} spanLg={10}>
          <blockquote className={cn("relative overflow-hidden border-y py-[var(--spacing-token-2xl)]", style.accentBorder)}>
            <span
              aria-hidden="true"
              className={cn("headline pointer-events-none absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 text-[12rem] leading-none opacity-15 md:text-[18rem] lg:text-[24rem]", style.accentText)}
            >
              &ldquo;
            </span>
            <p className="headline relative z-10 max-w-[1040px] text-[length:var(--text-token-5xl)] leading-[0.96] text-foreground md:text-[length:var(--text-token-7xl)] lg:text-[6.35rem]">
              {quote}
            </p>
            {quotedScene && (
              <cite className={cn("relative z-10 mt-[var(--spacing-token-xl)] block text-[length:var(--text-token-3xs)] font-bold uppercase tracking-widest not-italic", style.accentText, style.labelClass)}>
                {quotedScene.eyebrow}
              </cite>
            )}
          </blockquote>
        </Col>
      </Grid>
    </EditorialFullBleedSection>
  );
}

function CinematicVisualEssay({
  content,
  brandSlug,
}: {
  content: ImmersiveArticleContent;
  brandSlug: string;
}) {
  const style = getCinematicEditorialStyle(brandSlug);
  const media = content.mediaPair ?? [];
  const featured = media.find((item) => item.featured) ?? media[0];
  const supporting = media.filter((item) => item !== featured);
  const essayDark = getEditorialMood(brandSlug) === "profile";
  const featuredIsBeforeAfter = featured?.treatment === "before-after";
  const featuredIsProduct = featured?.treatment === "product";
  const featuredIsFramed = featuredIsBeforeAfter || featuredIsProduct;

  if (!featured && supporting.length === 0) return null;

  return (
    <EditorialFullBleedSection
      className={cn(
        "border-y border-foreground/10 py-[var(--spacing-token-4xl)] lg:py-[var(--spacing-token-6xl)]",
        essayDark ? cn(style.dark, "text-background") : style.wash,
      )}
    >
      <Grid alignStart gap="loose">
        <Col span="full" spanMd={8} spanLg={12}>
          <div className="mb-[var(--spacing-token-xl)] max-w-[1080px] space-y-[var(--spacing-token-sm)]">
            <p className={cn("text-[length:var(--text-token-xs)] font-bold uppercase tracking-[0.22em] md:text-[length:var(--text-token-sm)]", essayDark ? "text-[var(--brand-6)]" : style.accentText, style.labelClass)}>
              {content.visualEssayEyebrow ?? "Visual notes"}
            </p>
            <h2 className="headline text-[length:var(--text-token-4xl)] leading-[0.98] md:text-[length:var(--text-token-5xl)] lg:text-[length:var(--text-token-6xl)]">
              {content.visualEssayTitle ?? "The images carry the emotion of the story."}
            </h2>
          </div>
        </Col>
        {featured && (
          <Col span="full" spanMd={8} spanLg={12}>
            <figure className="space-y-[var(--spacing-token-sm)]">
              {featuredIsProduct && featured.productReview ? (
                <EditorialProductReviewModule
                  image={featured.src}
                  alt={featured.alt || featured.caption}
                  title={featured.caption || content.visualEssayTitle || "Product review"}
                  review={featured.productReview}
                  dark={essayDark}
                  style={style}
                />
              ) : (
                <div
                  className={cn(
                    "relative overflow-hidden bg-muted",
                    featuredIsBeforeAfter && "aspect-[2/1]",
                    featuredIsProduct && "aspect-[16/9]",
                    !featuredIsFramed && "min-h-[520px] md:min-h-[620px] lg:min-h-[760px]",
                  )}
                  style={{ marginLeft: "calc(50% - 50vw)", width: "100vw" }}
                >
                  <img
                    src={featured.src}
                    alt={featured.alt || ""}
                    className={cn(
                      featuredIsFramed ? "h-full w-full" : "absolute inset-0 h-full w-full",
                      featured.fit === "contain" ? "object-contain" : cn("object-cover", style.heroObject),
                    )}
                    style={featured.position ? { objectPosition: featured.position } : undefined}
                  />
                  <div className={cn("absolute inset-y-0 left-0 w-[var(--spacing-token-xs)]", style.accentBg)} />
                </div>
              )}
              <EditorialImageCaption
                caption={featured.caption}
                credit={featured.credit}
                className={cn("max-w-[920px]", essayDark && "text-background/72")}
              />
            </figure>
          </Col>
        )}
        {supporting.map((item, index) => (
          <Col key={`${item.src}-${index}`} span="full" spanMd={4} spanLg={index % 2 === 0 ? 5 : 6} startLg={index % 2 === 0 ? 2 : 7}>
            <figure className={cn("space-y-[var(--spacing-token-sm)]", index % 2 === 1 && "lg:mt-[var(--spacing-token-5xl)]")}>
              {item.treatment === "product" && item.productReview ? (
                <EditorialProductReviewModule
                  image={item.src}
                  alt={item.alt || item.caption}
                  title={item.caption || "Product review"}
                  review={item.productReview}
                  dark={essayDark}
                  style={style}
                />
              ) : (
                <div
                  className={cn(
                    "relative overflow-hidden bg-muted",
                    item.treatment === "before-after" && "aspect-[2/1]",
                    item.treatment === "product" && "aspect-[3/2]",
                    !item.treatment && "aspect-[4/5]",
                  )}
                >
                  <img
                    src={item.src}
                    alt={item.alt || ""}
                    className={cn(
                      "h-full w-full",
                      item.fit === "contain" ? "object-contain" : cn("object-cover", style.heroObject),
                    )}
                    style={item.position ? { objectPosition: item.position } : undefined}
                  />
                </div>
              )}
              <EditorialImageCaption caption={item.caption} credit={item.credit} className={cn(essayDark && "text-background/72")} />
            </figure>
          </Col>
        ))}
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
    <EditorialFullBleedSection className="bg-background py-[var(--spacing-token-4xl)] lg:py-[var(--spacing-token-6xl)]">
      <Grid alignStart gap="loose">
        <Col span="full" spanMd={2} spanLg={3}>
          <aside className="hidden space-y-[var(--spacing-token-md)] border-t border-border pt-[var(--spacing-token-md)] md:block lg:sticky lg:top-[var(--spacing-token-xl)]">
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-muted-foreground font-brand-secondary">
              {content.bodyRailEyebrow ?? "Reading path"}
            </p>
            <ol className="space-y-[var(--spacing-token-sm)]">
              {content.scenes.map((scene, i) => (
                <li
                  key={`${scene.eyebrow}-${i}`}
                  className="text-[length:var(--text-token-3xs)] font-semibold uppercase tracking-widest text-foreground/70 font-brand-secondary"
                >
                  {String(i + 1).padStart(2, "0")} {scene.eyebrow}
                </li>
              ))}
            </ol>
          </aside>
        </Col>
        <Col span="full" spanMd={6} spanLg={6}>
          <div className="space-y-[var(--spacing-token-4xl)]">
            <ArticleBody className="[&>h2]:headline [&>p]:text-[length:var(--text-token-lg)] [&>p]:leading-[1.9]">
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

function EditorialPhotoGalleryFigure({
  src,
  alt,
  caption,
  credit,
  className,
}: {
  src: string;
  alt?: string;
  caption?: string;
  credit?: string;
  className?: string;
}) {
  return (
    <figure className={cn("space-y-[var(--spacing-token-sm)]", className)}>
      <div
        className="relative border-y border-border bg-muted/40"
        style={{ marginLeft: "calc(50% - 50vw)", width: "100vw" }}
      >
        <img
          src={src}
          alt={alt || ""}
          className="block h-auto w-full"
        />
      </div>
      <PageContainer>
        <EditorialImageCaption
          caption={caption}
          credit={credit}
          className="max-w-[960px]"
        />
      </PageContainer>
    </figure>
  );
}

function EditorialPhotoGalleryArticleTemplate({
  content,
  showGridOverlay = false,
}: ArticleEditorialFeatureTemplateProps) {
  const { brand } = useTheme();
  const style = getCinematicEditorialStyle(brand.slug);
  const intro = content.immersiveIntro ?? (content.dek ? <p>{content.dek}</p> : null);

  return (
    <div className={cn("min-h-screen bg-background font-brand", style.paper)}>
      <CinematicEditorialHero content={content} brandSlug={brand.slug} />

      <main className="relative z-10">
        {intro && (
          <PageContainer className="relative">
            {showGridOverlay && <GridOverlay />}
            <Grid alignStart>
              <Col span="full" spanMd={6} spanLg={7} startLg={3}>
                <ArticleBody className="py-[var(--spacing-token-3xl)] [&>p]:text-[length:var(--text-token-lg)] [&>p]:leading-[1.9] md:[&>p]:text-[length:var(--text-token-xl)]">
                  {intro}
                </ArticleBody>
              </Col>
            </Grid>
          </PageContainer>
        )}

        {content.scenes.map((scene, index) => (
          <section key={`${scene.eyebrow}-${index}`} className="py-[var(--spacing-token-2xl)]">
            <EditorialPhotoGalleryFigure
              src={scene.image}
              alt={scene.imageAlt || scene.title}
              caption={scene.title}
              credit={scene.imageCredit}
            />
            <PageContainer className="relative">
              {showGridOverlay && <GridOverlay />}
              <Grid alignStart>
                <Col span="full" spanMd={6} spanLg={7} startLg={3}>
                  <div className="grid gap-[var(--spacing-token-md)] py-[var(--spacing-token-xl)]">
                    <p className={cn("text-[length:var(--text-token-xs)] font-bold uppercase tracking-[0.16em] md:text-[length:var(--text-token-sm)]", style.accentText, style.labelClass)}>
                      {String(index + 1).padStart(2, "0")} / {String(content.scenes.length).padStart(2, "0")} {scene.eyebrow}
                    </p>
                    <h2 className="headline max-w-[900px] text-[length:var(--text-token-3xl)] leading-[0.98] md:text-[length:var(--text-token-5xl)]">
                      {scene.title}
                    </h2>
                    <p className={cn("max-w-[820px] text-[length:var(--text-token-lg)] leading-[1.85] md:text-[length:var(--text-token-xl)]", style.bodyText)}>
                      {scene.body}
                    </p>
                    {scene.quote && (
                      <blockquote className={cn("max-w-[840px] border-l-4 pl-[var(--spacing-token-md)]", style.accentBorder)}>
                        <p className="headline text-[length:var(--text-token-xl)] leading-tight md:text-[length:var(--text-token-2xl)]">
                          {scene.quote}
                        </p>
                      </blockquote>
                    )}
                  </div>
                </Col>
              </Grid>
            </PageContainer>
          </section>
        ))}

        <PageContainer className="relative">
          {showGridOverlay && <GridOverlay />}
          <Grid alignStart>
            <Col span="full" spanMd={6} spanLg={7} startLg={3}>
              <div className="space-y-[var(--spacing-token-4xl)] pb-[var(--spacing-token-4xl)] pt-[var(--spacing-token-xl)]">
                <ArticleBody className="[&>p]:text-[length:var(--text-token-lg)] [&>p]:leading-[1.9]">
                  {content.body}
                </ArticleBody>
                <div className="flex justify-center py-[var(--spacing-token-md)]">
                  <AdPlaceholder size="inline" />
                </div>
                <ArticleNewsletter brandName={brand.name} />
              </div>
            </Col>
          </Grid>

          {content.relatedArticles && content.relatedArticles.length > 0 && (
            <div className="pb-[var(--spacing-token-3xl)]">
              <RelatedArticles articles={content.relatedArticles} />
            </div>
          )}
        </PageContainer>
      </main>

      <ArticleFooter />
    </div>
  );
}

function BrandEditorialFeatureTemplate({
  content,
  showGridOverlay = false,
}: ArticleEditorialFeatureTemplateProps) {
  const { brand } = useTheme();
  const navLinks = content.navLinks ?? ["Home", "News", "Features", "Culture", "Style", "Health", "Food", "Travel"];
  const style = getCinematicEditorialStyle(brand.slug);

  if (content.displayMode === "photo-gallery") {
    return (
      <EditorialPhotoGalleryArticleTemplate
        content={content}
        showGridOverlay={showGridOverlay}
      />
    );
  }

  return (
    <div className={cn("min-h-screen font-brand", style.paper)}>
      <PageContainer className="relative">
        {showGridOverlay && <GridOverlay />}
        <div className="relative z-10">
          <EditorialScrollNav navLinks={navLinks} />
          <CinematicEditorialHero content={content} brandSlug={brand.slug} />
          <CinematicEditorialPrelude content={content} brandSlug={brand.slug} />
          {content.scenes.map((scene, index) => (
            <CinematicSceneChapter
              key={`${scene.eyebrow}-${index}`}
              scene={scene}
              index={index}
              brandSlug={brand.slug}
            />
          ))}
          <CinematicQuoteInterlude content={content} brandSlug={brand.slug} />
          <CinematicVisualEssay content={content} brandSlug={brand.slug} />
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
  return (
    <BrandEditorialFeatureTemplate
      content={content}
      showGridOverlay={showGridOverlay}
    />
  );
}
