"use client";

import React from "react";
import { MessageCircle, Send, ThumbsUp } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import {
  getLifestyleCommentCount,
  getLifestyleSeedComments,
  type LifestyleStoryComment,
} from "./content-reader-model";

export type ContentReaderCommentsProps = {
  story: LifestyleRiverStory;
  comments: LifestyleStoryComment[];
  onAddComment: (body: string) => void;
};

export function ContentReaderComments({
  story,
  comments,
  onAddComment,
}: ContentReaderCommentsProps) {
  const [draft, setDraft] = React.useState("");
  const seededComments = React.useMemo(
    () => getLifestyleSeedComments(story),
    [story],
  );
  const visibleComments = [...comments, ...seededComments].slice(0, 5);
  const totalCount = getLifestyleCommentCount(story, comments.length);
  const commentFieldId = `reader-comment-draft-${story.id}`;
  const commentGuidanceId = `reader-comment-guidance-${story.id}`;

  const submitComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;

    onAddComment(trimmed);
    setDraft("");
  };

  return (
    <section
      id={`reader-comments-${story.id}`}
      className="hearst-plus-reader-comments-target mt-8 scroll-mt-32 rounded-[8px] border border-border bg-muted/25 p-4 sm:p-5"
      aria-label={`Comments for ${story.title}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold">
            <MessageCircle className="h-4 w-4 text-primary" aria-hidden />
            Comments
            <span
              className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
              aria-label={`${totalCount} comments`}
            >
              {totalCount}
            </span>
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Reader notes from people following {story.topic.toLowerCase()} and{" "}
            {story.brand}.
          </p>
        </div>
        <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          Top comments
        </span>
      </div>

      <form
        onSubmit={submitComment}
        className="mt-4 flex gap-3"
        aria-label={`Add a comment about ${story.title}`}
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary"
          aria-hidden
        >
          You
        </div>
        <div className="min-w-0 flex-1">
          <label htmlFor={commentFieldId} className="sr-only">
            Add a comment about {story.title}
          </label>
          <textarea
            id={commentFieldId}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={3}
            placeholder="Add a comment"
            aria-describedby={commentGuidanceId}
            className="min-h-20 w-full resize-y rounded-[8px] border border-border bg-background px-3 py-2 text-sm leading-6 text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <p
              id={commentGuidanceId}
              className="text-xs text-muted-foreground"
            >
              Keep comments useful and tied to the story.
            </p>
            <Button
              size="xs"
              type="submit"
              disabled={!draft.trim()}
              className="min-h-11 sm:min-h-6"
            >
              <Send className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Post
            </Button>
          </div>
        </div>
      </form>

      <div className="mt-5 space-y-4">
        {visibleComments.map((comment) => (
          <article
            key={comment.id}
            className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3 border-t border-border pt-4 first:border-t-0 first:pt-0"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-xs font-bold text-primary ring-1 ring-border"
              aria-hidden
            >
              {comment.author
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="text-sm font-bold">{comment.author}</p>
                <p className="text-xs text-muted-foreground">
                  {comment.role} · {comment.age}
                </p>
              </div>
              <p className="mt-1 text-sm leading-6 text-foreground/85">
                {comment.body}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground">
                <button
                  type="button"
                  aria-label={`Like comment by ${comment.author}. ${comment.likes} likes`}
                  className="inline-flex min-h-11 items-center gap-1 hover:text-primary sm:min-h-0"
                >
                  <ThumbsUp className="h-3.5 w-3.5" aria-hidden />
                  <span aria-hidden>{comment.likes}</span>
                </button>
                <button
                  type="button"
                  aria-label={`Reply to ${comment.author}`}
                  className="min-h-11 hover:text-primary sm:min-h-0"
                >
                  Reply
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
