export const productAnalyticsEventName = "hearst-product-analytics";

const analyticsSessionStorageKey = "hearst-product-analytics-session-v1";
const analyticsOnceStorageKey = "hearst-product-analytics-once-v1";
const maxPropertyStringLength = 160;

type AnalyticsValue = string | number | boolean;

export type UsefulSessionReason = "story_save" | "more_like_this";

export interface ProductAnalyticsEventMap {
  return_session: {
    destination: string;
    edition_id: string;
    daypart: string;
    returning: boolean;
    return_hours: number;
    return_window: ReturnWindow;
    unfinished_count: number;
  };
  edition_impression: {
    destination: string;
    edition_id: string;
    story_count: number;
    daypart: string;
  };
  edition_story_open: {
    destination: string;
    edition_id: string;
    story_id: string;
    position: number;
    format: "article" | "video";
    brand: string;
    topic: string;
  };
  resume_impression: {
    destination: string;
    story_id: string;
    entry_point: "mobile_strip" | "desktop_edit";
  };
  story_resume: {
    destination: string;
    story_id: string;
    entry_point: "mobile_strip" | "desktop_edit";
  };
  story_save_toggle: {
    destination: string;
    story_id: string;
    state: "saved" | "unsaved";
    surface: string;
  };
  more_like_this: {
    destination: string;
    story_id: string;
    surface: string;
  };
  story_hide: {
    destination: string;
    story_id: string;
    surface: string;
  };
  saved_empty_view: {
    destination: string;
    active_filter_count: number;
    suggestion_count: number;
  };
  saved_suggestion_open: {
    destination: string;
    story_id: string;
    position: number;
  };
  saved_suggestion_save: {
    destination: string;
    story_id: string;
    position: number;
  };
  saved_browse_for_you: {
    destination: string;
  };
  useful_session: {
    destination: string;
    reason: UsefulSessionReason;
    story_id: string;
  };
}

export type ProductAnalyticsEventKey = keyof ProductAnalyticsEventMap;
export type ReturnWindow = "first_visit" | "same_day" | "d1" | "d2_d6" | "d7_plus";

export interface ProductAnalyticsEvent<K extends ProductAnalyticsEventKey = ProductAnalyticsEventKey> {
  eventName: K;
  occurredAt: string;
  sessionId: string;
  properties: Record<string, AnalyticsValue>;
}

export function getReturnWindow(returnHours: number): ReturnWindow {
  if (!Number.isFinite(returnHours) || returnHours <= 0) return "first_visit";
  if (returnHours < 24) return "same_day";
  if (returnHours < 48) return "d1";
  if (returnHours < 168) return "d2_d6";
  return "d7_plus";
}

export function sanitizeAnalyticsProperties(
  properties: Record<string, AnalyticsValue | undefined>
): Record<string, AnalyticsValue> {
  return Object.entries(properties).reduce<Record<string, AnalyticsValue>>(
    (sanitized, [key, value]) => {
      if (value === undefined) return sanitized;
      if (typeof value === "number" && !Number.isFinite(value)) return sanitized;
      if (typeof value === "string") {
        const normalized = value.trim().slice(0, maxPropertyStringLength);
        if (normalized) sanitized[key] = normalized;
        return sanitized;
      }
      sanitized[key] = value;
      return sanitized;
    },
    {}
  );
}

export function createProductAnalyticsEvent<K extends ProductAnalyticsEventKey>(
  eventName: K,
  properties: ProductAnalyticsEventMap[K],
  sessionId: string,
  occurredAt = new Date()
): ProductAnalyticsEvent<K> {
  return {
    eventName,
    occurredAt: occurredAt.toISOString(),
    sessionId,
    properties: sanitizeAnalyticsProperties(properties),
  };
}

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getAnalyticsSessionId() {
  if (typeof window === "undefined") return "server";

  try {
    const existing = window.sessionStorage.getItem(analyticsSessionStorageKey);
    if (existing) return existing;
    const sessionId = createSessionId();
    window.sessionStorage.setItem(analyticsSessionStorageKey, sessionId);
    return sessionId;
  } catch {
    return createSessionId();
  }
}

export function trackProductEvent<K extends ProductAnalyticsEventKey>(
  eventName: K,
  properties: ProductAnalyticsEventMap[K]
) {
  if (typeof window === "undefined") return;

  const event = createProductAnalyticsEvent(
    eventName,
    properties,
    getAnalyticsSessionId()
  );
  window.dispatchEvent(new CustomEvent(productAnalyticsEventName, { detail: event }));
}

export function trackProductEventOnce<K extends ProductAnalyticsEventKey>(
  dedupeKey: string,
  eventName: K,
  properties: ProductAnalyticsEventMap[K]
) {
  if (typeof window === "undefined") return;

  try {
    const trackedKeys = new Set<string>(
      JSON.parse(window.sessionStorage.getItem(analyticsOnceStorageKey) ?? "[]")
    );
    if (trackedKeys.has(dedupeKey)) return;
    trackedKeys.add(dedupeKey);
    window.sessionStorage.setItem(analyticsOnceStorageKey, JSON.stringify([...trackedKeys]));
  } catch {
    // Storage can be unavailable in privacy modes. The event remains ephemeral.
  }

  trackProductEvent(eventName, properties);
}

export function markUsefulSession(
  destination: string,
  reason: UsefulSessionReason,
  storyId: string
) {
  trackProductEventOnce("useful-session", "useful_session", {
    destination,
    reason,
    story_id: storyId,
  });
}
