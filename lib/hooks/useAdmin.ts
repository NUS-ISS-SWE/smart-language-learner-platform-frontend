"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAdminUser,
  getAdminCompositionById,
  getAdminDocumentById,
  getAdminDocumentContent,
  getAdminUser,
  getAdminUserCompositions,
  getAdminUserDocuments,
  listAdminUsers,
  updateUserRole,
  updateUserStatus,
} from "@/lib/api/admin";
import type { AdminUsersParams } from "@/lib/api/admin";
import type { UpdateRoleRequest, UpdateStatusRequest } from "@/types/admin";

export const adminKeys = {
  all: ["admin"] as const,
  lists: () => [...adminKeys.all, "list"] as const,
  list: (params: AdminUsersParams) => [...adminKeys.lists(), params] as const,
  details: () => [...adminKeys.all, "detail"] as const,
  detail: (id: number) => [...adminKeys.details(), id] as const,
  userCompositions: (userId: number) => [...adminKeys.all, "compositions", userId] as const,
  userDocuments: (userId: number) => [...adminKeys.all, "documents", userId] as const,
};

export function useAdminUser(id: number) {
  return useQuery({
    queryKey: adminKeys.detail(id),
    queryFn: () => getAdminUser(id),
    enabled: !!id,
  });
}

export function useAdminUsers(params: AdminUsersParams = {}) {
  return useQuery({
    queryKey: adminKeys.list(params),
    queryFn: () => listAdminUsers(params),
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateStatusRequest }) => updateUserStatus(id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateRoleRequest }) => updateUserRole(id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
    },
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAdminUser(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
    },
  });
}

export function useAdminCompositionDetail(id: number | null) {
  return useQuery({
    queryKey: id ? [...adminKeys.all, "composition-detail", id] as const : adminKeys.all,
    queryFn: () => getAdminCompositionById(id as number),
    enabled: id !== null && id > 0,
  });
}

export function useAdminDocumentDetail(id: string | null) {
  return useQuery({
    queryKey: id ? [...adminKeys.all, "document-detail", id] as const : adminKeys.all,
    queryFn: () => getAdminDocumentById(id as string),
    enabled: id !== null,
  });
}

export function useAdminDocumentContent(id: string | null) {
  return useQuery({
    queryKey: id ? [...adminKeys.all, "document-content", id] as const : adminKeys.all,
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
    enabled: !!userId,
  });
}

export function useAdminUserDocuments(userId: number) {
  return useQuery({
    queryKey: adminKeys.userDocuments(userId),
    queryFn: () => getAdminUserDocuments(userId),
    enabled: !!userId,
  });
}
