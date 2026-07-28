"use client";

import React from "react";
import { createPortal } from "react-dom";

import type {
  LifestyleRiverProfile,
  LifestyleRiverStory,
} from "@/components/lifestyle-river-types";
import { getLifestyleCardKind } from "@/components/hearst-plus/story-presentation";
import { Button } from "@/components/ui/button";
import { X } from "@/components/ui/icons";
import {
  useBodyPortalTarget,
  useModalIsolation,
} from "@/components/ui/use-modal-isolation";

export type StakeholderDemoDaypart =
  | "morning"
  | "afternoon"
  | "evening"
  | "lateNight";

export type StakeholderDemoState = {
  daypart: StakeholderDemoDaypart;
  returnHours: number;
  contentDay: "today" | "nextDay";
  previousLeadId?: string;
  isSimulated: boolean;
};

export type StakeholderDaypart = {
  label: string;
  time: string;
  description: string;
};

export type StakeholderConsoleConfig = {
  productName: string;
  dayparts: Record<StakeholderDemoDaypart, StakeholderDaypart>;
  liveFeedStatus?: {
    fetchedAt: string;
    isFallback: boolean;
  };
};

export type StakeholderScoreBreakdown = {
  popularity: number;
  followedTopic: number;
  followedBrand: number;
  savedTag: number;
  moreLikeThis: number;
  savedStory: number;
  recency: number;
  timeOfDay: number;
  defaultLead: number;
  returnFreshness: number;
  nextDayNovelty: number;
  repeatLeadPenalty: number;
  hidden: number;
  total: number;
};

export type StakeholderPersonalizationConsoleProps = {
  open: boolean;
  onClose: () => void;
  demoState: StakeholderDemoState;
  profile: LifestyleRiverProfile;
  topStory?: Pick<LifestyleRiverStory, "id" | "title">;
  topBreakdown?: StakeholderScoreBreakdown | null;
  topStrategyReason?: string | null;
  config: StakeholderConsoleConfig;
  activeFilter: string;
  inventoryStories: LifestyleRiverStory[];
  eligibleStories: LifestyleRiverStory[];
  scopeLabel: string;
  onDaypartChange: (daypart: StakeholderDemoDaypart) => void;
  onSimulateReturn: (
    hours: number,
    daypart: StakeholderDemoDaypart,
    contentDay?: StakeholderDemoState["contentDay"],
    previousLeadId?: string,
  ) => void;
  onApplyBehaviorPreset: (
    preset: "homeCook" | "shoppingBrowser" | "wellnessReader",
  ) => void;
  onResetDemo: () => void;
  children?: React.ReactNode;
};

const focusableSelector =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function isVisibleFocusTarget(element: HTMLElement) {
  return (
    element.isConnected
    && element.getClientRects().length > 0
    && !element.closest('[inert], [aria-hidden="true"]')
  );
}

function formatLiveFeedUpdatedAt(fetchedAt: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
    timeZoneName: "short",
  }).format(new Date(fetchedAt));
}

