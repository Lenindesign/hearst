"use client";

import React from "react";
import Image from "next/image";

import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import type { LiveArticleData } from "@/lib/live-feed-types";
import { formatVideoDuration } from "./video-format";

export type ReaderArticleLoadState =
  | { status: "loading"; requestedAt?: number }
  | { status: "ready"; data: LiveArticleData }
  | { status: "error" };

export type ReaderArticleImage = {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
};

function ReaderArticleLoadStatus({
  liveArticle,
  onRetry,
}: {
  liveArticle?: ReaderArticleLoadState;
  onRetry?: () => void;
}) {
  const fullArticleFailed = liveArticle?.status === "error";

  return (
    <div className="mt-6 text-base leading-8 text-foreground/80">
      {!fullArticleFailed ? (
        <div className="rounded-[8px] border border-border bg-muted/20 p-4" aria-live="polite">
          <p className="text-sm font-semibold text-muted-foreground">
            Loading the full article and photos…
          </p>
          <div className="mt-3 space-y-2" aria-hidden>
            <div className="h-3 w-full animate-pulse rounded bg-muted motion-reduce:animate-none" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-muted motion-reduce:animate-none" />
          </div>
        </div>
      ) : null}

      {fullArticleFailed ? (
        <div
          className="rounded-[8px] border border-border bg-muted/25 p-5"
          role="status"
        >
          <p className="font-bold text-foreground">
            The full source article could not be loaded.
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Please try loading it again.</p>
          {onRetry ? (
            <button
              type="button"
              className="mt-4 inline-flex min-h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              onClick={onRetry}
            >
              Try full article again
            </button>
          ) : null}
        </div>
      ) : null}

    </div>
  );
}

export function ReaderArticleBody({
  story,
  liveArticle,
  onOpenImage,
  onRetry,
}: {
  story: LifestyleRiverStory;
  liveArticle?: ReaderArticleLoadState;
  onOpenImage: (image: ReaderArticleImage) => void;
  onRetry?: () => void;
}) {
  if (story.videoUrl) {
    return (
      <div className="mt-6 space-y-4 text-[18px] leading-8 text-foreground/85">
        <p>{story.summary}</p>
        <p className="border-t border-border pt-4 text-sm font-semibold text-muted-foreground">
          Hearst video
          {story.videoDuration
            ? ` · ${formatVideoDuration(story.videoDuration)}`
            : ""}
        </p>
      </div>
    );
  }

  if (liveArticle?.status === "ready") {
    return (
      <div className="mt-6 space-y-7 text-[18px] leading-8 text-foreground/85">
        {liveArticle.data.blocks.map((block, index) => {
          let content: React.ReactNode;

          if (block.type === "image") {
            content = (
              <figure key={`${block.url}-${index}`} className="py-2">
                <button
                  type="button"
                  className="group block w-full cursor-zoom-in rounded-[4px] focus:outline-none focus:ring-2 focus:ring-primary/40"
                  onClick={() =>
                    onOpenImage({
                      src: block.url,
                      alt: block.alt,
                      caption: block.caption,
                      credit: block.credit,
                    })
                  }
                  aria-label={`View image fullscreen: ${block.alt}`}
                >
                  <Image
                    src={block.url}
                    alt={block.alt}
                    width={1200}
                    height={800}
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="max-h-[720px] w-full rounded-[4px] object-cover transition-opacity group-hover:opacity-95"
                  />
                </button>
                {block.caption || block.credit ? (
                  <figcaption className="mt-2 text-xs leading-5 text-muted-foreground">
                    {[block.caption, block.credit].filter(Boolean).join(" · ")}
                  </figcaption>
                ) : null}
              </figure>
            );
          } else if (block.type === "heading") {
            content = (
              <h3 className="headline !mb-3 pt-3 text-2xl leading-tight text-foreground sm:text-3xl">
                {block.text}
              </h3>
            );
          } else if (block.type === "quote") {
            content = (
              <blockquote className="border-y border-border py-5 font-brand-secondary text-xl leading-8 text-foreground">
                {block.text}
              </blockquote>
            );
          } else if (block.type === "list") {
            content = (
              <ul className="list-disc space-y-2 pl-6">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          } else {
            content = <p>{block.text}</p>;
          }

          return (
            <React.Fragment key={`reader-block-${index}`}>
              {content}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return <ReaderArticleLoadStatus liveArticle={liveArticle} onRetry={onRetry} />;
}
