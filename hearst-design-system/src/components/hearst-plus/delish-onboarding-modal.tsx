"use client";

import React from "react";
import { createPortal } from "react-dom";
import { BrandLogo } from "@/components/brand-logo";
import type { HearstOnboardingResult } from "@/components/hearst-plus/onboarding-modal";
import { Button } from "@/components/ui/button";
import {
  CalendarBlank,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Lock,
  MapPin,
  Shield,
  Sparkles,
  User,
  X,
} from "@/components/ui/icons";
import { useBodyPortalTarget, useModalIsolation } from "@/components/ui/use-modal-isolation";
import { cn } from "@/lib/utils";

export const delishOnboardingStorageKey = "hearst-delish-onboarding-v1";

type CookStyle = "weeknight" | "project" | "baker";

type DelishOnboardingAnswers = {
  name: string;
  location: string;
  cookStyle: CookStyle | null;
  recipeInterests: string[];
  foodPreferences: string[];
  foodFavorites: string[];
  foodDiscoveries: string[];
  favoriteRecipe: string;
  newsletterSubscriptions: string[];
};

type DelishOnboardingModalProps = {
  open: boolean;
  onClose: () => void;
  onComplete: (result: HearstOnboardingResult) => void;
  onCreateProfile: (result: HearstOnboardingResult) => void;
  onSignIn: () => void;
};

const cookStyles = [
  {
    id: "weeknight",
    title: "Everyday Cook",
    description: "I love practical recipes that fit into my daily life.",
    imageSrc: "/images/delish-cook-everyday.png",
  },
  {
    id: "project",
    title: "Food Explorer",
    description: "I enjoy discovering new recipes, flavors, and cooking ideas.",
    imageSrc: "/images/delish-cook-explorer.png",
  },
  {
    id: "baker",
    title: "Both",
    description: "I cook every day and love trying something new.",
    imageSrc: "/images/delish-cook-both.png",
  },
] as const;

const recipeInterests = [
  "Quick dinners",
  "Chicken",
  "Pasta",
  "Baking",
  "Desserts",
  "Healthy meals",
] as const;

const foodPreferences = [
  "No preference",
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "High-protein",
  "Family-friendly",
] as const;

const foodFavoriteOptions = [
  { label: "Italian", icon: "🍝" },
  { label: "Mexican", icon: "🌮" },
  { label: "Chinese", icon: "🥡" },
  { label: "Japanese", icon: "🍣" },
  { label: "Pizza", icon: "🍕" },
  { label: "Pasta", icon: "🍜" },
  { label: "Chicken", icon: "🍗" },
  { label: "BBQ", icon: "🍖" },
  { label: "Healthy Meals", icon: "🥗" },
  { label: "Baking", icon: "🥣" },
] as const;

const foodDiscoveryOptions = [
  { label: "Mediterranean", icon: "🥘" },
  { label: "Risotto", icon: "🍚" },
  { label: "Homemade Pasta", icon: "🍝" },
  { label: "Tapas", icon: "🍢" },
  { label: "Thai", icon: "🍲" },
  { label: "Korean BBQ", icon: "🥩" },
  { label: "Indian Curry", icon: "🍛" },
  { label: "Fresh Herbs & Spices", icon: "🌿" },
  { label: "Plant-Based Meals", icon: "🥗" },
  { label: "Global Street Food", icon: "🌯" },
] as const;

const newsletterOptions = [
  {
    id: "delish-daily",
    title: "Delish Daily",
    description: "Your daily dose of easy, delicious recipes, food news, and cooking tips.",
    imageSrc: "/images/delish-newsletter-daily.png",
  },
  {
    id: "delish-unlimited",
    title: "Delish Unlimited",
    description: "Get exclusive recipes, in-depth guides, and premium content.",
    imageSrc: "/images/delish-newsletter-unlimited.png",
  },
  {
    id: "delish-summer-hosting",
    title: "Delish Summer Hosting",
    description: "Seasonal recipes, entertaining ideas, and hosting inspiration all summer long.",
    imageSrc: "/images/delish-newsletter-hosting.png",
  },
] as const;

