"use client";

/* eslint-disable @next/next/no-img-element -- Decorative onboarding artwork uses external Fluent Emoji library assets. */

import React from "react";
import { createPortal } from "react-dom";
import { BrandLogo } from "@/components/brand-logo";
import { fluentEmojiPng } from "@/components/hearst-plus/fluent-emoji-art";
import type { HearstOnboardingResult } from "@/components/hearst-plus/onboarding-modal";
import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  Sparkles,
  X,
} from "@/components/ui/icons";
import { useBodyPortalTarget, useModalIsolation } from "@/components/ui/use-modal-isolation";
import { cn } from "@/lib/utils";

export const goodHousekeepingOnboardingStorageKey = "hearst-good-housekeeping-onboarding-v1";

type HomeStyle = "efficient-home" | "family-helper" | "tested-shopper";

type GoodHousekeepingOnboardingAnswers = {
  name: string;
  location: string;
  homeStyle: HomeStyle | null;
  interests: string[];
  preferences: string[];
  priority: string;
};

type GoodHousekeepingOnboardingModalProps = {
  open: boolean;
  onClose: () => void;
  onComplete: (result: HearstOnboardingResult) => void;
  onCreateProfile: (result: HearstOnboardingResult) => void;
  onSignIn: () => void;
};

const ghBrand = {
  primary: "#53C2BE",
  secondary: "#198294",
  ink: "#101828",
  muted: "#5A6472",
  line: "#B9CDD0",
  surface: "#F5FAFA",
  pale: "#E3F5F4",
} as const;

const goodHousekeepingHeadlineFont = '"Barlow Semi Condensed", system-ui, sans-serif';

const homeStyles = [
  {
    id: "efficient-home",
    title: "Efficient home",
    description: "Cleaning, organizing, and time-saving routines",
    imageSrc: fluentEmojiPng("House with garden"),
  },
  {
    id: "family-helper",
    title: "Family helper",
    description: "Food, health, holidays, kids, and everyday support",
    imageSrc: fluentEmojiPng("Fork and knife with plate"),
  },
  {
    id: "tested-shopper",
    title: "Tested shopper",
    description: "Lab-backed products before you buy",
    imageSrc: fluentEmojiPng("Shield"),
  },
] as const;

const interestOptions = [
  "Cleaning",
  "Home organizing",
  "Recipes",
  "Product tests",
  "Beauty",
  "Wellness",
] as const;

const preferenceOptions = [
  "No preference",
  "Quick wins",
  "Budget-friendly",
  "Family-friendly",
  "Small spaces",
  "Lab-tested picks",
] as const;

const prioritySuggestions = [
  "Cleaner kitchen routine",
  "Best tested appliances",
  "Simple weeknight dinners",
  "Home organization ideas",
  "Beauty products that work",
  "Family wellness checklist",
  "Laundry tips",
  "Holiday hosting plan",
  "Small-space storage",
  "Safer cleaning products",
] as const;

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function buildGoodHousekeepingOnboardingResult(
  answers: GoodHousekeepingOnboardingAnswers,
): HearstOnboardingResult {
  const homeStyle = homeStyles.find((option) => option.id === answers.homeStyle);
  const meaningfulPreferences = answers.preferences.filter(
    (preference) => preference !== "No preference",
  );
  const interests = unique([
    ...(homeStyle ? [homeStyle.title] : []),
    ...answers.interests,
    ...meaningfulPreferences,
    answers.priority,
  ]);

  return {
    id: Date.now(),
    interests,
    brands: ["Good Housekeeping"],
    tags: unique([
      "good housekeeping",
      "home",
      answers.location.toLowerCase(),
      ...interests.map((interest) => interest.toLowerCase()),
    ]),
  };
}

export function GoodHousekeepingOnboardingModal({
  open,
  ...props
}: GoodHousekeepingOnboardingModalProps) {
  const portalTarget = useBodyPortalTarget();

  if (!open || !portalTarget) return null;

  return <GoodHousekeepingOnboardingModalContent {...props} portalTarget={portalTarget} />;
}

