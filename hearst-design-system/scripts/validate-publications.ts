/**
 * Validates tokens/publications.json against the current design-system assets.
 *
 * This keeps the publication manifest honest as brands are added, planned, or
 * retired. It verifies token files, logos, Pencil specs, font override pointers,
 * and runtime logo mappings.
 */

import { existsSync, readFileSync, readdirSync } from "fs";
import { basename, join } from "path";

const ROOT = join(__dirname, "..");
const TOKENS_DIR = join(ROOT, "tokens");
const BRANDS_DIR = join(TOKENS_DIR, "brands");
const MANIFEST_PATH = join(TOKENS_DIR, "publications.json");
const META_PATH = join(BRANDS_DIR, "_meta.json");
const LOGOS_TS_PATH = join(ROOT, "src", "lib", "logos.ts");

const VALID_STATUSES = new Set(["active", "planned", "retired"]);
const VALID_KINDS = new Set(["publication", "system"]);
const VALID_CATEGORIES = new Set([
  "autos",
  "commerce",
  "entertainment",
  "fashion-lifestyle",
  "food-lifestyle",
  "health-wellness",
  "home-lifestyle",
  "lifestyle",
  "system",
]);

interface Publication {
  slug: string;
  displayName: string;
  status: "active" | "planned" | "retired";
  kind: "publication" | "system";
  category: string;
  tokenFile: string | null;
  logoPath: string | null;
  pencilFile: string | null;
  fontOverride: string | null;
}

interface PublicationManifest {
  schemaVersion: number;
  description?: string;
  publications: Publication[];
}

interface FontMeta {
  overrides?: Record<string, unknown>;
}

function loadJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

function resolveRepoPath(relativePath: string): string {
  return join(ROOT, relativePath);
}

function tokenSlugFromFile(tokenFile: string): string {
  return basename(tokenFile, ".json");
}

function parseRuntimeLogos(): Record<string, string> {
  if (!existsSync(LOGOS_TS_PATH)) return {};

  const source = readFileSync(LOGOS_TS_PATH, "utf-8");
  const logos: Record<string, string> = {};
  const entry = /["']([^"']+)["']:\s*["']([^"']+)["']/g;
  let match: RegExpExecArray | null;

  while ((match = entry.exec(source)) !== null) {
    logos[match[1]] = match[2];
  }

  return logos;
}

function normalizeRuntimeLogoPath(path: string): string {
  return path.startsWith("/") ? `public${path}` : path;
}

