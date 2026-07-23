import type { Preview } from "@storybook/react";
import { themeOptions } from "../src/lib/theme-options";
import { ThemeDecorator } from "./ThemeDecorator";
import { hearstPlusStorybookTheme } from "./swiss-theme";
import "../src/app/globals.css";

declare global {
  interface Window {
    __hearstStorybookOriginalFetch?: typeof fetch;
    __hearstStorybookImageSrcPatched?: boolean;
  }
}

if (typeof window !== "undefined" && !window.__hearstStorybookOriginalFetch) {
  const originalFetch = window.fetch.bind(window);
  window.__hearstStorybookOriginalFetch = originalFetch;
  window.fetch = (input, init) => {
    const requestUrl =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input.url;
    const url = new URL(requestUrl, window.location.href);

    if (url.origin === window.location.origin && url.pathname.startsWith("/api/")) {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            error: "Next.js route handlers are intentionally unavailable in static Storybook.",
          }),
          {
            status: 503,
            headers: {
              "content-type": "application/json",
              "x-hearst-storybook-boundary": "static-catalog",
            },
          }
        )
      );
    }

    return originalFetch(input, init);
  };
}

if (typeof window !== "undefined" && !window.__hearstStorybookImageSrcPatched) {
  const imageSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");

  if (imageSrc?.get && imageSrc.set) {
    Object.defineProperty(HTMLImageElement.prototype, "src", {
      configurable: imageSrc.configurable,
      enumerable: imageSrc.enumerable,
      get: imageSrc.get,
      set(value: string) {
        const url = new URL(value, window.location.href);
        const resolvedValue =
          url.origin === window.location.origin && url.pathname === "/_next/image/"
            ? url.searchParams.get("url") ?? value
            : value;

        imageSrc.set?.call(this, resolvedValue);
      },
    });
    window.__hearstStorybookImageSrcPatched = true;
  }
}

const brandOptions = themeOptions.reduce(
  (acc, b) => ({ ...acc, [b.name]: b.slug }),
  {} as Record<string, string>
);

const preview: Preview = {
  globalTypes: {
    brand: {
      name: "Brand",
      description: "Hearst publication theme",
      toolbar: {
        icon: "paintbrush",
        items: Object.keys(brandOptions).map((name) => ({
          value: brandOptions[name],
          title: name,
        })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    brand: "hearst-all",
  },
  decorators: [ThemeDecorator],
  parameters: {
    layout: "centered",
    a11y: {
      test: "error",
    },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    backgrounds: { disable: true },
    docs: {
      theme: hearstPlusStorybookTheme,
    },
    options: {
      storySort: {
        order: [
          "Hearst Plus",
          [
            "Start",
            ["Overview", "Architecture", "Component Architecture", "Technology Stack", "Designer Principles"],
            "Product",
            ["For You Feed", "Onboarding Journey"],
            "Components",
            ["Inventory", "Navigation", "Editorial Cards", "Video Cards", "HDS HP Modules", "Reader Overlays"],
            "Foundation",
            ["Grid System", "Colors", "Typography", "Tokens", "Tailwind + shadcn", "Token Naming", "Token Usage"],
            "HDS Primitives",
            "Templates",
            "Delivery",
            ["Workflow", "Token Workflow", "Figma", "Pencil", "Quality"],
          ],
        ],
      },
    },
  },
};

export default preview;
