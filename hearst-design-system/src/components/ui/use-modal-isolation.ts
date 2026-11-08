"use client";

import React from "react";

type ElementState = {
  ariaHidden: string | null;
  inert: boolean;
};

const modalLayerStack: HTMLElement[] = [];
const isolatedElementStates = new Map<HTMLElement, ElementState>();
let originalBodyOverflow: string | null = null;

function subscribeToDocumentBody() {
  return () => undefined;
}

function getDocumentBody() {
  return document.body;
}

function getServerDocumentBody() {
  return null;
}

export function useBodyPortalTarget() {
  return React.useSyncExternalStore(
    subscribeToDocumentBody,
    getDocumentBody,
    getServerDocumentBody
  );
}

function restoreIsolatedElements() {
  isolatedElementStates.forEach(({ ariaHidden, inert }, element) => {
    element.inert = inert;
    if (ariaHidden === null) element.removeAttribute("aria-hidden");
    else element.setAttribute("aria-hidden", ariaHidden);
  });
  isolatedElementStates.clear();
}

function updateModalIsolation() {
  restoreIsolatedElements();

  const activeLayer = modalLayerStack.at(-1);
  if (!activeLayer) {
    if (originalBodyOverflow !== null) {
      document.body.style.overflow = originalBodyOverflow;
      originalBodyOverflow = null;
    }
    return;
  }

  const activeBodyChild = Array.from(document.body.children)
    .find((element): element is HTMLElement =>
      element instanceof HTMLElement
      && (element === activeLayer || element.contains(activeLayer))
    );

  if (!activeBodyChild) return;
  if (originalBodyOverflow === null) originalBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  Array.from(document.body.children).forEach((element) => {
    if (!(element instanceof HTMLElement) || element === activeBodyChild) return;
    isolatedElementStates.set(element, {
      ariaHidden: element.getAttribute("aria-hidden"),
      inert: element.inert,
    });
    element.inert = true;
    element.setAttribute("aria-hidden", "true");
  });
}

export function useModalIsolation<DialogElement extends HTMLElement>(
  open: boolean,
  dialogRef: React.RefObject<DialogElement | null>
) {
  React.useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    modalLayerStack.push(dialog);
    updateModalIsolation();

    return () => {
      const layerIndex = modalLayerStack.lastIndexOf(dialog);
      if (layerIndex >= 0) modalLayerStack.splice(layerIndex, 1);
      updateModalIsolation();
    };
  }, [dialogRef, open]);
}

export type InheritedThemeScope = {
  className?: string;
  dataBrand?: string;
  style?: React.CSSProperties;
};

/** Theme-scope classes whose CSS defines tokens (e.g. the Hearst+ button radius). */
const THEME_SCOPE_CLASSES = ["hearst-plus-theme"];

/**
 * Reads the theme an overlay would have inherited at `anchor` before it was portaled to <body>:
 * inline custom properties from every ancestor (nearest wins), theme-scope classes, and the nearest
 * data-brand. Apply the result to the portal root so HDS components keep the brand tokens.
 */
export function readInheritedThemeScope(anchor: Element | null): InheritedThemeScope {
  const vars: Record<string, string> = {};
  const classes = new Set<string>();
  let dataBrand: string | undefined;

  for (let element = anchor?.parentElement ?? null; element; element = element.parentElement) {
    const { style } = element;
    for (let index = 0; index < style.length; index += 1) {
      const name = style[index];
      if (name.startsWith("--") && !(name in vars)) vars[name] = style.getPropertyValue(name);
    }
    THEME_SCOPE_CLASSES.forEach((name) => {
      if (element?.classList.contains(name)) classes.add(name);
    });
    dataBrand ??= element.dataset.brand;
  }

  return {
    className: classes.size ? Array.from(classes).join(" ") : undefined,
    dataBrand,
    style: Object.keys(vars).length ? (vars as React.CSSProperties) : undefined,
  };
}

/** Returns the anchor ref to render in place and the theme scope to put on the portal root. */
export function useInheritedThemeScope(active: boolean) {
  const anchorRef = React.useRef<HTMLSpanElement | null>(null);
  const [scope, setScope] = React.useState<InheritedThemeScope>({});

  React.useLayoutEffect(() => {
    if (!active) return;
    // The scope is read from the DOM after mount; it cannot be derived during render.
    setScope(readInheritedThemeScope(anchorRef.current));
  }, [active]);

  return { anchorRef, scope };
}
