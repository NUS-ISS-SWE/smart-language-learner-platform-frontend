"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Plus, Scale, TriangleAlert } from "lucide-react";
import { RubricCriterionDialog } from "@/components/features/admin/RubricCriterionDialog";
import { DeleteRubricCriterionDialog } from "@/components/features/admin/DeleteRubricCriterionDialog";
import { RubricCriterionTable } from "@/components/features/admin/RubricCriterionTable";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { getApiErrorMessage } from "@/lib/api/client";
import { useRubricCriteria } from "@/lib/hooks/useRubrics";
import {
  formatWeight,
  getRubricGroupTotal,
  sortRubricCriteria,
} from "@/lib/rubric-utils";
import { cn } from "@/lib/utils";
import { useRubricCopy } from "@/lib/hooks/useRubricCopy";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  RUBRIC_DIFFICULTY_LEVELS,
  RUBRIC_LANGUAGES,
  type RubricCriterion,
  type RubricDifficultyLevel,
  type RubricLanguage,
} from "@/types/rubric";

type LanguageFilter = RubricLanguage | "";
type DifficultyFilter = RubricDifficultyLevel | "";
const EMPTY_CRITERIA: RubricCriterion[] = [];

export default function AdminRubricsPage() {
  const { t, label } = useRubricCopy();
  const rubricQuery = useRubricCriteria();
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>("");
  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] =
    useState<RubricCriterion | null>(null);
  const [deletingCriterion, setDeletingCriterion] =
    useState<RubricCriterion | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const allCriteria = rubricQuery.data ?? EMPTY_CRITERIA;
  const visibleCriteria = useMemo(
    () =>
      sortRubricCriteria(
        allCriteria.filter(
          (criterion) =>
            (!languageFilter || criterion.language === languageFilter) &&
            (!difficultyFilter ||
              criterion.difficultyLevel === difficultyFilter),
        ),
      ),
    [allCriteria, languageFilter, difficultyFilter],
  );

  function openCreateDialog() {
    setSuccessMessage(null);
    setEditingCriterion(null);
    setEditorOpen(true);
  }

  function openEditDialog(criterion: RubricCriterion) {
    setSuccessMessage(null);
    setEditingCriterion(criterion);
    setEditorOpen(true);
  }

  function selectGroup(
    language: RubricLanguage,
    difficultyLevel: RubricDifficultyLevel,
  ) {
    setLanguageFilter(language);
    setDifficultyFilter(difficultyLevel);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("intro")}
        actions={
          <Button type="button" onClick={openCreateDialog}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t("add")}
          </Button>
        }
      />

      {successMessage ? (
        <div
          role="status"
          className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          {successMessage}
        </div>
      ) : null}

      {rubricQuery.isLoading ? <LoadingState label={t("loading")} /> : null}
      {rubricQuery.isError ? (
        <div className="space-y-3">
          <ErrorState message={getApiErrorMessage(rubricQuery.error)} />
          <Button variant="outline" onClick={() => void rubricQuery.refetch()}>
            {t("retry")}
          </Button>
        </div>
      ) : null}

      {rubricQuery.data ? (
        <>
          <section aria-labelledby="rubric-coverage-heading">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <h2
                  id="rubric-coverage-heading"
                  className="text-lg font-semibold"
                >
                  {t("coverage")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("coverageHint")}
                </p>
              </div>
              <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                <Scale className="h-4 w-4" aria-hidden="true" />
                {t("target")}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {RUBRIC_LANGUAGES.flatMap((language) =>
                RUBRIC_DIFFICULTY_LEVELS.map((difficultyLevel) => {
                  const groupCriteria = allCriteria.filter(
                    (criterion) =>
                      criterion.language === language &&
                      criterion.difficultyLevel === difficultyLevel,
                  );
                  const total = getRubricGroupTotal(
                    allCriteria,
                    language,
                    difficultyLevel,
                  );
                  const isComplete = Math.abs(total - 100) < 0.001;
                  const isSelected =
                    languageFilter === language &&
                    difficultyFilter === difficultyLevel;

                  return (
                    <button
                      type="button"
                      key={`${language}-${difficultyLevel}`}
                      onClick={() => selectGroup(language, difficultyLevel)}
                      aria-pressed={isSelected}
                      className={cn(
                        "rounded-xl border bg-card p-5 text-left transition-colors hover:border-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isSelected &&
                          "border-secondary bg-soft-teal/40 ring-1 ring-secondary",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">
                            {label(language)} · {label(difficultyLevel)}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {t("criteriaCount", {
                              count: groupCriteria.length,
                            })}
                          </p>
                        </div>
                        {isComplete ? (
                          <CheckCircle2
                            className="h-5 w-5 shrink-0 text-emerald-600"
                            aria-label={t("complete")}
                          />
                        ) : (
                          <TriangleAlert
                            className="h-5 w-5 shrink-0 text-amber-600"
                            aria-label={t("needsAttention")}
                          />
                        )}
                      </div>
                      <div className="mt-4 flex items-end justify-between gap-3">
                        <span className="text-xs text-muted-foreground">
                          {t("weightTotal")}
                        </span>
                        <span
                          className={cn(
                            "text-2xl font-semibold tracking-tight tabular-nums",
                            isComplete ? "text-emerald-700" : "text-amber-700",
                          )}
                        >
                          {formatWeight(total)}
                        </span>
                      </div>
                      <div
                        aria-hidden="true"
                        className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted"
                      >
                        <div
                          className={cn(
                            "h-full rounded-full",
                            isComplete ? "bg-secondary" : "bg-amber-600",
                          )}
                          style={{
                            width: `${Math.max(0, Math.min(total, 100))}%`,
                          }}
                        />
                      </div>
                    </button>
                  );
                }),
              )}
            </div>
          </section>

          <Card className="rounded-2xl">
            <CardHeader className="pb-4">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <CardTitle>{t("criteria")}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("showing", {
                      visible: visibleCriteria.length,
                      total: allCriteria.length,
                    })}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Select
                    aria-label={t("filterLanguage")}
                    value={languageFilter}
                    onChange={(event) =>
                      setLanguageFilter(event.target.value as LanguageFilter)
                    }
                    className="sm:w-44"
                  >
                    <option value="">{t("allLanguages")}</option>
                    {RUBRIC_LANGUAGES.map((language) => (
                      <option key={language} value={language}>
                        {label(language)}
                      </option>
                    ))}
                  </Select>
                  <Select
                    aria-label={t("filterDifficulty")}
                    value={difficultyFilter}
                    onChange={(event) =>
                      setDifficultyFilter(
                        event.target.value as DifficultyFilter,
                      )
                    }
                    className="sm:w-48"
                  >
                    <option value="">{t("allDifficulties")}</option>
                    {RUBRIC_DIFFICULTY_LEVELS.map((difficultyLevel) => (
                      <option key={difficultyLevel} value={difficultyLevel}>
                        {label(difficultyLevel)}
                      </option>
                    ))}
                  </Select>
                  {languageFilter || difficultyFilter ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setLanguageFilter("");
                        setDifficultyFilter("");
                      }}
                    >
                      {t("clear")}
                    </Button>
                  ) : null}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {visibleCriteria.length > 0 ? (
                <RubricCriterionTable
                  criteria={visibleCriteria}
                  onEdit={openEditDialog}
                  onDelete={(criterion) => {
                    setSuccessMessage(null);
                    setDeletingCriterion(criterion);
                  }}
                />
              ) : (
                <EmptyState
                  title={t("noCriteria")}
                  description={t("noCriteriaHint")}
                  action={
                    <Button onClick={openCreateDialog}>{t("add")}</Button>
                  }
                  className="min-h-[240px]"
                />
              )}
            </CardContent>
          </Card>
        </>
      ) : null}

      <RubricCriterionDialog
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        criterion={editingCriterion}
        allCriteria={allCriteria}
        defaultLanguage={languageFilter || undefined}
        defaultDifficultyLevel={difficultyFilter || undefined}
        onSaved={(message) => {
          setEditorOpen(false);
          setEditingCriterion(null);
          setSuccessMessage(message);
        }}
      />
      <DeleteRubricCriterionDialog
        key={deletingCriterion?.id ?? "closed"}
        criterion={deletingCriterion}
        onClose={() => setDeletingCriterion(null)}
        onDeleted={() => {
          setDeletingCriterion(null);
          setSuccessMessage(t("removed"));
        }}
      />
    </div>
  );
}
