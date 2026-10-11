/* eslint-disable @next/next/no-img-element -- small decorative SVG wordmarks */
import { TITLE_SLUGS, logoSrc } from "@/components/hearst-plus/newsstand/newsstand-catalog";

// A faint, tilted wall of brand wordmarks for masthead banners: every Hearst brand on the Hearst+ home, a
// section's own brands on a destination page. Decorative only: the banner's accessible name comes from its
// role="img" label, and the overlaid logo sits on top.
const ROWS = 7;
const allBrandLogos = TITLE_SLUGS.map(logoSrc);

export function HearstPlusBrandWall({ logos = allBrandLogos }: { logos?: string[] }) {
  // Short lists (a section's handful of brands) repeat more so every row still spans the banner.
  const repeat = Math.max(2, Math.ceil(36 / Math.max(logos.length, 1)));
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 flex w-[180%] -translate-x-1/2 -translate-y-1/2 -rotate-6 flex-col gap-5 sm:gap-7">
        {Array.from({ length: ROWS }, (_, row) => {
          // Offset each row so the same brand never stacks directly above itself.
          const shift = (row * 3) % logos.length;
          const rowLogos = [...logos.slice(shift), ...logos.slice(0, shift)];
          return (
            <div key={row} className="flex shrink-0 items-center gap-10 sm:gap-14" style={{ marginLeft: row % 2 ? "-4rem" : 0 }}>
              {Array.from({ length: repeat }, () => rowLogos).flat().map((src, index) => (
                <img
                  key={`${src}-${index}`}
                  src={src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-5 w-auto max-w-[140px] shrink-0 object-contain opacity-[0.05] sm:h-7"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
