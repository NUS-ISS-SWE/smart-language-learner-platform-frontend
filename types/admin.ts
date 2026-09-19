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
    averageReviewLatencyMillis?: number | null;
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
  workflowReliability: WorkflowReliabilityMetric;
  agentMetrics: AgentMetrics[];
};

export type RetentionCohortMetric = {
  cohortStart: string;
  cohortSize: number;
  week0Retained?: number | null;
  week1Retained?: number | null;
  week2Retained?: number | null;
  week3Retained?: number | null;
  week4Retained?: number | null;
};

export type WorkflowReliabilityMetric = {
  received: number;
  completed: number;
  failed: number;
  pending: number;
  completionPercent?: number | null;
  failurePercent?: number | null;
  averageCompletionLatencyMillis?: number | null;
};

export type AgentMetrics = {
  agent: string;
  attempts: number;
  failedAttempts: number;
  failurePercent?: number | null;
  aiTokensUsed: number;
  estimatedAiCostMicros: number;
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

export type AuditEventOutcome = "SUCCESS" | "FAILURE" | "DENIED";

export type AuditEvent = {
  id: string;
  occurredAt: string;
  service: string;
  category: string;
  action: string;
  outcome: AuditEventOutcome;
  actorType: string;
  actorId: string | null;
  actorName: string | null;
  actorRole: string | null;
  targetType: string | null;
  targetId: string | null;
  requestId: string | null;
  correlationId: string | null;
  sourceIp: string | null;
  userAgent: string | null;
  httpMethod: string | null;
  httpPath: string | null;
  httpStatus: number | null;
  beforeData: unknown;
  afterData: unknown;
  metadata: unknown;
  errorCode: string | null;
};

export type AuditEventsPage = {
  content: AuditEvent[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};
