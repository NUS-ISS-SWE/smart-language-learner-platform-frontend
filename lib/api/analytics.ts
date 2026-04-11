import { analyticsClient } from './client';
import { apiGet } from './utils';

const ENDPOINT = '/api/analytics';

export interface UserAnalytics {
  userId: string;
  totalCompositions: number;
  averageScore: number;
  completionRate: number;
  learningPath: {
    coursesEnrolled: number;
    coursesCompleted: number;
    lessonsCompleted: number;
  };
  progress: {
    lastActivities: Array<{
      type: 'composition' | 'lesson' | 'evaluation';
      timestamp: string;
      status: 'pending' | 'completed';
    }>;
  };
}

export interface CourseAnalytics {
  courseId: string;
  totalEnrollments: number;
  completionRate: number;
  averageScore: number;
  lessonsCompleted: number;
  studentEngagement: number;
  topPerformers: Array<{ userId: string; score: number }>;
}

export interface PerformanceMetrics {
  overallEngagement: number;
  completionRate: number;
  averageCompositionScore: number;
  evaluationTrend: Array<{ date: string; score: number }>;
  topCourses: Array<{ courseId: string; enrollments: number }>;
}

/**
 * Get user analytics (for self or specified user if admin)
 */
export async function getUserAnalytics(userId?: string) {
  return apiGet<UserAnalytics>(analyticsClient, `${ENDPOINT}/user`, {
    params: userId ? { userId } : {},
  });
}

/**
 * Get course analytics
 */
export async function getCourseAnalytics(courseId: string) {
  return apiGet<CourseAnalytics>(analyticsClient, `${ENDPOINT}/course/${courseId}`);
}

/**
 * Get platform performance metrics (admin only)
 */
export async function getPerformanceMetrics() {
  return apiGet<PerformanceMetrics>(analyticsClient, `${ENDPOINT}/performance`);
}

/**
 * Get user engagement report for date range
 */
export async function getUserEngagementReport(startDate: string, endDate: string) {
  return apiGet<any>(analyticsClient, `${ENDPOINT}/engagement`, {
    params: { startDate, endDate },
  });
}

/**
 * Get evaluation score distribution for course
 */
export async function getEvaluationDistribution(courseId: string) {
  return apiGet<any>(analyticsClient, `${ENDPOINT}/evaluations/distribution`, {
    params: { courseId },
  });
}

/**
 * Get learning trends over time
 */
export async function getLearningTrends(timeframe: 'week' | 'month' | 'year' = 'month') {
  return apiGet<any>(analyticsClient, `${ENDPOINT}/trends`, {
    params: { timeframe },
  });
}

/**
 * Export analytics report in specified format
 */
export async function exportAnalyticsReport(
  reportType: 'csv' | 'pdf',
  filters?: any
) {
  return analyticsClient.get(`${ENDPOINT}/export`, {
    params: { reportType, ...filters },
    responseType: 'blob',
  }).then(res => res.data);
}
