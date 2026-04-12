"use client";

import { useTheme } from "./theme-provider";
import { NavBar } from "./nav-bar";
import { BrandLogo } from "./brand-logo";
import { brandLogos } from "@/lib/logos";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";
import { LinkComponent } from "@/components/ui/link";
import { Separator } from "@/components/ui/separator";
import { BigStoryFeedStacked } from "./fre/big-story-feed";
import { BigStoryImageRight } from "./fre/big-story";
import { FourAcrossGrid } from "./fre/four-across-grid";
import { SiteFooter } from "./fre/site-footer";
import { Mail } from "lucide-react";
import {
  getBrandImages,
  getBaseContent,
  type BaseContentType,
} from "./homepage-data";

interface ContentType extends BaseContentType {
  footerCols: string[][];
}

const defaultFooterCols: string[][] = [
  ["News", "Features", "Culture", "Lifestyle", "Opinion", "Wellness", "Travel"],
  ["Style", "Beauty", "Food", "Home", "Entertainment", "Shopping", "Tech"],
  ["Videos", "Podcasts", "Newsletters", "Events", "Awards", "Archive", "About"],
  ["Contact", "Careers", "Advertise", "Subscribe", "Press", "Privacy", "Terms"],
];

function getContent(brandSlug: string): ContentType {
  const base = getBaseContent(brandSlug);
  return { ...base, footerCols: defaultFooterCols };
}

