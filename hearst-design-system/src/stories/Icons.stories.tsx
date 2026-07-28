import React, { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import {
  Bell,
  Bookmark,
  BookOpenText,
  CalendarBlank,
  Camera,
  Car,
  Check,
  CheckCircle2,
  ChefHat,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  CirclePlus,
  CircleUserRound,
  CircleX,
  Clock,
  Compass,
  DollarSign,
  DotsThree,
  Download,
  ExternalLink,
  EyeOff,
  Flame,
  FolderPlus,
  Headphones,
  Heart,
  ImageIcon,
  Info,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Newspaper,
  Pause,
  Play,
  Plus,
  Search,
  Send,
  Settings,
  Share2,
  Shield,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sun,
  Tag,
  ThumbsUp,
  Trash2,
  TrendingUp,
  TriangleAlert,
  User,
  Volume2,
  VolumeX,
  Wrench,
  X,
  Zap,
  type PhosphorIcon,
} from "@/components/ui/icons";

type IconEntry = {
  name: string;
  icon: PhosphorIcon;
};

type IconGroup = {
  label: string;
  description: string;
  icons: IconEntry[];
};

const iconGroups: IconGroup[] = [
  {
    label: "Navigation",
    description: "Movement, menus, and destinations",
    icons: [
      { name: "ChevronLeft", icon: ChevronLeft },
      { name: "ChevronRight", icon: ChevronRight },
      { name: "ChevronDown", icon: ChevronDown },
      { name: "Menu", icon: Menu },
      { name: "X", icon: X },
      { name: "ExternalLink", icon: ExternalLink },
      { name: "Compass", icon: Compass },
      { name: "MapPin", icon: MapPin },
    ],
  },
  {
    label: "Actions",
    description: "Common reader and account actions",
    icons: [
      { name: "Search", icon: Search },
      { name: "Bookmark", icon: Bookmark },
      { name: "Heart", icon: Heart },
      { name: "Share2", icon: Share2 },
      { name: "Download", icon: Download },
      { name: "Plus", icon: Plus },
      { name: "CirclePlus", icon: CirclePlus },
      { name: "Send", icon: Send },
      { name: "Trash2", icon: Trash2 },
      { name: "Settings", icon: Settings },
      { name: "SlidersHorizontal", icon: SlidersHorizontal },
      { name: "LogOut", icon: LogOut },
    ],
  },
  {
    label: "Editorial",
    description: "Content types and topical signals",
    icons: [
      { name: "BookOpenText", icon: BookOpenText },
      { name: "Newspaper", icon: Newspaper },
      { name: "CalendarBlank", icon: CalendarBlank },
      { name: "Camera", icon: Camera },
      { name: "Car", icon: Car },
      { name: "ChefHat", icon: ChefHat },
      { name: "Headphones", icon: Headphones },
      { name: "ShoppingBag", icon: ShoppingBag },
      { name: "Tag", icon: Tag },
      { name: "Flame", icon: Flame },
      { name: "Sparkles", icon: Sparkles },
      { name: "TrendingUp", icon: TrendingUp },
    ],
  },
  {
    label: "Media",
    description: "Playback and media states",
    icons: [
      { name: "Play", icon: Play },
      { name: "Pause", icon: Pause },
      { name: "Volume2", icon: Volume2 },
      { name: "VolumeX", icon: VolumeX },
      { name: "ImageIcon", icon: ImageIcon },
    ],
  },
  {
    label: "Status and feedback",
    description: "System messages, validation, and permissions",
    icons: [
      { name: "Bell", icon: Bell },
      { name: "Check", icon: Check },
      { name: "CheckCircle2", icon: CheckCircle2 },
      { name: "CircleX", icon: CircleX },
      { name: "Info", icon: Info },
      { name: "TriangleAlert", icon: TriangleAlert },
      { name: "Shield", icon: Shield },
      { name: "EyeOff", icon: EyeOff },
      { name: "Lock", icon: Lock },
      { name: "Circle", icon: Circle },
    ],
  },
  {
    label: "People and utility",
    description: "Profiles, communication, and supporting utilities",
    icons: [
      { name: "User", icon: User },
      { name: "CircleUserRound", icon: CircleUserRound },
      { name: "MessageCircle", icon: MessageCircle },
      { name: "Mail", icon: Mail },
      { name: "Clock", icon: Clock },
      { name: "DollarSign", icon: DollarSign },
      { name: "FolderPlus", icon: FolderPlus },
      { name: "ThumbsUp", icon: ThumbsUp },
      { name: "Star", icon: Star },
      { name: "Wrench", icon: Wrench },
      { name: "DotsThree", icon: DotsThree },
      { name: "Sun", icon: Sun },
      { name: "Moon", icon: Moon },
      { name: "Zap", icon: Zap },
    ],
  },
];

const weights = ["thin", "light", "regular", "bold", "fill", "duotone"] as const;

function CodeSample({ children }: { children: string }) {
  return (
    <pre className="max-w-full overflow-x-auto border border-border bg-muted p-4 text-xs leading-6 text-foreground">
      <code>{children}</code>
    </pre>
  );
}

function IconInventory() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredGroups = useMemo(
    () =>
      iconGroups
        .map((group) => ({
          ...group,
          icons: group.icons.filter((icon) =>
            icon.name.toLowerCase().includes(normalizedQuery)
          ),
        }))
        .filter((group) => group.icons.length > 0),
    [normalizedQuery]
  );
  const resultCount = filteredGroups.reduce((sum, group) => sum + group.icons.length, 0);

  return (
    <div className="w-full max-w-[960px] min-w-0 space-y-14">
      <header className="max-w-[720px] space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Foundation
        </p>
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Icons</h1>
          <p className="max-w-[65ch] text-base leading-7 text-muted-foreground">
            Phosphor Icons is the official icon set for Hearst+. Use the curated
            system wrapper so icon names, server rendering, and future library
            changes stay consistent across products.
          </p>
        </div>
        <dl className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
          {[
            ["Library", "@phosphor-icons/react"],
            ["Installed", "2.1.10"],
            ["Curated icons", "61"],
          ].map(([term, detail]) => (
            <div key={term} className="bg-background p-4">
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {term}
              </dt>
              <dd className="mt-1 font-mono text-sm font-semibold text-foreground">
                {detail}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <section aria-labelledby="icon-contract" className="space-y-5">
        <div className="max-w-[720px] space-y-2">
          <h2 id="icon-contract" className="text-2xl font-bold tracking-tight">
            System contract
          </h2>
          <p className="leading-7 text-muted-foreground">
            Import named icons from the shared wrapper. Do not import the full
            package, draw one-off SVGs, or use emoji as interface icons.
          </p>
        </div>
        <CodeSample>{`import { Bookmark, Share2 } from "@/components/ui/icons";

<Bookmark className="size-5" aria-hidden />
<Share2 className="size-5" aria-hidden />`}</CodeSample>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="border-l-4 border-emerald-600 bg-muted p-5">
            <h3 className="font-semibold">Use the wrapper</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              It exposes the reviewed application vocabulary and uses Phosphor&apos;s
              SSR entry points for Next.js compatibility.
            </p>
          </div>
          <div className="border-l-4 border-amber-600 bg-muted p-5">
            <h3 className="font-semibold">Request additions deliberately</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              If the needed metaphor is missing, add one wrapper export and document
              its intended meaning before using it in product code.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="icon-inventory" className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h2 id="icon-inventory" className="text-2xl font-bold tracking-tight">
              Supported inventory
            </h2>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {resultCount} {resultCount === 1 ? "icon" : "icons"} shown
            </p>
          </div>
          <div className="w-full sm:max-w-xs">
            <label htmlFor="icon-search" className="mb-2 block text-sm font-medium">
              Find an icon
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                id="icon-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search names"
                className="h-11 w-full border border-input bg-background pl-10 pr-3 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {filteredGroups.length > 0 ? (
          <div className="space-y-8">
            {filteredGroups.map((group) => (
              <section key={group.label} aria-labelledby={`group-${group.label.replaceAll(" ", "-")}`}>
                <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3
                    id={`group-${group.label.replaceAll(" ", "-")}`}
                    className="text-base font-semibold"
                  >
                    {group.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                </div>
                <div className="grid grid-cols-2 border-l border-t border-border sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {group.icons.map(({ name, icon: Icon }) => (
                    <div
                      key={name}
                      className="flex min-h-28 min-w-0 flex-col justify-between border-b border-r border-border bg-background p-4"
                    >
                      <Icon className="size-6 text-foreground" aria-hidden />
                      <code className="mt-5 break-words text-xs text-muted-foreground">
                        {name}
                      </code>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border px-5 py-12 text-center">
            <Search className="mx-auto size-6 text-muted-foreground" aria-hidden />
            <h3 className="mt-3 font-semibold">No matching icons</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a broader name or request a reviewed addition to the wrapper.
            </p>
          </div>
        )}
      </section>

      <section aria-labelledby="icon-weight" className="space-y-5">
        <div className="max-w-[720px] space-y-2">
          <h2 id="icon-weight" className="text-2xl font-bold tracking-tight">
            Weight communicates state
          </h2>
          <p className="leading-7 text-muted-foreground">
            Regular is the interface default. Use fill for a selected or active
            state, bold only when a stronger control needs emphasis, and duotone
            sparingly for illustrative moments.
          </p>
        </div>
        <div className="grid grid-cols-2 border-l border-t border-border sm:grid-cols-3 md:grid-cols-6">
          {weights.map((weight) => (
            <div
              key={weight}
              className="flex min-h-32 flex-col items-center justify-center gap-4 border-b border-r border-border p-4"
            >
              <Bookmark className="size-8 text-primary" weight={weight} aria-hidden />
              <code className="text-xs text-muted-foreground">{weight}</code>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="icon-size" className="space-y-5">
        <div className="max-w-[720px] space-y-2">
          <h2 id="icon-size" className="text-2xl font-bold tracking-tight">
            Size the symbol and target separately
          </h2>
          <p className="leading-7 text-muted-foreground">
            Use 16px beside compact labels, 20px in standard controls, and 24px
            for prominent actions. Interactive icons still need a minimum 44px
            touch target on phone layouts.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-8 border-y border-border py-6">
          {[
            ["16px", "size-4", "Inline"],
            ["20px", "size-5", "Control"],
            ["24px", "size-6", "Prominent"],
            ["32px", "size-8", "Illustrative"],
          ].map(([size, className, usage]) => (
            <div key={size} className="flex flex-col items-center gap-3">
              <Heart className={`${className} text-foreground`} aria-hidden />
              <div className="text-center">
                <p className="font-mono text-xs">{size}</p>
                <p className="text-xs text-muted-foreground">{usage}</p>
              </div>
            </div>
          ))}
          <div className="ml-auto flex flex-col items-center gap-3">
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center border border-border bg-background text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Save story"
            >
              <Bookmark className="size-5" aria-hidden />
            </button>
            <p className="text-center text-xs text-muted-foreground">44px target</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="icon-color" className="space-y-5">
        <div className="max-w-[720px] space-y-2">
          <h2 id="icon-color" className="text-2xl font-bold tracking-tight">
            Color follows semantic tokens
          </h2>
          <p className="leading-7 text-muted-foreground">
            Icons inherit <code>currentColor</code>. Apply semantic text utilities
            so they respond to the selected Hearst brand and component state.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            ["Default", "text-foreground"],
            ["Muted", "text-muted-foreground"],
            ["Brand", "text-primary"],
            ["Destructive", "text-destructive"],
          ].map(([label, className]) => (
            <div
              key={label}
              className="flex min-w-36 items-center gap-3 border border-border px-4 py-3"
            >
              <Star className={`size-5 ${className}`} weight="fill" aria-hidden />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="icon-accessibility" className="space-y-5">
        <div className="max-w-[720px] space-y-2">
          <h2 id="icon-accessibility" className="text-2xl font-bold tracking-tight">
            Accessibility
          </h2>
          <p className="leading-7 text-muted-foreground">
            Hide decorative icons from assistive technology. Give an icon-only
            control its accessible name on the button, where the action and state
            belong.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="min-w-0 space-y-3">
            <h3 className="font-semibold">Icon with visible text</h3>
            <CodeSample>{`<button type="button">
  <Share2 aria-hidden />
  Share
</button>`}</CodeSample>
          </div>
          <div className="min-w-0 space-y-3">
            <h3 className="font-semibold">Icon-only control</h3>
            <CodeSample>{`<button type="button" aria-label="Save story">
  <Bookmark aria-hidden />
</button>`}</CodeSample>
          </div>
        </div>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: "Hearst Plus/Foundation/Icons",
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: () => <IconInventory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Icons" })).toBeVisible();
    const search = canvas.getByRole("searchbox", { name: "Find an icon" });
    await userEvent.type(search, "Bookmark");
    await expect(canvas.getByText("1 icon shown")).toBeVisible();
    await expect(canvas.getByText("Bookmark", { selector: "code" })).toBeVisible();
    await userEvent.clear(search);
  },
};
