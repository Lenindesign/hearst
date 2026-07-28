"use client";

import Image from "next/image";
import React from "react";
import { createPortal } from "react-dom";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { Button } from "@/components/ui/button";
import { BrandSourceIcon } from "@/components/hearst-plus/brand-source-icon";
import { Check, ChevronDown, X } from "@/components/ui/icons";
import { useBodyPortalTarget, useModalIsolation } from "@/components/ui/use-modal-isolation";
import { cn } from "@/lib/utils";

export type HearstOnboardingDestination = "all" | "lifestyle" | "autos" | "flux" | "ew";

export type HearstOnboardingResult = {
  id: number;
  interests: string[];
  brands: string[];
  tags: string[];
};

export type HearstOnboardingConfig = {
  mode: HearstOnboardingDestination;
  filters: string[];
  stories: LifestyleRiverStory[];
  sourceNotes: readonly {
    brand: string;
    brandSlug: string;
  }[];
};

export type HearstOnboardingModalProps = {
  open: boolean;
  config: HearstOnboardingConfig;
  allBrandConfig: Pick<HearstOnboardingConfig, "stories" | "sourceNotes">;
  brandInventory?: Record<string, number>;
  onClose: () => void;
  onComplete: (result: HearstOnboardingResult) => void;
  onCreateProfile: (result: HearstOnboardingResult) => void;
  onSignIn: () => void;
  onStepChange?: (step: 1 | 2 | 3) => void;
};

const onboardingVisuals: Record<
  HearstOnboardingDestination,
  { image: string; objectPosition: string }
> = {
  all: {
    image: "/images/hearst-plus-onboarding.png",
    objectPosition: "center center",
  },
  lifestyle: {
    image: "/images/hearst-plus-onboarding.png",
    objectPosition: "center center",
  },
  autos: {
    image: "/images/hearst-autos-onboarding.avif",
    objectPosition: "center center",
  },
  flux: {
    image: "/images/hearst-flux-onboarding.png",
    objectPosition: "center center",
  },
  ew: {
    image: "/images/hearst-ew-onboarding.png",
    objectPosition: "center center",
  },
};

export function getOnboardingInterestOptions(config: HearstOnboardingConfig) {
  const broadDestinationFilters = new Set([
    "For You",
    "Saved",
    "Lifestyle",
    "Autos",
    "Fashion & Luxury",
    "Enthusiast & Wellness",
  ]);
  const filterOptions = config.filters.filter(
    (filter) => !broadDestinationFilters.has(filter),
  );
  const topicOptions = Array.from(
    new Set(config.stories.map((story) => story.topic)),
  )
    .filter((topic) => !broadDestinationFilters.has(topic))
    .sort((a, b) => a.localeCompare(b));

  return Array.from(new Set([...filterOptions, ...topicOptions])).slice(0, 12);
}

export function HearstOnboardingModal({
  open,
  ...props
}: HearstOnboardingModalProps) {
  const portalTarget = useBodyPortalTarget();

  if (!open || !portalTarget) return null;

  return (
    <HearstOnboardingModalContent
      {...props}
      portalTarget={portalTarget}
    />
  );
}

type HearstOnboardingModalContentProps = Omit<
  HearstOnboardingModalProps,
  "open"
> & {
  portalTarget: HTMLElement;
};

