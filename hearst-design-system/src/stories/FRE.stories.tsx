import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

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

/* Placeholder image helper */
const img = (w: number, h: number, label = "") =>
  `https://placehold.co/${w}x${h}/e2e8f0/64748b?text=${encodeURIComponent(label || `${w}x${h}`)}`;

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

/* ------------------------------------------------------------------ */
/*  1. Site Header / Nav Bar                                           */
/* ------------------------------------------------------------------ */

export const SiteHeader: Story = {
  name: "Site Header",
  render: () => (
    <div style={sectionStyle}>
      <SectionLabel>
        Site Header &mdash; Tokens used: <TokenTag name="brand-1" />{" "}
        <TokenTag name="font-primary" /> <TokenTag name="background-default" />{" "}
        <TokenTag name="content-primary" />
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
            FRE
          </div>
          <nav style={{ display: "flex", gap: 20, fontSize: 13, fontWeight: 500 }}>
            {["Articles", "Listicles", "Collections", "Big Story"].map((item) => (
              <span key={item} style={{ cursor: "pointer", color: "#3b3b3b" }}>
                {item}
              </span>
            ))}
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13 }}>
          <span style={{ cursor: "pointer" }}>Search</span>
          <span style={{ cursor: "pointer" }}>Sign In</span>
          <button
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
            Subscribe
          </button>
        </div>
      </header>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  2. Big Story Feed — Column Right                                   */
/* ------------------------------------------------------------------ */

