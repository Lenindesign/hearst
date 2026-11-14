import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { SpecTable } from "@/components/specs/spec-kit";

/**
 * System chapter live reference: the vault files themselves, read when the
 * page is built. Nothing here is typed by hand, so the counts cannot drift.
 */

const appRoot = process.cwd();
const repoRoot = path.join(appRoot, "..");

const vaultFiles = [
  ["AGENTS.md", "Agent entry point and rule ownership"],
  ["PRODUCT.md", "Product purpose and principles"],
  ["DESIGN.md", "Design-tool bridge"],
  ["AIDLC-docs/DESIGN-SYSTEM-SPEC.md", "HDS tokens and component contracts"],
  ["STYLE.md", "Shared visual and interaction rules"],
  ["BRAND_STYLES.md", "Brand identity"],
  ["APP_RULES.md", "Product behavior and scoped exceptions"],
  ["VAULT_HOME.md", "Knowledge map"],
  ["DECISION_LOG.md", "History behind the rules"],
] as const;

function readText(file: string) {
  try {
    return readFileSync(path.join(appRoot, file), "utf8");
  } catch {
    return null;
  }
}

function countFiles(dir: string, test: (name: string) => boolean): number {
  try {
    return readdirSync(dir).reduce((total, name) => {
      if (name === "node_modules" || name.startsWith(".")) return total;
      const full = path.join(dir, name);
      return total + (statSync(full).isDirectory() ? countFiles(full, test) : test(name) ? 1 : 0);
    }, 0);
  } catch {
    return 0;
  }
}

function listDirs(dir: string) {
  try {
    return readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isDirectory() || entry.isSymbolicLink()).map((entry) => entry.name).sort();
  } catch {
    return [];
  }
}

/** The numbered "Before changing…" steps from AGENTS.md, as written. */
function agentSteps(agents: string | null) {
  if (!agents) return [];
  return agents.split("\n").filter((line) => /^\d+\.\s/.test(line)).map((line) => line.replace(/^\d+\.\s/, "").replace(/`/g, ""));
}

export function SystemLive() {
  const rows = vaultFiles.map(([file, owns]) => {
    const text = readText(file);
    const lines = text ? text.split("\n").length : 0;
    const heading = text?.split("\n").find((line) => line.startsWith("# "))?.slice(2) ?? "—";
    return [<code key={file} className="font-mono text-[0.8125rem]">{file}</code>, owns, heading, text ? String(lines) : "missing"];
  });
  const steps = agentSteps(readText("AGENTS.md"));
  const skills = listDirs(path.join(repoRoot, ".agents", "skills"));
  const counts = [
    ["Component metadata files", countFiles(path.join(appRoot, "src"), (name) => name.endsWith(".metadata.ts")), "src/**/*.metadata.ts"],
    ["Storybook stories", countFiles(path.join(appRoot, "src", "stories"), (name) => name.endsWith(".stories.tsx")), "src/stories/*.stories.tsx"],
    ["Spec chapters", countFiles(path.join(appRoot, "src", "components", "specs", "chapters"), (name) => name.endsWith("-chapter.tsx")), "src/components/specs/chapters/"],
    ["Shared skills", skills.length, ".agents/skills/"],
  ] as const;

  return (
    <div className="min-w-0 space-y-8">
      <SpecTable
        caption="Vault files, read when this page was built"
        headers={["File", "Owns", "First heading", "Lines"]}
        rows={rows}
        numeric={[3]}
        codeFirst={false}
        minWidth="44rem"
      />
      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <div className="min-w-0 rounded-card border border-border p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">AGENTS.md · before changing a surface</p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6">
            {steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </div>
        <div className="min-w-0 rounded-card border border-border p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Counted in the repository</p>
          <dl className="mt-4 divide-y divide-border text-sm">
            {counts.map(([label, value, where]) => (
              <div key={label} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 py-2.5">
                <dt>{label}<code className="block truncate text-xs text-muted-foreground">{where}</code></dt>
                <dd className="self-center text-2xl font-semibold tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
          {skills.length ? <p className="mt-3 text-xs leading-5 text-muted-foreground">{skills.join(" · ")}</p> : null}
        </div>
      </div>
    </div>
  );
}
