/**
 * Central export point for all API clients
 * Enables cleaner imports: import { compositionApi } from '@/lib/api'
 */

export { compositionApi } from './compositions';
export { evaluationApi } from './evaluations';
export { rubricApi } from './rubrics';
export { analyticsApi } from './analytics';
export { getLessonsByCourse, getLessonById, markLessonComplete, getLessonProgress, getUserLessonProgress, getLessonContent, startLesson, updateLessonProgress } from './lessons';
export { getVocabularySets, getVocabularySetById, getVocabularyItems, saveVocabularyItem, createVocabularySet, updateVocabularySet, deleteVocabularySet, addVocabularyItem, updateVocabularyItem, deleteVocabularyItem, getUserSavedItems, searchVocabulary } from './vocabulary';

// Re-export client utilities
export { getToken, setToken, removeToken } from './client';
export type { ApiClient } from './factory';
