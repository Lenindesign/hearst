/**
 * Reader taxonomy proposal data for the specs chapter (HP-TAX-PROP · Draft).
 *
 * The proposal itself lives in src/lib/reader-taxonomy.ts so the scoped
 * preview route can share it. This file adds the story snapshot the chapter
 * counts from, read when the page is built, so counts follow each daily feed
 * refresh.
 */
import { autosRiverStories } from "@/components/autos-river-data";
import { ewRiverStories } from "@/components/ew-river-data";
import { fluxRiverStories } from "@/components/flux-river-data";
import { lifestyleRiverStories } from "@/components/lifestyle-river-data";
import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";

export * from "@/lib/reader-taxonomy";

export const taxonomyStories: LifestyleRiverStory[] = [
  ...lifestyleRiverStories,
  ...autosRiverStories,
  ...fluxRiverStories,
  ...ewRiverStories,
];
