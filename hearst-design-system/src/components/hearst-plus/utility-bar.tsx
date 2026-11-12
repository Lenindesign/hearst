"use client";

import React from "react";
import { BrandSourceIcon } from "@/components/hearst-plus/brand-source-icon";
import { LocalWeather } from "@/components/hearst-plus/local-weather";
import { ReaderAvatar } from "@/components/reader-account-ui";
import { useReaderAccount } from "@/components/reader-account";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "@/components/ui/icons";
import { LinkComponent } from "@/components/ui/link";
import { PageContainer } from "@/components/ui/grid";
import { entertainmentWebsiteFeedConfigs } from "@/lib/hearst-entertainment-story-feeds";
import {
  hearstInternationalCountryNames,
  hearstInternationalFeedCountries,
  hearstInternationalFeeds,
  getHearstInternationalFeedFaviconUrl,
} from "@/lib/hearst-international-feeds";
import { hearstNewspaperFeeds, hearstNewspaperPublications, newspaperFeedUrlTbd } from "@/lib/hearst-newspaper-feed-framework";
import { feedUrlTbd, hearstTVFeeds, hearstTVStations } from "@/lib/hearst-tv-feed-framework";
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
  mode: UtilityDestinationMode;
  label: string;
  href: string;
  hasBrandMenu?: boolean;
};

type UtilityDestinationMode = HearstDestinationMode | "local-news" | "entertainment-culture" | "international";

export const hearstDestinationSections = [
  { mode: "all", label: "All", href: getHearstDestinationRoute("all"), hasBrandMenu: true },
  { mode: "lifestyle", label: "Lifestyle", href: getHearstDestinationRoute("lifestyle"), hasBrandMenu: true },
  { mode: "autos", label: "Autos", href: getHearstDestinationRoute("autos"), hasBrandMenu: true },
  { mode: "flux", label: "Fashion & Luxury", href: getHearstDestinationRoute("flux"), hasBrandMenu: true },
  { mode: "ew", label: "Enthusiast & Wellness", href: getHearstDestinationRoute("ew"), hasBrandMenu: true },
  { mode: "local-news", label: "Local News", href: "/hearst-plus/local-news/", hasBrandMenu: true },
  { mode: "entertainment-culture", label: "A&E Family", href: "/hearst-plus/entertainment/", hasBrandMenu: true },
  { mode: "international", label: "International", href: "/hearst-plus/international/", hasBrandMenu: true },
] satisfies HearstDestinationSection[];

function capAlignedLabelClassName(label: string) {
  // Cap-to-baseline trimming would cut off lowercase descenders and the
  // uppercase J/Q tails, so opt in only when the label fits that box.
  return /[gjpqyJQ]/.test(label) ? undefined : "hds-cap-aligned-label";
}

const brandMenuSections = [
  { mode: "lifestyle", label: "Lifestyle" },
  { mode: "autos", label: "Autos" },
  { mode: "flux", label: "Fashion & Luxury" },
  { mode: "ew", label: "Enthusiast & Wellness" },
] satisfies { mode: HearstBrandSection; label: string }[];

const brandSectionDescriptions: Record<HearstBrandSection, string> = {
  lifestyle: "Food, home, wellness and more",
  autos: "Reviews, racing and the open road",
  flux: "Fashion, culture and design",
  ew: "Fitness, health, science and gear",
};

const localNewsOptions = [
  { label: "TV Stations", href: "/hearst-plus/local-news/#tv-stations", description: "Hearst Television feeds" },
  { label: "Newspapers", href: "/hearst-plus/local-news/newspapers/", description: "Local newspaper feeds" },
] as const;

const localNewsNewspaperLogos = hearstNewspaperPublications.filter(
  (publication): publication is typeof publication & { logo: string } => Boolean(publication.logo),
);

const connectedNewspaperPublicationIds = new Set(
  hearstNewspaperFeeds
    .filter((feed) => feed.enabled && feed.status === "connected" && feed.feedUrl !== newspaperFeedUrlTbd)
    .map((feed) => feed.publicationId),
);

const tvStationFaviconFolders: Partial<Record<string, string>> = {
  "khbs-khog": "khbs",
};

const localNewsTVStationFavicons = hearstTVStations
  .filter((station) => Boolean(station.logo))
  .map((station) => ({
    ...station,
    favicon: `https://htv-prod-media.s3.amazonaws.com/htv_default_image/${tvStationFaviconFolders[station.id] ?? station.id}/favicon.png`,
  }));

const connectedTVStationIds = new Set(
  hearstTVFeeds
    .filter((feed) => feed.enabled && feed.status === "connected" && feed.feedUrl !== feedUrlTbd)
    .map((feed) => feed.stationId),
);

const internationalFeedsByCountry = hearstInternationalFeedCountries.reduce<Record<string, typeof hearstInternationalFeeds>>(
  (groups, country) => {
    groups[country] = hearstInternationalFeeds.filter((feed) => feed.country === country);
    return groups;
  },
  {},
);

