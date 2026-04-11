export interface CompositionDTO {
  id: string;
  userId: string;
  courseId: string;
  title: string;
  content: string;
  status: 'draft' | 'submitted' | 'evaluated' | 'revision_requested';
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  wordCount: number;
  language: 'en' | 'zh';
  topic?: string;
  rubricId?: string;
  currentEvaluationId?: string;
}

export interface CreateCompositionRequest {
  courseId: string;
  title: string;
  content: string;
  language: 'en' | 'zh';
  topic?: string;
  rubricId?: string;
}

export interface UpdateCompositionRequest {
  title?: string;
  content?: string;
  topic?: string;
  status?: 'draft' | 'submitted';
}

export interface CompositionVersion {
  id: string;
  compositionId: string;
  content: string;
  version: number;
  createdAt: string;
}

export interface CompositionFeedback {
  id: string;
  compositionId: string;
  instructorId: string;
  feedback: string;
  type: 'inline' | 'general';
  position?: number;
  createdAt: string;
}
