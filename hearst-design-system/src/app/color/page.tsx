import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/nav-bar";
import { ColorPage } from "@/components/color-page";

export default function ColorRoute() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <NavBar />
        <ColorPage />
      </div>
    </ThemeProvider>
  );
}
