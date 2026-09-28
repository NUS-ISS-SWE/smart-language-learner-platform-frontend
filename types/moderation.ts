import type {
  CompositionLanguage,
  CompositionSource,
  CompositionStatus,
  ModerationReasonCategory,
  ModerationStatus,
} from "@/types/composition";

export type ModerationAction = "REMOVE" | "RESTORE";

export type ModerationQueueItem = {
  compositionId: number;
  userId: number;
  username: string;
  title: string | null;
  compositionSource: CompositionSource;
  language: CompositionLanguage;
  compositionStatus: CompositionStatus;
  moderationStatus: ModerationStatus;
  reasonCategory: ModerationReasonCategory | null;
  reasonNote: string | null;
  createdAt: string;
  moderatedAt: string | null;
};

export type ModerationQueueResponse = {
  items: ModerationQueueItem[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export type { ModerationReasonCategory };
