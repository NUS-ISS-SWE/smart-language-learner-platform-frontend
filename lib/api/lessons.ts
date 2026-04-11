import type { Lesson, LessonProgress } from "@/types/lesson";
import { apiGet, apiPost, apiPut, courseClient } from "./client";

export async function getLessonsByCourse(courseId: string): Promise<Lesson[]> {
  return apiGet<Lesson[]>(courseClient, `/api/courses/${courseId}/lessons`);
}

export async function getLessonById(courseId: string, lessonId: string): Promise<Lesson> {
  return apiGet<Lesson>(courseClient, `/api/courses/${courseId}/lessons/${lessonId}`);
}

export async function markLessonComplete(
  courseId: string,
  lessonId: string
): Promise<LessonProgress> {
  return apiPost<LessonProgress>(
    courseClient,
    `/api/courses/${courseId}/lessons/${lessonId}/complete`
  );
}

export async function getLessonProgress(courseId: string, lessonId: string): Promise<LessonProgress> {
  return apiGet<LessonProgress>(courseClient, `/api/courses/${courseId}/lessons/${lessonId}/progress`);
}

export async function getUserLessonProgress(courseId: string): Promise<LessonProgress[]> {
  return apiGet<LessonProgress[]>(courseClient, `/api/courses/${courseId}/progress`);
}

export async function getLessonContent(courseId: string, lessonId: string): Promise<any> {
  return apiGet<any>(courseClient, `/api/courses/${courseId}/lessons/${lessonId}/content`);
}

export async function startLesson(courseId: string, lessonId: string): Promise<LessonProgress> {
  return apiPost<LessonProgress>(
    courseClient,
    `/api/courses/${courseId}/lessons/${lessonId}/start`
  );
}

export async function updateLessonProgress(
  courseId: string,
  lessonId: string,
  progress: number
): Promise<LessonProgress> {
  return apiPut<LessonProgress>(
    courseClient,
    `/api/courses/${courseId}/lessons/${lessonId}/progress`,
    { progress }
  );
}
