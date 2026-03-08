import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/nav-bar";
import { TypographyPage } from "@/components/typography-page";

export default function TypographyRoute() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <NavBar />
        <TypographyPage />
      </div>
    </ThemeProvider>
  );
}
