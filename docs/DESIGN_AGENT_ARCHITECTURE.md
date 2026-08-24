# HDS Design Agent System Architecture & Workflow

> **Transcribed & Synthesized from HDS Whiteboard Architecture**: Comprehensive breakdown of the 5 core system diagrams mapping the end-to-end product lifecycle, multi-subagent orchestration, FRE UI Kit foundations, 8-point governance firewall, and 4-track prototyping delivery model.

---

## Diagram 1: End-to-End Product Lifecycle & Intake Workflow

This diagram captures the macro flow from initial user/business needs down to production Jira tickets, highlighting how the **Design Constitution** guides the PRD and triggers the **Design Agent Prototype Engine**.

```mermaid
flowchart TD
    classDef inputStyle fill:#102A43,stroke:#102A43,color:#ffffff,font-weight:bold;
    classDef workbenchStyle fill:#F0F4F8,stroke:#2D75B9,color:#102A43;
    classDef prdStyle fill:#FFFBEA,stroke:#B9913F,color:#102A43,stroke-width:2px;
    classDef agentStyle fill:#EBF8FF,stroke:#2D75B9,color:#102A43,stroke-width:2px;
    classDef trackStyle fill:#FFFFFF,stroke:#627D98,color:#102A43;
    classDef reviewStyle fill:#F8FAFC,stroke:#102A43,color:#102A43,font-weight:bold;
    classDef jiraStyle fill:#E6FFFA,stroke:#087A68,color:#044E43,font-weight:bold;

    subgraph INTAKE_DISCOVERY ["01. Discovery & Strategy"]
        A["User / Business Context"] --> B["North Stars"]
        B --> C["Product Roadmap"]
        C --> D["Problem / Opportunity / JTBD"]
    end

    subgraph WORKBENCH ["02. Strategy Workbench"]
        D --> E["Workbench Synthesis"]
        E --> E1["Competitive Analysis"]
        E --> E2["Data Reporting & Analytics"]
        E --> E3["User & Market Research"]
        E --> E4["Design Constitution (.md)<br/>• DX Laws & Principles<br/>• Editorial Guardrails"]
    end

    subgraph PRD_STAGE ["03. PRD & Alignment"]
        E1 & E2 & E3 & E4 --> F["PRD (Product Requirements Document)<br/>• Benchmark Metrics<br/>• OKRs & Success Criteria<br/>• Design Review Gates<br/>• Engineering Reward Criteria"]
    end

    subgraph AGENT_EXECUTION ["04. Prototyping Engine"]
        F -->|"Calls Design Agent"| G["PROTOTYPE ENGINE<br/>(Design Agent Orchestration)"]
        G --> H1["Track 1: Exploratory UX - 01"]
        G --> H2["Track 2: Branded Concept"]
        G --> H3["Track 3: Tech Spike"]
        G --> H4["Track 4: Delivery Candidate"]
    end

    subgraph DUAL_REVIEW ["05. Triage & Dual Review"]
        H1 & H2 & H3 & H4 --> I1["Designer Review"]
        H1 & H2 & H3 & H4 --> I2["Engineering Review"]
    end

    subgraph EXECUTION ["06. Intake Approval & Execution"]
        I1 & I2 --> J["INTAKE APPROVED"]
        J --> K["Scoped by 3 Disciplines<br/>(Design + Product + Engineering)"]
        K --> L["JIRA TICKETS (Production Delivery)"]
    end

    class A,B,C,D inputStyle;
    class E,E1,E2,E3,E4 workbenchStyle;
    class F prdStyle;
    class G agentStyle;
    class H1,H2,H3,H4 trackStyle;
    class I1,I2,J reviewStyle;
    class K,L jiraStyle;
```

---

## Diagram 2: Multi-Agent Subagent Orchestration Architecture

This diagram details the internal orchestration of the **Design Agent**, fanning out from a centralized `Context + Intake` node into three specialized domain subagents (**HDS**, **Brand**, **Surface**), converging through the **Governance Subagent**, and escalating to the **Human Reviewer**.

