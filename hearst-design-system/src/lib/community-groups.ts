export type CommunityGroupIconKey = "chef" | "star" | "heart" | "flame";

export const joinedBrandGroupsStorageKey = "hearst-plus-joined-brand-groups-v1";
export const joinedBrandGroupsChangeEvent = "hearst-plus-joined-brand-groups-change";

export type CommunityGroup = {
  brandSlug: string;
  groupSlug: string;
  name: string;
  description: string;
  members: string;
  prompt: string;
  starterPostSlug: string;
  iconKey: CommunityGroupIconKey;
};

export const communityGroups = [
  {
    brandSlug: "delish",
    groupSlug: "italian-weeknights",
    name: "Italian Weeknights",
    description: "A Delish group for pantry pastas, red sauce questions, and low-stress dinners.",
    members: "18.4K cooks",
    prompt: "What sauce saves dinner when time is short?",
    starterPostSlug: "sauce-saves-dinner",
    iconKey: "chef",
  },
  {
    brandSlug: "cosmopolitan",
    groupSlug: "cosmo-watch-party",
    name: "Cosmo Watch Party",
    description: "A Cosmo group for celeb reads, dating debates, and entertainment reactions.",
    members: "22.8K readers",
    prompt: "What story should everyone be talking about today?",
    starterPostSlug: "story-everyone-is-talking-about",
    iconKey: "star",
  },
  {
    brandSlug: "good-housekeeping",
    groupSlug: "home-fix-club",
    name: "Home Fix Club",
    description:
      "A Good Housekeeping group for tested routines, cleaning saves, meal prep, and family systems.",
    members: "31.2K members",
    prompt: "What household fix actually worked this week?",
    starterPostSlug: "household-fix-that-worked",
    iconKey: "heart",
  },
  {
    brandSlug: "car-and-driver",
    groupSlug: "garage-talk",
    name: "Garage Talk",
    description: "A Car and Driver group for buying advice, road tests, EV notes, and weekend drives.",
    members: "16.5K drivers",
    prompt: "What would you test before buying?",
    starterPostSlug: "what-would-you-test",
    iconKey: "flame",
  },
] as const satisfies readonly CommunityGroup[];

export type CommunityParticipationThread = {
  brandSlug: string;
  id: string;
  title: string;
  body: string;
  meta: string;
  kind: "writer" | "reader";
  replies: number;
  author: string;
};

export const communityParticipationThreads = [
  {
    brandSlug: "delish",
    id: "writers-test-kitchen",
    title: "Ask the test kitchen: what should we solve next?",
    body: "Delish editors are collecting reader questions for weeknight dinners, shortcuts, and recipes that need troubleshooting.",
    meta: "Editors in the kitchen",
    kind: "writer",
    replies: 44,
    author: "Delish writers",
  },
  {
    brandSlug: "good-housekeeping",
    id: "readers-home-routines",
    title: "Readers: what home routine actually stuck?",
    body: "Share the small cleaning, meal prep, or family routine you kept doing after the first week.",
    meta: "Reader exchange",
    kind: "reader",
    replies: 38,
    author: "Good Housekeeping readers",
  },
  {
    brandSlug: "cosmopolitan",
    id: "writers-watch-list",
    title: "From the writers: what should we watch together?",
    body: "Cosmo writers are looking for the shows, celebrity moments, and group-chat debates readers want covered next.",
    meta: "Culture desk",
    kind: "writer",
    replies: 35,
    author: "Cosmopolitan writers",
  },
  {
    brandSlug: "car-and-driver",
    id: "reader-buying-advice",
    title: "Reader garage: what would you ask before buying?",
    body: "Bring your shortlist, tradeoffs, or test-drive questions and compare notes with other drivers.",
    meta: "Reader advice",
    kind: "reader",
    replies: 31,
    author: "Car and Driver readers",
  },
  {
    brandSlug: "elle-decor",
    id: "writers-design-questions",
    title: "Ask the editors: what design question is on your mind?",
    body: "Elle Decor editors are collecting reader questions about rooms, materials, color, collecting, and what makes a space feel personal.",
    meta: "Design editors",
    kind: "writer",
    replies: 27,
    author: "Elle Décor writers",
  },
] as const satisfies readonly CommunityParticipationThread[];

export type CommunityGroupMembership = {
  brandSlug: string;
  groupSlug?: string;
};

export function getCommunityGroup(brandSlug: string, groupSlug: string) {
  return communityGroups.find(
    (group) => group.brandSlug === brandSlug && group.groupSlug === groupSlug,
  );
}

export function getCommunityGroupsForBrand(brandSlug?: string) {
  return brandSlug
    ? communityGroups.filter((group) => group.brandSlug === brandSlug)
    : [...communityGroups];
}

export function getCommunityGroupHref(group: Pick<CommunityGroup, "brandSlug" | "groupSlug">) {
  return `/communities/${group.brandSlug}/groups/${group.groupSlug}/`;
}

export function getCommunityGroupPostHref(
  group: Pick<CommunityGroup, "brandSlug" | "groupSlug" | "starterPostSlug">,
) {
  return `/communities/${group.brandSlug}/groups/${group.groupSlug}/posts/${group.starterPostSlug}/`;
}

export function getCommunityStarterPostParams() {
  return communityGroups.map((group) => ({
    brandSlug: group.brandSlug,
    groupSlug: group.groupSlug,
    postId: group.starterPostSlug,
  }));
}

export function getCommunityStarterPost(brandSlug: string, groupSlug: string, postId: string) {
  const group = getCommunityGroup(brandSlug, groupSlug);
  return group?.starterPostSlug === postId ? group : undefined;
}

export function getCommunityParticipationThread(brandSlug: string, threadId: string) {
  return communityParticipationThreads.find(
    (thread) => thread.brandSlug === brandSlug && thread.id === threadId,
  );
}

export function getCommunityLegacyGroupThread(brandSlug: string, threadId: string) {
  return communityGroups.find(
    (group) => group.brandSlug === brandSlug && group.groupSlug === threadId,
  );
}
