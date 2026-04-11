export interface EvaluationDTO {
  id: string;
  compositionId: string;
  rubricId: string;
  instructorId: string;
  score: number;
  maxScore: number;
  percentage: number;
  feedback: string;
  criteriaScores: Record<string, number>;
  status: 'pending' | 'completed' | 'revision_requested';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CreateEvaluationRequest {
  rubricId: string;
  score: number;
  feedback: string;
  criteriaScores: Record<string, number>;
  status?: 'completed' | 'revision_requested';
}

export interface EvaluationCriterion {
  id: string;
  rubricId: string;
  name: string;
  description: string;
  maxScore: number;
  weight: number;
  levels: {
    score: number;
    description: string;
  }[];
}

export interface EvaluationHistory {
  id: string;
  compositionId: string;
  evaluations: EvaluationDTO[];
  averageScore: number;
  completed: boolean;
}

export interface StudentEvaluationProgress {
  compositionId: string;
  status: 'pending' | 'in_progress' | 'completed';
  currentScore?: number;
  evaluationCount: number;
  lastEvaluatedAt?: string;
}
