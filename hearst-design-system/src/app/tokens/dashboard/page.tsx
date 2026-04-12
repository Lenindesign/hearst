import { ThemeProvider } from "@/components/theme-provider";
import { TokenDashboard } from "@/components/token-dashboard";

export default function Dashboard() {
  return (
    <ThemeProvider>
      <TokenDashboard />
    </ThemeProvider>
  );
}
