import { analyticsClient } from './client';

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

export const analyticsApi = {
  // Get user analytics
  getUserAnalytics: async (userId?: string) => {
    const response = await analyticsClient.get<UserAnalytics>(`${ENDPOINT}/user`, {
      params: userId ? { userId } : {},
    });
    return response.data;
  },

  // Get course analytics
  getCourseAnalytics: async (courseId: string) => {
    const response = await analyticsClient.get<CourseAnalytics>(
      `${ENDPOINT}/course/${courseId}`
    );
    return response.data;
  },

  // Get platform performance metrics (admin only)
  getPerformanceMetrics: async () => {
    const response = await analyticsClient.get<PerformanceMetrics>(`${ENDPOINT}/performance`);
    return response.data;
  },

  // Get user engagement report
  getUserEngagementReport: async (startDate: string, endDate: string) => {
    const response = await analyticsClient.get<any>(`${ENDPOINT}/engagement`, {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Get evaluation distribution
  getEvaluationDistribution: async (courseId: string) => {
    const response = await analyticsClient.get<any>(
      `${ENDPOINT}/evaluations/distribution`,
      {
        params: { courseId },
      }
    );
    return response.data;
  },

  // Get learning trends
  getLearningTrends: async (timeframe: 'week' | 'month' | 'year' = 'month') => {
    const response = await analyticsClient.get<any>(`${ENDPOINT}/trends`, {
      params: { timeframe },
    });
    return response.data;
  },

  // Export analytics report
  exportAnalyticsReport: async (reportType: 'csv' | 'pdf', filters?: any) => {
    const response = await analyticsClient.get(`${ENDPOINT}/export`, {
      params: { reportType, ...filters },
      responseType: 'blob',
    });
    return response.data;
  },
};
