import { ThemeProvider } from "@/components/theme-provider";
import { TokensPage } from "@/components/tokens-page";

export default function Tokens() {
  return (
    <ThemeProvider>
      <TokensPage />
    </ThemeProvider>
  );
}
