"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteDocument,
  getDocument,
  getDocumentContent,
  listDocuments,
  uploadDocument,
} from "@/lib/api/document";

export const documentKeys = {
  all: ["documents"] as const,
  lists: () => [...documentKeys.all, "list"] as const,
  list: (page: number, size: number) => [...documentKeys.lists(), page, size] as const,
  details: () => [...documentKeys.all, "detail"] as const,
  detail: (id: string) => [...documentKeys.details(), id] as const,
  content: (id: string) => [...documentKeys.all, "content", id] as const,
};

export function useDocumentList(page = 0, size = 20) {
  return useQuery({
    queryKey: documentKeys.list(page, size),
    queryFn: () => listDocuments(page, size),
  });
}

export function useDocumentLibrary() {
  return useInfiniteQuery({
    queryKey: [...documentKeys.lists(), "infinite"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => listDocuments(pageParam, 20),
    getNextPageParam: page => page.hasMore ? page.page + 1 : undefined,
  });
}

export function useDocument(id: string | null) {
  return useQuery({
    queryKey: id ? documentKeys.detail(id) : documentKeys.details(),
    queryFn: () => getDocument(id as string),
    enabled: Boolean(id),
  });
}

export function useDocumentContent(id: string | null) {
  return useQuery({
    queryKey: id ? documentKeys.content(id) : documentKeys.all,
    queryFn: () => getDocumentContent(id as string),
    enabled: Boolean(id),
    // Poll while the backend is still extracting text
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "PROCESSING" || status === "UPLOADED" ? 3000 : false;
    },
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
}
