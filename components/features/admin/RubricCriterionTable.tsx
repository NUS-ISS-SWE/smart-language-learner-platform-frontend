"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatRubricLabel, formatWeight } from "@/lib/rubric-utils";
import type { RubricCriterion, RubricDifficultyLevel } from "@/types/rubric";

type RubricCriterionTableProps = {
  readonly criteria: RubricCriterion[];
  readonly onEdit: (criterion: RubricCriterion) => void;
  readonly onDelete: (criterion: RubricCriterion) => void;
};

const DIFFICULTY_VARIANTS: Record<
  RubricDifficultyLevel,
  "success" | "warning" | "destructive"
> = {
  BEGINNER: "success",
  INTERMEDIATE: "warning",
  ADVANCED: "destructive",
};

export function RubricCriterionTable({ criteria, onEdit, onDelete }: RubricCriterionTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full min-w-[920px] text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="w-[42%] px-4 py-3 text-left font-medium text-muted-foreground">Criterion</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Rubric group</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Weight</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Last updated</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {criteria.map((criterion) => (
            <tr key={criterion.id} className="align-top transition-colors hover:bg-muted/30">
              <td className="px-4 py-4">
                <p className="font-semibold">{formatRubricLabel(criterion.criterionName)}</p>
                <p className="mt-1 line-clamp-2 max-w-xl leading-5 text-muted-foreground">
                  {criterion.criterionDescription}
                </p>
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{formatRubricLabel(criterion.language)}</Badge>
                  <Badge variant={DIFFICULTY_VARIANTS[criterion.difficultyLevel]}>
                    {formatRubricLabel(criterion.difficultyLevel)}
                  </Badge>
                </div>
              </td>
              <td className="px-4 py-4 text-right font-semibold tabular-nums">
                {formatWeight(criterion.weightPercentage)}
              </td>
              <td className="px-4 py-4 text-muted-foreground">
                <p>{new Date(criterion.updatedAt).toLocaleDateString()}</p>
                <p className="mt-1 text-xs">by {criterion.updatedBy ?? "Unknown"}</p>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(criterion)}
                    aria-label={`Edit ${formatRubricLabel(criterion.criterionName)}`}
                    title="Edit criterion"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(criterion)}
                    aria-label={`Delete ${formatRubricLabel(criterion.criterionName)}`}
                    title="Delete criterion"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
