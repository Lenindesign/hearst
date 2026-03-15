import { ThemeProvider } from "@/components/theme-provider";
import { Showcase } from "@/components/showcase";
import { TokenInspector } from "@/components/token-inspector";

export default function Home() {
  return (
    <ThemeProvider>
      <Showcase />
      <TokenInspector />
    </ThemeProvider>
  );
}
