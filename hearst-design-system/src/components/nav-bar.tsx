"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./theme-provider";
import { BrandSwitcher } from "./brand-switcher";
import { BrandLogo } from "./brand-logo";
import { brandLogos } from "@/lib/logos";

const mainNav = [
  { label: "Style Guide", href: "/" },
  { label: "Color", href: "/color" },
  { label: "Typography", href: "/typography" },
  { label: "Layout", href: "/layout-system" },
  { label: "Token Mapping", href: "/tokens" },
  { label: "Components", href: "/components" },
];

const componentNav = [
  { label: "Card", href: "/components/card" },
  { label: "Button", href: "/components/button" },
  { label: "Badge", href: "/components/badge" },
  { label: "Accordion", href: "/components/accordion" },
  { label: "Carousel", href: "/components/carousel" },
  { label: "Chip", href: "/components/chip" },
  { label: "Divider", href: "/components/divider" },
  { label: "Form Label", href: "/components/form-label" },
  { label: "Image", href: "/components/image" },
  { label: "Media", href: "/components/media" },
  { label: "Input", href: "/components/input" },
  { label: "Link", href: "/components/link" },
  { label: "Pagination", href: "/components/pagination" },
];

export function NavBar() {
  const pathname = usePathname();
  const { brand } = useTheme();
  const primary = brand.colors["1"] || Object.values(brand.colors)[0];
  const logo = brandLogos[brand.slug];
  const isComponents = pathname.startsWith("/components");

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {logo ? (
              <BrandLogo
                slug={brand.slug}
                className="[&_svg]:h-5 [&_svg]:w-auto"
              />
            ) : (
              <div
                className="w-7 h-7 rounded-md"
                style={{ backgroundColor: primary || "#000" }}
              />
            )}
            <div>
              <h1 className="text-sm font-semibold leading-none">
                Hearst Design System
              </h1>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {brand.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <nav className="flex items-center gap-1 mr-4">
              {mainNav.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href === "/components" ? "/components/card" : item.href}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                      isActive
                        ? "font-medium text-foreground bg-muted"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <BrandSwitcher />
          </div>
        </div>

        {isComponents && (
          <div className="-mb-px flex items-center gap-1 pb-2">
            {componentNav.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    isActive
                      ? "font-medium text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
