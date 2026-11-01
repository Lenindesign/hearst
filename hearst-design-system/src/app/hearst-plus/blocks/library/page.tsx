import Link from "next/link";

const blocks = [
  { name: "Featured + Four", description: "One full-width lead card followed by four cards in a single row.", layout: "hero-four" },
  { name: "Four-Card Row", description: "Four equal cards aligned in one row beneath a section heading.", layout: "four" },
  { name: "Feature + Sidebar", description: "A large feature beside four stacked horizontal cards.", layout: "feature-sidebar" },
  { name: "Hero + Three Horizontal", description: "One featured card followed by three horizontal cards.", layout: "hero-three" },
  { name: "Three-Column Feature Row", description: "A left rail, central feature column, and right rail.", layout: "three-column" },
  { name: "Featured Video + Four", description: "One full-width video followed by four video cards in one row.", layout: "video-four" },
  { name: "Four-Card Grid", description: "A responsive two-by-two grid that expands to four columns.", layout: "four" },
  { name: "Horizontal Story List", description: "Stories arranged as stacked, image-led horizontal cards.", layout: "horizontal" },
];

function LayoutSample({ layout }: { layout: string }) {
  const block = "rounded-[3px] border border-primary/40 bg-primary/10";
  if (layout === "hero-four") return <div className="space-y-1.5"><div className={`${block} h-8 w-full`} /><div className="grid grid-cols-4 gap-1.5">{Array.from({ length: 4 }, (_, index) => <div key={index} className={`${block} h-7`} />)}</div></div>;
  if (layout === "feature-sidebar") return <div className="grid grid-cols-[1.8fr_1fr] gap-1.5"><div className={`${block} h-20`} /><div className="grid grid-rows-4 gap-1.5">{Array.from({ length: 4 }, (_, index) => <div key={index} className={`${block} min-h-0`} />)}</div></div>;
  if (layout === "hero-three") return <div className="space-y-1.5"><div className={`${block} h-12`} /><div className="space-y-1">{Array.from({ length: 3 }, (_, index) => <div key={index} className={`${block} h-5`} />)}</div></div>;
  if (layout === "three-column") return <div className="grid grid-cols-[1fr_2fr_1fr] gap-1.5"><div className={`${block} h-16`} /><div className={`${block} h-16`} /><div className={`${block} h-16`} /></div>;
  if (layout === "horizontal") return <div className="space-y-1.5">{Array.from({ length: 3 }, (_, index) => <div key={index} className={`${block} h-6`} />)}</div>;
  return <div className="grid grid-cols-4 gap-1.5">{Array.from({ length: 4 }, (_, index) => <div key={index} className={`${block} h-14`} />)}</div>;
}

export default function BlocksLibraryPage() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-12 sm:px-8 sm:py-16 lg:px-12">
      <Link href="/hearst-plus/blocks/" className="inline-flex min-h-11 items-center text-sm font-bold text-primary hover:underline">← Blocks layout</Link>
      <header className="mt-8 border-b-2 border-primary pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Hearst+</p>
        <h1 className="headline mt-3 text-4xl font-bold sm:text-5xl">Blocks Library</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">Reusable block names describe layout patterns. Content, vertical, and brand can change within each pattern.</p>
      </header>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:gap-6">
        {blocks.map((block, index) => (
          <li key={block.name} className="rounded-[8px] border border-border bg-card p-6 sm:p-7">
            <LayoutSample layout={block.layout} />
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-primary">Pattern {String(index + 1).padStart(2, "0")}</p>
            <h2 className="headline mt-2 text-xl font-bold">{block.name}</h2>
            <p className="mt-3 max-w-prose text-sm leading-6 text-muted-foreground">{block.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
