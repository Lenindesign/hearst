"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { LinkComponent } from "@/components/ui/link";

export interface SiteFooterProps {
  siteName: React.ReactNode;
  socialLinks?: string[];
  legalLinks?: string[];
  copyrightYear?: number;
  showSocialLinks?: boolean;
  onSocialClick?: (platform: string) => void;
  onLegalClick?: (link: string) => void;
  onSubscribeClick?: () => void;
  className?: string;
}

export function SiteFooter({
  siteName,
  socialLinks = ["YouTube", "Facebook", "Instagram", "Pinterest"],
  legalLinks = ["Privacy Notice", "Terms of Use", "Site Map"],
  copyrightYear = new Date().getFullYear(),
  showSocialLinks = true,
  onSocialClick,
  onLegalClick,
  onSubscribeClick,
  className,
}: SiteFooterProps) {
  return (
    <footer
      className={cn(
        "bg-foreground text-background px-6 py-10 font-brand",
        className
      )}
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="text-xl font-extrabold italic mb-4 headline">
            {siteName}
          </div>
          {showSocialLinks && (
            <div className="flex gap-4 text-[13px]">
              {socialLinks.map((s) => (
                <LinkComponent
                  key={s}
                  variant="neutral"
                  underline={false}
                  size="sm"
                  className="opacity-70 text-background hover:text-background/90 font-normal"
                  onClick={() => onSocialClick?.(s)}
                >
                  {s}
                </LinkComponent>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-8 text-[13px]">
          <div className="flex flex-col gap-2">
            <span className="font-semibold mb-1">Other Hearst Subscriptions</span>
            <LinkComponent
              variant="neutral"
              underline={false}
              size="sm"
              className="opacity-70 text-background hover:text-background/90 font-normal"
              onClick={onSubscribeClick}
            >
              Subscribe
            </LinkComponent>
          </div>
        </div>
      </div>

      <Separator className="bg-background/15" />

      <div className="flex justify-between items-center pt-5 text-[11px] opacity-60">
        <div>A Part of Hearst Digital Media</div>
        <div className="flex gap-4">
          {legalLinks.map((link) => (
            <LinkComponent
              key={link}
              variant="neutral"
              underline={false}
              size="xs"
              className="text-background hover:text-background/80 font-normal"
              onClick={() => onLegalClick?.(link)}
            >
              {link}
            </LinkComponent>
          ))}
        </div>
      </div>
      <div className="text-[10px] opacity-40 mt-3">
        &copy;{copyrightYear} Hearst Magazine Media, Inc. All Rights Reserved.
      </div>
    </footer>
  );
}
