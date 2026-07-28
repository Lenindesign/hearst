import React from "react";

type HearstPlusDocScopeProps = {
  owner: "Product" | "Design" | "Engineering" | "Cross-functional";
  source: string;
  children?: React.ReactNode;
};

export function HearstPlusDocScope({ owner, source, children }: HearstPlusDocScopeProps) {
  return (
    <aside
      style={{
        margin: "20px 0 32px",
        padding: "16px 18px",
        border: "1px solid #c9c9c4",
        borderRadius: 0,
        background: "#f2f2ef",
        color: "#111111",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
        <strong style={{ fontSize: "13px" }}>Hearst+ specification</strong>
        <span style={{ color: "#57534e", fontSize: "13px" }}>Owner: {owner}</span>
      </div>
      <div style={{ margin: 0, maxWidth: "72ch", fontSize: "13px", lineHeight: 1.6 }}>
        {children ?? "This page documents the Hearst Design System foundation as it is consumed by the Hearst+ reader product."}
      </div>
      <p style={{ margin: "8px 0 0", color: "#57534e", fontSize: "12px" }}>
        Source of truth: <code>{source}</code>
      </p>
    </aside>
  );
}

export function SpecTable({
  rows,
}: {
  rows: Array<{ label: string; value: React.ReactNode; evidence: React.ReactNode }>;
}) {
  return (
    <div style={{ margin: "20px 0", maxWidth: "100%", minWidth: 0, overflowX: "auto" }}>
      <table style={{ width: "100%", minWidth: "640px", borderCollapse: "collapse", fontSize: "14px" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #d6d3d1", textAlign: "left" }}>
            <th style={{ padding: "10px 12px" }}>Area</th>
            <th style={{ padding: "10px 12px" }}>Hearst+ implementation</th>
            <th style={{ padding: "10px 12px" }}>Evidence</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} style={{ borderBottom: "1px solid #e7e5e4" }}>
              <th style={{ padding: "11px 12px", textAlign: "left", verticalAlign: "top" }}>{row.label}</th>
              <td style={{ padding: "11px 12px", verticalAlign: "top" }}>{row.value}</td>
              <td style={{ padding: "11px 12px", color: "#57534e", verticalAlign: "top" }}>{row.evidence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type StorybookIndexEntry = {
  type: "story" | "docs";
  title: string;
};

export function StorybookCatalogStatus() {
  const [entries, setEntries] = React.useState<StorybookIndexEntry[] | null>(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let active = true;

    fetch("./index.json")
      .then((response) => {
        if (!response.ok) throw new Error(`Storybook index returned ${response.status}`);
        return response.json() as Promise<{ entries?: Record<string, StorybookIndexEntry> }>;
      })
      .then((index) => {
        if (active) setEntries(Object.values(index.entries ?? {}));
      })
      .catch(() => {
        if (active) setFailed(true);
      });

    return () => {
      active = false;
    };
  }, []);

  if (failed) {
    return (
      <p role="status">
        The live Storybook index could not be read. Treat catalog counts as unavailable until
        <code> /index.json</code> loads.
      </p>
    );
  }

  if (!entries) return <p role="status">Reading the current Storybook index…</p>;

  const stories = entries.filter((entry) => entry.type === "story").length;
  const docs = entries.filter((entry) => entry.type === "docs").length;
  const titles = new Set(entries.map((entry) => entry.title)).size;

  return (
    <dl
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "1px",
        margin: "20px 0",
        background: "#d6d3d1",
        border: "1px solid #d6d3d1",
      }}
    >
      {[
        ["Stories", stories],
        ["Documentation pages", docs],
        ["Catalog groups", titles],
        ["Total index entries", entries.length],
      ].map(([label, value]) => (
        <div key={label} style={{ padding: "14px 16px", background: "#ffffff" }}>
          <dt style={{ color: "#57534e", fontSize: "12px" }}>{label}</dt>
          <dd style={{ margin: "4px 0 0", fontSize: "24px", fontWeight: 700 }}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

type StorybookBuildInfo = {
  schemaVersion: number;
  sourceRevision: string;
  buildContext: string;
  builtAt: string;
  catalog: {
    entries: number;
    stories: number;
    docs: number;
    groups: number;
  };
};

export function StorybookReleaseStatus() {
  const [buildInfo, setBuildInfo] = React.useState<StorybookBuildInfo | null>(null);
  const [failed, setFailed] = React.useState(false);
  const publishedArtifact = typeof document !== "undefined"
    && Boolean(document.querySelector<HTMLBaseElement>('base[href="/storybook/"]'));

  React.useEffect(() => {
    let active = true;
    if (!publishedArtifact) return undefined;

    fetch("./build-info.json", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`Build information returned ${response.status}`);
        return response.json() as Promise<StorybookBuildInfo>;
      })
      .then((info) => {
        if (active) setBuildInfo(info);
      })
      .catch(() => {
        if (active) setFailed(true);
      });

    return () => {
      active = false;
    };
  }, [publishedArtifact]);

  if (!publishedArtifact || failed) {
    return (
      <p role="status">
        Build provenance is unavailable in this live development preview. Verify the static
        artifact before release; a passing local preview is not publication evidence.
      </p>
    );
  }

  if (!buildInfo) return <p role="status">Reading published build provenance…</p>;

  const shortRevision = buildInfo.sourceRevision === "unknown"
    ? "unknown"
    : buildInfo.sourceRevision.slice(0, 12)
      + (buildInfo.sourceRevision.endsWith("+dirty") ? "+dirty" : "");

  return (
    <SpecTable
      rows={[
        {
          label: "Source revision",
          value: <code>{shortRevision}</code>,
          evidence: "Generated into the static artifact from the provider commit reference or local Git checkout.",
        },
        {
          label: "Build context",
          value: buildInfo.buildContext,
          evidence: <time dateTime={buildInfo.builtAt}>{new Date(buildInfo.builtAt).toLocaleString()}</time>,
        },
        {
          label: "Published catalog",
          value: `${buildInfo.catalog.stories} stories · ${buildInfo.catalog.docs} docs`,
          evidence: `${buildInfo.catalog.entries} entries across ${buildInfo.catalog.groups} groups in the built index.`,
        },
      ]}
    />
  );
}
