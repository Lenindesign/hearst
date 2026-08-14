"use client";

import React from "react";
import { BrandSourceIcon } from "@/components/hearst-plus/brand-source-icon";
import { ReaderAvatar } from "@/components/reader-account-ui";
import { useReaderAccount } from "@/components/reader-account";
import { Button } from "@/components/ui/button";
import { LinkComponent } from "@/components/ui/link";
import { PageContainer } from "@/components/ui/grid";
import {
  getHearstBrandRoute,
  getHearstBrandSection,
  getHearstDestinationRoute,
  getHearstSectionBrands,
  type HearstBrandSection,
  type HearstDestinationMode,
} from "@/lib/hearst-routes";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

type HearstDestinationSection = {
  mode: HearstDestinationMode | "local-news";
  label: string;
  href: string;
  hasBrandMenu?: boolean;
};

export const hearstDestinationSections = [
  { mode: "all", label: "All", href: getHearstDestinationRoute("all"), hasBrandMenu: true },
  { mode: "lifestyle", label: "Lifestyle", href: getHearstDestinationRoute("lifestyle"), hasBrandMenu: true },
  { mode: "autos", label: "Autos", href: getHearstDestinationRoute("autos"), hasBrandMenu: true },
  { mode: "flux", label: "Fashion & Luxury", href: getHearstDestinationRoute("flux"), hasBrandMenu: true },
  { mode: "ew", label: "Enthusiast & Wellness", href: getHearstDestinationRoute("ew"), hasBrandMenu: true },
  { mode: "local-news", label: "Local News", href: "/hearst-plus/local-news/" },
] satisfies HearstDestinationSection[];

const brandMenuSections = [
  { mode: "lifestyle", label: "Lifestyle" },
  { mode: "autos", label: "Autos" },
  { mode: "flux", label: "Fashion & Luxury" },
  { mode: "ew", label: "Enthusiast & Wellness" },
] satisfies { mode: HearstBrandSection; label: string }[];

const utilityLinks = [
  { label: "Shop", href: "/hearst-plus/shopping/" },
  { label: "Newsletter", href: "https://www.hearst.co.uk/newsletter" },
] as const;

export interface UtilityBarProps {
  selectedBrand?: { name: string; slug: string } | null;
  onCreateAccount?: () => void;
  onOpenProfile?: () => void;
  onLocalNewsSelect?: () => void;
  activeDestinationOverride?: string;
  darkMode?: boolean;
}

