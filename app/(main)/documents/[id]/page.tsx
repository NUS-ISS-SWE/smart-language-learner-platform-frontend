"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookPlus, Download, Loader2, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useDeleteDocument, useDocument, useDocumentContent } from "@/lib/hooks/useDocuments";
import { useCreateComposition } from "@/lib/hooks/useCompositions";
import { getApiErrorMessage } from "@/lib/api/client";
import { formatDate } from "@/lib/utils";
import type { CompositionSource } from "@/types/composition";

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

/** Map document file type to the composition source enum value. */
function toCompositionSource(fileType: string): CompositionSource {
  const t = fileType.toLowerCase();
  if (t === "pdf") return "FILE_PDF";
  if (t === "docx") return "FILE_DOCX";
  return "RAW_TEXT";
}

/** Strip file extension from a filename to use as a default composition title. */
function stripExtension(filename: string): string {
  return filename.replace(/\.[^.]+$/, "");
}

type Props = { params: Promise<{ id: string }> };

export default function DocumentDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, isError, error } = useDocument(id);
  const contentQuery = useDocumentContent(id);
  const deleteMutation = useDeleteDocument();
  const createCompositionMutation = useCreateComposition();

  const [showEvaluateForm, setShowEvaluateForm] = useState(false);
  const [compositionTitle, setCompositionTitle] = useState("");

  function handleDelete() {
    if (!window.confirm(`Delete "${data?.document?.filename}"?`)) return;
    deleteMutation.mutate(id, {
      onSuccess: () => router.push("/documents"),
    });
  }

  function openEvaluateForm() {
    if (data?.document) {
      setCompositionTitle(stripExtension(data.document.filename));
    }
    createCompositionMutation.reset();
    setShowEvaluateForm(true);
  }

  function handleCreateComposition() {
    const text = contentQuery.data?.extractedText;
    if (!text || !data?.document) return;
    createCompositionMutation.mutate(
      {
        title: compositionTitle.trim() || stripExtension(data.document.filename),
        content: text,
        language: "ENGLISH", // backend auto-detects from content; this is overridden server-side
        compositionSource: toCompositionSource(data.document.fileType),
      },
      {
        onSuccess: (composition) => {
          if (composition.id) router.push(`/compositions/${composition.id}`);
        },
      },
    );
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
  const isExtracted = contentQuery.data?.status === "READY" && !!contentQuery.data.extractedText;

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
              <span>Â·</span>
              <span>{formatBytes(doc.fileSize)}</span>
              <span>Â·</span>
              <span>Uploaded {formatDate(doc.createdAt)}</span>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {isExtracted && !showEvaluateForm ? (
              <Button variant="default" size="sm" onClick={openEvaluateForm}>
                <BookPlus className="mr-1 h-4 w-4" aria-hidden="true" />
                Evaluate as composition
              </Button>
            ) : null}
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

      {/* Evaluate as composition â€” inline form */}
      {showEvaluateForm ? (
        <div className="rounded-xl border bg-muted/30 p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold">Evaluate as composition</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                The extracted text will be sent to the composition service. You can request AI grading
                from the composition page once it&apos;s created.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowEvaluateForm(false)}
              className="shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Cancel evaluation"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Label htmlFor="composition-title" className="mb-1.5 block text-sm">
                Composition title
              </Label>
              <Input
                id="composition-title"
                value={compositionTitle}
                onChange={(e) => setCompositionTitle(e.target.value)}
                placeholder="Enter a title for this composition"
                disabled={createCompositionMutation.isPending}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleCreateComposition}
                disabled={createCompositionMutation.isPending || !compositionTitle.trim()}
              >
                {createCompositionMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Creatingâ€¦
                  </>
                ) : (
                  "Create & go to composition"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowEvaluateForm(false)}
                disabled={createCompositionMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
          {createCompositionMutation.isError ? (
            <p className="mt-3 text-sm text-destructive">
              {getApiErrorMessage(createCompositionMutation.error)}
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Extracted content */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Extracted content</h2>
        {contentQuery.isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Loading contentâ€¦
          </div>
        ) : contentQuery.isError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive">
            {getApiErrorMessage(contentQuery.error)}
          </div>
        ) : contentQuery.data?.status === "PROCESSING" ? (
          <div className="flex items-center gap-2 rounded-xl border bg-muted/40 px-5 py-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Extracting text from documentâ€¦
          </div>
        ) : contentQuery.data?.status === "FAILED" ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive">
            Text extraction failed for this document.
          </div>
        ) : isExtracted ? (
          <div className="min-h-[460px] whitespace-pre-wrap rounded-lg border bg-white p-5 text-base leading-8">
            {contentQuery.data!.extractedText}
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
