"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getCourseById, getEnrolledCourses } from "@/lib/api/courses";
import type { CourseEnrollment } from "@/types/course";
import type { Course } from "@/types/course";
import { CourseCard } from "@/components/features/CourseCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardBody } from "@/components/ui/Card";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface EnrolledCourse {
  enrollment: CourseEnrollment;
  course: Course | null;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getEnrolledCourses()
      .then(async (enrollments) => {
        const results = await Promise.allSettled(
          enrollments.map((e) => getCourseById(e.courseId))
        );
        setEnrolledCourses(
          enrollments.map((enrollment, i) => ({
            enrollment,
            course:
              results[i].status === "fulfilled"
                ? (results[i] as PromiseFulfilledResult<Course>).value
                : null,
          }))
        );
      })
      .catch(() => setError("Could not load your courses."))
      .finally(() => setIsLoading(false));
  }, []);

  const totalProgress =
    enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce(
            (sum, { enrollment }) => sum + enrollment.progressPercent,
            0
          ) / enrolledCourses.length
        )
      : 0;

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name ?? "Learner"} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here&apos;s your learning overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardBody className="flex items-center gap-4">
            <span className="text-3xl">📚</span>
            <div>
              <p className="text-2xl font-bold text-gray-900">{enrolledCourses.length}</p>
              <p className="text-sm text-gray-500">Enrolled courses</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <span className="text-3xl">✅</span>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {enrolledCourses.reduce(
                  (sum, { enrollment }) => sum + enrollment.completedLessons,
                  0
                )}
              </p>
              <p className="text-sm text-gray-500">Lessons completed</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <span className="text-3xl">📈</span>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalProgress}%</p>
              <p className="text-sm text-gray-500">Avg. progress</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Courses in progress */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Your courses</h2>
          <Link href="/courses">
            <Button variant="ghost" size="sm">Browse all →</Button>
          </Link>
        </div>

        {isLoading && <LoadingSpinner />}

        {!isLoading && error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {!isLoading && !error && enrolledCourses.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
            <p className="text-lg">You haven&apos;t enrolled in any courses yet.</p>
            <Link href="/courses" className="mt-3 inline-block">
              <Button size="sm" className="mt-3">Find a course</Button>
            </Link>
          </div>
        )}

        {!isLoading && !error && enrolledCourses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses.map(({ enrollment, course }) =>
              course ? (
                <CourseCard
                  key={enrollment.courseId}
                  course={course}
                  enrolledPercent={enrollment.progressPercent}
                />
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
}
