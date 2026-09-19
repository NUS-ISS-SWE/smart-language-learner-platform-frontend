"use client";

import { useQuery } from "@tanstack/react-query";
import { getAuditEvents, type AuditEventsParams } from "@/lib/api/audit-events";
import { adminKeys } from "./adminKeys";

export function useAuditEvents(params: AuditEventsParams) {
  return useQuery({
    queryKey: adminKeys.auditEvents(params),
    queryFn: () => getAuditEvents(params),
  });
}
