"use client";

import React from "react";

/**
 * Scroll spy for the specifications page. The header's chapter links carry
 * `data-spec-chapter`; this marks the chapter being read with
 * `data-active="true"` and `aria-current="location"` (styled in the header),
 * and keeps it visible in the narrow header's scrolling link row.
 */
export function SpecNavActive() {
  React.useEffect(() => {
    const links = [...document.querySelectorAll<HTMLAnchorElement>("a[data-spec-chapter]")];
    const ids = [...new Set(links.map((link) => link.dataset.specChapter!))];
    const chapters = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
    if (!chapters.length) return;

    let frame = 0;
    let activeId: string | null | undefined;

    const update = () => {
      frame = 0;
      const header = document.querySelector<HTMLElement>("header[data-current-product-page]");
      // A chapter counts as read once its top passes a line a little below the sticky header.
      const line = (header?.getBoundingClientRect().bottom ?? 0) + 96;
      let next: string | null = null;
      for (const chapter of chapters) {
        if (chapter.getBoundingClientRect().top <= line) next = chapter.id;
      }
      // At the very bottom the last chapter may never reach the line.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) next = chapters[chapters.length - 1].id;
      if (next === activeId) return;
      activeId = next;
      for (const link of links) {
        const on = link.dataset.specChapter === next;
        link.dataset.active = on ? "true" : "false";
        if (on) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
        const row = link.parentElement;
        if (on && row && row.scrollWidth > row.clientWidth) {
          const left = link.offsetLeft - (row.clientWidth - link.offsetWidth) / 2;
          row.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
        }
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("hashchange", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
