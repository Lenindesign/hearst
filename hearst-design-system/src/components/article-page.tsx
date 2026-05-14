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
}

export interface ImmersiveArticleContent extends ArticlePageContent {
  immersiveLabel?: string;
  immersiveKicker?: string;
  immersiveIntro?: React.ReactNode;
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
        <div className="w-[var(--width-sidebar-narrow)]" />
        <div className="text-center">
          {logo ? (
            <BrandLogo slug={brand.slug} className="[&_svg]:h-10 [&_svg]:w-auto mx-auto" />
          ) : (
            <h1 className="text-[length:var(--text-token-2xl)] tracking-widest uppercase headline">
              {brand.name}
            </h1>
          )}
        </div>
        <div className="w-[var(--width-sidebar-narrow)] flex justify-end gap-[var(--spacing-token-xs)]">
          <Button variant="outline" size="icon-sm">
            <Search className="size-3.5" />
          </Button>
        </div>
      </div>
      <nav className="flex items-center justify-start gap-[var(--spacing-token-xl)] overflow-x-auto py-[var(--spacing-token-xs)] scrollbar-hide md:justify-center">
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
