import assert from "node:assert/strict";
import test from "node:test";

import {
  LOCAL_STORYBOOK_URL,
  PROD_STORYBOOK_URL,
  STORYBOOK_OVERVIEW_PATH,
} from "./storybook-links";

test("local and production Storybook links share the current overview entry", () => {
  assert.equal(
    new URL(LOCAL_STORYBOOK_URL).searchParams.get("path"),
    STORYBOOK_OVERVIEW_PATH
  );
  assert.equal(
    new URL(PROD_STORYBOOK_URL).searchParams.get("path"),
    STORYBOOK_OVERVIEW_PATH
  );
  assert.equal(new URL(PROD_STORYBOOK_URL).pathname, "/storybook/");
});
