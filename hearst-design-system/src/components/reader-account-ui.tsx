"use client";

import React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  Check,
  ChevronRight,
  FolderPlus,
  LogOut,
  MessageCircle,
  Settings,
  Sparkles,
  Trash2,
  User,
  X,
} from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getHearstStoryRoute } from "@/lib/story-routes";
import { useBodyPortalTarget, useModalIsolation } from "@/components/ui/use-modal-isolation";
import { BrandSourceIcon } from "./hearst-plus/brand-source-icon";
import { BrandLogo } from "./brand-logo";
import type { LifestyleRiverProfile, LifestyleRiverStory } from "./lifestyle-river-types";
import { useReaderAccount, type ReaderAccount, type ReaderCollection } from "./reader-account";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  getReaderProfileRecommendationReason,
  getReaderProfileRecommendations,
  profileOptionPreviewLimit,
  rankReaderProfileOptions,
} from "@/lib/reader-profile-recommendations";

export type ReaderAuthMode = "create" | "signIn";

type GoogleCredentialResponse = { credential: string };

const compactAuthInputClass = "mt-1.5 [&>div]:h-11";

function getLibraryStoryHref(story: Pick<LifestyleRiverStory, "id">) {
  return `${getHearstStoryRoute(story)}?from=${encodeURIComponent("/hearst-plus/")}`;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            context?: "signin" | "signup" | "use";
          }) => void;
          prompt: () => void;
          renderButton: (parent: HTMLElement, options: Record<string, string | number>) => void;
        };
      };
    };
  }
}

function loadGoogleIdentityServices() {
  return new Promise<void>((resolve, reject) => {
    if (window.google?.accounts.id) {
      resolve();
      return;
    }

    const existing = document.getElementById("google-identity-services");
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Google sign-in could not load.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = "google-identity-services";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google sign-in could not load."));
    document.head.appendChild(script);
  });
}

export interface ReaderAvatarProps {
  account: Pick<ReaderAccount, "firstName" | "lastName" | "avatarUrl">;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function ReaderAvatar({
  account,
  size = "default",
  className,
}: ReaderAvatarProps) {
  const initials = `${account.firstName.slice(0, 1)}${account.lastName.slice(0, 1)}`.toUpperCase();

  return (
    <Avatar size={size} className={className} aria-hidden>
      {account.avatarUrl ? <AvatarImage src={account.avatarUrl} alt="" referrerPolicy="no-referrer" /> : null}
      <AvatarFallback className="bg-muted font-bold text-foreground">
        {initials || "H+"}
      </AvatarFallback>
    </Avatar>
  );
}

function ModalFrame({
  open,
  titleId,
  onClose,
  children,
  className,
}: {
  open: boolean;
  titleId: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const dialogRef = React.useRef<HTMLElement>(null);
  const onCloseRef = React.useRef(onClose);
  const portalTarget = useBodyPortalTarget();

  React.useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useModalIsolation(open && Boolean(portalTarget), dialogRef);

  React.useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector))
        .filter((element) => element.getClientRects().length > 0);
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeIndex = document.activeElement instanceof HTMLElement
        ? focusable.indexOf(document.activeElement)
        : -1;
      if (!dialog.contains(document.activeElement) || activeIndex === -1) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && activeIndex === 0) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeIndex === focusable.length - 1) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.requestAnimationFrame(() => {
      dialog?.querySelector<HTMLElement>("[data-modal-close]")?.focus();
    });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!open || !portalTarget) return null;

  return createPortal(
    <div className="fixed inset-0 z-[280] flex items-center justify-center bg-foreground/55 p-4 backdrop-blur-sm sm:p-6">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "relative z-10 flex max-h-[calc(100dvh-2rem)] w-full flex-col overflow-hidden rounded-[8px] bg-background shadow-2xl",
          className
        )}
      >
        {children}
      </section>
    </div>,
    portalTarget
  );
}

export interface SaveAcrossDevicesDialogProps {
  open: boolean;
  onClose: () => void;
  onSignIn: () => void;
  onCreateProfile: () => void;
}

export function SaveAcrossDevicesDialog({
  open,
  onClose,
  onSignIn,
  onCreateProfile,
}: SaveAcrossDevicesDialogProps) {
  return (
    <ModalFrame
      open={open}
      titleId="save-across-devices-title"
      onClose={onClose}
      className="max-w-[24rem] bg-background"
    >
      <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-[8px] bg-primary/10 text-primary">
            <Check className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-primary">
              Saved on this device
            </p>
            <h2 id="save-across-devices-title" className="mt-1 text-lg font-bold leading-tight text-foreground">
              Save Across Devices
            </h2>
          </div>
        </div>
        <button
          type="button"
          data-modal-close
          onClick={onClose}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-[var(--component-button-radius-default)] text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 motion-reduce:transition-none"
          aria-label="Close save prompt"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
      <div className="px-5 py-5 sm:px-6">
        <p className="text-sm leading-6 text-muted-foreground">
          Your story is saved here. Sign in or create a profile to keep your saved stories on every device.
        </p>
        <div className="mt-5 grid gap-2.5">
          <Button type="button" size="touch" onClick={onSignIn} className="w-full font-bold">
            Sign in
          </Button>
          <Button type="button" size="touch" variant="outline" onClick={onCreateProfile} className="w-full">
            Create profile
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={onClose} className="mx-auto mt-1 w-fit px-3 text-muted-foreground">
            Not now
          </Button>
        </div>
      </div>
    </ModalFrame>
  );
}