function StakeholderPersonalizationPanel({
  demoState,
  topStory,
  topBreakdown,
  topStrategyReason,
  config,
  onDaypartChange,
  onSimulateReturn,
  onApplyBehaviorPreset,
  onResetDemo,
}: Pick<
  StakeholderPersonalizationConsoleProps,
  | "demoState"
  | "topStory"
  | "topBreakdown"
  | "topStrategyReason"
  | "config"
  | "onDaypartChange"
  | "onSimulateReturn"
  | "onApplyBehaviorPreset"
  | "onResetDemo"
>) {
  const activeDaypart = config.dayparts[demoState.daypart];

  return (
    <section
      className="rounded-[8px] border border-border bg-[var(--hp-surface)] text-foreground"
      aria-label="Personalization demo controls"
    >
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
                Personalization Demo
              </p>
              <h2 className="headline mt-1 text-2xl leading-tight">
                Show how the river changes when the reader comes back.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                This demo follows the product strategy for a daily destination:
                keep the first visit editorially useful, then refresh the lead
                on return visits using recency, daypart mission, reader intent,
                and diversity rules.
              </p>
            </div>
            <Button
              variant="outline"
              size="xs"
              className="min-h-11 sm:min-h-7"
              onClick={onResetDemo}
            >
              Reset demo
            </Button>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                Time of day
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(Object.keys(config.dayparts) as StakeholderDemoDaypart[]).map(
                  (daypart) => {
                    const item = config.dayparts[daypart];
                    const active = demoState.daypart === daypart;

                    return (
                      <Button
                        key={daypart}
                        variant={active ? "default" : "outline"}
                        size="xs"
                        className="min-h-11 sm:min-h-7"
                        onClick={() => onDaypartChange(daypart)}
                        aria-pressed={active}
                      >
                        {item.time}
                      </Button>
                    );
                  },
                )}
              </div>
              <p className="mt-3 text-sm font-bold">{activeDaypart.label}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {activeDaypart.description}
              </p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Changing the hour simulates a return visit, so the previous lead
                is deprioritized and a fresher story that fits the moment can
                move up.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                Return visit
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  className="min-h-11 sm:min-h-7"
                  onClick={() => onSimulateReturn(4, "afternoon")}
                >
                  +4 hours
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  className="min-h-11 sm:min-h-7"
                  onClick={() => onSimulateReturn(10, "evening")}
                >
                  Evening return
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  className="min-h-11 sm:min-h-7"
                  onClick={() => onSimulateReturn(14, "lateNight")}
                >
                  Late night
                </Button>
                <Button
                  variant={
                    demoState.contentDay === "nextDay"
                      ? "default"
                      : "outline"
                  }
                  size="xs"
                  className="min-h-11 sm:min-h-7"
                  onClick={() =>
                    onSimulateReturn(
                      24,
                      "morning",
                      "nextDay",
                      topStory?.id,
                    )
                  }
                >
                  Next day
                </Button>
              </div>
              <p className="mt-3 text-sm font-bold">
                {demoState.contentDay === "nextDay"
                  ? "Next day edition"
                  : demoState.returnHours > 0
                    ? `Back after ${demoState.returnHours} hours`
                    : "First visit today"}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {demoState.contentDay === "nextDay"
                  ? "A refreshed story pool loads first, then the selected time of day ranks that new edition."
                  : "Return visits lift stories that are fresh since the last session and relevant to the new context."}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                Behavior presets
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  className="min-h-11 sm:min-h-7"
                  onClick={() => onApplyBehaviorPreset("homeCook")}
                >
                  Home cook
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  className="min-h-11 sm:min-h-7"
                  onClick={() => onApplyBehaviorPreset("shoppingBrowser")}
                >
                  Shops picks
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  className="min-h-11 sm:min-h-7"
                  onClick={() => onApplyBehaviorPreset("wellnessReader")}
                >
                  Wellness
                </Button>
              </div>
              <p className="mt-3 text-sm font-bold">
                Demo behavior changes ranking live
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Presets simulate saves, follows, more-like-this activity, and
                topic intent.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border p-4 sm:p-5 lg:border-l lg:border-t-0">
          <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
            Current top story score
          </p>
          {topStory && topBreakdown ? (
            <div className="mt-3 space-y-3 text-sm">
              <p className="font-bold leading-5">{topStory.title}</p>
              <dl className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-background p-2">
                  <dt className="text-muted-foreground">Popularity</dt>
                  <dd className="font-bold">{topBreakdown.popularity}</dd>
                </div>
                <div className="bg-background p-2">
                  <dt className="text-muted-foreground">Recency</dt>
                  <dd className="font-bold">{topBreakdown.recency}</dd>
                </div>
                <div className="bg-background p-2">
                  <dt className="text-muted-foreground">Behavior</dt>
                  <dd className="font-bold">
                    {topBreakdown.followedTopic
                      + topBreakdown.followedBrand
                      + topBreakdown.savedTag
                      + topBreakdown.moreLikeThis
                      + topBreakdown.savedStory}
                  </dd>
                </div>
                <div className="bg-background p-2">
                  <dt className="text-muted-foreground">Daypart</dt>
                  <dd className="font-bold">{topBreakdown.timeOfDay}</dd>
                </div>
                <div className="bg-background p-2">
                  <dt className="text-muted-foreground">Fresh return</dt>
                  <dd className="font-bold">
                    {topBreakdown.returnFreshness}
                  </dd>
                </div>
                <div className="bg-background p-2">
                  <dt className="text-muted-foreground">Repeat guard</dt>
                  <dd className="font-bold">
                    {topBreakdown.repeatLeadPenalty}
                  </dd>
                </div>
                <div className="bg-background p-2">
                  <dt className="text-muted-foreground">Configured lead</dt>
                  <dd className="font-bold">{topBreakdown.defaultLead}</dd>
                </div>
                <div className="bg-background p-2">
                  <dt className="text-muted-foreground">
                    Next-day novelty
                  </dt>
                  <dd className="font-bold">
                    {topBreakdown.nextDayNovelty}
                  </dd>
                </div>
              </dl>
              {topStrategyReason ? (
                <p className="text-xs leading-5 text-muted-foreground">
                  Strategy link: {topStrategyReason}.
                </p>
              ) : null}
              <p className="rounded-[8px] bg-primary px-3 py-2 text-center text-sm font-bold text-primary-foreground">
                Total score {topBreakdown.total}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              No story selected in the current filter.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function StakeholderEvidenceGuide({
  inventoryStories,
  eligibleStories,
  scopeLabel,
  profile,
  config,
  activeFilter,
}: Pick<
  StakeholderPersonalizationConsoleProps,
  | "inventoryStories"
  | "eligibleStories"
  | "scopeLabel"
  | "profile"
  | "config"
  | "activeFilter"
>) {
  const representedBrands = new Set(
    inventoryStories.map((story) => story.brandSlug),
  ).size;
  const playableVideos = inventoryStories.filter(
    (story) => getLifestyleCardKind(story) === "video",
  ).length;
  const feedState = config.liveFeedStatus
    ? config.liveFeedStatus.isFallback
      ? "Cached fallback"
      : "Current feed"
    : "Bundled RSS catalog";

  const facts = [
    {
      label: "Current scope",
      value: `${scopeLabel} · ${activeFilter}`,
      detail: `${eligibleStories.length.toLocaleString()} items are currently eligible after the active route, category, brand, and reader exclusions.`,
    },
    {
      label: "Loaded inventory",
      value: `${inventoryStories.length.toLocaleString()} unique items`,
      detail: `${representedBrands} represented brands · ${playableVideos.toLocaleString()} playable videos. The count updates as progressive pages arrive.`,
    },
    {
      label: "Feed state",
      value: feedState,
      detail: config.liveFeedStatus
        ? `Feed response received ${formatLiveFeedUpdatedAt(config.liveFeedStatus.fetchedAt)}.`
        : "This view is using the deduplicated catalog bundled with the current build.",
    },
    {
      label: "Reader signals",
      value: `${profile.followedTopics.length} topics · ${profile.followedBrands.length} brands`,
      detail: `${profile.savedIds.length} saved · ${profile.hiddenIds.length} hidden. These prototype preferences are browser-local.`,
    },
  ];

  return (
    <section
      className="mt-4 overflow-hidden rounded-[8px] border border-border bg-[var(--hp-surface)] text-foreground"
      aria-labelledby="stakeholder-evidence-guide-title"
    >
      <div className="border-b border-border p-4 sm:p-5">
        <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
          Live evidence
        </p>
        <h2
          id="stakeholder-evidence-guide-title"
          className="headline mt-1 text-2xl leading-tight"
        >
          Facts from the running experience, not a static presentation.
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Inventory, feed state, active scope, reader signals, and the score
          above are computed from the current application state. They update
          when the feed, filter, profile, or demo moment changes.
        </p>
      </div>
      <dl className="grid md:grid-cols-2 xl:grid-cols-4">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="border-b border-border p-4 last:border-b-0 md:[&:nth-child(odd)]:border-r xl:border-b-0 xl:[&:not(:last-child)]:border-r"
          >
            <dt className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
              {fact.label}
            </dt>
            <dd>
              <p className="mt-2 text-sm font-bold leading-5">{fact.value}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {fact.detail}
              </p>
            </dd>
          </div>
        ))}
      </dl>
      <div className="border-t border-border bg-muted px-4 py-3 text-xs leading-5 text-muted-foreground sm:px-5">
        <span className="font-bold text-foreground">
          Verification boundary:
        </span>{" "}
        this console describes the implemented prototype. It does not claim
        production identity, analytics, consent, publishing, or cross-device
        preference storage.
      </div>
    </section>
  );
}

