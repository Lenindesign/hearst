import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "Reader Account Provider",
  description:
    "Non-visual Hearst+ prototype account infrastructure for browser-local sessions, reader preferences, saved-story collections, comments, and optional Google-profile synchronization.",
  level: "molecule",
  path: "reader-account.tsx",
  exports: [
    "ReaderAccountProvider",
    "useReaderAccount",
  ],
  whenToUse: [
    "The Hearst+ application tree needs the shared reader-account state and mutation contract",
    "A production-owned account surface needs browser-local prototype sessions, preferences, collections, comments, or sync status",
    "Storybook needs the same provider boundary mounted by the routed application",
  ],
  whenNotToUse: [
    "A surface needs account presentation — use ReaderAccountUI rather than inventing provider UI",
    "A product requires production authentication, authorization, consent, retention, account recovery, or durable deletion",
    "A non-Hearst+ component only needs isolated local state and does not participate in the shared reader contract",
  ],
  tokens: {
    colors: [],
    typography: [],
    spacing: [],
    borders: [],
    other: [],
  },
  dependencies: [
    "lifestyle-river-types",
  ],
  usedBy: [
    "utility-bar",
    "home-page",
    "reader-account-ui",
  ],
  brandAware: false,
  responsive: false,
  variants: [
    "hydrating",
    "signed out",
    "browser-local session",
    "syncing",
    "synced",
    "retryable sync error",
  ],
  slots: [
    "application children",
  ],
  caveats: [
    "This is prototype infrastructure, not a production identity service. Local profiles and their SHA-256 password hash are stored in browser localStorage; hashing alone does not make client-side credential storage production-safe.",
    "The reader-profile route accepts the opaque sync id as its access key and does not implement a server session, authorization check, consent record, retention policy, recovery flow, or remote-account deletion.",
    "Deleting an account clears only the current browser copy. A previously synchronized prototype profile remains in remote or local server storage and can return after Google sign-in.",
    "Google credentials are verified by the server route before a sync id is returned, but the wider profile persistence contract still needs production security and privacy review.",
    "The provider is mounted by both the root application layout and the global Storybook decorator. Story fixtures may seed deterministic localStorage state but must never represent that state as a production account.",
  ],
  storybook: {
    kind: "infrastructure",
    stories: [],
    rationale:
      "ReaderAccountProvider has no visual output. The official Reader Account stories directly specify the production ReaderAuthDialog, ReaderProfileDialog, and ReaderAvatar consumers, while provider normalization and merge rules are exercised in reader-account-model tests. A standalone provider story would manufacture UI and duplicate the real account surfaces.",
  },
};

export default metadata;
