import { useMemo } from "react";
import {
  type ConnectorData,
  aliasKeys,
  brandName,
  flattenTokens,
  countByType,
  totalTokenCount,
  isColor,
} from "../lib/tokens";

interface Props {
  data: ConnectorData;
  selectedSet: string;
  onSelectSet: (s: string) => void;
}

function Stat({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div>
      <p className="text-4xl lg:text-5xl font-bold tracking-tighter">{value}</p>
      <p className="text-sm text-gray-400 mt-1">{label}</p>
    </div>
  );
}

export function Overview({ data, selectedSet, onSelectSet }: Props) {
  const brands = aliasKeys(data);
  const total = totalTokenCount(data);

  const selectedLeaves = useMemo(
    () => (data.values[selectedSet] ? flattenTokens(data.values[selectedSet]) : []),
    [data, selectedSet]
  );

  const typeCounts = useMemo(() => countByType(selectedLeaves), [selectedLeaves]);
  const sortedTypes = useMemo(
    () => Object.entries(typeCounts).sort((a, b) => b[1] - a[1]),
    [typeCounts]
  );
  const maxType = sortedTypes[0]?.[1] || 1;

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section>
        <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter leading-[0.95]">
          Token
          <br />
          Dashboard
        </h1>
        <p className="mt-5 text-lg text-gray-500 max-w-lg leading-relaxed">
          Live inventory of every design token across {brands.length} Hearst
          brands. Explore, compare, and audit from a single source of truth.
        </p>
      </section>

      {/* Stats row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
        <Stat value={total.toLocaleString()} label="Total tokens" />
        <Stat value={brands.length} label="Brands" />
        <Stat value={data.$themes.length} label="Themes" />
        <Stat value={data.version} label="Version" />
      </section>

      <hr className="border-gray-100" />

      {/* Type distribution */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight">
          Token types
          <span className="text-gray-300 font-normal ml-3 text-lg">
            {brandName(selectedSet)}
          </span>
        </h2>
        <div className="mt-8 space-y-3">
          {sortedTypes.map(([type, count]) => (
            <div key={type} className="flex items-center gap-4">
              <span className="text-xs font-mono text-gray-400 w-28 text-right shrink-0">
                {type}
              </span>
              <div className="flex-1 h-6 bg-gray-50 rounded overflow-hidden">
                <div
                  className="h-full bg-ink rounded transition-all duration-700"
                  style={{ width: `${(count / maxType) * 100}%` }}
                />
              </div>
              <span className="text-xs font-mono text-gray-500 w-10 text-right tabular-nums">
                {count}
              </span>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* Brand grid */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight">All brands</h2>
        <p className="text-gray-400 mt-1">
          Select a brand to explore its tokens.
        </p>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {brands.map((key) => {
            const name = brandName(key);
            const node = data.values[key];
            const leaves = flattenTokens(node);
            const colors = leaves
              .filter((l) => l.token.type === "color" && isColor(String(l.token.value)))
              .slice(0, 5);
            const active = key === selectedSet;

            return (
              <button
                key={key}
                onClick={() => onSelectSet(key)}
                className={`text-left p-4 rounded-xl border transition-all group ${
                  active
                    ? "border-ink bg-ink text-white"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold truncate">{name}</span>
                  <span
                    className={`text-[11px] tabular-nums ${
                      active ? "text-white/60" : "text-gray-400"
                    }`}
                  >
                    {leaves.length}
                  </span>
                </div>
                <div className="flex gap-1">
                  {colors.map((c, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-sm ${
                        active ? "border border-white/20" : "border border-gray-200"
                      }`}
                      style={{ backgroundColor: String(c.token.value) }}
                    />
                  ))}
                  {colors.length === 0 && (
                    <div className="w-4 h-4 rounded-sm bg-gray-100" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
