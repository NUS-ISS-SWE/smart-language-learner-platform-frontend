import Link from "next/link";
import type { Course } from "@/types/course";
import { Card, CardBody, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const levelColor = {
  BEGINNER: "green",
  INTERMEDIATE: "yellow",
  ADVANCED: "red",
} as const;

interface CourseCardProps {
  course: Course;
  enrolledPercent?: number;
}

export function CourseCard({ course, enrolledPercent }: CourseCardProps) {
  return (
    <Card hoverable className="flex flex-col">
      {/* Header image / placeholder */}
      <div className="h-36 rounded-t-xl bg-gradient-to-br from-indigo-400 to-teal-500 flex items-center justify-center">
        <span className="text-5xl">📘</span>
      </div>

      <CardBody className="flex-1 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
          <Badge color={levelColor[course.level]}>{course.level}</Badge>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>

        <div className="flex items-center gap-3 text-xs text-gray-500 mt-auto pt-2">
          <span>🌍 {course.language}</span>
          <span>📖 {course.totalLessons} lessons</span>
          <span>⏱ {course.estimatedHours}h</span>
        </div>

        {enrolledPercent !== undefined && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{enrolledPercent}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-200">
              <div
                className="h-1.5 rounded-full bg-indigo-500 transition-all"
                style={{ width: `${enrolledPercent}%` }}
              />
            </div>
          </div>
        )}
      </CardBody>

      <CardFooter>
        <Link href={`/courses/${course.id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            {enrolledPercent !== undefined ? "Continue" : "View Course"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
