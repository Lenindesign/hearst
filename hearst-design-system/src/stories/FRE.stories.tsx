import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { brands } from "@/lib/brands";

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

function useBrand() {
  const el = document.querySelector("[data-brand]");
  const slug = el?.getAttribute("data-brand") || "cosmopolitan";
  return brands.find((b) => b.slug === slug) || brands[0];
}

const token = (name: string) => `var(--${name})`;

const sectionStyle: React.CSSProperties = {
  fontFamily: "var(--font-brand, Inter, system-ui, sans-serif)",
  maxWidth: 1200,
  margin: "0 auto",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: "#71717a",
        marginBottom: 12,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {children}
    </div>
  );
}

function TokenTag({ name }: { name: string }) {
  return (
    <code
      style={{
        fontSize: 10,
        background: "#f1f5f9",
        color: "#475569",
        padding: "2px 6px",
        borderRadius: 4,
        fontFamily: "monospace",
        whiteSpace: "nowrap",
      }}
    >
      {name}
    </code>
  );
}

const stockImg = (query: string, w = 600, h = 400) =>
  `https://images.unsplash.com/photo-${query}?w=${w}&h=${h}&fit=crop`;

const IMAGES = {
  fashion: stockImg("1483985988355-763728e1935b"),
  food: stockImg("1504674900247-0877df9cc836"),
  home: stockImg("1502672260266-1c1ef2d93688"),
  travel: stockImg("1507525428034-b723cf961d3e"),
  beauty: stockImg("1522335789203-aabd1fc54bc9"),
  wellness: stockImg("1571019613454-1cb2f99b2d8b"),
  car: stockImg("1503376780353-7e6692767b70"),
  garden: stockImg("1416879595882-3373a0480b5b"),
  cooking: stockImg("1556909114-f6e7ad7d3136"),
  celebrity: stockImg("1534528741775-53994a69daeb"),
  video: stockImg("1611162617213-7d7a39e9b1d7"),
  product1: stockImg("1556228578-8c89e6adf883", 300, 300),
  product2: stockImg("1523275335684-37898b6baf30", 300, 300),
};

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: "FRE Components",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

/* ================================================================== */
/*  1. Site Header                                                     */
/* ================================================================== */

interface SiteHeaderProps {
  siteName: string;
  navItems: string[];
  showSearch: boolean;
  showSignIn: boolean;
  ctaLabel: string;
  onNavClick: (item: string) => void;
  onSearchClick: () => void;
  onSignInClick: () => void;
  onCtaClick: () => void;
}

function SiteHeaderComponent({
  siteName,
  navItems,
  showSearch,
  showSignIn,
  ctaLabel,
  onNavClick,
  onSearchClick,
  onSignInClick,
  onCtaClick,
}: SiteHeaderProps) {
  return (
    <div style={sectionStyle}>
      <SectionLabel>
        Site Header &mdash; <TokenTag name="brand-1" /> <TokenTag name="font-primary" />{" "}
        <TokenTag name="background-default" /> <TokenTag name="content-primary" />
      </SectionLabel>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          borderBottom: "1px solid #e5e5e5",
          background: token("background-default"),
          fontFamily: token("font-brand"),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              fontFamily: "var(--font-headline, var(--font-brand))",
              fontStyle: "italic",
              letterSpacing: -0.5,
            }}
          >
            {siteName}
          </div>
          <nav style={{ display: "flex", gap: 20, fontSize: 13, fontWeight: 500 }}>
            {navItems.map((item) => (
              <span
                key={item}
                style={{ cursor: "pointer", color: "#3b3b3b" }}
                onClick={() => onNavClick(item)}
              >
                {item}
              </span>
            ))}
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13 }}>
          {showSearch && (
            <span style={{ cursor: "pointer" }} onClick={onSearchClick}>
              Search
            </span>
          )}
          {showSignIn && (
            <span style={{ cursor: "pointer" }} onClick={onSignInClick}>
              Sign In
            </span>
          )}
          <button
            onClick={onCtaClick}
            style={{
              background: token("brand-primary"),
              color: "#fff",
              border: "none",
              padding: "8px 20px",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {ctaLabel}
          </button>
        </div>
      </header>
    </div>
  );
}

export const SiteHeader: Story = {
  name: "Site Header",
  args: {
    siteName: "FRE",
    navItems: ["Articles", "Listicles", "Collections", "Big Story"],
    showSearch: true,
    showSignIn: true,
    ctaLabel: "Subscribe",
  },
  argTypes: {
    siteName: { control: "text", description: "Brand / site logo text" },
    navItems: { control: "object", description: "Navigation menu items" },
    showSearch: { control: "boolean", description: "Toggle search link visibility" },
    showSignIn: { control: "boolean", description: "Toggle sign-in link visibility" },
    ctaLabel: { control: "text", description: "Call-to-action button label" },
    onNavClick: { action: "nav-click", table: { category: "Events" } },
    onSearchClick: { action: "search-click", table: { category: "Events" } },
    onSignInClick: { action: "sign-in-click", table: { category: "Events" } },
    onCtaClick: { action: "cta-click", table: { category: "Events" } },
  },
  render: (args) => <SiteHeaderComponent {...(args as SiteHeaderProps)} />,
};

