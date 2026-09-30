export type ChallengeCadence = "DAILY" | "WEEKLY";
export type GoalMetric =
  | "DAILY_CHALLENGE_COMPLETIONS"
  | "WEEKLY_CHALLENGE_COMPLETIONS"
  | "CATEGORY_CHALLENGE_COMPLETIONS"
  | "CURRENT_STREAK_DAYS"
  | "REVIEWED_COMPOSITIONS"
  | "OVERALL_ASSESSMENT_SCORE"
  | "VOCABULARY_RUBRIC_SCORE";
export type GoalStatus = "ACTIVE" | "COMPLETED" | "CANCELLED" | "EXPIRED";

export type ChallengeCategory =
  "REFLECTION" | "DESCRIPTION" | "STORYTELLING" | "PRACTICAL";
export type Challenge = {
  id: number;
  cadence: ChallengeCadence;
  language: "ENGLISH" | "CHINESE";
  category: ChallengeCategory;
  themePath: string;
  title: string;
  prompt: string;
  minResponseUnits: number;
  maxResponseUnits: number;
  cycleKey: string;
  submitted: boolean;
};
export type ChallengeSubmission = {
  id: number;
  challengeTemplateId: number;
  cadence: ChallengeCadence;
  activityDate: string;
  title: string;
  content: string;
  submittedAt: string;
};
export type LearningGoal = {
  id: number;
  metric: GoalMetric;
  category: ChallengeCategory | null;
  focused: boolean;
  target: number;
  progress: number;
  status: GoalStatus;
  startsOn: string;
  dueOn: string | null;
  createdAt: string;
  completedAt: string | null;
};
export type Achievement = {
  awardId: number;
  code: string;
  title: string;
  description: string;
  category: string;
  threshold: number;
  awardedAt: string;
  seenAt: string | null;
};
export type LearningSummary = {
  currentStreak: number;
  longestStreak: number;
  completedChallenges: number;
  activeGoals: LearningGoal[];
  newAwards: Achievement[];
  dailyChallenge: Challenge;
  weeklyChallenge: Challenge;
};
export type ChallengeTemplate = Omit<Challenge, "cycleKey" | "submitted"> & {
  code: string;
  active: boolean;
  displayOrder: number;
};
export type ChallengeTemplateInput = Omit<ChallengeTemplate, "id">;
export type AchievementCategory =
  | "CHALLENGE_COMPLETIONS"
  | "STREAK_DAYS"
  | "WEEKLY_CHALLENGES"
  | "REVIEWED_COMPOSITIONS"
  | "OVERALL_SCORE"
  | "VOCABULARY_SCORE"
  | "PERSONAL_BEST_SCORE";
export type AchievementDefinition = {
  id: number;
  code: string;
  title: string;
  description: string;
  category: AchievementCategory;
  threshold: number;
  active: boolean;
};
export type AchievementDefinitionInput = Omit<AchievementDefinition, "id">;
