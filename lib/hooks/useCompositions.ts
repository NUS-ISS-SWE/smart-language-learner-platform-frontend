"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createComposition,
  deleteComposition,
  generateComposition,
  getComposition,
  getCompositions,
  requestCompositionGrading,
  updateComposition,
} from "@/lib/api/composition";
import type { CompositionDraft } from "@/types/composition";

function toNum(id: string | number): number {
  return typeof id === "string" ? parseInt(id, 10) : id;
}

export const compositionKeys = {
  all: ["compositions"] as const,
  lists: () => [...compositionKeys.all, "list"] as const,
  list: (page: number, size: number) => [...compositionKeys.lists(), page, size] as const,
  details: () => [...compositionKeys.all, "detail"] as const,
  detail: (id: number | string) => [...compositionKeys.details(), toNum(id)] as const,
};

export function useCompositionList(page = 0, size = 20) {
  return useQuery({
    queryKey: compositionKeys.list(page, size),
    queryFn: () => getCompositions({ page, size }),
  });
}

export function useComposition(id: string | number | null) {
  const numId = id !== null ? toNum(id) : null;
  return useQuery({
    queryKey: numId ? compositionKeys.detail(numId) : compositionKeys.details(),
    queryFn: () => getComposition(numId as number),
    enabled: numId !== null,
  });
}

export function useCreateComposition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComposition,
    onSuccess: (composition) => {
      void queryClient.invalidateQueries({ queryKey: compositionKeys.lists() });
      if (composition.id) {
        queryClient.setQueryData(compositionKeys.detail(composition.id), composition);
      }
    },
  });
}

export function useUpdateComposition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, draft }: { id: string | number; draft: CompositionDraft }) =>
      updateComposition(toNum(id), draft),
    onSuccess: (composition) => {
      void queryClient.invalidateQueries({ queryKey: compositionKeys.lists() });
      if (composition.id) {
        queryClient.setQueryData(compositionKeys.detail(composition.id), composition);
      }
    },
  });
}

export function useDeleteComposition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => deleteComposition(toNum(id)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: compositionKeys.lists() });
    },
  });
}

export function useRequestGrading() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => requestCompositionGrading(toNum(id)),
    onSuccess: (composition) => {
      void queryClient.invalidateQueries({ queryKey: compositionKeys.lists() });
      if (composition.id) {
        queryClient.setQueryData(compositionKeys.detail(composition.id), composition);
      }
    },
  });
}

export function useGenerateComposition() {
  return useMutation({ mutationFn: generateComposition });
}
