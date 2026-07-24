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
