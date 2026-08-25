"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRubricCriterion,
  deleteRubricCriterion,
  listRubricCriteria,
  updateRubricCriterion,
} from "@/lib/api/rubrics";
import type { RubricCriteriaParams, RubricCriterionRequest } from "@/types/rubric";

export const rubricKeys = {
  all: ["admin", "rubrics"] as const,
  list: (params: RubricCriteriaParams) => [...rubricKeys.all, "list", params] as const,
};

export function useRubricCriteria(params: RubricCriteriaParams = {}) {
  return useQuery({
    queryKey: rubricKeys.list(params),
    queryFn: () => listRubricCriteria(params),
  });
}

export function useCreateRubricCriterion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: RubricCriterionRequest) => createRubricCriterion(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: rubricKeys.all }),
  });
}

export function useUpdateRubricCriterion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: RubricCriterionRequest }) =>
      updateRubricCriterion(id, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: rubricKeys.all }),
  });
}

export function useDeleteRubricCriterion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteRubricCriterion(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: rubricKeys.all }),
  });
}
