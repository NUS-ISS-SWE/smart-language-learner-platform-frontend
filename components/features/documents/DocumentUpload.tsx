"use client";

import { useCallback, useRef, useState } from "react";
import { CloudUpload, FileText, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUploadDocument } from "@/lib/hooks/useDocuments";
import { getApiErrorMessage } from "@/lib/api/client";
import type { DocumentUploadResponse } from "@/types/document";

const ACCEPTED_TYPES = [".pdf", ".docx", ".txt", ".pptx"];
const ACCEPTED_MIME = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB — must match backend spring.servlet.multipart.max-file-size

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type Props = { onSuccess: (document: DocumentUploadResponse) => void };

export function DocumentUpload({ onSuccess }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const uploadMutation = useUploadDocument();

  const handleFileSelect = useCallback((selected: File | null) => {
    if (!selected) return;
    setFileError(null);
    if (!ACCEPTED_MIME.includes(selected.type)) {
      setFileError(`Unsupported file type. Accepted: ${ACCEPTED_TYPES.join(", ")}`);
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setFileError(`File is too large (${formatBytes(selected.size)}). Maximum size is ${formatBytes(MAX_FILE_SIZE)}.`);
      return;
    }
    setFile(selected);
    uploadMutation.reset();
  }, [uploadMutation]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFileSelect(e.dataTransfer.files[0] ?? null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files?.[0] ?? null);
    // Reset input so the same file can be selected again after clearing
    e.target.value = "";
  };

  const handleSubmit = () => {
    if (!file) return;
    uploadMutation.mutate(file, {
      onSuccess: (data) => {
        setFile(null);
        onSuccess(data);
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-label="Drop zone — click or drag a file here to upload"
        className={[
          "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 transition-colors cursor-pointer",
          dragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
        ].join(" ")}
      >
        <CloudUpload className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          Drag and drop a file here, or <span className="text-primary font-medium">click to browse</span>
        </p>
        <p className="text-xs text-muted-foreground">Supports PDF, DOCX, PPTX, TXT &middot; Max 25 MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="sr-only"
        onChange={handleInputChange}
        aria-hidden="true"
      />

      {file ? (
        <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3 text-sm">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="truncate font-medium">{file.name}</span>
            <span className="shrink-0 text-muted-foreground">{formatBytes(file.size)}</span>
          </div>
          <button
            type="button"
            onClick={() => { setFile(null); setFileError(null); uploadMutation.reset(); }}
            className="ml-3 shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Remove selected file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {fileError ? (
        <p role="alert" className="text-sm text-destructive">{fileError}</p>
      ) : null}

      {uploadMutation.isError ? (
        <p className="text-sm text-destructive">{getApiErrorMessage(uploadMutation.error)}</p>
      ) : null}

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={!file || uploadMutation.isPending}
        className="w-full sm:w-auto self-start"
      >
        {uploadMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Uploading…
          </>
        ) : (
          "Upload document"
        )}
      </Button>
    </div>
  );
}
