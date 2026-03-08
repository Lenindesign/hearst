import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/nav-bar";
import { ButtonPage } from "@/components/button-page";

export default function ButtonRoute() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <NavBar />
        <ButtonPage />
      </div>
    </ThemeProvider>
  );
}
