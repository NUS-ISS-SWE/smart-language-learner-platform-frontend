"use client";

import { Loader2, TriangleAlert } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/shared/ErrorState";
import { getApiErrorMessage } from "@/lib/api/client";
import { useDeleteRubricCriterion } from "@/lib/hooks/useRubrics";
import { formatRubricLabel } from "@/lib/rubric-utils";
import type { RubricCriterion } from "@/types/rubric";

type DeleteRubricCriterionDialogProps = {
  readonly criterion: RubricCriterion | null;
  readonly onClose: () => void;
  readonly onDeleted: () => void;
};

export function DeleteRubricCriterionDialog({
  criterion,
  onClose,
  onDeleted,
}: DeleteRubricCriterionDialogProps) {
  const mutation = useDeleteRubricCriterion();
  if (!criterion) return null;

  return (
    <Dialog
      open
      onClose={() => {
        if (!mutation.isPending) onClose();
      }}
      title="Delete rubric criterion"
    >
      <div className="space-y-4">
        {mutation.isError ? <ErrorState message={getApiErrorMessage(mutation.error)} /> : null}
        <div className="flex gap-3 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            Delete <strong>{formatRubricLabel(criterion.criterionName)}</strong> from the{" "}
            {formatRubricLabel(criterion.language)} {formatRubricLabel(criterion.difficultyLevel)} rubric?
            Future evaluations will no longer use this criterion.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => mutation.mutate(criterion.id, { onSuccess: onDeleted })}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            Delete criterion
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
