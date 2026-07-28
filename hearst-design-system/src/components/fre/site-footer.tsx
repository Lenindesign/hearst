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

export interface SiteFooterProps {
  siteName: React.ReactNode;
  socialLinks?: string[];
  legalLinks?: string[];
  copyrightYear?: number;
  showSocialLinks?: boolean;
  onSocialClick?: (platform: string) => void;
  onLegalClick?: (link: string) => void;
  onSubscribeClick?: () => void;
  productLinks?: Array<{ label: string; href: string }>;
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
  productLinks = [
    { label: "Product story", href: "/about-hearst-magazines/" },
    { label: "Explore Hearst+", href: "/why-hearst-plus/" },
    { label: "Product blueprint", href: "/hearst-product-blueprint/" },
    { label: "Shop the stories", href: "/hearst-plus/shop/" },
    { label: "Token architecture", href: "/token-architecture/" },
    { label: "Complete article viewer", href: "/hearst-plus/complete-articles/" },
    { label: "Live feed", href: "/hearst-plus/live-feed/" },
    { label: "Lifestyle Live", href: "/hearst-plus/lifestyle-live/" },
    { label: "Autos Videos", href: "/hearst-plus/motortrend-videos/" },
    { label: "HOT ROD Events", href: "/autos/hot-rod/events/" },
  ],
  finePrintNote,
  socialFinePrintNote,
  className,
}: SiteFooterProps) {
  return (
    <footer
      className={cn(
        "bg-[var(--footer-background)] py-10 font-brand text-[var(--footer-foreground)]",
        className
      )}
    >
      <div className="max-w-[var(--width-content-max,1360px)] mx-auto px-6">
      <div className="flex flex-col justify-between gap-8 mb-8 md:flex-row md:items-start">
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
        <div className="flex flex-wrap gap-8 text-[length:var(--text-token-2xs)]">
          <div className="flex flex-col gap-2">
            <span className="font-semibold mb-1">Explore the product</span>
            {productLinks.map((link) => (
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
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold mb-1">Other Hearst Subscriptions</span>
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
