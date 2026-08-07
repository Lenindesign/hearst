"use client";

/* eslint-disable @next/next/no-img-element -- Decorative onboarding artwork uses external Fluent Emoji and prototype image assets. */

import React from "react";
import { createPortal } from "react-dom";
import { fluentEmojiPng } from "@/components/hearst-plus/fluent-emoji-art";
import type { HearstOnboardingResult } from "@/components/hearst-plus/onboarding-modal";
import { Button } from "@/components/ui/button";
import {
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  X,
} from "@/components/ui/icons";
import { useBodyPortalTarget, useModalIsolation } from "@/components/ui/use-modal-isolation";
import { cn } from "@/lib/utils";

export const motorTrendOnboardingStorageKey = "hearst-motortrend-onboarding-v1";

type MotorTrendUserType = "buyer" | "enthusiast" | "both";

type SelectedVehicle = {
  name: string;
  ownership: "own" | "want";
};

type MotorTrendOnboardingAnswers = {
  name: string;
  location: string;
  userType: MotorTrendUserType | null;
  vehicles: SelectedVehicle[];
  newsletters: string[];
};

type MotorTrendOnboardingModalProps = {
  open: boolean;
  onClose: () => void;
  onComplete: (result: HearstOnboardingResult) => void;
  onCreateProfile: (result: HearstOnboardingResult) => void;
  onSignIn: () => void;
};

const motorTrendLogo =
  "https://d2kde5ohu8qb21.cloudfront.net/files/68f3fc9ccfecd100026f4650/mtlogo.png";

const stepIllustrations = {
  1: fluentEmojiPng("Racing car"),
  2: fluentEmojiPng("Automobile"),
  3: fluentEmojiPng("Wheel"),
  4: fluentEmojiPng("Envelope"),
} as const;

const userTypeOptions = [
  {
    id: "buyer",
    title: "Buyer",
    description: "Shopping for a new or used car",
    image: fluentEmojiPng("Automobile"),
  },
  {
    id: "enthusiast",
    title: "Enthusiast",
    description: "Love cars, reviews, and auto culture",
    image: fluentEmojiPng("Racing car"),
  },
  {
    id: "both",
    title: "Both",
    description: "Car lover always eyeing the next ride",
    image: fluentEmojiPng("Wheel"),
  },
] as const;

const newsletterOptions = [
  {
    id: "motortrend",
    title: "Subscribe to MotorTrend Newsletter",
    description: "Trust MotorTrend for the best car reviews, news, car rankings, and much more",
    image: fluentEmojiPng("Automobile"),
  },
  {
    id: "hotrod",
    title: "Subscribe to HOT ROD Newsletter",
    description: "Get the latest automotive news and insights delivered to your inbox",
    image: fluentEmojiPng("Gear"),
  },
  {
    id: "events",
    title: "Subscribe to Our Events Newsletter",
    description: "Stay informed on our epic car events!",
    image: fluentEmojiPng("Calendar"),
  },
] as const;

const popularVehicles = [
  "2021 Subaru WRX",
  "2025 Ford Mustang GT",
  "2025 Chevrolet Corvette Z06",
  "2026 Dodge Charger Scat Pack Sixpack",
  "2024 Toyota GR86",
  "2025 Toyota Supra",
  "2025 Porsche 911 Carrera",
  "2025 Honda Civic Type R",
  "2026 Rivian R2",
  "2025 Toyota Tacoma",
  "2025 Tesla Model Y",
  "2025 Mazda CX-5",
] as const;

