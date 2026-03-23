"use client";

import React from "react";
import { useTheme } from "./theme-provider";
import { BrandLogo } from "./brand-logo";
import { brandLogos } from "@/lib/logos";
import { cn } from "@/lib/utils";
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
import { ArticleHero } from "./fre/article-hero";
import { ArticleByline } from "./fre/article-byline";
import { ArticleBody } from "./fre/article-body";
import { RelatedArticles, type RelatedArticle } from "./fre/related-articles";
import { AdPlaceholder } from "./fre/ad-placeholder";
import { Mail } from "lucide-react";

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

function ArticleUtilityBar() {
  return (
    <div className="h-8 bg-primary text-primary-foreground text-[length:var(--text-token-4xs)] font-semibold">
      <div className="flex items-center justify-between h-full max-w-[var(--width-content-max)] mx-auto px-[var(--spacing-token-md)] lg:px-0">
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
    <div className="border-b border-border py-[var(--spacing-token-xs)] px-[var(--spacing-token-xl)]">
      <div className="flex items-center justify-between py-[var(--spacing-token-xs)] max-w-[var(--width-content-max)] mx-auto">
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </Button>
        </div>
      </div>
      <nav className="flex items-center justify-center gap-[var(--spacing-token-xl)] py-[var(--spacing-token-xs)] max-w-[var(--width-content-max)] mx-auto overflow-x-auto scrollbar-hide">
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
    <aside className="w-full lg:w-[var(--width-sidebar)] shrink-0 space-y-[var(--spacing-token-2xl)]">
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
                layout="horizontal"
                size="sm"
                className="cursor-pointer ring-0 hover:ring-0 rounded-none bg-transparent"
              >
                <ArticleCardImage
                  src={item.image}
                  aspectRatio="1/1"
                  className="rounded-sm w-[100px] shrink-0"
                />
                <ArticleCardContent className="px-0">
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

export function ArticlePageTemplate({ content }: { content: ArticlePageContent }) {
  const { brand } = useTheme();
  const navLinks = content.navLinks ?? ["Home", "News", "Features", "Culture", "Style", "Health", "Food", "Travel"];
  const sidebarItems = content.sidebarItems ?? [];

  return (
    <div className="min-h-screen font-brand bg-background">
      <ArticleUtilityBar />
      <ArticleNav navLinks={navLinks} />

      {/* Leaderboard ad above content */}
      <div className="flex justify-center py-[var(--spacing-token-xl)] border-b border-border">
        <AdPlaceholder size="leaderboard" />
      </div>

      {/* Main content grid — constrained to content-max */}
      <div className="max-w-[var(--width-content-max)] mx-auto px-[var(--spacing-token-md)] lg:px-0 pt-[var(--spacing-token-2xl)] lg:pt-[var(--spacing-token-3xl)]">
        <div className="flex flex-col lg:flex-row gap-[var(--spacing-token-2xl)] lg:gap-[var(--spacing-token-3xl)]">
          {/* Article column */}
          <article className="flex-1 min-w-0 space-y-[var(--spacing-token-2xl)] pb-[var(--spacing-token-3xl)]">
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

            {/* Inline ad after article body */}
            <div className="flex justify-center py-[var(--spacing-token-md)]">
              <AdPlaceholder size="inline" />
            </div>

            <ArticleNewsletter brandName={brand.name} />
          </article>

          {/* Sidebar */}
          <ArticleSidebar items={sidebarItems} />
        </div>
      </div>

      {/* Related articles — full width of content area */}
      {content.relatedArticles && content.relatedArticles.length > 0 && (
        <div className="max-w-[var(--width-content-max)] mx-auto px-[var(--spacing-token-md)] lg:px-0 pb-[var(--spacing-token-3xl)]">
          <RelatedArticles articles={content.relatedArticles} />
        </div>
      )}

      <ArticleFooter />
    </div>
  );
}
