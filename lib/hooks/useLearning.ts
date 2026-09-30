"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelLearningGoal,
  createLearningGoal,
  getAchievements,
  getCurrentChallenge,
  getLearningGoals,
  getLearningSummary,
  submitChallenge,
  getCurrentChallengeSubmission,
  createChallengeTemplate,
  deleteChallengeTemplate,
  getChallengeTemplates,
  updateChallengeTemplate,
  createAchievementDefinition,
  deactivateAchievementDefinition,
  getAchievementDefinitions,
  updateAchievementDefinition,
  focusLearningGoal,
} from "@/lib/api/learning";
import type {
  ChallengeCadence,
  GoalMetric,
  ChallengeCategory,
} from "@/types/learning";

export const learningKeys = {
  all: ["learning"] as const,
  summary: (language: "ENGLISH" | "CHINESE") =>
    [...learningKeys.all, "summary", language] as const,
  challenge: (
    cadence: ChallengeCadence,
    language: "ENGLISH" | "CHINESE",
    themePath?: string,
  ) =>
    [...learningKeys.all, "challenge", cadence, language, themePath] as const,
  submission: (challengeId: number, language: "ENGLISH" | "CHINESE") =>
    [...learningKeys.all, "submission", challengeId, language] as const,
  goals: () => [...learningKeys.all, "goals"] as const,
  achievements: () => [...learningKeys.all, "achievements"] as const,
  achievementDefinitions: () =>
    [...learningKeys.all, "admin", "achievement-definitions"] as const,
};

export function useLearningSummary(language: "ENGLISH" | "CHINESE") {
  return useQuery({
    queryKey: learningKeys.summary(language),
    queryFn: () => getLearningSummary(language),
  });
}

export function useCurrentChallenge(
  cadence: ChallengeCadence,
  language: "ENGLISH" | "CHINESE",
  themePath?: string,
) {
  return useQuery({
    queryKey: learningKeys.challenge(cadence, language, themePath),
    queryFn: () => getCurrentChallenge(cadence, language, themePath),
  });
}

export function useSubmitChallenge(language: "ENGLISH" | "CHINESE") {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      challengeId,
      content,
    }: {
      challengeId: number;
      content: string;
    }) => submitChallenge(challengeId, content, language),
    onSuccess: () =>
      void client.invalidateQueries({ queryKey: learningKeys.all }),
  });
}
export function useCurrentChallengeSubmission(
  challengeId: number,
  language: "ENGLISH" | "CHINESE",
  enabled: boolean,
) {
  return useQuery({
    queryKey: learningKeys.submission(challengeId, language),
    queryFn: () => getCurrentChallengeSubmission(challengeId, language),
    enabled,
  });
}

export function useLearningGoals() {
  return useQuery({
    queryKey: learningKeys.goals(),
    queryFn: getLearningGoals,
  });
}

export function useCreateLearningGoal() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      metric: GoalMetric;
      target: number;
      category?: ChallengeCategory;
      dueOn?: string;
    }) => createLearningGoal(payload),
    onSuccess: () =>
      void client.invalidateQueries({ queryKey: learningKeys.all }),
  });
}

export function useCancelLearningGoal() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: cancelLearningGoal,
    onSuccess: () =>
      void client.invalidateQueries({ queryKey: learningKeys.all }),
  });
}
export function useFocusLearningGoal() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: focusLearningGoal,
    onSuccess: () =>
      void client.invalidateQueries({ queryKey: learningKeys.all }),
  });
}

export function useAchievements() {
  return useQuery({
    queryKey: learningKeys.achievements(),
    queryFn: getAchievements,
  });
}

export function useChallengeTemplates() {
  return useQuery({
    queryKey: [...learningKeys.all, "admin", "challenge-templates"],
    queryFn: getChallengeTemplates,
  });
}

export function useSaveChallengeTemplate() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id?: number;
      payload: Parameters<typeof createChallengeTemplate>[0];
    }) =>
      id
        ? updateChallengeTemplate(id, payload)
        : createChallengeTemplate(payload),
    onSuccess: () =>
      void client.invalidateQueries({ queryKey: learningKeys.all }),
  });
}

export function useDeleteChallengeTemplate() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: deleteChallengeTemplate,
    onSuccess: () =>
      void client.invalidateQueries({ queryKey: learningKeys.all }),
  });
}

export function useAchievementDefinitions() {
  return useQuery({
    queryKey: learningKeys.achievementDefinitions(),
    queryFn: getAchievementDefinitions,
  });
}
export function useSaveAchievementDefinition() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id?: number;
      payload: Parameters<typeof createAchievementDefinition>[0];
    }) =>
      id
        ? updateAchievementDefinition(id, payload)
        : createAchievementDefinition(payload),
    onSuccess: () =>
      void client.invalidateQueries({ queryKey: learningKeys.all }),
  });
}
export function useDeactivateAchievementDefinition() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: deactivateAchievementDefinition,
    onSuccess: () =>
      void client.invalidateQueries({ queryKey: learningKeys.all }),
  });
}
