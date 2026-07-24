export type VisitDaypart = "morning" | "afternoon" | "evening" | "lateNight";

export type VisitRecord = {
  scopeKey: string;
  visitedAt: number;
  editionId: string;
  leadStoryId?: string;
};

export type VisitContext = {
  daypart: VisitDaypart;
  returnHours: number;
  contentDay: "today" | "nextDay";
  previousLeadId?: string;
};

export const visitContextStorageKey = "hearst-visit-context-v1";

const maximumVisitRecords = 20;
const minimumReturnIntervalMs = 30 * 60 * 1000;
const maximumReturnHours = 24 * 7;

export function getVisitDaypart(date: Date): VisitDaypart {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 22) return "evening";
  return "lateNight";
}

export function normalizeVisitRecords(value: unknown): VisitRecord[] {
  if (!Array.isArray(value)) return [];

  const seenScopeKeys = new Set<string>();
  return value
    .filter((record): record is Record<string, unknown> => Boolean(record) && typeof record === "object")
    .map((record) => ({
      scopeKey: typeof record.scopeKey === "string" ? record.scopeKey.trim() : "",
      visitedAt: typeof record.visitedAt === "number" && Number.isFinite(record.visitedAt)
        ? Math.max(0, record.visitedAt)
        : 0,
      editionId: typeof record.editionId === "string" ? record.editionId.trim() : "",
      leadStoryId: typeof record.leadStoryId === "string" && record.leadStoryId.trim()
        ? record.leadStoryId.trim()
        : undefined,
    }))
    .filter((record) => {
      if (!record.scopeKey || !record.editionId || seenScopeKeys.has(record.scopeKey)) return false;
      seenScopeKeys.add(record.scopeKey);
      return true;
    })
    .sort((first, second) => second.visitedAt - first.visitedAt)
    .slice(0, maximumVisitRecords);
}

export function resolveVisitContext(
  records: VisitRecord[],
  scopeKey: string,
  editionId: string,
  now: Date
): VisitContext {
  const daypart = getVisitDaypart(now);
  const previousVisit = normalizeVisitRecords(records).find((record) => record.scopeKey === scopeKey);
  if (!previousVisit) {
    return { daypart, returnHours: 0, contentDay: "today" };
  }

  const elapsedMs = now.getTime() - previousVisit.visitedAt;
  const editionChanged = previousVisit.editionId !== editionId;
  const isReturnVisit = elapsedMs >= minimumReturnIntervalMs || (elapsedMs >= 0 && editionChanged);
  if (!isReturnVisit) {
    return { daypart, returnHours: 0, contentDay: "today" };
  }

  const returnHours = Math.min(
    maximumReturnHours,
    Math.max(1, Math.round(elapsedMs / (60 * 60 * 1000)))
  );

  return {
    daypart,
    returnHours,
    contentDay: editionChanged ? "nextDay" : "today",
    previousLeadId: previousVisit.leadStoryId,
  };
}

export function upsertVisitRecord(
  records: VisitRecord[],
  nextRecord: VisitRecord
) {
  return normalizeVisitRecords([
    nextRecord,
    ...normalizeVisitRecords(records).filter((record) => record.scopeKey !== nextRecord.scopeKey),
  ]);
}

export function readVisitRecords() {
  if (typeof window === "undefined") return [];

  try {
    const storedValue = window.localStorage.getItem(visitContextStorageKey);
    return normalizeVisitRecords(storedValue ? JSON.parse(storedValue) : []);
  } catch {
    return [];
  }
}

export function writeVisitRecords(records: VisitRecord[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(visitContextStorageKey, JSON.stringify(normalizeVisitRecords(records)));
  } catch {
    // Personalization falls back to the current visit when browser storage is unavailable.
  }
}
