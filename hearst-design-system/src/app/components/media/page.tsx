import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/nav-bar";
import { MediaPage } from "@/components/media-page";

export default function MediaRoute() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <NavBar />
        <MediaPage />
      </div>
    </ThemeProvider>
  );
}
