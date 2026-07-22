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
        border: "1px solid #c7d9ea",
        borderRadius: "10px",
        background: "#f4f8fc",
        color: "#102a43",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
        <strong style={{ fontSize: "13px" }}>Hearst+ specification</strong>
        <span style={{ color: "#5f6b7a", fontSize: "13px" }}>Owner: {owner}</span>
      </div>
      <p style={{ margin: 0, maxWidth: "72ch", fontSize: "13px", lineHeight: 1.6 }}>
        {children ?? "This page documents the Hearst Design System foundation as it is consumed by the Hearst+ reader product."}
      </p>
      <p style={{ margin: "8px 0 0", color: "#5f6b7a", fontSize: "12px" }}>
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
    <div style={{ margin: "20px 0", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #c7d9ea", textAlign: "left" }}>
            <th style={{ padding: "10px 12px" }}>Area</th>
            <th style={{ padding: "10px 12px" }}>Hearst+ implementation</th>
            <th style={{ padding: "10px 12px" }}>Evidence</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} style={{ borderBottom: "1px solid #dce7f1" }}>
              <th style={{ padding: "11px 12px", textAlign: "left", verticalAlign: "top" }}>{row.label}</th>
              <td style={{ padding: "11px 12px", verticalAlign: "top" }}>{row.value}</td>
              <td style={{ padding: "11px 12px", color: "#5f6b7a", verticalAlign: "top" }}>{row.evidence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
