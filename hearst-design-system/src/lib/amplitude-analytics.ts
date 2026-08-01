import type { ProductAnalyticsEvent } from "./product-analytics";

const amplitudeDeviceStorageKey = "hearst-amplitude-device-id-v1";
const amplitudeDefaultEndpoint = "https://api2.amplitude.com/2/httpapi";
const amplitudeEuEndpoint = "https://api.eu.amplitude.com/2/httpapi";

type StorageLike = Pick<Storage, "getItem" | "setItem">;

export interface AmplitudeHttpEvent {
  device_id: string;
  event_type: string;
  time: number;
  insert_id: string;
  event_properties: Record<string, string | number | boolean>;
}

export interface AmplitudeHttpPayload {
  api_key: string;
  events: AmplitudeHttpEvent[];
}

export function isAmplitudeAnalyticsEnabled(env = process.env) {
  return (
    env.NEXT_PUBLIC_HEARST_ANALYTICS_ENABLED === "true" &&
    env.NEXT_PUBLIC_HEARST_ANALYTICS_PROVIDER === "amplitude" &&
    Boolean(env.NEXT_PUBLIC_AMPLITUDE_API_KEY)
  );
}

export function getAmplitudeEndpoint(region = process.env.NEXT_PUBLIC_AMPLITUDE_REGION) {
  return region?.toLowerCase() === "eu" ? amplitudeEuEndpoint : amplitudeDefaultEndpoint;
}

export function createAnonymousAmplitudeDeviceId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `hearst-${crypto.randomUUID()}`;
  }

  return `hearst-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export function getOrCreateAmplitudeDeviceId(storage?: StorageLike) {
  try {
    const existing = storage?.getItem(amplitudeDeviceStorageKey);
    if (existing && existing.length >= 5) return existing;

    const deviceId = createAnonymousAmplitudeDeviceId();
    storage?.setItem(amplitudeDeviceStorageKey, deviceId);
    return deviceId;
  } catch {
    return createAnonymousAmplitudeDeviceId();
  }
}

export function createAmplitudeHttpEvent(
  event: ProductAnalyticsEvent,
  deviceId: string
): AmplitudeHttpEvent {
  const eventTime = Date.parse(event.occurredAt);
  const time = Number.isFinite(eventTime) ? eventTime : Date.now();

  return {
    device_id: deviceId,
    event_type: `hearst.${event.eventName}`,
    time,
    insert_id: `${event.sessionId}:${event.eventName}:${event.occurredAt}`,
    event_properties: {
      ...event.properties,
      hearst_event_name: event.eventName,
      hearst_session_id: event.sessionId,
    },
  };
}

export function createAmplitudeHttpPayload(
  apiKey: string,
  event: ProductAnalyticsEvent,
  deviceId: string
): AmplitudeHttpPayload {
  return {
    api_key: apiKey,
    events: [createAmplitudeHttpEvent(event, deviceId)],
  };
}
