"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Bookmark,
  Camera,
  Check,
  MessageCircle,
  Send,
  Share2,
  Star,
  ThumbsUp,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type CommunityActionKind = "comment" | "share" | "save" | "follow";

const actionCopy: Record<
  CommunityActionKind,
  { label: string; activeLabel: string; icon: typeof MessageCircle }
> = {
  comment: {
    label: "Comment",
    activeLabel: "Reply box ready",
    icon: MessageCircle,
  },
  share: {
    label: "Share",
    activeLabel: "Share link copied",
    icon: Share2,
  },
  save: {
    label: "Save",
    activeLabel: "Saved locally",
    icon: Bookmark,
  },
  follow: {
    label: "Follow post",
    activeLabel: "Following",
    icon: ThumbsUp,
  },
};

export function CommunityInlineAction({
  action,
  className,
}: {
  action: CommunityActionKind;
  className?: string;
}) {
  const [active, setActive] = React.useState(false);
  const copy = actionCopy[action];
  const Icon = copy.icon;

  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-h-9 items-center gap-1.5 text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
        active && "text-[var(--hp-text-primary)]",
        className,
      )}
      aria-pressed={action === "save" || action === "follow" ? active : undefined}
      onClick={() => setActive((value) => !value)}
    >
      {active ? <Check className="size-4" aria-hidden /> : <Icon className="size-4" aria-hidden />}
      {active ? copy.activeLabel : copy.label}
    </button>
  );
}

