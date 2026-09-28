"use client";

import { useQuery } from "@tanstack/react-query";
import { getModerationQueue, type ModerationQueueParams } from "@/lib/api/admin-moderation";
import { adminKeys } from "./adminKeys";

export function useAdminModeration(params: ModerationQueueParams = {}) {
  return useQuery({
    queryKey: adminKeys.moderation(params),
    queryFn: () => getModerationQueue(params),
  });
}
