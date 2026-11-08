import assert from "node:assert/strict";
import test from "node:test";
import { createElement, isValidElement } from "react";

import { canCapAlignLabel, capAlignButtonLabel } from "./button";

const icon = createElement("svg", { "aria-hidden": true });
const unlabeledElement = createElement("strong", null, "BOLD");

test("auto cap alignment trims only labels without descender glyphs", () => {
  assert.equal(canCapAlignLabel("SIGN IN"), true);
  assert.equal(canCapAlignLabel("Read the review"), true);
  assert.equal(canCapAlignLabel("XS"), true);
  assert.equal(canCapAlignLabel("Sign up"), false);
  assert.equal(canCapAlignLabel("Save story"), false);
  assert.equal(canCapAlignLabel("QUIZ"), false);
  assert.equal(canCapAlignLabel(null), false);
});

test("icons beside the text do not block cap alignment", () => {
  assert.equal(canCapAlignLabel(["Continue", icon]), true);
  assert.equal(canCapAlignLabel([icon, "Saved"]), true);
  assert.equal(canCapAlignLabel([icon, "Save story"]), false);
  assert.equal(canCapAlignLabel([icon]), false);
  assert.equal(canCapAlignLabel(["Read ", unlabeledElement]), false);
});

test("capAlignButtonLabel wraps only the text and keeps icons as siblings", () => {
  const parts = capAlignButtonLabel(["Continue", icon]) as unknown[];
  assert.equal(parts.length, 2);
  assert.ok(isValidElement(parts[0]));
  assert.equal((parts[0] as { props: { className: string } }).props.className, "hds-cap-aligned-label");
  assert.equal((parts[1] as { type: string }).type, "svg");
  assert.equal(capAlignButtonLabel("Sign up"), "Sign up");
  assert.equal(capAlignButtonLabel("Sign up", false), "Sign up");
});