export function UtilityBar({
  selectedBrand,
  onCreateAccount,
  onOpenProfile,
  onLocalNewsSelect,
  activeDestinationOverride,
  darkMode = false,
}: UtilityBarProps) {
  const { brand } = useTheme();
  const { account } = useReaderAccount();
  const utilityBarRef = React.useRef<HTMLDivElement>(null);
  const destinationNavRef = React.useRef<HTMLElement>(null);
  const [openDestinationMenu, setOpenDestinationMenu] = React.useState<HearstDestinationMode | null>(null);
  const selectedDestination = selectedBrand
    ? getHearstBrandSection(selectedBrand.slug)
    : null;
  const activeDestination = selectedDestination === "autos"
    ? "Autos"
    : selectedDestination === "flux"
      ? "Fashion & Luxury"
      : selectedDestination === "ew"
        ? "Enthusiast & Wellness"
        : selectedDestination === "lifestyle"
          ? "Lifestyle"
          : brand.slug === "hearst-all"
            ? "All"
            : brand.slug === "hearst-plus"
              ? "Autos"
              : brand.slug === "hearst-flux"
                ? "Fashion & Luxury"
                : brand.slug === "hearst-ew"
                  ? "Enthusiast & Wellness"
                  : "Lifestyle";
  const activeDestinationLabel = activeDestinationOverride ?? activeDestination;
  const openSection = hearstDestinationSections.find((section) => section.mode === openDestinationMenu);
  const visibleBrandSections = openDestinationMenu === "all"
    ? brandMenuSections
    : brandMenuSections.filter((section) => section.mode === openDestinationMenu);

  React.useEffect(() => {
    if (!openDestinationMenu) return;

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (event.target instanceof Node && !utilityBarRef.current?.contains(event.target)) {
        setOpenDestinationMenu(null);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenDestinationMenu(null);
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openDestinationMenu]);

  React.useEffect(() => {
    destinationNavRef.current?.scrollTo({ left: 0 });
  }, [activeDestinationLabel]);

  return (
    <div
      ref={utilityBarRef}
      onMouseLeave={() => setOpenDestinationMenu(null)}
      className={cn(
        "sticky top-0 z-50 h-8 text-[length:var(--text-token-4xs)] font-semibold sm:h-8",
        darkMode
          ? "border-b border-white/10 bg-[var(--component-navigation-utility-background-knockout)] text-[var(--component-navigation-utility-content-knockout)]"
          : "bg-primary text-primary-foreground"
      )}
    >
      <PageContainer className="grid h-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-3">
        <nav className="hidden items-center gap-3 sm:flex" aria-label="Utility navigation">
          {utilityLinks.map((link) => (
            <LinkComponent
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              variant="neutral"
              underline={false}
              size="xs"
              className={cn(
                "font-semibold",
                darkMode
                  ? "text-[var(--component-navigation-utility-content-knockout)] hover:text-[var(--component-navigation-utility-content-accent)]"
                  : "text-primary-foreground hover:text-primary-foreground"
              )}
            >
              {link.label}
            </LinkComponent>
          ))}
        </nav>
        <nav
          ref={destinationNavRef}
          className="flex min-w-0 items-center justify-start overflow-x-auto [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden"
          aria-label="Hearst destination sections"
        >
          <div className={cn("flex min-w-max items-center gap-1 rounded-full px-0.5 sm:p-0.5", darkMode ? "bg-white/[0.06]" : "bg-black/10")}>
            {hearstDestinationSections.map((section) => {
              const isActive = section.label === activeDestinationLabel;
              const isOpen = section.mode === openDestinationMenu;
              const menuMode = section.hasBrandMenu ? section.mode as HearstDestinationMode : null;

              return (
                <LinkComponent
                  key={section.label}
                  href={section.href}
                  variant="neutral"
                  underline={false}
                  size="xs"
                  aria-haspopup={menuMode ? "menu" : undefined}
                  aria-expanded={menuMode ? isOpen : undefined}
                  aria-controls={menuMode && isOpen ? "hearst-brand-menu" : undefined}
                  aria-current={isActive ? "page" : undefined}
                  onClick={section.mode === "local-news" && onLocalNewsSelect ? (event) => {
                    event.preventDefault();
                    setOpenDestinationMenu(null);
                    onLocalNewsSelect();
                  } : undefined}
                  onMouseEnter={() => setOpenDestinationMenu(menuMode)}
                  onFocus={() => setOpenDestinationMenu(menuMode)}
                  className={cn(
                    "inline-flex min-h-7 min-w-7 cursor-pointer items-center justify-center rounded-full px-2 py-1 text-[11px] font-bold leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:min-h-6 sm:min-w-0 sm:text-xs",
                    isActive
                      ? darkMode
                        ? "bg-[var(--component-navigation-utility-content-accent)] text-[var(--component-navigation-utility-background-knockout)] hover:text-[var(--component-navigation-utility-background-knockout)]"
                        : "bg-white text-black hover:text-black"
                      : darkMode
                        ? "text-[var(--component-navigation-utility-content-knockout)] opacity-85 hover:bg-white/10 hover:text-white hover:opacity-100"
                        : "text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
                  )}
                >
                  {section.label}
                </LinkComponent>
              );
            })}
          </div>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="secondary"
            size="xs"
            className={cn(
              "min-h-7 min-w-7 shrink-0 text-[length:var(--text-token-4xs)] font-semibold leading-none sm:min-h-6 sm:min-w-0",
              account
                ? cn(
                    "gap-1.5 rounded-full border-0 bg-transparent px-1.5 shadow-none hover:bg-white/10 sm:pr-2",
                    darkMode ? "text-[var(--component-navigation-utility-content-knockout)] hover:text-white" : "text-primary-foreground hover:text-primary-foreground"
                  )
                : darkMode
                  ? "bg-[var(--component-navigation-utility-content-accent)] px-2 text-[var(--component-navigation-utility-background-knockout)] hover:bg-[var(--component-navigation-utility-content-accent-hover)] hover:text-[var(--component-navigation-utility-background-knockout)] sm:px-3"
                  : "bg-white px-2 text-black hover:bg-white/90 hover:text-black sm:px-3"
            )}
            aria-label={account ? "Open your local demo profile" : "Sign in or sign up"}
            onClick={account ? onOpenProfile : onCreateAccount}
          >
            {account ? <ReaderAvatar account={account} size="sm" className="!size-4 ring-1 ring-white/50 [&_[data-slot=avatar-fallback]]:text-[8px]" /> : null}
            <span className={account ? "hidden text-xs sm:inline" : "text-[10px] sm:text-xs"}>{account ? account.firstName : "Sign in / Sign up"}</span>
          </Button>
        </div>
      </PageContainer>
      {openSection ? (
        <div
          onMouseLeave={() => setOpenDestinationMenu(null)}
          className={cn(
            "absolute left-1/2 top-full w-[calc(100%-1.5rem)] -translate-x-1/2 pt-2 sm:w-[calc(100%-3rem)]",
            openDestinationMenu === "all" ? "max-w-6xl" : "max-w-sm"
          )}
        >
          <div
            id="hearst-brand-menu"
            role="menu"
            aria-label={`${openSection.label} brands`}
            className={cn(
              "max-h-[min(calc(100dvh-3rem),680px)] w-full overscroll-contain overflow-y-auto rounded-xl border p-4 shadow-2xl sm:max-h-[min(calc(100dvh-3.5rem),720px)] sm:p-5",
              darkMode
                ? "border-white/15 bg-[var(--component-navigation-utility-megamenu-background-knockout)] text-[var(--component-navigation-utility-content-knockout)]"
                : "border-border bg-background text-foreground"
            )}
          >
            <div className={cn("mb-4 border-b pb-3", darkMode ? "border-white/15" : "border-border")}>
              <p className="text-sm font-bold">
                {openDestinationMenu === "all" ? "Browse brands by destination" : `${openSection.label} brands`}
              </p>
            </div>
            <div className={cn("grid gap-5", openDestinationMenu === "all" && "sm:grid-cols-2 lg:grid-cols-4")}>
              {visibleBrandSections.map((section) => (
                <section key={section.mode} aria-labelledby={`hearst-brand-menu-${section.mode}`}>
                  <div className="mb-2">
                    <p id={`hearst-brand-menu-${section.mode}`} className={cn("text-[11px] font-bold uppercase tracking-[0.12em]", darkMode ? "text-[var(--component-navigation-utility-content-accent)]" : "text-primary")}>
                      {section.label}
                    </p>
                  </div>
                  <div className="grid gap-1">
                    {getHearstSectionBrands(section.mode).map((menuBrand) => {
                      const isSelectedBrand = selectedBrand?.slug === menuBrand.brandSlug;

                      return (
                        <LinkComponent
                          key={menuBrand.brandSlug}
                          href={getHearstBrandRoute(menuBrand.brandSlug)}
                          variant="neutral"
                          underline={false}
                          size="sm"
                          role="menuitem"
                          aria-current={isSelectedBrand ? "page" : undefined}
                          onClick={() => setOpenDestinationMenu(null)}
                          className={cn(
                            "min-h-8 w-full justify-between rounded-lg px-3 py-1.5 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                            darkMode
                              ? "text-[var(--component-navigation-utility-content-knockout)] hover:bg-white/10 hover:text-white"
                              : "text-foreground hover:bg-muted hover:text-foreground",
                            isSelectedBrand && (
                              darkMode
                                ? "bg-white/[0.08]"
                                : "bg-primary/10 hover:bg-primary/15"
                            )
                          )}
                        >
                          <span className="flex min-w-0 items-center gap-2.5">
                            <BrandSourceIcon
                              brand={menuBrand.brand}
                              brandSlug={menuBrand.brandSlug}
                              className="size-6 rounded-md border-black/10 bg-white"
                            />
                            <span className="truncate">{menuBrand.brand}</span>
                          </span>
                          {isSelectedBrand ? <span className="text-[10px] uppercase tracking-wide">Current</span> : null}
                        </LinkComponent>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
