/**
 * Central export point for all API clients
 * All exports follow function-based pattern for consistency and better tree-shaking
 *
 * Usage:
 *   import { getCourses, getComposition, submitEvaluation } from '@/lib/api';
 */

// Composition API
export {
  getMyCompositions,
  getComposition,
  createComposition,
  updateComposition,
  submitForEvaluation,
  deleteComposition,
  getCompositionHistory,
  saveDraft,
} from './compositions';

// Evaluation API
export {
  getMyEvaluations,
  getEvaluation,
  getCompositionEvaluation,
  getPendingEvaluations,
  submitEvaluation,
  getEvaluationHistory,
  requestRevision,
} from './evaluations';

// Rubric API
export {
  getRubrics,
  getRubric,
  createRubric,
  updateRubric,
  deleteRubric,
  getRubricCriteria,
  publishRubric,
  cloneRubric,
  getRubricsByCourse,
} from './rubrics';

// Analytics API
export {
  getUserAnalytics,
  getCourseAnalytics,
  getPerformanceMetrics,
  getUserEngagementReport,
  getEvaluationDistribution,
  getLearningTrends,
  exportAnalyticsReport,
  type UserAnalytics,
  type CourseAnalytics,
  type PerformanceMetrics,
} from './analytics';

// Course API
export {
  getCourses,
  getCourseById,
  enrollInCourse,
  getEnrolledCourses,
} from './courses';

// Lesson API
export {
  getLessonsByCourse,
  getLessonById,
  markLessonComplete,
  getLessonProgress,
  getUserLessonProgress,
  getLessonContent,
  startLesson,
  updateLessonProgress,
} from './lessons';

// Vocabulary API
export {
  getVocabularySets,
  getVocabularySetById,
  getVocabularyItems,
  saveVocabularyItem,
  createVocabularySet,
  updateVocabularySet,
  deleteVocabularySet,
  addVocabularyItem,
  updateVocabularyItem,
  deleteVocabularyItem,
  getUserSavedItems,
  searchVocabulary,
} from './vocabulary';

// Auth utilities
export { getToken, setToken, removeToken } from './client';

// API utilities
export { apiGet, apiPost, apiPut, apiPatch, apiDelete, extractPaginatedData } from './utils';

// Re-export factory types for advanced usage
export type { ApiClient } from './factory';
