export type RecommendationReasonSignals = {
  freshSinceLastVisit?: boolean;
  newEdition?: boolean;
  followedTopic?: string;
  followedBrand?: string;
  daypart?: "morning" | "afternoon" | "evening" | "lateNight";
  editorSelected?: boolean;
};

const daypartReasons: Record<NonNullable<RecommendationReasonSignals["daypart"]>, string> = {
  morning: "Morning pick",
  afternoon: "Afternoon pick",
  evening: "Evening pick",
  lateNight: "Late-night pick",
};

export function getRecommendationReason(signals: RecommendationReasonSignals) {
  if (signals.freshSinceLastVisit) return "New since your last visit";
  if (signals.newEdition) return "New in today’s edition";
  if (signals.followedTopic) return `Because you follow ${signals.followedTopic}`;
  if (signals.followedBrand) return `Because you follow ${signals.followedBrand}`;
  if (signals.daypart) return daypartReasons[signals.daypart];
  if (signals.editorSelected) return "Editor-selected for today";
  return "Popular across Hearst";
}
