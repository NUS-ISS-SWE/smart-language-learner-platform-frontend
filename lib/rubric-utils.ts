import type { RubricCriterion, RubricDifficultyLevel, RubricLanguage } from "@/types/rubric";

const LANGUAGE_ORDER: Record<RubricLanguage, number> = {
  ENGLISH: 0,
  CHINESE: 1,
};

const DIFFICULTY_ORDER: Record<RubricDifficultyLevel, number> = {
  BEGINNER: 0,
  INTERMEDIATE: 1,
  ADVANCED: 2,
};

export function formatRubricLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function sortRubricCriteria(criteria: RubricCriterion[]) {
  return [...criteria].sort(
    (left, right) =>
      LANGUAGE_ORDER[left.language] - LANGUAGE_ORDER[right.language] ||
      DIFFICULTY_ORDER[left.difficultyLevel] - DIFFICULTY_ORDER[right.difficultyLevel] ||
      left.id - right.id,
  );
}

export function getRubricGroupTotal(
  criteria: RubricCriterion[],
  language: RubricLanguage,
  difficultyLevel: RubricDifficultyLevel,
) {
  return criteria
    .filter(
      (criterion) =>
        criterion.language === language && criterion.difficultyLevel === difficultyLevel,
    )
    .reduce((total, criterion) => total + Number(criterion.weightPercentage), 0);
}

export function formatWeight(value: number) {
  return `${Number(value).toFixed(2)}%`;
}
