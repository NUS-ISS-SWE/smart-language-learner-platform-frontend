import type { AdminMetricsParams } from "@/lib/api/admin-metrics";
import type { AdminUsersParams } from "@/lib/api/admin-users";
import type { AuditEventsParams } from "@/lib/api/audit-events";
import type { ModerationQueueParams } from "@/lib/api/admin-moderation";

export const adminKeys = {
  all: ["admin"] as const,
  lists: () => [...adminKeys.all, "list"] as const,
  list: (params: AdminUsersParams) => [...adminKeys.lists(), params] as const,
  details: () => [...adminKeys.all, "detail"] as const,
  detail: (id: number) => [...adminKeys.details(), id] as const,
  userCompositions: (userId: number) => [...adminKeys.all, "compositions", userId] as const,
  userDocuments: (userId: number) => [...adminKeys.all, "documents", userId] as const,
  metrics: (params: AdminMetricsParams) => [...adminKeys.all, "metrics", params] as const,
  userUsageMetrics: (userId: number, params: AdminMetricsParams) =>
    [...adminKeys.all, "user-usage-metrics", userId, params] as const,
  auditEvents: (params: AuditEventsParams) =>
    [...adminKeys.all, "audit-events", params] as const,
  moderation: (params: ModerationQueueParams) =>
    [...adminKeys.all, "moderation", params] as const,
};
