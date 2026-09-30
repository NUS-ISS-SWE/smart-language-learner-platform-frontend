"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createComposition,
  deleteComposition,
  generateComposition,
  getComposition,
  getCompositions,
  requestCompositionGrading,
  submitSuggestionFeedback,
  updateComposition,
} from "@/lib/api/composition";
import type {
  Composition,
  CompositionDraft,
  CompositionRequest,
  SuggestionFeedbackRequest,
} from "@/types/composition";

export function compositionId(id: string | number): number {
  const value = Number(id);
  return Number.isSafeInteger(value) && value > 0 ? value : NaN;
}

export function compositionPollingInterval(status?: string) {
  return status === "GENERATING" || status === "REVIEWING" ? 3000 : false;
}

function draftRequest(draft: CompositionDraft): CompositionRequest {
  return { title: draft.title, content: draft.content };
}

export const compositionKeys = {
  all: ["compositions"] as const,
  lists: () => [...compositionKeys.all, "list"] as const,
  list: (page: number, size: number) =>
    [...compositionKeys.lists(), page, size] as const,
  details: () => [...compositionKeys.all, "detail"] as const,
  detail: (id: number | string) =>
    [...compositionKeys.details(), compositionId(id)] as const,
};

export function refreshCompositionCache(
  queryClient: ReturnType<typeof useQueryClient>,
  composition: Composition,
): void {
  void queryClient.invalidateQueries({ queryKey: compositionKeys.lists() });
  queryClient.setQueryData(compositionKeys.detail(composition.id), composition);
}

export function useCompositionList(page = 0, size = 20) {
  return useQuery({
    queryKey: compositionKeys.list(page, size),
    queryFn: () => getCompositions({ page, size }),
  });
}

export function useComposition(id: string | number | null) {
  const numId = id !== null ? compositionId(id) : null;
  return useQuery({
    queryKey: numId ? compositionKeys.detail(numId) : compositionKeys.details(),
    queryFn: () => getComposition(numId as number),
    enabled: numId !== null && Number.isFinite(numId),
    // A cached assessed/draft status must not authorize editing on a new visit.
    refetchOnMount: "always",
    // Grading is asynchronous: Kafka completion changes REVIEWING to REVIEWED
    // and stores the orchestrator feedback after the initial HTTP request.
    refetchInterval: (query) =>
      compositionPollingInterval(query.state.data?.compositionStatus),
  });
}

export function useCompositionLibrary() {
  return useInfiniteQuery({
    queryKey: [...compositionKeys.lists(), "infinite"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getCompositions({ page: pageParam, size: 20 }),
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.length === 20 ? lastPageParam + 1 : undefined,
  });
}

export function useCreateComposition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (draft: CompositionDraft | CompositionRequest) =>
      createComposition({
        title: draft.title,
        content: draft.content,
        ...("sourceDocumentId" in draft && draft.sourceDocumentId
          ? { sourceDocumentId: draft.sourceDocumentId }
          : {}),
      }),
    onSuccess: (composition) =>
      refreshCompositionCache(queryClient, composition),
  });
}

export function useUpdateComposition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      draft,
    }: {
      id: string | number;
      draft: CompositionDraft;
    }) => updateComposition(compositionId(id), draftRequest(draft)),
    onSuccess: (composition) =>
      refreshCompositionCache(queryClient, composition),
  });
}

export function useDeleteComposition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => deleteComposition(compositionId(id)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: compositionKeys.lists() });
    },
  });
}

export function useRequestGrading() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) =>
      requestCompositionGrading(compositionId(id)),
    onSuccess: (composition) =>
      refreshCompositionCache(queryClient, composition),
  });
}

export function useGenerateComposition() {
  return useMutation({ mutationFn: generateComposition });
}

export function useSubmitSuggestionFeedback() {
  return useMutation({
    mutationFn: ({
      compositionId,
      suggestionIndex,
      feedback,
    }: {
      compositionId: number;
      suggestionIndex: number;
      feedback: SuggestionFeedbackRequest;
    }) => submitSuggestionFeedback(compositionId, suggestionIndex, feedback),
  });
}
