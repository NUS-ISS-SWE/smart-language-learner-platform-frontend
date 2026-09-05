import { describe, expect, it } from "vitest";
import { normalizeMetricsDateRange } from "@/lib/metrics-date-range";

describe("normalizeMetricsDateRange", () => {
  const today = "2026-09-05";

  it("defaults to the last 30 calendar days", () => {
    expect(normalizeMetricsDateRange(null, null, today)).toEqual({
      from: "2026-08-07",
      to: today,
      earliestAllowedFrom: "2025-09-05",
    });
  });

  it("clamps an oversized range to the inclusive backend limit", () => {
    expect(normalizeMetricsDateRange("2020-01-01", today, today)).toMatchObject({
      from: "2025-09-05",
      to: today,
    });
  });

  it("rejects invalid, future, and reversed URL parameters", () => {
    expect(normalizeMetricsDateRange("not-a-date", "2030-01-01", today)).toMatchObject({
      from: "2026-08-07",
      to: today,
    });
    expect(normalizeMetricsDateRange("2026-09-04", "2026-09-01", today)).toMatchObject({
      from: "2026-09-01",
      to: "2026-09-01",
    });
  });
});
