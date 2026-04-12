import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";
import {
  fetchTokens,
  type ConnectorData,
  aliasKeys,
  totalTokenCount,
} from "./lib/tokens";
import { Overview } from "./views/Overview";
import { Explorer } from "./views/Explorer";
import { Colors } from "./views/Colors";
import { Typography } from "./views/Typography";
import { Compare } from "./views/Compare";

function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-paper">
      <div className="text-center">
        <div className="w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-sm text-gray-400 tracking-wide uppercase">
          Loading tokens
        </p>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-paper">
      <div className="text-center max-w-md px-8">
        <p className="text-6xl font-bold tracking-tighter">Error</p>
        <p className="mt-4 text-gray-500">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 text-sm text-accent hover:underline"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

const NAV = [
  { to: "/", label: "Overview" },
  { to: "/explorer", label: "Explorer" },
  { to: "/colors", label: "Colors" },
  { to: "/typography", label: "Typography" },
  { to: "/compare", label: "Compare" },
];

export default function App() {
  const [data, setData] = useState<ConnectorData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSet, setSelectedSet] = useState("");

  useEffect(() => {
    fetchTokens()
      .then((d) => {
        setData(d);
        const cosmo = aliasKeys(d).find((k) => k.includes("Cosmopolitan"));
        setSelectedSet(cosmo || aliasKeys(d)[0] || "");
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!data) return <Loader />;

  const total = totalTokenCount(data);
  const brands = aliasKeys(data);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-paper font-sans">
        {/* ── Top bar ── */}
        <header className="sticky top-0 z-50 bg-paper/80 backdrop-blur-xl border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="h-14 flex items-center justify-between">
              {/* Left: title */}
              <div className="flex items-center gap-6">
                <NavLink to="/" className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-sm font-semibold tracking-tight">
                    Hearst Tokens
                  </span>
                </NavLink>

                <nav className="hidden md:flex items-center gap-1">
                  {NAV.map((n) => (
                    <NavLink
                      key={n.to}
                      to={n.to}
                      end={n.to === "/"}
                      className={({ isActive }) =>
                        `px-3 py-1.5 text-[13px] rounded-md transition-colors ${
                          isActive
                            ? "text-ink font-medium bg-gray-100"
                            : "text-gray-400 hover:text-ink"
                        }`
                      }
                    >
                      {n.label}
                    </NavLink>
                  ))}
                </nav>
              </div>

              {/* Right: set picker + meta */}
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline text-xs text-gray-400 tabular-nums">
                  {total.toLocaleString()} tokens
                </span>
                <select
                  value={selectedSet}
                  onChange={(e) => setSelectedSet(e.target.value)}
                  className="text-[13px] bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 8px center",
                  }}
                >
                  <optgroup label="Primitives">
                    {Object.keys(data.values)
                      .filter((k) => k.startsWith("Primitives/"))
                      .map((k) => (
                        <option key={k} value={k}>
                          {k.replace("Primitives/", "")}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Brands">
                    {brands.map((k) => (
                      <option key={k} value={k}>
                        {k.replace("Alias/", "")}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* ── Content ── */}
        <main className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 lg:py-14">
          <Routes>
            <Route
              path="/"
              element={
                <Overview
                  data={data}
                  selectedSet={selectedSet}
                  onSelectSet={setSelectedSet}
                />
              }
            />
            <Route
              path="/explorer"
              element={
                <Explorer data={data} selectedSet={selectedSet} />
              }
            />
            <Route
              path="/colors"
              element={
                <Colors data={data} selectedSet={selectedSet} />
              }
            />
            <Route
              path="/typography"
              element={
                <Typography data={data} selectedSet={selectedSet} />
              }
            />
            <Route
              path="/compare"
              element={<Compare data={data} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* ── Footer ── */}
        <footer className="border-t border-gray-100 mt-20">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6 flex items-center justify-between text-xs text-gray-400">
            <span>Hearst Design System</span>
            <span>v{data.version}</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
