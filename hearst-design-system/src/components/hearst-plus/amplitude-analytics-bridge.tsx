"use client";

import { useEffect } from "react";
import {
  createAmplitudeHttpPayload,
  getAmplitudeEndpoint,
  getOrCreateAmplitudeDeviceId,
  isAmplitudeAnalyticsEnabled,
} from "@/lib/amplitude-analytics";
import {
  productAnalyticsEventName,
  type ProductAnalyticsEvent,
} from "@/lib/product-analytics";

export function AmplitudeAnalyticsBridge() {
  useEffect(() => {
    if (!isAmplitudeAnalyticsEnabled()) return;

    const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY ?? "";
    if (!apiKey) return;

    const endpoint = getAmplitudeEndpoint();
    const deviceId = getOrCreateAmplitudeDeviceId(window.localStorage);

    function sendProductEvent(event: Event) {
      if (!(event instanceof CustomEvent)) return;

      const productEvent = event.detail as ProductAnalyticsEvent | undefined;
      if (!productEvent?.eventName || !productEvent?.occurredAt) return;

      const payload = createAmplitudeHttpPayload(apiKey, productEvent, deviceId);
      const body = JSON.stringify(payload);

      if ("sendBeacon" in navigator) {
        const sent = navigator.sendBeacon(
          endpoint,
          new Blob([body], { type: "application/json" })
        );
        if (sent) return;
      }

      void fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body,
        keepalive: true,
      }).catch(() => {
        // Analytics is intentionally non-blocking; the product should never fail because telemetry did.
      });
    }

    window.addEventListener(productAnalyticsEventName, sendProductEvent);

    return () => {
      window.removeEventListener(productAnalyticsEventName, sendProductEvent);
    };
  }, []);

  return null;
}
