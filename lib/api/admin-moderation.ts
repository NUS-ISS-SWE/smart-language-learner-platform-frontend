import { apiClient } from "./client";
import type { ModerationQueueResponse } from "@/types/moderation";

export type ModerationQueueParams = {
  moderationStatus?: "ACTIVE" | "REMOVED";
  userId?: number;
  compositionSource?: string;
  language?: string;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
};

export async function getModerationQueue(params: ModerationQueueParams = {}) {
  return (
    await apiClient.get<ModerationQueueResponse>("/api/v1/admin/moderation", {
      params: { page: 0, size: 20, ...params },
    })
  ).data;
}
