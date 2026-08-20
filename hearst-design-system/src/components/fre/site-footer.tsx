"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { LinkComponent } from "@/components/ui/link";

const socialLinkHrefs: Record<string, string> = {
  YouTube: "https://www.youtube.com/@Hearst",
  Facebook: "https://www.facebook.com/Hearst/",
  Instagram: "https://www.instagram.com/hearst/",
  Pinterest: "https://www.pinterest.com/hearst/",
};

const legalLinkHrefs: Record<string, string> = {
  "Privacy Notice": "https://subscribe.hearstmags.com/circulation/shared/privacy.html",
  "Terms of Use": "https://subscribe.hearstmags.com/circulation/shared/terms.html",
  "Hearst brands": "https://www.hearst.com/magazines",
};

const hearstSubscriptionsHref = "https://subscribe.hearstmags.com/";

export type SiteFooterLink = { label: string; href: string };
export type SiteFooterLinkGroup = { title: string; links: SiteFooterLink[] };

const defaultProductLinkGroups: SiteFooterLinkGroup[] = [
  {
    title: "Discover Hearst+",
    links: [
      { label: "Open Hearst+", href: "/hearst-plus/" },
      { label: "Local News", href: "/hearst-plus/local-news/" },
      { label: "Shop the stories", href: "/hearst-plus/shop/" },
      { label: "Complete article viewer", href: "/hearst-plus/complete-articles/" },
    ],
  },
  {
    title: "Product strategy",
    links: [
      { label: "Product story", href: "/about-hearst-magazines/" },
      { label: "Why Hearst+", href: "/why-hearst-plus/" },
      { label: "Accessibility and AI", href: "/hearst-plus/accessibility-ai/" },
      { label: "Ad logic", href: "/ad-logic/" },
      { label: "Product blueprint", href: "/hearst-product-blueprint/" },
      { label: "Article system", href: "/hearst-article-blueprint/" },
      { label: "Token architecture", href: "/token-architecture/" },
      { label: "HDS brand framework", href: "/hds-brand-framework/" },
      { label: "Hearst+ Design System", href: "/" },
    ],
  },
  {
    title: "Prototype experiences",
    links: [
      { label: "Live feed", href: "/hearst-plus/live-feed/" },
      { label: "Local News feed admin", href: "/hearst-plus/local-news/admin/" },
      { label: "Lifestyle Live", href: "/hearst-plus/lifestyle-live/" },
      { label: "Autos Videos", href: "/hearst-plus/motortrend-videos/" },
      { label: "HOT ROD Events", href: "/autos/hot-rod/events/" },
    ],
  },
];

export interface SiteFooterProps {
  siteName: React.ReactNode;
  socialLinks?: string[];
  legalLinks?: string[];
  copyrightYear?: number;
  showSocialLinks?: boolean;
  onSocialClick?: (platform: string) => void;
  onLegalClick?: (link: string) => void;
  onSubscribeClick?: () => void;
  productLinks?: SiteFooterLink[];
  productLinkGroups?: SiteFooterLinkGroup[];
  finePrintNote?: string;
  socialFinePrintNote?: string;
  className?: string;
}

