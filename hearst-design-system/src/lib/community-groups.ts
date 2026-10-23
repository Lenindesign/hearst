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
  groupSlug?: string;
  id: string;
  title: string;
  body: string;
  meta: string;
  kind: "writer" | "reader";
  replies: number;
  author: string;
  mediaType?: "video" | "gallery";
  videoUrl?: string;
  galleryImages?: readonly { src: string; alt: string }[];
};

export const communityParticipationThreads: readonly CommunityParticipationThread[] = [
  {
    brandSlug: "delish",
    groupSlug: "italian-weeknights",
    id: "writers-test-kitchen",
    title: "Ask the test kitchen: what should we solve next?",
    body: "Delish editors are collecting reader questions for weeknight dinners, shortcuts, and recipes that need troubleshooting.",
    meta: "Editors in the kitchen",
    kind: "writer",
    replies: 44,
    author: "Delish writers",
  },
  {
    brandSlug: "delish",
    groupSlug: "italian-weeknights",
    id: "crispy-chicken-cutlets",
    title: "How do you keep chicken cutlets crispy until dinner?",
    body: "I’m making a batch for a busy weeknight. Do you use a rack, a warm oven, or another trick to keep the coating crunchy?",
    meta: "Weeknight help · 2 hours ago",
    kind: "reader",
    replies: 18,
    author: "Maya R.",
    mediaType: "gallery",
  },
  {
    brandSlug: "delish",
    groupSlug: "italian-weeknights",
    id: "one-pot-tomato-pasta",
    title: "One-pot tomato pasta: when do you add the greens?",
    body: "The test kitchen is trying a one-pot version this week. Tell us which greens hold up best and when you stir them in.",
    meta: "Test kitchen · 4 hours ago",
    kind: "writer",
    replies: 26,
    author: "Delish editors",
    mediaType: "video",
    videoUrl: "/storybook-video-fixture.mp4",
  },
  {
    brandSlug: "delish",
    groupSlug: "italian-weeknights",
    id: "freezer-sauce-swap",
    title: "Show us the sauce you keep in the freezer",
    body: "A reader favorite from our recipe club: share your best make-ahead sauce and how you use it on a tired Tuesday.",
    meta: "Reader swap · Yesterday",
    kind: "reader",
    replies: 12,
    author: "Nico L.",
    mediaType: "gallery",
  },
  {
    brandSlug: "delish",
    groupSlug: "italian-weeknights",
    id: "garlic-bread-crunch",
    title: "The easiest way to get extra-crispy garlic bread?",
    body: "Butter under the broiler, olive oil in a skillet, or something else? Add your timing so everyone can copy it.",
    meta: "Kitchen question · Yesterday",
    kind: "reader",
    replies: 9,
    author: "Tessa P.",
  },
  {
    brandSlug: "delish",
    groupSlug: "italian-weeknights",
    id: "chop-salad-prep",
    title: "Can we prep a chopped salad two days ahead?",
    body: "We’re testing the best way to keep crunchy vegetables fresh. Which ingredients do you store separately?",
    meta: "Test kitchen · 2 days ago",
    kind: "writer",
    replies: 21,
    author: "Delish editors",
    mediaType: "video",
    videoUrl: "/storybook-vertical-video-fixture.mp4",
  },
  {
    brandSlug: "delish",
    groupSlug: "italian-weeknights",
    id: "meatball-freezer-tips",
    title: "Do you freeze meatballs before or after cooking?",
    body: "We make a double batch most Sundays. Looking for the method that reheats tender without extra dishes.",
    meta: "Meal prep · 3 days ago",
    kind: "reader",
    replies: 16,
    author: "Jordan K.",
  },
  {
    brandSlug: "delish",
    groupSlug: "italian-weeknights",
    id: "lemony-orzo-finish",
    title: "What makes your lemony orzo taste bright, not sharp?",
    body: "The editors are comparing zest, juice, and herbs. Share your favorite finish and the amount you use.",
    meta: "Editors ask · 4 days ago",
    kind: "writer",
    replies: 14,
    author: "Delish editors",
  },
  {
    brandSlug: "delish",
    groupSlug: "italian-weeknights",
    id: "pantry-dinner-under-20",
    title: "Your best pantry dinner in under 20 minutes",
    body: "Beans, pasta, tinned tomatoes, or a very good egg: tell us the combination you reach for when the fridge is empty.",
    meta: "Community favorites · 5 days ago",
    kind: "reader",
    replies: 32,
    author: "Sam D.",
  },
  {
    brandSlug: "delish",
    groupSlug: "italian-weeknights",
    id: "leftover-roast-vegetables",
    title: "Turn leftover roasted vegetables into tonight’s dinner",
    body: "Here are three quick ways to turn yesterday’s tray into a satisfying meal. Which one should we test first?",
    meta: "Delish test kitchen · 1 week ago",
    kind: "writer",
    replies: 19,
    author: "Delish editors",
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
];

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

type HostPickCandidate = { id: string; brandSlug: string; popularity: number; age: number };

// Stand-in for the editors' choice of which stories get a discussion (communities design Q6): the
// two most popular stories per brand. Both Communities and the story reader use this rule.
export const HOST_PICKED_STORIES_PER_BRAND = 2;

export function getHostPickedStories<T extends HostPickCandidate>(stories: readonly T[]): T[] {
  return [...stories]
    .sort((a, b) => b.popularity - a.popularity || a.age - b.age)
    .slice(0, HOST_PICKED_STORIES_PER_BRAND);
}

export function isHostPickedStory<T extends HostPickCandidate>(story: T, stories: readonly T[]) {
  return getHostPickedStories(stories.filter((candidate) => candidate.brandSlug === story.brandSlug)).some(
    (candidate) => candidate.id === story.id,
  );
}

export function getCommunityStoryThreadHref(story: Pick<HostPickCandidate, "id" | "brandSlug">) {
  return `/communities/${story.brandSlug}/threads/${story.id}/`;
}

// Trust ladder: a reader's first posts wait for host review, later posts go live at once. Shared by the server-built
// group rules and the client composer, so it lives here rather than in the "use client" module.
export const COMMUNITY_REVIEWED_POST_COUNT = 3;