export interface ReaderAuthDialogProps {
  open: boolean;
  initialMode?: ReaderAuthMode;
  defaultPreferences: LifestyleRiverProfile;
  onClose: () => void;
  onAuthenticated?: () => void;
}

export function ReaderAuthDialog({
  open,
  initialMode = "signIn",
  defaultPreferences,
  onClose,
  onAuthenticated,
}: ReaderAuthDialogProps) {
  const { createAccount, continueWithGoogle, signIn } = useReaderAccount();
  const googleClientId = typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    : undefined;
  const [mode, setMode] = React.useState<ReaderAuthMode>(initialMode);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const [error, setError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const googleButtonRef = React.useRef<HTMLDivElement>(null);
  const googleCredentialHandlerRef = React.useRef<(credential: string) => void>(() => {});
  const googleInitializedRef = React.useRef(false);
  const [googleReady, setGoogleReady] = React.useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    if (mode === "create") {
      if (!firstName.trim()) {
        setError("Enter your first name.");
        return;
      }
      if (password.length < 8) {
        setError("Use at least 8 characters for your password.");
        return;
      }
      if (password !== confirmPassword) {
        setError("The passwords do not match.");
        return;
      }
      if (!acceptedTerms) {
        setError("Accept the terms to create your account.");
        return;
      }
    }

    setSubmitting(true);
    try {
      if (mode === "create") {
        await createAccount({ firstName, lastName, email, password, preferences: defaultPreferences });
      } else {
        await signIn(email, password);
      }
      onAuthenticated?.();
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "We could not complete that request.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitGoogleCredential = React.useCallback(async (credential: string) => {
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ credential }),
      });
      const payload = await response.json() as {
        error?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        avatarUrl?: string;
        syncId?: string;
      };
      if (!response.ok || !payload.email || !payload.firstName || !payload.syncId) {
        throw new Error(payload.error ?? "Google could not verify this sign-in.");
      }

      await continueWithGoogle({
        firstName: payload.firstName,
        lastName: payload.lastName ?? "",
        email: payload.email,
        avatarUrl: payload.avatarUrl,
        syncId: payload.syncId,
        preferences: defaultPreferences,
      });
      onAuthenticated?.();
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "We could not complete that request.");
    } finally {
      setSubmitting(false);
    }
  }, [continueWithGoogle, defaultPreferences, onAuthenticated, onClose]);

  React.useEffect(() => {
    googleCredentialHandlerRef.current = (credential) => {
      void submitGoogleCredential(credential);
    };
  }, [submitGoogleCredential]);

  React.useEffect(() => {
    if (!open || !googleClientId) return;

    let cancelled = false;
    loadGoogleIdentityServices()
      .then(() => {
        if (cancelled || !window.google?.accounts.id) return;
        if (!googleInitializedRef.current) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: ({ credential }) => googleCredentialHandlerRef.current(credential),
            auto_select: false,
            cancel_on_tap_outside: true,
            context: initialMode === "create" ? "signup" : "signin",
          });
          googleInitializedRef.current = true;
        }
        setGoogleReady(true);
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Google sign-in could not load.");
      });

    return () => {
      cancelled = true;
    };
  }, [googleClientId, initialMode, open]);

  React.useEffect(() => {
    if (!open || !googleClientId || !googleReady || !window.google?.accounts.id || !googleButtonRef.current) return;
    googleButtonRef.current.replaceChildren();
    window.google.accounts.id.renderButton(googleButtonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: mode === "create" ? "signup_with" : "signin_with",
      shape: "rectangular",
      width: 400,
    });
    window.google.accounts.id.prompt();
  }, [googleClientId, googleReady, mode, open]);

  return (
    <ModalFrame
      open={open}
      onClose={onClose}
      titleId="reader-auth-title"
      className="h-[min(700px,calc(100dvh-2rem))] max-w-4xl sm:h-[min(700px,calc(100dvh-3rem))] lg:grid lg:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.1fr)]"
    >
      <div className="relative hidden h-full overflow-hidden bg-muted lg:block">
        <Image
          src="/images/hearst-plus-onboarding.png"
          alt=""
          fill
          sizes="50vw"
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 p-7 text-white">
          <p className="text-[length:var(--text-token-4xs)] font-bold uppercase tracking-widest text-white/80">
            Your daily Hearst+
          </p>
          <p className="headline mt-3 max-w-sm text-4xl leading-tight">
            Save the feed that feels built for you.
          </p>
        </div>
      </div>

      <div className="flex min-h-0 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3 sm:px-6">
          <BrandLogo
            slug="hearst-all"
            className="[&_svg]:h-6 [&_svg]:w-auto [&_svg]:max-w-[175px]"
            color="var(--color-primary)"
          />
          <Button data-modal-close variant="outline" size="icon-lg" className="size-11" onClick={onClose} aria-label="Close account dialog">
            <X className="h-4 w-4" aria-hidden />
          </Button>
        </div>
        <form className="min-h-0 flex-1 overflow-y-auto p-5 sm:px-6 sm:py-5" onSubmit={submit} noValidate>
          <h2 id="reader-auth-title" className="headline text-3xl leading-tight outline-none">
            {mode === "create" ? "Create your Hearst+ profile." : "Welcome back to Hearst+."}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-5 text-muted-foreground">
            {mode === "create"
              ? "Save your feed, collections, comments, and reading history in this browser."
              : "Resume the feed and library saved in this browser."}
          </p>

          {googleClientId ? (
            <>
              <div
                className="mt-4 flex min-h-11 w-full [&_.S9gUrf-YoZ4jf]:!w-full [&_.S9gUrf-YoZ4jf>div]:!w-full [&_[role=button]]:!min-h-11 [&_[role=button]]:!w-full [&_[role=button]]:!max-w-none"
                ref={googleButtonRef}
                aria-label="Continue with Google"
              />
              {submitting ? <p className="mt-2 text-sm font-semibold text-muted-foreground">Verifying Google sign-in...</p> : null}
              <div className="my-4 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs font-bold text-muted-foreground">Or use email</span>
                <span className="h-px flex-1 bg-border" />
              </div>
            </>
          ) : null}

          <div className="space-y-3">
            {mode === "create" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-semibold">
                  First name
                  <Input size="lg" className={compactAuthInputClass} value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" />
                </label>
                <label className="text-sm font-semibold">
                  Last name
                  <Input size="lg" className={compactAuthInputClass} value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name" />
                </label>
              </div>
            ) : null}
            <label className="block text-sm font-semibold">
              Email
              <Input size="lg" className={compactAuthInputClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
            </label>
            {mode === "create" ? (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-sm font-semibold">
                    Password
                    <Input size="lg" className={compactAuthInputClass} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" />
                  </label>
                  <label className="text-sm font-semibold">
                    Confirm password
                    <Input size="lg" className={compactAuthInputClass} type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" />
                  </label>
                </div>
                <label className="flex min-h-11 items-start gap-2 py-0.5 text-sm leading-5">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) => setAcceptedTerms(event.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[var(--color-primary)]"
                  />
                  <span>I agree to the Terms of Use and acknowledge the Privacy Notice.</span>
                </label>
              </>
            ) : (
              <label className="block text-sm font-semibold">
                Password
                <Input size="lg" className={compactAuthInputClass} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
              </label>
            )}
          </div>

          {error ? (
            <p role="alert" className="mt-3 rounded-[8px] bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">
              {error}
            </p>
          ) : null}

          <Button className="mt-4 min-h-11 w-full" type="submit" disabled={submitting}>
            {submitting ? "Please wait" : mode === "create" ? "Create Local Profile" : "Sign In"}
          </Button>
          <button
            type="button"
            className="mt-3 min-h-11 w-full rounded-[8px] text-center text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => {
              setMode((current) => current === "create" ? "signIn" : "create");
              setError("");
            }}
          >
            {mode === "create" ? "Already have a local profile? Sign in" : "New to Hearst+? Create a local demo profile"}
          </button>
          <p className="mt-4 border-t border-border pt-3 text-xs leading-4 text-muted-foreground">
            Google profiles sync across signed-in devices. Email profiles stay in this browser.
          </p>
        </form>
      </div>
    </ModalFrame>
  );
}

