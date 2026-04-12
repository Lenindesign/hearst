import { useState, useMemo } from "react";
import {
  type ConnectorData,
  aliasKeys,
  brandName,
  resolveAtPath,
  isColor,
  isRef,
  deref,
} from "../lib/tokens";

interface Props {
  data: ConnectorData;
}

const PRESETS = [
  "palette.brand.1",
  "palette.brand.2",
  "palette.neutral.100",
  "palette.content.default",
  "palette.background.page",
  "font.family.default",
  "component.button.background-primary-solid-default",
  "border.radius.2xs",
  "space.md",
];

export function Compare({ data }: Props) {
  const [tokenPath, setTokenPath] = useState("palette.brand.1");
  const brands = aliasKeys(data);

  const rows = useMemo(() => {
    const out: {
      brand: string;
      key: string;
      value: string;
      ref: boolean;
    }[] = [];
    for (const key of brands) {
      const node = data.values[key];
      if (!node) continue;
      const resolved = resolveAtPath(node, tokenPath);
      if (resolved) {
        const val = String(resolved.value);
        out.push({
          brand: brandName(key),
          key,
          value: val,
          ref: isRef(val),
        });
      }
    }
    return out;
  }, [data, brands, tokenPath]);

  const uniqueValues = useMemo(
    () => new Set(rows.map((r) => r.value)).size,
    [rows]
  );

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter">
          Compare
        </h1>
        <p className="text-gray-400 mt-2">
          See how a single token resolves across every brand.
        </p>
      </section>

      {/* Token path input */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <input
            type="text"
            value={tokenPath}
            onChange={(e) => setTokenPath(e.target.value)}
            placeholder="Token path, e.g. palette.brand.1"
            className="flex-1 text-[13px] font-mono border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent placeholder:text-gray-300"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setTokenPath(p)}
              className={`text-[11px] font-mono px-2.5 py-1 rounded-md border transition-colors ${
                tokenPath === p
                  ? "border-ink bg-ink text-white"
                  : "border-gray-200 text-gray-500 hover:border-gray-400"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      {rows.length > 0 && (
        <div className="flex gap-8 text-sm">
          <div>
            <span className="text-2xl font-bold">{rows.length}</span>
            <span className="text-gray-400 ml-2">brands</span>
          </div>
          <div>
            <span className="text-2xl font-bold">{uniqueValues}</span>
            <span className="text-gray-400 ml-2">unique values</span>
          </div>
        </div>
      )}

      {/* Table */}
      {rows.length > 0 ? (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Brand
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Value
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider w-16">
                  Preview
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.key}
                  className={
                    i < rows.length - 1 ? "border-b border-gray-100" : ""
                  }
                >
                  <td className="py-3 px-4 font-medium">{r.brand}</td>
                  <td className="py-3 px-4">
                    <code
                      className={`font-mono text-xs ${
                        r.ref ? "text-accent" : "text-gray-500"
                      }`}
                    >
                      {r.ref ? deref(r.value) : r.value}
                    </code>
                  </td>
                  <td className="py-3 px-4">
                    {isColor(r.value) && (
                      <div
                        className="w-7 h-7 rounded-md border border-gray-200"
                        style={{ backgroundColor: r.value }}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No matches</p>
          <p className="text-sm mt-1">
            Token path &ldquo;{tokenPath}&rdquo; was not found in any brand.
          </p>
        </div>
      )}

      {/* Color grid (if all are colors) */}
      {rows.length > 0 &&
        rows.every((r) => isColor(r.value)) && (
          <section>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Visual comparison
            </h2>
            <div className="flex flex-wrap gap-3">
              {rows.map((r) => (
                <div key={r.key} className="text-center">
                  <div
                    className="w-14 h-14 rounded-xl border border-gray-200 shadow-sm"
                    style={{ backgroundColor: r.value }}
                  />
                  <p className="text-[10px] text-gray-500 mt-1.5 max-w-[56px] truncate">
                    {r.brand}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
    </div>
  );
}
