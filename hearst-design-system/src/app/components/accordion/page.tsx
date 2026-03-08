import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/nav-bar";
import { AccordionPage } from "@/components/accordion-page";

export default function AccordionRoute() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <NavBar />
        <AccordionPage />
      </div>
    </ThemeProvider>
  );
}
