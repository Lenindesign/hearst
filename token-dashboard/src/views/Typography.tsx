import { useMemo } from "react";
import {
  type ConnectorData,
  brandName,
  flattenTokens,
  deref,
  isRef,
} from "../lib/tokens";

interface Props {
  data: ConnectorData;
  selectedSet: string;
}

export function Typography({ data, selectedSet }: Props) {
  const node = data.values[selectedSet];
  const leaves = useMemo(() => (node ? flattenTokens(node) : []), [node]);

  const families = useMemo(
    () =>
      leaves.filter(
        (l) =>
          l.token.type === "fontFamilies" || l.path.includes("fontFamily")
      ),
    [leaves]
  );

  const sizes = useMemo(
    () =>
      leaves
        .filter(
          (l) => l.token.type === "fontSizes" || l.path.includes("fontSize")
        )
        .sort((a, b) => parseFloat(String(a.token.value)) - parseFloat(String(b.token.value))),
    [leaves]
  );

  const weights = useMemo(
    () =>
      leaves
        .filter(
          (l) =>
            l.token.type === "fontWeights" || l.path.includes("fontWeight")
        )
        .sort(
          (a, b) => Number(a.token.value) - Number(b.token.value)
        ),
    [leaves]
  );

  const lineHeights = useMemo(
    () =>
      leaves.filter(
        (l) =>
          l.token.type === "lineHeights" || l.path.includes("lineHeight")
      ),
    [leaves]
  );

  const maxSize = sizes.length
    ? Math.max(...sizes.map((s) => parseFloat(String(s.token.value))))
    : 64;

  return (
    <div className="space-y-16">
      <section>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter">
          Typography
        </h1>
        <p className="text-gray-400 mt-2">{brandName(selectedSet)}</p>
      </section>

      {/* Font families */}
      {families.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
            Font Families
          </h2>
          <div className="space-y-6">
            {families.map((f) => {
              const raw = String(f.token.value);
              const resolved = isRef(raw) ? deref(raw) : raw;
              return (
                <div
                  key={f.path}
                  className="border border-gray-200 rounded-xl p-6"
                >
                  <div className="flex items-baseline justify-between mb-4">
                    <code className="text-xs font-mono text-gray-400">
                      {f.path}
                    </code>
                    <code className="text-xs font-mono text-accent">
                      {raw}
                    </code>
                  </div>
                  <p
                    className="text-3xl lg:text-4xl tracking-tight"
                    style={{ fontFamily: `${resolved}, system-ui, sans-serif` }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </p>
                  <p
                    className="text-base text-gray-500 mt-3"
                    style={{ fontFamily: `${resolved}, system-ui, sans-serif` }}
                  >
                    ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz
                    0123456789
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Font sizes */}
      {sizes.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
            Size Scale
          </h2>
          <div className="space-y-1">
            {sizes.map((s) => {
              const val = parseFloat(String(s.token.value));
              const label = s.path.split(".").pop() || "";
              return (
                <div key={s.path} className="flex items-center gap-4 py-2">
                  <span className="text-[11px] font-mono text-gray-400 w-32 text-right shrink-0 truncate">
                    {label}
                  </span>
                  <div className="flex-1 h-7 bg-gray-50 rounded overflow-hidden">
                    <div
                      className="h-full bg-ink rounded transition-all duration-500"
                      style={{ width: `${(val / maxSize) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-gray-500 w-12 text-right tabular-nums shrink-0">
                    {String(s.token.value)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Font weights */}
      {weights.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
            Weights
          </h2>
          <div className="flex flex-wrap gap-4">
            {weights.map((w) => {
              const val = Number(w.token.value) || 400;
              const label = w.path.split(".").pop() || "";
              return (
                <div
                  key={w.path}
                  className="border border-gray-200 rounded-xl p-5 text-center min-w-[100px]"
                >
                  <p className="text-3xl" style={{ fontWeight: val }}>
                    Ag
                  </p>
                  <p className="text-xs font-mono text-gray-500 mt-2">{val}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Line heights */}
      {lineHeights.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
            Line Heights
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {lineHeights.map((lh) => {
              const val = String(lh.token.value);
              const label = lh.path.split(".").pop() || "";
              return (
                <div
                  key={lh.path}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <p
                    className="text-sm leading-none"
                    style={{ lineHeight: val }}
                  >
                    The quick brown fox jumps over the lazy dog. Pack my box
                    with five dozen liquor jugs.
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-[10px] text-gray-400">{label}</span>
                    <code className="text-[11px] font-mono text-gray-500">
                      {val}
                    </code>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {families.length === 0 &&
        sizes.length === 0 &&
        weights.length === 0 && (
          <p className="text-gray-400 text-center py-20">
            No typography tokens in this set.
          </p>
        )}
    </div>
  );
}
