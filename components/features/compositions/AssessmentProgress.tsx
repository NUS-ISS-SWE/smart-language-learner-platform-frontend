"use client";

import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { GradingProgressStage } from "@/types/composition";

type AssessmentProgressProps = {
  stage?: GradingProgressStage | null;
  message?: string | null;
};

const stages: Array<{ key: GradingProgressStage; labelKey: string }> = [
  { key: "PREPARING", labelKey: "assessmentStages.preparing" },
  { key: "GRADING", labelKey: "assessmentStages.grading" },
  { key: "REVIEWING", labelKey: "assessmentStages.reviewing" },
  { key: "SUGGESTING", labelKey: "assessmentStages.suggesting" },
];

export function AssessmentProgress({ stage, message }: AssessmentProgressProps) {
  const { t } = useTranslation("composition");
  const isRefining = stage === "REGRADING";
  const visibleStages = isRefining
    ? [...stages.slice(0, 3), { key: "REGRADING" as const, labelKey: "assessmentStages.refining" }, stages[3]]
    : stages;
  const currentIndex = Math.max(0, visibleStages.findIndex((item) => item.key === stage));

  return (
    <section aria-live="polite" aria-label={t("assessmentInProgress")} className="space-y-4">
      <p className="text-sm text-muted-foreground">{message || t("preparingAssessment")}</p>
      <ol className="space-y-3">
        {visibleStages.map((item, index) => {
          const complete = index < currentIndex;
          const current = index === currentIndex;
          return (
            <li key={item.key} className="flex items-center gap-3 text-sm">
              {complete ? <CheckCircle2 className="h-4 w-4 text-primary" aria-label={t("assessmentComplete")} /> : null}
              {current ? <Loader2 className="h-4 w-4 animate-spin text-primary" aria-label={t("assessmentCurrent")} /> : null}
              {!complete && !current ? <Circle className="h-4 w-4 text-muted-foreground" aria-hidden="true" /> : null}
              <span className={complete || current ? "font-medium" : "text-muted-foreground"}>{t(item.labelKey)}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
