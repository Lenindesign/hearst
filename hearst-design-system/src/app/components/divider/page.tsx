import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/nav-bar";
import { DividerPage } from "@/components/divider-page";

export default function DividerRoute() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <NavBar />
        <DividerPage />
      </div>
    </ThemeProvider>
  );
}
