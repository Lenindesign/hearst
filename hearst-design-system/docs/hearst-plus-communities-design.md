# Hearst+ Communities: design

Communities becomes **brand-hosted conversation** rather than a reader-run forum:
- **Groups:** every group belongs to a Hearst brand.
- **Hosts:** editors seed, pin and moderate threads.
- **Stories:** hosts choose which stories get a discussion, and the story reader links to those threads.

**Posting** works on a trust ladder. Any signed-in reader can start a thread, but a reader's first few posts wait for host review, and after that they go live at once. Readers suggest new groups rather than creating them.

**Reactions** are one positive reaction plus a reply count; there are no downvotes.

**Navigation** gives each control one job:
- **Header row:** switches between Home, My groups and All groups.
- **Feed:** keeps its Hot / New / Top sort.
- **Left rail:** lists only the reader's groups.
- **Right rail:** explains groups. On Home it shows groups to join; inside a group it shows the description, hosts and rules.

**Home** leads with the reader's groups. Readers appear under their Hearst+ display name, and hosts carry a brand badge.

**Thread titles** use the theme's headline font, Schibsted Grotesk.

**On phones,** the reader's groups become a chip row above the feed. Replies reach readers through an in-app Activity list.

Implemented as a browser-local prototype on 2026-10-11 (`community-client.tsx`, `community-forums-page.tsx`); the rules live in `APP_RULES.md` Communities. The trust-ladder threshold is set to three posts, and host review is simulated.

## Terms

- **Communities**: the Hearst+ section at `/communities/` where readers talk with each other and with Hearst editors.
  Avoid: forums, subreddits, social.
- **Group**: a named, brand-owned space inside Communities around one interest, for example Delish's Italian Weeknights (shown today as `c/Italian Weeknights`).
  Avoid: community, subreddit, club.
- **Thread**: one post in a group plus its replies.
  Avoid: topic, discussion, post.
- **Host**: a Hearst editor or brand account that seeds, pins and moderates threads in its brand's groups.
  Avoid: admin, mod, owner.

## Why

The goal was to settle what the Hearst+ Communities section is for and how it should work: its purpose, navigation, participation, and how it ties to the brands and stories.

The current page mixes two models. Brand-led elements include the seeded brand groups and the editor "Writer threads". Reader-run, Reddit-like elements include "Create community", `c/` group names and up and down votes. It also has three overlapping navigations, voting buttons that do nothing, and a hard-coded serif that disagrees with the rest of Hearst+.

## Locked decisions

### 1. Communities is brand-hosted conversation (Q1: A)

Every group belongs to a Hearst brand. Hosts (editors and brand accounts) seed and host threads, and threads tie back to stories.

Why: Hearst+ sells trusted brands, so conversation hosted by those brands and their editors is the differentiator and the brand-safe option. Moderation scales with the editorial team rather than with every reader-made group, and every thread can point back to the stories that drive the app.

Rejected:
- **B, reader-run forums:** anyone could create a group about anything, with brands as just one kind of member. It grows faster and gives readers more ownership, but it needs real moderation tooling, reporting and policy before launch, and it puts brand-adjacent pages at the mercy of strangers.
- **C, interest clubs with programming:** fewer, bigger groups with scheduled events and challenges. It builds stronger habits, but it needs ongoing programming work; it can be layered onto A later as group programming.

### 2. Readers can post, on a trust ladder (Q4: C)

Any signed-in reader can start a thread in any group. A reader's first few posts wait for host review; after that, their posts go live at once.

Why: it keeps groups reader-driven while stopping drive-by spam and abuse where it usually comes from, brand-new accounts. Hosts review a small queue rather than everything.

Rejected:
- **A, posts go live at once:** reports and host removal only. The liveliest option, but brand-adjacent pages depend on readers reporting fast enough.
- **B, only hosts start threads:** readers reply. The safest option, but groups become comment sections under editor posts.

Cost: a review queue for hosts, and a visible "pending" state for the poster.

## Routine choices

1. **Navigation (Q2: A):** each control has one job.
   - **Header row:** the shared Hearst+ topic row, kept so Communities matches every other destination, switches between Home, My groups and All groups. It loses Popular, New, Top and Create.
   - **Feed:** keeps its own Hot / New / Top sort.
   - **Left rail:** lists only the reader's groups. Q10 moved "Groups to join" to the right rail, so the left rail's suggested groups and its Home / Popular / Create shortcuts go.
   - **Rejected:** dropping the header row (B), which would make Communities the only destination without it and leave phones without navigation once the rail hides; keeping everything (C).
2. **Reactions (Q3: A):** one positive reaction ("Helpful" or a heart) plus the reply count, with no downvotes. Top ranks by this reaction.
   - **Why:** it avoids pile-ons and editor threads that look "disliked", and matches the positive-only Save and More like this.
   - **Rejected:** up and down votes with a score (B); no reactions, ranking by activity only (C), which rewards arguments.
3. **"Create community" (Q5: A):** replaced by **Suggest a group** at the end of the group list, a short form sent to the brand's hosts. It gives editors demand signals.
   - **Rejected:** removing it (B), which leaves readers no say; Create for hosts only (C), which is host tooling rather than a reader feature and will still be needed behind the scenes.
4. **Threads and stories (Q6: B):** hosts choose which stories get a thread. Only those stories show **Join the conversation** in the story reader, with the reply count.
   - **Rejected:** an automatic thread for every story (A), which creates thousands of empty threads and makes the section look dead; story cards inside threads with no link from the reader (C), which wastes the reader as the biggest source of traffic.
   - **Cost:** coverage depends on editors' time.
