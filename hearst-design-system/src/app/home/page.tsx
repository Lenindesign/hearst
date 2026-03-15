import { ThemeProvider } from "@/components/theme-provider";
import { BrandHomePage } from "@/components/home-page";
import { TokenInspector } from "@/components/token-inspector";

export default function HomePage() {
  return (
    <ThemeProvider>
      <BrandHomePage />
      <TokenInspector />
    </ThemeProvider>
  );
}
