export interface Course {
  id: string;
  title: string;
  description: string;
  language: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  imageUrl?: string;
  totalLessons: number;
  estimatedHours: number;
  tags?: string[];
  createdAt?: string;
}

export interface CourseEnrollment {
  courseId: string;
  userId: string;
  enrolledAt: string;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
}
