const CONNECTOR_URL =
  "https://figma-connector.kubeprod.hearstapps.com/token-studio/tokens";

export interface TokenLeaf {
  type: string;
  value: string | number;
  description?: string;
}

export interface TokenNode {
  [key: string]: TokenNode | TokenLeaf;
}

export interface ThemeDef {
  id: string;
  name: string;
  selectedTokenSets: Record<string, "enabled" | "source">;
  group: string;
}

export interface ConnectorData {
  values: Record<string, TokenNode>;
  $themes: ThemeDef[];
  version: string;
  updatedAt: number;
}

export interface FlatToken {
  path: string;
  token: TokenLeaf;
}

let cache: { data: ConnectorData; ts: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

export async function fetchTokens(): Promise<ConnectorData> {
  if (cache && Date.now() - cache.ts < CACHE_TTL) return cache.data;
  const res = await fetch(CONNECTOR_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data: ConnectorData = await res.json();
  cache = { data, ts: Date.now() };
  return data;
}

export function isLeaf(node: unknown): node is TokenLeaf {
  return (
    typeof node === "object" &&
    node !== null &&
    "type" in node &&
    "value" in node
  );
}

export function flattenTokens(node: TokenNode, prefix = ""): FlatToken[] {
  const out: FlatToken[] = [];
  for (const [key, child] of Object.entries(node)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (isLeaf(child)) {
      out.push({ path, token: child as TokenLeaf });
    } else if (typeof child === "object" && child !== null) {
      out.push(...flattenTokens(child as TokenNode, path));
    }
  }
  return out;
}

export function countByType(tokens: FlatToken[]): Record<string, number> {
  const m: Record<string, number> = {};
  for (const { token } of tokens) m[token.type] = (m[token.type] || 0) + 1;
  return m;
}

export function isColor(v: string): boolean {
  return /^#[0-9a-f]{3,8}$/i.test(v);
}

export function deref(v: string): string {
  const m = v.match(/^\{(.+)\}$/);
  return m ? m[1] : v;
}

export function isRef(v: string): boolean {
  return v.startsWith("{") && v.endsWith("}");
}

export function resolveAtPath(
  node: TokenNode,
  path: string
): TokenLeaf | undefined {
  const parts = path.split(".");
  let cur: TokenNode | TokenLeaf | undefined = node;
  for (const p of parts) {
    if (cur && typeof cur === "object" && !isLeaf(cur) && p in cur) {
      cur = (cur as TokenNode)[p] as TokenNode | TokenLeaf;
    } else {
      return undefined;
    }
  }
  return isLeaf(cur) ? (cur as TokenLeaf) : undefined;
}

export function aliasKeys(data: ConnectorData): string[] {
  return Object.keys(data.values).filter((k) => k.startsWith("Alias/"));
}

export function brandName(setKey: string): string {
  return setKey.replace("Alias/", "").replace("Primitives/", "");
}

export function totalTokenCount(data: ConnectorData): number {
  let n = 0;
  for (const node of Object.values(data.values)) n += flattenTokens(node).length;
  return n;
}
