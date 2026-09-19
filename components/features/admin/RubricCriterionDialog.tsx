"use client";

import { useState, type FormEvent } from "react";
import { useRubricCopy } from "@/lib/hooks/useRubricCopy";
import { Loader2 } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { ErrorState } from "@/components/shared/ErrorState";
import { getApiErrorMessage } from "@/lib/api/client";
import {
  useCreateRubricCriterion,
  useUpdateRubricCriterion,
} from "@/lib/hooks/useRubrics";
import { formatWeight, getRubricGroupTotal } from "@/lib/rubric-utils";
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

type FormErrors = Partial<
  Record<"criterionName" | "criterionDescription" | "weightPercentage", string>
>;

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
  const { t, label } = useRubricCopy();
  const createMutation = useCreateRubricCriterion();
  const updateMutation = useUpdateRubricCriterion();
  const [language, setLanguage] = useState<RubricLanguage>(
    criterion?.language ?? defaultLanguage ?? "ENGLISH",
  );
  const [difficultyLevel, setDifficultyLevel] = useState<RubricDifficultyLevel>(
    criterion?.difficultyLevel ?? defaultDifficultyLevel ?? "BEGINNER",
  );
  const [criterionName, setCriterionName] = useState(
    criterion?.criterionName ?? "",
  );
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
  const existingGroupTotal = getRubricGroupTotal(
    allCriteria,
    language,
    difficultyLevel,
  );
  const currentWeightInTargetGroup =
    criterion?.language === language &&
    criterion.difficultyLevel === difficultyLevel
      ? Number(criterion.weightPercentage)
      : 0;
  const projectedTotal =
    existingGroupTotal -
    currentWeightInTargetGroup +
    (Number.isFinite(parsedWeight) ? parsedWeight : 0);

  function validate() {
    const errors: FormErrors = {};
    const trimmedName = criterionName.trim();
    const trimmedDescription = criterionDescription.trim();

    if (!trimmedName) errors.criterionName = t("nameRequired");
    else if (trimmedName.length > 200) errors.criterionName = t("nameLong");
    if (!trimmedDescription)
      errors.criterionDescription = t("descriptionRequired");
    if (
      !weightPercentage ||
      !Number.isFinite(parsedWeight) ||
      parsedWeight < 0.01 ||
      parsedWeight > 100
    ) {
      errors.weightPercentage = t("weightRange");
    } else if (!/^\d{1,3}(\.\d{1,2})?$/.test(weightPercentage)) {
      errors.weightPercentage = t("weightPrecision");
    }

    setFormErrors(errors);
    const first = Object.keys(errors)[0];
    if (first)
      document
        .getElementById(
          {
            criterionName: "rubric-name",
            criterionDescription: "rubric-description",
            weightPercentage: "rubric-weight",
          }[first as keyof FormErrors],
        )
        ?.focus();
    return Object.keys(errors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending || !validate()) return;

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
        { onSuccess: () => onSaved(t("updated")) },
      );
    } else {
      createMutation.mutate(body, { onSuccess: () => onSaved(t("created")) });
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
      title={t(isEditing ? "edit" : "add")}
      className="max-h-[90vh] max-w-2xl overflow-y-auto"
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {Object.keys(formErrors).length > 0 && (
          <ErrorState message={t("fixFields")} />
        )}
        {mutationError ? (
          <ErrorState message={getApiErrorMessage(mutationError)} />
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="rubric-language">{t("language")}</Label>
            <Select
              id="rubric-language"
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value as RubricLanguage)
              }
              disabled={isPending}
            >
              {RUBRIC_LANGUAGES.map((value) => (
                <option key={value} value={value}>
                  {label(value)}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rubric-difficulty">{t("difficulty")}</Label>
            <Select
              id="rubric-difficulty"
              value={difficultyLevel}
              onChange={(event) =>
                setDifficultyLevel(event.target.value as RubricDifficultyLevel)
              }
              disabled={isPending}
            >
              {RUBRIC_DIFFICULTY_LEVELS.map((value) => (
                <option key={value} value={value}>
                  {label(value)}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="rubric-name">{t("name")}</Label>
            <span className="text-xs text-muted-foreground">
              {criterionName.trim().length}/200
            </span>
          </div>
          <Input
            id="rubric-name"
            value={criterionName}
            onChange={(event) => setCriterionName(event.target.value)}
            placeholder={t("namePlaceholder")}
            maxLength={200}
            autoFocus
            aria-invalid={!!formErrors.criterionName}
            aria-describedby={
              formErrors.criterionName ? "rubric-name-error" : undefined
            }
            disabled={isPending}
          />
          {formErrors.criterionName ? (
            <p id="rubric-name-error" className="text-xs text-destructive">
              {formErrors.criterionName}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="rubric-description">{t("description")}</Label>
          <Textarea
            id="rubric-description"
            value={criterionDescription}
            onChange={(event) => setCriterionDescription(event.target.value)}
            placeholder={t("descriptionPlaceholder")}
            aria-invalid={!!formErrors.criterionDescription}
            aria-describedby={
              formErrors.criterionDescription
                ? "rubric-description-error"
                : undefined
            }
            disabled={isPending}
          />
          {formErrors.criterionDescription ? (
            <p
              id="rubric-description-error"
              className="text-xs text-destructive"
            >
              {formErrors.criterionDescription}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="rubric-weight">{t("weightPercent")}</Label>
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
              aria-describedby={
                formErrors.weightPercentage
                  ? "rubric-weight-help rubric-weight-error"
                  : "rubric-weight-help"
              }
              disabled={isPending}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
          {formErrors.weightPercentage ? (
            <p id="rubric-weight-error" className="text-xs text-destructive">
              {formErrors.weightPercentage}
            </p>
          ) : null}
          <p id="rubric-weight-help" className="text-xs text-muted-foreground">
            {t("projected")}: {label(language)} · {label(difficultyLevel)}:{" "}
            <strong className={projectedTotalClass}>
              {formatWeight(projectedTotal)}
            </strong>
            . {t("totalHelp")}
          </p>
        </div>

        <div className="flex justify-end gap-2 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : null}
            {t(isEditing ? "save" : "add")}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
