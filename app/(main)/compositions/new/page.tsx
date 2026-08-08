"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PenLine, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { DocumentUpload } from "@/components/features/documents/DocumentUpload";
import { CompositionEditor } from "@/components/features/compositions/CompositionEditor";
import {
  useCreateComposition,
  useRequestGrading,
  useUpdateComposition,
} from "@/lib/hooks/useCompositions";
import { getApiErrorMessage } from "@/lib/api/client";
import type { Composition, CompositionDraft } from "@/types/composition";
import type { DocumentUploadResponse } from "@/types/document";

function hasTextContent(html: string): boolean {
  if (typeof document === "undefined") return false;
  const el = document.createElement("div");
  el.innerHTML = html;
  return (el.textContent ?? "").trim().length > 0;
}

function WriteMode() {
  const router = useRouter();
  const [composition, setComposition] = useState<Composition | null>(null);
  const { mutate: createComposition, isError: isCreateError, error: createError } = useCreateComposition();
  const updateMutation = useUpdateComposition();
  const gradingMutation = useRequestGrading();
  const createStarted = useRef(false);
  const createTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (createTimerRef.current) clearTimeout(createTimerRef.current);
  }, []);

  function handleDraftChange(draft: CompositionDraft) {
    if (createStarted.current) return;
    if (createTimerRef.current) clearTimeout(createTimerRef.current);
    createTimerRef.current = null;
    if (!draft.title.trim() || !hasTextContent(draft.content)) return;

    createTimerRef.current = setTimeout(() => {
      if (createStarted.current) return;
      createStarted.current = true;
      createComposition(draft, { onSuccess: setComposition });
    }, 1500);
  }

  function createAndRun(draft: CompositionDraft, afterCreate: (id: number) => void) {
    if (createStarted.current) return;
    createStarted.current = true;
    createComposition(draft, {
      onSuccess: (c) => {
        if (!c.id) return;
        setComposition(c);
        afterCreate(c.id);
      },
    });
  }

  function handleSave(draft: CompositionDraft) {
    if (!composition?.id) {
      createAndRun(draft, (id) => router.push(`/compositions/${id}`));
      return;
    }
    updateMutation.mutate(
      { id: composition.id, draft },
      { onSuccess: () => router.push(`/compositions/${composition.id}`) },
    );
  }

  function handleSubmitForReview(draft: CompositionDraft) {
    if (!composition?.id) {
      createAndRun(draft, (id) =>
        gradingMutation.mutate(id, { onSuccess: () => router.push(`/compositions/${id}`) }),
      );
      return;
    }
    updateMutation.mutate(
      { id: composition.id, draft },
      {
        onSuccess: () =>
          gradingMutation.mutate(composition.id!, {
            onSuccess: () => router.push(`/compositions/${composition.id}`),
          }),
      },
    );
  }

  return (
    <>
      {isCreateError ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Failed to save automatically &mdash; use &ldquo;Save draft&rdquo; to save manually.{" "}
          {getApiErrorMessage(createError)}
        </p>
      ) : null}
      <CompositionEditor
        compositionId={composition?.id ? String(composition.id) : undefined}
        initialValue={null}
        isSaving={updateMutation.isPending}
        saveError={updateMutation.error}
        onSave={handleSave}
        onSubmitForReview={handleSubmitForReview}
        onDraftChange={handleDraftChange}
        isSubmitting={gradingMutation.isPending}
        submitError={gradingMutation.error}
      />
    </>
  );
}

function UploadMode() {
  const router = useRouter();

  function handleUploadSuccess(doc: DocumentUploadResponse) {
    router.push(`/documents/${doc.document.id}`);
  }

  return (
    <div className="max-w-xl">
      <DocumentUpload onSuccess={handleUploadSuccess} />
    </div>
  );
}

function NewCompositionContent() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"write" | "upload">(
    searchParams.get("mode") === "upload" ? "upload" : "write",
  );

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
          <Link href="/compositions">
            <ArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" />
            Back
          </Link>
        </Button>
        <p className="text-sm font-medium text-primary">New composition</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">Create a composition</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Write directly or upload a document — both create a composition automatically.
        </p>
      </div>

      <div className="flex gap-6 border-b">
        <button
          type="button"
          onClick={() => setMode("write")}
          className={cn(
            "-mb-px flex items-center gap-1.5 pb-3 text-sm font-medium border-b-2 transition-colors",
            mode === "write"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          <PenLine className="h-4 w-4" aria-hidden="true" />
          Write
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={cn(
            "-mb-px flex items-center gap-1.5 pb-3 text-sm font-medium border-b-2 transition-colors",
            mode === "upload"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          Upload document
        </button>
      </div>

      {mode === "write" && <WriteMode />}
      {mode === "upload" && <UploadMode />}
    </div>
  );
}

export default function NewCompositionPage() {
  return (
    <Suspense>
      <NewCompositionContent />
    </Suspense>
  );
}
