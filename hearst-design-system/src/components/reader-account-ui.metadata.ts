import type { ComponentMetadata } from "@/lib/component-metadata";

const metadata: ComponentMetadata = {
  name: "Reader Account UI",
  description:
    "Production Hearst+ avatar, local/Google authentication, and reader profile dialogs for preferences, library, comments, and account controls.",
  level: "organism",
  path: "reader-account-ui.tsx",
  exports: [
    "ReaderAvatar",
    "ReaderAvatarProps",
    "ReaderAuthDialog",
    "ReaderAuthDialogProps",
    "ReaderAuthMode",
    "ReaderProfileDialog",
    "ReaderProfileDialogProps",
  ],
  whenToUse: [
    "The Hearst+ application needs the production account sign-in or local-profile creation dialog",
    "A signed-in prototype reader needs to manage profile details, For You preferences, saved stories, collections, or comments",
    "A compact account entry needs the shared avatar initials or verified profile image",
  ],
  whenNotToUse: [
    "A surface needs personalization onboarding before account creation — use HearstOnboardingModal",
    "A component only needs account state or mutations — consume ReaderAccountProvider rather than recreating account UI",
    "A production system requires real account, consent, or access-control infrastructure — those integrations are explicitly outside this prototype",
  ],
  tokens: {
    colors: [
      { variable: "--background", via: "tailwind", usage: "dialog and form surfaces" },
      { variable: "--foreground", via: "tailwind", usage: "primary account content" },
      { variable: "--muted", via: "tailwind", usage: "selected navigation and secondary panels" },
      { variable: "--muted-foreground", via: "tailwind", usage: "storage and account-status explanations" },
      { variable: "--primary", via: "tailwind", usage: "active states, links, and selected preferences" },
      { variable: "--destructive", via: "tailwind", usage: "validation and confirmed deletion actions" },
      { variable: "--border", via: "tailwind", usage: "dialog, navigation, and collection boundaries" },
    ],
    typography: [
      { variable: "--text-token-4xs", via: "css-var", usage: "compact account and editorial labels" },
    ],
    spacing: [],
    borders: [],
    other: [],
  },
  dependencies: [
    "brand-logo",
    "hearst-plus/brand-source-icon",
    "lifestyle-river-types",
    "reader-account",
    "ui/accordion",
    "ui/avatar",
    "ui/button",
    "ui/icons",
    "ui/input",
    "ui/use-modal-isolation",
  ],
  usedBy: [
    "utility-bar",
    "home-page",
  ],
  brandAware: true,
  responsive: true,
  variants: [
    "avatar image",
    "avatar initials fallback",
    "local sign in",
    "local profile creation",
    "validation error",
    "Google-synced profile",
    "syncing and retryable sync error",
    "profile overview",
    "selected preferences",
    "library populated and empty",
    "comments populated and empty",
    "account update",
    "sign out",
    "confirmed account, collection, and comment deletion",
  ],
  caveats: [
    "Email profiles and their password hash remain browser-local prototype state; the UI must say so plainly.",
    "Google identity appears only when both configured production client and server verification are available; Storybook intentionally cannot execute Next.js account route handlers.",
    "The provider owns persistence and synchronization. Direct stories seed deterministic browser-local state only to render these exact production surfaces.",
    "Every phone account action keeps a minimum 44px target, and destructive actions require an explicit second activation with stable keyboard focus.",
    "Publication choices reuse BrandSourceIcon so remote asset failure preserves deterministic initials.",
  ],
};

export default metadata;
