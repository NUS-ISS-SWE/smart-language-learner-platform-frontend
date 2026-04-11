import type { Course, CourseEnrollment } from "@/types/course";
import { apiGet, apiPost, courseClient } from "./client";

export async function getCourses(params?: {
  language?: string;
  level?: string;
  page?: number;
  size?: number;
}): Promise<Course[]> {
  return apiGet<Course[]>(courseClient, "/api/courses", { params });
}

export async function getCourseById(id: string): Promise<Course> {
  return apiGet<Course>(courseClient, `/api/courses/${id}`);
}

export async function enrollInCourse(courseId: string): Promise<CourseEnrollment> {
  return apiPost<CourseEnrollment>(courseClient, `/api/courses/${courseId}/enroll`);
}

export async function getEnrolledCourses(): Promise<CourseEnrollment[]> {
  return apiGet<CourseEnrollment[]>(courseClient, "/api/courses/enrolled");
}
