import { apiClient } from "./client";
import type { AdminUser, AdminUsersPage, UpdateRoleRequest, UpdateStatusRequest } from "@/types/admin";
import type { Composition } from "@/types/composition";
import type { DocumentDTO } from "@/types/document";

export type AdminUsersParams = {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  userRole?: string;
};

export type AdminUserDocumentsResponse = {
  documents: DocumentDTO[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export async function getAdminUser(id: number) {
  const response = await apiClient.get<AdminUser>(`/api/v1/admin/users/${id}`);
  return response.data;
}

export async function listAdminUsers(params: AdminUsersParams = {}) {
  const response = await apiClient.get<AdminUsersPage>("/api/v1/admin/users", { params });
  return response.data;
}

export async function updateUserStatus(id: number, body: UpdateStatusRequest) {
  const response = await apiClient.patch<AdminUser>(`/api/v1/admin/users/${id}/status`, body);
  return response.data;
}

export async function updateUserRole(id: number, body: UpdateRoleRequest) {
  const response = await apiClient.patch<AdminUser>(`/api/v1/admin/users/${id}/role`, body);
  return response.data;
}

export async function deleteAdminUser(id: number) {
  await apiClient.delete(`/api/v1/admin/users/${id}`);
}

export async function getAdminUserCompositions(userId: number, params: { page?: number; size?: number } = {}) {
  const response = await apiClient.get<Composition[]>("/api/v1/admin/compositions", {
    params: { userId, ...params },
  });
  return response.data;
}

export async function getAdminUserDocuments(userId: number, params: { page?: number; size?: number } = {}) {
  const response = await apiClient.get<AdminUserDocumentsResponse>("/api/documents/admin", {
    params: { userId, ...params },
  });
  return response.data;
}
