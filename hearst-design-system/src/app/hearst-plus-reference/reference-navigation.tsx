"use client";

import { useEffect, useState } from "react";

type NavigationItem = {
  id: string;
  title: string;
  chapter: string;
  subsections?: readonly (readonly [string, string])[];
};

type ChapterGroup = {
  chapter: string;
  items: NavigationItem[];
};

export function ReferenceNavigation({ items }: { items: NavigationItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [expandedChapter, setExpandedChapter] = useState(items[0]?.chapter ?? "");

  useEffect(() => {
    const targets: Array<{ id: string; parentId?: string }> = items.flatMap((item) => [
      { id: item.id },
      ...(item.subsections ?? []).map(([, id]) => ({ id, parentId: item.id })),
    ]);
    let frame = 0;
    let disposed = false;
    const updateActive = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const marker = window.innerHeight * 0.22;
        const visibleTargets: Array<{ id: string; top: number }> = [];
        for (const target of targets) {
          const scope = target.parentId ? document.getElementById(target.parentId) : document;
          const matches = scope?.querySelectorAll<HTMLElement>(`[id="${CSS.escape(target.id)}"]`) ?? [];
          for (const section of matches) {
            if (section.getClientRects().length === 0) continue;
            visibleTargets.push({ id: target.id, top: section.getBoundingClientRect().top });
          }
        }
        visibleTargets.sort((a, b) => a.top - b.top);
        const current = visibleTargets.filter((target) => target.top <= marker).at(-1)?.id
          ?? visibleTargets[0]?.id
          ?? targets[0]?.id
          ?? "";
        const hashId = decodeURIComponent(window.location.hash.slice(1));
        const hashTarget = targets.find((target) => target.id === hashId);
        const hashScope = hashTarget?.parentId ? document.getElementById(hashTarget.parentId) : document;
        const hashSection = hashTarget
          ? Array.from(hashScope?.querySelectorAll<HTMLElement>(`[id="${CSS.escape(hashId)}"]`) ?? [])
            .find((section) => section.getBoundingClientRect().top <= marker && section.getBoundingClientRect().bottom > marker)
          : undefined;
        const activeId = hashSection ? hashId : current;
        setActiveId(activeId);
        const currentItem = items.find((item) => item.id === activeId || item.subsections?.some(([, id]) => id === activeId));
        if (currentItem) setExpandedChapter(currentItem.chapter);
      });
    };
    const updateAfterPaint = () => {
      requestAnimationFrame(() => requestAnimationFrame(updateActive));
    };
    const initialRestoreCheck = window.setTimeout(updateAfterPaint, 300);
    void document.fonts.ready.then(() => {
      if (!disposed) updateAfterPaint();
    });

    updateAfterPaint();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    window.addEventListener("pageshow", updateAfterPaint);
    window.addEventListener("load", updateAfterPaint);
    window.addEventListener("hashchange", updateAfterPaint);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(initialRestoreCheck);
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
      window.removeEventListener("pageshow", updateAfterPaint);
      window.removeEventListener("load", updateAfterPaint);
      window.removeEventListener("hashchange", updateAfterPaint);
    };
  }, [items]);

  const groups = items.reduce<ChapterGroup[]>((result, item) => {
    const lastGroup = result.at(-1);
    if (lastGroup?.chapter === item.chapter) lastGroup.items.push(item);
    else result.push({ chapter: item.chapter, items: [item] });
    return result;
  }, []);
  const activeItem = items.find((item) => item.id === activeId || item.subsections?.some(([, id]) => id === activeId)) ?? items[0];
  const activeSubsection = activeItem?.subsections?.find(([, id]) => id === activeId)?.[0];

  return (
    <aside className="h-fit border-b border-border bg-card p-4 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">In this document</p>
      <nav aria-label="Document chapters and sections" className="mt-3 grid">
        {groups.map((group, groupIndex) => {
          const isExpanded = expandedChapter === group.chapter;
          const isCurrentChapter = activeItem?.chapter === group.chapter;
          const controlId = `reference-chapter-${groupIndex + 1}`;
          return <section key={group.chapter} className="border-t border-border">
            <button
              type="button"
              aria-expanded={isExpanded}
              aria-controls={controlId}
              aria-current={isCurrentChapter ? "location" : undefined}
              onClick={() => setExpandedChapter(isExpanded ? "" : group.chapter)}
              className={`-ml-2 flex min-h-11 w-[calc(100%+0.5rem)] items-center justify-between gap-3 border-l-2 py-2 pl-2 text-left text-xs font-semibold leading-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${isCurrentChapter ? "border-primary bg-muted text-primary" : "border-transparent text-foreground hover:text-primary"}`}
            >
              <span className="min-w-0">
                <span className="block text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground">Chapter {String(groupIndex + 1).padStart(2, "0")}</span>
                <span className="mt-1 block">{group.chapter} <span className="font-normal text-muted-foreground">· {group.items.length} {group.items.length === 1 ? "section" : "sections"}</span></span>
              </span>
              <span aria-hidden="true" className="shrink-0 font-normal text-muted-foreground">{isExpanded ? "−" : "+"}</span>
            </button>
            {!isExpanded && isCurrentChapter && activeItem && <p className="pb-2 text-[11px] leading-4 text-muted-foreground">Reading: {activeItem.title}{activeSubsection ? ` · ${activeSubsection}` : ""}</p>}
            {isExpanded && <div id={controlId} className="pb-2">
              {group.items.map((item) => {
                const isActive = activeId === item.id;
                return <div key={item.id}>
                  <a href={`#${item.id}`} aria-current={isActive ? "location" : undefined} onClick={() => { setExpandedChapter(group.chapter); setActiveId(item.id); }} className={`flex min-h-10 items-center gap-2 border-l-2 py-2 pl-2 text-xs font-semibold leading-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${isActive ? "border-l-primary bg-muted text-primary" : "border-l-transparent text-foreground hover:text-primary"}`}>
                    <span className="font-mono text-[10px] text-muted-foreground">{String(items.indexOf(item) + 1).padStart(2, "0")}</span>{item.title}
                  </a>
                  {item.subsections && <details open={isActive || item.subsections.some(([, id]) => id === activeId)} className="pb-2 pl-5">
                    <summary className={`min-h-8 cursor-pointer py-2 text-[11px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
                      {item.title} subsections <span className="font-normal">({item.subsections.length})</span>
                    </summary>
                    <div className="grid border-l border-border pl-3">
                      {item.subsections.map(([title, id], subsectionIndex) => <a key={id} href={`#${id}`} aria-current={activeId === id ? "location" : undefined} onClick={(event) => {
                        setExpandedChapter(group.chapter);
                        setActiveId(id);
                        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                        event.preventDefault();
                        const scope = document.getElementById(item.id);
                        const matches = scope?.querySelectorAll<HTMLElement>(`[id="${CSS.escape(id)}"]`) ?? [];
                        const target = Array.from(matches).sort((a, b) => Math.abs(a.getBoundingClientRect().top) - Math.abs(b.getBoundingClientRect().top))[0];
                        if (target) {
                          window.history.pushState(null, "", `#${id}`);
                          target.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }} className={`-ml-2 flex min-h-8 items-center gap-2 border-l-2 py-1 pl-2 text-[11px] leading-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${activeId === id ? "border-primary bg-muted font-semibold text-primary" : "border-transparent text-muted-foreground hover:text-primary"}`}>
                        <span className="font-mono text-[9px]">{String(subsectionIndex + 1).padStart(2, "0")}</span>{title}
                      </a>)}
                    </div>
                  </details>}
                </div>;
              })}
            </div>}
          </section>;
        })}
      </nav>
    </aside>
  );
}
