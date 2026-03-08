"use client";

import { useTheme } from "./theme-provider";
import { brandLogos } from "@/lib/logos";
import { BrandLogo } from "./brand-logo";
import { NavBar } from "./nav-bar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

function ColorSwatch({ name, hex }: { name: string; hex: string }) {
  const luminance = (() => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  })();
  const textColor = luminance > 0.5 ? "#000" : "#fff";
  const isWhite = hex.toLowerCase() === "#ffffff";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="w-16 h-16 rounded-lg shadow-sm flex items-center justify-center text-[10px] font-mono"
        style={{
          backgroundColor: hex,
          color: textColor,
          border: isWhite ? "1px solid #e5e5e5" : "none",
        }}
      >
        {hex}
      </div>
      <span className="text-xs text-muted-foreground font-medium">{name}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold tracking-tight mb-4">{children}</h2>
  );
}

function ColorsSection() {
  const { brand } = useTheme();
  const sortedColors = Object.entries(brand.colors).sort((a, b) => {
    const aNum = parseInt(a[0]);
    const bNum = parseInt(b[0]);
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
    return a[0].localeCompare(b[0]);
  });

  const meaningfulColors = sortedColors.filter(
    ([, hex]) => hex.toLowerCase() !== "#ffffff"
  );
  const displayColors =
    meaningfulColors.length > 0 ? meaningfulColors : sortedColors.slice(0, 6);

  return (
    <section>
      <SectionTitle>Brand Colors</SectionTitle>
      <div className="flex flex-wrap gap-4">
        {displayColors.map(([name, hex]) => (
          <ColorSwatch key={name} name={`brand-${name}`} hex={hex} />
        ))}
      </div>
    </section>
  );
}

