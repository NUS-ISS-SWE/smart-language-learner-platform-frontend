import { describe, expect, it } from "vitest";
import { formatCurrencyMinor, formatUsdMicros } from "@/lib/utils";

describe("currency formatters", () => {
  it("formats minor units in the supplied currency", () => {
    expect(formatCurrencyMinor(1299, "USD")).toContain("12.99");
  });

  it("preserves four decimal places for USD micros when needed", () => {
    expect(formatUsdMicros(12_345)).toContain("0.0123");
  });
});
