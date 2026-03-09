import { ThemeProvider } from "@/components/theme-provider";
import { BrandHomePage } from "@/components/home-page";

export default function HomePage() {
  return (
    <ThemeProvider>
      <BrandHomePage />
    </ThemeProvider>
  );
}
