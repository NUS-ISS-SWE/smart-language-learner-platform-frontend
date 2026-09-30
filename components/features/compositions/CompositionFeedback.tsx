"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getApiErrorMessage } from "@/lib/api/client";
import { useSubmitSuggestionFeedback } from "@/lib/hooks/useCompositions";
import { CreateCompositionCopy } from "@/components/features/compositions/CreateCompositionCopy";
import {
  canApplySuggestion,
  type SuggestionReplacement,
} from "@/lib/suggestion-revision";
import type {
  Composition,
  ImprovementSuggestion,
  SuggestionFeedbackRating,
  SuggestionStatus,
} from "@/types/composition";

const unavailableSuggestionMessage: Partial<Record<SuggestionStatus, string>> = {
  NOT_AVAILABLE_FOR_LANGUAGE: "languageUnavailable",
  TEMPORARILY_UNAVAILABLE: "suggestionsUnavailable",
  NO_PRIORITY_IMPROVEMENT: "noPriorityImprovement",
};

const criterionLabels: Record<string, string> = {
  EXPRESSION_DESCRIPTION_VOICE: "Expression and voice",
  GRAMMAR_SENTENCE_CONTROL: "Sentence clarity",
  MECHANICS: "Spelling and punctuation",
  ORGANISATION_COHESION: "Organisation and flow",
  TASK_IDEAS: "Ideas and task response",
  VOCABULARY_WORD_CHOICE: "Word choice",
};

type AssessmentCriterion = {
  criterion: string;
  score: number;
  rationale: string;
  evidence: string | null;
};

type AssessmentSummary = {
  score: number | null;
  criteria: AssessmentCriterion[];
  reviewOutcome: string | null;
};

