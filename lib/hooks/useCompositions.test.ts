import { describe, expect, it } from "vitest";
import { compositionId, compositionKeys, compositionRefetchInterval } from "./useCompositions";

describe("composition query helpers", () => {
  it("normalizes route IDs for cache keys and API calls", () => {
    expect(compositionId("42")).toBe(42);
    expect(compositionKeys.detail("42")).toEqual(["compositions", "detail", 42]);
  });

  it("polls only while an asynchronous review is underway", () => {
    expect(compositionRefetchInterval("REVIEWING")).toBe(3000);
    expect(compositionRefetchInterval("DRAFT")).toBe(false);
    expect(compositionRefetchInterval("REVIEWED")).toBe(false);
    expect(compositionRefetchInterval()).toBe(false);
  });
});
