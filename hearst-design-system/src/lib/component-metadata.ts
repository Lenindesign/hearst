/**
 * Component metadata schema for AI-readable design system specs.
 *
 * Each component in the system gets a .metadata.ts file that tells agents
 * WHAT the component does, WHEN to use it, WHAT tokens it consumes,
 * and HOW it composes with other components.
 *
 * Inspired by Cris Giorris's ai-component-metadata pattern.
 */

export type AtomicLevel = "atom" | "molecule" | "organism" | "template";

export interface TokenReference {
  /** CSS variable name, e.g. "--font-brand" or "--palette-brand-1" */
  variable: string;
  /** How it's consumed: "tailwind" | "css-var" | "class" */
  via: "tailwind" | "css-var" | "class";
  /** The Tailwind class or CSS expression, e.g. "bg-primary" or "var(--font-brand)" */
  usage: string;
}

export interface ComponentMetadata {
  /** Component display name */
  name: string;
  /** Short description — one sentence, what it does */
  description: string;
  /** Atomic design level */
  level: AtomicLevel;
  /** File path relative to src/components/ */
  path: string;
  /** Exported names from this file */
  exports: string[];

  /** WHEN to use this component */
  whenToUse: string[];
  /** WHEN NOT to use this component */
  whenNotToUse?: string[];

  /** Design tokens consumed by this component */
  tokens: {
    colors: TokenReference[];
    typography: TokenReference[];
    spacing: TokenReference[];
    borders: TokenReference[];
    other: TokenReference[];
  };

  /** Components this one depends on (imports) */
  dependencies: string[];
  /** Components that use this one */
  usedBy?: string[];

  /** Brand-aware: does the component change appearance per brand? */
  brandAware: boolean;
  /** Responsive: does it adapt across breakpoints? */
  responsive: boolean;

  /** Variants (CVA or manual), e.g. ["default", "destructive", "outline"] */
  variants?: string[];
  /** Slot names for composition, e.g. ["header", "content", "footer"] */
  slots?: string[];

  /** Known issues or limitations */
  caveats?: string[];

  /** Hardcoded values that should be tokenized (audit flag) */
  violations?: {
    type: "hardcoded-color" | "hardcoded-size" | "non-semantic-tailwind";
    value: string;
    location: string;
    severity: "error" | "warning";
  }[];
}

/**
 * Full design system index — the graph of all components.
 */
export interface DesignSystemIndex {
  generatedAt: string;
  totalComponents: number;
  componentsByLevel: Record<AtomicLevel, string[]>;
  components: Record<string, ComponentMetadata>;
  tokenCoverage: {
    totalTokensUsed: number;
    totalHardcodedValues: number;
    coveragePercent: number;
  };
}