type GoodHousekeepingOnboardingModalContentProps = Omit<
  GoodHousekeepingOnboardingModalProps,
  "open"
> & {
  portalTarget: HTMLElement;
};

function GoodHousekeepingOnboardingModalContent({
  onClose,
  onComplete,
  onCreateProfile,
  onSignIn,
  portalTarget,
}: GoodHousekeepingOnboardingModalContentProps) {
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);
  const [showWelcome, setShowWelcome] = React.useState(false);
  const [readerName, setReaderName] = React.useState("");
  const [readerLocation, setReaderLocation] = React.useState("");
  const [isDetectingLocation, setIsDetectingLocation] = React.useState(false);
  const [locationMessage, setLocationMessage] = React.useState("");
  const [homeStyle, setHomeStyle] = React.useState<HomeStyle | null>(null);
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>([]);
  const [selectedPreferences, setSelectedPreferences] = React.useState<string[]>([
    "No preference",
  ]);
  const [priority, setPriority] = React.useState("");
  const [activePriorityIndex, setActivePriorityIndex] = React.useState(0);
  const dialogRef = React.useRef<HTMLElement | null>(null);
  const headingRef = React.useRef<HTMLHeadingElement | null>(null);
  const restoreFocusRef = React.useRef<HTMLElement | null>(null);
  const skipFocusRestoreRef = React.useRef(false);

  React.useEffect(() => {
    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

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
  }, [showWelcome, step]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getAttribute("aria-hidden") !== "true");

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable.at(-1)!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useModalIsolation(true, dialogRef);

  const answers = React.useMemo<GoodHousekeepingOnboardingAnswers>(() => ({
    name: readerName.trim(),
    location: readerLocation.trim(),
    homeStyle,
    interests: selectedInterests,
    preferences: selectedPreferences,
    priority: priority.trim(),
  }), [homeStyle, priority, readerLocation, readerName, selectedInterests, selectedPreferences]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : current.length < 3
          ? [...current, interest]
          : current,
    );
  };

  const togglePreference = (preference: string) => {
    setSelectedPreferences((current) => {
      if (preference === "No preference") return ["No preference"];
      const withoutDefault = current.filter((item) => item !== "No preference");
      return withoutDefault.includes(preference)
        ? withoutDefault.filter((item) => item !== preference)
        : [...withoutDefault, preference];
    });
  };

  const priorityOptions = React.useMemo(() => {
    const query = priority.trim().toLowerCase();
    if (!query) return prioritySuggestions;
    const matches = prioritySuggestions.filter((item) => item.toLowerCase().includes(query));
    return matches.length > 0 ? matches : [`Use “${priority.trim()}”`];
  }, [priority]);

  const selectPriority = (value: string) => {
    const customMatch = value.match(/^Use “(.+)”$/);
    setPriority(customMatch?.[1] ?? value);
    setActivePriorityIndex(0);
  };

  const handlePriorityKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActivePriorityIndex((current) => Math.min(priorityOptions.length - 1, current + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActivePriorityIndex((current) => Math.max(0, current - 1));
    } else if (event.key === "Enter") {
      const activePriority = priorityOptions[activePriorityIndex];
      if (!activePriority) return;
      event.preventDefault();
      selectPriority(activePriority);
    } else if (event.key === "Escape") {
      event.currentTarget.blur();
    }
  };

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      setLocationMessage("Location detection is not supported in this browser.");
      return;
    }

    setIsDetectingLocation(true);
    setLocationMessage("Detecting your location...");

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        });
      });
      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
        );
        if (!response.ok) throw new Error("Reverse geocoding failed");

        const data = await response.json() as {
          city?: string;
          locality?: string;
          principalSubdivision?: string;
        };

        if (data.city && data.principalSubdivision) {
          setReaderLocation(`${data.city}, ${data.principalSubdivision}`);
        } else if (data.locality) {
          setReaderLocation(data.locality);
        } else {
          setReaderLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
        setLocationMessage("Location added.");
      } catch {
        setReaderLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setLocationMessage("Location added from your coordinates.");
      }
    } catch {
      setLocationMessage("Unable to detect location. You can enter it manually.");
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const saveAnswers = (result: HearstOnboardingResult) => {
    try {
      window.localStorage.setItem(
        goodHousekeepingOnboardingStorageKey,
        JSON.stringify({ completed: true, answers, result }),
      );
    } catch {
      // Personalization still applies for this session when storage is unavailable.
    }
  };

  const finish = (createProfile: boolean) => {
    const result = buildGoodHousekeepingOnboardingResult(answers);
    saveAnswers(result);
    skipFocusRestoreRef.current = createProfile;
    if (createProfile) {
      onCreateProfile(result);
    } else {
      onComplete(result);
      onClose();
    }
  };

  const goToNextStep = () => setStep((current) => Math.min(4, current + 1) as 1 | 2 | 3 | 4);
  const goToPreviousStep = () => setStep((current) => Math.max(1, current - 1) as 1 | 2 | 3 | 4);

  const canContinue = step === 1
    ? readerName.trim().length > 0
    : step === 2
      ? Boolean(homeStyle)
      : step === 3
        ? selectedInterests.length > 0
        : priority.trim().length > 0;

  const heading = step === 1
    ? "Start your home"
    : step === 2
      ? "What kind of help do you want?"
      : step === 3
        ? "What should Good Housekeeping tune for you?"
        : "Choose your first useful win";
  const description = step === 1
    ? "Let us personalize practical ideas for your home and routines."
    : step === 2
      ? "Pick the path that feels most useful right now."
      : step === 3
        ? "Pick up to three interests, then add any preferences."
        : "Start with one topic you would like to see more often.";
  const selectedHomeStyleTitle =
    homeStyles.find((option) => option.id === homeStyle)?.title ?? "Good Housekeeping reader";
  const welcomeName = readerName.trim().split(/\s+/)[0] || "there";

  return createPortal(
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-[#1F222A]/88 p-3 backdrop-blur-sm sm:p-6">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="good-housekeeping-onboarding-title"
        aria-describedby="good-housekeeping-onboarding-description"
        className="relative z-10 flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[680px] flex-col overflow-hidden rounded-[12px] bg-[#F8FBFB] text-[#101828] shadow-2xl sm:max-h-[calc(100dvh-3rem)]"
      >
        <Button
          data-modal-close
          variant="outline"
          size="icon-lg"
          className="absolute right-4 top-4 z-20 size-10 rounded-full border-[#AEB7C3] bg-white text-[#1F222A] hover:bg-[#E3F5F4] sm:right-5 sm:top-5"
          onClick={onClose}
          aria-label="Close Good Housekeeping onboarding"
        >
          <X className="size-4" aria-hidden />
        </Button>

        {showWelcome ? (
          <GoodHousekeepingWelcomeStep
            name={welcomeName}
            cardName={readerName.trim() || "Good Housekeeping Reader"}
            location={readerLocation.trim() || "Your Home"}
            homeStyle={selectedHomeStyleTitle}
            priority={priority.trim() || "Useful home ideas"}
            headingRef={headingRef}
            onBack={() => setShowWelcome(false)}
            onClose={() => finish(false)}
          />
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
              <div className="mx-auto flex max-w-[560px] flex-col items-center">
                <StepBadge step={step} />

                <div className="mt-4 text-center">
                  <h2
                    ref={headingRef}
                    id="good-housekeeping-onboarding-title"
                    tabIndex={-1}
                    className="text-balance text-[1.9rem] font-extrabold leading-[1.05] tracking-tight text-[#198294] outline-none sm:text-[2.1rem]"
                    style={{ fontFamily: goodHousekeepingHeadlineFont }}
                  >
                    {heading}
                  </h2>
                  <p
                    id="good-housekeeping-onboarding-description"
                    className="mx-auto mt-3 max-w-[42ch] text-base leading-6 text-[#5A6472] sm:text-xl"
                  >
                    {description}
                  </p>
                </div>

                {step === 1 ? (
                  <div className="mt-6 w-full rounded-[12px] bg-white px-4 py-5 shadow-[0_16px_36px_rgba(16,24,40,0.08)] sm:px-5">
                    <label className="block text-base font-medium text-[#343944]">
                      What is your name?
                      <input
                        className="mt-2 h-12 w-full rounded-[10px] border border-[#AEB7C3] bg-white px-4 text-base font-medium text-[#101828] outline-none transition-colors placeholder:text-[#AEB7C3] focus:border-[#198294] focus:ring-4 focus:ring-[#53C2BE]/20"
                        placeholder="Name"
                        value={readerName}
                        onChange={(event) => setReaderName(event.target.value)}
                        autoComplete="given-name"
                      />
                    </label>
                    <label className="mt-6 block text-base font-medium text-[#343944]">
                      Where is home? <span className="text-[#5A6472]">(Optional)</span>
                      <span className="relative mt-2 block">
                        <input
                          className="h-12 w-full rounded-[10px] border border-[#AEB7C3] bg-white px-4 pr-12 text-base font-medium text-[#101828] outline-none transition-colors placeholder:text-[#AEB7C3] focus:border-[#198294] focus:ring-4 focus:ring-[#53C2BE]/20"
                          placeholder="Current Location"
                          value={readerLocation}
                          onChange={(event) => {
                            setReaderLocation(event.target.value);
                            setLocationMessage("");
                          }}
                          autoComplete="address-level2"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-[#242832] transition-colors hover:bg-[#E3F5F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#198294] disabled:cursor-wait disabled:opacity-60"
                          onClick={detectLocation}
                          disabled={isDetectingLocation}
                          aria-label={isDetectingLocation ? "Detecting location" : "Auto-detect location"}
                        >
                          <MapPin
                            className={cn("size-6", isDetectingLocation && "animate-pulse text-[#198294]")}
                            aria-hidden
                          />
                        </button>
                      </span>
                      {locationMessage ? (
                        <span className="mt-2 block text-sm font-semibold text-[#5A6472]" aria-live="polite">
                          {locationMessage}
                        </span>
                      ) : null}
                    </label>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="mt-6 grid w-full gap-3 sm:grid-cols-3">
                    {homeStyles.map(({ id, title, description: optionDescription, imageSrc }) => {
                      const selected = homeStyle === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setHomeStyle(id)}
                          className={cn(
                            "group flex min-h-[84px] flex-row items-center justify-start gap-3 rounded-[12px] border p-4 text-left shadow-[0_8px_16px_rgba(16,24,40,0.05)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#198294] motion-reduce:transition-none sm:min-h-[132px] sm:flex-col sm:justify-center sm:gap-0 sm:p-4 sm:text-center",
                            selected
                              ? "border-[#198294] bg-[#198294] text-white"
                              : "border-[#D6DDE6] bg-white text-[#101828] hover:bg-[#E3F5F4]",
                          )}
                        >
                          <span className={cn(
                            "flex size-10 shrink-0 items-center justify-center rounded-full",
                            selected ? "bg-white" : "bg-[#E5EAF0]",
                          )}>
                            <img
                              src={imageSrc}
                              alt=""
                              className="size-7 object-contain"
                              aria-hidden="true"
                            />
                          </span>
                          <span className="min-w-0 sm:mt-4">
                            <span className="block text-base font-bold">{title}</span>
                            <span className={cn("mt-1 block text-sm leading-5", selected ? "text-white/85" : "text-[#5A6472]")}>
                              {optionDescription}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className="mt-5 grid w-full gap-3 lg:grid-cols-[1fr_0.85fr]">
                    <section className="rounded-[10px] bg-white p-4 shadow-[0_12px_28px_rgba(16,24,40,0.07)]">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#198294]">
                        Interests
                      </p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {interestOptions.map((interest) => {
                          const selected = selectedInterests.includes(interest);
                          const limitReached = selectedInterests.length >= 3 && !selected;
                          return (
                            <SelectionButton
                              key={interest}
                              selected={selected}
                              disabled={limitReached}
                              onClick={() => toggleInterest(interest)}
                            >
                              {interest}
                            </SelectionButton>
                          );
                        })}
                      </div>
                      <p className="mt-3 text-sm font-semibold text-[#5A6472]" aria-live="polite">
                        {selectedInterests.length} of 3 selected
                      </p>
                    </section>
                    <section className="rounded-[10px] bg-white p-4 shadow-[0_12px_28px_rgba(16,24,40,0.07)]">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#198294]">
                        Preferences
                      </p>
                      <div className="mt-3 grid gap-2">
                        {preferenceOptions.map((preference) => (
                          <SelectionButton
                            key={preference}
                            selected={selectedPreferences.includes(preference)}
                            onClick={() => togglePreference(preference)}
                          >
                            {preference}
                          </SelectionButton>
                        ))}
                      </div>
                    </section>
                  </div>
                ) : null}

                {step === 4 ? (
                  <div className="mt-6 w-full max-w-[480px]">
                    <section className="rounded-[12px] bg-white p-4 shadow-[0_16px_36px_rgba(16,24,40,0.08)] sm:p-5">
                      <label className="block text-base font-black text-[#101828]">
                        Search for a useful topic
                        <span className="relative mt-2 block">
                          <input
                            role="combobox"
                            aria-autocomplete="list"
                            aria-expanded="true"
                            aria-controls="good-housekeeping-priorities"
                            aria-activedescendant={`good-housekeeping-priority-${activePriorityIndex}`}
                            className="h-12 w-full rounded-[10px] border border-[#AEB7C3] bg-white px-4 pr-12 text-base font-semibold text-[#101828] outline-none transition-colors placeholder:text-[#AEB7C3] focus:border-[#198294] focus:ring-4 focus:ring-[#53C2BE]/20"
                            placeholder="Start typing to search..."
                            value={priority}
                            onChange={(event) => {
                              setPriority(event.target.value);
                              setActivePriorityIndex(0);
                            }}
                            onKeyDown={handlePriorityKeyDown}
                          />
                          <Search className="pointer-events-none absolute right-4 top-1/2 size-6 -translate-y-1/2 text-[#5A6472]" aria-hidden />
                        </span>
                      </label>
                      <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#5A6472]">
                        Popular with Good Housekeeping readers
                      </p>
                      <div
                        id="good-housekeeping-priorities"
                        role="listbox"
                        className="mt-3 max-h-[190px] overflow-y-auto rounded-[10px] border border-[#D6DDE6] bg-white"
                      >
                        {priorityOptions.map((item, index) => {
                          const selected = priority === item;
                          const active = activePriorityIndex === index;
                          return (
                            <button
                              key={item}
                              id={`good-housekeeping-priority-${index}`}
                              type="button"
                              role="option"
                              aria-selected={selected || active}
                              onMouseEnter={() => setActivePriorityIndex(index)}
                              onClick={() => selectPriority(item)}
                              className={cn(
                                "flex min-h-11 w-full items-center justify-between border-b border-[#D6DDE6] px-3 text-left text-sm font-bold transition-colors last:border-b-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#198294]",
                                selected
                                  ? "bg-[#E3F5F4] text-[#101828]"
                                  : active
                                    ? "bg-[#F4F7FA] text-[#101828]"
                                    : "bg-white text-[#343944] hover:bg-[#F4F7FA]",
                              )}
                            >
                              {item}
                              {selected ? <Check className="ml-3 size-4 shrink-0 text-[#198294]" aria-hidden /> : null}
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  </div>
                ) : null}
              </div>
            </div>

            <footer className="bg-[#F8FBFB] px-5 pb-6 pt-1 sm:px-8">
              <div className="mx-auto grid max-w-[560px] grid-cols-2 items-center gap-3 sm:grid-cols-[150px_1fr_150px]">
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-12 w-full rounded-[4px] border-[#AEB7C3] bg-white text-base font-black text-[#6B7280] hover:bg-white hover:text-[#101828]"
                  onClick={goToPreviousStep}
                  disabled={step === 1}
                >
                  <ChevronLeft className="mr-2 size-5" aria-hidden />
                  Back
                </Button>

                <button
                  type="button"
                  className="col-span-2 row-start-2 min-h-10 justify-self-center px-2 text-sm font-bold text-[#6B7280] underline underline-offset-2 hover:text-[#101828] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#198294] sm:col-span-1 sm:col-start-2 sm:row-start-1"
                  onClick={() => {
                    if (step < 4) goToNextStep();
                    else setShowWelcome(true);
                  }}
                >
                  Skip this step
                </button>

                <Button
                  type="button"
                  className="min-h-12 w-full rounded-[4px] bg-[#242832] px-5 text-base font-black text-white hover:bg-[#198294] sm:col-start-3"
                  disabled={!canContinue}
                  onClick={() => {
                    if (step < 4) goToNextStep();
                    else setShowWelcome(true);
                  }}
                >
                  {step === 4 ? "Complete" : "Next"}
                  <ChevronRight className="ml-2 size-5" aria-hidden />
                </Button>
              </div>
              {step === 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    skipFocusRestoreRef.current = true;
                    onSignIn();
                  }}
                  className="mx-auto mt-4 flex min-h-10 items-center justify-center text-sm font-medium text-black hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#808080]"
                >
                  Already have a profile? Sign in
                </button>
              ) : null}
            </footer>
          </>
        )}
      </section>
    </div>,
    portalTarget,
  );
}

function StepBadge({ step }: { step: 1 | 2 | 3 | 4 }) {
  const stepColors = ["#00589C", "#53C2BE", "#198294", "#F7C8D8"] as const;

  return (
    <div className="w-full max-w-[440px] pr-12 sm:pr-0" aria-label={`Step ${step} of 4`}>
      <div className="flex items-center gap-2.5">
        <div className="grid min-w-0 flex-1 grid-cols-4 gap-2" aria-hidden="true">
          {stepColors.map((color, index) => (
            <span
              key={color}
                className="h-1.5 rounded-full transition-colors motion-reduce:transition-none"
              style={{ backgroundColor: index + 1 <= step ? color : "#D6E3EC" }}
            />
          ))}
        </div>
        <span className="shrink-0 text-base font-medium text-[#425466]">
          {step} of 4
        </span>
      </div>
    </div>
  );
}

function SelectionButton({
  selected,
  disabled,
  onClick,
  children,
}: {
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex min-h-11 items-center justify-between rounded-[6px] border px-3 py-2 text-left text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#198294] motion-reduce:transition-none",
        disabled && "cursor-not-allowed opacity-45",
        selected
          ? "border-[#198294] bg-[#E3F5F4] text-[#101828]"
          : "border-[#D6DDE6] bg-white text-[#101828] hover:border-[#198294]",
      )}
    >
      {children}
      <span className={cn(
        "ml-3 flex size-6 shrink-0 items-center justify-center rounded-full border",
        selected
          ? "border-[#198294] bg-[#198294] text-white"
          : "border-[#AEB7C3] text-transparent",
      )}>
        <Check className="size-3.5" aria-hidden />
      </span>
    </button>
  );
}

function GoodHousekeepingWelcomeStep({
  name,
  cardName,
  location,
  homeStyle,
  priority,
  headingRef,
  onBack,
  onClose,
}: {
  name: string;
  cardName: string;
  location: string;
  homeStyle: string;
  priority: string;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-8 sm:px-8 sm:py-9">
        <div className="mx-auto flex max-w-[620px] flex-col items-center text-center">
          <BrandLogo
            slug="good-housekeeping"
            color={ghBrand.ink}
            decorative
            className="w-[180px] [&_svg]:h-auto [&_svg]:w-full sm:w-[220px]"
          />
          <h2
            ref={headingRef}
            id="good-housekeeping-onboarding-title"
            tabIndex={-1}
            className="mt-6 text-balance text-[2.35rem] font-black uppercase leading-[1.02] tracking-tight text-[#101828] outline-none sm:text-[3rem]"
            style={{ fontFamily: goodHousekeepingHeadlineFont }}
          >
            Welcome home, {name}!
          </h2>
          <p
            id="good-housekeeping-onboarding-description"
            className="mt-3 text-lg leading-7 text-[#5A6472] sm:text-xl"
          >
            Your Good Housekeeping edition is ready.
          </p>
          <div className="mt-7 w-full max-w-[520px]">
            <GoodHousekeepingMembershipCard
              name={cardName}
              location={location}
              homeStyle={homeStyle}
              priority={priority}
            />
          </div>
        </div>
      </div>
      <footer className="bg-[#F8FBFB] px-5 pb-6 pt-1 sm:px-8">
        <div className="mx-auto grid max-w-[620px] grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            className="min-h-12 rounded-[4px] border-[#AEB7C3] bg-white text-base font-black text-[#6B7280] hover:bg-white hover:text-[#101828]"
            onClick={onBack}
          >
            <ChevronLeft className="mr-2 size-5" aria-hidden />
            Back
          </Button>
          <Button
            type="button"
            className="min-h-12 rounded-[4px] bg-[#242832] px-5 text-base font-black text-white hover:bg-[#198294]"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </footer>
    </>
  );
}

function GoodHousekeepingMembershipCard({
  name,
  location,
  homeStyle,
  priority,
}: {
  name: string;
  location: string;
  homeStyle: string;
  priority: string;
}) {
  return (
    <section className="relative min-h-[300px] overflow-hidden rounded-[16px] bg-[#101828] p-6 text-white shadow-[0_14px_32px_rgba(0,0,0,0.28)] sm:min-h-[330px] sm:p-7">
      <div className="absolute -right-14 -top-14 size-44 rounded-full bg-[#53C2BE]/60" aria-hidden />
      <div className="absolute -bottom-20 left-8 size-52 rounded-full bg-[#F7C8D8]/25" aria-hidden />
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center gap-3">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-[12px] bg-white text-[2.5rem] font-black leading-none text-[#101828]">
            GH
          </div>
          <div className="text-left">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#53C2BE]">
              Good Housekeeping
            </p>
            <h3
              className="mt-1 text-3xl font-black uppercase leading-none"
              style={{ fontFamily: goodHousekeepingHeadlineFont }}
            >
              Membership Card
            </h3>
          </div>
        </div>
        <div className="mt-12 grid gap-5 text-left sm:mt-20 sm:grid-cols-2">
          <CardDetail label="Name" value={name} />
          <CardDetail label="Home base" value={location} />
          <CardDetail label="Reader style" value={homeStyle} />
          <CardDetail label="First useful win" value={priority} />
        </div>
        <Sparkles className="pointer-events-none absolute bottom-6 right-6 size-24 text-white/10" aria-hidden />
      </div>
    </section>
  );
}

function CardDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 text-left">
      <p className="text-xs font-bold text-white/55">{label}</p>
      <p className="mt-1 break-words text-base font-black leading-tight text-white">{value}</p>
    </div>
  );
}
