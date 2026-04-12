"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { NavBar } from "./nav-bar";
import { useTheme } from "./theme-provider";
import { brands } from "@/lib/brands";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const CONNECTOR_URL =
  "https://figma-connector.kubeprod.hearstapps.com/token-studio/tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TokenLeaf {
  type: string;
  value: string | number;
  description?: string;
}

interface TokenNode {
  [key: string]: TokenNode | TokenLeaf;
}

interface ThemeDef {
  id: string;
  name: string;
  selectedTokenSets: Record<string, "enabled" | "source">;
  group: string;
}

interface ConnectorData {
  values: Record<string, TokenNode>;
  $themes: ThemeDef[];
  version: string;
  updatedAt: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isLeaf(node: unknown): node is TokenLeaf {
  return (
    typeof node === "object" &&
    node !== null &&
    "type" in node &&
    "value" in node
  );
}

function collectLeaves(
  node: TokenNode,
  prefix = ""
): { path: string; token: TokenLeaf }[] {
  const results: { path: string; token: TokenLeaf }[] = [];
  for (const [key, child] of Object.entries(node)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (isLeaf(child)) {
      results.push({ path, token: child as TokenLeaf });
    } else if (typeof child === "object" && child !== null) {
      results.push(...collectLeaves(child as TokenNode, path));
    }
  }
  return results;
}

function getTopCategories(node: TokenNode): string[] {
  return Object.keys(node).filter((k) => !k.startsWith("$"));
}

function countByType(
  leaves: { path: string; token: TokenLeaf }[]
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const { token } of leaves) {
    counts[token.type] = (counts[token.type] || 0) + 1;
  }
  return counts;
}

function resolveReference(value: string): string {
  const match = value.match(/^\{(.+)\}$/);
  return match ? match[1] : value;
}

function isColor(value: string): boolean {
  return /^#[0-9a-f]{3,8}$/i.test(String(value));
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="p-4 rounded-xl border bg-card">
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-sm font-medium text-muted-foreground mt-1">{label}</p>
      {sub && (
        <p className="text-xs text-muted-foreground/70 mt-0.5">{sub}</p>
      )}
    </div>
  );
}

function ColorSwatch({
  color,
  name,
  small,
}: {
  color: string;
  name: string;
  small?: boolean;
}) {
  const size = small ? "w-6 h-6" : "w-10 h-10";
  return (
    <div className="flex items-center gap-2 group" title={name}>
      <div
        className={`${size} rounded-md border shadow-sm shrink-0 transition-transform group-hover:scale-110`}
        style={{ backgroundColor: color }}
      />
      {!small && (
        <div className="min-w-0">
          <p className="text-xs font-mono truncate">{name.split(".").pop()}</p>
          <p className="text-[10px] text-muted-foreground font-mono">
            {color}
          </p>
        </div>
      )}
    </div>
  );
}