```mermaid
flowchart TD
    classDef headerStyle fill:#102A43,stroke:#102A43,color:#ffffff,font-weight:bold;
    classDef subagentStyle fill:#F0F4F8,stroke:#2D75B9,color:#102A43;
    classDef govStyle fill:#FFF5F5,stroke:#E12D39,color:#61040D,stroke-width:2px;
    classDef humanStyle fill:#102A43,stroke:#102A43,color:#ffffff,font-weight:bold;
    classDef haveStyle fill:#E6FFFA,stroke:#087A68,color:#044E43;
    classDef needStyle fill:#FFFBEA,stroke:#D97706,color:#78350F,stroke-dasharray: 4 4;

    ROOT["Context + Intake Gateway"]

    subgraph DOMAIN_SUBAGENTS ["Specialized Domain Subagents"]
        direction TB

        subgraph HDS_AGENT ["HDS Subagent (System Foundations)"]
            HDS1["① Whitelabel Tokens ● HAVE"]
            HDS2["② Existing Components ● HAVE"]
            HDS3["③ Extended Components ● HAVE"]
            HDS4["④ Pattern Library ○ NEED"]
            HDS5["⑤ Interaction / Motion ● HAVE"]
        end

        subgraph BRAND_AGENT ["Brand Subagent (Storybook / Identity)"]
            BR1["① Strategy - MKT ● HAVE"]
            subgraph BRAND_STYLE ["② Style Guide Sub-dimensions"]
                BR2["↳ Typography"]
                BR3["↳ Color"]
                BR4["↳ Images / Photography"]
                BR5["↳ Voice / Tone"]
                BR6["↳ CTAs"]
                BR7["↳ Space / Grid"]
                BR8["↳ Iconography / Graphics"]
            end
        end

        subgraph SURFACE_AGENT ["Surface Subagent (Destinations & Channels)"]
            SF1["• Newsletters & Email"]
            SF2["• Websites & Portals"]
            SF3["• Native Apps (iOS / Android)"]
            SF4["• Checkout & 3PP Funnels"]
            SF5["• 3rd Party Platforms / Syndication"]
            SF6["• Ads & Sponsorship Units *"]
            SF7["• Video Players (16:9 / 9:16) *"]
            SF8["• Interruptions, Alerts, Popups"]
            SF9["• Sticky UI / Toolbars"]
            SF10["• Commerce & Affiliate Lifts *"]
        end
    end

    subgraph GOVERNANCE ["Governance Subagent (8-Point Quality Gate)"]
        direction TB
        G1["① Accessibility (WCAG AA)"]
        G2["② Mobile-First Density"]
        G3["③ Token Versioning"]
        G4["④ Realistic Content Check (No Lorem Ipsum, No Gray Box)"]
        G5["⑤ Character Limits & Clamping (Headline / Dek)"]
        G6["⑥ Ad Ratio Guardrails"]
        G7["⑦ Core Web Vitals (CLS & Performance)"]
        G8["⑧ SEO & Semantic Structure"]
    end

    HUMAN["Human Reviewer (Design & Eng Sign-Off)"]

    ROOT --> HDS_AGENT
    ROOT --> BRAND_AGENT
    ROOT --> SURFACE_AGENT

    HDS_AGENT --> GOVERNANCE
    BRAND_AGENT --> GOVERNANCE
    SURFACE_AGENT --> GOVERNANCE

    HDS4 -.->|"Composes"| BRAND_STYLE

    GOVERNANCE --> HUMAN

    class ROOT headerStyle;
    class HDS_AGENT,BRAND_AGENT,SURFACE_AGENT subagentStyle;
    class GOVERNANCE govStyle;
    class HUMAN humanStyle;
```

---

## Diagram 3: FRE UI Kit & Editorial Modes Foundation

This diagram illustrates the underlying **FRE UI Kit** technical stack (ShadCN, Base UI, token reactivity, naming conventions, and Tailwind delivery) powering the HDS Subagent and driving the **Editorial Modes** across navigation and page archetypes.