5. **Home feed (Q7: A):** threads from the reader's groups first, then a few from suggested groups. A reader with no groups sees popular threads across brands plus join prompts. The suggested slots can use the river's personalization signals.
   - **Rejected:** one ranking of every group for everyone (B); host-picked threads only (C), a daily curation job.
6. **Identity (Q8: A):** readers show their Hearst+ display name and avatar, so there is no second sign-up before a first post. Hosts show their name with a brand badge, for example "Delish editor". Display names must be editable and checked for abuse.
   - **Rejected:** a separate community handle (B), which adds friction and a second identity to moderate; real full names (C), which raises privacy concerns.
7. **Thread title typeface (Q9: A):** thread and card titles read the theme's headline font, Schibsted Grotesk on Hearst+, instead of the hard-coded Newsreader. This follows the typography design (Hearst+ chrome hosting many brands uses Schibsted Grotesk) and the `STYLE.md` rule against hard-coding fonts in shared components.
   - **Rejected:** keeping Newsreader (B); each group's brand headline font (C), which makes a mixed feed look like a ransom note.
8. **Right rail (Q10: A):** the rail gives group context.
   - **On Home:** "Groups to join", with member counts and a Join button.
   - **Inside a group:** the group's description, hosts and rules, which is where brand hosting and the trust ladder become visible to readers.
   - **Rejected:** keeping "Recommended for you" threads (B), which would repeat Q7's suggestions; removing the rail (C).
9. **Phones (Q11: A):** the reader's groups become a horizontally scrolling chip row above the feed, and the right rail's content moves into each group's About tab, so the feed starts on the first screen.
   - **Rejected:** a Groups sheet behind a button (B); stacking the rails as today (C).
10. **Notifications (Q12: A):** in-app only, through a reply count on the profile avatar and an Activity list. The list shows replies to me, host answers, and "your post was approved".
    - **Rejected:** adding an opt-in email digest now (B), which can follow once posting volume justifies the consent and deliverability work; no notifications (C), which would leave readers unaware their pending post went live.

## Verified facts

Established by reading the code, not by asking:

- `/communities/` (`src/app/communities/page.tsx`) and `/communities/[brandSlug]/`, with group pages at `groups/[groupSlug]` and thread pages at `threads/[threadId]`, render `CommunityForumsPage` in `src/components/hearst-plus/community-forums-page.tsx` (1,344 lines). Related components: `community-feedback-controls.tsx` and `community-joined-groups-card.tsx`.
- Groups are seeded in `src/lib/community-groups.ts` (`communityGroups`: brand slug, group slug, name, description, member label, starter prompt and post slug, icon). Threads come from those seeds (`makeThreads`) plus story threads built from top destination stories (`makeStoryThread`).
- **Navigation duplicates:**
  - **Left rail:** shortcuts Home, Popular (`#popular`) and Create community (`#suggest-group`).
  - **Feed sort tabs:** Hot, New, Top.
  - **Header topic row:** Communities, Popular, New, Top, Groups, Create.
- `ThreadVoteRail` and the comment vote buttons render up and down arrows with a score but have no handlers. The composer, "Start a post in …", is a link to `#post-to-group`; its media and profile buttons have no handlers.
- `communityTypographyStyle` hard-codes `--community-font-display: var(--font-newsreader)`, plus `--community-surface-soft` `#eef7ff` and `-hover` `#e4f2ff`.
- `APP_RULES.md`, `STYLE.md` and `PRODUCT.md` have no Communities rules yet.

## Implementation notes

1. **Header row:** for `/communities/` routes, set the header topic row to Home, My groups and All groups. Remove Popular, New, Top and Create from it.
2. **Left rail:** reduce it to the reader's groups only, and add "Suggest a group" at the end of the group list, opening a short form.
3. **Right rail:** on Home, show "Groups to join" with Join buttons. In a group, show the description, hosts with brand badges, and the rules.
4. **Reactions:** replace `ThreadVoteRail` and the comment votes with one positive reaction plus reply count, and rank Top by it.
5. **Composer:** a working composer that posts as the Hearst+ identity, with a pending state for a reader's first posts. Add a host review queue.
6. **Moderation:** a report action on every thread and reply, and removal by hosts.
7. **Story reader:** add "Join the conversation" with the reply count, only on stories a host has attached to a thread.
8. **Home ranking:** joined groups first, then suggested groups, with an empty state of popular threads and join prompts.
9. **Typography:** drop the Newsreader override so titles read `--font-headline`.
10. **Phones:** a horizontally scrolling chip row of the reader's groups above the feed, plus an About tab per group.
11. **Activity:** an in-app Activity list and a reply count on the avatar.
12. **Docs:** add Communities rules to `APP_RULES.md` (purpose, posting, moderation, navigation, story links) and `STYLE.md` (reactions, typography, phone layout), plus a decision-log entry.

## Risks

- **Moderation capacity:** the trust ladder and host-picked story threads both depend on editors' time. If hosts fall behind, pending posts sit unapproved and readers leave.
- **Prototype accounts:** reader identity is a local demo profile today, so posting, review and notifications can only be simulated until real accounts exist.
- **Empty groups:** brand-hosted groups need steady host seeding, or Home and group pages look quiet. That is the cost of not letting readers create groups.
- **Mixed fonts in the reader:** story threads opened from the reader use Schibsted Grotesk titles, while the story itself uses the destination font. This is intended by the typography design, but it should be checked visually.
- **"How many first posts" is not set:** the trust-ladder threshold, for example the first three posts, needs a product decision and may differ by brand.

## Deferred

None. Every question was answered.

## Open threads

None. No discussion threads were opened during the session.