function TokenTypeChart({ counts }: { counts: Record<string, number> }) {
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] || 1;

  const typeColors: Record<string, string> = {
    color: "#3b82f6",
    typography: "#8b5cf6",
    number: "#10b981",
    fontSizes: "#f59e0b",
    fontFamilies: "#ec4899",
    fontWeights: "#6366f1",
    lineHeights: "#14b8a6",
    letterSpacing: "#f97316",
    dimension: "#06b6d4",
    other: "#64748b",
    textCase: "#a855f7",
  };

  return (
    <div className="space-y-2">
      {sorted.map(([type, count]) => (
        <div key={type} className="flex items-center gap-3">
          <span className="text-xs font-mono w-28 text-right shrink-0 text-muted-foreground">
            {type}
          </span>
          <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(count / max) * 100}%`,
                backgroundColor: typeColors[type] || "#64748b",
              }}
            />
          </div>
          <span className="text-xs font-mono w-10 text-muted-foreground">
            {count}
          </span>
        </div>
      ))}
    </div>
  );
}

function BrandCard({
  setName,
  node,
  isSelected,
  onSelect,
}: {
  setName: string;
  node: TokenNode;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const leaves = useMemo(() => collectLeaves(node), [node]);
  const colors = leaves.filter(
    (l) => l.token.type === "color" && isColor(String(l.token.value))
  );
  const brandName = setName.replace("Alias/", "");

  const brandColors = colors
    .filter((c) => c.path.startsWith("palette.brand"))
    .slice(0, 6);
  const fallbackColors = brandColors.length > 0 ? brandColors : colors.slice(0, 6);

  return (
    <button
      onClick={onSelect}
      className={`text-left p-4 rounded-xl border transition-all hover:shadow-md ${
        isSelected
          ? "ring-2 ring-primary border-primary bg-primary/5"
          : "hover:border-foreground/20"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm truncate">{brandName}</h3>
        <Badge variant="outline" className="text-[10px] shrink-0 ml-2">
          {leaves.length}
        </Badge>
      </div>
      <div className="flex gap-1 mb-2">
        {fallbackColors.map((c, i) => (
          <div
            key={i}
            className="w-5 h-5 rounded-sm border"
            style={{ backgroundColor: String(c.token.value) }}
          />
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground">
        {getTopCategories(node).slice(0, 4).join(" / ")}
      </p>
    </button>
  );
}

function TokenTree({
  node,
  path = "",
  depth = 0,
  searchTerm = "",
  compareSet,
  compareName,
}: {
  node: TokenNode;
  path?: string;
  depth?: number;
  searchTerm?: string;
  compareSet?: TokenNode;
  compareName?: string;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const entries = Object.entries(node).filter(([key]) => {
    if (!searchTerm) return true;
    const fullPath = path ? `${path}.${key}` : key;
    if (isLeaf(node[key])) {
      const leaf = node[key] as TokenLeaf;
      return (
        fullPath.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(leaf.value).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (leaf.type || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    const childLeaves = collectLeaves(node[key] as TokenNode, fullPath);
    return childLeaves.some(
      (l) =>
        l.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(l.token.value)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  });

  if (entries.length === 0) return null;

  return (
    <div className={depth > 0 ? "ml-4 border-l pl-3" : ""}>
      {entries.map(([key, child]) => {
        const fullPath = path ? `${path}.${key}` : key;

        if (isLeaf(child)) {
          const leaf = child as TokenLeaf;
          const valueStr = String(leaf.value);
          const isRef = valueStr.startsWith("{") && valueStr.endsWith("}");
          const showColor = leaf.type === "color" && isColor(valueStr);

          let compareValue: string | undefined;
          if (compareSet) {
            const parts = fullPath.split(".");
            let cur: TokenNode | TokenLeaf | undefined = compareSet;
            for (const p of parts) {
              if (cur && typeof cur === "object" && p in cur) {
                cur = (cur as TokenNode)[p] as TokenNode | TokenLeaf;
              } else {
                cur = undefined;
                break;
              }
            }
            if (cur && isLeaf(cur)) {
              compareValue = String((cur as TokenLeaf).value);
            }
          }

          const isDiff =
            compareValue !== undefined && compareValue !== valueStr;

          return (
            <div
              key={fullPath}
              className={`flex items-center gap-2 py-1.5 text-xs group ${
                isDiff ? "bg-amber-50 dark:bg-amber-950/20 -mx-2 px-2 rounded" : ""
              }`}
            >
              {showColor && (
                <div
                  className="w-4 h-4 rounded-sm border shrink-0"
                  style={{ backgroundColor: valueStr }}
                />
              )}
              <code className="font-mono text-foreground/80 truncate min-w-0">
                {key}
              </code>
              <Badge
                variant="outline"
                className="text-[9px] shrink-0 opacity-60"
              >
                {leaf.type}
              </Badge>
              <span className="flex-1" />
              <code
                className={`font-mono text-[11px] truncate max-w-[200px] ${
                  isRef
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-muted-foreground"
                }`}
                title={valueStr}
              >
                {isRef ? resolveReference(valueStr) : valueStr}
              </code>
              {isDiff && compareValue && (
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[9px] text-muted-foreground">
                    {compareName}:
                  </span>
                  {isColor(compareValue) && (
                    <div
                      className="w-3 h-3 rounded-sm border"
                      style={{ backgroundColor: compareValue }}
                    />
                  )}
                  <code className="font-mono text-[10px] text-amber-600 dark:text-amber-400 truncate max-w-[120px]">
                    {compareValue.startsWith("{")
                      ? resolveReference(compareValue)
                      : compareValue}
                  </code>
                </div>
              )}
            </div>
          );
        }

        const childNode = child as TokenNode;
        const childLeaves = collectLeaves(childNode, fullPath);
        const isOpen = expanded[key] ?? depth < 1;

        return (
          <div key={fullPath}>
            <button
              onClick={() =>
                setExpanded((prev) => ({ ...prev, [key]: !isOpen }))
              }
              className="flex items-center gap-1.5 py-1.5 text-xs font-medium hover:text-foreground text-foreground/70 w-full text-left"
            >
              <svg
                className={`w-3 h-3 transition-transform shrink-0 ${isOpen ? "rotate-90" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
              <span>{key}</span>
              <span className="text-[10px] text-muted-foreground font-normal">
                ({childLeaves.length})
              </span>
            </button>
            {isOpen && (
              <TokenTree
                node={childNode}
                path={fullPath}
                depth={depth + 1}
                searchTerm={searchTerm}
                compareSet={compareSet}
                compareName={compareName}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ColorPaletteGrid({
  leaves,
}: {
  leaves: { path: string; token: TokenLeaf }[];
}) {
  const colorLeaves = leaves.filter(
    (l) => l.token.type === "color" && isColor(String(l.token.value))
  );

  const groups: Record<string, { path: string; token: TokenLeaf }[]> = {};
  for (const leaf of colorLeaves) {
    const parts = leaf.path.split(".");
    const group = parts.length > 1 ? parts.slice(0, 2).join(".") : parts[0];
    if (!groups[group]) groups[group] = [];
    groups[group].push(leaf);
  }

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([group, items]) => (
        <div key={group}>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {group}
          </h4>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <ColorSwatch
                key={item.path}
                color={String(item.token.value)}
                name={item.path}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TypographyPreview({
  leaves,
}: {
  leaves: { path: string; token: TokenLeaf }[];
}) {
  const fontFamilies = leaves.filter(
    (l) => l.token.type === "fontFamilies" || l.path.includes("fontFamily")
  );
  const fontSizes = leaves.filter(
    (l) => l.token.type === "fontSizes" || l.path.includes("fontSize")
  );
  const fontWeights = leaves.filter(
    (l) => l.token.type === "fontWeights" || l.path.includes("fontWeight")
  );

  return (
    <div className="space-y-6">
      {fontFamilies.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Font Families
          </h4>
          <div className="grid gap-3">
            {fontFamilies.map((f) => (
              <div
                key={f.path}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div>
                  <p className="text-xs font-mono text-muted-foreground">
                    {f.path}
                  </p>
                  <p
                    className="text-lg mt-1"
                    style={{
                      fontFamily: `${resolveReference(String(f.token.value))}, system-ui`,
                    }}
                  >
                    The quick brown fox jumps
                  </p>
                </div>
                <code className="text-xs font-mono text-muted-foreground shrink-0 ml-4">
                  {String(f.token.value)}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}

      {fontSizes.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Font Sizes
          </h4>
          <div className="grid gap-2">
            {fontSizes.slice(0, 12).map((f) => (
              <div
                key={f.path}
                className="flex items-center gap-3 py-1"
              >
                <code className="text-[10px] font-mono text-muted-foreground w-40 shrink-0 truncate">
                  {f.path.split(".").pop()}
                </code>
                <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/30 rounded-full"
                    style={{
                      width: `${Math.min(100, (parseFloat(String(f.token.value)) / 64) * 100)}%`,
                    }}
                  />
                </div>
                <code className="text-xs font-mono w-16 text-right shrink-0">
                  {String(f.token.value)}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}

      {fontWeights.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Font Weights
          </h4>
          <div className="flex flex-wrap gap-3">
            {fontWeights.map((f) => (
              <div key={f.path} className="p-3 rounded-lg border text-center">
                <p
                  className="text-lg"
                  style={{
                    fontWeight: Number(f.token.value) || 400,
                  }}
                >
                  Aa
                </p>
                <p className="text-[10px] font-mono text-muted-foreground mt-1">
                  {String(f.token.value)}
                </p>
                <p className="text-[9px] text-muted-foreground/60">
                  {f.path.split(".").pop()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BrandComparisonTable({
  data,
  tokenPath,
}: {
  data: ConnectorData;
  tokenPath: string;
}) {
  const aliasKeys = Object.keys(data.values).filter((k) =>
    k.startsWith("Alias/")
  );

  const rows: { brand: string; value: string; isRef: boolean }[] = [];
  for (const key of aliasKeys) {
    const brandName = key.replace("Alias/", "");
    const parts = tokenPath.split(".");
    let cur: TokenNode | TokenLeaf | undefined = data.values[key];
    for (const p of parts) {
      if (cur && typeof cur === "object" && p in cur) {
        cur = (cur as TokenNode)[p] as TokenNode | TokenLeaf;
      } else {
        cur = undefined;
        break;
      }
    }
    if (cur && isLeaf(cur)) {
      const val = String((cur as TokenLeaf).value);
      rows.push({
        brand: brandName,
        value: val,
        isRef: val.startsWith("{"),
      });
    }
  }

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Token not found across brands.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 pr-4 font-medium text-muted-foreground">
              Brand
            </th>
            <th className="text-left py-2 pr-4 font-medium text-muted-foreground">
              Value
            </th>
            <th className="text-left py-2 font-medium text-muted-foreground">
              Preview
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.brand} className="border-b last:border-0">
              <td className="py-2 pr-4 font-medium">{r.brand}</td>
              <td className="py-2 pr-4">
                <code
                  className={`font-mono ${
                    r.isRef
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {r.isRef ? resolveReference(r.value) : r.value}
                </code>
              </td>
              <td className="py-2">
                {isColor(r.value) && (
                  <div
                    className="w-6 h-6 rounded-sm border"
                    style={{ backgroundColor: r.value }}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Dashboard
// ---------------------------------------------------------------------------

export function TokenDashboard() {
  const { brand } = useTheme();
  const [data, setData] = useState<ConnectorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSet, setSelectedSet] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [compareSet, setCompareSet] = useState<string>("");
  const [comparisonToken, setComparisonToken] = useState(
    "palette.brand.primary"
  );

  useEffect(() => {
    fetch(CONNECTOR_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: ConnectorData) => {
        setData(json);
        const matchingAlias = `Alias/${brand.name}`;
        const initialSet = Object.keys(json.values).includes(matchingAlias)
          ? matchingAlias
          : Object.keys(json.values).find((k) => k.startsWith("Alias/")) || "";
        setSelectedSet(initialSet);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [brand.name]);

  const setNames = useMemo(
    () => (data ? Object.keys(data.values) : []),
    [data]
  );
  const aliasNames = useMemo(
    () => setNames.filter((k) => k.startsWith("Alias/")),
    [setNames]
  );
  const primitiveKey = useMemo(
    () => setNames.find((k) => k.startsWith("Primitives/")) || "",
    [setNames]
  );

  const selectedNode = data?.values[selectedSet];
  const selectedLeaves = useMemo(
    () => (selectedNode ? collectLeaves(selectedNode) : []),
    [selectedNode]
  );
  const typeCounts = useMemo(
    () => countByType(selectedLeaves),
    [selectedLeaves]
  );

  const totalTokens = useMemo(() => {
    if (!data) return 0;
    let count = 0;
    for (const node of Object.values(data.values)) {
      count += collectLeaves(node).length;
    }
    return count;
  }, [data]);

  const handleBrandSelect = useCallback(
    (setName: string) => {
      setSelectedSet(setName);
      setCompareSet("");
    },
    []
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <main className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">
              Loading tokens from Figma Connector...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <main className="max-w-7xl mx-auto px-6 py-20">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-destructive">
                Failed to load tokens
              </CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Could not reach{" "}
                <code className="text-xs">{CONNECTOR_URL}</code>
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold tracking-tight">
                Token Dashboard
              </h1>
              <Badge variant="outline" className="text-xs">
                v{data.version}
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-xl">
              Live view of all design tokens from the Figma Connector. Explore
              primitives, aliases, and brand overrides across {aliasNames.length}{" "}
              brands.
            </p>
          </div>
          <div className="text-xs text-muted-foreground text-right">
            <p>
              Updated{" "}
              {new Date(data.updatedAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
            <p className="font-mono mt-0.5">
              {CONNECTOR_URL.replace("https://", "")}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Tokens"
            value={totalTokens.toLocaleString()}
            sub="Across all sets"
          />
          <StatCard
            label="Brand Aliases"
            value={aliasNames.length}
            sub="Including White Label"
          />
          <StatCard
            label="Themes"
            value={data.$themes.length}
            sub={`${data.$themes.filter((t) => t.group === "Primitives").length} primitive + ${data.$themes.filter((t) => t.group === "Alias").length} alias`}
          />
          <StatCard
            label="Current Set"
            value={selectedLeaves.length}
            sub={selectedSet.replace("Alias/", "").replace("Primitives/", "")}
          />
        </div>

        <Tabs defaultValue="explorer" className="space-y-6">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="explorer">Token Explorer</TabsTrigger>
            <TabsTrigger value="colors">Color Palette</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="brands">Brand Overview</TabsTrigger>
            <TabsTrigger value="compare">Cross-Brand Compare</TabsTrigger>
            <TabsTrigger value="primitives">Primitives</TabsTrigger>
          </TabsList>

          {/* ---- Token Explorer ---- */}
          <TabsContent value="explorer" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Set selector */}
              <div className="md:w-64 shrink-0 space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                    Token Set
                  </label>
                  <select
                    value={selectedSet}
                    onChange={(e) => handleBrandSelect(e.target.value)}
                    className="w-full text-sm border rounded-lg px-3 py-2 bg-background"
                  >
                    <optgroup label="Primitives">
                      {setNames
                        .filter((k) => k.startsWith("Primitives/"))
                        .map((k) => (
                          <option key={k} value={k}>
                            {k}
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Aliases (Brands)">
                      {aliasNames.map((k) => (
                        <option key={k} value={k}>
                          {k.replace("Alias/", "")}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                    Compare with
                  </label>
                  <select
                    value={compareSet}
                    onChange={(e) => setCompareSet(e.target.value)}
                    className="w-full text-sm border rounded-lg px-3 py-2 bg-background"
                  >
                    <option value="">None</option>
                    {aliasNames
                      .filter((k) => k !== selectedSet)
                      .map((k) => (
                        <option key={k} value={k}>
                          {k.replace("Alias/", "")}
                        </option>
                      ))}
                  </select>
                </div>

                <Separator />

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Token Types
                  </p>
                  <TokenTypeChart counts={typeCounts} />
                </div>
              </div>

              {/* Tree view */}
              <Card className="flex-1 min-w-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-base">
                      {selectedSet.replace("Alias/", "").replace("Primitives/", "")}
                      <span className="text-muted-foreground font-normal ml-2">
                        ({selectedLeaves.length} tokens)
                      </span>
                    </CardTitle>
                    <input
                      type="text"
                      placeholder="Search tokens..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="text-sm border rounded-lg px-3 py-1.5 bg-background w-48 md:w-64"
                    />
                  </div>
                  {compareSet && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      Highlighting differences with{" "}
                      {compareSet.replace("Alias/", "")}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="max-h-[600px] overflow-y-auto">
                  {selectedNode && (
                    <TokenTree
                      node={selectedNode}
                      searchTerm={searchTerm}
                      compareSet={
                        compareSet ? data.values[compareSet] : undefined
                      }
                      compareName={compareSet.replace("Alias/", "")}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ---- Color Palette ---- */}
          <TabsContent value="colors">
            <Card>
              <CardHeader>
                <CardTitle>
                  Color Palette —{" "}
                  {selectedSet.replace("Alias/", "").replace("Primitives/", "")}
                </CardTitle>
                <CardDescription>
                  All color tokens with visual swatches, grouped by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ColorPaletteGrid leaves={selectedLeaves} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---- Typography ---- */}
          <TabsContent value="typography">
            <Card>
              <CardHeader>
                <CardTitle>
                  Typography —{" "}
                  {selectedSet.replace("Alias/", "").replace("Primitives/", "")}
                </CardTitle>
                <CardDescription>
                  Font families, sizes, and weights defined in this token set
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TypographyPreview leaves={selectedLeaves} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---- Brand Overview ---- */}
          <TabsContent value="brands">
            <div>
              <h2 className="text-lg font-semibold mb-4">
                All Brand Token Sets
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {aliasNames.map((name) => (
                  <BrandCard
                    key={name}
                    setName={name}
                    node={data.values[name]}
                    isSelected={name === selectedSet}
                    onSelect={() => handleBrandSelect(name)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ---- Cross-Brand Compare ---- */}
          <TabsContent value="compare" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cross-Brand Token Comparison</CardTitle>
                <CardDescription>
                  See how a specific token resolves across all brands
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-medium text-muted-foreground shrink-0">
                    Token path:
                  </label>
                  <input
                    type="text"
                    value={comparisonToken}
                    onChange={(e) => setComparisonToken(e.target.value)}
                    placeholder="e.g. palette.brand.primary"
                    className="flex-1 text-sm border rounded-lg px-3 py-2 bg-background font-mono"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "palette.brand.primary",
                    "palette.neutral.100",
                    "palette.content.default",
                    "palette.background.page",
                    "font.family.default",
                    "component.button.background-primary-solid-default",
                  ].map((path) => (
                    <button
                      key={path}
                      onClick={() => setComparisonToken(path)}
                      className={`text-[10px] font-mono px-2 py-1 rounded-md border transition-colors ${
                        comparisonToken === path
                          ? "bg-primary/10 border-primary text-primary"
                          : "hover:bg-muted"
                      }`}
                    >
                      {path}
                    </button>
                  ))}
                </div>
                <Separator />
                <BrandComparisonTable
                  data={data}
                  tokenPath={comparisonToken}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---- Primitives ---- */}
          <TabsContent value="primitives">
            {primitiveKey && data.values[primitiveKey] && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Primitives — {primitiveKey.replace("Primitives/", "")}
                  </CardTitle>
                  <CardDescription>
                    Base-level raw values that aliases reference. These are the
                    canonical scales (colors, sizes, fonts) shared across all
                    brands.
                  </CardDescription>
                </CardHeader>
                <CardContent className="max-h-[600px] overflow-y-auto">
                  <TokenTree
                    node={data.values[primitiveKey]}
                    searchTerm={searchTerm}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <footer className="text-center text-sm text-muted-foreground py-8 space-y-2">
          <p>
            Data source:{" "}
            <a
              href={CONNECTOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-mono text-xs"
            >
              figma-connector.kubeprod.hearstapps.com
            </a>
          </p>
          <Link href="/tokens" className="hover:underline">
            ← Back to Token Mapping
          </Link>
        </footer>
      </main>
    </div>
  );
}
