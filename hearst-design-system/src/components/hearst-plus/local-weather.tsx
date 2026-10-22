"use client";

import React from "react";
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  MapPin,
  Search,
  Sun,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";

// The masthead weather line is a quiet local signal. Its location comes from the reader's connection
// (/api/local-weather/location), and the reader can override it with a city or ZIP code they choose.

type Place = { city: string; latitude: number; longitude: number };
type Weather = { temperature: number; code: number; fetchedAt: number };
type SearchResult = Place & { region: string };

const CHOSEN_PLACE_KEY = "hearst-plus-weather-place";
const WEATHER_CACHE_KEY = "hearst-plus-local-weather";
const WEATHER_CACHE_MS = 30 * 60 * 1000;
const fallbackPlace: Place = { city: "Mission Viejo", latitude: 33.6, longitude: -117.672 };

// WMO weather codes, grouped the way the masthead shows them.
function describe(code: number) {
  if (code <= 1) return { label: "Clear", Icon: Sun };
  if (code === 2) return { label: "Partly cloudy", Icon: CloudSun };
  if (code === 3) return { label: "Cloudy", Icon: Cloud };
  if (code === 45 || code === 48) return { label: "Fog", Icon: CloudFog };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { label: "Snow", Icon: CloudSnow };
  if (code >= 95) return { label: "Thunderstorms", Icon: CloudLightning };
  if (code >= 80) return { label: "Showers", Icon: CloudRain };
  return { label: "Rain", Icon: CloudRain };
}

function readStorage<T>(key: string): T | null {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null") as T | null;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private windows); the reading still shows for this visit.
  }
}

function placeKey(place: Place) {
  return `${place.latitude.toFixed(2)},${place.longitude.toFixed(2)}`;
}

async function fetchApproximatePlace(signal: AbortSignal): Promise<Place> {
  try {
    const response = await fetch("/api/local-weather/location/", { signal, cache: "no-store" });
    const data = response.ok ? await response.json() : null;
    if (data?.city && Number.isFinite(data.latitude) && Number.isFinite(data.longitude)) {
      return { city: data.city, latitude: data.latitude, longitude: data.longitude };
    }
  } catch {
    // Fall through to the prototype default.
  }
  return fallbackPlace;
}

async function fetchWeather(place: Place, signal: AbortSignal): Promise<Weather | null> {
  const cached = readStorage<Weather & { key: string }>(WEATHER_CACHE_KEY);
  if (cached && cached.key === placeKey(place) && Date.now() - cached.fetchedAt < WEATHER_CACHE_MS) return cached;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`;
  const response = await fetch(url, { signal });
  const current = response.ok ? (await response.json())?.current : null;
  if (typeof current?.temperature_2m !== "number") return null;
  const weather = { temperature: Math.round(current.temperature_2m), code: Number(current.weather_code ?? 0), fetchedAt: Date.now() };
  writeStorage(WEATHER_CACHE_KEY, { ...weather, key: placeKey(place) });
  return weather;
}

// Open-Meteo geocoding matches city names and postal codes; results are limited to the US for now.
async function searchPlaces(query: string, signal: AbortSignal): Promise<SearchResult[]> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json&countryCode=US`;
  const response = await fetch(url, { signal });
  const results = response.ok ? (await response.json())?.results : null;
  if (!Array.isArray(results)) return [];
  return results.map((result) => ({
    city: String(result.name),
    region: result.admin1 ? String(result.admin1) : "",
    latitude: Number(result.latitude),
    longitude: Number(result.longitude),
  }));
}

