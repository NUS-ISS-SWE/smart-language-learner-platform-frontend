import { apiClient } from "@/lib/api/client";
import type {
  DocumentContent,
  DocumentsPage,
  DocumentUploadResponse,
} from "@/types/document";
import {
  normalizeDocument,
  normalizeDocumentContent,
  normalizeDocumentResponse,
  type DocumentWireDTO,
  type DocumentResponseWire,
  type DocumentContentWire,
} from "@/lib/document-data";

export async function uploadDocument(
  file: File,
): Promise<DocumentUploadResponse> {
  const form = new FormData();
  form.append("file", file);
  const res = await apiClient.post<DocumentResponseWire>(
    "/api/documents/upload",
    form,
    {
      headers: { "Content-Type": "multipart/form-data" },
      // Upload can take longer for large files
      timeout: 120_000,
    },
  );
  return normalizeDocumentResponse(res.data);
}

export async function listDocuments(
  page = 0,
  size = 20,
): Promise<DocumentsPage> {
  const res = await apiClient.get<
    Omit<DocumentsPage, "documents"> & { documents: DocumentWireDTO[] }
  >("/api/documents", { params: { page, size } });
  return { ...res.data, documents: res.data.documents.map(normalizeDocument) };
}

export async function getDocument(id: string): Promise<DocumentUploadResponse> {
  const res = await apiClient.get<DocumentResponseWire>(`/api/documents/${id}`);
  return normalizeDocumentResponse(res.data);
}

export async function getDocumentContent(id: string): Promise<DocumentContent> {
  const res = await apiClient.get<DocumentContentWire>(
    `/api/documents/${id}/content`,
  );
  return normalizeDocumentContent(res.data);
}

export async function deleteDocument(id: string): Promise<void> {
  await apiClient.delete(`/api/documents/${id}`);
}
