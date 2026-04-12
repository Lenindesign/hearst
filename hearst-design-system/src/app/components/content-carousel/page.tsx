import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/nav-bar";
import { ContentCarousel } from "@/components/content-carousel";

const sampleCards = [
  { title: "The Future of Electric Vehicles", image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=510&h=682&fit=crop" },
  { title: "Best Road Trips for 2026", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=510&h=682&fit=crop" },
  { title: "SUVs That Redefine Luxury", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=510&h=682&fit=crop" },
  { title: "Track Day: What to Know", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=510&h=682&fit=crop" },
  { title: "The Art of Restoration", image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=510&h=682&fit=crop" },
  { title: "Hypercars of Tomorrow", image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=510&h=682&fit=crop" },
  { title: "Off-Road Adventures", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=510&h=682&fit=crop" },
];

export default function ContentCarouselRoute() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="mx-auto max-w-6xl px-14 py-12 space-y-16">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Content Carousel</h1>
            <p className="text-muted-foreground text-sm">
              Horizontal scrolling card carousel with navigation buttons. Ported from Pencil spec <code>carousel.pen</code> node <code>C2n6G</code>.
            </p>
          </div>

          <section className="space-y-6">
            <h2 className="text-lg font-semibold">With Images</h2>
            <ContentCarousel
              headline="Editor's Picks"
              cards={sampleCards}
              showIndicators
            />
          </section>

          <section className="space-y-6">
            <h2 className="text-lg font-semibold">Placeholder Cards (No Images)</h2>
            <ContentCarousel
              headline="Trending Now"
              cards={[
                { title: "Card title for reusable card" },
                { title: "Card title for reusable card" },
                { title: "Card title for reusable card" },
                { title: "Card title for reusable card" },
                { title: "Card title for reusable card" },
              ]}
            />
          </section>
        </div>
      </div>
    </ThemeProvider>
  );
}
