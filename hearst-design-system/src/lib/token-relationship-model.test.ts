import assert from "node:assert/strict";
import test from "node:test";
import {
  buildRelationshipChains,
  canonicalizeTokenPath,
  flattenTokenTree,
  tokenReference,
} from "./token-relationship-model";

test("flattens nested token trees without treating audit metadata as tokens", () => {
  const tokens = flattenTokenTree(
    {
      _audit: { totalTokens: 1 },
      palette: { primary: { "1000": { type: "color", value: "{_palette.blue.9}" } } },
    },
    "palette.json"
  );

  assert.deepEqual(tokens, [
    {
      path: "palette.primary.1000",
      canonicalName: "palette-primary-1000",
      source: "palette.json",
      type: "color",
      value: "{_palette.blue.9}",
    },
  ]);
});

test("builds a core to semantic to component to resolved brand chain", () => {
  const core = flattenTokenTree(
    { palette: { blue: { "9": { type: "color", value: "#03112b" } } } },
    "core/color.json"
  );
  const semantic = flattenTokenTree(
    { palette: { primary: { "1000": { type: "color", value: "{_palette.blue.9}" } } } },
    "semantic/color/palette.json"
  );
  const component = flattenTokenTree(
    {
      component: {
        button: {
          background: {
            primary: { "solid-default": { type: "color", value: "{palette.primary.1000}" } },
          },
        },
      },
    },
    "semantic/component/tokens.json"
  );

  const [chain] = buildRelationshipChains({
    coreTokens: core,
    semanticTokens: semantic,
    componentTokens: component,
    brandTokens: {
      "component-button-background-primary-solid-default": { type: "color", value: "#0d5bd9" },
    },
    brandSource: "brands/autoweek.json",
  });

  assert.equal(chain.core?.canonicalName, "palette-blue-9");
  assert.equal(chain.semantic.canonicalName, "palette-primary-1000");
  assert.equal(chain.component.canonicalName, "component-button-background-primary-solid-default");
  assert.equal(chain.brand?.value, "#0d5bd9");
  assert.equal(tokenReference(chain.component.value), "palette.primary.1000");
  assert.equal(canonicalizeTokenPath("_palette.blue.9"), "palette-blue-9");
});
