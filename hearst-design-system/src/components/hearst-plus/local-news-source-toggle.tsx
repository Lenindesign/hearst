"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type LocalNewsSource = "tv" | "newspapers";

const sourceItems: Array<{
  label: string;
  description: string;
  href: string;
  value: LocalNewsSource;
}> = [
  {
    label: "TV Stations",
    description: "Hearst Television feeds",
    href: "/hearst-plus/local-news/",
    value: "tv",
  },
  {
    label: "Newspapers",
    description: "Local newspaper feeds",
    href: "/hearst-plus/local-news/newspapers/",
    value: "newspapers",
  },
];

export function LocalNewsSourceToggle({ activeSource }: { activeSource: LocalNewsSource }) {
  return (
    <nav aria-label="Local News source" className="grid gap-2">
      <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-[var(--hp-sidebar-heading,var(--color-primary,var(--primary)))]">
        Sources
      </p>
      <div className="grid grid-cols-2 gap-1 rounded-[8px] border border-border bg-[var(--hp-surface-low)] p-1">
        {sourceItems.map((item) => {
          const active = item.value === activeSource;

          return (
            <Link
              key={item.value}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "grid min-h-11 place-items-center rounded-[6px] px-2 text-center text-xs font-bold no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                active
                  ? "bg-primary text-primary-foreground shadow-[var(--hp-shadow-card)] ring-1 ring-primary/25"
                  : "text-muted-foreground hover:bg-[var(--hp-surface)] hover:text-[var(--hp-text-headline)]",
              )}
              title={item.description}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
