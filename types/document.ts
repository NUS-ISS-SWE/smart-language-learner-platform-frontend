export interface DocumentDTO {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  status: "UPLOADED" | "PROCESSING" | "READY" | "FAILED";
  createdAt: string;
}

export interface DocumentUploadResponse {
  document: DocumentDTO;
  downloadUrl: string;
}

export interface DocumentsPage {
  documents: DocumentDTO[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface DocumentContent {
  id: string;
  status: string;
  extractedText: string | null;
}
