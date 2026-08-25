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
  formatRubricLabel,
  formatWeight,
  getRubricGroupTotal,
  sortRubricCriteria,
} from "@/lib/rubric-utils";
import { cn } from "@/lib/utils";
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
  const rubricQuery = useRubricCriteria();
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>("");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<RubricCriterion | null>(null);
  const [deletingCriterion, setDeletingCriterion] = useState<RubricCriterion | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const allCriteria = rubricQuery.data ?? EMPTY_CRITERIA;
  const visibleCriteria = useMemo(
    () =>
      sortRubricCriteria(
        allCriteria.filter(
          (criterion) =>
            (!languageFilter || criterion.language === languageFilter) &&
            (!difficultyFilter || criterion.difficultyLevel === difficultyFilter),
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

  function selectGroup(language: RubricLanguage, difficultyLevel: RubricDifficultyLevel) {
    setLanguageFilter(language);
    setDifficultyFilter(difficultyLevel);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">Rubric Management</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Configure the weighted criteria used to evaluate compositions for each language and difficulty level.
          </p>
        </div>
        <Button type="button" onClick={openCreateDialog}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add criterion
        </Button>
      </div>

      {successMessage ? (
        <div
          role="status"
          className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          {successMessage}
        </div>
      ) : null}

      {rubricQuery.isLoading ? <LoadingState label="Loading rubric criteria…" /> : null}
      {rubricQuery.isError ? <ErrorState message={getApiErrorMessage(rubricQuery.error)} /> : null}

      {rubricQuery.data ? (
        <>
          <section aria-labelledby="rubric-coverage-heading">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <h2 id="rubric-coverage-heading" className="text-lg font-semibold">
                  Rubric coverage
                </h2>
                <p className="text-sm text-muted-foreground">Select a group to inspect its criteria.</p>
              </div>
              <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                <Scale className="h-4 w-4" aria-hidden="true" />
                Target: 100.00% per group
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {RUBRIC_LANGUAGES.flatMap((language) =>
                RUBRIC_DIFFICULTY_LEVELS.map((difficultyLevel) => {
                  const groupCriteria = allCriteria.filter(
                    (criterion) =>
                      criterion.language === language && criterion.difficultyLevel === difficultyLevel,
                  );
                  const total = getRubricGroupTotal(allCriteria, language, difficultyLevel);
                  const isComplete = Math.abs(total - 100) < 0.001;
                  const isSelected =
                    languageFilter === language && difficultyFilter === difficultyLevel;

                  return (
                    <button
                      type="button"
                      key={`${language}-${difficultyLevel}`}
                      onClick={() => selectGroup(language, difficultyLevel)}
                      className={cn(
                        "rounded-lg border bg-card p-4 text-left transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isSelected && "border-accent ring-1 ring-accent",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">
                            {formatRubricLabel(language)} · {formatRubricLabel(difficultyLevel)}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {groupCriteria.length} {groupCriteria.length === 1 ? "criterion" : "criteria"}
                          </p>
                        </div>
                        {isComplete ? (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" aria-label="Complete" />
                        ) : (
                          <TriangleAlert className="h-5 w-5 shrink-0 text-amber-600" aria-label="Needs attention" />
                        )}
                      </div>
                      <div className="mt-4 flex items-end justify-between gap-3">
                        <span className="text-xs text-muted-foreground">Total weight</span>
                        <span
                          className={cn(
                            "text-lg font-semibold tabular-nums",
                            isComplete ? "text-emerald-700" : "text-amber-700",
                          )}
                        >
                          {formatWeight(total)}
                        </span>
                      </div>
                    </button>
                  );
                }),
              )}
            </div>
          </section>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <CardTitle>Criteria</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Showing {visibleCriteria.length} of {allCriteria.length}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Select
                    aria-label="Filter rubrics by language"
                    value={languageFilter}
                    onChange={(event) => setLanguageFilter(event.target.value as LanguageFilter)}
                    className="sm:w-44"
                  >
                    <option value="">All languages</option>
                    {RUBRIC_LANGUAGES.map((language) => (
                      <option key={language} value={language}>
                        {formatRubricLabel(language)}
                      </option>
                    ))}
                  </Select>
                  <Select
                    aria-label="Filter rubrics by difficulty"
                    value={difficultyFilter}
                    onChange={(event) => setDifficultyFilter(event.target.value as DifficultyFilter)}
                    className="sm:w-48"
                  >
                    <option value="">All difficulties</option>
                    {RUBRIC_DIFFICULTY_LEVELS.map((difficultyLevel) => (
                      <option key={difficultyLevel} value={difficultyLevel}>
                        {formatRubricLabel(difficultyLevel)}
                      </option>
                    ))}
                  </Select>
                  {(languageFilter || difficultyFilter) ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setLanguageFilter("");
                        setDifficultyFilter("");
                      }}
                    >
                      Clear
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
                  title="No rubric criteria found"
                  description="There are no criteria matching these filters. Clear the filters or add a criterion to this rubric group."
                  action={<Button onClick={openCreateDialog}>Add criterion</Button>}
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
          setSuccessMessage("Rubric criterion deleted.");
        }}
      />
    </div>
  );
}
