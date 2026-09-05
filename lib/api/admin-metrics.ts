import { apiClient } from "./client";
import type { SystemUsageMetrics, UserUsageMetrics } from "@/types/admin";

export type AdminMetricsParams = {
  from?: string;
  to?: string;
};

export async function getSystemUsageMetrics(params: AdminMetricsParams = {}) {
  return (await apiClient.get<SystemUsageMetrics>("/api/v1/admin/metrics", { params })).data;
}

export async function getAdminUserUsageMetrics(id: number, params: AdminMetricsParams = {}) {
  return (await apiClient.get<UserUsageMetrics>(`/api/v1/admin/metrics/users/${id}`, { params })).data;
}
