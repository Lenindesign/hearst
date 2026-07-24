"use client";

import { ReaderAvatar } from "@/components/reader-account-ui";
import { useReaderAccount } from "@/components/reader-account";
import { Button } from "@/components/ui/button";
import { LinkComponent } from "@/components/ui/link";
import { PageContainer } from "@/components/ui/grid";
import { getHearstBrandSection, getHearstDestinationRoute } from "@/lib/hearst-routes";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

export const hearstDestinationSections = [
  { label: "All", href: getHearstDestinationRoute("all") },
  { label: "Lifestyle", href: getHearstDestinationRoute("lifestyle") },
  { label: "Autos", href: getHearstDestinationRoute("autos") },
  { label: "Fashion & Luxury", href: getHearstDestinationRoute("flux") },
  { label: "Enthusiast & Wellness", href: getHearstDestinationRoute("ew") },
];

const utilityLinks = [
  { label: "Shop", href: "/hearst-plus/shopping/" },
  { label: "Newsletter", href: "https://www.hearst.co.uk/newsletter" },
] as const;

export function UtilityBar({
  selectedBrand,
  onCreateAccount,
  onOpenProfile,
  darkMode = false,
}: {
  selectedBrand?: { name: string; slug: string } | null;
  onCreateAccount?: () => void;
  onOpenProfile?: () => void;
  darkMode?: boolean;
}) {
  const { brand } = useTheme();
  const { account } = useReaderAccount();
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

  return (
    <div
      className={cn(
        "sticky top-0 z-50 h-8 text-[length:var(--text-token-4xs)] font-semibold",
        darkMode
          ? "border-b border-white/10 bg-[#0d1014] text-[#f4f7fb]"
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
                  ? "text-[#f4f7fb] hover:text-[#BDDDFC]"
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
          <div className={cn("flex min-w-max items-center gap-1 rounded-full p-0.5", darkMode ? "bg-white/[0.06]" : "bg-black/10")}>
            {hearstDestinationSections.map((section) => (
              <LinkComponent
                key={section.label}
                href={section.href}
                variant="neutral"
                underline={false}
                size="xs"
                aria-current={section.label === activeDestination ? "page" : undefined}
                className={cn(
                  "min-h-6 rounded-full px-2 py-1 font-bold",
                  section.label === activeDestination
                    ? darkMode
                      ? "bg-[#BDDDFC] text-[#0d1014] hover:text-[#0d1014]"
                      : "bg-white text-black hover:text-black"
                    : darkMode
                      ? "text-[#f4f7fb] opacity-85 hover:bg-white/10 hover:text-white hover:opacity-100"
                      : "text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
                )}
              >
                {section.label}
              </LinkComponent>
            ))}
          </div>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="secondary"
            size="xs"
            className={cn(
              "shrink-0 text-[length:var(--text-token-4xs)] font-semibold",
              account
                ? cn(
                    "gap-1.5 bg-transparent px-0.5 hover:bg-white/10 sm:pr-2",
                    darkMode ? "text-[#f4f7fb] hover:text-white" : "text-primary-foreground hover:text-primary-foreground"
                  )
                : darkMode
                  ? "bg-[#BDDDFC] px-2 text-[#0d1014] hover:bg-[#d7eaff] hover:text-[#0d1014] sm:px-3"
                  : "bg-white px-2 text-black hover:bg-white/90 hover:text-black sm:px-3"
            )}
            aria-label={account ? "Open your local demo profile" : "Create or resume local demo profile"}
            onClick={account ? onOpenProfile : onCreateAccount}
          >
            {account ? <ReaderAvatar account={account} size="sm" className="!size-4 ring-1 ring-white/50 [&_[data-slot=avatar-fallback]]:text-[8px]" /> : null}
            <span className={account ? "hidden text-xs sm:inline" : "text-[10px] sm:text-xs"}>{account ? account.firstName : "Demo Profile"}</span>
          </Button>
        </div>
      </PageContainer>
    </div>
  );
}
