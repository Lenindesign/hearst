import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { validate } from "../../scripts/validate-tokens";
import { brands } from "./brands";

test("semantic promotion candidates preserve every publication mode", () => {
  const report = validate();

  assert.deepEqual(report.audit.componentTokens.promotable, [
    "component.hr.border.default -> palette.neutral.400",
    "component.rating.star.empty -> palette.neutral.600",
  ]);
  assert.equal(report.audit.componentTokens.promotionBlocked.length, 4);
  assert.match(
    report.audit.componentTokens.promotionBlocked.join("\n"),
    /component\.hr\.border\.brand.*car-and-driver/
  );
  assert.match(
    report.audit.componentTokens.promotionBlocked.join("\n"),
    /component\.rating\.star\.full.*delish/
  );
});

test("generated brand runtime preserves every supported component token", () => {
  for (const brand of brands) {
    const source = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "tokens", "brands", `${brand.slug}.json`), "utf8"),
    ) as Record<string, { type: string; value: string | number }>;
    const expected = Object.fromEntries(
      Object.entries(source)
        .filter(([key, token]) =>
          key.startsWith("component-") && (token.type === "color" || token.type === "number"))
        .map(([key, token]) => [key, token.value]),
    );

    assert.deepEqual(
      brand.componentTokens,
      expected,
      `${brand.name} runtime component tokens drifted from tokens/brands/${brand.slug}.json`,
    );
  }
});
