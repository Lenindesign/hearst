"use client";

import React from "react";
import { getBrandInstagramHandle } from "@/lib/brand-instagram";

// Promotes a brand's official Instagram account in its publication page's right rail with Instagram's own profile
// embed (www.instagram.com/embed.js), the same embed Yahoo's brand profiles use: account header plus the latest
// posts, always live, no access token.
// The embed has a 326px minimum width, so in the narrower rail it is scaled down to fit.

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const EMBED_SCRIPT_SRC = "https://www.instagram.com/embed.js";
const EMBED_MIN_WIDTH = 326;

function loadInstagramEmbeds() {
  if (window.instgrm) {
    window.instgrm.Embeds.process();
    return;
  }
  if (document.querySelector(`script[src="${EMBED_SCRIPT_SRC}"]`)) return;
  const script = document.createElement("script");
  script.src = EMBED_SCRIPT_SRC;
  script.async = true;
  document.body.appendChild(script);
}

// Scales the embed to the available width and keeps the wrapper's height in step as Instagram resizes its frame.
function useScaledEmbed(enabled: boolean) {
  const frameRef = React.useRef<HTMLDivElement | null>(null);
  const embedRef = React.useRef<HTMLDivElement | null>(null);
  const [layout, setLayout] = React.useState({ scale: 1, height: 0 });

  React.useEffect(() => {
    const frame = frameRef.current;
    const embed = embedRef.current;
    if (!enabled || !frame || !embed) return;
    const measure = () => {
      const scale = Math.min(1, frame.clientWidth / EMBED_MIN_WIDTH);
      setLayout({ scale, height: Math.ceil(embed.scrollHeight * scale) });
    };
    const resize = new ResizeObserver(measure);
    resize.observe(frame);
    resize.observe(embed);
    // Instagram swaps the blockquote for an iframe and resizes it after load.
    const mutations = new MutationObserver(() => {
      embed.querySelectorAll("iframe").forEach((iframe) => resize.observe(iframe));
      measure();
    });
    mutations.observe(embed, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "height"] });
    measure();
    return () => {
      resize.disconnect();
      mutations.disconnect();
    };
  }, [enabled]);

  return { frameRef, embedRef, layout };
}

export function BrandInstagramModule({ brandSlug, brandName }: { brandSlug: string; brandName: string }) {
  const handle = getBrandInstagramHandle(brandSlug);
  const profileUrl = handle ? `https://www.instagram.com/${handle}/` : null;
  const { frameRef, embedRef, layout } = useScaledEmbed(Boolean(profileUrl));

  React.useEffect(() => {
    if (profileUrl) loadInstagramEmbeds();
  }, [profileUrl]);

  if (!handle || !profileUrl) return null;

  return (
    // Just Instagram's embed, flush to the module edges: its own header already names the account and links to it.
    <section
      className="overflow-hidden rounded-[8px] bg-[var(--hp-surface)] shadow-[var(--hp-shadow-card)]"
      aria-label={`${brandName} on Instagram`}
      data-story-module="brand-instagram"
    >
      {/* Instagram replaces this blockquote with its profile embed; until then (or if blocked) it is a plain link. */}
      <div ref={frameRef} className="overflow-hidden" style={layout.height ? { height: layout.height } : undefined}>
        <div
          ref={embedRef}
          className="[&_iframe]:!m-0 [&_iframe]:!min-w-0 [&_iframe]:!rounded-none [&_iframe]:!border-0"
          style={{ width: EMBED_MIN_WIDTH, transform: `scale(${layout.scale})`, transformOrigin: "top left" }}
        >
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={profileUrl}
            data-instgrm-version="14"
            style={{ background: "transparent", border: 0, margin: 0, padding: 0, width: EMBED_MIN_WIDTH, minWidth: EMBED_MIN_WIDTH }}
          >
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-40 items-center justify-center rounded-[8px] bg-muted px-4 text-center text-sm font-bold text-primary"
            >
              See @{handle}&apos;s latest posts on Instagram
            </a>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
