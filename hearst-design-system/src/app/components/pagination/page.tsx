import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/nav-bar";
import { PaginationPage } from "@/components/pagination-page";

export default function PaginationRoute() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <NavBar />
        <PaginationPage />
      </div>
    </ThemeProvider>
  );
}
