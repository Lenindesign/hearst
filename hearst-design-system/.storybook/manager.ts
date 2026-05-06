import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming";

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Hearst Design System",
    brandUrl: "https://www.hearst.com",
    brandImage: "https://www.hearst.com/o/hearst-theme/images/Nav_HearstLogo.svg",
    brandTarget: "_blank",
  }),
});

// #region agent log
/** Debug: runtime evidence for prod sidebar / Grid visibility (session 438f5a). */
const SB_DEBUG_INGEST =
  "http://127.0.0.1:7869/ingest/908fc3d2-a6e0-4381-89dd-35644ae2aa2c";

function sbDebugSend(payload: {
  hypothesisId: string;
  message: string;
  location: string;
  data?: Record<string, unknown>;
  runId?: string;
}) {
  fetch(SB_DEBUG_INGEST, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "438f5a",
    },
    body: JSON.stringify({
      sessionId: "438f5a",
      timestamp: Date.now(),
      ...payload,
    }),
  }).catch(() => {});
}

if (typeof window !== "undefined") {
  sbDebugSend({
    hypothesisId: "H4",
    location: "manager.ts:boot",
    message: "manager window location",
    data: {
      href: window.location.href,
      pathname: window.location.pathname,
      origin: window.location.origin,
    },
  });

  const indexCandidates = [
    "/_next/static/sb/index.json",
    "/index.json",
  ];

  void Promise.all(
    indexCandidates.map(async (path) => {
      const url = new URL(path, window.location.origin).href;
      try {
        const res = await fetch(url, { credentials: "same-origin" });
        const status = res.status;
        const ok = res.ok;
        let gridKeys: string[] = [];
        let overviewIds: string[] = [];
        let totalEntries = 0;
        let rawSnippet = "";
        if (ok) {
          const text = await res.text();
          rawSnippet = text.slice(0, 120);
          try {
            const parsed = JSON.parse(text) as {
              entries?: Record<string, { title?: string; type?: string }>;
            };
            const entries = parsed.entries ?? {};
            totalEntries = Object.keys(entries).length;
            gridKeys = Object.keys(entries).filter((k) =>
              k.includes("grid-system")
            );
            overviewIds = Object.keys(entries).filter(
              (k) =>
                entries[k]?.title?.includes("Grid System") &&
                (entries[k]?.type === "docs" || entries[k]?.type === "story")
            );
          } catch {
            rawSnippet = `non-json:${text.slice(0, 80)}`;
          }
        }
        sbDebugSend({
          hypothesisId: "H1",
          location: "manager.ts:indexFetch",
          message: "index.json probe",
          data: {
            path,
            url,
            ok,
            status,
            totalEntries,
            gridKeysCount: gridKeys.length,
            gridKeys,
            overviewIdsCount: overviewIds.length,
            rawSnippet,
          },
        });
      } catch (e) {
        sbDebugSend({
          hypothesisId: "H1",
          location: "manager.ts:indexFetchError",
          message: "index.json fetch threw",
          data: { path, url, error: String(e) },
        });
      }
    })
  );

  window.addEventListener("load", () => {
    requestAnimationFrame(() => {
      const entries = performance.getEntriesByType(
        "resource"
      ) as PerformanceResourceTiming[];
      const gridNamed = entries.filter((e) =>
        e.name.toLowerCase().includes("grid")
      );
      sbDebugSend({
        hypothesisId: "H2",
        location: "manager.ts:resourceTiming",
        message: "resource entries mentioning grid",
        data: {
          count: gridNamed.length,
          names: gridNamed.slice(0, 25).map((e) => e.name),
        },
      });

      const anySb = entries.filter(
        (e) =>
          e.name.includes("/_next/static/sb/") ||
          e.name.includes("/sb-") ||
          e.name.includes("storybook")
      );
      const failedLike = anySb.filter((e) => {
        const size = (e as PerformanceResourceTiming & { transferSize?: number })
          .transferSize;
        return size === 0 && e.duration === 0;
      });
      sbDebugSend({
        hypothesisId: "H2",
        location: "manager.ts:sbAssets",
        message: "storybook-related resource sample",
        data: {
          sbRelatedCount: anySb.length,
          sample: anySb.slice(0, 12).map((e) => e.name),
          zeroTransferCount: failedLike.length,
        },
      });
    });
  });
}
// #endregion