function HearstOnboardingModalContent({
  config,
  allBrandConfig,
  brandInventory,
  onClose,
  onComplete,
  onCreateProfile,
  onSignIn,
  onStepChange,
  portalTarget,
}: HearstOnboardingModalContentProps) {
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = React.useState<string[]>([]);
  const [completedResult, setCompletedResult] =
    React.useState<HearstOnboardingResult | null>(null);
  const [brandListAtEnd, setBrandListAtEnd] = React.useState(false);
  const dialogRef = React.useRef<HTMLElement | null>(null);
  const contentScrollRef = React.useRef<HTMLDivElement | null>(null);
  const headingRef = React.useRef<HTMLHeadingElement | null>(null);
  const restoreFocusRef = React.useRef<HTMLElement | null>(null);
  const skipFocusRestoreRef = React.useRef(false);
  const interestOptions = React.useMemo(
    () => getOnboardingInterestOptions(config),
    [config],
  );
  const onboardingVisual = onboardingVisuals[config.mode] ?? onboardingVisuals.all;
  const brandOptions = React.useMemo(() => {
    const counts = allBrandConfig.stories.reduce<Record<string, number>>(
      (accumulator, story) => {
        accumulator[story.brand] = (accumulator[story.brand] ?? 0) + 1;
        return accumulator;
      },
      {},
    );

    return allBrandConfig.sourceNotes.map((note) => ({
      brand: note.brand,
      brandSlug: note.brandSlug,
      count: brandInventory?.[note.brandSlug] ?? counts[note.brand] ?? 0,
    }));
  }, [allBrandConfig, brandInventory]);

  React.useEffect(() => {
    onStepChange?.(step);
  }, [onStepChange, step]);

  React.useEffect(() => {
    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    return () => {
      const restoreTarget = restoreFocusRef.current;
      restoreFocusRef.current = null;
      if (!skipFocusRestoreRef.current) {
        window.requestAnimationFrame(() => restoreTarget?.focus());
      }
    };
  }, []);

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => headingRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [step]);

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const contentScroller = contentScrollRef.current;
      if (contentScroller && contentScroller.scrollTop < 96) {
        contentScroller.scrollTop = 0;
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [selectedInterests]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter(
        (element) =>
          !element.hasAttribute("disabled")
          && element.getAttribute("aria-hidden") !== "true"
          && !element.closest('[inert], [aria-hidden="true"]'),
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1)!;
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useModalIsolation(true, dialogRef);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : current.length < 2
          ? [...current, interest]
          : current,
    );
  };
  const toggleBrand = (brandName: string) => {
    const brandOption = brandOptions.find((option) => option.brand === brandName);
    if (!brandOption || brandOption.count <= 0) return;
    setSelectedBrands((current) =>
      current.includes(brandName)
        ? current.filter((item) => item !== brandName)
        : [...current, brandName],
    );
  };
  const getResult = (): HearstOnboardingResult => ({
    id: Date.now(),
    interests: selectedInterests,
    brands: selectedBrands,
    tags: selectedInterests.map((interest) => interest.toLowerCase()),
  });
  const normalizedSelectedInterests = selectedInterests.map((interest) =>
    interest.toLowerCase(),
  );
  const previewStories =
    normalizedSelectedInterests.length > 0
      ? (() => {
          const matchingStories = config.stories.filter((story) => {
            const searchableStory = [
              story.title,
              story.topic,
              story.brand,
              ...story.tags,
            ]
              .join(" ")
              .toLowerCase();
            return normalizedSelectedInterests.some((interest) =>
              searchableStory.includes(interest),
            );
          });
          const matchingStoryIds = new Set(
            matchingStories.map((story) => story.id),
          );
          return [
            ...matchingStories,
            ...config.stories.filter(
              (story) => !matchingStoryIds.has(story.id),
            ),
          ].slice(0, 3);
        })()
      : [];

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm sm:p-6">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <section
        ref={dialogRef}
        className="relative z-10 mx-auto grid h-[min(760px,calc(100dvh-2rem))] w-full max-w-5xl overflow-hidden rounded-[8px] bg-background shadow-2xl sm:h-[min(760px,calc(100dvh-3rem))] lg:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.05fr)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hearst-onboarding-title"
        aria-describedby="hearst-onboarding-description"
      >
        <div className="relative hidden h-full overflow-hidden bg-muted lg:block">
          <Image
            src={onboardingVisual.image}
            alt=""
            fill
            sizes="50vw"
            className="absolute inset-0 h-full w-full object-cover outline-none ring-0"
            style={{ objectPosition: onboardingVisual.objectPosition }}
            aria-hidden
            preload
          />
        </div>

        <div className="flex min-h-0 flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-2.5">
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
              Personalize your feed
            </p>
            <Button
              variant="outline"
              size="icon"
              className="size-11"
              onClick={onClose}
              aria-label="Close onboarding"
            >
              <X className="h-4 w-4" aria-hidden />
            </Button>
          </div>

          <div
            ref={contentScrollRef}
            className="min-h-0 flex-1 overflow-y-auto p-5 [overflow-anchor:none] sm:p-8"
          >
            {step === 1 ? (
              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2
                      ref={headingRef}
                      id="hearst-onboarding-title"
                      tabIndex={-1}
                      className="headline text-3xl leading-tight outline-none sm:text-4xl"
                    >
                      Pick what you want to see more often.
                    </h2>
                    <p
                      id="hearst-onboarding-description"
                      className="mt-3 text-sm leading-6 text-muted-foreground"
                    >
                      Choose one or two interests. Your preview updates immediately.
                    </p>
                  </div>
                  <p className="inline-flex h-8 shrink-0 items-center rounded-full bg-muted px-3 text-xs font-bold text-foreground">
                    <span className="sr-only">Step 1 of 3. </span>
                    {selectedInterests.length} of 2 selected
                  </p>
                </div>
                <div className="mt-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
                  {interestOptions.map((interest) => {
                    const active = selectedInterests.includes(interest);
                    const selectionLimitReached =
                      selectedInterests.length >= 2 && !active;
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        disabled={selectionLimitReached}
                        className={cn(
                          "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                          selectionLimitReached
                            && "cursor-not-allowed opacity-45",
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted",
                        )}
                        aria-pressed={active}
                      >
                        {active ? (
                          <Check className="h-3.5 w-3.5" aria-hidden />
                        ) : null}
                        {interest}
                      </button>
                    );
                  })}
                </div>
                <div
                  className="mt-7 border-t border-border pt-6"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">
                    Your feed preview
                  </p>
                  {previewStories.length > 0 ? (
                    <div className="mt-3 space-y-3">
                      {previewStories.map((story) => (
                        <article
                          key={story.id}
                          className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 rounded-[8px] border border-border bg-muted/25 p-2.5"
                        >
                          <div className="relative aspect-square overflow-hidden rounded-[6px] bg-muted">
                            <Image
                              src={story.image}
                              alt=""
                              fill
                              sizes="72px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 self-center">
                            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-wider text-primary">
                              {story.brand} · {story.topic}
                            </p>
                            <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-5">
                              {story.title}
                            </h3>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 rounded-[8px] border border-dashed border-border bg-muted/20 px-4 py-5">
                      <p className="text-sm font-semibold">
                        Choose an interest to preview your feed.
                      </p>
                      <p className="mt-1 text-sm leading-5 text-muted-foreground">
                        You can change these choices later from your profile.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2
                      ref={headingRef}
                      id="hearst-onboarding-title"
                      tabIndex={-1}
                      className="headline text-3xl leading-tight outline-none sm:text-4xl"
                    >
                      Follow brands you trust.
                    </h2>
                    <p
                      id="hearst-onboarding-description"
                      className="mt-3 text-sm leading-6 text-muted-foreground"
                    >
                      Optional: choose the publications you return to most. Your
                      feed will still discover across Hearst, while these voices
                      get a stronger signal.
                    </p>
                  </div>
                  <p className="inline-flex h-8 shrink-0 items-center rounded-full bg-muted px-3 text-xs font-bold text-foreground">
                    <span className="sr-only">Step 2 of 3. </span>
                    {selectedBrands.length} selected
                  </p>
                </div>
                <p className="mb-2 mt-6 text-xs font-semibold text-muted-foreground">
                  Scroll to browse all {brandOptions.length} brands
                </p>
                <div className="relative">
                  <div
                    role="region"
                    aria-label={`Choose from ${brandOptions.length} Hearst brands`}
                    tabIndex={0}
                    onScroll={(event) => {
                      const scroller = event.currentTarget;
                      setBrandListAtEnd(
                        scroller.scrollTop + scroller.clientHeight
                          >= scroller.scrollHeight - 8,
                      );
                    }}
                    className="max-h-[min(42dvh,340px)] overflow-y-scroll overscroll-contain pr-1 [scrollbar-gutter:stable] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <div className="grid gap-2 sm:grid-cols-2">
                      {brandOptions.map((brandOption) => {
                        const active = selectedBrands.includes(brandOption.brand);
                        const unavailable = brandOption.count <= 0;
                        return (
                          <button
                            key={brandOption.brandSlug}
                            type="button"
                            onClick={() => toggleBrand(brandOption.brand)}
                            disabled={unavailable}
                            className={cn(
                              "flex min-h-[72px] min-w-0 items-center gap-3 rounded-[8px] border p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                              unavailable
                                && "cursor-not-allowed opacity-55",
                              active
                                ? "border-primary bg-primary/10 text-foreground"
                                : "border-border bg-background hover:border-primary/50 hover:bg-muted",
                            )}
                            aria-pressed={active}
                          >
                            <BrandSourceIcon
                              brand={brandOption.brand}
                              brandSlug={brandOption.brandSlug}
                              className="h-8 w-8 rounded-[6px]"
                            />
                            <span className="min-w-0">
                              <span className="block break-words text-sm font-bold leading-5">
                                {brandOption.brand}
                              </span>
                              <span className="mt-0.5 block text-xs text-muted-foreground">
                                {unavailable
                                  ? "Unavailable in this demo"
                                  : `${brandOption.count} stories`}
                              </span>
                            </span>
                            {active ? (
                              <span className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Check className="h-3 w-3" aria-hidden />
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {!brandListAtEnd ? (
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 flex h-10 items-end justify-center bg-gradient-to-t from-background via-background/90 to-transparent pb-1"
                      aria-hidden="true"
                    >
                      <span className="inline-flex items-center gap-1 rounded-full bg-background px-2 py-1 text-xs font-semibold text-foreground">
                        More brands below
                        <ChevronDown className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="text-center">
                <p className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  <Check className="h-5 w-5" aria-hidden />
                </p>
                <h2
                  ref={headingRef}
                  id="hearst-onboarding-title"
                  tabIndex={-1}
                  className="headline mx-auto mt-5 max-w-xl text-4xl leading-tight outline-none"
                >
                  Your feed is ready.
                </h2>
                <p
                  id="hearst-onboarding-description"
                  className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground"
                >
                  Your For You page now reflects your selected interests and
                  brands. Save it to a profile for access across devices, or
                  keep reading with these choices in this browser.
                </p>
                <p className="sr-only">Step 3 of 3.</p>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 border-t border-border px-5 py-2.5 sm:flex-row sm:items-center sm:justify-between">
            {step === 1 ? (
              <div className="flex flex-wrap items-center gap-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex min-h-11 items-center whitespace-nowrap text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  Not now
                </button>
                <button
                  type="button"
                  onClick={() => {
                    skipFocusRestoreRef.current = true;
                    onSignIn();
                  }}
                  className="inline-flex min-h-11 items-center whitespace-nowrap text-sm font-semibold text-primary hover:underline"
                >
                  Already have a profile? Sign in
                </button>
              </div>
            ) : step === 2 ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex min-h-11 items-center whitespace-nowrap text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-11 items-center whitespace-nowrap text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                Continue without an account
              </button>
            )}
            <div className="flex flex-wrap justify-end gap-2">
              {step === 1 ? (
                <Button
                  size="sm"
                  className="min-h-11"
                  onClick={() => setStep(2)}
                  disabled={selectedInterests.length < 1}
                >
                  Continue
                </Button>
              ) : null}
              {step === 2 ? (
                <Button
                  size="sm"
                  className="min-h-11"
                  onClick={() => {
                    const result = getResult();
                    setCompletedResult(result);
                    onComplete(result);
                    setStep(3);
                  }}
                >
                  Use this feed
                </Button>
              ) : null}
              {step === 3 ? (
                <Button
                  size="sm"
                  className="min-h-11"
                  onClick={() => {
                    if (!completedResult) return;
                    skipFocusRestoreRef.current = true;
                    onCreateProfile(completedResult);
                  }}
                  disabled={!completedResult}
                >
                  Save my feed
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>,
    portalTarget,
  );
}