export function LocalWeather({
  className,
  buttonClassName,
  hideCityOnCompact = false,
}: {
  className?: string;
  buttonClassName?: string;
  hideCityOnCompact?: boolean;
}) {
  const [place, setPlace] = React.useState<Place | null>(null);
  const [chosen, setChosen] = React.useState(false);
  const [weather, setWeather] = React.useState<Weather | null>(null);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[] | null>(null);
  const [searching, setSearching] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const panelId = React.useId();

  // A city the reader chose wins over the connection's approximate location.
  const resolvePlace = React.useCallback(async (signal: AbortSignal) => {
    const saved = readStorage<Place>(CHOSEN_PLACE_KEY);
    if (saved?.city && Number.isFinite(saved.latitude) && Number.isFinite(saved.longitude)) {
      setChosen(true);
      setPlace(saved);
      return;
    }
    setChosen(false);
    const approximate = await fetchApproximatePlace(signal);
    if (!signal.aborted) setPlace(approximate);
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => void resolvePlace(controller.signal));
    return () => controller.abort();
  }, [resolvePlace]);

  React.useEffect(() => {
    if (!place) return;
    const controller = new AbortController();
    fetchWeather(place, controller.signal)
      .then((next) => {
        if (next) setWeather(next);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [place]);

  // Debounced search as the reader types.
  React.useEffect(() => {
    const trimmed = query.trim();
    if (!open || trimmed.length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setSearching(true);
      searchPlaces(trimmed, controller.signal)
        .then((found) => setResults(found))
        .catch(() => undefined)
        .finally(() => {
          if (!controller.signal.aborted) setSearching(false);
        });
    }, 250);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [open, query]);

  React.useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const closePanel = () => {
    setOpen(false);
    setQuery("");
    setResults(null);
    triggerRef.current?.focus();
  };
  const choosePlace = (next: Place) => {
    const saved = { city: next.city, latitude: next.latitude, longitude: next.longitude };
    writeStorage(CHOSEN_PLACE_KEY, saved);
    setChosen(true);
    setPlace(saved);
    closePanel();
  };
  const useApproximateLocation = () => {
    writeStorage(CHOSEN_PLACE_KEY, null);
    closePanel();
    void resolvePlace(new AbortController().signal);
  };

  if (!place || !weather) return null;
  const { label, Icon } = describe(weather.code);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        className={cn(
          "inline-flex min-h-7 items-center gap-1.5 whitespace-nowrap rounded-[4px] px-1 text-xs font-medium text-muted-foreground transition-colors animate-in fade-in duration-300 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:animate-none",
          buttonClassName,
        )}
        aria-label={`Weather in ${place.city}: ${weather.temperature} degrees, ${label.toLowerCase()}. Change location`}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        title={`${label} in ${place.city}`}
        onClick={() => (open ? closePanel() : setOpen(true))}
      >
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
        <span className="font-semibold text-foreground">{weather.temperature}°</span>
        <span className={cn("max-w-[9rem] truncate", hideCityOnCompact && "max-[1023px]:hidden")}>{place.city}</span>
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Weather location"
          className="absolute left-0 top-full z-50 mt-2 w-72 rounded-[8px] border border-border bg-[var(--hp-surface)] p-3 text-foreground shadow-[var(--hp-shadow-card)]"
        >
          <label htmlFor={`${panelId}-input`} className="mb-1.5 block text-xs font-semibold">
            City or ZIP code
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              ref={inputRef}
              id={`${panelId}-input`}
              type="search"
              autoComplete="off"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (event.target.value.trim().length < 2) setResults(null);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && results?.[0]) {
                  event.preventDefault();
                  choosePlace(results[0]);
                }
              }}
              placeholder="e.g. Austin or 10019"
              className="h-9 w-full rounded-[4px] border border-input bg-background pl-8 pr-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>

          <div aria-live="polite" className="mt-2">
            {searching && !results ? <p className="px-1 py-1.5 text-xs text-muted-foreground">Searching…</p> : null}
            {results && results.length === 0 ? (
              <p className="px-1 py-1.5 text-xs text-muted-foreground">No matching places. Try a nearby city or a ZIP code.</p>
            ) : null}
            {results && results.length > 0 ? (
              <ul className="space-y-0.5">
                {results.map((result) => (
                  <li key={`${result.latitude},${result.longitude}`}>
                    <button
                      type="button"
                      className="flex min-h-9 w-full items-center gap-2 rounded-[4px] px-2 text-left text-sm hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                      onClick={() => choosePlace(result)}
                    >
                      <span className="font-medium">{result.city}</span>
                      {result.region ? <span className="truncate text-xs text-muted-foreground">{result.region}</span> : null}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {chosen ? (
            <button
              type="button"
              className="mt-2 flex min-h-9 w-full items-center gap-2 rounded-[4px] border-t border-border px-2 pt-2 text-left text-xs font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              onClick={useApproximateLocation}
            >
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              Use my approximate location
            </button>
          ) : (
            <p className="mt-2 border-t border-border px-1 pt-2 text-[11px] leading-snug text-muted-foreground">
              Based on your connection. Pick a place to change it.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
