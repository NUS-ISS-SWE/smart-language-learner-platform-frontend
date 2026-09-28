"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminCompositionById,
  getAdminDocumentById,
  getAdminDocumentContent,
  getAdminUserCompositions,
  getAdminUserDocuments,
  moderateComposition,
} from "@/lib/api/admin-content";
import { adminKeys } from "./adminKeys";
import { compositionPollingInterval } from "./useCompositions";

export function useAdminCompositionDetail(id: number | null) {
  return useQuery({
    queryKey: id
      ? ([...adminKeys.all, "composition-detail", id] as const)
      : adminKeys.all,
    queryFn: () => getAdminCompositionById(id as number),
    enabled: id !== null && id > 0,
    refetchInterval: (query) =>
      compositionPollingInterval(query.state.data?.compositionStatus),
  });
}

export function useAdminDocumentDetail(id: string | null) {
  return useQuery({
    queryKey: id
      ? ([...adminKeys.all, "document-detail", id] as const)
      : adminKeys.all,
    queryFn: () => getAdminDocumentById(id as string),
    enabled: id !== null,
  });
}

export function useAdminDocumentContent(id: string | null) {
  return useQuery({
    queryKey: id
      ? ([...adminKeys.all, "document-content", id] as const)
      : adminKeys.all,
    queryFn: () => getAdminDocumentContent(id as string),
    enabled: id !== null,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "PROCESSING" || status === "UPLOADED" ? 3000 : false;
    },
  });
}

export function useAdminUserCompositions(userId: number) {
  return useQuery({
    queryKey: adminKeys.userCompositions(userId),
    queryFn: () => getAdminUserCompositions(userId),
    enabled: userId > 0,
  });
}

export function useAdminUserDocuments(userId: number) {
  return useQuery({
    queryKey: adminKeys.userDocuments(userId),
    queryFn: () => getAdminUserDocuments(userId),
    enabled: userId > 0,
  });
}

export function useModerateComposition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: Parameters<typeof moderateComposition>[1];
    }) => moderateComposition(id, body),
    onSuccess: (composition) => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["compositions"] });
      queryClient.setQueryData(
        [...adminKeys.all, "composition-detail", composition.id],
        composition,
      );
    },
  });
}
