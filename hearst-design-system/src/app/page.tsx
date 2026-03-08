import { ThemeProvider } from "@/components/theme-provider";
import { Showcase } from "@/components/showcase";

export default function Home() {
  return (
    <ThemeProvider>
      <Showcase />
    </ThemeProvider>
  );
}
