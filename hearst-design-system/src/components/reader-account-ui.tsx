"use client";

import React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  Bookmark,
  Check,
  ChevronRight,
  FolderPlus,
  LogOut,
  MessageCircle,
  Settings,
  Trash2,
  User,
  X,
} from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { brandIconLogos } from "@/lib/logos";
import { useBodyPortalTarget, useModalIsolation } from "@/components/ui/use-modal-isolation";
import { BrandLogo } from "./brand-logo";
import type { LifestyleRiverProfile, LifestyleRiverStory } from "./lifestyle-river-types";
import { useReaderAccount, type ReaderAccount } from "./reader-account";

type AuthMode = "create" | "signIn";

function GoogleMark() {
  return (
    <span className="grid size-5 place-items-center text-base font-bold" aria-hidden>
      <span>
        <span className="text-[#4285F4]">G</span>
      </span>
    </span>
  );
}

export function ReaderAvatar({
  account,
  size = "default",
  className,
}: {
  account: Pick<ReaderAccount, "firstName" | "lastName">;
  size?: "default" | "sm" | "lg";
  className?: string;
}) {
  const initials = `${account.firstName.slice(0, 1)}${account.lastName.slice(0, 1)}`.toUpperCase();

  return (
    <Avatar size={size} className={className} aria-hidden>
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
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
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
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-foreground/55 p-4 backdrop-blur-sm sm:p-6">
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

export function ReaderAuthDialog({
  open,
  initialMode = "signIn",
  defaultPreferences,
  onClose,
  onAuthenticated,
}: {
  open: boolean;
  initialMode?: AuthMode;
  defaultPreferences: LifestyleRiverProfile;
  onClose: () => void;
  onAuthenticated?: () => void;
}) {
  const { createAccount, continueWithGoogle, signIn } = useReaderAccount();
  const [mode, setMode] = React.useState<AuthMode>(initialMode);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const [error, setError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

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

  const submitGoogle = async () => {
    setError("");
    setSubmitting(true);
    try {
      await continueWithGoogle({
        firstName: "Lenin",
        lastName: "Aviles",
        email: "lenin.google@hearstplus.local",
        preferences: defaultPreferences,
      });
      onAuthenticated?.();
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "We could not complete that request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalFrame open={open} onClose={onClose} titleId="reader-auth-title" className="max-w-lg">
      <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-7">
        <BrandLogo
          slug="hearst-all"
          className="[&_svg]:h-7 [&_svg]:w-auto [&_svg]:max-w-[190px]"
          color="var(--color-primary)"
        />
        <Button data-modal-close variant="outline" size="icon-sm" className="size-11" onClick={onClose} aria-label="Close account dialog">
          <X className="h-4 w-4" aria-hidden />
        </Button>
      </div>
      <form className="overflow-y-auto p-5 sm:p-7" onSubmit={submit} noValidate>
        <h2 id="reader-auth-title" className="text-center text-2xl font-bold leading-tight sm:text-3xl">
          {mode === "create" ? "Create local demo profile" : "Resume local demo profile"}
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-6 text-muted-foreground">
          {mode === "create"
            ? "Save your personalized feed, collections, comments, and reading history in this browser."
            : "Resume the personalized feed and library saved in this browser."}
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-6 h-11 w-full gap-3 text-base font-bold"
          disabled={submitting}
          onClick={submitGoogle}
        >
          <GoogleMark />
          Use demo Google profile
        </Button>

        <div className="my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-border" />
          <span className="text-sm font-bold text-muted-foreground">Or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-4">
          {mode === "create" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                First name
                <Input className="mt-2" value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" />
              </label>
              <label className="text-sm font-semibold">
                Last name
                <Input className="mt-2" value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name" />
              </label>
            </div>
          ) : null}
          <label className="block text-sm font-semibold">
            Email
            <Input className="mt-2" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
          </label>
          <label className="block text-sm font-semibold">
            Password
            <Input className="mt-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "create" ? "new-password" : "current-password"} />
          </label>
          {mode === "create" ? (
            <>
              <label className="block text-sm font-semibold">
                Confirm password
                <Input className="mt-2" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" />
              </label>
              <label className="flex items-start gap-3 text-sm leading-5">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[var(--color-primary)]"
                />
                <span>I agree to the Terms of Use and acknowledge the Privacy Notice.</span>
              </label>
            </>
          ) : null}
        </div>

        {error ? (
          <p role="alert" className="mt-4 rounded-[8px] bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">
            {error}
          </p>
        ) : null}

        <Button className="mt-6 w-full" type="submit" disabled={submitting}>
          {submitting ? "Please wait" : mode === "create" ? "Create Local Profile" : "Resume Local Profile"}
        </Button>
        <button
          type="button"
          className="mt-4 w-full text-center text-sm font-semibold text-primary hover:underline"
          onClick={() => {
            setMode((current) => current === "create" ? "signIn" : "create");
            setError("");
          }}
        >
          {mode === "create" ? "Already have a local profile? Resume it" : "New to Hearst+? Create a local demo profile"}
        </button>
        <p className="mt-5 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
          Prototype note: this is browser-local demo state, not production account storage or a live Google sign-in.
        </p>
      </form>
    </ModalFrame>
  );
}

type ProfileTab = "overview" | "personalization" | "library" | "activity" | "settings";

const profileTabs: { id: ProfileTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "Profile", icon: User },
  { id: "personalization", label: "For You", icon: Check },
  { id: "library", label: "Library", icon: Bookmark },
  { id: "activity", label: "Comments", icon: MessageCircle },
  { id: "settings", label: "Account", icon: Settings },
];

function BrandMark({ brand, stories }: { brand: string; stories: LifestyleRiverStory[] }) {
  const brandSlug = stories.find((story) => story.brand === brand)?.brandSlug;
  const source = brandSlug ? brandIconLogos[brandSlug] : undefined;
  return (
    <span
      className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[4px] border border-border bg-white text-[10px] font-bold text-foreground"
      aria-hidden
      style={source ? {
        backgroundImage: `url("${source}")`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      } : undefined}
    >
      {source ? null : brand.slice(0, 2).toUpperCase()}
    </span>
  );
}

export function ReaderProfileDialog({
  open,
  stories,
  topics,
  brands,
  onClose,
}: {
  open: boolean;
  stories: LifestyleRiverStory[];
  topics: string[];
  brands: string[];
  onClose: () => void;
}) {
  const {
    account,
    updateAccount,
    updatePreferences,
    signOut,
    deleteAccount,
    deleteComment,
    createCollection,
    deleteCollection,
    toggleStoryInCollection,
  } = useReaderAccount();
  const [tab, setTab] = React.useState<ProfileTab>("overview");
  const [firstName, setFirstName] = React.useState(() => account?.firstName ?? "");
  const [lastName, setLastName] = React.useState(() => account?.lastName ?? "");
  const [collectionName, setCollectionName] = React.useState("");
  const [profileSaved, setProfileSaved] = React.useState(false);
  const customCollections = account?.collections.filter((collection) => collection.name !== "Read Later") ?? [];
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  if (!account) return null;

  const storyById = new Map(stories.map((story) => [story.id, story]));
  const savedStories = account.preferences.savedIds.map((id) => storyById.get(id)).filter(Boolean) as LifestyleRiverStory[];
  const comments = Object.values(account.commentsByStoryId).flat().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
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
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">Local demo profile</p>
              <h3 className="mt-2 text-2xl font-bold">Your reading, in one place</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Manage what shapes your feed, what you save, and how you take part in story conversations in this browser.</p>
              <div className="mt-7 divide-y divide-border border-y border-border">
                {[
                  { id: "personalization" as const, icon: Check, title: "For You preferences", detail: `${account.preferences.followedTopics.length} topics and ${account.preferences.followedBrands.length} brands shape your feed` },
                  { id: "library" as const, icon: Bookmark, title: "Library", detail: `${savedStories.length} saved ${savedStories.length === 1 ? "story" : "stories"} in ${account.collections.length} ${account.collections.length === 1 ? "collection" : "collections"}` },
                  { id: "activity" as const, icon: MessageCircle, title: "Comments", detail: comments.length === 0 ? "You have not commented yet" : `${comments.length} ${comments.length === 1 ? "comment" : "comments"}` },
                  { id: "settings" as const, icon: Settings, title: "Profile details", detail: "Name, email, sign out, and local profile controls" },
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
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {topics.map((topic) => {
                    const active = account.preferences.followedTopics.includes(topic);
                    return (
                      <button key={topic} type="button" onClick={() => toggleTopic(topic)} aria-pressed={active} className={cn("flex min-h-11 items-center gap-3 rounded-[8px] px-3 text-left text-sm font-semibold hover:bg-muted", active && "bg-muted")}>
                        <span className={cn("flex size-5 items-center justify-center rounded-[4px] border", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background")}>{active ? <Check className="h-3.5 w-3.5" aria-hidden /> : null}</span>{topic}
                      </button>
                    );
                  })}
                </div>
              </section>
              <section className="mt-8">
                <h4 className="font-bold">Brands</h4>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {brands.map((brand) => {
                    const active = account.preferences.followedBrands.includes(brand);
                    return (
                      <button key={brand} type="button" onClick={() => toggleBrand(brand)} aria-pressed={active} className={cn("flex min-h-14 items-center gap-3 rounded-[8px] px-2.5 text-left text-sm font-semibold hover:bg-muted", active && "bg-muted")}>
                        <BrandMark brand={brand} stories={stories} />
                        <span className="min-w-0 flex-1 truncate">{brand}</span>
                        <span className={cn("flex size-5 items-center justify-center rounded-[4px] border", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background")}>{active ? <Check className="h-3.5 w-3.5" aria-hidden /> : null}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>
          ) : null}

          {tab === "library" ? (
            <div>
              <h3 className="text-2xl font-bold">Your library</h3>
              <p className="mt-2 text-sm text-muted-foreground">Keep stories together for meals, projects, trips, and anything you want to revisit.</p>
              <form className="mt-6 flex items-start gap-2" onSubmit={(event) => { event.preventDefault(); if (createCollection(collectionName)) setCollectionName(""); }}>
                <Input className="min-w-0 flex-1" value={collectionName} onChange={(event) => setCollectionName(event.target.value)} placeholder="New collection name" aria-label="New collection name" />
                <Button className="h-12 shrink-0" type="submit" disabled={!collectionName.trim()}><FolderPlus className="mr-2 h-4 w-4" aria-hidden />Create</Button>
              </form>
              <div className="mt-7 divide-y divide-border border-y border-border">
                {account.collections.map((collection) => (
                  <section key={collection.id} className="py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div><h4 className="font-bold">{collection.name}</h4><p className="mt-1 text-xs text-muted-foreground">{collection.storyIds.length} stories</p></div>
                      {collection.name !== "Read Later" ? (
                        <Button variant="ghost" size="icon-sm" onClick={() => deleteCollection(collection.id)} aria-label={`Delete ${collection.name}`}><Trash2 className="h-4 w-4" aria-hidden /></Button>
                      ) : null}
                    </div>
                    <div className="mt-3 space-y-2">
                      {collection.storyIds.length === 0 ? <p className="text-sm text-muted-foreground">Add a saved story below.</p> : collection.storyIds.slice(0, 4).map((id) => {
                        const story = storyById.get(id);
                        return (
                          <div key={id} className="flex items-center gap-3">
                            {story ? <Image unoptimized src={story.image} alt="" width={64} height={44} className="h-11 w-16 shrink-0 rounded-[4px] object-cover" /> : null}
                            <p className="line-clamp-2 text-sm font-semibold">{story?.title ?? "Saved story"}</p>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
              <section className="mt-8">
                <h4 className="font-bold">Saved stories</h4>
                {savedStories.length === 0 ? (
                  <p className="mt-3 border-y border-border py-5 text-sm text-muted-foreground">Save a story from the feed and it will appear here.</p>
                ) : (
                  <div className="mt-3 divide-y divide-border border-y border-border">
                    {savedStories.map((story) => (
                      <div key={story.id} className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_180px] sm:items-center">
                        <div className="flex min-w-0 items-center gap-3">
                          <Image unoptimized src={story.image} alt="" width={80} height={56} className="h-14 w-20 shrink-0 rounded-[4px] object-cover" />
                          <div className="min-w-0"><p className="line-clamp-2 font-bold">{story.title}</p><p className="mt-1 text-xs text-muted-foreground">{story.brand} · {story.readTime}</p></div>
                        </div>
                        <select className="h-10 rounded-[8px] border border-border bg-background px-3 text-sm" value="" disabled={customCollections.length === 0} onChange={(event) => { if (event.target.value) toggleStoryInCollection(event.target.value, story.id); }} aria-label={`Add ${story.title} to a custom collection`}>
                          <option value="">{customCollections.length === 0 ? "Create a collection above" : "Add to collection"}</option>
                          {customCollections.map((collection) => <option key={collection.id} value={collection.id}>{collection.storyIds.includes(story.id) ? `Remove from ${collection.name}` : collection.name}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          ) : null}

          {tab === "activity" ? (
            <div>
              <h3 className="text-2xl font-bold">Your comments</h3>
              <p className="mt-2 text-sm text-muted-foreground">Review or remove the comments you have added to stories.</p>
              {comments.length === 0 ? (
                <div className="mt-6 flex items-center gap-3 border-y border-border py-5 text-sm text-muted-foreground"><MessageCircle className="h-5 w-5" aria-hidden />Join a story conversation and your comments will appear here.</div>
              ) : (
                <div className="mt-6 divide-y divide-border border-y border-border">
                  {comments.map((comment) => (
                    <article key={comment.id} className="py-4">
                      <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold text-muted-foreground">{comment.storyTitle}</p><p className="mt-2 text-sm leading-6">{comment.body}</p></div><Button variant="ghost" size="icon-sm" onClick={() => deleteComment(comment.storyId, comment.id)} aria-label="Delete comment"><Trash2 className="h-4 w-4" aria-hidden /></Button></div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {tab === "settings" ? (
            <div>
              <h3 className="text-2xl font-bold">Profile details</h3>
              <p className="mt-2 text-sm text-muted-foreground">Update the name shown across this Hearst+ demo in this browser.</p>
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
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">This removes the prototype account, saved stories, collections, comments, and preferences from this browser.</p>
                  {confirmDelete ? (
                    <div className="mt-4 flex flex-wrap gap-2"><Button className="min-h-11" variant="destructive" onClick={() => { deleteAccount(); onClose(); }}>Delete account</Button><Button className="min-h-11" variant="outline" onClick={() => setConfirmDelete(false)}>Cancel</Button></div>
                  ) : <Button variant="outline" className="mt-4 min-h-11 text-destructive" onClick={() => setConfirmDelete(true)}>Delete account</Button>}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </ModalFrame>
  );
}