function parseFontOverrideSlug(pointer: string): string | null {
  const match = pointer.match(/^tokens\/brands\/_meta\.json#overrides\.([a-z0-9-]+)$/);
  return match?.[1] ?? null;
}

function validate() {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!existsSync(MANIFEST_PATH)) {
    errors.push("Missing tokens/publications.json");
    return { errors, warnings };
  }

  const manifest = loadJson<PublicationManifest>(MANIFEST_PATH);
  const fontMeta = existsSync(META_PATH)
    ? loadJson<FontMeta>(META_PATH)
    : { overrides: {} };
  const fontOverrides = fontMeta.overrides ?? {};
  const runtimeLogos = parseRuntimeLogos();

  if (manifest.schemaVersion !== 1) {
    errors.push(`Expected schemaVersion 1, got ${manifest.schemaVersion}`);
  }

  if (!Array.isArray(manifest.publications)) {
    errors.push("publications must be an array");
    return { errors, warnings };
  }

  const entriesBySlug = new Map<string, Publication>();
  const activeEntries = manifest.publications.filter(
    (entry) => entry.status === "active"
  );
  const activePublications = activeEntries.filter(
    (entry) => entry.kind === "publication"
  );
  const activeSystems = activeEntries.filter((entry) => entry.kind === "system");
  const plannedEntries = manifest.publications.filter(
    (entry) => entry.status === "planned"
  );

  for (const entry of manifest.publications) {
    if (!entry.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug)) {
      errors.push(`Invalid slug: ${entry.slug}`);
    }

    if (entriesBySlug.has(entry.slug)) {
      errors.push(`Duplicate publication slug: ${entry.slug}`);
    }
    entriesBySlug.set(entry.slug, entry);

    if (!entry.displayName) {
      errors.push(`${entry.slug} is missing displayName`);
    }

    if (!VALID_STATUSES.has(entry.status)) {
      errors.push(`${entry.slug} has invalid status: ${entry.status}`);
    }

    if (!VALID_KINDS.has(entry.kind)) {
      errors.push(`${entry.slug} has invalid kind: ${entry.kind}`);
    }

    if (!VALID_CATEGORIES.has(entry.category)) {
      errors.push(`${entry.slug} has invalid category: ${entry.category}`);
    }

    if (entry.kind === "system" && entry.category !== "system") {
      errors.push(`${entry.slug} is a system entry but category is ${entry.category}`);
    }

    if (entry.status === "active" && !entry.tokenFile) {
      errors.push(`${entry.slug} is active but has no tokenFile`);
    }

    if (entry.tokenFile) {
      const tokenPath = resolveRepoPath(entry.tokenFile);
      if (!existsSync(tokenPath)) {
        errors.push(`${entry.slug} tokenFile does not exist: ${entry.tokenFile}`);
      }

      const tokenSlug = tokenSlugFromFile(entry.tokenFile);
      if (tokenSlug !== entry.slug) {
        errors.push(
          `${entry.slug} tokenFile basename must match slug, got ${tokenSlug}`
        );
      }
    }

    if (entry.kind === "publication" && entry.status === "active" && !entry.logoPath) {
      errors.push(`${entry.slug} is an active publication but has no logoPath`);
    }

    if (entry.logoPath) {
      const logoPath = resolveRepoPath(entry.logoPath);
      if (!existsSync(logoPath)) {
        errors.push(`${entry.slug} logoPath does not exist: ${entry.logoPath}`);
      }

      const runtimeLogo = runtimeLogos[entry.slug];
      if (!runtimeLogo) {
        errors.push(`${entry.slug} has logoPath but is missing from src/lib/logos.ts`);
      } else if (normalizeRuntimeLogoPath(runtimeLogo) !== entry.logoPath) {
        errors.push(
          `${entry.slug} logo mismatch: manifest ${entry.logoPath}, runtime ${runtimeLogo}`
        );
      }
    }

    if (entry.kind === "publication" && entry.status === "active" && !entry.pencilFile) {
      errors.push(`${entry.slug} is an active publication but has no pencilFile`);
    }

    if (entry.pencilFile && !existsSync(resolveRepoPath(entry.pencilFile))) {
      errors.push(`${entry.slug} pencilFile does not exist: ${entry.pencilFile}`);
    }

    if (entry.fontOverride) {
      const overrideSlug = parseFontOverrideSlug(entry.fontOverride);
      if (!overrideSlug) {
        errors.push(`${entry.slug} has invalid fontOverride: ${entry.fontOverride}`);
      } else {
        if (overrideSlug !== entry.slug) {
          errors.push(
            `${entry.slug} fontOverride must point to its own slug, got ${overrideSlug}`
          );
        }

        if (!(overrideSlug in fontOverrides)) {
          errors.push(`${entry.slug} fontOverride missing in _meta.json`);
        }
      }
    }
  }

  const brandFiles = readdirSync(BRANDS_DIR)
    .filter((file) => file.endsWith(".json") && file !== "_meta.json")
    .map((file) => file.replace(".json", ""));

  for (const slug of brandFiles) {
    const entry = entriesBySlug.get(slug);
    if (!entry) {
      errors.push(`Token brand file is not represented in publications.json: ${slug}`);
    } else if (entry.status !== "active") {
      errors.push(`Token brand file exists for non-active publication: ${slug}`);
    }
  }

  for (const slug of Object.keys(fontOverrides)) {
    if (!entriesBySlug.has(slug)) {
      errors.push(`_meta.json override is not represented in publications.json: ${slug}`);
    }
  }

  for (const [slug, entry] of entriesBySlug) {
    if (entry.status === "active" && entry.tokenFile && !brandFiles.includes(slug)) {
      errors.push(`Active publication has tokenFile but no matching brand file: ${slug}`);
    }
  }

  console.log("\nPublication manifest validation\n");
  console.log(`Entries: ${manifest.publications.length}`);
  console.log(`Active publications: ${activePublications.length}`);
  console.log(`Active system modes: ${activeSystems.length}`);
  console.log(`Planned publications: ${plannedEntries.length}`);
  console.log(`Token brand files: ${brandFiles.length}`);

  return { errors, warnings };
}

const { errors, warnings } = validate();

if (warnings.length > 0) {
  console.log("\nWarnings:");
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
}

if (errors.length > 0) {
  console.log("\nErrors:");
  for (const error of errors) {
    console.log(`- ${error}`);
  }
  console.log(`\n${errors.length} error(s) found.\n`);
  process.exit(1);
}

console.log("\nPublication manifest passed.\n");