export const BigStoryFeedColumnRight: Story = {
  name: "Big Story Feed / Column Right",
  render: () => (
    <div style={{ ...sectionStyle, padding: 24 }}>
      <SectionLabel>
        Big Story Feed (Column Right) &mdash; <TokenTag name="font-headline" />{" "}
        <TokenTag name="font-primary" /> <TokenTag name="brand-1" />{" "}
        <TokenTag name="content-primary" />
      </SectionLabel>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>
        {/* Hero card */}
        <div style={{ position: "relative", borderRadius: 8, overflow: "hidden" }}>
          <img
            src={IMAGES.garden}
            alt="Hero"
            style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }}
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
              Prince Philip, the Longest-Serving British Consort in History, Has Died
            </div>
          </div>
        </div>

        {/* Side feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { title: "3 Core Textures That'll Improve Your Home Cooking", img: IMAGES.cooking },
            { title: "Martha Stewart on Gardening in Every Season", img: IMAGES.garden },
            { title: "Listicle Content for Styling", img: IMAGES.fashion },
            { title: "16 Silk Masks That'll Outshine Your Cotton Ones", img: IMAGES.beauty },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <img
                src={item.img}
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
  ),
};

/* ------------------------------------------------------------------ */
/*  3. Big Story Feed — Stacked                                        */
/* ------------------------------------------------------------------ */

export const BigStoryFeedStacked: Story = {
  name: "Big Story Feed / Stacked",
  render: () => (
    <div style={{ ...sectionStyle, padding: 24 }}>
      <SectionLabel>
        Big Story Feed (Stacked with Ad) &mdash; <TokenTag name="font-primary" />{" "}
        <TokenTag name="content-secondary" /> <TokenTag name="spacing-md" />
      </SectionLabel>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 680 }}>
        {[
          { title: "Article w/ Instagram Embeds", author: "Alex Aronson", date: "Apr 9, 2021", img: IMAGES.celebrity },
          { title: "Videos LongForm Article", date: "Jul 15, 2021", img: IMAGES.travel },
          { title: "Watch Next in Body - Article", author: "Dan Edmunds", date: "Jul 15, 2021", img: IMAGES.video },
          { title: "45 Easy Changes You Can Make to Save the Earth", author: "Adam Schubak", date: "Apr 9, 2021", img: IMAGES.wellness },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 16, paddingBottom: 20, borderBottom: "1px solid #e5e5e5" }}>
            <img
              src={item.img}
              alt=""
              style={{ width: 200, height: 140, objectFit: "cover", borderRadius: 6, flexShrink: 0 }}
            />
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
              <div
                style={{
                  fontSize: 18,
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
  ),
};

/* ------------------------------------------------------------------ */
/*  4. Big Story — Image Right                                         */
/* ------------------------------------------------------------------ */

export const BigStoryImageRight: Story = {
  name: "Big Story / Image Right",
  render: () => (
    <div style={{ ...sectionStyle, padding: 24 }}>
      <SectionLabel>
        Big Story Image Right &mdash; <TokenTag name="font-headline" />{" "}
        <TokenTag name="brand-1" /> <TokenTag name="content-secondary" />{" "}
        <TokenTag name="font-primary" />
      </SectionLabel>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center" }}>
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
            Label
          </span>
          <h2
            style={{
              fontSize: 36,
              fontWeight: "var(--font-headline-weight, 700)" as any,
              fontFamily: "var(--font-headline, var(--font-brand))",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Standard Article &mdash; everything we need to style
          </h2>
          <p style={{ fontSize: 15, color: "#52525b", lineHeight: 1.6, margin: 0 }}>
            A dermatologist explains &ndash; and shares some clutch product recommendations.
          </p>
          <div style={{ fontSize: 12, color: "#71717a" }}>
            <span style={{ fontWeight: 500 }}>By Angel Madison</span>
            <span style={{ margin: "0 6px" }}>&middot;</span>
            Apr 12, 2021
          </div>
        </div>
        <img
          src={IMAGES.beauty}
          alt=""
          style={{ width: "100%", height: 360, objectFit: "cover", borderRadius: 8 }}
        />
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  5. Four Across Grid                                                */
/* ------------------------------------------------------------------ */

export const FourAcrossGrid: Story = {
  name: "4-Across Grid",
  render: () => (
    <div style={{ ...sectionStyle, padding: 24 }}>
      <SectionLabel>
        4-Across Grid &mdash; <TokenTag name="font-headline" />{" "}
        <TokenTag name="border-radius-md" /> <TokenTag name="spacing-lg" />
      </SectionLabel>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
        {[
          { title: "Multi-image products", img: IMAGES.product1 },
          { title: "Commerce Test Listicle", img: IMAGES.product2 },
          { title: "Commerce Test Gallery", img: IMAGES.home },
          { title: "Our Guide to the Best Jeans for Women", img: IMAGES.fashion },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <img
              src={item.img}
              alt=""
              style={{
                width: "100%",
                aspectRatio: "4/3",
                objectFit: "cover",
                borderRadius: `var(--border-radius-md, 8px)`,
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
  ),
};

/* ------------------------------------------------------------------ */
/*  6. Big Story — Image Right with Products                           */
/* ------------------------------------------------------------------ */

export const BigStoryImageRightProducts: Story = {
  name: "Big Story / Image Right + Products",
  render: () => (
    <div style={{ ...sectionStyle, padding: 24 }}>
      <SectionLabel>
        Big Story Image Right (Products) &mdash; <TokenTag name="brand-1" />{" "}
        <TokenTag name="font-headline" /> <TokenTag name="content-secondary" />
      </SectionLabel>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center" }}>
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
            Recipe
          </span>
          <h2
            style={{
              fontSize: 32,
              fontWeight: "var(--font-headline-weight, 700)" as any,
              fontFamily: "var(--font-headline, var(--font-brand))",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Recipe Content for Styling
          </h2>
          <p style={{ fontSize: 15, color: "#52525b", lineHeight: 1.6, margin: 0 }}>
            Beef stew is a cold-weather <em>essential</em>. Read on to get all the hot deets on
            this ultra-comforting stew.
          </p>
          <div style={{ fontSize: 12, color: "#71717a" }}>
            <span style={{ fontWeight: 500 }}>By Selena Barrientos</span>
            <span style={{ margin: "0 6px" }}>&middot;</span>
            Oct 29, 2021
          </div>
        </div>
        <img
          src={IMAGES.food}
          alt=""
          style={{ width: "100%", height: 340, objectFit: "cover", borderRadius: 8 }}
        />
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  7. Big Story Block — Text Only                                     */
/* ------------------------------------------------------------------ */

export const BigStoryTextOnly: Story = {
  name: "Big Story / Text Only",
  render: () => (
    <div style={{ ...sectionStyle, padding: 24 }}>
      <SectionLabel>
        Big Story Block (Text Only) &mdash; <TokenTag name="font-headline" />{" "}
        <TokenTag name="brand-1" /> <TokenTag name="font-primary" />{" "}
        <TokenTag name="content-secondary" />
      </SectionLabel>

      <div
        style={{
          maxWidth: 720,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          padding: "40px 0",
          borderTop: "3px solid var(--brand-primary, #000)",
        }}
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
          Listicle Label
        </span>
        <h2
          style={{
            fontSize: 40,
            fontWeight: "var(--font-headline-weight, 700)" as any,
            fontFamily: "var(--font-headline, var(--font-brand))",
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Listicle Content with non products and products for styling
        </h2>
        <p style={{ fontSize: 16, color: "#52525b", lineHeight: 1.6, margin: 0 }}>
          From printed bikinis, and high-waisted two pieces, to classic maillots, here&apos;s what
          we&apos;re wearing to the beach this summer.
        </p>
        <div style={{ fontSize: 12, color: "#71717a" }}>
          <span style={{ fontWeight: 500 }}>By Roxanne Adamiyatt</span>
          <span style={{ margin: "0 6px" }}>&middot;</span>
          Apr 9, 2021
        </div>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  8. Big Story Feed — Text Only                                      */
/* ------------------------------------------------------------------ */

export const BigStoryFeedTextOnly: Story = {
  name: "Big Story Feed / Text Only",
  render: () => (
    <div style={{ ...sectionStyle, padding: 24 }}>
      <SectionLabel>
        Big Story Feed (Text Only) &mdash; <TokenTag name="font-headline" />{" "}
        <TokenTag name="font-primary" /> <TokenTag name="content-secondary" />
      </SectionLabel>

      <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 680 }}>
        {[
          { title: "Longform Article: Image and Composite Embeds", author: "Anatola Araba", date: "Sep 10, 2021" },
          { title: "Standard Article with Embed Gallery", date: "Aug 5, 2021" },
          { title: "Standard Article: Image and Composite Embeds", author: "Anatola Araba", date: "Aug 24, 2021" },
          { title: "DO NOT EDIT Resin Player In Body", date: "Sep 16, 2021" },
          { title: "Watch Next in Body - Article", author: "Dan Edmunds", date: "Jul 15, 2021" },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              padding: "16px 0",
              borderBottom: "1px solid #e5e5e5",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div
              style={{
                fontSize: 17,
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
  ),
};

/* ------------------------------------------------------------------ */
/*  9. 4-Across Product Feed                                           */
/* ------------------------------------------------------------------ */

export const FourAcrossProductFeed: Story = {
  name: "4-Across Product Feed",
  render: () => (
    <div style={{ ...sectionStyle, padding: 24 }}>
      <SectionLabel>
        4-Across Product Feed &mdash; <TokenTag name="brand-1" />{" "}
        <TokenTag name="font-primary" /> <TokenTag name="border-radius-md" />{" "}
        <TokenTag name="component-button-background-primary-solid-default" />
      </SectionLabel>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
        {[
          { name: "WWDOLL Face Mask 25 Pack, 5-Layers Breathable Yellow", tag: "Custom Tag", brand: "WWDOLL", desc: "Desc 5-Layer Face Mask" },
          { name: "WWDOLL 5-Layers Breathable KN95 Masks, Yellow", tag: "Custom Tag", brand: "WWDOLL", desc: "Desc" },
          { name: "WWDOLL KN95 Face Mask 25 Pack", tag: "Custom Tag", brand: "WWDOLL", desc: "description" },
          { name: "WWDOLL KN95 Face Mask 25 Pack", tag: "Custom tag", brand: "WWDOLL", desc: "" },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: `var(--border-radius-md, 8px)`,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ background: "#f5f5f5", height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={IMAGES.product1} alt="" style={{ height: 160, objectFit: "contain" }} />
            </div>
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: "#71717a" }}>
                {item.tag}
              </div>
              <div style={{ fontSize: 11, color: "#71717a" }}>{item.brand}</div>
              <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{item.name}</div>
              {item.desc && <div style={{ fontSize: 12, color: "#52525b" }}>{item.desc}</div>}
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: token("brand-primary"),
                  marginTop: 4,
                }}
              >
                Now 20% Off
              </div>
              <button
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
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  10. Big Story — Video Lead                                         */
/* ------------------------------------------------------------------ */

export const BigStoryVideo: Story = {
  name: "Big Story / Video Lead",
  render: () => (
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
          }}
        >
          <img
            src={IMAGES.celebrity}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }}
          />
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
        <h2
          style={{
            fontSize: 28,
            fontWeight: "var(--font-headline-weight, 700)" as any,
            fontFamily: "var(--font-headline, var(--font-brand))",
            lineHeight: 1.2,
            margin: "0 0 12px",
          }}
        >
          Article w/ Lead Video &mdash; Jennifer Lopez and Alex Rodriguez Announce They&apos;ve
          Broken Up
        </h2>
        <p style={{ fontSize: 15, color: "#52525b", lineHeight: 1.6, margin: 0 }}>
          &ldquo;We have realized we are better as friends and look forward to remaining so.&rdquo;
        </p>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  11. Text Block (Rich Text)                                         */
/* ------------------------------------------------------------------ */

export const TextBlock: Story = {
  name: "Text Block / Rich Text",
  render: () => (
    <div style={{ ...sectionStyle, padding: 24 }}>
      <SectionLabel>
        Text Block QA &mdash; <TokenTag name="font-primary" />{" "}
        <TokenTag name="content-primary" /> <TokenTag name="spacing-md" />
      </SectionLabel>

      <div style={{ maxWidth: 680, fontSize: 16, lineHeight: 1.7, color: "#18181b" }}>
        <p>
          <strong>Bold only text</strong>
        </p>
        <p>
          <em>Italics only test</em>
        </p>
        <p>
          <u>Underline only text</u>
        </p>
        <p>
          <strong>
            <em>
              <u>Bold, italics and underline text</u>
            </em>
          </strong>
        </p>

        <p>The numbered bullets are listed as follows:</p>
        <ol style={{ paddingLeft: 24 }}>
          <li>Number 1</li>
          <li>Number 2</li>
          <li>Number 3</li>
        </ol>

        <p>The bullets are listed as follows:</p>
        <ul style={{ paddingLeft: 24 }}>
          <li>Bullet 1</li>
          <li>Bullet 2</li>
          <li>Bullet 3</li>
        </ul>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  12. Site Footer                                                    */
/* ------------------------------------------------------------------ */

export const SiteFooter: Story = {
  name: "Site Footer",
  render: () => (
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
              FRE
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
              {["YouTube", "Facebook", "Instagram", "Pinterest"].map((s) => (
                <span key={s} style={{ opacity: 0.7, cursor: "pointer" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 32, fontSize: 13 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontWeight: 600, marginBottom: 4 }}>Other Hearst Subscriptions</span>
              <span style={{ opacity: 0.7, cursor: "pointer" }}>Subscribe</span>
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
            {["Privacy Notice", "Terms of Use", "Site Map"].map((link) => (
              <span key={link} style={{ cursor: "pointer" }}>
                {link}
              </span>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 10, opacity: 0.4, marginTop: 12 }}>
          &copy;2026 Hearst Magazine Media, Inc. All Rights Reserved.
        </div>
      </footer>
    </div>
  ),
};