const delishHeadlineFont = '"TT Commons Pro", system-ui, sans-serif';

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function buildDelishOnboardingResult(
  answers: DelishOnboardingAnswers,
): HearstOnboardingResult {
  const cookStyle = cookStyles.find((option) => option.id === answers.cookStyle);
  const meaningfulPreferences = answers.foodPreferences.filter(
    (preference) => preference !== "No preference",
  );
  const interests = unique([
    ...(cookStyle ? [cookStyle.title] : []),
    ...answers.recipeInterests,
    ...meaningfulPreferences,
    ...answers.foodFavorites,
    ...answers.foodDiscoveries,
    answers.favoriteRecipe,
    ...answers.newsletterSubscriptions,
  ]);

  return {
    id: Date.now(),
    interests,
    brands: ["Delish"],
    tags: unique([
      "delish",
      "recipe",
      answers.location.toLowerCase(),
      ...interests.map((interest) => interest.toLowerCase()),
    ]),
  };
}

export function DelishOnboardingModal({
  open,
  ...props
}: DelishOnboardingModalProps) {
  const portalTarget = useBodyPortalTarget();

  if (!open || !portalTarget) return null;

  return <DelishOnboardingModalContent {...props} portalTarget={portalTarget} />;
}

type DelishOnboardingModalContentProps = Omit<
  DelishOnboardingModalProps,
  "open"
> & {
  portalTarget: HTMLElement;
};

