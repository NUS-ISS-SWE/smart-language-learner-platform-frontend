import type { Lesson, LessonProgress } from "@/types/lesson";
import { apiGet, apiPost, courseClient } from "./client";

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
