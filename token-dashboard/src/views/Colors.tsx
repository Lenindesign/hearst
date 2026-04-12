import { useMemo, useState } from "react";
import {
  type ConnectorData,
  brandName,
  flattenTokens,
  isColor,
} from "../lib/tokens";

interface Props {
  data: ConnectorData;
  selectedSet: string;
}

export function Colors({ data, selectedSet }: Props) {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const node = data.values[selectedSet];
  const leaves = useMemo(() => (node ? flattenTokens(node) : []), [node]);

  const colorLeaves = useMemo(
    () => leaves.filter((l) => l.token.type === "color" && isColor(String(l.token.value))),
    [leaves]
  );

  const groups = useMemo(() => {
    const m: Record<string, typeof colorLeaves> = {};
    for (const leaf of colorLeaves) {
      const parts = leaf.path.split(".");
      const group = parts.length > 1 ? parts.slice(0, 2).join(".") : parts[0];
      if (!m[group]) m[group] = [];
      m[group].push(leaf);
    }
    return Object.entries(m).sort((a, b) => b[1].length - a[1].length);
  }, [colorLeaves]);

  return (
    <div className="space-y-14">
      <section>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter">
          Colors
        </h1>
        <p className="text-gray-400 mt-2">
          {brandName(selectedSet)} — {colorLeaves.length} color tokens
        </p>
      </section>

      {/* Tooltip */}
      {hoveredColor && (
        <div className="fixed top-4 right-4 bg-ink text-white px-4 py-2 rounded-lg text-xs font-mono z-50 shadow-lg">
          {hoveredColor}
        </div>
      )}

      {groups.map(([group, items]) => (
        <section key={group}>
          <div className="flex items-baseline gap-3 mb-5">
            <h2 className="text-lg font-semibold tracking-tight">{group}</h2>
            <span className="text-xs text-gray-400 tabular-nums">
              {items.length}
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
            {items.map((item) => {
              const val = String(item.token.value);
              const label = item.path.split(".").pop() || "";
              return (
                <div
                  key={item.path}
                  className="group cursor-default"
                  onMouseEnter={() => setHoveredColor(`${item.path}: ${val}`)}
                  onMouseLeave={() => setHoveredColor(null)}
                >
                  <div
                    className="aspect-square rounded-lg border border-gray-200 transition-transform group-hover:scale-110 group-hover:shadow-md"
                    style={{ backgroundColor: val }}
                  />
                  <p className="text-[10px] text-gray-500 mt-1.5 truncate text-center">
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {colorLeaves.length === 0 && (
        <p className="text-gray-400 text-center py-20">
          No color tokens in this set.
        </p>
      )}
    </div>
  );
}
