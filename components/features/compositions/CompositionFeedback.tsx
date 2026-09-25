"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { Badge } from "@/components/ui/Badge";
import type { ImprovementSuggestion, SuggestionStatus } from "@/types/composition";

const unavailableSuggestionMessage: Partial<Record<SuggestionStatus, string>> = {
  NOT_AVAILABLE_FOR_LANGUAGE: "languageUnavailable",
  TEMPORARILY_UNAVAILABLE: "suggestionsUnavailable",
  NO_PRIORITY_IMPROVEMENT: "noPriorityImprovement",
};

export function CompositionFeedback({
  feedback,
  suggestions,
  suggestionStatus,
  reviewed = false,
}: {
  feedback?: string | null;
  suggestions?: ImprovementSuggestion[] | null;
  suggestionStatus?: SuggestionStatus | null;
  reviewed?: boolean;
}) {
  const { t } = useTranslation("feedback");
  const items = suggestions ?? [];
  const suggestionMessage = suggestionStatus
    ? unavailableSuggestionMessage[suggestionStatus]
    : undefined;
  const full = (
    <div className="whitespace-pre-wrap break-words text-base leading-7">
      {feedback?.trim() ? (
        feedback
      ) : (
        <p className="text-muted-foreground">
          {t(reviewed ? "missingFeedback" : "notReviewed")}
        </p>
      )}
    </div>
  );
  return (
    <section
      id="feedback"
      aria-labelledby="feedback-heading"
      className="min-w-0 scroll-mt-24 space-y-6"
    >
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-secondary">
          {t("nextDraft")}
        </p>
        <h2
          id="feedback-heading"
          className="text-3xl font-semibold tracking-tight text-primary"
        >
          {t("heading")}
        </h2>
      </div>
      {items.length > 0 ? (
        <>
          <ol className="space-y-6">
            {items.map((item, index) => (
              <li
                key={index}
                className="space-y-4 border-l-2 border-secondary pl-4 sm:pl-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-soft-teal text-xs font-semibold text-secondary"
                  >
                    {index + 1}
                  </span>
                  <h3 className="font-semibold text-primary">
                    {item.criterion || t("suggestion", { number: index + 1 })}
                  </h3>
                  {item.priority && (
                    <Badge variant="secondary">
                      {t(`priority.${item.priority}`, {
                        defaultValue: item.priority,
                      })}
                    </Badge>
                  )}
                </div>
                {item.recommendation && (
                  <p className="whitespace-pre-wrap break-words text-base leading-7">
                    {item.recommendation}
                  </p>
                )}
                {item.exampleRevision && (
                  <div className="space-y-1 rounded-lg bg-soft-teal p-4">
                    <h4 className="text-sm font-semibold text-secondary">
                      {t("example")}
                    </h4>
                    <p className="whitespace-pre-wrap break-words leading-7">
                      {item.exampleRevision}
                    </p>
                  </div>
                )}
                {item.learningTip && (
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">
                      {t("learningTip")}
                    </h4>
                    <p className="whitespace-pre-wrap break-words leading-7">
                      {item.learningTip}
                    </p>
                  </div>
                )}
                {item.supportingEvidence && (
                  <div className="space-y-1 text-sm leading-6 text-muted-foreground">
                    <h4 className="font-semibold">{t("evidence")}</h4>
                    {item.supportingEvidence.excerpt && (
                      <blockquote className="whitespace-pre-wrap break-words">
                        {item.supportingEvidence.excerpt}
                      </blockquote>
                    )}
                    {item.supportingEvidence.location && (
                      <p className="break-words">
                        {item.supportingEvidence.location}
                      </p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ol>
          <details className="border-t pt-4">
            <summary className="min-h-11 cursor-pointer py-3 font-semibold">
              {t("fullFeedback")}
            </summary>
            <div className="pt-2">{full}</div>
          </details>
        </>
      ) : (
        <>
          {reviewed && (
            <p className="text-sm leading-6 text-muted-foreground">
              {suggestionMessage
                ? t(suggestionMessage)
                : suggestionStatus && suggestionStatus !== "AVAILABLE"
                  ? t("suggestionStatus", { status: suggestionStatus })
                  : t("noSuggestions")}
            </p>
          )}
          <div className="space-y-3">
            <h3 className="font-semibold">{t("fullFeedback")}</h3>
            {full}
          </div>
        </>
      )}
    </section>
  );
}
