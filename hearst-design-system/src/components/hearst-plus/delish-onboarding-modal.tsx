"use client";

import React from "react";
import { createPortal } from "react-dom";
import { BrandLogo } from "@/components/brand-logo";
import type { HearstOnboardingResult } from "@/components/hearst-plus/onboarding-modal";
import { Button } from "@/components/ui/button";
import {
  Check,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  MapPin,
  Search,
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
  favoriteRecipe: string;
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
    title: "Weeknight cook",
    description: "Fast recipes and fewer dishes",
    Icon: Clock,
  },
  {
    id: "project",
    title: "Weekend cook",
    description: "New techniques and satisfying projects",
    Icon: ChefHat,
  },
  {
    id: "baker",
    title: "Baker",
    description: "Cakes, cookies, breads, and desserts",
    Icon: Heart,
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

const favoriteRecipeSuggestions = [
  "One-pan baked feta gnocchi",
  "Classic chicken meatballs",
  "Italian pasta night",
  "Chocolate sheet cake",
  "French onion chicken meatballs",
  "Creamy Tuscan chicken",
  "Crispy air fryer salmon",
  "Lemon blueberry loaf cake",
  "Sheet-pan chicken fajitas",
  "Marry me pasta",
  "No-bake cheesecake bars",
  "Smash burger tacos",
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
    answers.favoriteRecipe,
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
  const [favoriteRecipe, setFavoriteRecipe] = React.useState("");
  const [activeRecipeIndex, setActiveRecipeIndex] = React.useState(0);
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

  const filteredFavoriteRecipes = React.useMemo(() => {
    const query = favoriteRecipe.trim().toLowerCase();
    if (!query) return favoriteRecipeSuggestions;

    return favoriteRecipeSuggestions.filter((recipe) =>
      recipe.toLowerCase().includes(query),
    );
  }, [favoriteRecipe]);

  const recipeAutocompleteOptions = React.useMemo(() => {
    const trimmedRecipe = favoriteRecipe.trim();
    if (filteredFavoriteRecipes.length > 0) return filteredFavoriteRecipes;
    return trimmedRecipe ? [`Use “${trimmedRecipe}”`] : favoriteRecipeSuggestions;
  }, [favoriteRecipe, filteredFavoriteRecipes]);

  const selectFavoriteRecipe = (recipe: string) => {
    const customMatch = recipe.match(/^Use “(.+)”$/);
    setFavoriteRecipe(customMatch?.[1] ?? recipe);
    setActiveRecipeIndex(0);
  };

  const handleFavoriteRecipeKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveRecipeIndex((current) =>
        Math.min(recipeAutocompleteOptions.length - 1, current + 1),
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveRecipeIndex((current) => Math.max(0, current - 1));
    } else if (event.key === "Enter") {
      const activeRecipe = recipeAutocompleteOptions[activeRecipeIndex];
      if (!activeRecipe) return;
      event.preventDefault();
      selectFavoriteRecipe(activeRecipe);
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
    favoriteRecipe: favoriteRecipe.trim(),
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
  const showWelcomeStep = () => setShowWelcome(true);

  const canContinue = step === 1
    ? readerName.trim().length > 0
    : step === 2
      ? Boolean(cookStyle)
      : step === 3
        ? selectedRecipes.length > 0
        : favoriteRecipe.trim().length > 0;

  const heading = step === 1
    ? "Start your kitchen"
    : step === 2
      ? "What kind of cook are you?"
      : step === 3
        ? "What do you want to cook more often?"
        : "Find your favorite recipe";
  const description = step === 1
    ? "Let's get to know each other."
    : step === 2
      ? "Choose the answer that feels most like you."
      : step === 3
        ? "Pick up to three, then add any food preferences."
        : "Start with one recipe you would love to see more often.";
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
          className="absolute right-4 top-4 z-20 size-10 rounded-full border-[#AEB7C3] bg-white text-[#1F222A] hover:bg-[#FFF5D8] sm:right-5 sm:top-5"
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
            favoriteRecipe={favoriteRecipe.trim() || "Choose a favorite recipe"}
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
                id="delish-onboarding-title"
                tabIndex={-1}
                className="text-balance text-[2rem] font-black leading-[0.98] tracking-normal text-[#004685] outline-none sm:text-[2.25rem]"
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
                    placeholder="Name"
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
              <div className="mt-6 grid w-full gap-3 sm:grid-cols-3">
                {cookStyles.map(({ id, title, description: optionDescription, Icon }) => {
                  const selected = cookStyle === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setCookStyle(id)}
                      className={cn(
                        "group flex min-h-[84px] flex-row items-center justify-start gap-3 rounded-[12px] border p-4 text-left shadow-[0_8px_16px_rgba(16,24,40,0.05)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E31837] motion-reduce:transition-none sm:min-h-[132px] sm:flex-col sm:justify-center sm:gap-0 sm:p-4 sm:text-center",
                        selected
                          ? "border-[#E31837] bg-[#E31837] text-white"
                          : "border-[#D6DDE6] bg-white text-[#101828] hover:bg-[#FFF5D8]",
                      )}
                    >
                      <span className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-full",
                        selected ? "bg-white text-[#E31837]" : "bg-[#E5EAF0] text-[#343944]",
                      )}>
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <span className="min-w-0 sm:mt-4">
                        <span className="block text-base font-bold">{title}</span>
                        <span className={cn(
                          "mt-1 block text-sm leading-5",
                          selected ? "text-white/85" : "text-[#5A6472]",
                        )}>
                          {optionDescription}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {step === 3 ? (
              <div className="mt-6 grid w-full gap-4 lg:grid-cols-[1fr_0.85fr]">
                <section className="rounded-[12px] bg-white p-4 shadow-[0_16px_36px_rgba(16,24,40,0.08)] sm:p-5">
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-[#E31837]">
                    Recipes
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {recipeInterests.map((recipe) => {
                      const selected = selectedRecipes.includes(recipe);
                      const limitReached = selectedRecipes.length >= 3 && !selected;
                      return (
                        <SelectionButton
                          key={recipe}
                          selected={selected}
                          disabled={limitReached}
                          onClick={() => toggleRecipe(recipe)}
                        >
                          {recipe}
                        </SelectionButton>
                      );
                    })}
                  </div>
                  <p className="mt-4 text-sm font-semibold text-[#5A6472]" aria-live="polite">
                    {selectedRecipes.length} of 3 selected
                  </p>
                </section>
                <section className="rounded-[12px] bg-white p-4 shadow-[0_16px_36px_rgba(16,24,40,0.08)] sm:p-5">
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-[#E31837]">
                    Preferences
                  </p>
                  <div className="mt-4 grid gap-3">
                    {foodPreferences.map((preference) => (
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
                    Search for a recipe
                    <span className="relative mt-3 block">
                      <input
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded="true"
                        aria-controls="delish-popular-recipes"
                        aria-activedescendant={`delish-popular-recipe-${activeRecipeIndex}`}
                        className="h-12 w-full rounded-[10px] border border-[#AEB7C3] bg-white px-4 pr-12 text-base font-semibold text-[#101828] outline-none transition-colors placeholder:text-[#AEB7C3] focus:border-[#E31837] focus:ring-4 focus:ring-[#E31837]/10"
                        placeholder="Start typing to search..."
                        value={favoriteRecipe}
                        onChange={(event) => {
                          setFavoriteRecipe(event.target.value);
                          setActiveRecipeIndex(0);
                        }}
                        onKeyDown={handleFavoriteRecipeKeyDown}
                      />
                      <Search className="pointer-events-none absolute right-4 top-1/2 size-6 -translate-y-1/2 text-[#5A6472]" aria-hidden />
                    </span>
                  </label>
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#5A6472]">
                    Popular recipes
                  </p>
                  <div
                    id="delish-popular-recipes"
                    role="listbox"
                    className="mt-3 max-h-[190px] overflow-y-auto rounded-[10px] border border-[#D6DDE6] bg-white"
                  >
                    {recipeAutocompleteOptions.map((recipe, index) => {
                      const selected = favoriteRecipe === recipe;
                      const active = activeRecipeIndex === index;
                      return (
                      <button
                        key={recipe}
                        id={`delish-popular-recipe-${index}`}
                        type="button"
                        role="option"
                        aria-selected={selected || active}
                        onMouseEnter={() => setActiveRecipeIndex(index)}
                        onClick={() => selectFavoriteRecipe(recipe)}
                        className={cn(
                          "flex min-h-11 w-full items-center justify-between border-b border-[#D6DDE6] px-3 text-left text-sm font-bold transition-colors last:border-b-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#E31837]",
                          selected
                            ? "bg-[#FFF5D8] text-[#101828]"
                            : active
                              ? "bg-[#F4F7FA] text-[#101828]"
                              : "bg-white text-[#343944] hover:bg-[#F4F7FA]",
                        )}
                      >
                        {recipe}
                        {selected ? <Check className="ml-3 size-4 shrink-0 text-[#E31837]" aria-hidden /> : null}
                      </button>
                    );
                    })}
                  </div>
                </section>
              </div>
            ) : null}
          </div>
        </div>

        <footer className="bg-[#F8F9FB] px-5 pb-6 pt-1 sm:px-8">
          <div className="mx-auto grid max-w-[560px] grid-cols-2 items-center gap-3 sm:grid-cols-[132px_1fr_132px]">
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
              className="min-h-12 w-full rounded-[4px] bg-[#242832] px-5 text-base font-black text-white hover:bg-[#E31837] sm:col-start-3"
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
              className="mx-auto mt-4 flex min-h-10 items-center justify-center border-0 border-[#808080] text-sm font-medium text-black hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#808080]"
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
  const stepColors = ["#00589C", "#FFC835", "#FF563F", "#9BD31B"] as const;

  return (
    <div className="w-full max-w-[440px] pr-12 sm:pr-0" aria-label={`Step ${step} of 4`}>
      <div className="flex items-center gap-2.5">
        <div className="grid min-w-0 flex-1 grid-cols-4 gap-2" aria-hidden="true">
          {stepColors.map((color, index) => {
            const progressStep = index + 1;
            const completed = progressStep <= step;

            return (
              <span
                key={color}
                className="h-1.5 rounded-full transition-colors motion-reduce:transition-none"
                style={{ backgroundColor: completed ? color : "#D6E3EC" }}
              />
            );
          })}
        </div>
        <span className="shrink-0 text-base font-medium text-[#425466]">
          {step} of 4
        </span>
      </div>
    </div>
  );
}

function DelishWelcomeStep({
  name,
  cardName,
  location,
  cookStyle,
  favoriteRecipe,
  headingRef,
  onBack,
  onClose,
}: {
  name: string;
  cardName: string;
  location: string;
  cookStyle: string;
  favoriteRecipe: string;
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
            Welcome to Delish, {name}!
          </h2>
          <p
            id="delish-onboarding-description"
            className="mt-3 text-lg leading-7 text-[#5A6472] sm:text-xl"
          >
            Enjoy your Delish member benefits.
          </p>
          <div className="mt-7 w-full max-w-[520px]">
            <DelishMembershipCard
              name={cardName}
              location={location}
              cookStyle={cookStyle}
              favoriteRecipe={favoriteRecipe}
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
            Close
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
}: {
  name: string;
  location: string;
  cookStyle: string;
  favoriteRecipe: string;
}) {
  return (
    <section className="relative min-h-[300px] overflow-hidden rounded-[16px] bg-[#101010] p-6 text-white shadow-[0_14px_32px_rgba(0,0,0,0.28)] sm:min-h-[330px] sm:p-7">
      <div className="absolute -right-14 -top-14 size-44 rounded-full bg-[#E31837]/45" aria-hidden />
      <div className="absolute -bottom-20 left-8 size-52 rounded-full bg-[#FFC835]/20" aria-hidden />
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-[12px] bg-white text-[2.8rem] font-black leading-none text-[#101010]">
            d
          </div>
          <div className="min-w-0 text-left">
            <p className="w-full text-left text-sm font-black uppercase tracking-[0.16em] text-[#FFC835]">
              Delish
            </p>
            <h3
              className="mt-1 text-3xl font-black leading-none"
              style={{ fontFamily: delishHeadlineFont }}
            >
              Membership Card
            </h3>
          </div>
        </div>
        <div className="mt-12 grid gap-5 text-left sm:mt-20 sm:grid-cols-2">
          <CardDetail label="Name" value={name} />
          <CardDetail label="Home kitchen" value={location} />
          <CardDetail label="Cook style" value={cookStyle} />
          <CardDetail label="Favorite recipe" value={favoriteRecipe} />
        </div>
        <BrandLogo
          slug="delish"
          decorative
          color="rgba(255, 255, 255, 0.14)"
          className="pointer-events-none absolute bottom-0 right-0 w-[220px] translate-x-8 translate-y-2 [&_svg]:h-auto [&_svg]:w-full"
        />
      </div>
    </section>
  );
}

function CardDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 text-left">
      <p className="text-xs font-bold text-white/55">{label}</p>
      <p className="mt-1 break-words text-base font-normal leading-tight text-white">{value}</p>
    </div>
  );
}
