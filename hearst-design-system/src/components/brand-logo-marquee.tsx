"use client";

import type { CSSProperties, MouseEvent, PointerEvent } from "react";
import { useEffect, useRef } from "react";
import { getHearstBrandRoute } from "@/lib/hearst-routes";
import { brandLogos } from "@/lib/logos";

type MarqueeBrand = {
  name: string;
  slug: string;
};

export function DraggableBrandLogoMarquee({ brands }: { brands: MarqueeBrand[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const halfWidthRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const reduceMotionRef = useRef(false);
  const pausedRef = useRef(false);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startOffset: 0,
    moved: false,
    preventClick: false,
  });
  const rows = [...brands, ...brands];

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      halfWidthRef.current = track.scrollWidth / 2;
    };

    const normalize = (value: number) => {
      const half = halfWidthRef.current;
      if (!half) return value;
      let next = value;
      while (next <= -half) next += half;
      while (next > 0) next -= half;
      return next;
    };

    const applyOffset = () => {
      const track = trackRef.current;
      if (!track) return;
      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    };

    const tick = (time: number) => {
      if (lastTimeRef.current == null) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (!dragRef.current.active && !pausedRef.current && !reduceMotionRef.current) {
        offsetRef.current = normalize(offsetRef.current - delta * 0.012);
        applyOffset();
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    measure();
    const resizeObserver = new ResizeObserver(measure);
    if (trackRef.current) resizeObserver.observe(trackRef.current);
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      resizeObserver.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const normalizeOffset = (value: number) => {
    const half = halfWidthRef.current;
    if (!half) return value;
    let next = value;
    while (next <= -half) next += half;
    while (next > 0) next -= half;
    return next;
  };

  const setOffset = (value: number) => {
    offsetRef.current = normalizeOffset(value);
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pausedRef.current = true;
    dragRef.current.active = true;
    dragRef.current.startX = event.clientX;
    dragRef.current.startOffset = offsetRef.current;
    dragRef.current.moved = false;
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const delta = event.clientX - dragRef.current.startX;
    if (Math.abs(delta) > 5) dragRef.current.moved = true;
    setOffset(dragRef.current.startOffset + delta);
  };

  const onPointerUp = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    dragRef.current.preventClick = dragRef.current.moved;
    window.setTimeout(() => {
      dragRef.current.preventClick = false;
    }, 0);
  };

  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!dragRef.current.preventClick) return;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="relative mt-12 overflow-hidden border-y border-white/15 bg-[#102A43] py-5 before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-20 before:bg-gradient-to-r before:from-[#102A43] before:to-transparent after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-20 after:bg-gradient-to-l after:from-[#102A43] after:to-transparent">
      <div
        aria-label="Brand logo carousel. Drag horizontally or choose a logo to open that brand in the prototype."
        className="cursor-grab overflow-visible active:cursor-grabbing"
        onClickCapture={onClickCapture}
        onPointerDown={onPointerDown}
        onPointerEnter={() => {
          pausedRef.current = true;
        }}
        onPointerLeave={() => {
          if (!dragRef.current.active) pausedRef.current = false;
        }}
        onPointerMove={onPointerMove}
        onPointerCancel={onPointerUp}
        onPointerUp={onPointerUp}
        onFocus={() => {
          pausedRef.current = true;
        }}
        onBlur={() => {
          pausedRef.current = false;
        }}
        style={{ touchAction: "pan-y" }}
      >
        <div ref={trackRef} className="flex w-max items-center gap-4 will-change-transform">
          {rows.map((brand, index) => (
            <a
              key={`${brand.slug}-${index}`}
              href={getHearstBrandRoute(brand.slug)}
              className="group flex h-12 w-36 shrink-0 items-center justify-center border border-white/15 bg-white/[0.04] px-4 transition hover:border-white/45 hover:bg-white/[0.1]"
              aria-label={`${brand.name} brand page`}
            >
              <LogoMark slug={brand.slug} name={brand.name} color="#ffffff" className="h-6 w-28" position="center center" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function LogoMark({ slug, name, className = "h-8 w-32", color = "#111111", position = "left center" }: { slug: string; name: string; className?: string; color?: string; position?: string }) {
  const src = brandLogos[slug];
  if (!src || src.startsWith("http")) {
    return <span className="w-32 shrink-0 text-sm font-black uppercase tracking-[0.08em]" style={{ color }}>{name}</span>;
  }

  const style: CSSProperties = {
    backgroundColor: color,
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: position,
    maskPosition: position,
    WebkitMaskSize: "contain",
    maskSize: "contain",
  };

  return <span aria-hidden="true" className={`block shrink-0 ${className}`} style={style} />;
}
