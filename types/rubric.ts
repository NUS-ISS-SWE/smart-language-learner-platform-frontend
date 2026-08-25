export const RUBRIC_LANGUAGES = ["ENGLISH", "CHINESE"] as const;
export const RUBRIC_DIFFICULTY_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export type RubricLanguage = (typeof RUBRIC_LANGUAGES)[number];
export type RubricDifficultyLevel = (typeof RUBRIC_DIFFICULTY_LEVELS)[number];

export type RubricCriterion = {
  id: number;
  language: RubricLanguage;
  difficultyLevel: RubricDifficultyLevel;
  criterionName: string;
  criterionDescription: string;
  weightPercentage: number;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RubricCriterionRequest = Pick<
  RubricCriterion,
  "language" | "difficultyLevel" | "criterionName" | "criterionDescription" | "weightPercentage"
>;

export type RubricCriteriaParams = {
  language?: RubricLanguage;
  difficultyLevel?: RubricDifficultyLevel;
};
