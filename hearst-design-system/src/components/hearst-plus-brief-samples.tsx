"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";
import { CommunityHomeRiverCard } from "@/components/hearst-plus/community-home-river-card";
import type { CommunityFeedThread } from "@/components/hearst-plus/community-client";
import { LifestyleRiverCard } from "@/components/home-page";

function RiverStorySample({ story }: { story: LifestyleRiverStory }) {
  const router = useRouter();
  const openStory = () => router.push(`/read/${encodeURIComponent(story.id)}/?from=%2Fhearst-plus-brief%2F`);

  return <LifestyleRiverCard story={story} onOpen={openStory} />;
}

function SampleFigure({ label, note, children }: { label: string; note: string; children: ReactNode }) {
  return (
    <figure className="min-w-0 space-y-3">
      <figcaption>
        <p className="text-sm font-semibold">{label}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{note}</p>
      </figcaption>
      {children}
    </figure>
  );
}

export function HearstPlusBriefSamples({
  articleStory,
  galleryStory,
  videoStory,
  communityThread,
  videoSourceCopy,
}: {
  articleStory: LifestyleRiverStory;
  galleryStory?: LifestyleRiverStory;
  videoStory?: LifestyleRiverStory;
  communityThread: CommunityFeedThread;
  videoSourceCopy: string;
}) {
  return (
    <div className="mt-8 grid items-start gap-8 border-t border-border pt-6 lg:grid-cols-2">
      <SampleFigure label="Article · a real story from the feed snapshot" note={`${articleStory.brand} · ${articleStory.topic}. Open the card to read it in the Hearst+ reader.`}>
        <RiverStorySample story={articleStory} />
      </SampleFigure>

      {videoStory ? (
        <SampleFigure label="Video · a configured recommendation" note={`${videoStory.brand} · ${videoStory.readTime}. ${videoSourceCopy}`}>
          <RiverStorySample story={videoStory} />
        </SampleFigure>
      ) : (
        <SampleFigure label="Video · live sample unavailable" note={videoSourceCopy}>
          <div className="flex min-h-48 flex-col justify-end bg-[var(--hp-utility-bar)] p-5 text-primary-foreground">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-primary-foreground/70">Video detail experience</p>
            <p className="mt-2 max-w-md font-serif text-2xl leading-tight">Browse the current Hearst+ video feed.</p>
            <a className="mt-4 inline-flex min-h-11 w-fit items-center font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground" href="/hearst-plus/motortrend-videos/">Open video feed</a>
          </div>
        </SampleFigure>
      )}

      {galleryStory ? (
        <SampleFigure label="Photo gallery · a real gallery story" note={`${galleryStory.brand} · ${galleryStory.topic}. The river card loads the story's gallery preview when the source provides enough images.`}>
          <RiverStorySample story={galleryStory} />
        </SampleFigure>
      ) : null}

      <SampleFigure label="Community · a prototype conversation" note="This uses the real community card component and seeded demo content, not a reader-submitted post.">
        <CommunityHomeRiverCard thread={communityThread} />
      </SampleFigure>
    </div>
  );
}