```mermaid
flowchart LR
    classDef kitStyle fill:#102A43,stroke:#102A43,color:#ffffff,font-weight:bold;
    classDef stackStyle fill:#F0F4F8,stroke:#2D75B9,color:#102A43;
    classDef modeStyle fill:#FFFBEA,stroke:#B9913F,color:#102A43;
    classDef outputStyle fill:#E6FFFA,stroke:#087A68,color:#044E43;

    subgraph FRE_KIT ["FRE UI KIT (Core Infrastructure)"]
        K1["ShadCN Base Primitives"]
        K2["Base UI FX & Interactivity"]
        K3["Token Reactivity (Style Dictionary)"]
        K4["Strict Naming Conventions & Opinions"]
        K5["Component Library Authority"]
        K6["Tailwind Delivery System"]
    end

    subgraph EDITORIAL_MODES ["Editorial Modes & Archetype Rules"]
        direction TB
        subgraph NAV_MODES ["Global Navigation Modes"]
            N1["• Slim Mode (Utility-focused)"]
            N2["• Search-Heavy Mode (Discovery)"]
            N3["• Standard Mode (Brand + Categories)"]
            N4["• Mega Menu Mode (Full Network)"]
        end

        subgraph PAGE_MODES ["Homepage & Header Modes"]
            P1["• Newsy / Dense Mode (Rapid Scanning)"]
            P2["• Photo-Heavy / Immersive Mode (Visual Mosaic)"]
            P3["• Product-Heavy / Utility Mode (Commerce & Lab Tests)"]
        end
    end

    subgraph HDS_OUTPUT ["HDS Subagent Outputs"]
        O1["Whitelabel Tokens ● HAVE"]
        O2["Existing Components ● HAVE"]
        O3["Extended Components ● HAVE"]
        O4["Pattern Library ○ NEED"]
        O5["Interaction / Motion ● HAVE"]
    end

    FRE_KIT --> EDITORIAL_MODES
    EDITORIAL_MODES --> HDS_OUTPUT

    class FRE_KIT kitStyle;
    class K1,K2,K3,K4,K5,K6 stackStyle;
    class NAV_MODES,PAGE_MODES,N1,N2,N3,N4,P1,P2,P3 modeStyle;
    class HDS_OUTPUT,O1,O2,O3,O4,O5 outputStyle;
```

---

## Diagram 4: Governance Subagent 8-Point Compliance Firewall

This diagram breaks down the 8 automated checks enforced by the **Governance Subagent** before any design or code artifact can be presented to the human reviewer.

```mermaid
flowchart TD
    classDef checkPass fill:#E6FFFA,stroke:#087A68,color:#044E43,stroke-width:2px;
    classDef checkWarn fill:#FFFBEA,stroke:#D97706,color:#78350F,stroke-width:2px;
    classDef checkFail fill:#FFF5F5,stroke:#E12D39,color:#61040D,stroke-width:2px;
    classDef summaryStyle fill:#102A43,stroke:#102A43,color:#ffffff,font-weight:bold;

    INPUT["Candidate Component / Layout / Token Spec"] --> GATE["GOVERNANCE SUBAGENT FIREWALL"]

    subgraph G_CHECKS ["The 8 Automated Verification Checks"]
        direction TB

        C1["01. Accessibility (WCAG AA)<br/>• Contrast ratio >= 4.5:1<br/>• Keyboard focus traps & ARIA landmarks"]
        C2["02. Mobile-First Density<br/>• Touch targets >= 44px<br/>• Responsive typographic scaling"]
        C3["03. Token Versioning<br/>• Schema compliance (Style Dictionary)<br/>• Zero hardcoded hex colors or fonts"]
        C4["04. Realistic Content Check<br/>• NO LOREM IPSUM (Strict)<br/>• NO GRAY PLACEHOLDER BOXES<br/>• Real photography & authentic headlines"]
        C5["05. Character Limits & Line Clamping<br/>• Headline max 3 lines with ellipsis<br/>• Dek summary 2-3 lines clamp"]
        C6["06. Ad Ratio Guardrails<br/>• Max 1 ad per 3 content units<br/>• Non-interruptive stream placement"]
        C7["07. Core Web Vitals & CLS<br/>• Explicit aspect ratios (16:9, 9:16, 1:1)<br/>• Zero layout shifting on media load"]
        C8["08. SEO & Semantic Structure<br/>• Single h1, structured h2/h3 hierarchy<br/>• OpenGraph metadata & JSON-LD"]
    end

    GATE --> G_CHECKS

    G_CHECKS --> DECISION{"All 8 Checks Passed?"}
    DECISION -->|"YES"| PASS["Escalate to Human Reviewer (Ready for Approval)"]
    DECISION -->|"NO"| REJECT["Reject to Domain Subagent with Automated Diff & Fix Instructions"]

    class INPUT,GATE,DECISION summaryStyle;
    class C1,C2,C3,C4,C5,C6,C7,C8 checkPass;
    class PASS checkPass;
    class REJECT checkFail;
```

