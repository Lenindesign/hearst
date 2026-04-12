import { useState, useMemo } from "react";
import {
  type ConnectorData,
  type TokenNode,
  type TokenLeaf,
  aliasKeys,
  brandName,
  flattenTokens,
  isLeaf,
  isColor,
  isRef,
  deref,
  resolveAtPath,
} from "../lib/tokens";

interface Props {
  data: ConnectorData;
  selectedSet: string;
}

function TreeNode({
  nodeKey,
  node,
  path,
  depth,
  search,
  compareNode,
  compareName,
}: {
  nodeKey: string;
  node: TokenNode | TokenLeaf;
  path: string;
  depth: number;
  search: string;
  compareNode?: TokenNode;
  compareName?: string;
}) {
  const [open, setOpen] = useState(depth < 1);

  if (isLeaf(node)) {
    const leaf = node as TokenLeaf;
    const val = String(leaf.value);
    const color = leaf.type === "color" && isColor(val);
    const ref = isRef(val);

    let cmpVal: string | undefined;
    if (compareNode) {
      const resolved = resolveAtPath(compareNode, path);
      if (resolved) cmpVal = String(resolved.value);
    }
    const differs = cmpVal !== undefined && cmpVal !== val;

    return (
      <div
        className={`flex items-center gap-3 py-2 px-3 -mx-3 rounded-lg group ${
          differs ? "bg-diff-light" : "hover:bg-gray-50"
        }`}
      >
        {color && (
          <div
            className="w-4 h-4 rounded-[3px] border border-gray-200 shrink-0"
            style={{ backgroundColor: val }}
          />
        )}
        <span className="text-[13px] font-mono text-ink truncate min-w-0">
          {nodeKey}
        </span>
        <span className="text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 shrink-0">
          {leaf.type}
        </span>
        <span className="flex-1" />
        <code
          className={`text-[12px] font-mono truncate max-w-[220px] ${
            ref ? "text-accent" : "text-gray-500"
          }`}
          title={val}
        >
          {ref ? deref(val) : val}
        </code>
        {differs && cmpVal && (
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <span className="text-[10px] text-gray-400">{compareName}:</span>
            {isColor(cmpVal) && (
              <div
                className="w-3 h-3 rounded-sm border border-gray-200"
                style={{ backgroundColor: cmpVal }}
              />
            )}
            <code className="text-[11px] font-mono text-diff truncate max-w-[120px]">
              {isRef(cmpVal) ? deref(cmpVal) : cmpVal}
            </code>
          </div>
        )}
      </div>
    );
  }

  const childNode = node as TokenNode;
  const childCount = flattenTokens(childNode).length;

  if (search) {
    const leaves = flattenTokens(childNode, path);
    const matches = leaves.some(
      (l) =>
        l.path.toLowerCase().includes(search) ||
        String(l.token.value).toLowerCase().includes(search)
    );
    if (!matches) return null;
  }

  return (
    <div className={depth > 0 ? "ml-5 border-l border-gray-100 pl-4" : ""}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 py-2 w-full text-left group"
      >
        <svg
          className={`w-3 h-3 text-gray-400 transition-transform ${open ? "rotate-90" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
        <span className="text-[13px] font-semibold text-ink">{nodeKey}</span>
        <span className="text-[11px] text-gray-400 tabular-nums">
          {childCount}
        </span>
      </button>
      {open && (
        <div>
          {Object.entries(childNode)
            .filter(([key]) => {
              if (!search) return true;
              const childPath = path ? `${path}.${key}` : key;
              if (isLeaf(childNode[key])) {
                const leaf = childNode[key] as TokenLeaf;
                return (
                  childPath.toLowerCase().includes(search) ||
                  String(leaf.value).toLowerCase().includes(search)
                );
              }
              return flattenTokens(childNode[key] as TokenNode, childPath).some(
                (l) =>
                  l.path.toLowerCase().includes(search) ||
                  String(l.token.value).toLowerCase().includes(search)
              );
            })
            .map(([key, child]) => (
              <TreeNode
                key={key}
                nodeKey={key}
                node={child as TokenNode | TokenLeaf}
                path={path ? `${path}.${key}` : key}
                depth={depth + 1}
                search={search}
                compareNode={compareNode}
                compareName={compareName}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export function Explorer({ data, selectedSet }: Props) {
  const [search, setSearch] = useState("");
  const [compareKey, setCompareKey] = useState("");
  const brands = aliasKeys(data);
  const node = data.values[selectedSet];
  const leaves = useMemo(() => (node ? flattenTokens(node) : []), [node]);
  const lowerSearch = search.toLowerCase();

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter">
          Explorer
        </h1>
        <p className="text-gray-400 mt-2">
          {brandName(selectedSet)} — {leaves.length} tokens
        </p>
      </section>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search tokens..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-[13px] border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent placeholder:text-gray-300"
          />
        </div>
        <select
          value={compareKey}
          onChange={(e) => setCompareKey(e.target.value)}
          className="text-[13px] border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
        >
          <option value="">Compare with...</option>
          {brands
            .filter((k) => k !== selectedSet)
            .map((k) => (
              <option key={k} value={k}>
                {brandName(k)}
              </option>
            ))}
        </select>
      </div>

      {compareKey && (
        <p className="text-xs text-diff">
          Highlighting differences with {brandName(compareKey)}
        </p>
      )}

      {/* Tree */}
      <div className="border border-gray-200 rounded-xl p-5 max-h-[70vh] overflow-y-auto">
        {node &&
          Object.entries(node).map(([key, child]) => (
            <TreeNode
              key={key}
              nodeKey={key}
              node={child as TokenNode | TokenLeaf}
              path={key}
              depth={0}
              search={lowerSearch}
              compareNode={compareKey ? data.values[compareKey] : undefined}
              compareName={compareKey ? brandName(compareKey) : undefined}
            />
          ))}
      </div>
    </div>
  );
}
