import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/nav-bar";
import { FormLabelPage } from "@/components/form-label-page";

export default function FormLabelRoute() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <NavBar />
        <FormLabelPage />
      </div>
    </ThemeProvider>
  );
}
