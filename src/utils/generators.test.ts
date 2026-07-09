import { test, expect } from "bun:test";
import { all } from "./generators.ts";

test("all() yields all values concurrently", async () => {
  async function* gen1() {
    yield 1;
    yield undefined;
    yield 3;
  }

  async function* gen2() {
    yield null;
    yield false;
  }

  const result = [];
  for await (const val of all([gen1(), gen2()])) {
    result.push(val);
  }

  expect(result.length).toBe(5);
  expect(result).toContain(1);
  expect(result).toContain(undefined);
  expect(result).toContain(3);
  expect(result).toContain(null);
  expect(result).toContain(false);
});
