import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/nav-bar";
import { InputPage } from "@/components/input-page";

export default function InputRoute() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <NavBar />
        <InputPage />
      </div>
    </ThemeProvider>
  );
}