const vehicleImages: Record<string, string> = {
  "2021 Subaru WRX":
    "https://d2kde5ohu8qb21.cloudfront.net/files/6691c38a1be69000085340bb/003-2024-subaru-wrx-tr.jpg",
  "2025 Ford Mustang GT":
    "https://d2kde5ohu8qb21.cloudfront.net/files/68c9c7f8c0aa4a0002763d55/002-2025-ford-mustang-gtd-front-three-quarter-action.jpg",
  "2025 Chevrolet Corvette Z06":
    "https://d2kde5ohu8qb21.cloudfront.net/files/673bbb2647b20100081663f6/3-2025-chevrolet-corvette-z06-front-view.jpg",
  "2026 Dodge Charger Scat Pack Sixpack":
    "https://d2kde5ohu8qb21.cloudfront.net/files/6916828af93a630002c7ebe4/014-2026-dodge-charger-sixpack-scat-pack-front-left.jpg",
  "2024 Toyota GR86":
    "https://d2kde5ohu8qb21.cloudfront.net/files/66f2facb2b3a3a0008a59136/001-2024-toyota-gr86-trueno.jpg",
  "2025 Toyota Supra":
    "https://d2kde5ohu8qb21.cloudfront.net/files/66cf9fe3818d95000860c4e9/2025-toyota-gr-supra-gt4-evo2-17.jpg",
  "2025 Porsche 911 Carrera":
    "https://d2kde5ohu8qb21.cloudfront.net/files/68dc4bec967ad900029a891c/006-2025-porsche-911-t.jpg",
  "2025 Honda Civic Type R":
    "https://d2kde5ohu8qb21.cloudfront.net/files/65dcf5210e091c0008b94fd0/2020-honda-civic-si-coupe-front-three-quarter.jpg",
  "2026 Rivian R2":
    "https://d2kde5ohu8qb21.cloudfront.net/files/68e7e77f625c8d00026db5e7/rivianr2-4.jpg",
  "2025 Toyota Tacoma":
    "https://d2kde5ohu8qb21.cloudfront.net/files/66072b711f38f700086403b3/002-2024-toyota-tacoma-trailhunter.jpg",
  "2025 Tesla Model Y":
    "https://d2kde5ohu8qb21.cloudfront.net/files/679ba8a71142740008cffd40/2025-tesla-model-y-juniper-front-three-quarter.jpg",
  "2025 Mazda CX-5":
    "https://d2kde5ohu8qb21.cloudfront.net/files/6883d41a1ca92900021047b5/2026-mazda-cx-5-front-three-quarter-view.jpg",
};

