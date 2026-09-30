import { apiClient } from "./client";
import type {
  Achievement,
  Challenge,
  ChallengeCadence,
  ChallengeSubmission,
  GoalMetric,
  LearningGoal,
  LearningSummary,
  ChallengeTemplate,
  ChallengeTemplateInput,
  AchievementDefinition,
  AchievementDefinitionInput,
  ChallengeCategory,
} from "@/types/learning";

type Language = "ENGLISH" | "CHINESE";

export async function getLearningSummary(language: Language) {
  return (
    await apiClient.get<LearningSummary>("/api/v1/learning/summary", {
      params: { language },
    })
  ).data;
}

export async function getCurrentChallenge(
  cadence: ChallengeCadence,
  language: Language,
  themePath?: string,
) {
  return (
    await apiClient.get<Challenge>("/api/v1/learning/challenges/current", {
      params: { cadence, language, themePath },
    })
  ).data;
}

export async function submitChallenge(
  challengeId: number,
  content: string,
  language: Language,
) {
  return (
    await apiClient.post<ChallengeSubmission>(
      `/api/v1/learning/challenges/${challengeId}/submissions`,
      { content },
      { params: { language } },
    )
  ).data;
}
export async function getCurrentChallengeSubmission(
  challengeId: number,
  language: Language,
) {
  return (
    await apiClient.get<ChallengeSubmission>(
      `/api/v1/learning/challenges/${challengeId}/submissions/current`,
      { params: { language } },
    )
  ).data;
}

export async function getLearningGoals() {
  return (await apiClient.get<LearningGoal[]>("/api/v1/learning/goals")).data;
}

export async function createLearningGoal(payload: {
  metric: GoalMetric;
  target: number;
  category?: ChallengeCategory;
  dueOn?: string;
}) {
  return (await apiClient.post<LearningGoal>("/api/v1/learning/goals", payload))
    .data;
}

export async function cancelLearningGoal(id: number) {
  return (
    await apiClient.post<LearningGoal>(`/api/v1/learning/goals/${id}/cancel`)
  ).data;
}
export async function focusLearningGoal(id: number) {
  return (
    await apiClient.post<LearningGoal>(`/api/v1/learning/goals/${id}/focus`)
  ).data;
}

export async function getAchievements() {
  return (await apiClient.get<Achievement[]>("/api/v1/learning/achievements"))
    .data;
}

export async function getChallengeTemplates() {
  return (
    await apiClient.get<ChallengeTemplate[]>(
      "/api/v1/admin/learning/challenges",
    )
  ).data;
}

export async function createChallengeTemplate(payload: ChallengeTemplateInput) {
  return (
    await apiClient.post<ChallengeTemplate>(
      "/api/v1/admin/learning/challenges",
      payload,
    )
  ).data;
}

export async function updateChallengeTemplate(
  id: number,
  payload: ChallengeTemplateInput,
) {
  return (
    await apiClient.put<ChallengeTemplate>(
      `/api/v1/admin/learning/challenges/${id}`,
      payload,
    )
  ).data;
}

export async function deleteChallengeTemplate(id: number) {
  await apiClient.delete(`/api/v1/admin/learning/challenges/${id}`);
}

export async function getAchievementDefinitions() {
  return (
    await apiClient.get<AchievementDefinition[]>(
      "/api/v1/admin/learning/achievements",
    )
  ).data;
}
export async function createAchievementDefinition(
  payload: AchievementDefinitionInput,
) {
  return (
    await apiClient.post<AchievementDefinition>(
      "/api/v1/admin/learning/achievements",
      payload,
    )
  ).data;
}
export async function updateAchievementDefinition(
  id: number,
  payload: AchievementDefinitionInput,
) {
  return (
    await apiClient.put<AchievementDefinition>(
      `/api/v1/admin/learning/achievements/${id}`,
      payload,
    )
  ).data;
}
export async function deactivateAchievementDefinition(id: number) {
  await apiClient.delete(`/api/v1/admin/learning/achievements/${id}`);
}
