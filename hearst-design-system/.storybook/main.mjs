import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import remarkGfmModule from "remark-gfm";

const remarkGfm = remarkGfmModule.default ?? remarkGfmModule;

const storybookDirectory = path.dirname(fileURLToPath(import.meta.url));

const config = {
  stories: [
    "../src/stories/**/*.mdx",
    "../src/stories/**/*.stories.@(ts|tsx)",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-themes",
    "@storybook/addon-a11y",
    "@storybook/experimental-addon-test",
    {
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],
  // Dimensional drawings and motion films for spec stories (Grid System, CTA).
  // Stories reference them relatively ("specs/…") so the deployed /storybook/ subpath works.
  staticDirs: [{ from: "../public/specs", to: "/specs" }],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (viteConfig) => {
    viteConfig.resolve ||= {};
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      "@": path.resolve(storybookDirectory, "../src"),
      "next/image": path.resolve(storybookDirectory, "mocks/next-image.tsx"),
      "next/link": path.resolve(storybookDirectory, "mocks/next-link.tsx"),
      "next/navigation": path.resolve(storybookDirectory, "mocks/next-navigation.ts"),
    };

    viteConfig.define = {
      ...viteConfig.define,
      "process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID": JSON.stringify(
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""
      ),
      "process.env.NEXT_PUBLIC_HEARST_STAKEHOLDER_TOOLS": JSON.stringify(
        process.env.NEXT_PUBLIC_HEARST_STAKEHOLDER_TOOLS ?? ""
      ),
      "process.env.NEXT_PUBLIC_STORYBOOK_URL": JSON.stringify(
        process.env.NEXT_PUBLIC_STORYBOOK_URL ?? ""
      ),
    };

    viteConfig.optimizeDeps ||= {};
    viteConfig.optimizeDeps.include = [
      ...(viteConfig.optimizeDeps.include ?? []),
      "@base-ui/react/accordion",
      "@base-ui/react/select",
      "@base-ui/react/tabs",
      "embla-carousel-react",
    ];

    viteConfig.css ||= {};
    viteConfig.css.postcss = path.resolve(storybookDirectory, "..");

    // The visual regression build (`npm run test:visual`) renders the frozen
    // feed edition in tests/visual-fixtures/ instead of the daily snapshot the
    // feed workflow rewrites, so its baselines only change when a story does.
    if (process.env.STORYBOOK_VISUAL_FIXTURES === "1") {
      const projectRoot = path.resolve(storybookDirectory, "..");
      const manifest = JSON.parse(
        readFileSync(path.join(projectRoot, "tests/visual-fixtures/manifest.json"), "utf8")
      );
      const frozenByLivePath = new Map(
        manifest.files.map((file) => [
          path.join(projectRoot, file),
          path.join(projectRoot, "tests/visual-fixtures", path.basename(file)),
        ])
      );
      viteConfig.plugins = [
        {
          name: "hearst-visual-fixtures",
          enforce: "pre",
          load(id) {
            const frozenPath = frozenByLivePath.get(id.split("?")[0]);
            return frozenPath ? readFileSync(frozenPath, "utf8") : null;
          },
        },
        ...(viteConfig.plugins ?? []),
      ];
    }

    if (process.env.STORYBOOK_BASE) {
      viteConfig.base = process.env.STORYBOOK_BASE;
    }

    return viteConfig;
  },
};

export default config;
