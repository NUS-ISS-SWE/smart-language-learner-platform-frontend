import { apiClient } from "./client";
import type { Composition } from "@/types/composition";
import type { DocumentContent, DocumentDTO, DocumentUploadResponse } from "@/types/document";

export type AdminUserDocumentsResponse = {
  documents: DocumentDTO[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export async function getAdminCompositionById(id: number) {
  return (await apiClient.get<Composition>(`/api/v1/admin/compositions/${id}`)).data;
}

export async function getAdminUserCompositions(userId: number, params: { page?: number; size?: number } = {}) {
  return (await apiClient.get<Composition[]>("/api/v1/admin/compositions", {
    params: { userId, ...params },
  })).data;
}

export async function getAdminDocumentById(id: string) {
  return (await apiClient.get<DocumentUploadResponse>(`/api/documents/admin/${id}`)).data;
}

export async function getAdminDocumentContent(id: string) {
  return (await apiClient.get<DocumentContent>(`/api/documents/admin/${id}/content`)).data;
}

export async function getAdminUserDocuments(userId: number, params: { page?: number; size?: number } = {}) {
  return (await apiClient.get<AdminUserDocumentsResponse>("/api/documents/admin", {
    params: { userId, ...params },
  })).data;
}
