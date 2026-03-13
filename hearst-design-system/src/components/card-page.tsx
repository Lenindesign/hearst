"use client";

import { useTheme } from "./theme-provider";
import {
  ArticleCard,
  ArticleCardImage,
  ArticleCardContent,
  ArticleCardEyebrow,
  ArticleCardTitle,
  ArticleCardDescription,
  ArticleCardMeta,
  ArticleCardMetaDot,
  ArticleCardAuthor,
  ArticleCardFooter,
  ArticleCardMetaItem,
} from "@/components/ui/article-card";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SampleArticle {
  eyebrow: string;
  title: string;
  description: string;
  author: string;
  timestamp: string;
  imageUrl?: string;
}

const sampleArticles: SampleArticle[] = [
  {
    eyebrow: "Automotive",
    title: "The 2026 Electric SUVs That Are Actually Worth Buying",
    description:
      "We tested every new electric SUV on the market to find the ones that deliver on their promises of range, comfort, and value.",
    author: "John Smith",
    timestamp: "Mar 5, 2026",
  },
  {
    eyebrow: "Wellness",
    title: "5 Morning Habits That Changed My Energy Levels Forever",
    description:
      "Small changes to your morning routine can have a dramatic impact on how you feel all day long.",
    author: "Sarah Chen",
    timestamp: "Mar 3, 2026",
  },
  {
    eyebrow: "Home Design",
    title: "The Color Trends Designers Are Betting On for 2026",
    description:
      "From earthy terracottas to soft sage greens, these are the palettes defining the year ahead.",
    author: "Maria Lopez",
    timestamp: "Feb 28, 2026",
  },
];

function VerticalDemo(article: SampleArticle) {
  return (
    <ArticleCard layout="vertical">
      <ArticleCardImage />
      <ArticleCardContent>
        <ArticleCardEyebrow>{article.eyebrow}</ArticleCardEyebrow>
        <ArticleCardTitle>{article.title}</ArticleCardTitle>
        <ArticleCardDescription>{article.description}</ArticleCardDescription>
        <ArticleCardMeta>
          <ArticleCardMetaItem>{article.timestamp}</ArticleCardMetaItem>
          <ArticleCardMetaDot />
          <ArticleCardAuthor>{article.author}</ArticleCardAuthor>
        </ArticleCardMeta>
      </ArticleCardContent>
    </ArticleCard>
  );
}

