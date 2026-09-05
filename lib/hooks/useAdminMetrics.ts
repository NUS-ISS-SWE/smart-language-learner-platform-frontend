"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminUserUsageMetrics, getSystemUsageMetrics } from "@/lib/api/admin-metrics";
import type { AdminMetricsParams } from "@/lib/api/admin-metrics";
import { adminKeys } from "./adminKeys";

export function useSystemUsageMetrics(params: AdminMetricsParams = {}) {
  return useQuery({
    queryKey: adminKeys.metrics(params),
    queryFn: () => getSystemUsageMetrics(params),
  });
}

export function useAdminUserUsageMetrics(userId: number, params: AdminMetricsParams = {}) {
  return useQuery({
    queryKey: adminKeys.userUsageMetrics(userId, params),
    queryFn: () => getAdminUserUsageMetrics(userId, params),
    enabled: userId > 0,
  });
}
