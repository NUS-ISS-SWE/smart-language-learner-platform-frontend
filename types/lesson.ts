export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  order: number;
  durationMinutes: number;
  type: "VIDEO" | "READING" | "QUIZ" | "EXERCISE";
  completed?: boolean;
}

export interface LessonProgress {
  lessonId: string;
  userId: string;
  completed: boolean;
  score?: number;
  completedAt?: string;
}
