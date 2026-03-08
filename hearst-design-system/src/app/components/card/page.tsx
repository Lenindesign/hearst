import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/nav-bar";
import { CardPage } from "@/components/card-page";

export default function CardRoute() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <NavBar />
        <CardPage />
      </div>
    </ThemeProvider>
  );
}
