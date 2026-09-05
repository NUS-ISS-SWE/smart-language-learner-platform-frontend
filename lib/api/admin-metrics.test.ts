import { beforeEach, describe, expect, it, vi } from "vitest";

const { get } = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock("./client", () => ({ apiClient: { get } }));

import { getAdminUserUsageMetrics, getSystemUsageMetrics } from "./admin-metrics";

describe("admin metrics API", () => {
  beforeEach(() => get.mockReset());

  it("sends selected dates to system metrics and returns its payload", async () => {
    const metrics = { summary: { totalUsers: 4 } };
    get.mockResolvedValueOnce({ data: metrics });

    await expect(getSystemUsageMetrics({ from: "2026-08-01", to: "2026-09-05" })).resolves.toBe(metrics);
    expect(get).toHaveBeenCalledWith("/api/v1/admin/metrics", {
      params: { from: "2026-08-01", to: "2026-09-05" },
    });
  });

  it("uses the user-specific metrics endpoint", async () => {
    const metrics = { userId: 42 };
    get.mockResolvedValueOnce({ data: metrics });

    await expect(getAdminUserUsageMetrics(42)).resolves.toBe(metrics);
    expect(get).toHaveBeenCalledWith("/api/v1/admin/metrics/users/42", { params: {} });
  });
});
