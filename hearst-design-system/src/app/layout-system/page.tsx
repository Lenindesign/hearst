import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/nav-bar";
import { LayoutPage } from "@/components/layout-page";

export default function LayoutSystemRoute() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <NavBar />
        <LayoutPage />
      </div>
    </ThemeProvider>
  );
}
