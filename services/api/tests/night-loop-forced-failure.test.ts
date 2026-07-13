import { describe, it, expect } from "vitest";

describe("night-loop forced failure smoke test", () => {
  it("intentionally fails (Phase 2-1 retry-path verification)", () => {
    expect(1).toBe(2);
  });
});
