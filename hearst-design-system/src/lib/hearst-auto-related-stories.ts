import type { LifestyleRiverStory } from "@/components/lifestyle-river-types";

type VehicleStorySource = Pick<LifestyleRiverStory, "title"> & Partial<Pick<
  LifestyleRiverStory,
  "summary" | "sourceUrl" | "tags"
>>;

type VehicleIdentity = {
  year: string;
  make: string;
  model: string[];
};

const vehicleNameStopWords = new Set([
  "photos", "photo", "gallery", "pricing", "details", "interior", "exterior",
  "review", "reviews", "first", "drive", "video", "revealed", "reveals",
  "tested", "test", "price", "prices", "pricing", "build", "building", "spec", "specs",
  "specifications", "preview", "ca", "by", "car", "driver", "editors", "staff",
  "and", "more", "the", "for", "with", "on", "in", "to", "its", "our", "what", "will", "cost",
]);

function makeSearchTerms(make: string) {
  const normalized = make.toLowerCase();
  if (normalized === "chevy") return ["chevy", "chevrolet"];
  if (normalized === "vw") return ["vw", "volkswagen"];
  return [normalized];
}

function parseVehicleIdentity(value: string): VehicleIdentity | null {
  const normalized = value.replace(/[-_/]+/g, " ");
  const match = normalized.match(/\b((?:19|20)\d{2})\s+([a-z][a-z0-9-]+)\s+([a-z0-9][a-z0-9-]+(?:\s+[a-z0-9][a-z0-9-]+){0,3})/i);
  if (!match) return null;

  const candidates = match[3].split(/\s+/);
  const firstStopWord = candidates.findIndex((word) => vehicleNameStopWords.has(word.toLowerCase()));
  const model = candidates.slice(0, firstStopWord < 0 ? candidates.length : firstStopWord);
  return model.length ? { year: match[1], make: match[2], model } : null;
}

export function getHearstAutoStoryVehicleKey(story: VehicleStorySource) {
  const sources = [story.title, story.sourceUrl ?? "", story.summary ?? "", ...(story.tags ?? [])];
  const identity = sources.map(parseVehicleIdentity).find(Boolean);
  return identity
    ? [identity.year, identity.make, ...identity.model].join(" ").toLowerCase()
    : null;
}

export function areHearstAutoStoriesAboutSameVehicle(
  anchor: VehicleStorySource,
  candidate: VehicleStorySource,
) {
  const anchorIdentity = [anchor.title, anchor.sourceUrl ?? "", anchor.summary ?? "", ...(anchor.tags ?? [])]
    .map(parseVehicleIdentity)
    .find(Boolean);
  if (!anchorIdentity) return false;

  const candidateSources = [candidate.title, candidate.sourceUrl ?? "", candidate.summary ?? "", ...(candidate.tags ?? [])];
  const candidateIdentity = candidateSources.map(parseVehicleIdentity).find(Boolean);
  if (candidateIdentity && candidateIdentity.year !== anchorIdentity.year) return false;

  const searchable = ` ${candidateSources.join(" ").toLowerCase().replace(/[-_/]+/g, " ")} `;
  const makeMatches = makeSearchTerms(anchorIdentity.make).some((make) => searchable.includes(` ${make} `));
  return makeMatches && anchorIdentity.model.every((word) =>
    searchable.includes(` ${word.toLowerCase().replace(/[-_/]+/g, " ")} `),
  );
}
