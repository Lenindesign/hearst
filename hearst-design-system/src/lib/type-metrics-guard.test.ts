import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

/**
 * Type metrics standard UI-TYPE-001 (/type-specs/): files migrated to the type-* role utilities must not
 * bring back one-off line heights or letter spacing. Rule-conformant fixed steps (leading-5…leading-10) and
 * leading-none for single-line display are allowed; ratios like leading-tight/snug/relaxed, arbitrary
 * leading-[…] and tracking-* one-offs are not. Add a file here once it is migrated.
 */
const MIGRATED_FILES = [
  "src/components/hearst-plus/video-cards.tsx",
  "src/components/hearst-plus/story-metadata.tsx",
  "src/components/hearst-plus/trending-rail.tsx",
  "src/components/hearst-plus/reader-article-body.tsx",
  "src/components/hearst-plus/reader-action-bar.tsx",
  "src/components/hearst-plus/featured-story-carousel.tsx",
  "src/components/hearst-plus/brand-promotion-river-module.tsx",
  "src/components/hearst-plus/content-reader-advertisement.tsx",
  "src/components/hearst-plus/content-reader-comments.tsx",
  "src/components/hearst-plus/saved-items-module.tsx",
  "src/components/hearst-plus/local-news-rail.tsx",
  "src/components/hearst-plus/discovery-sidebar.tsx",
  "src/components/hearst-plus/community-client.tsx",
  "src/components/reader-account-ui.tsx",
];

const BANNED = /\b(?:(?:sm|md|lg|xl):)?(?:leading-(?:tight|snug|normal|relaxed|loose|\[[0-9.]+\])|tracking-(?:tighter|tight|normal|wide|wider|widest|\[[^\]]+\]))/g;

test("migrated components use type roles instead of one-off line heights and tracking", () => {
  for (const file of MIGRATED_FILES) {
    const matches = readFileSync(new URL(`../../${file}`, import.meta.url), "utf8").match(BANNED) ?? [];
    assert.deepEqual(matches, [], `${file} uses ${[...new Set(matches)].join(", ")}; use a type-* role (see STYLE.md › Type metrics)`);
  }
});
