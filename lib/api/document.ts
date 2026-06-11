import { apiClient } from "@/lib/api/client";
import type { DocumentContent, DocumentDTO, DocumentsPage, DocumentUploadResponse } from "@/types/document";

export async function uploadDocument(file: File): Promise<DocumentUploadResponse> {
  const form = new FormData();
  form.append("file", file);
  const res = await apiClient.post<DocumentUploadResponse>("/api/documents/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
    // Upload can take longer for large files
    timeout: 120_000,
  });
  return res.data;
}

export async function listDocuments(page = 0, size = 20): Promise<DocumentsPage> {
  const res = await apiClient.get<DocumentsPage>("/api/documents", { params: { page, size } });
  return res.data;
}

export async function getDocument(id: string): Promise<DocumentUploadResponse> {
  const res = await apiClient.get<DocumentUploadResponse>(`/api/documents/${id}`);
  return res.data;
}

export async function getDocumentContent(id: string): Promise<DocumentContent> {
  const res = await apiClient.get<DocumentContent>(`/api/documents/${id}/content`);
  return res.data;
}

export async function deleteDocument(id: string): Promise<void> {
  await apiClient.delete(`/api/documents/${id}`);
}
