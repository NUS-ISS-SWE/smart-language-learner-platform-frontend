"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Loader2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useDeleteDocument, useDocument, useDocumentContent } from "@/lib/hooks/useDocuments";
import { getApiErrorMessage } from "@/lib/api/client";
import { formatDate } from "@/lib/utils";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  UPLOADED: "secondary",
  PROCESSING: "secondary",
  READY: "default",
  FAILED: "destructive",
};

type Props = { params: Promise<{ id: string }> };

export default function DocumentDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, isError, error } = useDocument(id);
  const contentQuery = useDocumentContent(id);
  const deleteMutation = useDeleteDocument();

  function handleDelete() {
    if (!window.confirm(`Delete "${data?.document?.filename}"?`)) return;
    deleteMutation.mutate(id, {
      onSuccess: () => router.push("/documents"),
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-label="Loading document" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/documents">
            <ArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" />
            Back to documents
          </Link>
        </Button>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive">
          {isError ? getApiErrorMessage(error) : "Document not found."}
        </div>
      </div>
    );
  }

  const { document: doc, downloadUrl } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
          <Link href="/documents">
            <ArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" />
            Back to documents
          </Link>
        </Button>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <p className="text-sm font-medium text-primary">Document detail</p>
            <h1 className="mt-2 break-all text-3xl font-semibold tracking-normal">{doc.filename}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge variant={STATUS_VARIANT[doc.status] ?? "secondary"} className="capitalize">
                {doc.status.toLowerCase()}
              </Badge>
              <span className="uppercase">{doc.fileType}</span>
              <span>·</span>
              <span>{formatBytes(doc.fileSize)}</span>
              <span>·</span>
              <span>Uploaded {formatDate(doc.createdAt)}</span>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            {downloadUrl ? (
              <Button variant="outline" size="sm" asChild>
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer" download={doc.filename}>
                  <Download className="mr-1 h-4 w-4" aria-hidden="true" />
                  Download
                </a>
              </Button>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              aria-label="Delete this document"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-1 h-4 w-4 text-destructive" />
              )}
              Delete
            </Button>
          </div>
        </div>
        {deleteMutation.isError ? (
          <p className="mt-2 text-sm text-destructive">{getApiErrorMessage(deleteMutation.error)}</p>
        ) : null}
      </div>

      {/* Extracted content */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Extracted content</h2>
        {contentQuery.isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Loading content…
          </div>
        ) : contentQuery.isError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive">
            {getApiErrorMessage(contentQuery.error)}
          </div>
        ) : contentQuery.data?.status === "PROCESSING" ? (
          <div className="flex items-center gap-2 rounded-xl border bg-muted/40 px-5 py-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Extracting text from document…
          </div>
        ) : contentQuery.data?.status === "FAILED" ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive">
            Text extraction failed for this document.
          </div>
        ) : contentQuery.data?.status === "READY" && contentQuery.data.extractedText ? (
          <div className="min-h-[460px] whitespace-pre-wrap rounded-lg border bg-white p-5 text-base leading-8">
            {contentQuery.data.extractedText}
          </div>
        ) : (
          <div className="rounded-xl border bg-muted/40 px-5 py-4 text-sm text-muted-foreground">
            No extracted content available yet.
          </div>
        )}
      </div>
    </div>
  );
}
