"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useSyncExternalStore,
  useId,
} from "react";
import { useTheme } from "./theme-provider";
import { BrandSwitcher } from "./brand-switcher";
import { BrandLogo } from "./brand-logo";
import { brandLogos } from "@/lib/logos";
import {
  LOCAL_STORYBOOK_URL,
  PROD_STORYBOOK_URL,
} from "@/lib/storybook-links";
import { ExternalLink, Menu, X } from "@/components/ui/icons";

type NavItem = { label: string; href: string; external?: boolean };

const BASE_MAIN_NAV: NavItem[] = [
  { label: "Style Guide", href: "/" },
  { label: "Architecture", href: "/architecture" },
  { label: "AI in HDS", href: "/ai-in-hds" },
  { label: "Home Page", href: "/home" },
  { label: "Color", href: "/color" },
  { label: "Typography", href: "/typography" },
  { label: "Layout", href: "/layout-system" },
  { label: "Token Mapping", href: "/tokens" },
  { label: "Token Dashboard", href: "/tokens/dashboard" },
  { label: "Components", href: "/components" },
];

function useStorybookHref(): string {
  return useSyncExternalStore(
    () => () => {},
    () => {
      const env = typeof process !== "undefined"
        ? process.env.NEXT_PUBLIC_STORYBOOK_URL
        : undefined;
      if (typeof env === "string" && env.length > 0) return env;
      if (typeof window === "undefined") return PROD_STORYBOOK_URL;
      const { hostname, port } = window.location;
      if (
        port === "6006" ||
        hostname === "localhost" ||
        hostname === "127.0.0.1"
      ) {
        return LOCAL_STORYBOOK_URL;
      }
      return PROD_STORYBOOK_URL;
    },
    () => PROD_STORYBOOK_URL
  );
}

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
  return <Menu className="size-5" aria-hidden />;
}

function CloseIcon() {
  return <X className="size-5" aria-hidden />;
}

function ExternalIcon() {
  return <ExternalLink className="ml-1 inline size-3 opacity-50" aria-hidden />;
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
    <Link
      href={resolvedHref}
      className={baseClass}
      aria-current={isActive ? (href === "/components" ? "location" : "page") : undefined}
    >
      {label}
    </Link>
  );
}

export interface DesignSystemNavBarProps {
  pathname: string;
  storybookHref: string;
}

export function DesignSystemNavBar({
  pathname,
  storybookHref,
}: DesignSystemNavBarProps) {
  const { brand } = useTheme();
  const primary = brand.colors["1"] || Object.values(brand.colors)[0];
  const logo = brandLogos[brand.slug];
  const isComponents = pathname.startsWith("/components");
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuId = useId();
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const mainNav = useMemo<NavItem[]>(
    () => [
      ...BASE_MAIN_NAV,
      { label: "Storybook", href: storybookHref, external: true },
    ],
    [storybookHref]
  );

  useEffect(() => {
    if (!mobileOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMobileOpen(false);
      requestAnimationFrame(() => mobileToggleRef.current?.focus());
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
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
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
            aria-label={`Hearst Design System home, ${brand.name} preview`}
          >
            {logo ? (
              <BrandLogo
                slug={brand.slug}
                className="[&_svg]:h-5 [&_svg]:w-auto shrink-0"
              />
            ) : (
              <div
                className="w-7 h-7 rounded-md shrink-0"
                style={{ backgroundColor: primary || "var(--foreground)" }}
              />
            )}
            <div className="min-w-0 hidden 2xl:block">
              <span className="block text-sm font-semibold leading-none truncate">
                Hearst Design System
              </span>
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{brand.name}</p>
            </div>
          </Link>

          {/* Desktop nav — scrollable, takes all remaining space */}
          <nav
            aria-label="Design system navigation"
            className="hidden md:block flex-1 min-w-0"
          >
            <ScrollableNav>
              {mainNav.map((item) => (
                <NavLink key={item.href} href={item.href} label={item.label} isActive={isActive(item.href)} external={item.external} />
              ))}
            </ScrollableNav>
          </nav>

          {/* Right side: brand switcher (always) + mobile toggle (below md) */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <BrandSwitcher />
            <button
              ref={mobileToggleRef}
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              aria-controls={mobileMenuId}
            >
              {mobileOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </div>
        </div>

        {/* Component sub-nav — scrollable on all sizes */}
        {isComponents && !mobileOpen && (
          <nav aria-label="Component navigation" className="-mb-px pb-2">
            <ScrollableNav>
              {componentNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`px-3 py-1 text-xs rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    pathname === item.href
                      ? "font-medium text-foreground bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </ScrollableNav>
          </nav>
        )}
      </div>

      {/* Mobile / Tablet slide-down drawer */}
      {mobileOpen && (
        <nav
          id={mobileMenuId}
          aria-label="Mobile design system navigation"
          className="md:hidden absolute left-0 right-0 top-[57px] z-50 bg-background border-b shadow-lg max-h-[calc(100dvh-57px)] overflow-y-auto"
        >
          <div className="mx-auto px-4 sm:px-6 py-3 space-y-1">
              {/* Main navigation */}
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-3 pt-1">Navigation</p>
              {mainNav.map((item) => {
                const cls = `flex min-h-11 items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-colors ${
                  isActive(item.href)
                    ? "font-medium text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`;
                if (item.external) {
                  return (
                    <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={cls} onClick={() => setMobileOpen(false)}>
                      {item.label}
                      <ExternalIcon />
                    </a>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href === "/components" ? "/components/card" : item.href}
                    aria-current={isActive(item.href) ? (item.href === "/components" ? "location" : "page") : undefined}
                    className={cls}
                    onClick={() => setMobileOpen(false)}
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
                        onClick={() => setMobileOpen(false)}
                        aria-current={pathname === item.href ? "page" : undefined}
                        className={`flex min-h-11 items-center px-3 py-2 text-sm rounded-md transition-colors ${
                          pathname === item.href
                            ? "font-medium text-foreground bg-primary/10"
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
      )}
    </header>
  );
}

export function NavBar() {
  const pathname = usePathname();
  const storybookHref = useStorybookHref();
  return <DesignSystemNavBar pathname={pathname} storybookHref={storybookHref} />;
}