function UtilityBar() {
  return (
    <div className="h-8 bg-primary text-primary-foreground text-[length:var(--text-token-4xs)] font-semibold">
      <div className="flex items-center justify-between h-full max-w-[var(--width-content-max)] mx-auto px-4 lg:px-0">
        <div className="flex items-center gap-3">
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

function MainNav({ brandSlug }: { brandSlug: string }) {
  const { brand } = useTheme();
  const logo = brandLogos[brand.slug];
  const content = getContent(brandSlug);

  return (
    <div className="border-b border-border py-2 px-6">
      <div className="flex items-center justify-between py-2 max-w-[var(--width-content-max)] mx-auto">
        <div className="w-[var(--width-sidebar-narrow)]" />
        <div className="text-center">
          {logo ? (
            <BrandLogo slug={brand.slug} className="[&_svg]:h-10 [&_svg]:w-auto mx-auto" />
          ) : (
            <h1 className="text-2xl tracking-widest uppercase headline">
              {brand.name}
            </h1>
          )}
        </div>
        <div className="w-[var(--width-sidebar-narrow)] flex justify-end gap-2">
          <Button variant="outline" size="icon-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </Button>
        </div>
      </div>
      <nav className="flex items-center justify-center gap-6 py-2 max-w-[var(--width-content-max)] mx-auto overflow-x-auto scrollbar-hide">
        {content.navLinks.map((link) => (
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

function CollectionList({ brandSlug }: { brandSlug: string }) {
  const content = getContent(brandSlug);
  const images = getBrandImages(brandSlug);

  const feedItems = content.articles.map((article, i) => ({
    title: article.title,
    date: `${article.time} · ${article.readTime}`,
    image: images.articles[i % images.articles.length],
  }));

  return (
    <div className="w-full lg:w-[var(--width-sidebar)] shrink-0 space-y-3">
      <div className="space-y-2">
        <h3 className="text-xl uppercase headline text-primary">
          {content.collectionTitle}
        </h3>
        <Divider variant="default" size="lg" className="bg-primary" />
      </div>
      <BigStoryFeedStacked
        items={feedItems}
        thumbnailWidth={72}
        thumbnailHeight={72}
        headlineFontSize={14}
        showDividers={false}
        style={{ maxWidth: "100%", gap: "var(--space-sm, 12px)" }}
      />
    </div>
  );
}

function HeroCard({ brandSlug }: { brandSlug: string }) {
  const content = getContent(brandSlug);
  const images = getBrandImages(brandSlug);

  return (
    <div className="flex-1 min-w-0">
      <BigStoryImageRight
        label={content.hero.eyebrow}
        headline={content.hero.title}
        description={content.hero.desc}
        author={content.hero.author}
        date=""
        image={images.hero}
        headlineFontSize={32}
        imagePosition="top"
        aspectRatio="1/1"
      />
    </div>
  );
}

function RightRail({ brandSlug }: { brandSlug: string }) {
  const content = getContent(brandSlug);
  const images = getBrandImages(brandSlug);

  const feedItems = content.rightRail.map((card, i) => ({
    title: card.title,
    eyebrow: card.eyebrow,
    author: card.author,
    date: "",
    image: images.rightRail[i % images.rightRail.length],
  }));

  return (
    <div className="w-full lg:w-[var(--width-sidebar)] shrink-0 space-y-8">
      <BigStoryFeedStacked
        items={feedItems}
        thumbnailWidth={100}
        thumbnailHeight={100}
        headlineFontSize={14}
        showDividers={false}
        style={{ maxWidth: "100%", gap: "var(--space-md, 16px)" }}
      />
      <div className="flex flex-col items-center gap-1 py-4 rounded bg-muted">
        <span className="text-[length:var(--text-token-4xs)] uppercase tracking-wider text-muted-foreground">
          Advertisement
        </span>
        <div className="w-[300px] h-[250px] rounded-md flex items-center justify-center text-sm bg-muted text-muted-foreground border border-border">
          AD 300 × 250
        </div>
      </div>
    </div>
  );
}

function NewsletterPromo({ brandSlug }: { brandSlug: string }) {
  const { brand } = useTheme();

  return (
    <div className="py-10 px-6 lg:px-12 space-y-6 bg-accent">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest font-brand-secondary text-foreground">
          Sign up for {brand.name}&rsquo;s Newsletter
        </p>
        <h3 className="text-2xl lg:text-[length:var(--text-token-5xl)] leading-tight headline">
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
        <Button size="lg" className="h-12 px-6 text-sm font-bold uppercase tracking-wider whitespace-nowrap rounded-none sm:rounded-r-sm">
          Sign Me Up
        </Button>
      </div>
      <p className="text-[length:var(--text-token-4xs)] leading-relaxed text-muted-foreground">
        By signing up, I agree to the{" "}
        <LinkComponent variant="neutral" underline size="xs" className="font-normal">Terms of Use</LinkComponent>{" "}
        (including the{" "}
        <LinkComponent variant="neutral" underline size="xs" className="font-normal">dispute resolution procedures</LinkComponent>
        ) and have reviewed the{" "}
        <LinkComponent variant="neutral" underline size="xs" className="font-normal">Privacy Notice</LinkComponent>.
        This site is protected by reCAPTCHA and the Google{" "}
        <LinkComponent variant="neutral" underline size="xs" className="font-normal">Privacy Policy</LinkComponent>{" "}
        and{" "}
        <LinkComponent variant="neutral" underline size="xs" className="font-normal">Terms of Service</LinkComponent>{" "}
        apply.
      </p>
    </div>
  );
}

function TrendingSection({ brandSlug }: { brandSlug: string }) {
  const content = getContent(brandSlug);
  const images = getBrandImages(brandSlug);

  const gridItems = content.trending.map((card, i) => ({
    title: card.title,
    subtitle: card.time,
    image: images.trending[i % images.trending.length],
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-4xl lg:text-5xl headline">
        Trending
      </h2>
      <FourAcrossGrid
        items={gridItems}
        columns={5}
        gap={undefined}
        aspectRatio="1/1"
        showNumbers
      />
    </div>
  );
}

function Footer({ brandSlug }: { brandSlug: string }) {
  const { brand } = useTheme();
  const logo = brandLogos[brand.slug];

  const footerLogo = logo ? (
    <BrandLogo slug={brand.slug} className="[&_svg]:h-8 [&_svg]:w-auto" color="#fff" />
  ) : (
    brand.name
  );

  return (
    <div className="pt-12">
      <SiteFooter
        siteName={footerLogo}
        socialLinks={["YouTube", "Facebook", "Instagram", "Pinterest"]}
        legalLinks={["Privacy Notice", "Terms of Use", "Site Map"]}
        copyrightYear={2026}
      />
    </div>
  );
}

export function HomePageTemplate() {
  const { brand } = useTheme();

  return (
    <div className="min-h-screen font-brand bg-background">
      {/* Ad Banner — full width */}
      <div className="flex items-center justify-center h-[100px] lg:h-[250px] bg-muted">
        <div className="flex items-center justify-center rounded-md text-sm bg-muted text-muted-foreground border border-border" style={{ width: 728, height: 90 }}>
          AD 728 × 90
        </div>
      </div>

      {/* Utility Bar — full width */}
      <UtilityBar />

      {/* Main Nav — full width background, content constrained */}
      <MainNav brandSlug={brand.slug} />

      {/* Page Body — constrained */}
      <div className="max-w-[var(--width-content-max)] mx-auto px-4 lg:px-0 pt-8 lg:pt-12 space-y-12 lg:space-y-16">
        {/* Top Section: Collection + Hero + Right Rail */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="flex-1 min-w-0 space-y-8 lg:space-y-12">
            {/* Collection + Hero */}
            <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
              <CollectionList brandSlug={brand.slug} />
              <HeroCard brandSlug={brand.slug} />
            </div>

            {/* Newsletter + Trending */}
            <NewsletterPromo brandSlug={brand.slug} />
            <TrendingSection brandSlug={brand.slug} />
          </div>

          {/* Right Rail */}
          <RightRail brandSlug={brand.slug} />
        </div>
      </div>

      {/* Footer — full width */}
      <Footer brandSlug={brand.slug} />
    </div>
  );
}

export function BrandHomePage() {
  return (
    <>
      <NavBar />
      <HomePageTemplate />
    </>
  );
}
