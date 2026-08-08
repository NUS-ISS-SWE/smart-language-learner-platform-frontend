"use client";

import { use, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, FileText, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useDeleteDocument, useDocument, useDocumentContent } from "@/lib/hooks/useDocuments";
import { useAdminDocumentDetail, useAdminDocumentContent } from "@/lib/hooks/useAdmin";
import { useCreateComposition } from "@/lib/hooks/useCompositions";
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage } from "@/lib/api/client";
import { ErrorState } from "@/components/shared/ErrorState";
import { formatDate, formatBytes } from "@/lib/utils";
import type { CompositionSource } from "@/types/composition";

function stripExtension(filename: string): string {
  return filename.replace(/\.[^.]+$/, "");
}

function toCompositionSource(fileType: string): CompositionSource {
  const ft = fileType.toLowerCase();
  if (ft === "pdf") return "FILE_PDF";
  if (ft === "docx") return "FILE_DOCX";
  return "RAW_TEXT";
}

function plainTextToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((para) => `<p>${para.replaceAll("\n", "<br>")}</p>`)
    .join("");
}

function ConversionLoadingScreen({ filename, isPending }: { readonly filename: string; readonly isPending: boolean }) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center gap-5 text-center">
      <div className="rounded-full bg-primary/10 p-5">
        <FileText className="h-10 w-10 text-primary" aria-hidden="true" />
      </div>
      <div>
        <h2 className="text-xl font-semibold">
          {isPending ? "Creating composition\u2026" : "Extracting text from document\u2026"}
        </h2>
        <p className="mt-1 max-w-xs truncate text-sm text-muted-foreground">{filename}</p>
      </div>
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      <p className="max-w-xs text-xs text-muted-foreground">
        You&apos;ll be redirected automatically once ready.
      </p>
    </div>
  );
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  UPLOADED: "secondary", PROCESSING: "secondary", READY: "default", FAILED: "destructive",
};

function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

/** Read-only view used when an admin opens another user's document */
function AdminDocumentView({ id }: { readonly id: string }) {
  const { data, isLoading, isError, error } = useAdminDocumentDetail(id);
  const contentQuery = useAdminDocumentContent(id);

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  if (isError || !data) return <ErrorState message={isError ? getApiErrorMessage(error) : "Document not found."} />;

  const { document: doc, downloadUrl } = data;
  const extractedText = contentQuery.data?.extractedText;

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
          <Link href="/compositions?tab=documents"><ArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" />Back</Link>
        </Button>
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div className="min-w-0">
            <p className="text-sm font-medium text-primary">Document</p>
            <h1 className="mt-2 break-all text-3xl font-semibold tracking-normal">{doc.filename}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge variant={STATUS_VARIANT[doc.status] ?? "secondary"} className="capitalize">{doc.status.toLowerCase()}</Badge>
              <span className="uppercase">{doc.fileType}</span>
              <span>·</span>
              <span>{formatBytes(doc.fileSize)}</span>
              <span>·</span>
              <span>Uploaded {formatDate(doc.createdAt)}</span>
            </div>
          </div>
          {downloadUrl ? (
            <Button variant="outline" size="sm" asChild className="shrink-0">
              <a href={downloadUrl} target="_blank" rel="noopener noreferrer" download={doc.filename}>
                <Download className="mr-1 h-4 w-4" aria-hidden="true" />Download
              </a>
            </Button>
          ) : null}
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle>Extracted Content</CardTitle></CardHeader>
        <CardContent>
          {contentQuery.isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading…</div>
          ) : null}
          {!contentQuery.isLoading && extractedText ? (
            <div className="min-h-[200px] whitespace-pre-wrap rounded-lg border bg-white p-5 text-sm leading-7">{extractedText}</div>
          ) : null}
          {!contentQuery.isLoading && !extractedText ? (
            <p className="text-sm text-muted-foreground">No extracted content available.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function DocumentDetailContent({ id }: { readonly id: string }) {
  const router = useRouter();

  const { data, isLoading, isError, error } = useDocument(id);
  const contentQuery = useDocumentContent(id);
  const deleteMutation = useDeleteDocument();
  const createMutation = useCreateComposition();
  const hasCreated = useRef(false);

  // Redirect to existing composition if this document was already converted
  useEffect(() => {
    const compositionId = localStorage.getItem(`sllp.doc.${id}.compositionId`);
    if (compositionId) router.replace(`/compositions/${compositionId}`);
  }, [id, router]);

  // Auto-create composition once text extraction completes
  useEffect(() => {
    if (hasCreated.current || createMutation.isPending) return;

    const status = contentQuery.data?.status;
    const extractedText = contentQuery.data?.extractedText;
    const doc = data?.document;

    if (status !== "READY" || !extractedText || !doc) return;

    hasCreated.current = true;
    createMutation.mutate(
      {
        title: stripExtension(doc.filename),
        content: plainTextToHtml(extractedText),
        language: "ENGLISH",
        compositionSource: toCompositionSource(doc.fileType),
      },
      {
        onSuccess: (composition) => {
          if (composition.id) {
            localStorage.setItem(`sllp.comp.${composition.id}.docId`, id);
            localStorage.setItem(`sllp.doc.${id}.compositionId`, String(composition.id));
            router.replace(`/compositions/${composition.id}`);
          }
        },
        onError: () => {
          hasCreated.current = false;
        },
      },
    );
  }, [contentQuery.data, data, createMutation, id, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-label="Loading document" />
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState message={isError ? getApiErrorMessage(error) : "Document not found."} />;
  }

  const { document: doc, downloadUrl } = data;
  const docStatus = contentQuery.data?.status ?? doc.status;

  // Show error state for failed extraction or composition creation failures
  if (docStatus === "FAILED" || createMutation.isError) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/compositions?tab=documents">
            <ArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" />
            Back to compositions
          </Link>
        </Button>
        <ErrorState
          message={
            createMutation.isError
              ? getApiErrorMessage(createMutation.error)
              : "Text extraction failed for this document."
          }
        />
        {downloadUrl ? (
          <Button variant="outline" size="sm" asChild>
            <a href={downloadUrl} target="_blank" rel="noopener noreferrer" download={doc.filename}>
              <Download className="mr-1 h-4 w-4" aria-hidden="true" />
              Download original
            </a>
          </Button>
        ) : null}
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => {
            if (globalThis.confirm(`Delete "${doc.filename}"?`)) {
              deleteMutation.mutate(id, { onSuccess: () => router.push("/compositions?tab=documents") });
            }
          }}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
          Delete document
        </Button>
      </div>
    );
  }

  return <ConversionLoadingScreen filename={doc.filename} isPending={createMutation.isPending} />;
}

type Props = { readonly params: Promise<{ id: string }> };

export default function DocumentDetailPage({ params }: Props) {
  const { id } = use(params);
  const { user } = useAuth();

  if (user?.role === "ADMIN") return <AdminDocumentView id={id} />;
  return <DocumentDetailContent id={id} />;
}
