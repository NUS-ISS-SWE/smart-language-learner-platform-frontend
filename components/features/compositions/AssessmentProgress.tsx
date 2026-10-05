"use client";

import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { GradingProgressStage } from "@/types/composition";

type AssessmentProgressProps = {
  stage?: string | null;
  message?: string | null;
};

const stages: Array<{ key: GradingProgressStage; labelKey: string }> = [
  { key: "PREPARING", labelKey: "assessmentStages.preparing" },
  { key: "EVIDENCING", labelKey: "assessmentStages.evidencing" },
  { key: "GRADING", labelKey: "assessmentStages.grading" },
  { key: "REVIEWING", labelKey: "assessmentStages.reviewing" },
  { key: "SUGGESTING", labelKey: "assessmentStages.suggesting" },
];

export function AssessmentProgress({
  stage,
  message,
}: AssessmentProgressProps) {
  const { t } = useTranslation("composition");
  const { t: feedbackT } = useTranslation("feedback");
  const isRechecking = stage === "REGRADING";
  const visibleStages = isRechecking
    ? [
        ...stages.slice(0, 3),
        { key: "REGRADING" as const, labelKey: "assessmentStages.rechecking" },
        stages[3],
      ]
    : stages;
  const currentIndex = visibleStages.findIndex((item) => item.key === stage);
  if (currentIndex < 0)
    return (
      <div
        role="status"
        className="space-y-2 text-sm leading-6 text-muted-foreground"
      >
        <p>{feedbackT("neutralProgress")}</p>
        {message && (
          <p className="whitespace-pre-wrap break-words">{message}</p>
        )}
      </div>
    );

  return (
    <section
      aria-live="polite"
      aria-label={t("assessmentInProgress")}
      className={
        isRechecking
          ? "space-y-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4"
          : "space-y-4"
      }
    >
      <p
        className={
          isRechecking
            ? "text-sm font-medium text-amber-700 dark:text-amber-300"
            : "text-sm text-muted-foreground"
        }
      >
        {message || t("preparingAssessment")}
      </p>
      <ol className="space-y-3">
        {visibleStages.map((item, index) => {
          const complete = index < currentIndex;
          const current = index === currentIndex;
          return (
            <li key={item.key} className="flex items-center gap-3 text-sm">
              {complete ? (
                <CheckCircle2
                  className="h-4 w-4 text-primary"
                  aria-label={t("assessmentComplete")}
                />
              ) : null}
              {current ? (
                <Loader2
                  className={`h-4 w-4 animate-spin ${
                    isRechecking ? "text-amber-600 dark:text-amber-300" : "text-primary"
                  }`}
                  aria-label={t("assessmentCurrent")}
                />
              ) : null}
              {!complete && !current ? (
                <Circle
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
              ) : null}
              <span
                className={
                  complete || current ? "font-medium" : "text-muted-foreground"
                }
              >
                {t(item.labelKey)}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
