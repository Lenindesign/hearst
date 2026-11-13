import { Col, ColGroup, FindingList, NumberedList, SmallNote, TaggedFinding } from "@/components/specs/chapters/chapter-parts";
import { SpecChapter, SpecColumns, SpecFilm, SpecProse, SpecSection, SpecSheet, SpecSubhead, SpecTable } from "@/components/specs/spec-kit";

/** Agentic design system spec (HP-SYS-SPEC · Rev A · 2026-11-11), converted from public/specs/system-spec.html. */
const stackRows = [
  ["1 · Vaults", <><b>Hearst+ app vault</b>: the canonical product and design memory agents must read before UI changes. <b>Design Brain</b>: separate Hearst-wide guidance that agents must not use for this app.</>, <><code>hearst-design-system/</code> (Obsidian) · <code>~/Documents/…/Design Brain</code></>, "7 canonical files · 5 notes · 9 docs · Design Brain 208 notes"],
  ["2 · Rules", "HDS Constitution (8 articles), agent charter, runbooks", <><code>.agents/rules/</code>, repo root</>, "8 articles · 9 runbook roles"],
  ["3 · Skills", "Instructions an agent loads for a kind of task", <><code>.cursor/skills/</code>, <code>.agents/skills/</code>, <code>hearst-design-system/.agents/skills/</code>, personal</>, "8 role · 8 repo · 2 personal"],
  ["4 · Agents", "Roles with a file boundary, sequenced per request", "Charter and runbooks", "9 roles"],
  ["5 · Repo", "Token JSON → generated → UI primitives → modules → page archetypes", <code key="c">hearst-design-system/</code>, "29 brands · 148 component files · 28 metadata · 59 stories"],
  ["6 · Outputs", "App on Netlify, Storybook, Figma variables, Pencil specs, spec pages", <>Netlify · Figma · <code>.pen</code></>, <>28 brand <code>.pen</code> files + 1</>],
] as const;

const vaultRows = [
  ["VAULT_HOME.md", "The map of the vault and who owns what", "—"],
  ["AIDLC-docs/DESIGN-SYSTEM-SPEC.md", "Token architecture, generated outputs, component contracts", "—"],
  ["PRODUCT.md", "Purpose, audience and design principles. Read first.", "58"],
  ["DESIGN.md", "Routes design tools to the right owner (a bridge, not a source)", "22"],
  ["STYLE.md", "Shared visual, responsive, accessibility and interaction rules", "153"],
  ["BRAND_STYLES.md", "Destination and publication colors, fonts and logos", "188"],
  ["APP_RULES.md", "Personalization, feeds, readers and scoped exceptions", "179"],
  ["DECISION_LOG.md", "Dated decisions that may graduate into a rule file", "288"],
] as const;

const skillRows = [
  [
    <code key="h">.cursor/skills/</code>,
    <><code>hearst-token-architect</code>, <code>hearst-frontend-component</code>, <code>hearst-grid-system</code>, <code>hearst-storybook-docs</code>, <code>hearst-figma-sync</code>, <code>hearst-pencil-design</code>, <code>hearst-qa-review</code>, <code>hearst-devops-deploy</code></>,
    "One per agent role",
  ],
  [
    <><code>.agents/</code> (root, linked in <code>.claude/skills/</code>)</>,
    <><code>hds-constitution</code> (skill + rule), <code>handoff</code>, <code>oil-ui</code>, <code>dimensional-drawing</code>, <code>dimensional-drawing-motion</code>, <code>token-mapping</code></>,
    <>The constitution; handing work to another agent; UI exploration; these spec sheets and films; mapping hard-coded values to HDS tokens before a pull request (adapted from design.how, see <a href="/specs/#tokens-hygiene" className="font-semibold underline underline-offset-4">Tokens &amp; brands › Token hygiene</a>)</>,
  ],
  [<code key="h">hearst-design-system/.agents/</code>, <><code>impeccable</code>, <code>brand-interstitial-ads</code></>, "Design critique and polish; Ambient Reader ads"],
  [<>Personal (<code>~/.claude/skills</code>)</>, <><code>grill-with-ui</code>, <code>hearst-workbench</code></>, "Design interviews; project setup"],
  ["Design Brain", <>67 <code>SKILL.md</code> entry points</>, "Navigating the Hearst-wide vault (not used by the app)"],
] as const;

