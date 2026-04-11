/**
 * Central export point for all type definitions
 * Enables cleaner imports: import { User, Course } from '@/types'
 */

export type { User, LoginRequest, RegisterRequest, AuthResponse, UserProfile, UserPreferences, UserPermission, PasswordResetRequest, PasswordReset } from './auth';
export type { Course, CourseEnrollment, CourseCurriculum, CourseTopic, CourseStatistics } from './course';
export type { Lesson, LessonProgress, LessonMaterial, LessonAssessment, AssessmentQuestion } from './lesson';
export type { VocabularyItem, VocabularySet, VocabularyProgress, KnowledgeHub } from './vocabulary';
export type { CompositionDTO, CreateCompositionRequest, UpdateCompositionRequest, CompositionVersion, CompositionFeedback } from './composition';
export type { EvaluationDTO, CreateEvaluationRequest, EvaluationCriterion, EvaluationHistory, StudentEvaluationProgress } from './evaluation';
export type { RubricDTO, RubricCriterion, RubricLevel, CreateRubricRequest, UpdateRubricRequest, RubricTemplate, RubricUsage } from './rubric';