export function CommunityStartPostForm() {
  const [status, setStatus] = React.useState("");

  return (
    <form
      id="start-thread"
      className="scroll-mt-28 rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]"
      aria-labelledby="start-thread-title"
      onSubmit={(event) => {
        event.preventDefault();
        setStatus("Post preview ready. Sign in to publish it across devices.");
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3
            id="start-thread-title"
            className="hearst-community-display text-2xl font-bold leading-tight"
          >
            Start a post
          </h3>
          <p className="hearst-community-copy mt-1 text-sm leading-6 text-[var(--hp-text-secondary)]">
            Ask a question, invite writer input, or share something the group can answer.
          </p>
        </div>
        <span className="rounded-[8px] bg-[var(--community-surface-soft)] px-3 py-1.5 text-xs font-bold text-[var(--hp-text-secondary)]">
          Reader post
        </span>
      </div>

      <div className="mt-4 grid gap-3">
        <label
          htmlFor="community-thread-title"
          className="grid gap-1.5 text-sm font-bold text-[var(--hp-text-primary)]"
        >
          Post title
          <input
            id="community-thread-title"
            name="title"
            type="text"
            required
            placeholder="What do you want to ask the group?"
            className="hearst-community-copy min-h-11 rounded-[8px] border border-primary/15 bg-[var(--community-surface-soft)] px-3 text-sm font-normal text-[var(--hp-text-primary)] outline-none transition-colors placeholder:text-[var(--hp-text-secondary)] focus-visible:border-primary focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(180px,0.42fr)]">
          <label
            htmlFor="community-thread-body"
            className="grid gap-1.5 text-sm font-bold text-[var(--hp-text-primary)]"
          >
            Post
            <Textarea
              id="community-thread-body"
              name="body"
              required
              placeholder="Give people enough context to reply."
              className="hearst-community-copy min-h-28 resize-y border-primary/15 bg-[var(--community-surface-soft)] text-sm font-normal leading-6 focus-visible:bg-white"
            />
          </label>
          <label
            htmlFor="community-thread-type"
            className="grid content-start gap-1.5 text-sm font-bold text-[var(--hp-text-primary)]"
          >
            Post type
            <select
              id="community-thread-type"
              name="type"
              className="hearst-community-copy min-h-11 rounded-[8px] border border-primary/15 bg-[var(--community-surface-soft)] px-3 text-sm font-normal text-[var(--hp-text-primary)] outline-none transition-colors focus-visible:border-primary focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-ring/50"
              defaultValue="reader"
            >
              <option value="reader">Reader question</option>
              <option value="writer">Ask the writers</option>
              <option value="post">Group discussion</option>
              <option value="challenge">Community challenge</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p
          className="hearst-community-copy text-xs leading-5 text-[var(--hp-text-secondary)]"
          aria-live="polite"
        >
          {status || "Sign in to publish across devices. Drafts can start here."}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setStatus("Draft saved in this browser.")}
          >
            Save draft
          </Button>
          <Button type="submit" size="sm" className="text-primary-foreground">
            <Send className="size-4" aria-hidden />
            Publish post
          </Button>
        </div>
      </div>
    </form>
  );
}

export function CommunityReplyForm() {
  const [status, setStatus] = React.useState("");

  return (
    <form
      id="reply-thread"
      className="scroll-mt-28 border-t border-[var(--hp-border)] bg-[var(--hp-surface)] p-5"
      aria-labelledby="reply-thread-title"
      onSubmit={(event) => {
        event.preventDefault();
        setStatus("Reply ready. Sign in to post it across devices.");
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4
            id="reply-thread-title"
            className="hearst-community-display text-xl font-bold leading-tight"
          >
            Join the conversation
          </h4>
          <p className="hearst-community-copy mt-1 text-sm leading-6 text-[var(--hp-text-secondary)]">
            Reply as a reader, or sign in to keep your group history across devices.
          </p>
        </div>
        <span className="rounded-[8px] bg-[var(--community-surface-soft)] px-3 py-1.5 text-xs font-bold text-[var(--hp-text-secondary)]">
          Reader reply
        </span>
      </div>
      <label className="mt-4 block">
        <span className="sr-only">Write a reply</span>
        <Textarea
          name="reply"
          required
          placeholder="Add your take, ask a follow-up, or share a related tip."
          className="hearst-community-copy min-h-28 resize-y border-primary/15 bg-[var(--community-surface-soft)] text-sm leading-6 focus-visible:bg-white"
        />
      </label>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="hearst-community-copy text-xs leading-5 text-[var(--hp-text-secondary)]" aria-live="polite">
          {status || "Keep it useful, kind, and specific to this group."}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setStatus("Draft saved in this browser.")}
          >
            Save draft
          </Button>
          <Button type="submit" size="sm" className="text-primary-foreground">
            <Send className="size-4" aria-hidden />
            Post reply
          </Button>
        </div>
      </div>
    </form>
  );
}

export function CommunitySuggestGroupForm({
  placeholder,
}: {
  placeholder: string;
}) {
  const [status, setStatus] = React.useState("");

  return (
    <form
      id="suggest-group"
      className="scroll-mt-28 rounded-[8px] border border-[var(--hp-border)] bg-[var(--hp-surface)] p-4 shadow-[var(--hp-shadow-card)]"
      aria-labelledby="suggest-group-title"
      onSubmit={(event) => {
        event.preventDefault();
        setStatus("Suggestion saved for editorial review.");
      }}
    >
      <h2
        id="suggest-group-title"
        className="hearst-community-display text-xl font-bold leading-tight"
      >
        Suggest a group
      </h2>
      <p className="hearst-community-copy mt-2 text-sm leading-6 text-[var(--hp-text-secondary)]">
        Readers can suggest groups. Editors review them so the community stays focused and useful.
      </p>
      <div className="mt-4 grid gap-3">
        <label
          htmlFor="suggest-group-name"
          className="grid gap-1.5 text-sm font-bold text-[var(--hp-text-primary)]"
        >
          Group name
          <input
            id="suggest-group-name"
            name="groupName"
            type="text"
            required
            placeholder={placeholder}
            className="hearst-community-copy min-h-11 rounded-[8px] border border-primary/15 bg-[var(--community-surface-soft)] px-3 text-sm font-normal text-[var(--hp-text-primary)] outline-none transition-colors placeholder:text-[var(--hp-text-secondary)] focus-visible:border-primary focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
        <label
          htmlFor="suggest-group-reason"
          className="grid gap-1.5 text-sm font-bold text-[var(--hp-text-primary)]"
        >
          Why it should exist
          <Textarea
            id="suggest-group-reason"
            name="reason"
            required
            placeholder="What would readers talk about here?"
            className="hearst-community-copy min-h-24 resize-y border-primary/15 bg-[var(--community-surface-soft)] text-sm font-normal leading-6 focus-visible:bg-white"
          />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="hearst-community-copy text-xs leading-5 text-[var(--hp-text-secondary)]" aria-live="polite">
          {status || "Suggestions stay local in this prototype until account services are connected."}
        </p>
        <Button type="submit" size="sm" className="text-primary-foreground">
          <Send className="size-4" aria-hidden />
          Send suggestion
        </Button>
      </div>
    </form>
  );
}

export function CommunityCreateActionButton({
  label,
  icon,
}: {
  label: string;
  icon: "message" | "camera" | "star";
}) {
  const [active, setActive] = React.useState(false);
  const Icon = icon === "camera" ? Camera : icon === "star" ? Star : MessageCircle;

  return (
    <Button
      type="button"
      variant="outline"
      size="touch"
      className="justify-start"
      aria-pressed={active}
      onClick={() => setActive((value) => !value)}
    >
      {active ? <Check className="size-4" aria-hidden /> : <Icon className="size-4" aria-hidden />}
      {active ? "Ready in post form" : label}
    </Button>
  );
}
