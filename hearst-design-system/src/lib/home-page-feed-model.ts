import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";

export type AutosOemLogoFilter = {
  name: string;
  logo: string;
  aliases: string[];
};

export const autosOemLogoFilters: AutosOemLogoFilter[] = [
  { name: "Buick", logo: "/logos/oem/buick.svg", aliases: ["buick"] },
  { name: "Canoo", logo: "/logos/oem/canoo.svg", aliases: ["canoo"] },
  { name: "Chevrolet", logo: "/logos/oem/chevrolet.svg", aliases: ["chevrolet", "chevy"] },
  { name: "Daewoo", logo: "/logos/oem/daewoo.svg", aliases: ["daewoo"] },
  { name: "Dodge", logo: "/logos/oem/dodge.svg", aliases: ["dodge"] },
  { name: "Eagle", logo: "/logos/oem/eagle.svg", aliases: ["eagle"] },
  { name: "Genesis", logo: "/logos/oem/genesis.svg", aliases: ["genesis"] },
  { name: "GMC", logo: "/logos/oem/gmc.svg", aliases: ["gmc"] },
  { name: "Hummer", logo: "/logos/oem/hummer.svg", aliases: ["hummer"] },
  { name: "Infiniti", logo: "/logos/oem/infiniti.svg", aliases: ["infiniti"] },
  { name: "Jeep", logo: "/logos/oem/jeep.svg", aliases: ["jeep"] },
  { name: "Kia", logo: "/logos/oem/kia.svg", aliases: ["kia"] },
  { name: "Lordstown", logo: "/logos/oem/lordstown.svg", aliases: ["lordstown"] },
  { name: "Mercury", logo: "/logos/oem/mercury.svg", aliases: ["mercury"] },
  { name: "Nissan", logo: "/logos/oem/nissan.svg", aliases: ["nissan"] },
  { name: "Oldsmobile", logo: "/logos/oem/oldsmobile.svg", aliases: ["oldsmobile"] },
  { name: "Polestar", logo: "/logos/oem/polestar.svg", aliases: ["polestar"] },
  { name: "Ram", logo: "/logos/oem/ram.svg", aliases: ["ram"] },
  { name: "Saab", logo: "/logos/oem/saab.svg", aliases: ["saab"] },
  { name: "VinFast", logo: "/logos/oem/vinfast.svg", aliases: ["vinfast"] },
];

type AutosOemStory = Pick<
  LifestyleRiverStory,
  "title" | "summary" | "topic" | "brand" | "tags"
>;

function getAutosOemStoryTokens(story: AutosOemStory) {
  return new Set(
    [
      story.title,
      story.summary,
      story.topic,
      story.brand,
      ...story.tags,
    ]
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean)
  );
}

export function getAutosOemMatchesForStory(story: AutosOemStory) {
  const tokens = getAutosOemStoryTokens(story);
  return autosOemLogoFilters
    .filter((make) =>
      make.aliases.some((alias) =>
        alias
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter(Boolean)
          .every((token) => tokens.has(token))
      )
    )
    .map((make) => make.name);
}

export function usesNativePublicationLogoColor(brandSlug: string) {
  return brandSlug === "car-and-driver";
}

export function isCurrentFeedStory(story: Pick<LifestyleRiverStory, "id">) {
  return story.id.startsWith("live-");
}

function diversifyCurrentFeedStories(stories: LifestyleRiverStory[]) {
  const remaining = [...stories];
  const diversified: LifestyleRiverStory[] = [];

  while (remaining.length > 0) {
    const previousWasVideo = diversified.at(-1)?.videoUrl !== undefined;
    const differentMediaIndex = diversified.length === 0
      ? -1
      : remaining.findIndex((story) => Boolean(story.videoUrl) !== previousWasVideo);
    const nextIndex = differentMediaIndex >= 0 ? differentMediaIndex : 0;
    diversified.push(remaining.splice(nextIndex, 1)[0]);
  }

  return diversified;
}

export function applyContextualFeedCadence(
  stories: LifestyleRiverStory[],
): LifestyleRiverStory[] {
  const editorialStories = stories.filter((story) => !isCurrentFeedStory(story));
  const currentFeedStories = diversifyCurrentFeedStories(
    stories.filter((story) => isCurrentFeedStory(story))
  );

  if (currentFeedStories.length === 0 || editorialStories.length < 3) return stories;

  const blended: LifestyleRiverStory[] = [];
  let editorialIndex = 0;
  let currentIndex = 0;
  const initialEditorialCount = Math.min(5, editorialStories.length);

  blended.push(...editorialStories.slice(0, initialEditorialCount));
  editorialIndex = initialEditorialCount;

  if (currentIndex < currentFeedStories.length) {
    blended.push(currentFeedStories[currentIndex]);
    currentIndex += 1;
  }

  if (editorialIndex < editorialStories.length && currentIndex < currentFeedStories.length) {
    blended.push(editorialStories[editorialIndex], currentFeedStories[currentIndex]);
    editorialIndex += 1;
    currentIndex += 1;
  }

  while (editorialIndex < editorialStories.length) {
    const nextEditorialStories = editorialStories.slice(editorialIndex, editorialIndex + 3);
    blended.push(...nextEditorialStories);
    editorialIndex += nextEditorialStories.length;

    if (nextEditorialStories.length === 3 && currentIndex < currentFeedStories.length) {
      blended.push(currentFeedStories[currentIndex]);
      currentIndex += 1;
    }
  }

  return blended;
}