const internationalFeedCountryColumns = [
  ["UK"],
  ["ES"],
  ["IT", "NL"],
  ["CN", "TW", "JP"],
] as const;

export interface UtilityBarProps {
  selectedBrand?: { name: string; slug: string } | null;
  onCreateAccount?: () => void;
  onOpenProfile?: () => void;
  onLocalNewsSelect?: () => void;
  activeDestinationOverride?: string;
  darkMode?: boolean;
  /** Hide the cross-destination switcher (All/Lifestyle/Autos/…) — used by single-brand destinations. */
  hideDestinationNav?: boolean;
  /** The page's banner runs up behind the bar: transparent at the top, solid once the page scrolls. */
  overBanner?: boolean;
}

export function UtilityBar({
  selectedBrand,
  onCreateAccount,
  onOpenProfile,
  activeDestinationOverride,
  darkMode: darkModeProp = false,
  hideDestinationNav = false,
  overBanner = false,
}: UtilityBarProps) {
  const { brand, colorMode } = useTheme();
  // Videos and the Flux destination masthead use a knockout utility bar so the strip
  // matches the dark masthead instead of inheriting Flux's blue primary color.
  const darkMode = darkModeProp || colorMode === "dark" || (brand.slug === "hearst-flux" && !selectedBrand);
  const { account } = useReaderAccount();
  const utilityBarRef = React.useRef<HTMLDivElement>(null);
  const destinationNavRef = React.useRef<HTMLDivElement>(null);
  const weatherControlRef = React.useRef<HTMLDivElement>(null);
  const accountControlRef = React.useRef<HTMLDivElement>(null);
  const [openDestinationMenu, setOpenDestinationMenu] = React.useState<UtilityDestinationMode | null>(null);
  const [brandMenuPosition, setBrandMenuPosition] = React.useState({ left: 12, width: 384 });
  const [menuSlideDirection, setMenuSlideDirection] = React.useState<"left" | "right">("right");
  const menuTriggerRef = React.useRef<HTMLElement | null>(null);
  const brandMenuRef = React.useRef<HTMLDivElement>(null);
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
  // Only the Hearst+ home (All) sits on the navy bar, under its navy banner; other pages keep their primary color.
  const navyBar = activeDestinationLabel === "All";
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    if (!overBanner) return;
    const update = () => setScrolled(window.scrollY > 0);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [overBanner]);
  const transparent = overBanner && !scrolled;
  const openSection = hearstDestinationSections.find((section) => section.mode === openDestinationMenu);
  const allDestinationSection = hearstDestinationSections[0];
  const allDestinationIsActive = allDestinationSection.label === activeDestinationLabel;
  const allDestinationIsOpen = allDestinationSection.mode === openDestinationMenu;
  const visibleBrandSections = openDestinationMenu === "all"
    ? brandMenuSections
    : brandMenuSections.filter((section) => section.mode === openDestinationMenu);
  const isLocalNewsMenu = openDestinationMenu === "local-news";
  const isEntertainmentCultureMenu = openDestinationMenu === "entertainment-culture";
  const isLifestyleMenu = openDestinationMenu === "lifestyle";
  const isInternationalMenu = openDestinationMenu === "international";
  const isFourColumnBrandMenu =
    openDestinationMenu === "autos" ||
    openDestinationMenu === "flux" ||
    openDestinationMenu === "ew";
  const isConceptMenu = openDestinationMenu === "all" || isLifestyleMenu || isInternationalMenu;
  // The utility strip may use a dark treatment for a brand masthead (for
  // example Flux), but dropdown surfaces follow the reader's actual theme.
  const menuDarkMode = colorMode === "dark";

  const updateBrandMenuPosition = React.useCallback(() => {
    const barBounds = utilityBarRef.current?.getBoundingClientRect();
    const weatherBounds = weatherControlRef.current?.getBoundingClientRect();
    const accountBounds = accountControlRef.current?.getBoundingClientRect();
    if (!barBounds || !weatherBounds || !accountBounds) return;
    const left = Math.max(0, weatherBounds.left - barBounds.left);
    const right = Math.max(left, accountBounds.right - barBounds.left);
    setBrandMenuPosition({ left, width: right - left });
  }, []);

  const closeWhenPointerLeavesMenu = (event: React.MouseEvent) => {
    const nextTarget = event.relatedTarget;
    const remainsInNavigation = nextTarget instanceof Node && (
      menuTriggerRef.current?.contains(nextTarget) ||
      brandMenuRef.current?.contains(nextTarget)
    );
    if (!remainsInNavigation) {
      menuTriggerRef.current = null;
      setOpenDestinationMenu(null);
    }
  };

  const openDestination = (
    mode: UtilityDestinationMode | null,
    trigger: HTMLElement,
  ) => {
    const previousModeIndex = hearstDestinationSections.findIndex((section) => section.mode === openDestinationMenu);
    const nextModeIndex = hearstDestinationSections.findIndex((section) => section.mode === mode);
    if (previousModeIndex >= 0 && nextModeIndex >= 0 && previousModeIndex !== nextModeIndex) {
      setMenuSlideDirection(nextModeIndex > previousModeIndex ? "right" : "left");
    }
    setOpenDestinationMenu(mode);
    if (!mode) {
      menuTriggerRef.current = null;
      return;
    }
    menuTriggerRef.current = trigger;

    updateBrandMenuPosition();
  };

  React.useEffect(() => {
    if (!openDestinationMenu) return;
    updateBrandMenuPosition();
    window.addEventListener("resize", updateBrandMenuPosition);
    return () => window.removeEventListener("resize", updateBrandMenuPosition);
  }, [openDestinationMenu, updateBrandMenuPosition]);

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
      onMouseLeave={closeWhenPointerLeavesMenu}
      onBlurCapture={(event) => {
        if (!(event.relatedTarget instanceof Node) || !utilityBarRef.current?.contains(event.relatedTarget)) {
          setOpenDestinationMenu(null);
        }
      }}
      className={cn(
        "sticky top-0 z-50 h-8 text-[length:var(--text-token-4xs)] font-semibold transition-colors duration-200 sm:h-8",
        transparent
          ? "bg-transparent text-primary-foreground"
          : darkMode
          ? "bg-[var(--component-navigation-utility-background-knockout)] text-[var(--component-navigation-utility-content-knockout)]"
          : navyBar
            ? "bg-[var(--hp-utility-bar)] text-primary-foreground"
            : "bg-primary text-primary-foreground"
      )}
    >
      <PageContainer className="grid h-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 sm:gap-3 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div ref={weatherControlRef} className="w-[4.5rem] shrink-0 lg:w-48">
          <LocalWeather
            hideCityOnCompact
            className="w-full min-w-0 shrink-0"
            buttonClassName={cn(
              "!min-h-6 !rounded-none !border-0 !bg-transparent !px-0 !py-0 !text-[10px] !font-normal !leading-none shadow-none hover:!bg-transparent sm:!text-xs",
              darkMode
                ? "!text-[var(--component-navigation-utility-content-knockout)] hover:!text-white [&_span]:!text-[var(--component-navigation-utility-content-knockout)]"
                : "!text-primary-foreground hover:!text-primary-foreground [&_span]:!text-primary-foreground",
            )}
          />
        </div>
        {!hideDestinationNav && (
        <nav
          onMouseLeave={closeWhenPointerLeavesMenu}
          className={cn(
            "relative flex h-full w-fit min-w-0 max-w-full items-stretch justify-self-center",
          )}
          aria-label="Hearst destination sections"
        >
          <LinkComponent
            href={allDestinationSection.href}
            variant="neutral"
            underline={false}
            size="xs"
            aria-haspopup="menu"
            aria-expanded={allDestinationIsOpen}
            aria-controls={allDestinationIsOpen ? "hearst-brand-menu" : undefined}
            aria-label={`${allDestinationSection.label} section menu${allDestinationIsActive ? ", current destination" : ""}`}
            aria-current={allDestinationIsActive ? "page" : undefined}
            onClick={() => setOpenDestinationMenu(null)}
            onMouseEnter={(event) => openDestination(allDestinationSection.mode, event.currentTarget)}
            onMouseLeave={closeWhenPointerLeavesMenu}
            onFocus={(event) => openDestination(allDestinationSection.mode, event.currentTarget)}
            className={cn(
              "z-10 inline-flex h-full min-h-8 min-w-7 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-none border-0 px-2 py-0 text-[11px] font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:min-w-0 sm:text-[11px]",
              allDestinationIsActive || allDestinationIsOpen
                ? "bg-white text-black hover:bg-white hover:text-black"
                : darkMode
                  ? "text-[var(--component-navigation-utility-content-knockout)] opacity-85 hover:bg-white hover:text-black hover:opacity-100"
                  : "text-primary-foreground hover:bg-white hover:text-black",
              allDestinationIsActive && !allDestinationIsOpen && openDestinationMenu !== null && cn("bg-transparent hover:bg-transparent", darkMode ? "text-[var(--component-navigation-utility-content-knockout)] hover:text-[var(--component-navigation-utility-content-knockout)]" : "text-primary-foreground hover:text-primary-foreground")
            )}
          >
            <span className={cn("uppercase", capAlignedLabelClassName(allDestinationSection.label))}>{allDestinationSection.label}</span>
            <ChevronDown className={cn("size-3 transition-transform", allDestinationIsOpen && "rotate-180")} aria-hidden="true" />
          </LinkComponent>
          <div
            ref={destinationNavRef}
            className="h-full min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex h-full min-w-max items-center gap-1 px-0.5">
            {hearstDestinationSections.slice(1).map((section) => {
              const isActive = section.label === activeDestinationLabel;
              const isOpen = section.mode === openDestinationMenu;
              const menuMode = section.hasBrandMenu ? section.mode : null;

              return (
                <React.Fragment key={section.label}>
                  {section.mode === "local-news" ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mx-1 h-4 w-px shrink-0",
                        darkMode ? "bg-white/30" : "bg-primary-foreground/45",
                      )}
                    />
                  ) : null}
                  {section.mode === "international" ? (
                    <LinkComponent
                      href={section.href}
                      variant="neutral"
                      underline={false}
                      size="xs"
                      aria-haspopup="menu"
                      aria-expanded={isOpen}
                      aria-controls={isOpen ? "hearst-brand-menu" : undefined}
                      aria-label="International section menu"
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setOpenDestinationMenu(null)}
                      onMouseEnter={(event) => openDestination(section.mode, event.currentTarget)}
                      onMouseLeave={closeWhenPointerLeavesMenu}
                      onFocus={(event) => openDestination(section.mode, event.currentTarget)}
                      className={cn(
                        "relative z-10 inline-flex h-full min-h-8 min-w-7 cursor-pointer items-center justify-center gap-1 rounded-none border-0 px-2 py-0 text-[11px] font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:min-w-0 sm:text-[11px]",
                        isActive || isOpen
                          ? "bg-white text-black hover:bg-white hover:text-black"
                          : darkMode
                            ? "text-[var(--component-navigation-utility-content-knockout)] opacity-85 hover:bg-white hover:text-black hover:opacity-100"
                            : "text-primary-foreground hover:bg-white hover:text-black",
                        isActive && !isOpen && openDestinationMenu !== null && cn("bg-transparent hover:bg-transparent", darkMode ? "text-[var(--component-navigation-utility-content-knockout)] hover:text-[var(--component-navigation-utility-content-knockout)]" : "text-primary-foreground hover:text-primary-foreground")
                      )}
                    >
                      <span className={cn("uppercase", capAlignedLabelClassName(section.label))}>{section.label}</span>
                      <ChevronDown className={cn("size-3 transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
                    </LinkComponent>
                  ) : <LinkComponent
                    href={section.href}
                    variant="neutral"
                    underline={false}
                    size="xs"
                    aria-haspopup={menuMode ? "menu" : undefined}
                    aria-expanded={menuMode ? isOpen : undefined}
                    aria-controls={menuMode && isOpen ? "hearst-brand-menu" : undefined}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setOpenDestinationMenu(null)}
                    onMouseEnter={(event) => openDestination(menuMode, event.currentTarget)}
                    onMouseLeave={closeWhenPointerLeavesMenu}
                    onFocus={(event) => openDestination(menuMode, event.currentTarget)}
                    className={cn(
                      "relative z-10 inline-flex h-full min-h-8 min-w-7 cursor-pointer items-center justify-center rounded-none px-2 py-0 text-[11px] font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:min-w-0 sm:text-[11px]",
                      isActive || isOpen
                        ? "bg-white text-black hover:bg-white hover:text-black"
                        : darkMode
                          ? "text-[var(--component-navigation-utility-content-knockout)] opacity-85 hover:bg-white hover:text-black hover:opacity-100"
                          : "text-primary-foreground hover:bg-white hover:text-black",
                      isActive && !isOpen && openDestinationMenu !== null && cn("bg-transparent hover:bg-transparent", darkMode ? "text-[var(--component-navigation-utility-content-knockout)] hover:text-[var(--component-navigation-utility-content-knockout)]" : "text-primary-foreground hover:text-primary-foreground")
                    )}
                  >
                    <span className={cn("uppercase", capAlignedLabelClassName(section.label))}>{section.label}</span>
                  </LinkComponent>}
                </React.Fragment>
              );
            })}
            </div>
          </div>
        </nav>
        )}
        <div ref={accountControlRef} className="flex shrink-0 items-center justify-self-end gap-2">
          <Button
            variant="secondary"
            size="xs"
            className={cn(
              "min-h-7 min-w-7 shrink-0 rounded-[4px] border-0 shadow-none text-[length:var(--text-token-4xs)] font-normal leading-none sm:min-h-6 sm:min-w-0",
              account
                ? cn(
                    "gap-1.5 rounded-full border-0 bg-transparent px-1.5 shadow-none hover:bg-white/10 sm:pr-2",
                    darkMode ? "text-[var(--component-navigation-utility-content-knockout)] hover:text-white" : "text-primary-foreground hover:text-primary-foreground"
                  )
                : darkMode
                  ? "bg-[var(--component-navigation-utility-content-accent)] px-2 text-[var(--component-navigation-utility-background-knockout)] hover:bg-[var(--component-navigation-utility-content-accent-hover)] hover:text-[var(--component-navigation-utility-background-knockout)] sm:px-3"
                  : "bg-white/90 px-2 text-black hover:bg-white hover:text-black sm:px-3"
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
          className="absolute top-full z-[60]"
          style={{ left: brandMenuPosition.left, width: brandMenuPosition.width }}
        >
          <div
            ref={brandMenuRef}
            onMouseLeave={closeWhenPointerLeavesMenu}
            id="hearst-brand-menu"
            role="menu"
            aria-label={`${openSection.label} menu`}
            className={cn(
              "max-h-[calc(100dvh-2rem)] w-full max-w-none overscroll-contain overflow-y-auto rounded-b-2xl rounded-t-none border-x border-b border-t-0 px-5 pt-3 pb-5 shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:px-8 sm:pt-5 sm:pb-8",
              menuDarkMode ? "border-[#2A2E35] bg-[#15181D] text-white shadow-[0_18px_50px_rgba(0,0,0,0.45)]" : "border-slate-200 bg-white text-slate-950",
              isInternationalMenu && "xl:p-2.5",
            )}
          >
            <div
              key={openDestinationMenu}
              className={cn(
                "animate-in fade-in duration-200",
                menuSlideDirection === "right" && "slide-in-from-right-4",
                menuSlideDirection === "left" && "slide-in-from-left-4",
              )}
            >
            <div className={cn("mb-4 border-b pb-3", menuDarkMode ? "border-white/15" : isConceptMenu ? "border-slate-200" : "border-border", isInternationalMenu && "xl:mb-1 xl:pb-1")}>
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <div className={cn("min-w-0", isConceptMenu && "flex flex-wrap items-baseline gap-x-3 gap-y-1")}>
              <p className={cn("text-sm font-bold", isConceptMenu && "shrink-0 text-lg tracking-tight")}>
                {openDestinationMenu === "all"
                  ? "Hearst"
                  : isLifestyleMenu
                    ? "Lifestyle"
                  : isLocalNewsMenu
                    ? "Local News"
                    : isEntertainmentCultureMenu
                    ? "A&E Family brands"
                    : isInternationalMenu
                    ? "Hearst around the world"
                    : `${openSection.label} brands`}
              </p>
              {openDestinationMenu === "all" || isLifestyleMenu ? <p className={cn("mt-1 max-w-xl text-sm font-normal leading-5", menuDarkMode ? "text-white/75" : "text-slate-600", isConceptMenu && "mt-0 min-w-0 max-w-full truncate")}>{openDestinationMenu === "all" ? "Find stories and publications by what you love." : brandSectionDescriptions.lifestyle}</p> : isInternationalMenu ? <p className={cn("mt-0 min-w-0 max-w-full truncate text-sm font-normal leading-5", menuDarkMode ? "text-white/75" : "text-slate-600")}>Discover trusted Hearst publications from seven countries.</p> : null}
              </div>
              {isConceptMenu ? (
                <LinkComponent
                  href={openDestinationMenu === "all" ? allDestinationSection.href : isLifestyleMenu ? getHearstDestinationRoute("lifestyle") : "/hearst-plus/international/"}
                  variant="neutral"
                  underline={false}
                  size="sm"
                  role="menuitem"
                  onClick={() => setOpenDestinationMenu(null)}
                  className={cn("min-h-9 rounded-full border px-4 font-semibold", menuDarkMode ? "border-white/20 text-white hover:bg-white/10 hover:text-white" : "border-slate-200 text-slate-900 hover:bg-slate-50 hover:text-slate-950")}
                >
                  {openDestinationMenu === "all" ? "Go to All stories" : isLifestyleMenu ? "View Lifestyle" : "Explore International"}
                </LinkComponent>
              ) : null}
              </div>
            </div>
            <div className={cn("grid gap-5", openDestinationMenu === "all" && "sm:grid-cols-2 lg:grid-cols-4")}>
              {isLocalNewsMenu ? (
                <section aria-labelledby="hearst-brand-menu-local-news">
                  <div className="mb-2">
                    <p id="hearst-brand-menu-local-news" className={cn("text-[11px] font-bold uppercase tracking-[0.12em]", menuDarkMode ? "text-[var(--component-navigation-utility-content-accent)]" : "text-[var(--hp-sidebar-heading,var(--primary))]")}>
                      Sources
                    </p>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="min-w-0">
                      <LinkComponent
                        href={localNewsOptions[0].href}
                        variant="neutral"
                        underline={false}
                        size="sm"
                        role="menuitem"
                        onClick={() => {
                          setOpenDestinationMenu(null);
                        }}
                        className={cn(
                          "group min-h-10 w-full justify-between rounded-lg px-3 py-2 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          menuDarkMode
                            ? "text-[var(--component-navigation-utility-content-knockout)] hover:bg-white/10 hover:text-white"
                            : "text-slate-900 hover:bg-slate-100 hover:text-slate-950 focus-visible:bg-slate-100 focus-visible:text-slate-950"
                        )}
                      >
                        <span className="grid min-w-0 gap-0.5 text-left">
                          <span className="truncate">{localNewsOptions[0].label}</span>
                          <span className={cn("truncate text-[11px] font-medium", menuDarkMode ? "text-white/65" : "text-slate-600 group-hover:text-slate-700 group-focus-visible:text-slate-700")}>
                            {localNewsOptions[0].description}
                          </span>
                        </span>
                      </LinkComponent>
                      {localNewsTVStationFavicons.length > 0 ? (
                        <div className={cn("mt-3 border-t pt-3", menuDarkMode ? "border-white/15" : "border-border")}>
                          <div className="grid gap-1 sm:grid-cols-2">
                            {localNewsTVStationFavicons.map((station) => (
                              <LinkComponent
                                key={station.id}
                                href={`/hearst-plus/local-news/?station=${encodeURIComponent(station.id)}#tv-stations`}
                                variant="neutral"
                                underline={false}
                                size="sm"
                                role="menuitem"
                                aria-label={`Show ${station.callSign} local-news river${connectedTVStationIds.has(station.id) ? " · RSS feed available" : ""}`}
                                onClick={() => setOpenDestinationMenu(null)}
                                className={cn(
                                  "min-h-8 w-full justify-between rounded-lg px-3 py-1.5 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                  menuDarkMode
                                    ? "text-[var(--component-navigation-utility-content-knockout)] hover:bg-white/10 hover:text-white"
                                  : "text-slate-900 hover:bg-slate-100 hover:text-slate-950 focus-visible:bg-slate-100 focus-visible:text-slate-950"
                                )}
                                title={`${station.callSign} · ${station.market}`}
                              >
                                <span className="flex min-w-0 items-center gap-2.5">
                                  <span
                                    aria-hidden="true"
                                    className={cn(
                                      "relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md border text-[9px] font-black uppercase leading-none",
                                      menuDarkMode
                                        ? "border-white/15 bg-white/10 text-white"
                                        : "border-black/10 bg-muted text-foreground"
                                    )}
                                  >
                                    <span>{station.callSign.replace(/[^a-z0-9]/gi, "").slice(0, 3)}</span>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={station.favicon}
                                      alt=""
                                      loading="lazy"
                                      onError={(event) => {
                                        event.currentTarget.style.display = "none";
                                      }}
                                      className="absolute inset-0 size-full bg-white object-contain p-0.5"
                                    />
                                  </span>
                                  <span className="flex min-w-0 items-center gap-1.5 truncate">
                                    <span className="truncate">{station.callSign} · {station.market}</span>
                                    {connectedTVStationIds.has(station.id) ? (
                                      <>
                                        <span
                                          aria-hidden="true"
                                          className="size-1.5 shrink-0 rounded-full bg-emerald-500/80"
                                        />
                                        <span className="sr-only">RSS feed available</span>
                                      </>
                                    ) : null}
                                  </span>
                                </span>
                              </LinkComponent>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <LinkComponent
                        href={localNewsOptions[1].href}
                        variant="neutral"
                        underline={false}
                        size="sm"
                        role="menuitem"
                        onClick={() => {
                          setOpenDestinationMenu(null);
                        }}
                        className={cn(
                          "group min-h-10 w-full justify-between rounded-lg px-3 py-2 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          menuDarkMode
                            ? "text-[var(--component-navigation-utility-content-knockout)] hover:bg-white/10 hover:text-white"
                            : "text-slate-900 hover:bg-slate-100 hover:text-slate-950 focus-visible:bg-slate-100 focus-visible:text-slate-950"
                        )}
                      >
                        <span className="grid min-w-0 gap-0.5 text-left">
                          <span className="truncate">{localNewsOptions[1].label}</span>
                          <span className={cn("truncate text-[11px] font-medium", menuDarkMode ? "text-white/65" : "text-slate-600 group-hover:text-slate-700 group-focus-visible:text-slate-700")}>
                            {localNewsOptions[1].description}
                          </span>
                        </span>
                      </LinkComponent>
                      {localNewsNewspaperLogos.length > 0 ? (
                        <div className={cn("mt-3 border-t pt-3", menuDarkMode ? "border-white/15" : "border-border")}>
                          <div className="grid gap-1 sm:grid-cols-2">
                            {localNewsNewspaperLogos.map((publication) => (
                              <LinkComponent
                                key={publication.id}
                                href={`/hearst-plus/local-news/newspapers/?publication=${encodeURIComponent(publication.id)}#newspapers`}
                                variant="neutral"
                                underline={false}
                                size="sm"
                                role="menuitem"
                                aria-label={`Show ${publication.publicationName} local-news river${connectedNewspaperPublicationIds.has(publication.id) ? " · RSS feed available" : ""}`}
                                onClick={() => setOpenDestinationMenu(null)}
                                className={cn(
                                  "min-h-8 w-full justify-between rounded-lg px-3 py-1.5 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                  menuDarkMode
                                    ? "text-[var(--component-navigation-utility-content-knockout)] hover:bg-white/10 hover:text-white"
                                    : "text-slate-900 hover:bg-slate-100 hover:text-slate-950 focus-visible:bg-slate-100 focus-visible:text-slate-950"
                                )}
                                title={publication.publicationName}
                              >
                                <span className="flex min-w-0 items-center gap-2.5">
                                  <span
                                    aria-hidden="true"
                                    className={cn(
                                      "relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md border text-[9px] font-black uppercase leading-none",
                                      menuDarkMode
                                        ? "border-white/15 bg-white/10 text-white"
                                        : "border-black/10 bg-muted text-foreground"
                                    )}
                                  >
                                    <span>{publication.publicationName.replace(/[^a-z0-9]/gi, "").slice(0, 3)}</span>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={publication.logo}
                                      alt=""
                                      loading="lazy"
                                      className="absolute inset-0 size-full bg-white object-contain p-0.5"
                                    />
                                  </span>
                                  <span className="flex min-w-0 items-center gap-1.5 truncate">
                                    <span className="truncate">{publication.publicationName}</span>
                                    {connectedNewspaperPublicationIds.has(publication.id) ? (
                                      <>
                                        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-emerald-500/80" />
                                        <span className="sr-only">RSS feed available</span>
                                      </>
                                    ) : null}
                                  </span>
                                </span>
                              </LinkComponent>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </section>
              ) : null}
              {isEntertainmentCultureMenu ? (
                <section aria-labelledby="hearst-brand-menu-entertainment-culture">
                  <div className="grid gap-5 md:grid-cols-4">
                    <div className="md:col-span-2">
                      <div className="mb-2">
                        <p id="hearst-brand-menu-entertainment-culture" className={cn("text-[11px] font-bold uppercase tracking-[0.12em]", menuDarkMode ? "text-[var(--component-navigation-utility-content-accent)]" : "text-[var(--hp-sidebar-heading,var(--primary))]")}>
                          Shows
                        </p>
                      </div>
                      <div className="grid gap-1 sm:grid-cols-2">
                        {entertainmentWebsiteFeedConfigs.map((menuBrand) => (
                          <EntertainmentMenuLink
                            key={`shows-${menuBrand.slug}`}
                            darkMode={menuDarkMode}
                            href={menuBrand.showHref}
                            label={menuBrand.brand}
                            favicon={menuBrand.favicon}
                            shortLabel={menuBrand.shortLabel}
                            onClick={() => setOpenDestinationMenu(null)}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="mb-2">
                        <p className={cn("text-[11px] font-bold uppercase tracking-[0.12em]", menuDarkMode ? "text-[var(--component-navigation-utility-content-accent)]" : "text-[var(--hp-sidebar-heading,var(--primary))]")}>
                          Stories
                        </p>
                      </div>
                      <div className="grid gap-1 sm:grid-cols-2">
                        {entertainmentWebsiteFeedConfigs.map((menuBrand) => (
                          <EntertainmentMenuLink
                            key={`stories-${menuBrand.slug}`}
                            darkMode={menuDarkMode}
                            href={menuBrand.storyHref}
                            label={menuBrand.brand}
                            favicon={menuBrand.favicon}
                            shortLabel={menuBrand.shortLabel}
                            onClick={() => setOpenDestinationMenu(null)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              ) : null}
              {isInternationalMenu ? (
                <section aria-label="International editions">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-x-8 xl:grid-cols-4">
                    {internationalFeedCountryColumns.map((column) => (
                      <div key={column.join("-")} className="flex min-w-0 flex-col gap-y-5">
                        {column.map((country) => (
                      <div key={country} className="min-w-0">
                        <p className={cn("mb-2 text-[11px] font-bold uppercase tracking-[0.12em]", menuDarkMode ? "text-white/60" : isConceptMenu ? "text-slate-500" : "text-muted-foreground")}>
                          {hearstInternationalCountryNames[country] ?? country}
                        </p>
                            <div className="grid gap-1 xl:gap-0">
                              {internationalFeedsByCountry[country].map((feed) => (
                                <InternationalFeedLink
                                  key={`${country}-${feed.name}`}
                                  feed={feed}
                                  darkMode={menuDarkMode}
                                  lightSurface={!menuDarkMode && isConceptMenu}
                                  onClick={() => setOpenDestinationMenu(null)}
                                />
                              ))}
                            </div>
                      </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
              {visibleBrandSections.map((section) => (
                <section key={section.mode} aria-labelledby={`hearst-brand-menu-${section.mode}`}>
                  {!isConceptMenu ? (
                    <div className="mb-2">
                      <p id={`hearst-brand-menu-${section.mode}`} className={cn("text-[11px] font-bold uppercase tracking-[0.12em]", menuDarkMode ? "text-[var(--component-navigation-utility-content-accent)]" : "text-[var(--hp-sidebar-heading,var(--primary))]")}>
                        {section.label}
                      </p>
                    </div>
                  ) : null}
                  {openDestinationMenu === "all" ? (
                    <LinkComponent
                      href={getHearstDestinationRoute(section.mode)}
                      variant="neutral"
                      underline={false}
                      size="sm"
                      role="menuitem"
                      onClick={() => setOpenDestinationMenu(null)}
                      className={cn("mb-1 min-h-8 w-full justify-start rounded-lg px-2 text-sm font-bold", menuDarkMode ? "text-white hover:bg-white/10 hover:text-white" : "text-slate-900 hover:bg-slate-100 hover:text-slate-950")}
                    >
                      Explore {section.label}
                    </LinkComponent>
                  ) : null}
                  {(openDestinationMenu === "all" || isLifestyleMenu) ? <p id={`hearst-brand-menu-${section.mode}`} className={cn("mb-2 text-xs font-semibold leading-5", menuDarkMode ? "text-white/75" : "text-slate-600")}>{brandSectionDescriptions[section.mode]}</p> : null}
                  <div className={cn(
                    "grid gap-1",
                    (isLifestyleMenu || isFourColumnBrandMenu) && "sm:grid-cols-2 lg:grid-cols-4",
                  )}>
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
                            menuDarkMode
                              ? "text-[var(--component-navigation-utility-content-knockout)] hover:bg-white/10 hover:text-white"
                              : isConceptMenu
                                ? "text-slate-800 hover:bg-slate-100 hover:text-slate-950"
                              : "text-slate-900 hover:bg-slate-100 hover:text-slate-950 focus-visible:bg-slate-100 focus-visible:text-slate-950",
                            isSelectedBrand && (
                              menuDarkMode
                                ? "bg-white/[0.08]"
                                : isConceptMenu
                                  ? "bg-slate-100 hover:bg-slate-200"
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
        </div>
      ) : null}
    </div>
  );
}

function EntertainmentMenuLink({
  darkMode,
  href,
  label,
  favicon,
  shortLabel,
  onClick,
}: {
  darkMode: boolean;
  href: string;
  label: string;
  favicon: string;
  shortLabel: string;
  onClick: () => void;
}) {
  return (
    <LinkComponent
      href={href}
      variant="neutral"
      underline={false}
      size="sm"
      role="menuitem"
      onClick={onClick}
      className={cn(
        "min-h-8 w-full justify-between rounded-lg px-3 py-1.5 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        darkMode
          ? "text-[var(--component-navigation-utility-content-knockout)] hover:bg-white/10 hover:text-white"
          : "text-slate-900 hover:bg-slate-100 hover:text-slate-950 focus-visible:bg-slate-100 focus-visible:text-slate-950"
      )}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <span
          aria-hidden="true"
          className={cn(
            "relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md border text-[9px] font-black uppercase leading-none",
            darkMode
              ? "border-white/15 bg-white/10 text-white"
              : "border-black/10 bg-muted text-foreground"
          )}
        >
          <span>{shortLabel}</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={favicon}
            alt=""
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
            className="absolute inset-0 size-full bg-white object-contain p-0.5"
          />
        </span>
        <span className="truncate">{label}</span>
      </span>
    </LinkComponent>
  );
}

function InternationalFeedLink({
  feed,
  darkMode,
  lightSurface = false,
  onClick,
}: {
  feed: (typeof hearstInternationalFeeds)[number];
  darkMode: boolean;
  lightSurface?: boolean;
  onClick: () => void;
}) {
  const [faviconFailed, setFaviconFailed] = React.useState(false);
  const faviconUrl = getHearstInternationalFeedFaviconUrl(feed);
  const fallbackLabel = feed.name
    .replace(/[^a-z0-9 ]/gi, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return (
    <LinkComponent
      href={`/hearst-plus/international/?feed=${encodeURIComponent(feed.url)}`}
      variant="neutral"
      underline={false}
      size="sm"
      role="menuitem"
      onClick={onClick}
      className={cn(
        "min-h-8 w-full justify-start gap-2.5 rounded-lg px-2 py-1.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        lightSurface
          ? "text-slate-800 hover:bg-slate-100 hover:text-slate-950"
          : darkMode
          ? "text-[var(--component-navigation-utility-content-knockout)] hover:bg-white/10 hover:text-white"
          : "text-slate-900 hover:bg-slate-100 hover:text-slate-950 focus-visible:bg-slate-100 focus-visible:text-slate-950",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded border text-[8px] font-black leading-none",
          darkMode ? "border-white/15 bg-white/10 text-white" : "border-black/10 bg-muted text-foreground",
        )}
      >
        <span>{fallbackLabel}</span>
        {!faviconFailed ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={faviconUrl}
            alt=""
            loading="lazy"
            onError={() => setFaviconFailed(true)}
            className="absolute inset-0 size-full bg-white object-contain p-0.5"
          />
        ) : null}
      </span>
      <span className="truncate">{feed.name}</span>
    </LinkComponent>
  );
}
