import { apiClient } from "./client";
import type { AdminUser, AdminUsersPage, SystemUsageMetrics, UpdateRoleRequest, UpdateStatusRequest, UserUsageMetrics } from "@/types/admin";
import type { Composition } from "@/types/composition";
import type { DocumentContent, DocumentDTO, DocumentUploadResponse } from "@/types/document";
import type { PricingPlan, PricingPlanRequest } from "@/types/pricing-plan";

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

export type AdminMetricsParams = {
  from?: string;
  to?: string;
};

export async function getSystemUsageMetrics(params: AdminMetricsParams = {}) {
  const response = await apiClient.get<SystemUsageMetrics>("/api/v1/admin/metrics", { params });
  return response.data;
}

export async function getAdminUserUsageMetrics(id: number, params: AdminMetricsParams = {}) {
  const response = await apiClient.get<UserUsageMetrics>(`/api/v1/admin/metrics/users/${id}`, { params });
  return response.data;
}

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

export async function getAdminCompositionById(id: number) {
  const response = await apiClient.get<Composition>(`/api/v1/admin/compositions/${id}`);
  return response.data;
}

export async function getAdminUserCompositions(userId: number, params: { page?: number; size?: number } = {}) {
  const response = await apiClient.get<Composition[]>("/api/v1/admin/compositions", {
    params: { userId, ...params },
  });
  return response.data;
}

export async function getAdminDocumentById(id: string) {
  const response = await apiClient.get<DocumentUploadResponse>(`/api/documents/admin/${id}`);
  return response.data;
}

export async function getAdminDocumentContent(id: string) {
  const response = await apiClient.get<DocumentContent>(`/api/documents/admin/${id}/content`);
  return response.data;
}

export async function getAdminUserDocuments(userId: number, params: { page?: number; size?: number } = {}) {
  const response = await apiClient.get<AdminUserDocumentsResponse>("/api/documents/admin", {
    params: { userId, ...params },
  });
  return response.data;
}

export async function listPricingPlans() { return (await apiClient.get<PricingPlan[]>("/api/v1/admin/subscription/plans")).data; }
export async function createPricingPlan(body: PricingPlanRequest) { return (await apiClient.post<PricingPlan>("/api/v1/admin/subscription/plans", body)).data; }
export async function updatePricingPlan(code: string, body: PricingPlanRequest) { return (await apiClient.put<PricingPlan>(`/api/v1/admin/subscription/plans/${code}`, body)).data; }
export async function setPricingPlanStatus(code: string, active: boolean) { return (await apiClient.patch<PricingPlan>(`/api/v1/admin/subscription/plans/${code}/status`, { active })).data; }
