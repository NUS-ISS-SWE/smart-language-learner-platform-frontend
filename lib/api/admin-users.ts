import { apiClient } from "./client";
import type { AdminUser, AdminUsersPage, UpdateRoleRequest, UpdateStatusRequest } from "@/types/admin";

export type AdminUsersParams = {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  userRole?: string;
};

export async function getAdminUser(id: number) {
  return (await apiClient.get<AdminUser>(`/api/v1/admin/users/${id}`)).data;
}

export async function listAdminUsers(params: AdminUsersParams = {}) {
  return (await apiClient.get<AdminUsersPage>("/api/v1/admin/users", { params })).data;
}

export async function updateUserStatus(id: number, body: UpdateStatusRequest) {
  return (await apiClient.patch<AdminUser>(`/api/v1/admin/users/${id}/status`, body)).data;
}

export async function updateUserRole(id: number, body: UpdateRoleRequest) {
  return (await apiClient.patch<AdminUser>(`/api/v1/admin/users/${id}/role`, body)).data;
}

export async function deleteAdminUser(id: number) {
  await apiClient.delete(`/api/v1/admin/users/${id}`);
}
