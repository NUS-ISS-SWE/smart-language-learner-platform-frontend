export type AdminUser = {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  preferredLanguage: string;
  difficultyLevel: string;
  aiTokenBalance: number;
  aiTokenUsed: number;
  createdAt: string;
  deletedAt: string | null;
};

export type AdminUsersPage = {
  content: AdminUser[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

export type UpdateStatusRequest = {
  status: string;
};

export type UpdateRoleRequest = {
  role: string;
};

export type DailyUsageMetric = {
  date: string;
  newUsers: number;
  compositionsCreated: number;
  successfulReviews: number;
  documentsUploaded: number;
  aiTokensUsed: number;
  estimatedAiCostMicros: number;
};

export type SystemUsageMetrics = {
  from: string;
  to: string;
  summary: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    compositionsCreated: number;
    activeLearners: number;
    reviewRequests: number;
    successfulReviews: number;
    failedReviews: number;
    averageReviewLatencyMillis: number | null;
    documentsUploaded: number;
    documentsProcessed: number;
    documentsReady: number;
    documentsFailed: number;
    totalAiTokensUsed: number;
    aiTokensUsed: number;
    estimatedAiCostMicros: number;
  };
  daily: DailyUsageMetric[];
  retentionCohorts: RetentionCohortMetric[];
};

export type RetentionCohortMetric = {
  cohortStart: string;
  cohortSize: number;
  week0Retained: number;
  week1Retained: number;
  week2Retained: number;
  week3Retained: number;
  week4Retained: number;
};

export type UserUsageMetrics = {
  userId: number;
  from: string;
  to: string;
  summary: {
    activeDays: number;
    compositionsCreated: number;
    reviewRequests: number;
    successfulReviews: number;
    failedReviews: number;
    documentsUploaded: number;
    documentsReady: number;
    documentsFailed: number;
    aiTokensUsed: number;
    estimatedAiCostMicros: number;
    lastActivityAt: string | null;
  };
  daily: DailyUsageMetric[];
};
