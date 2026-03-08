import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/nav-bar";
import { LinkPage } from "@/components/link-page";

export default function LinkRoute() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <NavBar />
        <LinkPage />
      </div>
    </ThemeProvider>
  );
}
