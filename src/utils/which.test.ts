import { expect, test } from "bun:test";
import { which, whichSync } from "./which.js";
import { unlinkSync, existsSync } from "node:fs";

test("command injection async", async () => {
  if (existsSync("pwned_async_fix")) unlinkSync("pwned_async_fix");
  // Test both async and sync injection logic
  await which("node; touch pwned_async_fix");
  expect(existsSync("pwned_async_fix")).toBe(false);
});

test("command injection sync", () => {
  if (existsSync("pwned_sync_fix")) unlinkSync("pwned_sync_fix");
  whichSync("node; touch pwned_sync_fix");
  expect(existsSync("pwned_sync_fix")).toBe(false);
});

test("normal operation async", async () => {
  const result = await which("node");
  expect(result).toBeTruthy();
  expect(typeof result).toBe("string");
});

test("normal operation sync", () => {
  const result = whichSync("node");
  expect(result).toBeTruthy();
  expect(typeof result).toBe("string");
});
