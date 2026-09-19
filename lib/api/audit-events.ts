import { apiClient } from "./client";
import type { AuditEvent, AuditEventsPage } from "@/types/admin";

export type AuditEventsParams = {
  readonly actorId?: string;
  readonly action?: string;
  readonly category?: string;
  readonly outcome?: AuditEvent["outcome"];
  readonly targetType?: string;
  readonly targetId?: string;
  readonly requestId?: string;
  readonly correlationId?: string;
  readonly from?: string;
  readonly to?: string;
  readonly page?: number;
  readonly size?: number;
};

export async function getAuditEvents(
  params: AuditEventsParams = {},
): Promise<AuditEventsPage> {
  return (
    await apiClient.get<AuditEventsPage>("/api/v1/admin/audit-events", {
      params,
    })
  ).data;
}
