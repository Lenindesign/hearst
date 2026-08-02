export type TokenLeaf = {
  type?: string;
  value: unknown;
};

export type FlatToken = TokenLeaf & {
  path: string;
  canonicalName: string;
  source: string;
};

export type BrandTokenMap = Record<string, TokenLeaf>;

export type RelationshipChain = {
  id: string;
  core?: FlatToken;
  semantic: FlatToken;
  component: FlatToken;
  brand?: FlatToken;
};

const TOKEN_REFERENCE = /^\{([^}]+)\}$/;

export function canonicalizeTokenPath(path: string) {
  return path.replace(/^_/, "").replaceAll(".", "-");
}

export function tokenReference(value: unknown) {
  if (typeof value !== "string") return undefined;
  return value.match(TOKEN_REFERENCE)?.[1];
}

export function flattenTokenTree(
  tree: unknown,
  source: string,
  prefix: string[] = []
): FlatToken[] {
  if (!tree || typeof tree !== "object" || Array.isArray(tree)) return [];

  const record = tree as Record<string, unknown>;
  if ("value" in record) {
    const path = prefix.join(".");
    return [
      {
        path,
        canonicalName: canonicalizeTokenPath(path),
        source,
        type: typeof record.type === "string" ? record.type : undefined,
        value: record.value,
      },
    ];
  }

  return Object.entries(record).flatMap(([key, value]) =>
    key.startsWith("_") && key !== "_palette"
      ? []
      : flattenTokenTree(value, source, [...prefix, key])
  );
}

function resolveCoreToken(
  start: FlatToken,
  semanticByPath: Map<string, FlatToken>,
  coreByPath: Map<string, FlatToken>
) {
  let current = start;
  const visited = new Set<string>();

  while (!visited.has(current.path)) {
    visited.add(current.path);
    const reference = tokenReference(current.value);
    if (!reference) return undefined;

    const normalizedReference = reference.replace(/^_/, "");
    const core = coreByPath.get(normalizedReference);
    if (core) return core;

    const next = semanticByPath.get(reference) ?? semanticByPath.get(normalizedReference);
    if (!next) return undefined;
    current = next;
  }

  return undefined;
}

export function buildRelationshipChains({
  coreTokens,
  semanticTokens,
  componentTokens,
  brandTokens,
  brandSource,
}: {
  coreTokens: FlatToken[];
  semanticTokens: FlatToken[];
  componentTokens: FlatToken[];
  brandTokens: BrandTokenMap;
  brandSource: string;
}) {
  const coreByPath = new Map(coreTokens.map((token) => [token.path, token]));
  const semanticByPath = new Map(semanticTokens.map((token) => [token.path, token]));

  return componentTokens.flatMap<RelationshipChain>((component) => {
    const reference = tokenReference(component.value);
    if (!reference) return [];

    const semantic = semanticByPath.get(reference.replace(/^_/, ""));
    if (!semantic) return [];

    const resolved = brandTokens[component.canonicalName];
    const brand = resolved
      ? {
          ...resolved,
          path: component.canonicalName,
          canonicalName: component.canonicalName,
          source: brandSource,
        }
      : undefined;

    return [
      {
        id: component.canonicalName,
        core: resolveCoreToken(semantic, semanticByPath, coreByPath),
        semantic,
        component,
        brand,
      },
    ];
  });
}
