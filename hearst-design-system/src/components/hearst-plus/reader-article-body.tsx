"use client";

import React from "react";
import Image from "next/image";

import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import type { LiveArticleData } from "@/lib/live-feed-types";
import { formatVideoDuration } from "./video-format";

export type ReaderArticleLoadState =
  | { status: "loading" }
  | { status: "ready"; data: LiveArticleData }
  | { status: "error" };

export type ReaderArticleImage = {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
};

function getReaderFixtureParagraphs(story: LifestyleRiverStory) {
  const topicPhrase = story.topic.toLowerCase();
  const tagPhrase = story.tags.slice(0, 3).join(", ");

  return [
    story.summary,
    `${story.brand} editors frame this ${topicPhrase} story around the signals readers are acting on right now: ${tagPhrase}.`,
    `In the full experience, this reader would continue into the original ${story.brand} article with inline media, related service modules, and commerce or recipe utilities when they are relevant.`,
    "The reader view keeps the session moving: open a story from the river, keep reading, and let the next ranked story load into the same flow.",
  ];
}

export function ReaderArticleBody({
  story,
  liveArticle,
  onOpenImage,
}: {
  story: LifestyleRiverStory;
  liveArticle?: ReaderArticleLoadState;
  onOpenImage: (image: ReaderArticleImage) => void;
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

  if (story.sourceUrl && (!liveArticle || liveArticle.status === "loading")) {
    return (
      <div className="mt-6 space-y-3" aria-live="polite">
        <p className="text-sm font-semibold text-muted-foreground">
          Loading the full article and photos...
        </p>
        <div className="h-4 w-full animate-pulse rounded bg-muted motion-reduce:animate-none" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted motion-reduce:animate-none" />
        <div className="h-4 w-4/6 animate-pulse rounded bg-muted motion-reduce:animate-none" />
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

  if (story.sourceUrl && liveArticle?.status === "error") {
    return (
      <div
        className="mt-6 rounded-[8px] border border-border bg-muted/25 p-5"
        role="status"
      >
        <p className="font-bold text-foreground">
          This complete article could not be loaded.
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Try reopening the story to refresh the executive POC reader.
        </p>
      </div>
    );
  }

  const readerParagraphs = getReaderFixtureParagraphs(story);

  return (
    <div className="mt-6 space-y-5 text-base leading-8 text-foreground/80">
      {readerParagraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}
