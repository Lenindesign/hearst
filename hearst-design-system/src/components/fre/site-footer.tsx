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
    { label: "Product blueprint", href: "/hearst-product-blueprint/" },
    { label: "Complete article viewer", href: "/hearst-plus/complete-articles/" },
    { label: "Live feed", href: "/hearst-plus/live-feed/" },
    { label: "Lifestyle Live", href: "/hearst-plus/lifestyle-live/" },
    { label: "Autos Videos", href: "/hearst-plus/motortrend-videos/" },
  ],
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
            <div className="flex gap-4 text-[length:var(--text-token-2xs)]">
              {socialLinks.map((s) => (
                <LinkComponent
                  key={s}
                  href={socialLinkHrefs[s]}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="neutral"
                  underline={false}
                  size="sm"
                  className="font-normal text-[var(--footer-foreground)] opacity-75 hover:text-[var(--footer-foreground)] hover:opacity-100"
                  onClick={() => onSocialClick?.(s)}
                >
                  {s}
                </LinkComponent>
              ))}
            </div>
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
                className="font-normal text-[var(--footer-foreground)] opacity-75 hover:text-[var(--footer-foreground)] hover:opacity-100"
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
              className="font-normal text-[var(--footer-foreground)] opacity-75 hover:text-[var(--footer-foreground)] hover:opacity-100"
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
              rel="noopener noreferrer"
              variant="neutral"
              underline={false}
              size="xs"
              className="font-normal text-[var(--footer-foreground)] hover:text-[var(--footer-foreground)] hover:opacity-85"
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
      <div className="mt-3 text-[length:var(--text-token-4xs)] text-[var(--footer-foreground)] opacity-65">
        &copy;{copyrightYear} Hearst Magazine Media, Inc. All Rights Reserved.
      </div>
      </div>
    </footer>
  );
}