const motorTrendFont = '"Poppins", "Inter", system-ui, sans-serif';

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function currentJoinDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${month}/${day}/${now.getFullYear()}`;
}

function buildMotorTrendOnboardingResult(
  answers: MotorTrendOnboardingAnswers,
): HearstOnboardingResult {
  const userType = userTypeOptions.find((option) => option.id === answers.userType);
  const newsletterNames = answers.newsletters
    .map((id) => newsletterOptions.find((option) => option.id === id)?.title)
    .filter(Boolean) as string[];
  const vehicleNames = answers.vehicles.map((vehicle) => vehicle.name);
  const interests = unique([
    ...(userType ? [userType.title] : []),
    ...vehicleNames,
    ...newsletterNames,
  ]);

  return {
    id: Date.now(),
    interests,
    brands: ["MotorTrend"],
    tags: unique([
      "motortrend",
      "autos",
      answers.location.toLowerCase(),
      ...interests.map((interest) => interest.toLowerCase()),
    ]),
  };
}

export function MotorTrendOnboardingModal({
  open,
  ...props
}: MotorTrendOnboardingModalProps) {
  const portalTarget = useBodyPortalTarget();

  if (!open || !portalTarget) return null;

  return <MotorTrendOnboardingModalContent {...props} portalTarget={portalTarget} />;
}

type MotorTrendOnboardingModalContentProps = Omit<
  MotorTrendOnboardingModalProps,
  "open"
> & {
  portalTarget: HTMLElement;
};

function MotorTrendOnboardingModalContent({
  onClose,
  onComplete,
  onCreateProfile,
  onSignIn,
  portalTarget,
}: MotorTrendOnboardingModalContentProps) {
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);
  const [showWelcome, setShowWelcome] = React.useState(false);
  const [readerName, setReaderName] = React.useState("");
  const [readerLocation, setReaderLocation] = React.useState("");
  const [isDetectingLocation, setIsDetectingLocation] = React.useState(false);
  const [locationMessage, setLocationMessage] = React.useState("");
  const [userType, setUserType] = React.useState<MotorTrendUserType | null>("buyer");
  const [selectedVehicles, setSelectedVehicles] = React.useState<SelectedVehicle[]>([]);
  const [vehicleQuery, setVehicleQuery] = React.useState("");
  const [activeVehicleIndex, setActiveVehicleIndex] = React.useState(0);
  const [selectedNewsletters, setSelectedNewsletters] = React.useState<string[]>(["motortrend"]);
  const dialogRef = React.useRef<HTMLElement | null>(null);
  const headingRef = React.useRef<HTMLHeadingElement | null>(null);
  const restoreFocusRef = React.useRef<HTMLElement | null>(null);
  const skipFocusRestoreRef = React.useRef(false);

  const answers = React.useMemo<MotorTrendOnboardingAnswers>(
    () => ({
      name: readerName.trim(),
      location: readerLocation.trim(),
      userType,
      vehicles: selectedVehicles,
      newsletters: selectedNewsletters,
    }),
    [readerLocation, readerName, selectedNewsletters, selectedVehicles, userType],
  );

  const result = React.useMemo(() => buildMotorTrendOnboardingResult(answers), [answers]);

  const filteredVehicles = React.useMemo(() => {
    const query = vehicleQuery.trim().toLowerCase();
    const matches = query
      ? popularVehicles.filter((vehicle) => vehicle.toLowerCase().includes(query))
      : popularVehicles;

    if (query && !matches.some((vehicle) => vehicle.toLowerCase() === query)) {
      return [...matches.slice(0, 5), vehicleQuery.trim()].filter(Boolean);
    }

    return matches.slice(0, 6);
  }, [vehicleQuery]);

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

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useModalIsolation(true, dialogRef);

  const detectLocation = React.useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationMessage("Location is not supported in this browser.");
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
        setLocationMessage("Location added.");
      }
    } catch (error) {
      if (error instanceof GeolocationPositionError && error.code === error.PERMISSION_DENIED) {
        setLocationMessage("Location permission was denied.");
      } else if (error instanceof GeolocationPositionError && error.code === error.TIMEOUT) {
        setLocationMessage("Location request timed out.");
      } else {
        setLocationMessage("Location is unavailable.");
      }
    } finally {
      setIsDetectingLocation(false);
    }
  }, []);

  const complete = React.useCallback(() => {
    skipFocusRestoreRef.current = true;
    try {
      window.localStorage.setItem(motorTrendOnboardingStorageKey, JSON.stringify(answers));
    } catch {
      // Local storage is optional for this prototype.
    }
    onComplete(result);
  }, [answers, onComplete, result]);

  const createProfile = React.useCallback(() => {
    skipFocusRestoreRef.current = true;
    onCreateProfile(result);
  }, [onCreateProfile, result]);

  const addVehicle = React.useCallback((vehicleName: string) => {
    const name = vehicleName.trim();
    if (!name) return;
    setSelectedVehicles((current) => {
      if (current.some((vehicle) => vehicle.name.toLowerCase() === name.toLowerCase())) {
        return current;
      }
      return [...current, { name, ownership: "own" }];
    });
    setVehicleQuery("");
    setActiveVehicleIndex(0);
  }, []);

  const nextDisabled = step === 1 ? !readerName.trim() : false;

  const goNext = () => {
    if (nextDisabled) return;
    if (step < 4) {
      setStep((current) => (current + 1) as 1 | 2 | 3 | 4);
      return;
    }
    setShowWelcome(true);
  };

  const goBack = () => {
    if (showWelcome) {
      setShowWelcome(false);
      setStep(4);
      return;
    }
    setStep((current) => Math.max(1, current - 1) as 1 | 2 | 3 | 4);
  };

  const skipStep = () => {
    if (step < 4) {
      setStep((current) => (current + 1) as 1 | 2 | 3 | 4);
      return;
    }
    setShowWelcome(true);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-[#1F222A]/88 px-4 py-4 text-[#101828] backdrop-blur-sm"
      role="presentation"
      style={{ fontFamily: motorTrendFont }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="motortrend-onboarding-title"
        className={cn(
          "relative z-10 max-h-[calc(100dvh-32px)] w-full overflow-y-auto rounded-[12px] bg-[#F8F9FB] shadow-[0_26px_70px_rgba(0,0,0,0.38)]",
          showWelcome ? "max-w-[680px]" : "max-w-[680px]",
        )}
      >
        {showWelcome ? (
          <WelcomeStep
            answers={answers}
            headingRef={headingRef}
            onBack={goBack}
            onClose={complete}
          />
        ) : (
          <>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#B9C0CC] bg-white text-[#20242E] transition hover:border-[#20242E] hover:bg-[#F3F4F6]"
              aria-label="Close MotorTrend onboarding"
            >
              <X aria-hidden className="h-5 w-5" />
            </button>

            <div className="mx-auto flex w-full max-w-[560px] flex-col items-center px-5 py-6 sm:px-8 sm:py-7">
              <div className="flex w-full flex-col items-center gap-1">
                <img
                  src={stepIllustrations[step]}
                  alt=""
                  className="h-[101px] w-auto max-w-[150px] object-contain"
                />
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[#101318]">
                  Step {step}/4
                </p>
              </div>

              {step === 1 ? (
                <StepOne
                  readerName={readerName}
                  setReaderName={setReaderName}
                  readerLocation={readerLocation}
                  setReaderLocation={setReaderLocation}
                  isDetectingLocation={isDetectingLocation}
                  locationMessage={locationMessage}
                  onDetectLocation={detectLocation}
                  headingRef={headingRef}
                />
              ) : null}

              {step === 2 ? (
                <StepTwo
                  selectedUserType={userType}
                  setSelectedUserType={setUserType}
                  headingRef={headingRef}
                />
              ) : null}

              {step === 3 ? (
                <StepThree
                  selectedVehicles={selectedVehicles}
                  setSelectedVehicles={setSelectedVehicles}
                  vehicleQuery={vehicleQuery}
                  setVehicleQuery={setVehicleQuery}
                  filteredVehicles={filteredVehicles}
                  activeVehicleIndex={activeVehicleIndex}
                  setActiveVehicleIndex={setActiveVehicleIndex}
                  onAddVehicle={addVehicle}
                  headingRef={headingRef}
                />
              ) : null}

              {step === 4 ? (
                <StepFour
                  selectedNewsletters={selectedNewsletters}
                  setSelectedNewsletters={setSelectedNewsletters}
                  headingRef={headingRef}
                />
              ) : null}

              <footer className="mt-5 grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  disabled={step === 1}
                  className="h-11 rounded-[4px] border-[#ADB5C2] bg-transparent text-sm font-semibold text-[#343944] disabled:opacity-40"
                >
                  <ChevronLeft aria-hidden className="mr-3 h-5 w-5" />
                  Back
                </Button>

                <button
                  type="button"
                  onClick={skipStep}
                  className="text-sm font-semibold text-[#6B7280] underline underline-offset-2 transition hover:text-[#20242E]"
                >
                  Skip this step
                </button>

                <Button
                  type="button"
                  onClick={goNext}
                  disabled={nextDisabled}
                  className="h-11 justify-self-end rounded-[4px] bg-[#20242E] px-6 text-sm font-semibold text-white hover:bg-[#111318] disabled:bg-[#90949B]"
                >
                  {step === 4 ? "Complete" : "Next"}
                  <ChevronRight aria-hidden className="ml-3 h-5 w-5" />
                </Button>
              </footer>

              {step === 1 ? (
                <button
                  type="button"
                  onClick={onSignIn}
                  className="mt-4 text-sm font-medium text-black transition hover:underline"
                >
                  Already have a profile? Sign in
                </button>
              ) : null}

              {step === 4 ? (
                <button
                  type="button"
                  onClick={createProfile}
                  className="mt-3 text-xs font-semibold text-[#343944] transition hover:text-[#101318] hover:underline"
                >
                  Create a full profile instead
                </button>
              ) : null}
            </div>
          </>
        )}
      </section>
    </div>,
    portalTarget,
  );
}

type HeadingRef = React.RefObject<HTMLHeadingElement | null>;

function StepOne({
  readerName,
  setReaderName,
  readerLocation,
  setReaderLocation,
  isDetectingLocation,
  locationMessage,
  onDetectLocation,
  headingRef,
}: {
  readerName: string;
  setReaderName: (value: string) => void;
  readerLocation: string;
  setReaderLocation: (value: string) => void;
  isDetectingLocation: boolean;
  locationMessage: string;
  onDetectLocation: () => void;
  headingRef: HeadingRef;
}) {
  return (
    <>
      <div className="mt-4 text-center">
        <h2
          id="motortrend-onboarding-title"
          ref={headingRef}
          tabIndex={-1}
          className="text-[1.75rem] font-semibold leading-[1.12] tracking-[-0.025em] text-[#101828] outline-none"
        >
          Start Your Engines
        </h2>
        <p className="mt-1.5 text-lg font-normal leading-snug text-[#586172]">
          Let&apos;s get to know each other
        </p>
      </div>

      <div className="mt-5 w-full rounded-[10px] bg-white p-4 shadow-[0_10px_24px_rgba(16,24,40,0.07)] sm:p-5">
        <label className="block text-base font-normal text-[#343944]">
          What is Your Name?
          <input
            value={readerName}
            onChange={(event) => setReaderName(event.target.value)}
            className="mt-2 h-12 w-full rounded-[9px] border border-[#ADB5C2] bg-white px-4 text-base font-normal text-[#101828] outline-none transition placeholder:text-[#A7AFBE] focus:border-[#20242E] focus:ring-2 focus:ring-[#20242E]/15"
            placeholder="Name"
          />
        </label>

        <label className="mt-4 block text-base font-normal text-[#343944]">
          Where are you located? <span className="text-[#586172]">(Optional)</span>
          <span className="relative mt-2 block">
            <input
              value={readerLocation}
              onChange={(event) => setReaderLocation(event.target.value)}
              className="h-12 w-full rounded-[9px] border border-[#ADB5C2] bg-white px-4 pr-[48px] text-base font-normal text-[#101828] outline-none transition placeholder:text-[#A7AFBE] focus:border-[#20242E] focus:ring-2 focus:ring-[#20242E]/15"
              placeholder="Current Location"
            />
            <button
              type="button"
              onClick={onDetectLocation}
              disabled={isDetectingLocation}
              className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#20242E] transition hover:bg-[#EEF1F5] disabled:opacity-50"
              aria-label="Use current location"
            >
              <MapPin aria-hidden className={cn("h-6 w-6", isDetectingLocation && "animate-pulse")} />
            </button>
          </span>
        </label>
        {locationMessage ? (
          <p className="mt-2 text-xs font-medium text-[#586172]" aria-live="polite">
            {locationMessage}
          </p>
        ) : null}
      </div>
    </>
  );
}

function StepTwo({
  selectedUserType,
  setSelectedUserType,
  headingRef,
}: {
  selectedUserType: MotorTrendUserType | null;
  setSelectedUserType: (value: MotorTrendUserType) => void;
  headingRef: HeadingRef;
}) {
  return (
    <>
      <div className="mt-4 text-center">
        <h2
          id="motortrend-onboarding-title"
          ref={headingRef}
          tabIndex={-1}
          className="text-[2rem] font-semibold leading-tight tracking-[-0.03em] text-[#101828] outline-none"
        >
          What describes you best?
        </h2>
        <p className="mt-2 text-lg font-normal leading-snug text-[#586172]">
          Choose the option that best fits your automotive interests
        </p>
      </div>

      <div className="mt-5 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
        {userTypeOptions.map((option) => {
          const selected = selectedUserType === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedUserType(option.id)}
              className={cn(
                "flex min-h-[132px] flex-col items-center rounded-[12px] border-2 p-3 text-center transition",
                selected
                  ? "border-[#20242E] bg-[#20242E] text-white shadow-[0_10px_28px_rgba(16,24,40,0.18)]"
                  : "border-[#D5DBE5] bg-white text-[#20242E] hover:-translate-y-0.5 hover:border-[#AAB3C2] hover:shadow-[0_8px_22px_rgba(16,24,40,0.08)]",
              )}
            >
              <img
                src={option.image}
                alt=""
                className={cn(
                  "h-[58px] w-full rounded-[9px] object-contain p-1.5",
                  selected ? "bg-white/95" : "bg-[#F3F4F6]",
                )}
              />
              <span className="mt-3 text-base font-semibold leading-tight">{option.title}</span>
              <span className={cn("mt-1.5 text-sm leading-snug", selected ? "text-white/85" : "text-[#586172]")}>
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function StepThree({
  selectedVehicles,
  setSelectedVehicles,
  vehicleQuery,
  setVehicleQuery,
  filteredVehicles,
  activeVehicleIndex,
  setActiveVehicleIndex,
  onAddVehicle,
  headingRef,
}: {
  selectedVehicles: SelectedVehicle[];
  setSelectedVehicles: React.Dispatch<React.SetStateAction<SelectedVehicle[]>>;
  vehicleQuery: string;
  setVehicleQuery: (value: string) => void;
  filteredVehicles: readonly string[];
  activeVehicleIndex: number;
  setActiveVehicleIndex: (value: number) => void;
  onAddVehicle: (value: string) => void;
  headingRef: HeadingRef;
}) {
  return (
    <>
      <div className="mt-4 text-center">
        <h2
          id="motortrend-onboarding-title"
          ref={headingRef}
          tabIndex={-1}
          className="text-[2rem] font-semibold leading-tight tracking-[-0.03em] text-[#101828] outline-none"
        >
          Tell Us About Your Ride
        </h2>
        <p className="mt-2 text-lg font-normal leading-snug text-[#586172]">
          Search for the vehicles you drive and rate how they stack up
        </p>
      </div>

      <div className="mt-5 w-full rounded-[10px] bg-white p-4 shadow-[0_10px_24px_rgba(16,24,40,0.07)] sm:p-5">
        <label className="block text-base font-semibold text-[#20242E]" htmlFor="motortrend-vehicle-search">
          {selectedVehicles.length ? "Add Another Vehicle" : "Search for a vehicle"}
        </label>
        <div className="relative mt-3">
          <input
            id="motortrend-vehicle-search"
            value={vehicleQuery}
            onChange={(event) => {
              setVehicleQuery(event.target.value);
              setActiveVehicleIndex(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveVehicleIndex(Math.min(activeVehicleIndex + 1, filteredVehicles.length - 1));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveVehicleIndex(Math.max(activeVehicleIndex - 1, 0));
              } else if (event.key === "Enter") {
                event.preventDefault();
                onAddVehicle(filteredVehicles[activeVehicleIndex] ?? vehicleQuery);
              }
            }}
            className="h-12 w-full rounded-[9px] border border-[#ADB5C2] bg-white px-4 pr-11 text-base text-[#101828] outline-none transition placeholder:text-[#A7AFBE] focus:border-[#20242E] focus:ring-2 focus:ring-[#20242E]/15"
            placeholder="Start typing to search..."
            role="combobox"
            aria-expanded="true"
            aria-controls="motortrend-vehicle-options"
          />
          <Search aria-hidden className="absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 text-[#586172]" />
        </div>

        <div id="motortrend-vehicle-options" className="mt-3 grid gap-2" role="listbox">
          {filteredVehicles.map((vehicle, index) => (
            <button
              key={`${vehicle}-${index}`}
              type="button"
              role="option"
              aria-selected={index === activeVehicleIndex}
              onMouseEnter={() => setActiveVehicleIndex(index)}
              onClick={() => onAddVehicle(vehicle)}
              className={cn(
                "flex items-center gap-3 rounded-[8px] border px-3 py-2.5 text-left text-sm font-semibold transition",
                index === activeVehicleIndex
                  ? "border-[#20242E] bg-[#F2F4F7]"
                  : "border-[#D5DBE5] bg-white hover:border-[#AAB3C2]",
              )}
            >
              {vehicleImages[vehicle] ? (
                <img
                  src={vehicleImages[vehicle]}
                  alt=""
                  className="h-9 w-14 rounded-[6px] object-cover"
                />
              ) : (
                <span className="inline-flex h-9 w-14 items-center justify-center rounded-[6px] bg-[#EEF1F5]">
                  <Car aria-hidden className="h-5 w-5" />
                </span>
              )}
              <span>{vehicle}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedVehicles.length ? (
        <div className="mt-4 grid w-full gap-2">
          {selectedVehicles.map((vehicle) => (
            <div
              key={vehicle.name}
              className="flex items-center gap-3 rounded-[10px] border border-[#D5DBE5] bg-white p-3 shadow-[0_6px_18px_rgba(16,24,40,0.06)]"
            >
              <img
                src={vehicleImages[vehicle.name] ?? vehicleImages["2021 Subaru WRX"]}
                alt=""
                className="h-14 w-20 rounded-[7px] object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-[#101828]">{vehicle.name}</p>
                <div className="mt-2 flex gap-2">
                  {(["own", "want"] as const).map((ownership) => (
                    <button
                      key={ownership}
                      type="button"
                      onClick={() => {
                        setSelectedVehicles((current) =>
                          current.map((item) =>
                            item.name === vehicle.name
                              ? { ...item, ownership }
                              : item,
                          ),
                        );
                      }}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-semibold capitalize transition",
                        vehicle.ownership === ownership
                          ? "border-[#ED1C24] bg-[#ED1C24] text-white"
                          : "border-[#D5DBE5] bg-white text-[#586172]",
                      )}
                    >
                      {ownership}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVehicles((current) => current.filter((item) => item.name !== vehicle.name))}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-[#586172] hover:bg-[#F2F4F7] hover:text-[#101828]"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}

function StepFour({
  selectedNewsletters,
  setSelectedNewsletters,
  headingRef,
}: {
  selectedNewsletters: string[];
  setSelectedNewsletters: React.Dispatch<React.SetStateAction<string[]>>;
  headingRef: HeadingRef;
}) {
  return (
    <>
      <div className="mt-4 text-center">
        <h2
          id="motortrend-onboarding-title"
          ref={headingRef}
          tabIndex={-1}
          className="text-[2rem] font-semibold leading-tight tracking-[-0.03em] text-[#101828] outline-none"
        >
          Let&apos;s Keep In Touch
        </h2>
        <p className="mt-2 text-lg font-normal leading-snug text-[#586172]">
          With Personalized Car Information and Inspiration
        </p>
      </div>

      <div className="mt-5 grid w-full gap-2.5">
        {newsletterOptions.map((newsletter) => {
          const selected = selectedNewsletters.includes(newsletter.id);
          return (
            <button
              key={newsletter.id}
              type="button"
              onClick={() => {
                setSelectedNewsletters((current) =>
                  current.includes(newsletter.id)
                    ? current.filter((id) => id !== newsletter.id)
                    : [...current, newsletter.id],
                );
              }}
              className={cn(
                "flex items-center gap-3 rounded-[12px] border-2 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(16,24,40,0.08)]",
                selected ? "border-[#20242E]" : "border-[#D5DBE5]",
              )}
            >
              <img
                src={newsletter.image}
                alt=""
                className="h-12 w-12 shrink-0 rounded-[8px] bg-[#F3F4F6] object-contain p-1"
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] border",
                      selected ? "border-[#20242E] bg-[#20242E] text-white" : "border-[#ADB5C2] bg-white",
                    )}
                    aria-hidden
                  >
                    {selected ? <Check className="h-4 w-4" /> : null}
                  </span>
                  <span className="text-base font-semibold text-[#101828]">{newsletter.title}</span>
                </span>
                <span className="mt-1.5 block text-sm leading-snug text-[#586172]">
                  {newsletter.description}
                </span>
              </span>
            </button>
          );
        })}

        <div className="rounded-[10px] bg-white px-4 py-3 text-xs leading-relaxed text-[#586172] shadow-[0_6px_18px_rgba(16,24,40,0.06)]">
          <strong className="text-[#101828]">Your privacy matters</strong>
          <br />
          We will never share your email address. You can unsubscribe at any time with one click.
        </div>
      </div>
    </>
  );
}

function WelcomeStep({
  answers,
  headingRef,
  onBack,
  onClose,
}: {
  answers: MotorTrendOnboardingAnswers;
  headingRef: HeadingRef;
  onBack: () => void;
  onClose: () => void;
}) {
  const firstName = answers.name || "Driver";
  const selectedCar = answers.vehicles[0]?.name || "No vehicle selected";
  const newsletter = answers.newsletters.length
    ? newsletterOptions.find((option) => option.id === answers.newsletters[0])?.title
        .replace("Subscribe to ", "")
        .replace(" Newsletter", "") ?? "MotorTrend"
    : "None";

  return (
    <div className="mx-auto flex w-full max-w-[620px] flex-col items-center px-5 py-8 sm:px-8 sm:py-9">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#B9C0CC] bg-white text-[#20242E] transition hover:border-[#20242E] hover:bg-[#F3F4F6]"
        aria-label="Close MotorTrend onboarding"
      >
        <X aria-hidden className="h-5 w-5" />
      </button>

      <img
        src={motorTrendLogo}
        alt="MotorTrend"
        className="h-auto w-[220px] max-w-full object-contain"
      />

      <div className="mt-6 text-center">
        <h2
          id="motortrend-onboarding-title"
          ref={headingRef}
          tabIndex={-1}
          className="text-[2rem] font-semibold leading-tight tracking-[-0.035em] text-[#101318] outline-none sm:text-[2.5rem]"
        >
          Welcome to the Club, {firstName}!
        </h2>
        <p className="mt-3 text-lg font-normal leading-snug text-[#586172] sm:text-xl">
          Enjoy your MotorTrend member benefits.
        </p>
      </div>

      <section
        aria-label="MotorTrend Membership Card"
        className="relative mt-7 flex aspect-[1.6/1] w-full max-w-[520px] flex-col overflow-hidden rounded-[16px] bg-[linear-gradient(145deg,#3A3A3C_0%,#2C2C2E_30%,#1C1C1E_70%,#141416_100%)] p-6 text-white shadow-[0_18px_38px_-12px_rgba(0,0,0,0.5),0_10px_20px_-8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] sm:p-7"
      >
        <img
          src="https://d2kde5ohu8qb21.cloudfront.net/files/6929d1a44c063a0002bb760d/union.svg"
          alt=""
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[70%] w-[110%] -translate-x-1/2 -translate-y-1/2 object-contain opacity-40"
        />
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-center gap-5">
            <img
              src="https://d2kde5ohu8qb21.cloudfront.net/files/68fabbe380bc4f00028943ef/mt40.svg"
              alt=""
              className="h-16 w-16 shrink-0 sm:h-20 sm:w-20"
            />
            <div>
              <p className="text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[1.75rem]">
                Membership Card
              </p>
              <p className="mt-1 text-base leading-snug text-[#B7BCC6]">
                MotorTrend Member
              </p>
            </div>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-x-8 gap-y-4">
            <CardDetail label="Member Since" value={currentJoinDate()} />
            <CardDetail label="Name" value={firstName} />
            <CardDetail label="My Car" value={selectedCar} />
            <CardDetail label="Newsletter" value={newsletter} />
          </div>
        </div>
      </section>

      <footer className="mt-8 grid w-full grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-12 rounded-[4px] border-[#ADB5C2] bg-transparent text-base font-semibold text-[#343944]"
        >
          <ChevronLeft aria-hidden className="mr-3 h-5 w-5" />
          Back
        </Button>
        <Button
          type="button"
          onClick={onClose}
          className="h-12 rounded-[4px] bg-[#20242E] text-base font-semibold text-white hover:bg-[#111318]"
        >
          Close
        </Button>
      </footer>
    </div>
  );
}

function CardDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-left">
      <p className="text-sm font-normal leading-snug text-[#B7BCC6]">{label}</p>
      <p className="mt-1 text-xl font-semibold leading-tight text-white">{value}</p>
    </div>
  );
}