type ProfileTab = "overview" | "personalization" | "recommendations" | "library" | "activity" | "settings";

const profileTabs: { id: ProfileTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "Profile", icon: User },
  { id: "personalization", label: "Tune For You", icon: Check },
  { id: "recommendations", label: "Recommended", icon: Sparkles },
  { id: "library", label: "Library", icon: Bookmark },
  { id: "activity", label: "Comments", icon: MessageCircle },
  { id: "settings", label: "Account", icon: Settings },
];

function BrandMark({ brand, stories }: { brand: string; stories: LifestyleRiverStory[] }) {
  const brandSlug = stories.find((story) => story.brand === brand)?.brandSlug;
  return (
    <BrandSourceIcon
      brand={brand}
      brandSlug={brandSlug ?? ""}
      className="size-8 rounded-[4px] bg-white"
    />
  );
}

export interface ReaderProfileDialogProps {
  open: boolean;
  stories: LifestyleRiverStory[];
  topics: string[];
  brands: string[];
  onClose: () => void;
}

export function ReaderProfileDialog({
  open,
  stories,
  topics,
  brands,
  onClose,
}: ReaderProfileDialogProps) {
  const {
    account,
    syncState,
    updateAccount,
    updatePreferences,
    reconcileStorySnapshots,
    signOut,
    deleteAccount,
    deleteComment,
    createCollection,
    deleteCollection,
    toggleStoryInCollection,
    removeSavedStory,
    removeStoriesFromCollection,
    retrySync,
  } = useReaderAccount();
  const [tab, setTab] = React.useState<ProfileTab>("overview");
  const [firstName, setFirstName] = React.useState(() => account?.firstName ?? "");
  const [lastName, setLastName] = React.useState(() => account?.lastName ?? "");
  const [collectionName, setCollectionName] = React.useState("");
  const [collectionStatus, setCollectionStatus] = React.useState("");
  const collectionNameRef = React.useRef<HTMLInputElement>(null);
  const [profileSaved, setProfileSaved] = React.useState(false);
  const readLaterCollection = account?.collections.find((collection) => collection.name === "Read Later");
  const customCollections = account?.collections.filter((collection) => collection.name !== "Read Later") ?? [];
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [pendingCollectionDeleteId, setPendingCollectionDeleteId] = React.useState<string>();
  const [pendingCommentDeleteId, setPendingCommentDeleteId] = React.useState<string>();
  const [commentStatus, setCommentStatus] = React.useState("");
  const libraryHeadingRef = React.useRef<HTMLHeadingElement>(null);
  const savedStoriesHeadingRef = React.useRef<HTMLHeadingElement>(null);
  const savedStoryRemoveButtonRefs = React.useRef(new Map<string, HTMLButtonElement>());
  const commentsHeadingRef = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    if (account) reconcileStorySnapshots(stories);
  }, [account, reconcileStorySnapshots, stories]);

  if (!account) return null;

  const storyById = new Map(stories.map((story) => [story.id, story]));
  const storyBySourceUrl = new Map(
    stories.flatMap((story) => story.sourceUrl ? [[story.sourceUrl, story] as const] : [])
  );
  const resolveStory = (id: string) => {
    const snapshot = account.storySnapshots[id];
    return storyById.get(id)
      ?? (snapshot?.sourceUrl ? storyBySourceUrl.get(snapshot.sourceUrl) : undefined)
      ?? snapshot;
  };
  const isCurrentStory = (id: string) => {
    const snapshot = account.storySnapshots[id];
    return storyById.has(id) || Boolean(snapshot?.sourceUrl && storyBySourceUrl.has(snapshot.sourceUrl));
  };
  const savedStories = account.preferences.savedIds.map(resolveStory).filter(Boolean) as LifestyleRiverStory[];
  const unresolvedSavedIds = account.preferences.savedIds.filter((id) => !resolveStory(id));
  const comments = Object.values(account.commentsByStoryId).flat().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const rankedTopics = rankReaderProfileOptions(topics, stories, "topic");
  const featuredTopics = rankedTopics.slice(0, profileOptionPreviewLimit);
  const additionalTopics = rankedTopics.slice(profileOptionPreviewLimit);
  const rankedBrands = rankReaderProfileOptions(brands, stories, "brand");
  const featuredBrands = rankedBrands.slice(0, profileOptionPreviewLimit);
  const additionalBrands = rankedBrands.slice(profileOptionPreviewLimit);
  const recommendedStories = getReaderProfileRecommendations(stories, account.preferences);
  const toggleTopic = (topic: string) => {
    const followedTopics = account.preferences.followedTopics.includes(topic)
      ? account.preferences.followedTopics.filter((item) => item !== topic)
      : [...account.preferences.followedTopics, topic];
    updatePreferences({ ...account.preferences, followedTopics });
  };
  const toggleBrand = (brand: string) => {
    const followedBrands = account.preferences.followedBrands.includes(brand)
      ? account.preferences.followedBrands.filter((item) => item !== brand)
      : [...account.preferences.followedBrands, brand];
    updatePreferences({ ...account.preferences, followedBrands });
  };
  const createNamedCollection = () => {
    const collection = createCollection(collectionName);
    if (!collection) return;
    setCollectionName("");
    setCollectionStatus(`Created ${collection.name}.`);
  };
  const toggleSavedStoryCollection = (story: LifestyleRiverStory, collection: ReaderCollection, storyId = story.id) => {
    const containsStory = collection.storyIds.includes(storyId);
    toggleStoryInCollection(collection.id, storyId);
    setCollectionStatus(`${containsStory ? "Removed from" : "Added to"} ${collection.name}.`);
  };
  const removeSavedStoryFromLibrary = (savedId: string, storyTitle: string) => {
    const renderedSavedIds = account.preferences.savedIds.filter((id) => Boolean(resolveStory(id)));
    const removedIndex = renderedSavedIds.indexOf(savedId);
    const remainingSavedIds = renderedSavedIds.filter((id) => id !== savedId);
    const nextFocusId = remainingSavedIds[Math.min(removedIndex, remainingSavedIds.length - 1)];

    removeSavedStory(savedId);
    setCollectionStatus(`Removed ${storyTitle} from saved stories and collections.`);
    window.requestAnimationFrame(() => {
      if (nextFocusId) {
        savedStoryRemoveButtonRefs.current.get(nextFocusId)?.focus();
        return;
      }
      savedStoriesHeadingRef.current?.focus();
    });
  };

  return (
    <ModalFrame open={open} onClose={onClose} titleId="reader-profile-title" className="h-[min(720px,calc(100dvh-2rem))] max-w-5xl">
      <div className="flex min-h-20 items-center justify-between border-b border-border px-5 sm:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <ReaderAvatar account={account} size="lg" className="size-11" />
          <div className="min-w-0">
            <h2 id="reader-profile-title" className="truncate text-base font-bold">{account.firstName} {account.lastName}</h2>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{account.email}</p>
          </div>
        </div>
        <Button data-modal-close variant="outline" size="icon-sm" className="size-11" onClick={onClose} aria-label="Close profile">
          <X className="h-4 w-4" aria-hidden />
        </Button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col sm:grid sm:grid-cols-[200px_minmax(0,1fr)]">
        <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-border p-3 sm:flex-col sm:border-b-0 sm:border-r sm:p-4" aria-label="Account sections">
          {profileTabs.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  "flex min-h-11 shrink-0 items-center gap-3 rounded-[8px] px-3 text-left text-sm font-semibold transition-colors",
                  tab === item.id ? "bg-muted text-primary" : "text-foreground hover:bg-muted/70"
                )}
                aria-current={tab === item.id ? "page" : undefined}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="min-h-0 overflow-y-auto p-5 sm:p-8">
          {tab === "overview" ? (
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">
                {account.syncId ? "Google-synced prototype profile" : "Browser-local demo profile"}
              </p>
              <h3 className="mt-2 text-2xl font-bold">Your reading, in one place</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {account.syncId
                  ? "Your preferences, library, and comments follow this Google profile across signed-in devices."
                  : "Your preferences, library, and comments are saved only in this browser."}
              </p>
              {account.syncId && syncState !== "synced" ? (
                <div className="mt-4 flex flex-wrap items-center gap-3 rounded-[8px] bg-muted px-3 py-2 text-sm" role={syncState === "error" ? "alert" : "status"}>
                  <span className="font-semibold">
                    {syncState === "syncing" ? "Saving changes across devices…" : "Cross-device sync is paused. Your changes remain on this device."}
                  </span>
                  {syncState === "error" ? (
                    <Button type="button" variant="outline" size="sm" className="min-h-11" onClick={retrySync}>Retry sync</Button>
                  ) : null}
                </div>
              ) : null}
              <div className="mt-7 divide-y divide-border border-y border-border">
                {[
                  { id: "personalization" as const, icon: Check, title: "For You preferences", detail: `${account.preferences.followedTopics.length} topics and ${account.preferences.followedBrands.length} brands shape your feed` },
                  { id: "recommendations" as const, icon: Sparkles, title: "Recommended", detail: `${recommendedStories.length} fresh ${recommendedStories.length === 1 ? "story" : "stories"} based on your current preferences` },
                  {
                    id: "library" as const,
                    icon: Bookmark,
                    title: "Library",
                    detail: `${savedStories.length} saved ${savedStories.length === 1 ? "story" : "stories"} · ${customCollections.length === 0 ? "No custom collections" : `${customCollections.length} custom ${customCollections.length === 1 ? "collection" : "collections"}`}`,
                  },
                  { id: "activity" as const, icon: MessageCircle, title: "Comments", detail: comments.length === 0 ? "You have not commented yet" : `${comments.length} ${comments.length === 1 ? "comment" : "comments"}` },
                  {
                    id: "settings" as const,
                    icon: Settings,
                    title: "Profile details",
                    detail: account.syncId
                      ? "Name, email, sign out, and cross-device sync status"
                      : "Name, email, sign out, and browser-local profile controls",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button key={item.id} type="button" onClick={() => setTab(item.id)} className="group flex min-h-20 w-full items-center gap-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-muted text-primary"><Icon className="h-4 w-4" aria-hidden /></span>
                      <span className="min-w-0 flex-1"><span className="block font-bold">{item.title}</span><span className="mt-1 block text-sm leading-5 text-muted-foreground">{item.detail}</span></span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {tab === "personalization" ? (
            <div>
              <h3 className="text-2xl font-bold">Tune your For You page</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Choose the topics and brands you want to see more often. Your feed updates as you make changes.</p>
              <section className="mt-7">
                <h4 className="font-bold">Interests</h4>
                <div data-profile-options-primary="interests" className="mt-3 grid gap-2 sm:grid-cols-2">
                  {featuredTopics.map((topic) => {
                    const active = account.preferences.followedTopics.includes(topic);
                    return (
                      <button key={topic} type="button" onClick={() => toggleTopic(topic)} aria-pressed={active} className={cn("flex min-h-11 items-center gap-3 rounded-[8px] px-3 text-left text-sm font-semibold hover:bg-muted", active && "bg-muted")}>
                        <span className={cn("flex size-5 items-center justify-center rounded-[4px] border", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background")}>{active ? <Check className="h-3.5 w-3.5" aria-hidden /> : null}</span>{topic}
                      </button>
                    );
                  })}
                </div>
                {additionalTopics.length > 0 ? (
                  <Accordion className="mt-2">
                    <AccordionItem value="more-interests" className="border-0">
                      <AccordionTrigger className="min-h-11 px-3 hover:no-underline">
                        <span className="flex min-w-0 flex-1 items-center justify-between gap-3 pr-2">
                          <span>Show all interests</span>
                          <span className="text-xs font-normal text-muted-foreground">
                            {additionalTopics.filter((topic) => account.preferences.followedTopics.includes(topic)).length} selected
                          </span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-0">
                        <div className="grid gap-2 sm:grid-cols-2">
                          {additionalTopics.map((topic) => {
                            const active = account.preferences.followedTopics.includes(topic);
                            return (
                              <button key={topic} type="button" onClick={() => toggleTopic(topic)} aria-pressed={active} className={cn("flex min-h-11 items-center gap-3 rounded-[8px] px-3 text-left text-sm font-semibold hover:bg-muted", active && "bg-muted")}>
                                <span className={cn("flex size-5 items-center justify-center rounded-[4px] border", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background")}>{active ? <Check className="h-3.5 w-3.5" aria-hidden /> : null}</span>{topic}
                              </button>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : null}
              </section>
              <section className="mt-8">
                <h4 className="font-bold">Brands</h4>
                <div data-profile-options-primary="brands" className="mt-3 grid gap-2 sm:grid-cols-2">
                  {featuredBrands.map((brand) => {
                    const active = account.preferences.followedBrands.includes(brand);
                    return (
                      <button key={brand} type="button" onClick={() => toggleBrand(brand)} aria-pressed={active} className={cn("flex min-h-14 items-center gap-3 rounded-[8px] px-2.5 text-left text-sm font-semibold hover:bg-muted", active && "bg-muted")}>
                        <BrandMark brand={brand} stories={stories} />
                        <span className="min-w-0 flex-1 break-words">{brand}</span>
                        <span className={cn("flex size-5 items-center justify-center rounded-[4px] border", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background")}>{active ? <Check className="h-3.5 w-3.5" aria-hidden /> : null}</span>
                      </button>
                    );
                  })}
                </div>
                {additionalBrands.length > 0 ? (
                  <Accordion className="mt-2">
                    <AccordionItem value="more-brands" className="border-0">
                      <AccordionTrigger className="min-h-11 px-3 hover:no-underline">
                        <span className="flex min-w-0 flex-1 items-center justify-between gap-3 pr-2">
                          <span>Show all brands</span>
                          <span className="text-xs font-normal text-muted-foreground">
                            {additionalBrands.filter((brand) => account.preferences.followedBrands.includes(brand)).length} selected
                          </span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-0">
                        <div className="grid gap-2 sm:grid-cols-2">
                          {additionalBrands.map((brand) => {
                            const active = account.preferences.followedBrands.includes(brand);
                            return (
                              <button key={brand} type="button" onClick={() => toggleBrand(brand)} aria-pressed={active} className={cn("flex min-h-14 items-center gap-3 rounded-[8px] px-2.5 text-left text-sm font-semibold hover:bg-muted", active && "bg-muted")}>
                                <BrandMark brand={brand} stories={stories} />
                                <span className="min-w-0 flex-1 break-words">{brand}</span>
                                <span className={cn("flex size-5 items-center justify-center rounded-[4px] border", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background")}>{active ? <Check className="h-3.5 w-3.5" aria-hidden /> : null}</span>
                              </button>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : null}
              </section>
            </div>
          ) : null}

          {tab === "recommendations" ? (
            <div>
              <h3 className="text-2xl font-bold">Fresh for you</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Recent stories ranked from the interests and brands you follow.
              </p>
              {recommendedStories.length === 0 ? (
                <p className="mt-6 border-y border-border py-5 text-sm text-muted-foreground">
                  No new recommendations yet. Check back as the feed refreshes.
                </p>
              ) : (
                <div className="mt-5 divide-y divide-border border-y border-border">
                  {recommendedStories.map((story) => (
                    <Link
                      key={story.id}
                      href={getLibraryStoryHref(story)}
                      onClick={onClose}
                      className="group grid min-h-24 grid-cols-[88px_minmax(0,1fr)] items-center gap-3 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[112px_minmax(0,1fr)]"
                      aria-label={`Open recommended story ${story.title}`}
                    >
                      <Image unoptimized src={story.image} alt="" width={112} height={72} className="h-16 w-[88px] rounded-[4px] object-cover sm:h-[72px] sm:w-28" />
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold text-primary">
                          {getReaderProfileRecommendationReason(story, account.preferences)}
                        </span>
                        <span className="mt-1 line-clamp-2 block font-bold leading-5 group-hover:text-primary">{story.title}</span>
                        <span className="mt-1 block text-xs text-muted-foreground">{story.brand} · {story.readTime}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {tab === "library" ? (
            <div>
              <h3 ref={libraryHeadingRef} tabIndex={-1} className="text-2xl font-bold outline-none">Your library</h3>
              <p className="mt-2 text-sm text-muted-foreground">Keep stories together for meals, projects, trips, and anything you want to revisit.</p>
              <h4 className="mt-7 font-bold">Collections</h4>
              <form className="mt-3 flex items-start gap-2" onSubmit={(event) => { event.preventDefault(); createNamedCollection(); }}>
                <Input ref={collectionNameRef} className="min-w-0 flex-1" value={collectionName} onChange={(event) => setCollectionName(event.target.value)} placeholder="New collection name" aria-label="New collection name" />
                <Button className="h-12 shrink-0" type="submit" disabled={!collectionName.trim()}><FolderPlus className="mr-2 h-4 w-4" aria-hidden />Create</Button>
              </form>
              {collectionStatus ? <p role="status" className="mt-3 text-sm font-semibold text-muted-foreground">{collectionStatus}</p> : null}
              {customCollections.length > 0 ? (
                <div className="mt-5 divide-y divide-border border-y border-border">
                {customCollections.map((collection) => {
                  const availableStories = collection.storyIds
                    .map((id) => ({ id, story: resolveStory(id) }))
                    .filter((item): item is { id: string; story: LifestyleRiverStory } => Boolean(item.story));
                  const unavailableIds = collection.storyIds.filter((id) => !resolveStory(id));

                  return (
                    <section key={collection.id} className="py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold">{collection.name}</h4>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {availableStories.length} {availableStories.length === 1 ? "story" : "stories"}
                          {unavailableIds.length > 0 ? ` · ${unavailableIds.length} older ${unavailableIds.length === 1 ? "save needs" : "saves need"} cleanup` : ""}
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          type="button"
                          variant={pendingCollectionDeleteId === collection.id ? "destructive" : "ghost"}
                          size={pendingCollectionDeleteId === collection.id ? "default" : "icon-sm"}
                          className={pendingCollectionDeleteId === collection.id ? "min-h-11" : "size-11"}
                          aria-label={pendingCollectionDeleteId === collection.id
                            ? `Confirm delete ${collection.name}`
                            : `Delete ${collection.name}`}
                          aria-expanded={pendingCollectionDeleteId === collection.id}
                          onClick={() => {
                            if (pendingCollectionDeleteId !== collection.id) {
                              setPendingCollectionDeleteId(collection.id);
                              return;
                            }
                            deleteCollection(collection.id);
                            setPendingCollectionDeleteId(undefined);
                            setCollectionStatus(`Deleted ${collection.name}.`);
                            window.requestAnimationFrame(() => libraryHeadingRef.current?.focus());
                          }}
                        >
                          {pendingCollectionDeleteId === collection.id
                            ? `Delete ${collection.name}`
                            : <Trash2 className="h-4 w-4" aria-hidden />}
                        </Button>
                        {pendingCollectionDeleteId === collection.id ? (
                          <Button
                            type="button"
                            variant="outline"
                            className="min-h-11"
                            onClick={(event) => {
                              const deleteButton = event.currentTarget.previousElementSibling as HTMLElement | null;
                              setPendingCollectionDeleteId(undefined);
                              window.requestAnimationFrame(() => deleteButton?.focus());
                            }}
                          >
                            Cancel
                          </Button>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      {collection.storyIds.length === 0 ? <p className="text-sm text-muted-foreground">Add a saved story below.</p> : availableStories.slice(0, 4).map(({ id, story }) => {
                        const archived = !isCurrentStory(id);
                        const href = archived && story.sourceUrl ? story.sourceUrl : getLibraryStoryHref(story);
                        return (
                          <Link key={id} href={href} target={archived && story.sourceUrl ? "_blank" : undefined} rel={archived && story.sourceUrl ? "noreferrer" : undefined} onClick={onClose} className="group flex min-h-12 items-center gap-3 rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`Open ${story.title}`}>
                            <Image unoptimized src={story.image} alt="" width={64} height={44} className="h-11 w-16 shrink-0 rounded-[4px] object-cover" />
                            <div className="min-w-0">
                              <p className="line-clamp-2 text-sm font-semibold group-hover:text-primary">{story.title}</p>
                              {archived ? <p className="mt-0.5 text-xs text-muted-foreground">Open original on {story.brand}</p> : null}
                            </div>
                          </Link>
                        );
                      })}
                      {unavailableIds.length > 0 ? (
                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[8px] bg-muted px-3 py-2.5">
                          <p className="text-sm text-muted-foreground">
                            {unavailableIds.length} {unavailableIds.length === 1 ? "older save has" : "older saves have"} no retained story details.
                          </p>
                          <Button type="button" variant="outline" size="sm" className="min-h-11" onClick={() => {
                            removeStoriesFromCollection(collection.id, unavailableIds);
                            setCollectionStatus(`Removed ${unavailableIds.length} unavailable ${unavailableIds.length === 1 ? "save" : "saves"} from ${collection.name}.`);
                          }}>
                            Remove unavailable
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </section>
                  );
                })}
                </div>
              ) : null}
              <section className="mt-8">
                <h4 ref={savedStoriesHeadingRef} tabIndex={-1} className="font-bold outline-none">Saved stories</h4>
                {savedStories.length === 0 ? (
                  <p className="mt-3 border-y border-border py-5 text-sm text-muted-foreground">Save a story from the feed and it will appear here.</p>
                ) : (
                  <div className="mt-3 divide-y divide-border border-y border-border">
                    {account.preferences.savedIds.flatMap((savedId) => {
                      const story = resolveStory(savedId);
                      if (!story) return [];
                      const archived = !isCurrentStory(savedId);
                      const href = archived && story.sourceUrl ? story.sourceUrl : getLibraryStoryHref(story);
                      return [(
                      <div key={savedId} className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_260px] sm:items-center">
                        <Link
                          href={href}
                          target={archived && story.sourceUrl ? "_blank" : undefined}
                          rel={archived && story.sourceUrl ? "noreferrer" : undefined}
                          onClick={onClose}
                          className="group flex min-h-16 min-w-0 items-center gap-3 rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-label={`Open ${story.title}`}
                        >
                          <Image unoptimized src={story.image} alt="" width={80} height={56} className="h-14 w-20 shrink-0 rounded-[4px] object-cover" />
                          <div className="min-w-0">
                            <p className="line-clamp-2 font-bold group-hover:text-primary">{story.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{story.brand} · {story.readTime}{archived ? " · Opens original" : ""}</p>
                          </div>
                        </Link>
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {customCollections.length === 0 ? (
                            <button
                              type="button"
                              className="min-h-11 min-w-[150px] flex-1 rounded-[8px] border border-dashed border-border px-3 text-left text-sm font-semibold text-muted-foreground hover:border-primary/50 hover:text-primary"
                              onClick={() => collectionNameRef.current?.focus()}
                            >
                              Create a collection first
                            </button>
                          ) : (
                            <select
                              className="h-11 min-w-[150px] flex-1 rounded-[8px] border border-border bg-background px-3 text-sm font-semibold"
                              value=""
                              onChange={(event) => {
                                const collection = customCollections.find((item) => item.id === event.target.value);
                                if (collection) toggleSavedStoryCollection(story, collection, savedId);
                              }}
                              aria-label={`Add or remove ${story.title} from a custom collection`}
                            >
                              <option value="">Add or remove</option>
                              {customCollections.map((collection) => (
                                <option key={collection.id} value={collection.id}>
                                  {collection.storyIds.includes(savedId) ? `In ${collection.name} - remove` : `Add to ${collection.name}`}
                                </option>
                              ))}
                            </select>
                          )}
                          <Button
                            ref={(node) => {
                              if (node) savedStoryRemoveButtonRefs.current.set(savedId, node);
                              else savedStoryRemoveButtonRefs.current.delete(savedId);
                            }}
                            type="button"
                            variant="ghost"
                            className="min-h-11 shrink-0 px-3"
                            aria-label={`Remove ${story.title} from saved stories`}
                            onClick={() => removeSavedStoryFromLibrary(savedId, story.title)}
                          >
                            <Bookmark className="mr-2 h-4 w-4 fill-current" aria-hidden />
                            Remove
                          </Button>
                        </div>
                      </div>
                      )];
                    })}
                  </div>
                )}
                {unresolvedSavedIds.length > 0 && readLaterCollection ? (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-[8px] bg-muted px-3 py-2.5">
                    <p className="text-sm text-muted-foreground">
                      {unresolvedSavedIds.length} older {unresolvedSavedIds.length === 1 ? "save is" : "saves are"} missing story details.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="min-h-11"
                      onClick={() => {
                        removeStoriesFromCollection(readLaterCollection.id, unresolvedSavedIds);
                        setCollectionStatus(`Removed ${unresolvedSavedIds.length} unavailable ${unresolvedSavedIds.length === 1 ? "save" : "saves"}.`);
                      }}
                    >
                      Remove unavailable
                    </Button>
                  </div>
                ) : null}
              </section>
            </div>
          ) : null}

          {tab === "activity" ? (
            <div>
              <h3 ref={commentsHeadingRef} tabIndex={-1} className="text-2xl font-bold outline-none">Your comments</h3>
              <p className="mt-2 text-sm text-muted-foreground">Review or remove the comments you have added to stories.</p>
              {commentStatus ? <p role="status" className="mt-3 text-sm font-semibold text-muted-foreground">{commentStatus}</p> : null}
              {comments.length === 0 ? (
                <div className="mt-6 flex items-center gap-3 border-y border-border py-5 text-sm text-muted-foreground"><MessageCircle className="h-5 w-5" aria-hidden />Join a story conversation and your comments will appear here.</div>
              ) : (
                <div className="mt-6 divide-y divide-border border-y border-border">
                  {comments.map((comment) => (
                    <article key={comment.id} className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground">{comment.storyTitle}</p>
                          <p className="mt-2 text-sm leading-6">{comment.body}</p>
                        </div>
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            type="button"
                            variant={pendingCommentDeleteId === comment.id ? "destructive" : "ghost"}
                            size={pendingCommentDeleteId === comment.id ? "default" : "icon-sm"}
                            className={pendingCommentDeleteId === comment.id ? "min-h-11" : "size-11"}
                            aria-label={pendingCommentDeleteId === comment.id ? "Confirm delete comment" : "Delete comment"}
                            aria-expanded={pendingCommentDeleteId === comment.id}
                            onClick={() => {
                              if (pendingCommentDeleteId !== comment.id) {
                                setPendingCommentDeleteId(comment.id);
                                return;
                              }
                              deleteComment(comment.storyId, comment.id);
                              setPendingCommentDeleteId(undefined);
                              setCommentStatus("Comment deleted.");
                              window.requestAnimationFrame(() => commentsHeadingRef.current?.focus());
                            }}
                          >
                            {pendingCommentDeleteId === comment.id
                              ? "Delete comment"
                              : <Trash2 className="h-4 w-4" aria-hidden />}
                          </Button>
                          {pendingCommentDeleteId === comment.id ? (
                            <Button
                              type="button"
                              variant="outline"
                              className="min-h-11"
                              onClick={(event) => {
                                const deleteButton = event.currentTarget.previousElementSibling as HTMLElement | null;
                                setPendingCommentDeleteId(undefined);
                                window.requestAnimationFrame(() => deleteButton?.focus());
                              }}
                            >
                              Cancel
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {tab === "settings" ? (
            <div>
              <h3 className="text-2xl font-bold">Profile details</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {account.syncId
                  ? "Update the name shown on every device signed in with this Google profile."
                  : "Update the name shown in this browser-local Hearst+ profile."}
              </p>
              <div className="mt-7 max-w-xl space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold">First name<Input className="mt-2" value={firstName} onChange={(event) => { setFirstName(event.target.value); setProfileSaved(false); }} /></label>
                  <label className="text-sm font-semibold">Last name<Input className="mt-2" value={lastName} onChange={(event) => { setLastName(event.target.value); setProfileSaved(false); }} /></label>
                </div>
                <label className="block text-sm font-semibold">Email<Input className="mt-2" value={account.email} disabled /></label>
                <div className="flex items-center gap-3"><Button className="min-h-11" onClick={() => { updateAccount({ firstName: firstName.trim(), lastName: lastName.trim() }); setProfileSaved(true); }} disabled={!firstName.trim()}>Save changes</Button>{profileSaved ? <span role="status" className="text-sm text-muted-foreground">Saved</span> : null}</div>
              </div>
              <div className="mt-10 border-t border-border pt-6">
                <Button variant="outline" className="min-h-11" onClick={() => { signOut(); onClose(); }}><LogOut className="mr-2 h-4 w-4" aria-hidden />Sign out</Button>
                <div className="mt-8 border-t border-border pt-6">
                  <h4 className="font-bold text-destructive">Delete account</h4>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {account.syncId
                      ? "This currently removes the signed-in copy from this browser. The synced prototype profile remains available when you sign in with Google again."
                      : "This removes the prototype account, saved stories, collections, comments, and preferences from this browser."}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Account deletion">
                    <Button
                      type="button"
                      variant={confirmDelete ? "destructive" : "outline"}
                      className={cn("min-h-11", !confirmDelete && "text-destructive")}
                      aria-expanded={confirmDelete}
                      onClick={() => {
                        if (!confirmDelete) {
                          setConfirmDelete(true);
                          return;
                        }
                        deleteAccount();
                        onClose();
                      }}
                    >
                      {confirmDelete ? "Confirm delete account" : "Delete account"}
                    </Button>
                    {confirmDelete ? (
                      <Button
                        type="button"
                        className="min-h-11"
                        variant="outline"
                        onClick={(event) => {
                          const deleteButton = event.currentTarget.previousElementSibling as HTMLElement | null;
                          setConfirmDelete(false);
                          window.requestAnimationFrame(() => deleteButton?.focus());
                        }}
                      >
                        Cancel
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </ModalFrame>
  );
}
