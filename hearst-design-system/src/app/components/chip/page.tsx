import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/nav-bar";
import { ChipPage } from "@/components/chip-page";

export default function ChipRoute() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <NavBar />
        <ChipPage />
      </div>
    </ThemeProvider>
  );
}
