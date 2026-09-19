"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAdminUser,
  getAdminUser,
  listAdminUsers,
  updateUserRole,
  updateUserStatus,
} from "@/lib/api/admin-users";
import type { AdminUsersParams } from "@/lib/api/admin-users";
import type { UpdateRoleRequest, UpdateStatusRequest } from "@/types/admin";
import { adminKeys } from "./adminKeys";

export function useAdminUser(id: number) {
  return useQuery({
    queryKey: adminKeys.detail(id),
    queryFn: () => getAdminUser(id),
    enabled: id > 0,
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
    mutationFn: ({ id, body }: { id: number; body: UpdateStatusRequest }) =>
      updateUserStatus(id, body),
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: adminKeys.detail(id) });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateRoleRequest }) =>
      updateUserRole(id, body),
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: adminKeys.detail(id) });
    },
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAdminUser(id),
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: adminKeys.lists() }),
  });
}