const agentRows = [
  ["Token Architect", <><code>tokens/**/*.json</code>, token naming, <code>build-tokens</code>, <code>tokens:check</code>, <code>tokens:validate</code></>, <>Edit generated <code>brands.ts</code> / <code>tokens.css</code>; rename keys without a migration plan</>, <code key="s">hearst-token-architect</code>],
  ["Publication Stylist", "Brand identity translation, publication token decisions, brand QA notes", "Fork shared components for one publication; put brand behavior outside tokens", "none"],
  ["Component Builder", <><code>src/components/**</code>, metadata files, usage patterns</>, "Brand conditionals that tokens can solve; hardcoded publication colors", <code key="s">hearst-frontend-component</code>],
  ["Grid System", "Layout and column behavior (runbook only)", "—", <code key="s">hearst-grid-system</code>],
  ["Storybook Documenter", <><code>src/stories/**</code>, usage docs, examples</>, "Treat Storybook-only styling as production", <code key="s">hearst-storybook-docs</code>],
  ["Figma Sync", <><code>scripts/push-to-figma.ts</code>, variable sync, collection hygiene</>, "Treat Figma values as the source of truth", <code key="s">hearst-figma-sync</code>],
  ["Pencil Design", <><code>.pen</code> specs, Pencil variables</>, <>Read or change <code>.pen</code> files outside Pencil tools</>, <code key="s">hearst-pencil-design</code>],
  ["QA Review", "Release checks, cross-publication checks, accessibility and token evidence", "Approve without visible output or audit evidence", <code key="s">hearst-qa-review</code>],
  ["Release", "Build, deploy, release notes, PR hygiene, post-merge sync", "Skip validation when generated files changed", <code key="s">hearst-devops-deploy</code>],
] as const;

const truthRows = [
  ["Token values", <>Git token JSON (<code>tokens/</code>)</>, "Generated files, Figma variables, Pencil variables"],
  ["Guidance", <>Hearst+ vault Markdown (<code>APP_RULES</code>, <code>STYLE</code>, <code>BRAND_STYLES</code> …)</>, <>Skills, <code>DESIGN.md</code>, agents</>],
  ["Behavior", "Component code and metadata", "Storybook, the app, spec pages"],
  ["Evidence", "PR descriptions and handoff notes", "Release notes"],
] as const;

export function SystemChapter() {
  return (
    <SpecChapter
      id="system"
      number="09"
      kicker="HDS · Agentic design system · Spec"
      title="Agentic design system"
      lede={<p>This spec shows how the Hearst design system is run with AI agents: the Hearst+ app vault, the rules, the skills, the agent roles and the repo, and how a change moves through them from request to release. Roles, gates and workflows are quoted from the agent charter and the runbooks; counts were taken from the repo and the vaults.</p>}
      meta={[
        ["Doc", "HP-SYS-SPEC · Rev A · 2026-11-11"],
        ["Drawing", <><a href="/specs/system-drawing.html" className="underline underline-offset-4">HP-SYS-001</a> · 2 sheets</>],
        ["Source", <><code>AGENTIC-DESIGN-SYSTEM.md</code>, <code>CODEX-AGENT-RUNBOOKS.md</code>, <code>hearst-design-system/VAULT_HOME.md</code>, <code>AGENTS.md</code>, <code>.cursor/skills/</code>, Design Brain <code>references/</code></>],
        ["Counted", "Repo and vault on 2026-11-11 · brands, components, metadata, stories, notes, skills"],
      ]}
      contents={[
        ["Film", "#system-film"],
        ["The stack", "#system-stack"],
        ["Vault", "#system-vault"],
        ["Skills", "#system-skills"],
        ["Agents", "#system-agents"],
        ["The loop", "#system-loop"],
        ["Sources of truth", "#system-truth"],
        ["Findings", "#system-findings"],
      ]}
    >
      <SpecSection id="system-film" kicker="09.0 · Walkthrough" title="How the system works" intro={<p>The film builds the stack layer by layer, then walks through the two vaults, the skills, the nine agents, the repo’s layers, routing, the change loop with its stop gate, the sources of truth and the four workflows. It ends on the two drawing sheets.</p>}>
        <SpecFilm
          src="/specs/system-film.mp4"
          poster="/specs/system-film-poster.jpg"
          label="Agentic design system film · 1:50 · no sound."
          caption={<p><b className="text-foreground">Agentic design system film · 1:50 · no sound.</b> Captions at the top of each scene say what is happening. Pick a chapter to jump to it.</p>}
          chapters={[
            [0, "The six-layer stack"],
            [14, "The vaults: Hearst+ and Design Brain"],
            [24, "Skills: four homes"],
            [34, "Agents: nine roles"],
            [46, "The repo’s five layers"],
            [56, "Routing: who leads"],
            [66, "The change loop and its gates"],
            [80, "Sources of truth"],
            [88, "Workflows 1–4"],
            [98, "The drawing sheets"],
          ]}
        />
      </SpecSection>

      <SpecSection id="system-stack" kicker="09.1 · Drawing HP-SYS-001 · Rev A · Sheet 1" title="The stack" intro={<p>Six layers. Knowledge flows down from the vaults into code; evidence flows back up with every change. The full drawing is in <a href="/specs/system-drawing.html" className="font-semibold text-foreground underline underline-offset-4">system-drawing.html</a>.</p>}>
        <SpecSheet
          src="/specs/system-drawing-sheet-1.jpg"
          width={1936}
          height={1209}
          href="/specs/system-drawing.html"
          alt="Drawing sheet 1, structure: the exploded six-layer stack, the repo's five layers, the vault sections with note counts, the routing matrix and count tables."
        />
        <SpecTable caption="The six-layer stack" headers={["Layer", "What it is", "Where it lives", "Measured"]} rows={stackRows} codeFirst={false} minWidth="52rem" />
      </SpecSection>

      <SpecSection id="system-vault" kicker="09.2 · Knowledge" title="The vaults" intro={<p>Hearst+ follows its own vault: the app folder <code>hearst-design-system/</code> is an Obsidian vault, and <code>AGENTS.md</code> tells every agent to read it before changing the interface. Each topic has one canonical file; working notes in <code>notes/</code> are non-canonical until promoted.</p>}>
        <SpecTable caption="Hearst+ vault canonical files" headers={["File", "Owns", "Lines"]} rows={vaultRows} numeric={[2]} />
        <SpecSubhead>Design Brain (separate)</SpecSubhead>
        <SpecProse>
          <p>A Hearst-wide knowledge base in <code>~/Documents/ChatGPT/Design Brain</code>: 208 notes in 7 sections (start here 14, constitution 45, design system 21, feature reasoning 5, editorial 9 deprecated, brand playbooks 110, prototype 4) with 67 skill entry points. Nothing in the Hearst+ app links to it, and agents must not read or copy from it (<code>AGENTS.md</code>, decided 2026-11-13). Its notes use Must / Should / May and the statuses Draft, In review, Ready, Deprecated.</p>
        </SpecProse>
      </SpecSection>

      <SpecSection id="system-skills" kicker="09.3 · Instructions" title="Skills">
        <SpecTable caption="Skills by home" headers={["Home", "Skills", "Used for"]} rows={skillRows} codeFirst={false} minWidth="52rem" />
      </SpecSection>

      <SpecSection id="system-agents" kicker="09.4 · Ownership" title="Agents" intro={<p>Use the narrowest agent that can do the work; when a request spans several, sequence them. The routing matrix on sheet 1 shows who leads each kind of request.</p>}>
        <SpecTable caption="Agent roles" headers={["Role", "Owns", "Must not", "Skill"]} rows={agentRows} codeFirst={false} minWidth="56rem" />
      </SpecSection>

      <SpecSection id="system-loop" kicker="09.5 · Drawing HP-SYS-001 · Sheet 2" title="The change loop">
        <SpecSheet
          src="/specs/system-drawing-sheet-2.jpg"
          width={1936}
          height={1208}
          href="/specs/system-drawing.html"
          alt="Drawing sheet 2, logic: the change loop with its stop gate and QA return, the six stop conditions, sources of truth, workflows 1 to 4, the evidence format, pilot brands, note status and guidance strength."
        />
        <SpecColumns>
          <Col>
            <ColGroup title="Every change">
              <NumberedList>
                <li><b>Request</b> in plain English.</li>
                <li><b>Classify</b> with the routing matrix.</li>
                <li><b>Preflight</b>: git status, leave unrelated changes alone, read the code first, check for generated files, pick the smallest boundary.</li>
                <li><b>Edit</b> only the owned files.</li>
                <li><b>Build and validate</b>; generated files change only through scripts.</li>
                <li><b>QA</b> at least three brands: the changed one, an adjacent one and an unrelated one (five in the pilot). Failures go back to the owner.</li>
                <li><b>Evidence</b>: change, files, validation, brand coverage, known gaps.</li>
                <li><b>Release</b>, then sync Figma and Pencil after merge.</li>
              </NumberedList>
            </ColGroup>
          </Col>
          <Col>
            <ColGroup title="Stop and ask when">
              <ul>
                <li>A token key would be renamed or deleted.</li>
                <li>A brand needs behavior tokens, variants or editorial modes can’t express.</li>
                <li>A <code>.pen</code> file is corrupt or won’t open in Pencil.</li>
                <li>Figma sync would touch variables outside the HDS collection.</li>
                <li>The user’s own changes conflict with the edit.</li>
                <li>It would deploy or push to production without being asked.</li>
              </ul>
            </ColGroup>
            <ColGroup title="Pilot">
              <SmallNote>Brands: cosmopolitan, car-and-driver, esquire, good-housekeeping, delish. Surfaces: article, home, card collection, right rail, newsletter, button, badge, nav, carousel, pagination, input.</SmallNote>
            </ColGroup>
          </Col>
        </SpecColumns>
      </SpecSection>

      <SpecSection id="system-truth" kicker="09.6 · Authority" title="Sources of truth">
        <SpecTable caption="Sources of truth" headers={["What", "Authority", "Consumers"]} rows={truthRows} codeFirst={false} />
        <SmallNote>Sync is one way: Git → Figma and Pencil, never back.</SmallNote>
      </SpecSection>

      <SpecSection id="system-findings" kicker="09.7 · For the design system team" title="Findings" intro={<p>These come from comparing the charter, the runbooks, the skills and the vault. Nothing has been changed.</p>}>
        <FindingList>
          <TaggedFinding id="system-f1" tag="F1 · NEEDS A DECISION" title="Two places claim to own token values">
            <p>The agent charter says Git token JSON is the source of truth. The Design Brain readme (a separate vault the app doesn’t use) says to sync official token JSON and CSS from AI Enabler with <code>design-system-token-sync</code>. The Hearst+ vault agrees with the charter: brand token JSON under <code>tokens/brands/</code> is canonical. <b>Fix:</b> name one authority and describe the other as a sync target, in both documents.</p>
          </TaggedFinding>
          <TaggedFinding id="system-f2" tag="F2 · DOC DRIFT" title="Eight roles in the charter, nine in the runbook, eight role skills">
            <p>The charter lists 8 roles. The runbook adds a Grid System agent, for 9. The 8 role skills include Grid System but have no Publication Stylist skill. <b>Fix:</b> add Grid System to the charter and either add a <code>hearst-publication-stylist</code> skill or fold that role into Token Architect.</p>
          </TaggedFinding>
          <TaggedFinding id="system-f3" tag="F3 · DOC DRIFT" title="Skills live in four places, and the charter names one">
            <p>The charter says local agent instructions live in <code>.cursor/skills/</code>. Skills also live in <code>.agents/skills/</code>, <code>hearst-design-system/.agents/skills/</code> and the vault (67 entry points), with no single index. <code>skills-lock.json</code> now records the source and version of the third-party skills (<code>handoff</code>, <code>oil-ui</code>, <code>token-mapping</code>), which is a start. <b>Fix:</b> add a skills registry to the charter: name, home, owner, and when to use it.</p>
          </TaggedFinding>
          <TaggedFinding id="system-f4" tag="F4 · COVERAGE" title="28 metadata files for 148 component files">
            <p>The review rules say new components need metadata and Storybook coverage. Some of the 148 files are sub-parts, so not every file needs its own metadata, but the gap is large. <b>Next step:</b> list the exported components without metadata and add them in small PRs.</p>
          </TaggedFinding>
          <TaggedFinding id="system-f5" tag="F5 · DECIDED" title="The Hearst+ vault and the Design Brain stay independent">
            <p>The app’s vault is what agents read; the Design Brain holds Hearst-wide principles, UX laws and 110 brand playbooks the app never sees. <b>Decision (2026-11-13):</b> the app does not use the Design Brain. <code>AGENTS.md</code> tells agents not to read, cite or copy from it; a missing rule is added to the repository vault instead.</p>
          </TaggedFinding>
        </FindingList>
      </SpecSection>
    </SpecChapter>
  );
}
