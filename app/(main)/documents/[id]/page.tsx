"use client";

import { use, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, FileText, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDeleteDocument, useDocument, useDocumentContent } from "@/lib/hooks/useDocuments";
import { useCreateComposition } from "@/lib/hooks/useCompositions";
import { getApiErrorMessage } from "@/lib/api/client";
import { ErrorState } from "@/components/shared/ErrorState";
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
  return <DocumentDetailContent id={id} />;
}
