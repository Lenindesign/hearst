import path from "node:path";
import { fileURLToPath } from "node:url";
import remarkGfmModule from "remark-gfm";

const remarkGfm = remarkGfmModule.default ?? remarkGfmModule;

const storybookDirectory = path.dirname(fileURLToPath(import.meta.url));

const config = {
  stories: [
    "../src/stories/{AgenticArchitecture,ComponentArchitecture,DesignersManifesto,FigmaIntegration,GridSystem,HearstOnboardingJourney,PencilIntegration,QAProcess,TemplateTokens,TokenNaming,TokenWorkflow,Toolbox,Welcome,WorkflowSetup}.mdx",
    "../src/stories/{Alert,ArticleCard,Avatar,Badge,Button,Chip,Colors,Divider,Grid,HearstPlusApp,HomePage,Input,Link,Switch,Textarea,Toggle,Tokens,Typography}.stories.@(ts|tsx)",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-themes",
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

    viteConfig.css ||= {};
    viteConfig.css.postcss = path.resolve(storybookDirectory, "..");

    if (process.env.STORYBOOK_BASE) {
      viteConfig.base = process.env.STORYBOOK_BASE;
    }

    return viteConfig;
  },
};

export default config;
