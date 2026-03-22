"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "./theme-provider";
import { BrandSwitcher } from "./brand-switcher";
import { BrandLogo } from "./brand-logo";
import { brandLogos } from "@/lib/logos";

const STORYBOOK_URL = "https://hearst-ds-storybook.netlify.app";

const mainNav: { label: string; href: string; external?: boolean }[] = [
  { label: "Style Guide", href: "/" },
  { label: "Home Page", href: "/home" },
  { label: "Color", href: "/color" },
  { label: "Typography", href: "/typography" },
  { label: "Layout", href: "/layout-system" },
  { label: "Token Mapping", href: "/tokens" },
  { label: "Components", href: "/components" },
  { label: "Storybook", href: STORYBOOK_URL, external: true },
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

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline ml-1 opacity-50">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" x2="21" y1="14" y2="3" />
    </svg>
  );
}

function NavLink({
  href,
  label,
  isActive,
  external,
  className = "",
}: {
  href: string;
  label: string;
  isActive: boolean;
  external?: boolean;
  className?: string;
}) {
  const baseClass = `px-3 py-1.5 text-sm rounded-md transition-colors whitespace-nowrap shrink-0 ${
    isActive
      ? "font-medium text-foreground bg-muted"
      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
  } ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={baseClass}>
        {label}
        <ExternalIcon />
      </a>
    );
  }

  const resolvedHref = href === "/components" ? "/components/card" : href;
  return (
    <Link href={resolvedHref} className={baseClass}>
      {label}
    </Link>
  );
}

export function NavBar() {
  const pathname = usePathname();
  const { brand } = useTheme();
  const primary = brand.colors["1"] || Object.values(brand.colors)[0];
  const logo = brandLogos[brand.slug];
  const isComponents = pathname.startsWith("/components");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [mobileOpen]);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="h-14 flex items-center gap-3 overflow-hidden">
          {/* Logo + title — fixed width left anchor */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            {logo ? (
              <BrandLogo slug={brand.slug} className="[&_svg]:h-5 [&_svg]:w-auto shrink-0" />
            ) : (
              <div className="w-7 h-7 rounded-md shrink-0" style={{ backgroundColor: primary || "#000" }} />
            )}
            <div className="min-w-0 hidden lg:block">
              <h1 className="text-sm font-semibold leading-none truncate">Hearst Design System</h1>
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{brand.name}</p>
            </div>
          </Link>

          {/* Desktop nav — scrollable, takes all remaining space */}
          <ScrollableNav className="hidden md:block flex-1 min-w-0">
            {mainNav.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} isActive={isActive(item.href)} external={item.external} />
            ))}
          </ScrollableNav>

          {/* Right side: brand switcher (always) + mobile toggle (below md) */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <BrandSwitcher />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </div>
        </div>

        {/* Component sub-nav — scrollable on all sizes */}
        {isComponents && !mobileOpen && (
          <ScrollableNav className="-mb-px pb-2">
            {componentNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1 text-xs rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  pathname === item.href
                    ? "font-medium text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </ScrollableNav>
        )}
      </div>

      {/* Mobile / Tablet slide-down drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 top-[57px] bg-black/20 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <nav className="md:hidden absolute left-0 right-0 top-[57px] z-50 bg-background border-b shadow-lg max-h-[calc(100dvh-57px)] overflow-y-auto">
            <div className="mx-auto px-4 sm:px-6 py-3 space-y-1">
              {/* Main navigation */}
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-3 pt-1">Navigation</p>
              {mainNav.map((item) => {
                const cls = `flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-colors ${
                  isActive(item.href)
                    ? "font-medium text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`;
                if (item.external) {
                  return (
                    <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
                      {item.label}
                      <ExternalIcon />
                    </a>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href === "/components" ? "/components/card" : item.href}
                    className={cls}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Component sub-nav in mobile */}
              {isComponents && (
                <>
                  <div className="h-px bg-border my-2" />
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-3 pt-1">Components</p>
                  <div className="grid grid-cols-2 gap-1">
                    {componentNav.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`px-3 py-2 text-sm rounded-md transition-colors ${
                          pathname === item.href
                            ? "font-medium text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
