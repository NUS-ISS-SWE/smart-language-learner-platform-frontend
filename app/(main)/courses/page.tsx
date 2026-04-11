"use client";

import { useEffect, useState } from "react";
import { getCourses } from "@/lib/api/courses";
import type { Course } from "@/types/course";
import { CourseCard } from "@/components/features/CourseCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const LEVELS = ["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
type LevelFilter = (typeof LEVELS)[number];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("ALL");

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch(() => setError("Could not load courses. Is the backend running?"))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered =
    levelFilter === "ALL"
      ? courses
      : courses.filter((c) => c.level === levelFilter);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <p className="text-gray-500 mt-1">
          Browse all available language courses.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {LEVELS.map((level) => (
          <button
            key={level}
            onClick={() => setLevelFilter(level)}
            className={[
              "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
              levelFilter === level
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-600",
            ].join(" ")}
          >
            {level}
          </button>
        ))}
      </div>

      {isLoading && <LoadingSpinner />}

      {!isLoading && error && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <p className="text-gray-500 text-sm">No courses found for this filter.</p>
      )}

      {!isLoading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
