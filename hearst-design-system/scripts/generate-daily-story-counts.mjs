import { writeDailyStoryCountsReport } from "./feed-refresh-counts.mjs";

await writeDailyStoryCountsReport();
console.log("Updated daily-story-counts.md with uncapped new-story totals.");
