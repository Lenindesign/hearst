import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/nav-bar";
import { CarouselPage } from "@/components/carousel-page";

export default function CarouselRoute() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <NavBar />
        <CarouselPage />
      </div>
    </ThemeProvider>
  );
}
