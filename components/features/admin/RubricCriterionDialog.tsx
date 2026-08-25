"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { ErrorState } from "@/components/shared/ErrorState";
import { getApiErrorMessage } from "@/lib/api/client";
import { useCreateRubricCriterion, useUpdateRubricCriterion } from "@/lib/hooks/useRubrics";
import { formatRubricLabel, formatWeight, getRubricGroupTotal } from "@/lib/rubric-utils";
import {
  RUBRIC_DIFFICULTY_LEVELS,
  RUBRIC_LANGUAGES,
  type RubricCriterion,
  type RubricCriterionRequest,
  type RubricDifficultyLevel,
  type RubricLanguage,
} from "@/types/rubric";

type RubricCriterionDialogProps = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly criterion: RubricCriterion | null;
  readonly allCriteria: RubricCriterion[];
  readonly defaultLanguage?: RubricLanguage;
  readonly defaultDifficultyLevel?: RubricDifficultyLevel;
  readonly onSaved: (message: string) => void;
};

type FormErrors = Partial<Record<"criterionName" | "criterionDescription" | "weightPercentage", string>>;

export function RubricCriterionDialog(props: RubricCriterionDialogProps) {
  if (!props.open) return null;
  return <RubricCriterionDialogContent {...props} />;
}

function RubricCriterionDialogContent({
  onClose,
  criterion,
  allCriteria,
  defaultLanguage,
  defaultDifficultyLevel,
  onSaved,
}: RubricCriterionDialogProps) {
  const createMutation = useCreateRubricCriterion();
  const updateMutation = useUpdateRubricCriterion();
  const [language, setLanguage] = useState<RubricLanguage>(
    criterion?.language ?? defaultLanguage ?? "ENGLISH",
  );
  const [difficultyLevel, setDifficultyLevel] = useState<RubricDifficultyLevel>(
    criterion?.difficultyLevel ?? defaultDifficultyLevel ?? "BEGINNER",
  );
  const [criterionName, setCriterionName] = useState(criterion?.criterionName ?? "");
  const [criterionDescription, setCriterionDescription] = useState(
    criterion?.criterionDescription ?? "",
  );
  const [weightPercentage, setWeightPercentage] = useState(
    criterion ? String(Number(criterion.weightPercentage)) : "",
  );
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const isEditing = criterion !== null;
  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error ?? updateMutation.error;
  const parsedWeight = Number(weightPercentage);
  const existingGroupTotal = getRubricGroupTotal(allCriteria, language, difficultyLevel);
  const currentWeightInTargetGroup =
    criterion?.language === language && criterion.difficultyLevel === difficultyLevel
      ? Number(criterion.weightPercentage)
      : 0;
  const projectedTotal =
    existingGroupTotal - currentWeightInTargetGroup + (Number.isFinite(parsedWeight) ? parsedWeight : 0);

  function validate() {
    const errors: FormErrors = {};
    const trimmedName = criterionName.trim();
    const trimmedDescription = criterionDescription.trim();

    if (!trimmedName) errors.criterionName = "Criterion name is required.";
    else if (trimmedName.length > 200) errors.criterionName = "Criterion name must be 200 characters or fewer.";
    if (!trimmedDescription) errors.criterionDescription = "Description is required.";
    if (!weightPercentage || !Number.isFinite(parsedWeight) || parsedWeight < 0.01 || parsedWeight > 100) {
      errors.weightPercentage = "Weight must be between 0.01 and 100.00.";
    } else if (!/^\d{1,3}(\.\d{1,2})?$/.test(weightPercentage)) {
      errors.weightPercentage = "Use no more than two decimal places.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    const body: RubricCriterionRequest = {
      language,
      difficultyLevel,
      criterionName: criterionName.trim(),
      criterionDescription: criterionDescription.trim(),
      weightPercentage: parsedWeight,
    };

    if (criterion) {
      updateMutation.mutate(
        { id: criterion.id, body },
        { onSuccess: () => onSaved("Rubric criterion updated.") },
      );
    } else {
      createMutation.mutate(body, { onSuccess: () => onSaved("Rubric criterion created.") });
    }
  }

  const projectedTotalClass =
    Math.abs(projectedTotal - 100) < 0.001
      ? "text-emerald-700"
      : projectedTotal > 100
        ? "text-destructive"
        : "text-amber-700";

  return (
    <Dialog
      open
      onClose={() => {
        if (!isPending) onClose();
      }}
      title={isEditing ? "Edit rubric criterion" : "Add rubric criterion"}
      className="max-h-[90vh] max-w-2xl overflow-y-auto"
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {mutationError ? <ErrorState message={getApiErrorMessage(mutationError)} /> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="rubric-language">Language</Label>
            <Select
              id="rubric-language"
              value={language}
              onChange={(event) => setLanguage(event.target.value as RubricLanguage)}
              disabled={isPending}
            >
              {RUBRIC_LANGUAGES.map((value) => (
                <option key={value} value={value}>
                  {formatRubricLabel(value)}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rubric-difficulty">Difficulty level</Label>
            <Select
              id="rubric-difficulty"
              value={difficultyLevel}
              onChange={(event) => setDifficultyLevel(event.target.value as RubricDifficultyLevel)}
              disabled={isPending}
            >
              {RUBRIC_DIFFICULTY_LEVELS.map((value) => (
                <option key={value} value={value}>
                  {formatRubricLabel(value)}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="rubric-name">Criterion name</Label>
            <span className="text-xs text-muted-foreground">{criterionName.trim().length}/200</span>
          </div>
          <Input
            id="rubric-name"
            value={criterionName}
            onChange={(event) => setCriterionName(event.target.value)}
            placeholder="e.g. CONTENT_RELEVANCE"
            maxLength={200}
            autoFocus
            aria-invalid={!!formErrors.criterionName}
            aria-describedby={formErrors.criterionName ? "rubric-name-error" : undefined}
            disabled={isPending}
          />
          {formErrors.criterionName ? (
            <p id="rubric-name-error" className="text-xs text-destructive">
              {formErrors.criterionName}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="rubric-description">Description</Label>
          <Textarea
            id="rubric-description"
            value={criterionDescription}
            onChange={(event) => setCriterionDescription(event.target.value)}
            placeholder="Describe what this criterion evaluates and what good performance looks like."
            aria-invalid={!!formErrors.criterionDescription}
            aria-describedby={formErrors.criterionDescription ? "rubric-description-error" : undefined}
            disabled={isPending}
          />
          {formErrors.criterionDescription ? (
            <p id="rubric-description-error" className="text-xs text-destructive">
              {formErrors.criterionDescription}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="rubric-weight">Weight percentage</Label>
          <div className="relative max-w-xs">
            <Input
              id="rubric-weight"
              type="number"
              min="0.01"
              max="100"
              step="0.01"
              value={weightPercentage}
              onChange={(event) => setWeightPercentage(event.target.value)}
              className="pr-9"
              placeholder="25.00"
              aria-invalid={!!formErrors.weightPercentage}
              aria-describedby="rubric-weight-help"
              disabled={isPending}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
          {formErrors.weightPercentage ? (
            <p className="text-xs text-destructive">{formErrors.weightPercentage}</p>
          ) : null}
          <p id="rubric-weight-help" className="text-xs text-muted-foreground">
            Projected total for {formatRubricLabel(language)} · {formatRubricLabel(difficultyLevel)}:{" "}
            <strong className={projectedTotalClass}>{formatWeight(projectedTotal)}</strong>. A complete rubric
            normally totals 100.00%.
          </p>
        </div>

        <div className="flex justify-end gap-2 border-t pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {isEditing ? "Save changes" : "Add criterion"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
