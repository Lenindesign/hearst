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

export const hearstDestinationSections = [
  { mode: "all", label: "All", href: getHearstDestinationRoute("all") },
  { mode: "lifestyle", label: "Lifestyle", href: getHearstDestinationRoute("lifestyle") },
  { mode: "autos", label: "Autos", href: getHearstDestinationRoute("autos") },
  { mode: "flux", label: "Fashion & Luxury", href: getHearstDestinationRoute("flux") },
  { mode: "ew", label: "Enthusiast & Wellness", href: getHearstDestinationRoute("ew") },
] satisfies { mode: HearstDestinationMode; label: string; href: string }[];

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
  darkMode?: boolean;
}

export function UtilityBar({
  selectedBrand,
  onCreateAccount,
  onOpenProfile,
  darkMode = false,
}: UtilityBarProps) {
  const { brand } = useTheme();
  const { account } = useReaderAccount();
  const utilityBarRef = React.useRef<HTMLDivElement>(null);
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

  return (
    <div
      ref={utilityBarRef}
      onMouseLeave={() => setOpenDestinationMenu(null)}
      className={cn(
        "sticky top-0 z-50 h-11 text-[length:var(--text-token-4xs)] font-semibold sm:h-8",
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
          className="flex min-w-0 items-center justify-start overflow-x-auto [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden"
          aria-label="Hearst destination sections"
        >
          <div className={cn("flex min-w-max items-center gap-1 rounded-full px-0.5 sm:p-0.5", darkMode ? "bg-white/[0.06]" : "bg-black/10")}>
            {hearstDestinationSections.map((section) => {
              const isActive = section.label === activeDestination;
              const isOpen = section.mode === openDestinationMenu;

              return (
              <LinkComponent
                key={section.label}
                href={section.href}
                variant="neutral"
                underline={false}
                size="xs"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-controls={isOpen ? "hearst-brand-menu" : undefined}
                aria-current={isActive ? "page" : undefined}
                onMouseEnter={() => setOpenDestinationMenu(section.mode)}
                onFocus={() => setOpenDestinationMenu(section.mode)}
                className={cn(
                  "inline-flex min-h-11 min-w-11 cursor-pointer items-center rounded-full px-2 py-1 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:min-h-6 sm:min-w-0",
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
              "min-h-11 min-w-11 shrink-0 text-[length:var(--text-token-4xs)] font-semibold sm:min-h-6 sm:min-w-0",
              account
                ? cn(
                    "gap-1.5 bg-transparent px-0.5 hover:bg-white/10 sm:pr-2",
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
            openDestinationMenu === "all" ? "max-w-5xl" : "max-w-xs"
          )}
        >
          <div
            id="hearst-brand-menu"
            role="menu"
            aria-label={`${openSection.label} brands`}
            className={cn(
              "max-h-[min(70dvh,520px)] w-full overflow-y-auto rounded-xl border p-4 shadow-2xl sm:p-5",
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
                            "min-h-9 w-full justify-between rounded-lg px-3 py-2 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
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
