import type {
  DocumentDTO,
  DocumentContent,
  DocumentUploadResponse,
} from "@/types/document";

// Java DTOs use Long IDs. The UI keeps document IDs as strings for paths and
// local associations; accept old string fixtures/responses at this boundary too.
export type DocumentWireDTO = Omit<DocumentDTO, "id"> & { id: string | number };
export type DocumentResponseWire = Omit<DocumentUploadResponse, "document"> & {
  document: DocumentWireDTO;
};
export type DocumentContentWire = Omit<DocumentContent, "id"> & {
  id: string | number;
};
export const normalizeDocument = (document: DocumentWireDTO): DocumentDTO => ({
  ...document,
  id: String(document.id),
});
export const normalizeDocumentResponse = (
  response: DocumentResponseWire,
): DocumentUploadResponse => ({
  ...response,
  document: normalizeDocument(response.document),
});
export const normalizeDocumentContent = (
  content: DocumentContentWire,
): DocumentContent => ({ ...content, id: String(content.id) });