/* ================================================================== */
/*  2. Big Story Feed — Column Right                                   */
/* ================================================================== */

interface BigStoryFeedColRightProps {
  heroTitle: string;
  heroImage: string;
  heroHeight: number;
  sidebarItems: { title: string; image: string }[];
  onHeroClick: () => void;
  onSidebarClick: (title: string) => void;
}

function BigStoryFeedColRightComponent({
  heroTitle,
  heroImage,
  heroHeight,
  sidebarItems,
  onHeroClick,
  onSidebarClick,
}: BigStoryFeedColRightProps) {
  return (
    <div style={{ ...sectionStyle, padding: 24 }}>
      <SectionLabel>
        Big Story Feed (Column Right) &mdash; <TokenTag name="font-headline" />{" "}
        <TokenTag name="font-primary" /> <TokenTag name="brand-1" />
      </SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>
        <div
          style={{ position: "relative", borderRadius: 8, overflow: "hidden", cursor: "pointer" }}
          onClick={onHeroClick}
        >
          <img
            src={heroImage}
            alt="Hero"
            style={{ width: "100%", height: heroHeight, objectFit: "cover", display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "32px 24px 24px",
              background: "linear-gradient(transparent, rgba(0,0,0,.75))",
              color: "#fff",
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: "var(--font-headline-weight, 700)" as any,
                fontFamily: "var(--font-headline, var(--font-brand))",
                lineHeight: 1.2,
              }}
            >
              {heroTitle}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {sidebarItems.map((item, i) => (
            <div
              key={i}
              style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}
              onClick={() => onSidebarClick(item.title)}
            >
              <img
                src={item.image}
                alt=""
                style={{ width: 100, height: 72, objectFit: "cover", borderRadius: 6, flexShrink: 0 }}
              />
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: 1.35,
                  fontFamily: "var(--font-headline, var(--font-brand))",
                }}
              >
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const BigStoryFeedColumnRight: Story = {
  name: "Big Story Feed / Column Right",
  args: {
    heroTitle: "Prince Philip, the Longest-Serving British Consort in History, Has Died",
    heroImage: IMAGES.garden,
    heroHeight: 420,
    sidebarItems: [
      { title: "3 Core Textures That'll Improve Your Home Cooking", image: IMAGES.cooking },
      { title: "Martha Stewart on Gardening in Every Season", image: IMAGES.garden },
      { title: "Listicle Content for Styling", image: IMAGES.fashion },
      { title: "16 Silk Masks That'll Outshine Your Cotton Ones", image: IMAGES.beauty },
    ],
  },
  argTypes: {
    heroTitle: { control: "text", description: "Main hero headline" },
    heroImage: { control: "text", description: "Hero image URL" },
    heroHeight: { control: { type: "range", min: 280, max: 600, step: 20 }, description: "Hero image height (px)" },
    sidebarItems: { control: "object", description: "Sidebar article items" },
    onHeroClick: { action: "hero-click", table: { category: "Events" } },
    onSidebarClick: { action: "sidebar-click", table: { category: "Events" } },
  },
  render: (args) => <BigStoryFeedColRightComponent {...(args as BigStoryFeedColRightProps)} />,
};

/* ================================================================== */
/*  3. Big Story Feed — Stacked                                        */
/* ================================================================== */

interface FeedItem {
  title: string;
  author?: string;
  date: string;
  image: string;
}

interface BigStoryFeedStackedProps {
  items: FeedItem[];
  thumbnailWidth: number;
  thumbnailHeight: number;
  headlineFontSize: number;
  showDividers: boolean;
  onArticleClick: (title: string) => void;
}

function BigStoryFeedStackedComponent({
  items,
  thumbnailWidth,
  thumbnailHeight,
  headlineFontSize,
  showDividers,
  onArticleClick,
}: BigStoryFeedStackedProps) {
  return (
    <div style={{ ...sectionStyle, padding: 24 }}>
      <SectionLabel>
        Big Story Feed (Stacked) &mdash; <TokenTag name="font-primary" />{" "}
        <TokenTag name="content-secondary" /> <TokenTag name="spacing-md" />
      </SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 680 }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 16,
              paddingBottom: 20,
              borderBottom: showDividers ? "1px solid #e5e5e5" : "none",
              cursor: "pointer",
            }}
            onClick={() => onArticleClick(item.title)}
          >
            <img
              src={item.image}
              alt=""
              style={{
                width: thumbnailWidth,
                height: thumbnailHeight,
                objectFit: "cover",
                borderRadius: 6,
                flexShrink: 0,
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
              <div
                style={{
                  fontSize: headlineFontSize,
                  fontWeight: "var(--font-headline-weight, 700)" as any,
                  fontFamily: "var(--font-headline, var(--font-brand))",
                  lineHeight: 1.3,
                }}
              >
                {item.title}
              </div>
              <div style={{ fontSize: 12, color: "#71717a" }}>
                {item.author && (
                  <>
                    <span style={{ fontWeight: 500 }}>By {item.author}</span>
                    <span style={{ margin: "0 6px" }}>&middot;</span>
                  </>
                )}
                {item.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const BigStoryFeedStacked: Story = {
  name: "Big Story Feed / Stacked",
  args: {
    items: [
      { title: "Article w/ Instagram Embeds", author: "Alex Aronson", date: "Apr 9, 2021", image: IMAGES.celebrity },
      { title: "Videos LongForm Article", date: "Jul 15, 2021", image: IMAGES.travel },
      { title: "Watch Next in Body - Article", author: "Dan Edmunds", date: "Jul 15, 2021", image: IMAGES.video },
      { title: "45 Easy Changes You Can Make to Save the Earth", author: "Adam Schubak", date: "Apr 9, 2021", image: IMAGES.wellness },
    ],
    thumbnailWidth: 200,
    thumbnailHeight: 140,
    headlineFontSize: 18,
    showDividers: true,
  },
  argTypes: {
    items: { control: "object", description: "Feed article items" },
    thumbnailWidth: { control: { type: "range", min: 80, max: 320, step: 10 }, description: "Thumbnail width (px)" },
    thumbnailHeight: { control: { type: "range", min: 60, max: 240, step: 10 }, description: "Thumbnail height (px)" },
    headlineFontSize: { control: { type: "range", min: 14, max: 28, step: 1 }, description: "Headline font size (px)" },
    showDividers: { control: "boolean", description: "Show dividers between items" },
    onArticleClick: { action: "article-click", table: { category: "Events" } },
  },
  render: (args) => <BigStoryFeedStackedComponent {...(args as BigStoryFeedStackedProps)} />,
};

/* ================================================================== */
/*  4. Big Story — Image Right                                         */
/* ================================================================== */

interface BigStoryImageRightProps {
  label: string;
  headline: string;
  description: string;
  author: string;
  date: string;
  image: string;
  headlineFontSize: number;
  imageHeight: number;
  onArticleClick: () => void;
}

function BigStoryImageRightComponent({
  label,
  headline,
  description,
  author,
  date,
  image,
  headlineFontSize,
  imageHeight,
  onArticleClick,
}: BigStoryImageRightProps) {
  return (
    <div style={{ ...sectionStyle, padding: 24 }}>
      <SectionLabel>
        Big Story Image Right &mdash; <TokenTag name="font-headline" />{" "}
        <TokenTag name="brand-1" /> <TokenTag name="content-secondary" />
      </SectionLabel>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center", cursor: "pointer" }}
        onClick={onArticleClick}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              color: token("brand-primary"),
            }}
          >
            {label}
          </span>
          <h2
            style={{
              fontSize: headlineFontSize,
              fontWeight: "var(--font-headline-weight, 700)" as any,
              fontFamily: "var(--font-headline, var(--font-brand))",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            {headline}
          </h2>
          <p style={{ fontSize: 15, color: "#52525b", lineHeight: 1.6, margin: 0 }}>{description}</p>
          <div style={{ fontSize: 12, color: "#71717a" }}>
            <span style={{ fontWeight: 500 }}>By {author}</span>
            <span style={{ margin: "0 6px" }}>&middot;</span>
            {date}
          </div>
        </div>
        <img
          src={image}
          alt=""
          style={{ width: "100%", height: imageHeight, objectFit: "cover", borderRadius: 8 }}
        />
      </div>
    </div>
  );
}

export const BigStoryImageRight: Story = {
  name: "Big Story / Image Right",
  args: {
    label: "Label",
    headline: "Standard Article \u2014 everything we need to style",
    description: "A dermatologist explains \u2013 and shares some clutch product recommendations.",
    author: "Angel Madison",
    date: "Apr 12, 2021",
    image: IMAGES.beauty,
    headlineFontSize: 36,
    imageHeight: 360,
  },
  argTypes: {
    label: { control: "text", description: "Category / eyebrow label" },
    headline: { control: "text", description: "Article headline" },
    description: { control: "text", description: "Article description / dek" },
    author: { control: "text", description: "Author name" },
    date: { control: "text", description: "Publish date" },
    image: { control: "text", description: "Image URL" },
    headlineFontSize: { control: { type: "range", min: 24, max: 56, step: 2 }, description: "Headline font size (px)" },
    imageHeight: { control: { type: "range", min: 200, max: 500, step: 20 }, description: "Image height (px)" },
    onArticleClick: { action: "article-click", table: { category: "Events" } },
  },
  render: (args) => <BigStoryImageRightComponent {...(args as BigStoryImageRightProps)} />,
};

/* ================================================================== */
/*  5. Four Across Grid                                                */
/* ================================================================== */

interface FourAcrossGridProps {
  items: { title: string; image: string }[];
  columns: number;
  gap: number;
  aspectRatio: string;
  onCardClick: (title: string) => void;
}

function FourAcrossGridComponent({ items, columns, gap, aspectRatio, onCardClick }: FourAcrossGridProps) {
  return (
    <div style={{ ...sectionStyle, padding: 24 }}>
      <SectionLabel>
        4-Across Grid &mdash; <TokenTag name="font-headline" />{" "}
        <TokenTag name="border-radius-md" /> <TokenTag name="spacing-lg" />
      </SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{ display: "flex", flexDirection: "column", gap: 10, cursor: "pointer" }}
            onClick={() => onCardClick(item.title)}
          >
            <img
              src={item.image}
              alt=""
              style={{
                width: "100%",
                aspectRatio,
                objectFit: "cover",
                borderRadius: "var(--border-radius-md, 8px)",
              }}
            />
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                lineHeight: 1.3,
                fontFamily: "var(--font-headline, var(--font-brand))",
              }}
            >
              {item.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const FourAcrossGrid: Story = {
  name: "4-Across Grid",
  args: {
    items: [
      { title: "Multi-image products", image: IMAGES.product1 },
      { title: "Commerce Test Listicle", image: IMAGES.product2 },
      { title: "Commerce Test Gallery", image: IMAGES.home },
      { title: "Our Guide to the Best Jeans for Women", image: IMAGES.fashion },
    ],
    columns: 4,
    gap: 20,
    aspectRatio: "4/3",
  },
  argTypes: {
    items: { control: "object", description: "Grid card items" },
    columns: { control: { type: "range", min: 2, max: 6, step: 1 }, description: "Number of columns" },
    gap: { control: { type: "range", min: 8, max: 40, step: 4 }, description: "Grid gap (px)" },
    aspectRatio: { control: "select", options: ["1/1", "4/3", "3/2", "16/9"], description: "Image aspect ratio" },
    onCardClick: { action: "card-click", table: { category: "Events" } },
  },
  render: (args) => <FourAcrossGridComponent {...(args as FourAcrossGridProps)} />,
};

/* ================================================================== */
/*  6. Big Story — Image Right with Products                           */
/* ================================================================== */

interface BigStoryProductsProps {
  label: string;
  headline: string;
  description: string;
  author: string;
  date: string;
  image: string;
  imageHeight: number;
  onArticleClick: () => void;
}

function BigStoryProductsComponent({
  label,
  headline,
  description,
  author,
  date,
  image,
  imageHeight,
  onArticleClick,
}: BigStoryProductsProps) {
  const brand = useBrand();
  const isCarAndDriver = brand.slug === "car-and-driver";
  const headlineSize = isCarAndDriver ? 44 : 32;

  return (
    <div style={{ ...sectionStyle, padding: 24 }}>
      <SectionLabel>
        Big Story Image Right (Products) &mdash; <TokenTag name="brand-1" />{" "}
        <TokenTag name="font-headline" /> <TokenTag name="content-secondary" />
      </SectionLabel>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center", cursor: "pointer" }}
        onClick={onArticleClick}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span
            style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              color: token("brand-primary"),
            }}
          >
            {label}
          </span>
          <h2
            style={{
              fontSize: headlineSize,
              fontWeight: "var(--font-headline-weight, 700)" as any,
              fontFamily: "var(--font-headline, var(--font-brand))",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {headline}
          </h2>
          <p style={{ fontSize: 15, color: "#52525b", lineHeight: 1.6, margin: 0 }}>
            {description}
          </p>
          <div style={{ fontSize: 12, color: "#71717a" }}>
            <span style={{ fontWeight: 500 }}>By {author}</span>
            <span style={{ margin: "0 6px" }}>&middot;</span>
            {date}
          </div>
        </div>
        <img
          src={image}
          alt=""
          style={{ width: "100%", height: imageHeight, objectFit: "cover", borderRadius: 8 }}
        />
      </div>
    </div>
  );
}

export const BigStoryImageRightProducts: Story = {
  name: "Big Story / Image Right + Products",
  args: {
    label: "Recipe",
    headline: "Recipe Content for Styling",
    description: "Beef stew is a cold-weather essential. Read on to get all the hot deets on this ultra-comforting stew.",
    author: "Selena Barrientos",
    date: "Oct 29, 2021",
    image: IMAGES.food,
    imageHeight: 340,
  },
  argTypes: {
    label: { control: "text", description: "Category / eyebrow label" },
    headline: { control: "text", description: "Article headline" },
    description: { control: "text", description: "Article description / dek" },
    author: { control: "text", description: "Author name" },
    date: { control: "text", description: "Publish date" },
    image: { control: "text", description: "Image URL" },
    imageHeight: { control: { type: "range", min: 200, max: 500, step: 20 }, description: "Image height (px)" },
    onArticleClick: { action: "article-click", table: { category: "Events" } },
  },
  render: (args) => <BigStoryProductsComponent {...(args as BigStoryProductsProps)} />,
};

/* ================================================================== */
/*  7. Big Story Block — Text Only                                     */
/* ================================================================== */

interface BigStoryTextOnlyProps {
  label: string;
  headline: string;
  description: string;
  author: string;
  date: string;
  headlineFontSize: number;
  showBorderTop: boolean;
  onArticleClick: () => void;
}

function BigStoryTextOnlyComponent({
  label,
  headline,
  description,
  author,
  date,
  headlineFontSize,
  showBorderTop,
  onArticleClick,
}: BigStoryTextOnlyProps) {
  return (
    <div style={{ ...sectionStyle, padding: 24 }}>
      <SectionLabel>
        Big Story Block (Text Only) &mdash; <TokenTag name="font-headline" />{" "}
        <TokenTag name="brand-1" /> <TokenTag name="font-primary" />
      </SectionLabel>
      <div
        style={{
          maxWidth: 720,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          padding: "40px 0",
          borderTop: showBorderTop ? "3px solid var(--brand-primary, #000)" : "none",
          cursor: "pointer",
        }}
        onClick={onArticleClick}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            color: token("brand-primary"),
          }}
        >
          {label}
        </span>
        <h2
          style={{
            fontSize: headlineFontSize,
            fontWeight: "var(--font-headline-weight, 700)" as any,
            fontFamily: "var(--font-headline, var(--font-brand))",
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          {headline}
        </h2>
        <p style={{ fontSize: 16, color: "#52525b", lineHeight: 1.6, margin: 0 }}>{description}</p>
        <div style={{ fontSize: 12, color: "#71717a" }}>
          <span style={{ fontWeight: 500 }}>By {author}</span>
          <span style={{ margin: "0 6px" }}>&middot;</span>
          {date}
        </div>
      </div>
    </div>
  );
}

export const BigStoryTextOnly: Story = {
  name: "Big Story / Text Only",
  args: {
    label: "Listicle Label",
    headline: "Listicle Content with non products and products for styling",
    description: "From printed bikinis, and high-waisted two pieces, to classic maillots, here\u2019s what we\u2019re wearing to the beach this summer.",
    author: "Roxanne Adamiyatt",
    date: "Apr 9, 2021",
    headlineFontSize: 40,
    showBorderTop: true,
  },
  argTypes: {
    label: { control: "text", description: "Category / eyebrow label" },
    headline: { control: "text", description: "Article headline" },
    description: { control: "text", description: "Article description / dek" },
    author: { control: "text", description: "Author name" },
    date: { control: "text", description: "Publish date" },
    headlineFontSize: { control: { type: "range", min: 24, max: 56, step: 2 }, description: "Headline font size (px)" },
    showBorderTop: { control: "boolean", description: "Show brand-colored top border" },
    onArticleClick: { action: "article-click", table: { category: "Events" } },
  },
  render: (args) => <BigStoryTextOnlyComponent {...(args as BigStoryTextOnlyProps)} />,
};

/* ================================================================== */
/*  8. Big Story Feed — Text Only                                      */
/* ================================================================== */

interface TextFeedItem {
  title: string;
  author?: string;
  date: string;
}

interface BigStoryFeedTextOnlyProps {
  items: TextFeedItem[];
  headlineFontSize: number;
  showDividers: boolean;
  onArticleClick: (title: string) => void;
}

function BigStoryFeedTextOnlyComponent({
  items,
  headlineFontSize,
  showDividers,
  onArticleClick,
}: BigStoryFeedTextOnlyProps) {
  return (
    <div style={{ ...sectionStyle, padding: 24 }}>
      <SectionLabel>
        Big Story Feed (Text Only) &mdash; <TokenTag name="font-headline" />{" "}
        <TokenTag name="font-primary" /> <TokenTag name="content-secondary" />
      </SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 680 }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              padding: "16px 0",
              borderBottom: showDividers ? "1px solid #e5e5e5" : "none",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              cursor: "pointer",
            }}
            onClick={() => onArticleClick(item.title)}
          >
            <div
              style={{
                fontSize: headlineFontSize,
                fontWeight: "var(--font-headline-weight, 700)" as any,
                fontFamily: "var(--font-headline, var(--font-brand))",
                lineHeight: 1.3,
              }}
            >
              {item.title}
            </div>
            <div style={{ fontSize: 12, color: "#71717a" }}>
              {item.author && (
                <>
                  <span style={{ fontWeight: 500 }}>By {item.author}</span>
                  <span style={{ margin: "0 6px" }}>&middot;</span>
                </>
              )}
              {item.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const BigStoryFeedTextOnly: Story = {
  name: "Big Story Feed / Text Only",
  args: {
    items: [
      { title: "Longform Article: Image and Composite Embeds", author: "Anatola Araba", date: "Sep 10, 2021" },
      { title: "Standard Article with Embed Gallery", date: "Aug 5, 2021" },
      { title: "Standard Article: Image and Composite Embeds", author: "Anatola Araba", date: "Aug 24, 2021" },
      { title: "DO NOT EDIT Resin Player In Body", date: "Sep 16, 2021" },
      { title: "Watch Next in Body - Article", author: "Dan Edmunds", date: "Jul 15, 2021" },
    ],
    headlineFontSize: 17,
    showDividers: true,
  },
  argTypes: {
    items: { control: "object", description: "Feed article items" },
    headlineFontSize: { control: { type: "range", min: 14, max: 28, step: 1 }, description: "Headline font size (px)" },
    showDividers: { control: "boolean", description: "Show dividers between items" },
    onArticleClick: { action: "article-click", table: { category: "Events" } },
  },
  render: (args) => <BigStoryFeedTextOnlyComponent {...(args as BigStoryFeedTextOnlyProps)} />,
};

/* ================================================================== */
/*  9. 4-Across Product Feed                                           */
/* ================================================================== */

interface ProductItem {
  name: string;
  tag: string;
  brand: string;
  description: string;
  discount: string;
  ctaLabel: string;
  image: string;
}

interface FourAcrossProductFeedProps {
  items: ProductItem[];
  columns: number;
  gap: number;
  onShopNowClick: (productName: string) => void;
  onProductClick: (productName: string) => void;
}

function FourAcrossProductFeedComponent({
  items,
  columns,
  gap,
  onShopNowClick,
  onProductClick,
}: FourAcrossProductFeedProps) {
  return (
    <div style={{ ...sectionStyle, padding: 24 }}>
      <SectionLabel>
        4-Across Product Feed &mdash; <TokenTag name="brand-1" />{" "}
        <TokenTag name="font-primary" /> <TokenTag name="border-radius-md" />
      </SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: "var(--border-radius-md, 8px)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
            }}
            onClick={() => onProductClick(item.name)}
          >
            <div
              style={{
                background: "#f5f5f5",
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={item.image} alt="" style={{ height: 160, objectFit: "contain" }} />
            </div>
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: "#71717a" }}>
                {item.tag}
              </div>
              <div style={{ fontSize: 11, color: "#71717a" }}>{item.brand}</div>
              <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{item.name}</div>
              {item.description && <div style={{ fontSize: 12, color: "#52525b" }}>{item.description}</div>}
              {item.discount && (
                <div style={{ fontSize: 12, fontWeight: 700, color: token("brand-primary"), marginTop: 4 }}>
                  {item.discount}
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShopNowClick(item.name);
                }}
                style={{
                  marginTop: "auto",
                  background: token("brand-primary"),
                  color: "#fff",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: 4,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                {item.ctaLabel}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const FourAcrossProductFeed: Story = {
  name: "4-Across Product Feed",
  args: {
    items: [
      { name: "WWDOLL Face Mask 25 Pack, 5-Layers Breathable Yellow", tag: "Custom Tag", brand: "WWDOLL", description: "Desc 5-Layer Face Mask", discount: "Now 20% Off", ctaLabel: "Shop Now", image: IMAGES.product1 },
      { name: "WWDOLL 5-Layers Breathable KN95 Masks, Yellow", tag: "Custom Tag", brand: "WWDOLL", description: "Desc", discount: "Now 20% Off", ctaLabel: "Shop Now", image: IMAGES.product1 },
      { name: "WWDOLL KN95 Face Mask 25 Pack", tag: "Custom Tag", brand: "WWDOLL", description: "description", discount: "Now 20% Off", ctaLabel: "Shop Now", image: IMAGES.product1 },
      { name: "WWDOLL KN95 Face Mask 25 Pack", tag: "Custom tag", brand: "WWDOLL", description: "", discount: "Now 20% Off", ctaLabel: "Shop Now", image: IMAGES.product1 },
    ],
    columns: 4,
    gap: 20,
  },
  argTypes: {
    items: { control: "object", description: "Product card items" },
    columns: { control: { type: "range", min: 2, max: 6, step: 1 }, description: "Number of columns" },
    gap: { control: { type: "range", min: 8, max: 40, step: 4 }, description: "Grid gap (px)" },
    onShopNowClick: { action: "shop-now-click", table: { category: "Events" } },
    onProductClick: { action: "product-click", table: { category: "Events" } },
  },
  render: (args) => <FourAcrossProductFeedComponent {...(args as FourAcrossProductFeedProps)} />,
};

/* ================================================================== */
/*  10. Big Story — Video Lead                                         */
/* ================================================================== */

interface BigStoryVideoProps {
  headline: string;
  description: string;
  image: string;
  headlineFontSize: number;
  showPlayButton: boolean;
  onPlayClick: () => void;
  onArticleClick: () => void;
}

function BigStoryVideoComponent({
  headline,
  description,
  image,
  headlineFontSize,
  showPlayButton,
  onPlayClick,
  onArticleClick,
}: BigStoryVideoProps) {
  return (
    <div style={{ ...sectionStyle, padding: 24 }}>
      <SectionLabel>
        Big Story (Video) &mdash; <TokenTag name="font-headline" />{" "}
        <TokenTag name="brand-1" /> <TokenTag name="content-secondary" />
      </SectionLabel>
      <div style={{ maxWidth: 800 }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            background: "#000",
            borderRadius: 8,
            overflow: "hidden",
            marginBottom: 20,
            cursor: "pointer",
          }}
          onClick={onPlayClick}
        >
          <img
            src={image}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }}
          />
          {showPlayButton && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(255,255,255,.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "12px solid transparent",
                  borderBottom: "12px solid transparent",
                  borderLeft: "20px solid #000",
                  marginLeft: 4,
                }}
              />
            </div>
          )}
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              background: "rgba(0,0,0,.7)",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 4,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Video
          </div>
        </div>
        <div style={{ cursor: "pointer" }} onClick={onArticleClick}>
          <h2
            style={{
              fontSize: headlineFontSize,
              fontWeight: "var(--font-headline-weight, 700)" as any,
              fontFamily: "var(--font-headline, var(--font-brand))",
              lineHeight: 1.2,
              margin: "0 0 12px",
            }}
          >
            {headline}
          </h2>
          <p style={{ fontSize: 15, color: "#52525b", lineHeight: 1.6, margin: 0 }}>{description}</p>
        </div>
      </div>
    </div>
  );
}

export const BigStoryVideo: Story = {
  name: "Big Story / Video Lead",
  args: {
    headline: "Article w/ Lead Video \u2014 Jennifer Lopez and Alex Rodriguez Announce They\u2019ve Broken Up",
    description: "\u201CWe have realized we are better as friends and look forward to remaining so.\u201D",
    image: IMAGES.celebrity,
    headlineFontSize: 28,
    showPlayButton: true,
  },
  argTypes: {
    headline: { control: "text", description: "Article headline" },
    description: { control: "text", description: "Article description / dek" },
    image: { control: "text", description: "Video poster image URL" },
    headlineFontSize: { control: { type: "range", min: 20, max: 44, step: 2 }, description: "Headline font size (px)" },
    showPlayButton: { control: "boolean", description: "Show play button overlay" },
    onPlayClick: { action: "play-click", table: { category: "Events" } },
    onArticleClick: { action: "article-click", table: { category: "Events" } },
  },
  render: (args) => <BigStoryVideoComponent {...(args as BigStoryVideoProps)} />,
};

/* ================================================================== */
/*  11. Text Block (Rich Text)                                         */
/* ================================================================== */

interface TextBlockProps {
  showBold: boolean;
  showItalic: boolean;
  showUnderline: boolean;
  showCombined: boolean;
  showOrderedList: boolean;
  showUnorderedList: boolean;
  bodyFontSize: number;
}

function TextBlockComponent({
  showBold,
  showItalic,
  showUnderline,
  showCombined,
  showOrderedList,
  showUnorderedList,
  bodyFontSize,
}: TextBlockProps) {
  return (
    <div style={{ ...sectionStyle, padding: 24 }}>
      <SectionLabel>
        Text Block QA &mdash; <TokenTag name="font-primary" />{" "}
        <TokenTag name="content-primary" /> <TokenTag name="spacing-md" />
      </SectionLabel>
      <div style={{ maxWidth: 680, fontSize: bodyFontSize, lineHeight: 1.7, color: "#18181b" }}>
        {showBold && (
          <p>
            <strong>Bold only text</strong>
          </p>
        )}
        {showItalic && (
          <p>
            <em>Italics only test</em>
          </p>
        )}
        {showUnderline && (
          <p>
            <u>Underline only text</u>
          </p>
        )}
        {showCombined && (
          <p>
            <strong>
              <em>
                <u>Bold, italics and underline text</u>
              </em>
            </strong>
          </p>
        )}
        {showOrderedList && (
          <>
            <p>The numbered bullets are listed as follows:</p>
            <ol style={{ paddingLeft: 24 }}>
              <li>Number 1</li>
              <li>Number 2</li>
              <li>Number 3</li>
            </ol>
          </>
        )}
        {showUnorderedList && (
          <>
            <p>The bullets are listed as follows:</p>
            <ul style={{ paddingLeft: 24 }}>
              <li>Bullet 1</li>
              <li>Bullet 2</li>
              <li>Bullet 3</li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export const TextBlock: Story = {
  name: "Text Block / Rich Text",
  args: {
    showBold: true,
    showItalic: true,
    showUnderline: true,
    showCombined: true,
    showOrderedList: true,
    showUnorderedList: true,
    bodyFontSize: 16,
  },
  argTypes: {
    showBold: { control: "boolean", description: "Show bold text sample" },
    showItalic: { control: "boolean", description: "Show italic text sample" },
    showUnderline: { control: "boolean", description: "Show underline text sample" },
    showCombined: { control: "boolean", description: "Show combined formatting sample" },
    showOrderedList: { control: "boolean", description: "Show ordered list" },
    showUnorderedList: { control: "boolean", description: "Show unordered list" },
    bodyFontSize: { control: { type: "range", min: 12, max: 24, step: 1 }, description: "Body font size (px)" },
  },
  render: (args) => <TextBlockComponent {...(args as TextBlockProps)} />,
};

/* ================================================================== */
/*  12. Site Footer                                                    */
/* ================================================================== */

interface SiteFooterProps {
  siteName: string;
  socialLinks: string[];
  legalLinks: string[];
  copyrightYear: number;
  showSocialLinks: boolean;
  onSocialClick: (platform: string) => void;
  onLegalClick: (link: string) => void;
  onSubscribeClick: () => void;
}

function SiteFooterComponent({
  siteName,
  socialLinks,
  legalLinks,
  copyrightYear,
  showSocialLinks,
  onSocialClick,
  onLegalClick,
  onSubscribeClick,
}: SiteFooterProps) {
  return (
    <div style={sectionStyle}>
      <SectionLabel>
        Site Footer &mdash; <TokenTag name="background-knockout" />{" "}
        <TokenTag name="content-knockout" /> <TokenTag name="brand-1" />
      </SectionLabel>
      <footer
        style={{
          background: "#000",
          color: "#fff",
          padding: "40px 24px",
          fontFamily: "var(--font-brand, Inter, system-ui, sans-serif)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, fontStyle: "italic", marginBottom: 16 }}>
              {siteName}
            </div>
            {showSocialLinks && (
              <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
                {socialLinks.map((s) => (
                  <span
                    key={s}
                    style={{ opacity: 0.7, cursor: "pointer" }}
                    onClick={() => onSocialClick(s)}
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 32, fontSize: 13 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontWeight: 600, marginBottom: 4 }}>Other Hearst Subscriptions</span>
              <span style={{ opacity: 0.7, cursor: "pointer" }} onClick={onSubscribeClick}>
                Subscribe
              </span>
            </div>
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,.15)",
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 11,
            opacity: 0.6,
          }}
        >
          <div>A Part of Hearst Digital Media</div>
          <div style={{ display: "flex", gap: 16 }}>
            {legalLinks.map((link) => (
              <span key={link} style={{ cursor: "pointer" }} onClick={() => onLegalClick(link)}>
                {link}
              </span>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 10, opacity: 0.4, marginTop: 12 }}>
          &copy;{copyrightYear} Hearst Magazine Media, Inc. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

export const SiteFooter: Story = {
  name: "Site Footer",
  args: {
    siteName: "FRE",
    socialLinks: ["YouTube", "Facebook", "Instagram", "Pinterest"],
    legalLinks: ["Privacy Notice", "Terms of Use", "Site Map"],
    copyrightYear: 2026,
    showSocialLinks: true,
  },
  argTypes: {
    siteName: { control: "text", description: "Brand / site name" },
    socialLinks: { control: "object", description: "Social media platform names" },
    legalLinks: { control: "object", description: "Legal footer link labels" },
    copyrightYear: { control: { type: "number", min: 2020, max: 2030 }, description: "Copyright year" },
    showSocialLinks: { control: "boolean", description: "Show social links row" },
    onSocialClick: { action: "social-click", table: { category: "Events" } },
    onLegalClick: { action: "legal-click", table: { category: "Events" } },
    onSubscribeClick: { action: "subscribe-click", table: { category: "Events" } },
  },
  render: (args) => <SiteFooterComponent {...(args as SiteFooterProps)} />,
};