function criterionLabel(criterion?: string | null) {
  if (!criterion) return null;
  return criterionLabels[criterion] ?? criterion.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function suggestionReplacement(
  item: ImprovementSuggestion,
  suggestionIndex: number,
): SuggestionReplacement | null {
  const excerpt = item.supportingEvidence?.excerpt?.trim();
  const revision = item.exampleRevision?.trim();
  return excerpt && revision ? { suggestionIndex, excerpt, revision } : null;
}

function parseAssessmentSummary(feedback?: string | null): AssessmentSummary | null {
  if (!feedback?.trim()) return null;
  const score = feedback.match(/Overall score:\s*(\d+(?:\.\d+)?)\/100/i);
  const rubric = feedback.match(/Rubric score breakdown:\s*([\s\S]*?)(?:\n\s*Evidence-based assessment:|$)/i)?.[1] ?? "";
  const evidence = feedback.match(/Evidence-based assessment:\s*([\s\S]*?)(?:\n\s*Review outcome:|$)/i)?.[1] ?? "";
  const criteria = Array.from(rubric.matchAll(/-\s*([A-Z_]+):\s*(\d+(?:\.\d+)?)\/100/g)).map((match) => {
    const criterion = match[1];
    const detail = new RegExp(`-\\s*${criterion}\\s*\\(\\s*\\d+(?:\\.\\d+)?\\/100\\):\\s*([\\s\\S]*?)(?=\\n-\\s*[A-Z_]+\\s*\\(|$)`, "i").exec(evidence)?.[1]?.trim() ?? "";
    const [rationale, excerpt] = detail.split(/\s*Evidence:\s*/i, 2);
    return { criterion, score: Number(match[2]), rationale: rationale?.trim() ?? "", evidence: excerpt?.trim() || null };
  });
  const reviewOutcome = feedback.match(/Review outcome:\s*([^\n]+)/i)?.[1]?.trim() ?? null;
  if (!score && criteria.length === 0 && !reviewOutcome) return null;
  return { score: score ? Number(score[1]) : null, criteria, reviewOutcome };
}

function AssessmentFeedback({ feedback, t }: { feedback?: string | null; t: (key: string, values?: Record<string, unknown>) => string }) {
  const summary = parseAssessmentSummary(feedback);
  if (!feedback?.trim()) {
    return <p className="text-muted-foreground">{t("missingFeedback")}</p>;
  }
  if (!summary) {
    return <div className="whitespace-pre-wrap break-words text-base leading-7">{feedback}</div>;
  }
  return (
    <section className="space-y-5 rounded-xl border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
            {t("assessmentSummary")}
          </p>
          <h3 className="mt-1 text-xl font-semibold text-primary">{t("assessmentHeading")}</h3>
        </div>
        {summary.score !== null && (
          <div className="rounded-lg bg-soft-teal px-4 py-3 text-right">
            <p className="text-xs font-medium text-secondary">{t("overallScore")}</p>
            <p className="text-2xl font-semibold text-primary">{summary.score}<span className="text-base font-medium">/100</span></p>
          </div>
        )}
      </div>
      {summary.criteria.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {summary.criteria.map((item) => (
            <div key={item.criterion} className="rounded-lg border bg-background px-3 py-3">
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm font-medium text-primary">{criterionLabel(item.criterion)}</span>
                <span className="shrink-0 text-sm font-semibold text-secondary">{item.score}/100</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {summary.reviewOutcome && (
        <p className="text-sm font-medium text-secondary">{t("reviewOutcome", { outcome: summary.reviewOutcome })}</p>
      )}
      <details className="border-t pt-3">
        <summary className="min-h-11 cursor-pointer py-2 font-semibold">{t("detailedAssessment")}</summary>
        <div className="space-y-4 pt-3">
          {summary.criteria.map((item) => (
            <article key={item.criterion} className="space-y-2 rounded-lg bg-muted/30 p-3">
              <h4 className="font-semibold text-primary">{criterionLabel(item.criterion)}</h4>
              {item.rationale && <p className="leading-7">{item.rationale}</p>}
              {item.evidence && (
                <div className="border-l-2 border-secondary/60 pl-3 text-sm leading-6 text-muted-foreground">
                  <p className="mb-1 font-semibold text-secondary">{t("evidence")}</p>
                  <blockquote className="whitespace-pre-wrap break-words">{item.evidence}</blockquote>
                </div>
              )}
            </article>
          ))}
        </div>
      </details>
    </section>
  );
}

export function CompositionFeedback({
  compositionId,
  composition,
  feedback,
  suggestions,
  suggestionStatus,
  reviewed = false,
}: {
  compositionId?: number;
  composition?: Composition;
  feedback?: string | null;
  suggestions?: ImprovementSuggestion[] | null;
  suggestionStatus?: SuggestionStatus | null;
  reviewed?: boolean;
}) {
  const { t } = useTranslation("feedback");
  const submitFeedback = useSubmitSuggestionFeedback();
  const [submitted, setSubmitted] = useState<Record<number, SuggestionFeedbackRating>>({});
  const [selectedSuggestionIndexes, setSelectedSuggestionIndexes] = useState<number[]>([]);
  const [revisionPreviewOpen, setRevisionPreviewOpen] = useState(false);
  const items = suggestions ?? [];
  const selectedReplacements = selectedSuggestionIndexes.flatMap((index) => {
    const item = items[index];
    const replacement = item ? suggestionReplacement(item, index) : null;
    return replacement ? [replacement] : [];
  });
  function toggleSuggestion(replacement: SuggestionReplacement) {
    setSelectedSuggestionIndexes((current) => {
      if (current.includes(replacement.suggestionIndex)) {
        return current.filter((index) => index !== replacement.suggestionIndex);
      }
      if (!composition || !canApplySuggestion(composition.content ?? "", replacement, selectedReplacements)) {
        return current;
      }
      return [...current, replacement.suggestionIndex];
    });
  }
  const suggestionMessage = suggestionStatus
    ? unavailableSuggestionMessage[suggestionStatus]
    : undefined;
  const assessment = reviewed ? <AssessmentFeedback feedback={feedback} t={t} /> : (
    <p className="text-muted-foreground">{t("notReviewed")}</p>
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
      {assessment}
      {items.length > 0 ? (
        <>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
              {t("improvementSuggestions")}
            </p>
            <h3 className="mt-1 text-xl font-semibold text-primary">{t("nextDraft")}</h3>
          </div>
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
                    {criterionLabel(item.criterion) || t("suggestion", { number: index + 1 })}
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
                {item.supportingEvidence?.excerpt && (
                  <div className="space-y-1 rounded-lg border border-secondary/20 bg-soft-teal/45 p-4">
                    <h4 className="text-sm font-semibold text-secondary">{t("evidence")}</h4>
                    <blockquote className="whitespace-pre-wrap break-words leading-7 text-foreground">
                      {item.supportingEvidence.excerpt}
                    </blockquote>
                    {item.supportingEvidence.location && (
                      <p className="text-sm text-muted-foreground">{item.supportingEvidence.location}</p>
                    )}
                  </div>
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
                {composition && (() => {
                  const replacement = suggestionReplacement(item, index);
                  if (!replacement) return null;
                  const selected = selectedSuggestionIndexes.includes(index);
                  const eligible = selected || canApplySuggestion(
                    composition.content ?? "",
                    replacement,
                    selectedReplacements,
                  );
                  if (!eligible) return null;
                  return (
                    <Button
                      type="button"
                      size="sm"
                      variant={selected ? "secondary" : "outline"}
                      onClick={() => toggleSuggestion(replacement)}
                    >
                      {t(selected ? "removeFromRevision" : "addToRevision")}
                    </Button>
                  );
                })()}
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
                {compositionId && reviewed && (
                  <div className="flex flex-wrap items-center gap-2 border-t pt-3">
                    <span className="mr-1 text-sm text-muted-foreground">
                      {t("suggestionWasHelpful", {
                        defaultValue: "Was this suggestion helpful?",
                      })}
                    </span>
                    {(["HELPFUL", "NOT_HELPFUL"] as const).map((rating) => (
                      <Button
                        key={rating}
                        type="button"
                        size="sm"
                        variant={submitted[index] === rating ? "secondary" : "outline"}
                        disabled={submitFeedback.isPending}
                        onClick={() =>
                          submitFeedback.mutate(
                            {
                              compositionId,
                              suggestionIndex: index,
                              feedback: { rating },
                            },
                            { onSuccess: () => setSubmitted((current) => ({ ...current, [index]: rating })) },
                          )
                        }
                      >
                        {t(rating === "HELPFUL" ? "helpful" : "notHelpful", {
                          defaultValue: rating === "HELPFUL" ? "Helpful" : "Not helpful",
                        })}
                      </Button>
                    ))}
                    {submitted[index] && (
                      <span className="text-sm text-secondary">
                        {t("feedbackSaved", { defaultValue: "Thanks for your feedback." })}
                      </span>
                    )}
                    {submitFeedback.isError && (
                      <span className="text-sm text-destructive">
                        {getApiErrorMessage(submitFeedback.error)}
                      </span>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ol>
          {composition && selectedReplacements.length > 0 && (
            <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-secondary/30 bg-soft-teal/35 p-4">
              <p className="font-medium text-primary">
                {t("revisionSelectionCount", { count: selectedReplacements.length })}
              </p>
              <Button type="button" onClick={() => setRevisionPreviewOpen(true)}>
                {t("previewRevision")}
              </Button>
            </section>
          )}
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
        </>
      )}
      {composition && revisionPreviewOpen && selectedReplacements.length > 0 && (
        <section className="space-y-4 rounded-xl border bg-card p-4 sm:p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
              {t("revisionPreview")}
            </p>
            <h3 className="mt-1 text-xl font-semibold text-primary">{t("applySuggestionTitle")}</h3>
          </div>
          <p className="leading-7 text-muted-foreground">{t("applySuggestionHint")}</p>
          <ol className="space-y-4">
            {selectedReplacements.map((replacement) => (
              <li key={replacement.suggestionIndex} className="space-y-2 rounded-lg border p-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-secondary">{t("replace")}</p>
                  <blockquote className="whitespace-pre-wrap break-words leading-6">{replacement.excerpt}</blockquote>
                </div>
                <div className="space-y-1 rounded-md bg-soft-teal p-3">
                  <p className="text-sm font-semibold text-secondary">{t("withRevision")}</p>
                  <p className="whitespace-pre-wrap break-words leading-6">{replacement.revision}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-sm leading-6 text-muted-foreground">{t("appliedTextHighlightHint")}</p>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => setRevisionPreviewOpen(false)}>
              {t("cancel")}
            </Button>
            <CreateCompositionCopy
              composition={composition}
              replacements={selectedReplacements}
              buttonText={t("createSuggestedRevision")}
            />
          </div>
        </section>
      )}
    </section>
  );
}
