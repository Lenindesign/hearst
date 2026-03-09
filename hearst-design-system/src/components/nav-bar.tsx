"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "./theme-provider";
import { BrandSwitcher } from "./brand-switcher";
import { BrandLogo } from "./brand-logo";
import { brandLogos } from "@/lib/logos";

const mainNav = [
  { label: "Style Guide", href: "/" },
  { label: "Home Page", href: "/home" },
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

function ScrollableNav({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  return (
    <div className={`relative ${className}`}>
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background/95 to-transparent z-10 pointer-events-none" />
      )}
      <div
        ref={scrollRef}
        className="flex items-center gap-1 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background/95 to-transparent z-10 pointer-events-none" />
      )}
    </div>
  );
}

export function NavBar() {
  const pathname = usePathname();
  const { brand } = useTheme();
  const primary = brand.colors["1"] || Object.values(brand.colors)[0];
  const logo = brandLogos[brand.slug];
  const isComponents = pathname.startsWith("/components");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="h-14 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {logo ? (
              <BrandLogo
                slug={brand.slug}
                className="[&_svg]:h-5 [&_svg]:w-auto shrink-0"
              />
            ) : (
              <div
                className="w-7 h-7 rounded-md shrink-0"
                style={{ backgroundColor: primary || "#000" }}
              />
            )}
            <div className="min-w-0">
              <h1 className="text-sm font-semibold leading-none truncate">
                Hearst Design System
              </h1>
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                {brand.name}
              </p>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            <nav className="flex items-center gap-1 mr-4">
              {mainNav.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={
                      item.href === "/components"
                        ? "/components/card"
                        : item.href
                    }
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors whitespace-nowrap ${
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

          {/* Mobile controls */}
          <div className="flex lg:hidden items-center gap-2">
            <BrandSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <nav className="lg:hidden pb-3 border-t pt-3 space-y-1">
            {mainNav.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={
                    item.href === "/components"
                      ? "/components/card"
                      : item.href
                  }
                  className={`block px-3 py-2 text-sm rounded-md transition-colors ${
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
        )}

        {/* Component sub-nav — scrollable carousel on all sizes */}
        {isComponents && (
          <ScrollableNav className="-mb-px pb-2">
            {componentNav.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1 text-xs rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? "font-medium text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </ScrollableNav>
        )}
      </div>
    </header>
  );
}
