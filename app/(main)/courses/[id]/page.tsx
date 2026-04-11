"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCourseById } from "@/lib/api/courses";
import { getLessonsByCourse } from "@/lib/api/lessons";
import type { Course } from "@/types/course";
import type { Lesson } from "@/types/lesson";
import { LessonCard } from "@/components/features/LessonCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { enrollInCourse } from "@/lib/api/courses";

const levelColor = {
  BEGINNER: "green",
  INTERMEDIATE: "yellow",
  ADVANCED: "red",
} as const;

export default function CourseDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    Promise.all([getCourseById(id), getLessonsByCourse(id)])
      .then(([c, l]) => {
        setCourse(c);
        setLessons(l);
      })
      .catch(() => setError("Could not load course details."))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await enrollInCourse(id);
      setEnrolled(true);
    } catch {
      setError("Could not enroll. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!course) return null;

  const completed = lessons.filter((l) => l.completed).length;
  const progress = lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-teal-500 p-8 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge color={levelColor[course.level]}>{course.level}</Badge>
              <span className="text-indigo-100 text-sm">{course.language}</span>
            </div>
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="mt-2 text-indigo-100 max-w-lg">{course.description}</p>
          </div>
          <Button
            variant="secondary"
            onClick={handleEnroll}
            isLoading={enrolling}
            disabled={enrolled}
          >
            {enrolled ? "Enrolled ✓" : "Enroll now"}
          </Button>
        </div>

        <div className="flex gap-6 mt-6 text-sm text-indigo-100">
          <span>📖 {course.totalLessons} lessons</span>
          <span>⏱ {course.estimatedHours}h total</span>
          {lessons.length > 0 && <span>✅ {completed}/{lessons.length} completed</span>}
        </div>

        {lessons.length > 0 && (
          <div className="mt-4">
            <div className="h-2 rounded-full bg-white/30">
              <div
                className="h-2 rounded-full bg-white transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-indigo-100 mt-1">{progress}% complete</p>
          </div>
        )}
      </div>

      {/* Lessons list */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Lessons</h2>
        {lessons.length === 0 ? (
          <p className="text-gray-500 text-sm">No lessons available yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {lessons
              .sort((a, b) => a.order - b.order)
              .map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