export function StakeholderPersonalizationConsole({
  open,
  ...props
}: StakeholderPersonalizationConsoleProps) {
  const portalTarget = useBodyPortalTarget();

  if (!open || !portalTarget) return null;

  return (
    <StakeholderPersonalizationConsoleContent
      {...props}
      portalTarget={portalTarget}
    />
  );
}

type StakeholderPersonalizationConsoleContentProps = Omit<
  StakeholderPersonalizationConsoleProps,
  "open"
> & {
  portalTarget: HTMLElement;
};

function StakeholderPersonalizationConsoleContent({
  onClose,
  children,
  portalTarget,
  ...props
}: StakeholderPersonalizationConsoleContentProps) {
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const returnFocusRef = React.useRef<HTMLElement | null>(null);
  const onCloseRef = React.useRef(onClose);

  React.useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  React.useEffect(() => {
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      const dialog = dialogRef.current;
      if (
        !dialog
        || dialog.inert
        || dialog.getAttribute("aria-hidden") === "true"
      ) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter(isVisibleFocusTarget);
      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1)!;
      const activeElement = document.activeElement;

      if (!dialog.contains(activeElement)) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
      } else if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown, true);
      const returnTarget = returnFocusRef.current;
      returnFocusRef.current = null;
      window.requestAnimationFrame(() => {
        if (returnTarget && isVisibleFocusTarget(returnTarget)) {
          returnTarget.focus();
        }
      });
    };
  }, []);

  useModalIsolation(true, dialogRef);

  return createPortal(
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[200] bg-foreground/55 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stakeholder-personalization-console-title"
      tabIndex={-1}
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="absolute inset-0 mx-auto flex w-full max-w-6xl flex-col overflow-hidden bg-background shadow-2xl sm:inset-x-8 sm:bottom-auto sm:top-12 sm:max-h-[calc(100vh-6rem)] sm:w-auto">
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p
              id="stakeholder-personalization-console-title"
              className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary"
            >
              Stakeholder Demo Console
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Control daypart, return visit, behavior presets, and score
              explanation.
            </p>
          </div>
          <Button
            ref={closeButtonRef}
            variant="outline"
            size="icon"
            className="size-11 shrink-0"
            onClick={onClose}
            aria-label="Close personalization demo"
          >
            <X className="h-4 w-4" aria-hidden />
          </Button>
        </div>
        <div className="overflow-y-auto p-4 sm:p-5">
          <StakeholderPersonalizationPanel {...props} />
          <StakeholderEvidenceGuide {...props} />
          {children}
        </div>
      </div>
    </div>,
    portalTarget,
  );
}
