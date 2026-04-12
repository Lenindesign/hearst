import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/nav-bar";
import { SpecialOffers } from "@/components/special-offers";

export default function SpecialOffersRoute() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="mx-auto max-w-4xl px-6 py-12 space-y-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Special Offers</h1>
            <p className="text-muted-foreground text-sm">
              Promotional offer bar for automotive and commerce brands.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Default</h2>
            <SpecialOffers
              offers={[
                { label: "$3,000 cash off", expires: "4/1/2026" },
                { label: "2.9% through 60 months", expires: "4/1/2026" },
                { label: "$369 /mo | 36 months", expires: "4/1/2026" },
              ]}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Single Offer</h2>
            <SpecialOffers
              offers={[
                { label: "0% APR for 72 months", expires: "5/31/2026" },
              ]}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">No Expiration</h2>
            <SpecialOffers
              title="Limited Time Deals"
              offers={[
                { label: "Free scheduled maintenance" },
                { label: "$500 loyalty bonus" },
              ]}
            />
          </section>
        </div>
      </div>
    </ThemeProvider>
  );
}
