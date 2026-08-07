"use client";

import { Suspense, use, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Download, FileText, Loader2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useDeleteDocument, useDocument, useDocumentContent } from "@/lib/hooks/useDocuments";
import { useCreateComposition } from "@/lib/hooks/useCompositions";
import { getApiErrorMessage } from "@/lib/api/client";
import { formatDate } from "@/lib/utils";
import { ErrorState } from "@/components/shared/ErrorState";
import type { CompositionSource } from "@/types/composition";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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
    .map((para) => `<p>${para.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  UPLOADED: "secondary",
  PROCESSING: "secondary",
  READY: "default",
  FAILED: "destructive",
};

function DocumentDetailContent({ id }: { readonly id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoCreate = searchParams.get("autoCreate") === "1";

  const { data, isLoading, isError, error } = useDocument(id);
  const contentQuery = useDocumentContent(id);
  const deleteMutation = useDeleteDocument();
  const createMutation = useCreateComposition();
  const hasCreated = useRef(false);

  // Auto-create composition once text extraction completes
  useEffect(() => {
    if (!autoCreate || hasCreated.current || createMutation.isPending) return;

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
            router.replace(`/compositions/${composition.id}`);
          }
        },
        onError: () => {
          hasCreated.current = false;
        },
      },
    );
  }, [autoCreate, contentQuery.data, data, createMutation, id, router]);

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
  const extractedText = contentQuery.data?.extractedText;
  const isReady = docStatus === "READY" && !!extractedText;
  const isProcessing = docStatus === "UPLOADED" || docStatus === "PROCESSING";

  // Auto-create mode: conversion progress screen
  if (autoCreate && !createMutation.isError && docStatus !== "FAILED") {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-5 text-center">
        <div className="rounded-full bg-primary/10 p-5">
          <FileText className="h-10 w-10 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">
            {createMutation.isPending ? "Creating composition…" : "Extracting text from document…"}
          </h2>
          <p className="mt-1 max-w-xs truncate text-sm text-muted-foreground">{doc.filename}</p>
        </div>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="max-w-xs text-xs text-muted-foreground">
          You&apos;ll be redirected automatically once ready.
        </p>
      </div>
    );
  }

  function handleDelete() {
    if (!globalThis.confirm(`Delete "${doc.filename}"?`)) return;
    deleteMutation.mutate(id, {
      onSuccess: () => router.push("/compositions?tab=documents"),
    });
  }

  function handleCreateComposition() {
    if (!extractedText) return;
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
            router.push(`/compositions/${composition.id}`);
          }
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0">
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
            <Link href="/compositions?tab=documents">
              <ArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" />
              Back to compositions
            </Link>
          </Button>
          <p className="text-sm font-medium text-primary">Document</p>
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

        <div className="flex shrink-0 flex-wrap gap-2">
          {downloadUrl ? (
            <Button variant="outline" size="sm" asChild>
              <a href={downloadUrl} target="_blank" rel="noopener noreferrer" download={doc.filename}>
                <Download className="mr-1 h-4 w-4" aria-hidden="true" />
                Download
              </a>
            </Button>
          ) : null}
          {isReady ? (
            <Button type="button" onClick={handleCreateComposition} disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <FileText className="mr-1 h-4 w-4" />
              )}
              Create Composition
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            aria-label={`Delete ${doc.filename}`}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 text-destructive" />
            )}
          </Button>
        </div>
      </div>

      {deleteMutation.isError ? (
        <p className="text-sm text-destructive">{getApiErrorMessage(deleteMutation.error)}</p>
      ) : null}
      {createMutation.isError ? (
        <ErrorState message={getApiErrorMessage(createMutation.error)} />
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Extracted Content</CardTitle>
        </CardHeader>
        <CardContent>
          {isProcessing || contentQuery.isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Extracting text from document…
            </div>
          ) : contentQuery.isError ? (
            <p className="text-sm text-destructive">{getApiErrorMessage(contentQuery.error)}</p>
          ) : docStatus === "FAILED" ? (
            <p className="text-sm text-destructive">Text extraction failed for this document.</p>
          ) : isReady ? (
            <div className="min-h-[200px] whitespace-pre-wrap rounded-lg border bg-white p-5 text-sm leading-7">
              {extractedText}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No extracted content available yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

type Props = { readonly params: Promise<{ id: string }> };

export default function DocumentDetailPage({ params }: Props) {
  const { id } = use(params);
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <DocumentDetailContent id={id} />
    </Suspense>
  );
}
  const { data, isLoading, isError, error } = useDocument(id);
  const contentQuery = useDocumentContent(id);
  const deleteMutation = useDeleteDocument();

  function handleDelete() {
    if (!globalThis.confirm(t("deleteConfirm", { filename: data?.document?.filename ?? "" }))) return;
    deleteMutation.mutate(id, {
      onSuccess: () => router.push("/documents"),
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-label={t("detail")} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/documents">
            <ArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" />
            {t("backToDocuments")}
          </Link>
        </Button>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive">
          {isError ? getApiErrorMessage(error) : "Document not found."}
        </div>
      </div>
    );
  }

  const { document: doc, downloadUrl } = data;
  const isExtracted = contentQuery.data?.status === "READY" && !!contentQuery.data.extractedText;

  function renderContent() {
    if (contentQuery.isLoading) {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {t("loadingContent")}
        </div>
      );
    }
    if (contentQuery.isError) {
      return (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive">
          {getApiErrorMessage(contentQuery.error)}
        </div>
      );
    }
    const status = contentQuery.data?.status;
    if (status === "PROCESSING" || status === "UPLOADED") {
      return (
        <div className="flex items-center gap-2 rounded-xl border bg-muted/40 px-5 py-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {t("extractingText")}
        </div>
      );
    }
    if (status === "FAILED") {
      return (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive">
          {t("extractionFailed")}
        </div>
      );
    }
    if (isExtracted) {
      return <DocumentTextEditor document={doc} initialContent={contentQuery.data!.extractedText!} />;
    }
    return (
      <div className="rounded-xl border bg-muted/40 px-5 py-4 text-sm text-muted-foreground">
        {t("noContent")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
          <Link href="/documents">
            <ArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" />
            {t("backToDocuments")}
          </Link>
        </Button>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <p className="text-sm font-medium text-primary">{t("detail")}</p>
            <h1 className="mt-2 break-all text-3xl font-semibold tracking-normal">{doc.filename}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge variant={STATUS_VARIANT[doc.status] ?? "secondary"} className="capitalize">
                {doc.status.toLowerCase()}
              </Badge>
              <span className="uppercase">{doc.fileType}</span>
              <span>�</span>
              <span>{formatBytes(doc.fileSize)}</span>
              <span>�</span>
              <span>Uploaded {formatDate(doc.createdAt)}</span>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
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
            >
              {deleteMutation.isPending ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-1 h-4 w-4 text-destructive" />
              )}
              {t("common:delete")}
            </Button>
          </div>
        </div>
        {deleteMutation.isError ? (
          <p className="mt-2 text-sm text-destructive">{getApiErrorMessage(deleteMutation.error)}</p>
        ) : null}
      </div>

      {renderContent()}
    </div>
  );
}
