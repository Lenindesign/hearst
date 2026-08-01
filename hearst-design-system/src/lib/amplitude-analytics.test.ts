import assert from "node:assert/strict";
import test from "node:test";
import {
  createAmplitudeHttpEvent,
  createAmplitudeHttpPayload,
  getAmplitudeEndpoint,
  getOrCreateAmplitudeDeviceId,
  isAmplitudeAnalyticsEnabled,
} from "./amplitude-analytics";
import { createProductAnalyticsEvent } from "./product-analytics";

test("isAmplitudeAnalyticsEnabled requires explicit provider, enable flag, and API key", () => {
  assert.equal(
    isAmplitudeAnalyticsEnabled({
      NEXT_PUBLIC_HEARST_ANALYTICS_ENABLED: "true",
      NEXT_PUBLIC_HEARST_ANALYTICS_PROVIDER: "amplitude",
      NEXT_PUBLIC_AMPLITUDE_API_KEY: "public-key",
    }),
    true
  );
  assert.equal(
    isAmplitudeAnalyticsEnabled({
      NEXT_PUBLIC_HEARST_ANALYTICS_ENABLED: "true",
      NEXT_PUBLIC_HEARST_ANALYTICS_PROVIDER: "console",
      NEXT_PUBLIC_AMPLITUDE_API_KEY: "public-key",
    }),
    false
  );
});

test("getAmplitudeEndpoint supports default and EU residency endpoints", () => {
  assert.equal(getAmplitudeEndpoint(), "https://api2.amplitude.com/2/httpapi");
  assert.equal(getAmplitudeEndpoint("eu"), "https://api.eu.amplitude.com/2/httpapi");
});

test("getOrCreateAmplitudeDeviceId reuses stored anonymous device IDs", () => {
  const values = new Map<string, string>([["hearst-amplitude-device-id-v1", "hearst-device-123"]]);
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };

  assert.equal(getOrCreateAmplitudeDeviceId(storage), "hearst-device-123");
});

test("createAmplitudeHttpEvent maps vendor-neutral events to Amplitude HTTP V2 fields", () => {
  const event = createProductAnalyticsEvent(
    "story_save_toggle",
    {
      destination: "all",
      story_id: "story-123",
      state: "saved",
      surface: "reader",
    },
    "session-123",
    new Date("2026-07-31T14:00:00.000Z")
  );

  assert.deepEqual(createAmplitudeHttpEvent(event, "hearst-device-123"), {
    device_id: "hearst-device-123",
    event_type: "hearst.story_save_toggle",
    time: 1785506400000,
    insert_id: "session-123:story_save_toggle:2026-07-31T14:00:00.000Z",
    event_properties: {
      destination: "all",
      story_id: "story-123",
      state: "saved",
      surface: "reader",
      hearst_event_name: "story_save_toggle",
      hearst_session_id: "session-123",
    },
  });
});

test("createAmplitudeHttpPayload creates a one-event ingestion batch", () => {
  const event = createProductAnalyticsEvent(
    "more_like_this",
    {
      destination: "all",
      story_id: "story-456",
      surface: "reader",
    },
    "session-456",
    new Date("2026-07-31T15:00:00.000Z")
  );

  const payload = createAmplitudeHttpPayload("public-key", event, "hearst-device-456");

  assert.equal(payload.api_key, "public-key");
  assert.equal(payload.events.length, 1);
  assert.equal(payload.events[0]?.event_type, "hearst.more_like_this");
});