export function SiteFooter({
  siteName,
  socialLinks = ["YouTube", "Facebook", "Instagram", "Pinterest"],
  legalLinks = ["Privacy Notice", "Terms of Use", "Hearst brands"],
  copyrightYear = new Date().getFullYear(),
  showSocialLinks = true,
  onSocialClick,
  onLegalClick,
  onSubscribeClick,
  productLinks,
  productLinkGroups,
  finePrintNote,
  socialFinePrintNote,
  className,
}: SiteFooterProps) {
  const resolvedProductLinkGroups = productLinkGroups
    ?? (productLinks ? [{ title: "Explore the product", links: productLinks }] : defaultProductLinkGroups);

  return (
    <footer
      className={cn(
        "bg-[var(--footer-background)] py-10 font-brand text-[var(--footer-foreground)]",
        className
      )}
    >
      <div className="max-w-[var(--width-content-max,1360px)] mx-auto px-6">
      <div className="mb-8 grid gap-10 lg:grid-cols-[minmax(12rem,.55fr)_minmax(0,1.45fr)]">
        <div>
          <div className="mb-4">
            {typeof siteName === "string" ? (
              <span className="text-xl font-extrabold italic headline">{siteName}</span>
            ) : (
              siteName
            )}
          </div>
          {showSocialLinks && (
            <>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-[length:var(--text-token-2xs)]">
                {socialLinks.map((s) => (
                  <LinkComponent
                    key={s}
                    href={socialLinkHrefs[s]}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="neutral"
                    underline={false}
                    size="sm"
                    className="min-h-11 font-normal text-[var(--footer-foreground)] opacity-75 hover:text-[var(--footer-foreground)] hover:opacity-100 md:min-h-0"
                    onClick={() => onSocialClick?.(s)}
                  >
                    {s}
                  </LinkComponent>
                ))}
              </div>
              {socialFinePrintNote ? (
                <p
                  className="mt-5 max-w-md text-[10px] leading-4 text-[var(--footer-foreground)] opacity-50"
                  role="note"
                  aria-label="Video prototype note"
                >
                  {socialFinePrintNote}
                </p>
              ) : null}
            </>
          )}
        </div>
        <div className="grid gap-8 text-[length:var(--text-token-2xs)] sm:grid-cols-2 xl:grid-cols-4">
          {resolvedProductLinkGroups.map((group) => (
            <nav key={group.title} aria-label={group.title} className="flex flex-col gap-2">
              <span className="mb-1 font-semibold">{group.title}</span>
              {group.links.map((link) => (
                <LinkComponent
                  key={link.href}
                  href={link.href}
                  variant="neutral"
                  underline={false}
                  size="sm"
                  className="min-h-11 font-normal text-[var(--footer-foreground)] opacity-75 hover:text-[var(--footer-foreground)] hover:opacity-100 md:min-h-0"
                >
                  {link.label}
                </LinkComponent>
              ))}
            </nav>
          ))}
          <div className="flex flex-col gap-2">
            <span className="mb-1 font-semibold">Subscriptions</span>
            <LinkComponent
              href={hearstSubscriptionsHref}
              target="_blank"
              rel="noopener noreferrer"
              variant="neutral"
              underline={false}
              size="sm"
              className="min-h-11 font-normal text-[var(--footer-foreground)] opacity-75 hover:text-[var(--footer-foreground)] hover:opacity-100 md:min-h-0"
              onClick={onSubscribeClick}
            >
              Subscribe
            </LinkComponent>
          </div>
        </div>
      </div>

      <Separator className="bg-background/15" />

      <div className="flex flex-col justify-between gap-4 pt-5 text-[length:var(--text-token-4xs)] opacity-60 md:flex-row md:items-center">
        <div>A Part of Hearst Digital Media</div>
        <div className="flex flex-wrap gap-4">
          {legalLinks.map((link) => (
            <LinkComponent
              key={link}
              href={legalLinkHrefs[link]}
              target="_blank"
              variant="neutral"
              underline={false}
              size="xs"
              className="min-h-11 font-normal text-[var(--footer-foreground)] hover:text-[var(--footer-foreground)] hover:opacity-85 md:min-h-0"
              onClick={() => onLegalClick?.(link)}
            >
              {link}
            </LinkComponent>
          ))}
        </div>
      </div>
      <p className="mt-3 max-w-3xl text-[length:var(--text-token-4xs)] leading-relaxed text-[var(--footer-foreground)] opacity-75">
        Personalized daily reading experiences across Hearst Magazine Media brands.
      </p>
      <p className="mt-3 text-[10px] leading-4 text-[var(--footer-foreground)] opacity-65">
        <span data-footer-copyright>
          &copy;{copyrightYear} Hearst Magazine Media, Inc. All Rights Reserved.
        </span>
        {finePrintNote ? (
          <>
            <span aria-hidden="true"> · </span>
            <span role="note" aria-label="Prototype disclosure">
              <span className="font-bold uppercase tracking-[0.1em]">Note:</span>{" "}
            {finePrintNote}
            </span>
          </>
        ) : null}
      </p>
      </div>
    </footer>
  );
}
