import { test, expect } from "bun:test";
import { which, whichSync } from "./which.ts";

test("which detects node asynchronously", async () => {
  const result = await which("node");
  expect(result).not.toBeNull();
  expect(result).toContain("node");
});

test("whichSync detects node synchronously", () => {
  const result = whichSync("node");
  expect(result).not.toBeNull();
  expect(result).toContain("node");
});

test("which does not throw on injected command", async () => {
  const result = await which("node; echo injection");
  expect(result).toBeNull();
});

test("whichSync does not throw on injected command", () => {
  const result = whichSync("node; echo injection");
  expect(result).toBeNull();
});
