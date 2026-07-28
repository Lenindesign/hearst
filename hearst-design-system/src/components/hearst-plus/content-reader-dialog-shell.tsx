"use client";

import React from "react";
import { createPortal } from "react-dom";

import { useBodyPortalTarget, useModalIsolation } from "@/components/ui/use-modal-isolation";
import { cn } from "@/lib/utils";

const readerReturnFocusStorageKey = "hearst-reader-return-focus-label";
const focusableSelector =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

let focusRestoreVersion = 0;

function isVisibleFocusTarget(element: HTMLElement) {
  return (
    element.isConnected
    && element.getClientRects().length > 0
    && !element.closest('[inert], [aria-hidden="true"]')
  );
}

function clearStoredReturnFocusLabel() {
  try {
    window.sessionStorage.removeItem(readerReturnFocusStorageKey);
  } catch {
    // Focus restoration remains available through the in-memory opener.
  }
}

function readStoredReturnFocusLabel() {
  if (typeof window === "undefined") return null;

  try {
    return window.sessionStorage.getItem(readerReturnFocusStorageKey);
  } catch {
    return null;
  }
}

export function rememberContentReaderReturnFocus(element: Element | null) {
  const returnFocusElement = element instanceof HTMLElement && element !== document.body
    ? element
    : null;
  const returnFocusLabel = returnFocusElement?.getAttribute("aria-label") ?? null;

  try {
    if (returnFocusLabel) {
      window.sessionStorage.setItem(readerReturnFocusStorageKey, returnFocusLabel);
    } else {
      window.sessionStorage.removeItem(readerReturnFocusStorageKey);
    }
  } catch {
    // The direct element reference still supports same-page focus restoration.
  }

  return returnFocusElement;
}

export interface ContentReaderDialogShellProps {
  children: React.ReactNode;
  contentRef: React.RefObject<HTMLDivElement | null>;
  destination: string;
  mode: "light" | "dark";
  nestedDialogOpen?: boolean;
  onClose: () => void;
  returnFocusElementRef: React.RefObject<HTMLElement | null>;
  style?: React.CSSProperties;
}

export function ContentReaderDialogShell({
  children,
  contentRef,
  destination,
  mode,
  nestedDialogOpen = false,
  onClose,
  returnFocusElementRef,
  style,
}: ContentReaderDialogShellProps) {
  const portalTarget = useBodyPortalTarget();
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const onCloseRef = React.useRef(onClose);
  const nestedDialogOpenRef = React.useRef(nestedDialogOpen);
  const [returnFocusLabel] = React.useState(readStoredReturnFocusLabel);

  React.useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  React.useEffect(() => {
    nestedDialogOpenRef.current = nestedDialogOpen;
  }, [nestedDialogOpen]);

  useModalIsolation(Boolean(portalTarget), dialogRef);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !portalTarget) return;

    ++focusRestoreVersion;
    const returnFocusElement = returnFocusElementRef.current;
    const getFocusableElements = () =>
      Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector))
        .filter(isVisibleFocusTarget);
    const isTopDialog = () =>
      !dialog.inert
      && dialog.getAttribute("aria-hidden") !== "true"
      && !nestedDialogOpenRef.current;

    const onKeyDown = (event: KeyboardEvent) => {
      if (!isTopDialog()) return;

      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;
      const activeFocusableIndex = activeElement instanceof HTMLElement
        ? focusableElements.indexOf(activeElement)
        : -1;

      if (!dialog.contains(activeElement) || activeFocusableIndex === -1) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
      } else if (event.shiftKey && activeFocusableIndex === 0) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey
        && activeFocusableIndex === focusableElements.length - 1
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);

    const focusFrame = window.requestAnimationFrame(() => {
      dialog.querySelector<HTMLElement>("[data-reader-close]")?.focus();
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown, true);

      const restoreVersion = ++focusRestoreVersion;
      const startedAt = performance.now();
      const restoreFocus = () => {
        if (
          focusRestoreVersion !== restoreVersion
        ) return;

        if (returnFocusElement && isVisibleFocusTarget(returnFocusElement)) {
          returnFocusElement.focus();
          clearStoredReturnFocusLabel();
          return;
        }

        if (!window.location.pathname.startsWith("/read/") && returnFocusLabel) {
          const labelledReturnTarget = Array.from(
            document.querySelectorAll<HTMLElement>("[aria-label]"),
          ).find((element) =>
            element.getAttribute("aria-label") === returnFocusLabel
            && isVisibleFocusTarget(element)
          );

          if (labelledReturnTarget) {
            labelledReturnTarget.focus();
            clearStoredReturnFocusLabel();
            return;
          }

          const carouselStoryTitle = returnFocusLabel.startsWith("Open story: ")
            ? returnFocusLabel.slice("Open story: ".length)
            : null;
          const carouselSelectorTarget = carouselStoryTitle
            ? Array.from(
                document.querySelectorAll<HTMLElement>(
                  '[aria-label^="Show story "]',
                ),
              ).find((element) =>
                element.getAttribute("aria-label")?.endsWith(
                  `: ${carouselStoryTitle}`,
                )
                && isVisibleFocusTarget(element)
              )
            : null;

          if (carouselSelectorTarget) {
            carouselSelectorTarget.focus();
            clearStoredReturnFocusLabel();
            return;
          }
        }

        if (performance.now() - startedAt < 3000) {
          window.setTimeout(restoreFocus, 50);
        }
      };

      window.requestAnimationFrame(restoreFocus);
    };
  }, [portalTarget, returnFocusElementRef, returnFocusLabel]);

  if (!portalTarget) return null;

  return createPortal(
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[200] bg-foreground/55 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Story reader"
      tabIndex={-1}
    >
      <div className="absolute inset-0" onClick={onClose} />
      <div
        ref={contentRef}
        className={cn(
          "hearst-plus-theme absolute inset-0 isolate mx-auto flex h-[100dvh] w-full max-w-[1360px] transform-gpu flex-col overflow-y-auto overscroll-contain bg-background text-foreground shadow-2xl [scrollbar-gutter:stable] [will-change:scroll-position]",
          "sm:inset-6 sm:h-auto sm:w-auto sm:rounded-[8px]",
        )}
        data-mode={mode}
        data-reader-destination={destination}
        style={style}
      >
        {children}
      </div>
    </div>,
    portalTarget,
  );
}
