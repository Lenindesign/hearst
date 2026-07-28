import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Grid, type GridColumnCount } from "./grid";

function classNamesFor(columns?: React.ComponentProps<typeof Grid>["columns"]) {
  const markup = renderToStaticMarkup(
    React.createElement(Grid, {
      columns,
    }),
  );
  return markup.match(/class="([^"]+)"/)?.[1].split(" ") ?? [];
}

test("a single Grid column count remains fixed at every breakpoint", () => {
  for (let columns = 1; columns <= 12; columns += 1) {
    const count = columns as GridColumnCount;
    const classNames = classNamesFor(count);

    assert.ok(classNames.includes(`grid-cols-${count}`));
    assert.ok(classNames.includes(`md:grid-cols-${count}`));
    assert.ok(classNames.includes(`lg:grid-cols-${count}`));
  }
});

test("the default and responsive object keep the 4 / 8 / 12 contract", () => {
  assert.deepEqual(
    classNamesFor(),
    ["grid", "grid-cols-4", "md:grid-cols-8", "lg:grid-cols-12", "gap-4", "md:gap-5", "lg:gap-6"],
  );

  const classNames = classNamesFor({ base: 2, md: 6, lg: 10 });
  assert.ok(classNames.includes("grid-cols-2"));
  assert.ok(classNames.includes("md:grid-cols-6"));
  assert.ok(classNames.includes("lg:grid-cols-10"));
});
