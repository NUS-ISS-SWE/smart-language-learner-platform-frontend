import type { Lesson } from "@/types/lesson";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const typeIcon: Record<Lesson["type"], string> = {
  VIDEO: "🎬",
  READING: "📄",
  QUIZ: "❓",
  EXERCISE: "✏️",
  COMPOSITION: "✍️",
  ASSESSMENT: "📊",
};

const typeColor = {
  VIDEO: "indigo",
  READING: "teal",
  QUIZ: "yellow",
  EXERCISE: "green",
  COMPOSITION: "indigo",
  ASSESSMENT: "red",
} as const;

interface LessonCardProps {
  readonly lesson: Lesson;
  readonly onClick?: () => void;
}

export function LessonCard({ lesson, onClick }: LessonCardProps) {
  return (
    <Card hoverable={!!onClick} onClick={onClick} className="flex">
      <CardBody className="flex items-start gap-4 w-full">
        {/* Status indicator */}
        <div
          className={[
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            lesson.completed
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500",
          ].join(" ")}
        >
          {lesson.completed ? "✓" : lesson.order}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-gray-900">{lesson.title}</span>
            <Badge color={typeColor[lesson.type]}>
              {typeIcon[lesson.type]} {lesson.type}
            </Badge>
          </div>
          <p className="mt-0.5 text-sm text-gray-500 line-clamp-1">{lesson.description}</p>
          <p className="mt-1 text-xs text-gray-400">⏱ {lesson.durationMinutes} min</p>
        </div>
      </CardBody>
    </Card>
  );
}
