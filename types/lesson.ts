export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  order: number;
  durationMinutes: number;
  type: "VIDEO" | "READING" | "QUIZ" | "EXERCISE" | "COMPOSITION" | "ASSESSMENT";
  completed?: boolean;
  materials?: LessonMaterial[];
  objectives: string[];
  assessment?: LessonAssessment;
  prerequisites: string[];
  nextLessonId?: string;
}

export interface LessonProgress {
  lessonId: string;
  userId: string;
  completed: boolean;
  score?: number;
  completedAt?: string;
  startedAt?: string;
  timeSpent?: number;
  attempts: number;
}

export interface LessonMaterial {
  id: string;
  type: 'video' | 'pdf' | 'audio' | 'image' | 'resource';
  title: string;
  url: string;
  duration?: number;
}

export interface LessonAssessment {
  id: string;
  type: 'quiz' | 'exercise' | 'composition' | 'project';
  questions: AssessmentQuestion[];
  passingScore: number;
  timeLimit?: number;
  rubricId?: string;
}

export interface AssessmentQuestion {
  id: string;
  type: 'multiple_choice' | 'short_answer' | 'essay' | 'composition';
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
}