function DelishOnboardingModalContent({
  onClose,
  onComplete,
  onCreateProfile,
  onSignIn,
  portalTarget,
}: DelishOnboardingModalContentProps) {
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);
  const [showWelcome, setShowWelcome] = React.useState(false);
  const [readerName, setReaderName] = React.useState("");
  const [readerLocation, setReaderLocation] = React.useState("");
  const [isDetectingLocation, setIsDetectingLocation] = React.useState(false);
  const [locationMessage, setLocationMessage] = React.useState("");
  const [cookStyle, setCookStyle] = React.useState<CookStyle | null>(null);
  const [selectedRecipes, setSelectedRecipes] = React.useState<string[]>([]);
  const [selectedPreferences, setSelectedPreferences] = React.useState<string[]>([
    "No preference",
  ]);
  const [selectedFoodFavorites, setSelectedFoodFavorites] = React.useState<string[]>([]);
  const [selectedFoodDiscoveries, setSelectedFoodDiscoveries] = React.useState<string[]>([]);
  const [selectedNewsletterSubscriptions, setSelectedNewsletterSubscriptions] = React.useState<string[]>([
    "delish-daily",
  ]);
  const dialogRef = React.useRef<HTMLElement | null>(null);
  const headingRef = React.useRef<HTMLHeadingElement | null>(null);
  const restoreFocusRef = React.useRef<HTMLElement | null>(null);
  const skipFocusRestoreRef = React.useRef(false);

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
      ).filter(
        (element) =>
          element.getAttribute("aria-hidden") !== "true"
          && !element.closest('[inert], [aria-hidden="true"]'),
      );

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

  const toggleRecipe = (recipe: string) => {
    setSelectedRecipes((current) =>
      current.includes(recipe)
        ? current.filter((item) => item !== recipe)
        : current.length < 3
          ? [...current, recipe]
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

  const toggleLimitedSelection = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string[]>>,
    limit = 5,
  ) => {
    setValue((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : current.length < limit
          ? [...current, value]
          : current,
    );
  };

  const toggleNewsletterSubscription = (id: string) => {
    setSelectedNewsletterSubscriptions((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
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
    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationMessage("Location access was blocked. You can enter it manually.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationMessage("Location is unavailable right now. You can enter it manually.");
        } else if (error.code === error.TIMEOUT) {
          setLocationMessage("Location request timed out. You can try again.");
        } else {
          setLocationMessage("Unable to detect location. You can enter it manually.");
        }
      } else {
        setLocationMessage("Unable to detect location. You can enter it manually.");
      }
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const getAnswers = (): DelishOnboardingAnswers => ({
    name: readerName.trim(),
    location: readerLocation.trim(),
    cookStyle,
    recipeInterests: selectedRecipes,
    foodPreferences: selectedPreferences,
    foodFavorites: selectedFoodFavorites,
    foodDiscoveries: selectedFoodDiscoveries,
    favoriteRecipe:
      selectedFoodFavorites[0] ?? selectedFoodDiscoveries[0] ?? "",
    newsletterSubscriptions: selectedNewsletterSubscriptions,
  });

  const saveAnswers = (result: HearstOnboardingResult) => {
    try {
      window.localStorage.setItem(
        delishOnboardingStorageKey,
        JSON.stringify({ completed: true, answers: getAnswers(), result }),
      );
    } catch {
      // Personalization still applies for this session when storage is unavailable.
    }
  };

  const finish = (createProfile: boolean) => {
    const result = buildDelishOnboardingResult(getAnswers());
    saveAnswers(result);
    skipFocusRestoreRef.current = true;
    if (createProfile) {
      onCreateProfile(result);
    } else {
      onComplete(result);
    }
  };

  const goToNextStep = () => setStep((current) => Math.min(4, current + 1) as 1 | 2 | 3 | 4);
  const goToPreviousStep = () => setStep((current) => Math.max(1, current - 1) as 1 | 2 | 3 | 4);
  const showWelcomeStep = () => setShowWelcome(true);

  const canContinue = step === 1
    ? readerName.trim().length > 0
    : step === 2
      ? Boolean(cookStyle)
      : step === 3
        ? selectedFoodFavorites.length + selectedFoodDiscoveries.length > 0
        : selectedNewsletterSubscriptions.length > 0;

  const heading = step === 1
    ? "Let’s Get Cooking"
    : step === 2
      ? "What kind of cook are you?"
      : step === 3
        ? "Tell Us What’s on Your Plate"
        : "Let’s Keep In Touch";
  const description = step === 1
    ? "Tell me about yourself"
    : step === 2
      ? "Choose the answer that feels most like you."
      : step === 3
        ? "Choose the foods you already love and the ones you’d like to discover."
        : "With personalized recipes and inspiration";
  const selectedCookStyleTitle =
    cookStyles.find((option) => option.id === cookStyle)?.title ?? "Delish Cook";
  const welcomeName = readerName.trim().split(/\s+/)[0] || "there";

  return createPortal(
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-[#1F222A]/88 p-3 backdrop-blur-sm sm:p-6">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delish-onboarding-title"
        aria-describedby="delish-onboarding-description"
        className="relative z-10 flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[680px] flex-col overflow-hidden rounded-[12px] bg-[#F8F9FB] text-[#121722] shadow-2xl sm:max-h-[calc(100dvh-3rem)]"
      >
        <Button
          data-modal-close
          variant="outline"
          size="icon-lg"
          className="absolute right-4 top-4 z-20 size-10 rounded-full border-[#EF3B35] bg-white text-[#1F222A] hover:bg-[#FFF5D8] sm:right-5 sm:top-5"
          onClick={onClose}
          aria-label="Close Delish onboarding"
        >
          <X className="size-4" aria-hidden />
        </Button>

        {showWelcome ? (
          <DelishWelcomeStep
            name={welcomeName}
            cardName={readerName.trim() || "Delish Reader"}
            location={readerLocation.trim() || "Your Kitchen"}
            cookStyle={selectedCookStyleTitle}
            favoriteRecipe={
              selectedFoodFavorites[0]
              ?? selectedFoodDiscoveries[0]
              ?? "Choose a favorite recipe"
            }
            favoriteFoods={selectedFoodFavorites}
            foodsToExplore={selectedFoodDiscoveries}
            headingRef={headingRef}
            onBack={() => setShowWelcome(false)}
            onClose={() => finish(false)}
          />
        ) : (
          <>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
          <div className="mx-auto flex max-w-[560px] flex-col items-center">
            <DelishStepMarker step={step} />

            <div className="mt-5 text-center">
              <h2
                ref={headingRef}
                id="delish-onboarding-title"
                tabIndex={-1}
                className="text-balance text-[2rem] font-black leading-[0.98] tracking-normal text-[#101828] outline-none sm:text-[2.25rem]"
                style={{ fontFamily: delishHeadlineFont }}
              >
                {heading}
              </h2>
              <p
                id="delish-onboarding-description"
                className="mx-auto mt-3 max-w-[42ch] text-base leading-6 text-[#5A6472] sm:text-lg"
              >
                {description}
              </p>
            </div>

            {step === 1 ? (
              <div className="mt-6 w-full rounded-[12px] bg-white px-4 py-5 shadow-[0_16px_36px_rgba(16,24,40,0.08)] sm:px-5">
                <label className="block text-base font-medium text-[#343944]">
                  What is your name?
                  <input
                    className="mt-2 h-12 w-full rounded-[10px] border border-[#AEB7C3] bg-white px-4 text-base font-medium text-[#101828] outline-none transition-colors placeholder:text-[#AEB7C3] focus:border-[#E31837] focus:ring-4 focus:ring-[#E31837]/10"
                    placeholder="Your name"
                    value={readerName}
                    onChange={(event) => setReaderName(event.target.value)}
                    autoComplete="given-name"
                  />
                </label>
                <label className="mt-4 block text-base font-medium text-[#343944]">
                  Where are you located? <span className="text-[#5A6472]">(Optional)</span>
                  <span className="relative mt-2 block">
                    <input
                      className="h-12 w-full rounded-[10px] border border-[#AEB7C3] bg-white px-4 pr-12 text-base font-medium text-[#101828] outline-none transition-colors placeholder:text-[#AEB7C3] focus:border-[#E31837] focus:ring-4 focus:ring-[#E31837]/10"
                      placeholder="Current location"
                      value={readerLocation}
                      onChange={(event) => {
                        setReaderLocation(event.target.value);
                        setLocationMessage("");
                      }}
                      autoComplete="address-level2"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-[#242832] transition-colors hover:bg-[#FFF5D8] active:bg-[#FFC835]/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E31837] disabled:cursor-wait disabled:opacity-60"
                      onClick={detectLocation}
                      disabled={isDetectingLocation}
                      aria-label={isDetectingLocation ? "Detecting location" : "Auto-detect location"}
                      aria-busy={isDetectingLocation}
                      title={isDetectingLocation ? "Detecting location..." : "Auto-detect location"}
                    >
                      <MapPin
                        className={cn(
                          "size-6",
                          isDetectingLocation && "animate-pulse text-[#E31837]",
                        )}
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
              <div className="mt-6 grid w-full gap-4 sm:grid-cols-3">
                {cookStyles.map(({ id, title, description: optionDescription, imageSrc }) => {
                  const selected = cookStyle === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setCookStyle(id)}
                      className={cn(
                        "group flex min-h-[156px] flex-col items-center justify-between rounded-[12px] border bg-white px-5 py-6 text-center shadow-[0_10px_20px_rgba(16,24,40,0.04)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E31837] motion-reduce:transition-none sm:min-h-[218px]",
                        selected
                          ? "border-[#E31837] text-[#101828] ring-2 ring-[#E31837]/15"
                          : "border-[#D6DDE6] text-[#101828] hover:border-[#AEB7C3]",
                      )}
                    >
                      <span className="flex flex-col items-center">
                        <img
                          src={imageSrc}
                          alt=""
                          className="size-20 object-contain sm:size-24"
                          aria-hidden="true"
                        />
                        <span className="mt-4 block text-lg font-bold leading-tight">
                          {title}
                        </span>
                        <span className="mt-3 block max-w-[15rem] text-sm leading-6 text-[#5A6472]">
                          {optionDescription}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "mt-5 flex size-8 items-center justify-center rounded-full border-2 transition-colors",
                          selected
                            ? "border-[#E31837] bg-[#E31837]"
                            : "border-[#AEB7C3] bg-white",
                        )}
                        aria-hidden="true"
                      >
                        {selected ? <Check className="size-4 text-white" /> : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {step === 3 ? (
              <div className="mt-6 grid w-full gap-4 lg:grid-cols-2">
                <FoodPlateSection
                  title="Your favorites"
                  subtitle="Choose up to 5"
                  marker="♥"
                  options={foodFavoriteOptions}
                  selected={selectedFoodFavorites}
                  onToggle={(label) =>
                    toggleLimitedSelection(label, setSelectedFoodFavorites)
                  }
                />
                <FoodPlateSection
                  title="Discover next"
                  subtitle="Choose up to 5"
                  marker="✦"
                  options={foodDiscoveryOptions}
                  selected={selectedFoodDiscoveries}
                  onToggle={(label) =>
                    toggleLimitedSelection(label, setSelectedFoodDiscoveries)
                  }
                />
              </div>
            ) : null}

            {step === 4 ? (
              <div className="mt-6 w-full space-y-3">
                {newsletterOptions.map((option) => (
                  <DelishNewsletterOption
                    key={option.id}
                    title={option.title}
                    description={option.description}
                    imageSrc={option.imageSrc}
                    selected={selectedNewsletterSubscriptions.includes(option.id)}
                    onToggle={() => toggleNewsletterSubscription(option.id)}
                  />
                ))}

                <div className="flex items-center gap-4 rounded-[12px] bg-white px-5 py-4 text-left shadow-[0_12px_28px_rgba(16,24,40,0.06)]">
                  <span className="relative flex size-14 shrink-0 items-center justify-center text-[#EF3B35]">
                    <Shield className="size-12" weight="regular" aria-hidden />
                    <Lock className="absolute size-5" weight="fill" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-base font-black text-[#101828]">
                      Your privacy matters
                    </p>
                    <p className="mt-1 text-sm leading-5 text-[#5A6472]">
                      We will never share your email address. You can unsubscribe at any time with one click.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <footer className="bg-[#F8F9FB] px-5 pb-6 pt-1 sm:px-8">
          <div className="mx-auto grid max-w-[560px] grid-cols-2 items-center gap-3 sm:grid-cols-[132px_1fr_132px]">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                className="min-h-12 w-full rounded-[4px] border-[#EF3B35] bg-white text-base font-black text-[#EF3B35] hover:bg-[#FFF5F4] hover:text-[#D92731]"
                onClick={goToPreviousStep}
              >
                <ChevronLeft className="mr-2 size-5" aria-hidden />
                Back
              </Button>
            ) : (
              <div className="hidden sm:block" aria-hidden="true" />
            )}

            <button
              type="button"
              className="col-span-2 row-start-2 min-h-10 justify-self-center px-2 text-sm font-bold text-[#6B7280] underline underline-offset-2 hover:text-[#101828] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E31837] sm:col-span-1 sm:col-start-2 sm:row-start-1"
              onClick={() => {
                if (step < 4) {
                  goToNextStep();
                } else {
                  showWelcomeStep();
                }
              }}
            >
              Skip this step
            </button>

            <Button
              type="button"
              className="min-h-12 w-full rounded-[4px] bg-[#EF3B35] px-5 text-base font-black text-white hover:bg-[#D92731] disabled:bg-[#9CA3AF] sm:col-start-3"
              disabled={!canContinue}
              onClick={() => {
                if (step < 4) {
                  goToNextStep();
                } else {
                  showWelcomeStep();
                }
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
              className="mx-auto mt-4 flex min-h-10 items-center justify-center border-0 border-[#808080] text-xs font-medium text-black hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#808080]"
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

function DelishStepMarker({ step }: { step: 1 | 2 | 3 | 4 }) {
  const markerIconSrc =
    step === 4
      ? "/images/delish-top-logo-step-4-logo-only-cropped.png"
      : step === 3
        ? "/images/delish-top-logo-step-3-logo-only-cropped.png"
        : step === 2
          ? "/images/delish-top-logo-step-2-logo-only-cropped.png"
          : "/images/delish-top-logo-step-1-logo-only-cropped.png";

  return (
    <div
      className="flex flex-col items-center"
      aria-label={`Step ${step} of 4`}
    >
      <div className="relative h-[112px] w-[132px]" aria-hidden="true">
        <img
          src={markerIconSrc}
          alt=""
          className="absolute left-1/2 top-0 h-[92px] w-auto -translate-x-1/2 object-contain"
        />
        <span className="absolute left-1/2 top-[72px] flex size-8 -translate-x-1/2 items-center justify-center rounded-full bg-[#EF3B35] text-[0.7rem] font-black leading-none text-white shadow-[0_8px_18px_rgba(239,59,53,0.24)]">
          {step}/4
        </span>
      </div>
      <p className="-mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-[#101828]">
        Step {step}
      </p>
    </div>
  );
}

function FoodPlateSection({
  title,
  subtitle,
  marker,
  options,
  selected,
  onToggle,
}: {
  title: string;
  subtitle: string;
  marker: string;
  options: readonly { label: string; icon: string }[];
  selected: string[];
  onToggle: (label: string) => void;
}) {
  return (
    <section className="rounded-[12px] border border-[#FFB7B5] bg-white/95 p-4 shadow-[0_12px_26px_rgba(239,59,53,0.05)] sm:p-5">
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 text-2xl font-black leading-none text-[#EF3B35]"
          aria-hidden="true"
        >
          {marker}
        </span>
        <div className="min-w-0 text-left">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#EF3B35]">
            {title}
          </p>
          <p className="mt-1 text-sm font-medium text-[#5A6472]">{subtitle}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-2">
        {options.map(({ label, icon }) => {
          const isSelected = selected.includes(label);
          const limitReached = selected.length >= 5 && !isSelected;

          return (
            <button
              key={label}
              type="button"
              disabled={limitReached}
              aria-pressed={isSelected}
              onClick={() => onToggle(label)}
              className={cn(
                "flex min-h-10 items-center gap-3 rounded-[9px] border bg-white px-3 py-2 text-left text-sm font-bold text-[#101828] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EF3B35] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none",
                isSelected
                  ? "border-[#EF3B35] bg-[#FFF5D8]"
                  : "border-[#D6DDE6] hover:border-[#AEB7C3]",
              )}
            >
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#F4F7FA] text-lg"
                aria-hidden="true"
              >
                {icon}
              </span>
              <span className="min-w-0 flex-1">{label}</span>
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                  isSelected
                    ? "border-[#EF3B35] bg-[#EF3B35]"
                    : "border-[#AEB7C3] bg-white",
                )}
                aria-hidden="true"
              >
                {isSelected ? <Check className="size-3.5 text-white" /> : null}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm font-semibold text-[#5A6472]" aria-live="polite">
        {selected.length} of 5 selected
      </p>
    </section>
  );
}

function DelishNewsletterOption({
  title,
  description,
  imageSrc,
  selected,
  onToggle,
}: {
  title: string;
  description: string;
  imageSrc: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        "flex w-full items-center gap-4 rounded-[12px] border bg-white px-5 py-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EF3B35] motion-reduce:transition-none",
        selected
          ? "border-[#EF3B35] bg-[#FFF5D8]"
          : "border-[#D6DDE6] hover:border-[#AEB7C3]",
      )}
    >
      <img
        src={imageSrc}
        alt=""
        className="size-16 shrink-0 object-contain"
        aria-hidden="true"
      />
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-[6px] border-2 transition-colors",
          selected
            ? "border-[#EF3B35] bg-[#EF3B35] text-white"
            : "border-[#AEB7C3] bg-white text-transparent",
        )}
        aria-hidden="true"
      >
        <Check className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xl font-black leading-tight text-[#101828]">
          {title}
        </span>
        <span className="mt-1 block max-w-[38ch] text-base leading-6 text-[#5A6472]">
          {description}
        </span>
      </span>
    </button>
  );
}

function DelishWelcomeStep({
  name,
  cardName,
  location,
  cookStyle,
  favoriteRecipe,
  favoriteFoods,
  foodsToExplore,
  headingRef,
  onBack,
  onClose,
}: {
  name: string;
  cardName: string;
  location: string;
  cookStyle: string;
  favoriteRecipe: string;
  favoriteFoods: string[];
  foodsToExplore: string[];
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-8 sm:px-8 sm:py-9">
        <div className="mx-auto flex max-w-[620px] flex-col items-center text-center">
          <BrandLogo
            slug="delish"
            color="#E31837"
            decorative
            className="w-[170px] [&_svg]:h-auto [&_svg]:w-full sm:w-[210px]"
          />
          <h2
            ref={headingRef}
            id="delish-onboarding-title"
            tabIndex={-1}
            className="mt-6 text-balance text-[2rem] font-black leading-[1.02] tracking-normal text-[#101828] outline-none sm:text-[2.5rem]"
            style={{ fontFamily: delishHeadlineFont }}
          >
            Your Table is Ready
          </h2>
          <p
            id="delish-onboarding-description"
            className="mt-3 text-lg leading-7 text-[#5A6472] sm:text-xl"
          >
            Enjoy your personalized recipes, inspiration, and community.
          </p>
          <div className="mt-7 w-full max-w-[620px]">
            <DelishMembershipCard
              name={cardName}
              location={location}
              cookStyle={cookStyle}
              favoriteRecipe={favoriteRecipe}
              favoriteFoods={favoriteFoods}
              foodsToExplore={foodsToExplore}
            />
          </div>
        </div>
      </div>
      <footer className="bg-[#F8F9FB] px-5 pb-6 pt-1 sm:px-8">
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
            className="min-h-12 rounded-[4px] bg-[#242832] px-5 text-base font-black text-white hover:bg-[#E31837]"
            onClick={onClose}
          >
            Let’s Go!
            <ChevronRight className="ml-2 size-5" aria-hidden />
          </Button>
        </div>
      </footer>
    </>
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
        "flex min-h-14 items-center justify-between rounded-[8px] border px-4 py-3 text-left text-sm font-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E31837] motion-reduce:transition-none",
        disabled && "cursor-not-allowed opacity-45",
        selected
          ? "border-[#E31837] bg-[#FFF5D8] text-[#101828]"
          : "border-[#D6DDE6] bg-white text-[#101828] hover:border-[#E31837]",
      )}
    >
      {children}
      <span className={cn(
        "ml-3 flex size-6 shrink-0 items-center justify-center rounded-full border",
        selected
          ? "border-[#E31837] bg-[#E31837] text-white"
          : "border-[#AEB7C3] text-transparent",
      )}>
        <Check className="size-3.5" aria-hidden />
      </span>
    </button>
  );
}

function DelishMembershipCard({
  name,
  location,
  cookStyle,
  favoriteRecipe,
  favoriteFoods,
  foodsToExplore,
}: {
  name: string;
  location: string;
  cookStyle: string;
  favoriteRecipe: string;
  favoriteFoods: string[];
  foodsToExplore: string[];
}) {
  const memberSince = React.useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date()),
    [],
  );
  const favoriteFoodItems = favoriteFoods.length > 0
    ? favoriteFoods
    : favoriteRecipe
      ? [favoriteRecipe]
      : ["Recipes"];
  const exploreItems = foodsToExplore.length > 0
    ? foodsToExplore
    : ["New ideas"];

  return (
    <section className="relative overflow-hidden rounded-[22px] bg-[#081017] p-6 text-white shadow-[0_18px_40px_rgba(0,0,0,0.28)] sm:p-8">
      <div className="absolute -right-12 -top-14 size-44 rounded-full bg-[#E31837]" aria-hidden />
      <div className="absolute -bottom-20 -left-12 size-56 rounded-full bg-[#D7A726]/85" aria-hidden />
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-[10px] bg-white text-[2.8rem] font-black leading-none text-[#E31837]">
            d
          </div>
          <div className="min-w-0 text-left">
            <p className="w-full text-left text-sm font-black uppercase tracking-[0.16em] text-[#FFC835]">
              Delish
            </p>
            <h3
              className="mt-1 text-3xl font-black leading-none sm:text-[2rem]"
              style={{ fontFamily: delishHeadlineFont }}
            >
              Membership Card
            </h3>
          </div>
        </div>

        <div className="mt-9 grid gap-6 border-b border-t border-white/14 py-6 text-left sm:grid-cols-2 sm:gap-8">
          <CardProfileBlock
            icon={<User className="size-9 text-[#EF3B35]" weight="regular" aria-hidden />}
            label="Member name"
            value={name}
          />
          <CardProfileBlock
            icon={<CheckCircle2 className="size-9 text-[#EF3B35]" weight="regular" aria-hidden />}
            label="You selected"
            value={cookStyle}
          />
        </div>

        <div className="grid gap-6 border-b border-white/14 py-6 text-left sm:grid-cols-2 sm:gap-8">
          <CardChipBlock
            icon={<Heart className="size-9 text-[#EF3B35]" weight="regular" aria-hidden />}
            label="Favorite foods"
            items={favoriteFoodItems}
          />
          <CardChipBlock
            icon={<Sparkles className="size-9 text-[#EF3B35]" weight="regular" aria-hidden />}
            label="Foods to explore"
            items={exploreItems}
          />
        </div>

        <div className="grid gap-6 pt-6 text-left sm:grid-cols-2 sm:gap-8">
          <CardProfileBlock
            icon={<CalendarBlank className="size-9 text-[#EF3B35]" weight="regular" aria-hidden />}
            label="Member since"
            value={memberSince}
          />
          <div className="flex gap-4">
            <Heart className="mt-1 size-8 shrink-0 text-[#EF3B35]" weight="regular" aria-hidden />
            <p className="text-base font-normal leading-6 text-white">
              Thanks for joining our community. We can’t wait to cook with you.
            </p>
          </div>
        </div>
        <BrandLogo
          slug="delish"
          decorative
          color="rgba(255, 255, 255, 0.14)"
          className="pointer-events-none absolute bottom-8 right-0 w-[220px] translate-x-10 translate-y-2 [&_svg]:h-auto [&_svg]:w-full"
        />
      </div>
    </section>
  );
}

function CardProfileBlock({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 gap-4">
      <span className="shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-[0.08em] text-white/55">{label}</p>
        <p className="mt-1 break-words text-xl font-normal leading-tight text-white">{value}</p>
      </div>
    </div>
  );
}

function CardChipBlock({
  icon,
  label,
  items,
}: {
  icon: React.ReactNode;
  label: string;
  items: string[];
}) {
  return (
    <div className="flex min-w-0 gap-4">
      <span className="shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-[0.08em] text-white/55">{label}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {items.slice(0, 5).map((item) => (
            <span
              key={item}
              className="rounded-[8px] bg-white/12 px-3 py-2 text-sm font-medium leading-none text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
