import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/nav-bar";
import { BadgePage } from "@/components/badge-page";

export default function BadgeRoute() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <NavBar />
        <BadgePage />
      </div>
    </ThemeProvider>
  );
}
