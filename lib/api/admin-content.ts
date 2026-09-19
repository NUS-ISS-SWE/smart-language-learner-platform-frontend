import { apiClient } from "./client";
import type { Composition } from "@/types/composition";
import type { DocumentDTO } from "@/types/document";
import {
  normalizeDocument,
  normalizeDocumentContent,
  normalizeDocumentResponse,
  type DocumentWireDTO,
  type DocumentResponseWire,
  type DocumentContentWire,
} from "@/lib/document-data";

export type AdminUserDocumentsResponse = {
  documents: DocumentDTO[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export async function getAdminCompositionById(id: number) {
  return (await apiClient.get<Composition>(`/api/v1/admin/compositions/${id}`))
    .data;
}

export async function getAdminUserCompositions(
  userId: number,
  params: { page?: number; size?: number } = {},
) {
  return (
    await apiClient.get<Composition[]>("/api/v1/admin/compositions", {
      params: { userId, ...params },
    })
  ).data;
}

export async function getAdminDocumentById(id: string) {
  return normalizeDocumentResponse(
    (await apiClient.get<DocumentResponseWire>(`/api/documents/admin/${id}`))
      .data,
  );
}

export async function getAdminDocumentContent(id: string) {
  return normalizeDocumentContent(
    (
      await apiClient.get<DocumentContentWire>(
        `/api/documents/admin/${id}/content`,
      )
    ).data,
  );
}

export async function getAdminUserDocuments(
  userId: number,
  params: { page?: number; size?: number } = {},
) {
  const response = (
    await apiClient.get<
      Omit<AdminUserDocumentsResponse, "documents"> & {
        documents: DocumentWireDTO[];
      }
    >("/api/documents/admin", {
      params: { userId, ...params },
    })
  ).data;
  return { ...response, documents: response.documents.map(normalizeDocument) };
}
