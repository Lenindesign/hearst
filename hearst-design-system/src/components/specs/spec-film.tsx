"use client";

import React from "react";

/**
 * A spec motion film. It loads nothing until played (preload="none" with a
 * poster), so the single specifications page stays light with seven films.
 * Chapter buttons seek the film and start it.
 */
export function SpecFilm({
  src,
  poster,
  label,
  caption,
  chapters = [],
}: {
  src: string;
  poster: string;
  /** Accessible description of what the film shows. */
  label: string;
  caption?: React.ReactNode;
  chapters?: readonly (readonly [number, string])[];
}) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

  return (
    <figure className="min-w-0">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls
        muted
        playsInline
        preload="none"
        aria-label={label}
        className="block aspect-video w-full rounded-card bg-white shadow-[var(--hp-shadow-card)]"
      />
      {caption || chapters.length ? (
        <figcaption className="mt-3 space-y-3 text-sm text-muted-foreground">
          {caption ? <div>{caption}</div> : null}
          {chapters.length ? (
            <ol className="flex flex-wrap gap-2" aria-label="Film chapters">
              {chapters.map(([time, title]) => (
                <li key={`${time}-${title}`}>
                  <button
                    type="button"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-3 text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    onClick={() => {
                      const video = videoRef.current;
                      if (!video) return;
                      video.currentTime = time;
                      void video.play().catch(() => undefined);
                      video.focus();
                    }}
                  >
                    <span className="font-mono text-xs tabular-nums text-muted-foreground">{formatTime(time)}</span>
                    {title}
                  </button>
                </li>
              ))}
            </ol>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