function TypographySection() {
  const { brand } = useTheme();

  return (
    <section>
      <SectionTitle>Typography</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardDescription>Primary</CardDescription>
            <CardTitle
              className="text-2xl"
              style={{
                fontFamily: `"${brand.fontDefault}", system-ui`,
                fontWeight: 800,
              }}
            >
              {brand.fontDefault}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className="text-muted-foreground"
              style={{
                fontFamily: `"${brand.fontDefault}", system-ui`,
                fontWeight: 800,
              }}
            >
              The quick brown fox jumps over the lazy dog. 0123456789
            </p>
            <div className="mt-4 space-y-1">
              {[
                { weight: 400, label: "Regular" },
                { weight: 600, label: "Semibold" },
                { weight: 700, label: "Bold" },
                { weight: 800, label: "Extra Bold" },
              ].map(({ weight, label }) => (
                <p
                  key={weight}
                  className="text-sm"
                  style={{
                    fontFamily: `"${brand.fontDefault}", system-ui`,
                    fontWeight: weight,
                  }}
                >
                  {label} ({weight}) — Aa Bb Cc Dd Ee Ff Gg
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Secondary</CardDescription>
            <CardTitle
              className="text-2xl"
              style={{
                fontFamily: `"${brand.fontSecondary}", Georgia, serif`,
                fontWeight: 600,
              }}
            >
              {brand.fontSecondary}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className="text-muted-foreground"
              style={{
                fontFamily: `"${brand.fontSecondary}", Georgia, serif`,
                fontWeight: 600,
              }}
            >
              The quick brown fox jumps over the lazy dog. 0123456789
            </p>
            <div className="mt-4 space-y-1">
              {[
                { weight: 400, label: "Regular" },
                { weight: 600, label: "Semibold" },
                { weight: 700, label: "Bold" },
              ].map(({ weight, label }) => (
                <p
                  key={weight}
                  className="text-sm"
                  style={{
                    fontFamily: `"${brand.fontSecondary}", Georgia, serif`,
                    fontWeight: weight,
                  }}
                >
                  {label} ({weight}) — Aa Bb Cc Dd Ee Ff Gg
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function ButtonsSection() {
  return (
    <section>
      <SectionTitle>Buttons</SectionTitle>
      <div className="flex flex-wrap gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap gap-3 mt-4">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button disabled>Disabled</Button>
      </div>
    </section>
  );
}

function BadgesSection() {
  return (
    <section>
      <SectionTitle>Badges</SectionTitle>
      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    </section>
  );
}

function CardsSection() {
  const { brand } = useTheme();
  const primary = brand.colors["1"] || Object.values(brand.colors)[0];

  return (
    <section>
      <SectionTitle>Cards</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Article Card</CardTitle>
            <CardDescription>Published 2 hours ago</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              A compelling story that captures the essence of the brand
              experience and editorial voice.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Badge variant="secondary">Featured</Badge>
            <Button variant="ghost" size="sm">
              Read more
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div
              className="w-full h-32 rounded-md mb-3"
              style={{ backgroundColor: primary || "#000" }}
            />
            <CardTitle>Visual Card</CardTitle>
            <CardDescription>With brand color header</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Showcasing the primary brand color as a visual element within the
              card layout.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stats Card</CardTitle>
            <CardDescription>Monthly overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pageviews</span>
              <span className="font-semibold">1.2M</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Subscribers</span>
              <span className="font-semibold">48.5K</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Engagement</span>
              <span className="font-semibold">4.8%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function FormSection() {
  return (
    <section>
      <SectionTitle>Form Elements</SectionTitle>
      <Card>
        <CardHeader>
          <CardTitle>Newsletter Signup</CardTitle>
          <CardDescription>
            Subscribe to get the latest stories delivered to your inbox.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" placeholder="Jane" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" placeholder="Doe" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="jane@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Tell us what you're interested in..." />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="marketing" />
            <Label htmlFor="marketing">Receive marketing emails</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Subscribe</Button>
        </CardFooter>
      </Card>
    </section>
  );
}

function AlertsSection() {
  return (
    <section>
      <SectionTitle>Alerts</SectionTitle>
      <div className="space-y-3">
        <Alert>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You can add components to your app using the CLI.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Your session has expired. Please log in again.
          </AlertDescription>
        </Alert>
      </div>
    </section>
  );
}

function TabsSection() {
  return (
    <section>
      <SectionTitle>Tabs & Toggle Groups</SectionTitle>
      <div className="space-y-6">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  Overview content showing key metrics and brand performance
                  indicators.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  Detailed analytics data with engagement metrics and audience
                  insights.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  Generated reports for stakeholder review and editorial
                  planning.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div>
          <p className="text-sm font-medium mb-2">Toggle Group</p>
          <ToggleGroup defaultValue={["day"]}>
            <ToggleGroupItem value="day">Day</ToggleGroupItem>
            <ToggleGroupItem value="week">Week</ToggleGroupItem>
            <ToggleGroupItem value="month">Month</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </section>
  );
}

function TokensSection() {
  const { brand } = useTheme();

  return (
    <section>
      <SectionTitle>CSS Custom Properties</SectionTitle>
      <Card>
        <CardContent className="pt-6">
          <pre className="text-xs font-mono bg-muted p-4 rounded-lg overflow-x-auto">
            {`:root {\n`}
            {`  /* ${brand.name} Theme */\n`}
            {`  --brand-primary: ${brand.colors["1"] || Object.values(brand.colors)[0] || "#000"};\n`}
            {Object.entries(brand.colors)
              .filter(([, hex]) => hex.toLowerCase() !== "#ffffff")
              .map(([k, v]) => `  --brand-${k}: ${v};\n`)
              .join("")}
            {`  --font-default: "${brand.fontDefault}";\n`}
            {`  --font-secondary: "${brand.fontSecondary}";\n`}
            {`}`}
          </pre>
        </CardContent>
      </Card>
    </section>
  );
}

export function Showcase() {
  const { brand } = useTheme();
  const primary = brand.colors["1"] || Object.values(brand.colors)[0];
  const logo = brandLogos[brand.slug];

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        <div className="flex items-center gap-6">
          {logo && (
            <BrandLogo slug={brand.slug} className="[&_svg]:h-10 [&_svg]:w-auto [&_svg]:max-w-[240px]" />
          )}
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{brand.name}</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Primary: <strong>{brand.fontDefault}</strong> · Secondary:{" "}
              <strong>{brand.fontSecondary}</strong>
            </p>
          </div>
        </div>

        <ColorsSection />
        <Separator />
        <TypographySection />
        <Separator />
        <ButtonsSection />
        <Separator />
        <BadgesSection />
        <Separator />
        <CardsSection />
        <Separator />
        <FormSection />
        <Separator />
        <AlertsSection />
        <Separator />
        <TabsSection />
        <Separator />
        <TokensSection />

        <footer className="text-center text-sm text-muted-foreground py-8">
          Hearst Design System · 29 brand themes · Built with shadcn/ui
        </footer>
      </main>
    </div>
  );
}
