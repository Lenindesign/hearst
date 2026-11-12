"use client";

import React from "react";

type ScrollParallaxOptions = {
  /** Turn the effect off (reduced motion, list layouts). The variable resets to 0px. */
  enabled?: boolean;
  /** Total upward travel in px across the element's pass through the viewport. */
  travel?: number;
  /** CSS custom property written on the element. */
  property?: string;
  /** Share of the remaining distance closed each frame (0–1). Lower is softer. */
  smoothing?: number;
};

/**
 * Writes a subtle scroll-linked offset to a CSS custom property on `ref`.
 *
 * The value starts at 0px wherever the element is when the page loads and
 * moves toward `-travel` px as it scrolls up and out of the viewport, so
 * foreground layers that read it drift up slightly faster than the page. It
 * never goes positive, so a layer can't move below its resting place. Work only runs while the element is
 * visible, and the value eases toward its target for a damped, settled feel.
 */
export function useScrollParallax<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  { enabled = true, travel = 16, property = "--scroll-parallax", smoothing = 0.16 }: ScrollParallaxOptions = {},
) {
  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!enabled || typeof window === "undefined") {
      element.style.setProperty(property, "0px");
      return;
    }

    let frame = 0;
    let visible = false;
    let current = Number.NaN;
    let target = 0;
    // The first reading becomes the resting point, so the layer sits exactly
    // where it is designed (and where the loading skeleton drew it) until the
    // reader scrolls, then drifts up from there.
    let rest = Number.NaN;

    const measure = () => {
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      // 1 while the element's centre is below the viewport, -1 once it is above.
      const offset = (rect.top + rect.height / 2 - viewport / 2) / (viewport / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, offset));
      const raw = ((clamped - 1) / 2) * travel;
      if (Number.isNaN(rest)) rest = raw;
      target = Math.min(0, raw - rest);
    };

    const tick = () => {
      frame = 0;
      measure();
      current = Number.isNaN(current) ? target : current + (target - current) * smoothing;
      if (Math.abs(target - current) < 0.05) current = target;
      element.style.setProperty(property, `${current.toFixed(2)}px`);
      if (current !== target && visible) frame = window.requestAnimationFrame(tick);
    };

    const schedule = () => {
      if (!visible || frame) return;
      frame = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      schedule();
    });
    observer.observe(element);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
      element.style.removeProperty(property);
    };
  }, [ref, enabled, travel, property, smoothing]);
}
