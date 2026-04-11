export interface RubricDTO {
  id: string;
  courseId: string;
  name: string;
  description: string;
  maxScore: number;
  criteria: RubricCriterion[];
  published: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  maxScore: number;
  levels: RubricLevel[];
}

export interface RubricLevel {
  score: number;
  label: string;
  description: string;
  examples?: string[];
}

export interface CreateRubricRequest {
  courseId: string;
  name: string;
  description: string;
  maxScore: number;
  criteria: Omit<RubricCriterion, 'id'>[];
}

export interface UpdateRubricRequest {
  name?: string;
  description?: string;
  maxScore?: number;
  criteria?: Omit<RubricCriterion, 'id'>[];
  published?: boolean;
}

export interface RubricTemplate {
  id: string;
  name: string;
  description: string;
  category: 'writing' | 'speaking' | 'listening' | 'grammar' | 'vocabulary';
  criteria: RubricCriterion[];
  isPublic: boolean;
}

export interface RubricUsage {
  rubricId: string;
  courseId: string;
  compositionCount: number;
  lastUsedAt: string;
}
