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
  instructor?: {
    id: string;
    name: string;
    email: string;
  };
  rubricId?: string;
  hasCompositionComponent: boolean;
  compositionAssignmentCount: number;
  curriculum?: CourseCurriculum;
}

export interface CourseEnrollment {
  courseId: string;
  userId: string;
  enrolledAt: string;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  averageScore?: number;
  status: 'active' | 'completed' | 'dropped';
}

export interface CourseCurriculum {
  id: string;
  courseId: string;
  topics: CourseTopic[];
  duration: number;
  learningOutcomes: string[];
}

export interface CourseTopic {
  id: string;
  title: string;
  order: number;
  lessons: string[];
  assessments: string[];
}

export interface CourseStatistics {
  courseId: string;
  totalEnrollments: number;
  completionRate: number;
  averageScore: number;
  studentEngagement: number;
}
