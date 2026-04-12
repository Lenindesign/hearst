"use client";

import { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/nav-bar";
import { TokenInspector } from "@/components/token-inspector";
import {
  HomepageByLayout,
  LayoutSwitcher,
  type LayoutVariant,
} from "@/components/homepage-layouts";

export default function HomePage() {
  const [layout, setLayout] = useState<LayoutVariant>("curator");

  return (
    <ThemeProvider>
      <NavBar />
      <div className="fixed top-[52px] right-4 z-[60]">
        <LayoutSwitcher value={layout} onChange={setLayout} />
      </div>
      <HomepageByLayout layout={layout} />
      <TokenInspector />
    </ThemeProvider>
  );
}