---

## Diagram 5: 4-Track Prototyping, Triage & Execution Model

This diagram illustrates how the Design Agent's prototype output is triaged into 4 distinct candidate tracks, reviewed by cross-functional disciplines, and translated into production-ready Jira tickets.

```mermaid
flowchart TD
    classDef engineStyle fill:#102A43,stroke:#102A43,color:#ffffff,font-weight:bold;
    classDef trackStyle fill:#F0F4F8,stroke:#2D75B9,color:#102A43;
    classDef triageStyle fill:#FFFBEA,stroke:#B9913F,color:#102A43,font-weight:bold;
    classDef prodStyle fill:#E6FFFA,stroke:#087A68,color:#044E43,font-weight:bold;

    TRIGGER["PRD Approved / Calls Design Agent"] --> ENGINE["PROTOTYPE GENERATION ENGINE"]

    subgraph TRACKS ["4 Specialized Candidate Tracks"]
        T1["Track A: Exploratory UX - 01<br/>• Multi-layout alternatives<br/>• Interaction variations (Curator vs. Mosaic vs. Stream)"]
        T2["Track B: Branded Concept<br/>• High-fidelity 29+ brand token application<br/>• Typography, color, and editorial voice"]
        T3["Track C: Tech Spike<br/>• Component reactivity & performance benchmarks<br/>• Media streaming (HLS/MP4) & state persistence"]
        T4["Track D: Delivery Candidate<br/>• Production-ready React/TypeScript code<br/>• Zero lint errors & WCAG AA verification"]
    end

    ENGINE --> T1 & T2 & T3 & T4

    subgraph TRIAGE ["Cross-Disciplinary Dual Review"]
        T1 & T2 & T3 & T4 --> DR["Designer Review<br/>(Aesthetic, Optical Pacing, Brand Voice)"]
        T1 & T2 & T3 & T4 --> ER["Engineering Review<br/>(Architecture, TypeScript, Bundle Size)"]
    end

    DR & ER --> AP["INTAKE APPROVED"]

    subgraph FINAL_SCOPING ["Tri-Discipline Scoping & Production"]
        AP --> SC["Scoped by 3 Disciplines<br/>[ Design Lead + Product Manager + Tech Lead ]"]
        SC --> JIRA["JIRA TICKETS<br/>• Component Tasks<br/>• Token PRs<br/>• Release Milestones"]
    end

    class TRIGGER,ENGINE engineStyle;
    class T1,T2,T3,T4 trackStyle;
    class DR,ER,AP triageStyle;
    class SC,JIRA prodStyle;
```

---

## Summary Capability Matrix (Whiteboard Status Legend)

| Subsystem | Capability Area | Status on Whiteboard | Implementation Path |
| :--- | :--- | :--- | :--- |
| **HDS Subagent** | Whitelabel Tokens | **● HAVE** | Style Dictionary `tokens/` JSON sets |
| **HDS Subagent** | Existing Components | **● HAVE** | `src/components/ui/` & Radix primitives |
| **HDS Subagent** | Extended Components | **● HAVE** | `src/components/hearst-plus/` modules |
| **HDS Subagent** | Pattern Library | **○ NEED** | Formal HDS Pattern Library & Composition Guidelines |
| **HDS Subagent** | Interaction / Motion | **● HAVE** | Embla transitions, CSS custom properties, dialog focus traps |
| **Brand Subagent** | Strategy - MKT | **● HAVE** | Brand value props & publication personas |
| **Brand Subagent** | Style Guide (7 sub-dimensions) | **● HAVE** | Typography, Color, Photography, Voice, CTAs, Space, Graphics |
| **Surface Subagent** | 10 Distribution Surfaces | **● HAVE / IN PROGRESS** | Web, Mobile, Video (16:9/9:16), Commerce, Newsletters |
| **Governance Subagent** | 8-Point Compliance Gate | **● HAVE** | TypeScript, ESLint, WCAG AA, No Lorem Ipsum, CLS checks |
| **Prototyping** | 4-Track Output Model | **● HAVE** | Exploratory UX, Branded Concept, Tech Spike, Delivery Candidate |
