import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/nav-bar";
import { ImagePage } from "@/components/image-page";

export default function ImageRoute() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <NavBar />
        <ImagePage />
      </div>
    </ThemeProvider>
  );
}