function HorizontalDemo(article: SampleArticle) {
  return (
    <ArticleCard layout="horizontal">
      <ArticleCardImage />
      <ArticleCardContent>
        <ArticleCardEyebrow>{article.eyebrow}</ArticleCardEyebrow>
        <ArticleCardTitle>{article.title}</ArticleCardTitle>
        <ArticleCardDescription>{article.description}</ArticleCardDescription>
        <ArticleCardMeta>
          <ArticleCardMetaItem>{article.timestamp}</ArticleCardMetaItem>
          <ArticleCardMetaDot />
          <ArticleCardAuthor>{article.author}</ArticleCardAuthor>
        </ArticleCardMeta>
      </ArticleCardContent>
    </ArticleCard>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function AnatomyItem({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shrink-0">
        {number}
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
          {description}
        </p>
      </div>
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="text-xs font-mono bg-muted p-4 rounded-lg overflow-x-auto leading-relaxed">
      {children}
    </pre>
  );
}

const API_SECTIONS = [
  {
    name: "ArticleCard",
    description: "Root container. Sets layout direction and size context.",
    props: [
      { name: "layout", type: '"vertical" | "horizontal"', default: '"vertical"', desc: "Card orientation" },
      { name: "size", type: '"default" | "sm" | "lg"', default: '"default"', desc: "Controls padding and text sizes" },
    ],
  },
  {
    name: "ArticleCardImage",
    description: "Hero image area. Shows a placeholder icon when no src is provided.",
    props: [
      { name: "src", type: "string", default: "—", desc: "Image URL" },
      { name: "alt", type: "string", default: '""', desc: "Alt text for accessibility" },
      { name: "aspectRatio", type: '"16/9" | "4/3" | "1/1" | "3/2"', default: '"16/9"', desc: "Image aspect ratio (vertical only)" },
    ],
  },
  {
    name: "ArticleCardContent",
    description: "Flex column wrapper for text content. Handles padding and gap.",
    props: [],
  },
  {
    name: "ArticleCardEyebrow",
    description: "Category label. Uppercase, tracked, uses brand primary color.",
    props: [],
  },
  {
    name: "ArticleCardTitle",
    description: "Headline. Uses --font-brand for brand-specific typography.",
    props: [],
  },
  {
    name: "ArticleCardDescription",
    description: "Body text. Automatically line-clamped based on layout.",
    props: [],
  },
  {
    name: "ArticleCardMeta",
    description: "Inline metadata row. Pushed to bottom via mt-auto.",
    props: [],
  },
  {
    name: "ArticleCardAuthor",
    description: "Author byline. Semibold foreground color.",
    props: [],
  },
  {
    name: "ArticleCardFooter",
    description: "Optional bottom bar with border-top. For CTAs or actions.",
    props: [],
  },
];

const VERTICAL_CODE = `<ArticleCard layout="vertical">
  <ArticleCardImage src="/photo.jpg" alt="Article hero" />
  <ArticleCardContent>
    <ArticleCardEyebrow>Category</ArticleCardEyebrow>
    <ArticleCardTitle>Your Headline Here</ArticleCardTitle>
    <ArticleCardDescription>
      Supporting description text...
    </ArticleCardDescription>
    <ArticleCardMeta>
      <ArticleCardMetaItem>Mar 8, 2026</ArticleCardMetaItem>
      <ArticleCardMetaDot />
      <ArticleCardAuthor>Jane Doe</ArticleCardAuthor>
    </ArticleCardMeta>
  </ArticleCardContent>
</ArticleCard>`;

const HORIZONTAL_CODE = `<ArticleCard layout="horizontal">
  <ArticleCardImage src="/photo.jpg" />
  <ArticleCardContent>
    <ArticleCardEyebrow>Category</ArticleCardEyebrow>
    <ArticleCardTitle>Your Headline Here</ArticleCardTitle>
    <ArticleCardDescription>
      Supporting description text...
    </ArticleCardDescription>
    <ArticleCardMeta>
      <ArticleCardMetaItem>Mar 8, 2026</ArticleCardMetaItem>
      <ArticleCardMetaDot />
      <ArticleCardAuthor>Jane Doe</ArticleCardAuthor>
    </ArticleCardMeta>
  </ArticleCardContent>
</ArticleCard>`;

const WITH_FOOTER_CODE = `<ArticleCard layout="vertical">
  <ArticleCardImage />
  <ArticleCardContent>
    <ArticleCardEyebrow>Featured</ArticleCardEyebrow>
    <ArticleCardTitle>Article Title</ArticleCardTitle>
    <ArticleCardDescription>
      Description text...
    </ArticleCardDescription>
  </ArticleCardContent>
  <ArticleCardFooter>
    <ArticleCardMeta>
      <ArticleCardMetaItem>Mar 8, 2026</ArticleCardMetaItem>
      <ArticleCardMetaDot />
      <ArticleCardAuthor>Jane Doe</ArticleCardAuthor>
    </ArticleCardMeta>
    <Button size="sm">Read More</Button>
  </ArticleCardFooter>
</ArticleCard>`;

export function CardPage() {
  const { brand } = useTheme();

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      {/* Page Header */}
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-2">
          Components
        </p>
        <h1 className="text-4xl tracking-tight headline">Card</h1>
        <p className="text-base text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          A composable article card built with Tailwind and shadcn patterns.
          Adapts to each Hearst brand through design tokens for color,
          typography, and spacing.
        </p>
      </div>

      <Separator />

      {/* Anatomy */}
      <section className="space-y-6">
        <SectionHeader
          title="Anatomy"
          description="The card is composed of modular sub-components that can be shown or hidden depending on content needs."
        />
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8 items-start">
          <ArticleCard layout="vertical">
            <ArticleCardImage />
            <ArticleCardContent>
              <ArticleCardEyebrow>Category</ArticleCardEyebrow>
              <ArticleCardTitle>Card Title Goes Here</ArticleCardTitle>
              <ArticleCardDescription>
                A brief description of the card content that provides additional
                context for the reader.
              </ArticleCardDescription>
              <ArticleCardMeta>
                <ArticleCardMetaItem>Mar 8, 2026</ArticleCardMetaItem>
                <ArticleCardMetaDot />
                <ArticleCardAuthor>Jane Doe</ArticleCardAuthor>
              </ArticleCardMeta>
            </ArticleCardContent>
          </ArticleCard>
          <div className="space-y-4">
            <AnatomyItem
              number={1}
              title="ArticleCardImage"
              description="Optional hero image with configurable aspect ratio. Shows a placeholder when no src is provided."
            />
            <AnatomyItem
              number={2}
              title="ArticleCardEyebrow"
              description="Category label. Uses brand primary color (text-primary) and uppercase tracking."
            />
            <AnatomyItem
              number={3}
              title="ArticleCardTitle"
              description="Headline. Uses var(--font-brand) for brand-specific typography at bold weight."
            />
            <AnatomyItem
              number={4}
              title="ArticleCardDescription"
              description="Body text. Auto line-clamped: 3 lines vertical, 2 lines horizontal."
            />
            <AnatomyItem
              number={5}
              title="ArticleCardMeta"
              description="Inline metadata row with timestamp, author, and dot separators. Pushed to bottom via mt-auto."
            />
            <AnatomyItem
              number={6}
              title="ArticleCardFooter"
              description="Optional bottom bar with border-top for CTAs or actions."
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Variants */}
      <section className="space-y-6">
        <SectionHeader
          title="Variants"
          description="Two layout variants and three size options."
        />

        <Tabs defaultValue="vertical">
          <TabsList>
            <TabsTrigger value="vertical">Vertical</TabsTrigger>
            <TabsTrigger value="horizontal">Horizontal</TabsTrigger>
            <TabsTrigger value="with-footer">With Footer</TabsTrigger>
          </TabsList>

          <TabsContent value="vertical" className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Default layout. Image stacked above content. Ideal for grid
              layouts and feed views.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sampleArticles.map((a, i) => (
                <VerticalDemo key={i} {...a} />
              ))}
            </div>
            <CodeBlock>{VERTICAL_CODE}</CodeBlock>
          </TabsContent>

          <TabsContent value="horizontal" className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Side-by-side layout. Image beside content. Best for list views and
              featured content.
            </p>
            <div className="space-y-4">
              {sampleArticles.map((a, i) => (
                <HorizontalDemo key={i} {...a} />
              ))}
            </div>
            <CodeBlock>{HORIZONTAL_CODE}</CodeBlock>
          </TabsContent>

          <TabsContent value="with-footer" className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Cards with a footer bar for call-to-action buttons and inline
              metadata.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sampleArticles.map((a, i) => (
                <ArticleCard key={i} layout="vertical">
                  <ArticleCardImage />
                  <ArticleCardContent>
                    <ArticleCardEyebrow>{a.eyebrow}</ArticleCardEyebrow>
                    <ArticleCardTitle>{a.title}</ArticleCardTitle>
                    <ArticleCardDescription>
                      {a.description}
                    </ArticleCardDescription>
                  </ArticleCardContent>
                  <ArticleCardFooter>
                    <ArticleCardMeta>
                      <ArticleCardMetaItem>{a.timestamp}</ArticleCardMetaItem>
                      <ArticleCardMetaDot />
                      <ArticleCardAuthor>{a.author}</ArticleCardAuthor>
                    </ArticleCardMeta>
                    <Button size="sm">Read More</Button>
                  </ArticleCardFooter>
                </ArticleCard>
              ))}
            </div>
            <CodeBlock>{WITH_FOOTER_CODE}</CodeBlock>
          </TabsContent>
        </Tabs>
      </section>

      <Separator />

      {/* Sizes */}
      <section className="space-y-6">
        <SectionHeader
          title="Sizes"
          description="Three size variants control padding, gaps, and text sizes."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {(["sm", "default", "lg"] as const).map((size) => (
            <div key={size} className="space-y-2">
              <Badge variant="outline" className="mb-1">
                size=&quot;{size}&quot;
              </Badge>
              <ArticleCard layout="vertical" size={size}>
                <ArticleCardImage />
                <ArticleCardContent>
                  <ArticleCardEyebrow>Category</ArticleCardEyebrow>
                  <ArticleCardTitle>
                    The 2026 Electric SUVs Worth Buying
                  </ArticleCardTitle>
                  <ArticleCardDescription>
                    We tested every new electric SUV on the market to find the
                    best ones.
                  </ArticleCardDescription>
                  <ArticleCardMeta>
                    <ArticleCardMetaItem>Mar 5, 2026</ArticleCardMetaItem>
                    <ArticleCardMetaDot />
                    <ArticleCardAuthor>John Smith</ArticleCardAuthor>
                  </ArticleCardMeta>
                </ArticleCardContent>
              </ArticleCard>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* API Reference */}
      <section className="space-y-6">
        <SectionHeader
          title="API Reference"
          description="All sub-components accept standard HTML attributes and className overrides."
        />
        <div className="space-y-6">
          {API_SECTIONS.map((section) => (
            <div
              key={section.name}
              className="border rounded-lg overflow-hidden"
            >
              <div className="bg-muted px-4 py-3 flex items-center gap-3">
                <code className="text-sm font-semibold font-mono">
                  {"<"}
                  {section.name}
                  {" />"}
                </code>
                <span className="text-xs text-muted-foreground">
                  {section.description}
                </span>
              </div>
              {section.props.length > 0 && (
                <div>
                  <div className="grid grid-cols-[160px_1fr_100px_1fr] gap-x-4 px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b bg-muted/30">
                    <span>Prop</span>
                    <span>Type</span>
                    <span>Default</span>
                    <span>Description</span>
                  </div>
                  {section.props.map((prop) => (
                    <div
                      key={prop.name}
                      className="grid grid-cols-[160px_1fr_100px_1fr] gap-x-4 px-4 py-2.5 text-xs border-b last:border-0"
                    >
                      <code className="font-mono font-medium text-foreground">
                        {prop.name}
                      </code>
                      <code className="font-mono text-primary">
                        {prop.type}
                      </code>
                      <code className="font-mono text-muted-foreground">
                        {prop.default}
                      </code>
                      <span className="text-muted-foreground">{prop.desc}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Design Tokens */}
      <section className="space-y-6">
        <SectionHeader
          title="Design Tokens"
          description="CSS custom properties consumed by the card component."
        />
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 bg-muted px-4 py-2.5 text-xs font-semibold">
            <span>Token</span>
            <span>Used By</span>
            <span>Current Value ({brand.name})</span>
          </div>
          {[
            {
              token: "--font-brand",
              usedBy: "ArticleCardTitle",
              value: brand.fontDefault,
            },
            {
              token: "--primary",
              usedBy: "ArticleCardEyebrow",
              value: brand.colors["1"] || "—",
            },
            {
              token: "--card / --card-foreground",
              usedBy: "ArticleCard (bg, text)",
              value: "oklch(1 0 0)",
            },
            {
              token: "--muted-foreground",
              usedBy: "Description, Meta",
              value: "oklch(0.556 0 0)",
            },
            {
              token: "--foreground/10",
              usedBy: "Ring border",
              value: "oklch(0.145 0 0 / 10%)",
            },
          ].map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-3 px-4 py-2.5 text-xs border-t"
            >
              <code className="font-mono font-medium">{row.token}</code>
              <span className="text-muted-foreground">{row.usedBy}</span>
              <span className="font-mono text-muted-foreground">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Brand note */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="shrink-0 mt-0.5">
              {brand.name}
            </Badge>
            <div className="text-sm text-muted-foreground leading-relaxed">
              <p>
                Currently previewing with{" "}
                <strong className="text-foreground">{brand.fontDefault}</strong>{" "}
                as the brand font and{" "}
                <span
                  className="font-mono font-semibold"
                  style={{
                    color:
                      brand.colors["1"] || Object.values(brand.colors)[0],
                  }}
                >
                  {brand.colors["1"] || Object.values(brand.colors)[0]}
                </span>{" "}
                as the primary color. Switch brands in the header to see the
                card adapt.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <footer className="text-center text-sm text-muted-foreground py-8">
        Hearst Design System &middot; Components Library &middot; Built with
        shadcn/ui
      </footer>
    </main>
  );
}
