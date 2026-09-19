"use client";

import { useEffect, useRef, useState } from "react";
import { CloudUpload, FileText, Loader2, X } from "lucide-react";
import { formatBytes, cn } from "@/lib/utils";
import { useUploadDocument } from "@/lib/hooks/useDocuments";
import { getApiErrorMessage } from "@/lib/api/client";
import { isUncertainMutationError } from "@/lib/api/mutation-outcome";
import {
  DOCUMENT_ACCEPT,
  DocumentValidationError,
  prepareDocumentUpload,
} from "@/lib/document-upload";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/shared/ErrorState";
import type { DocumentUploadResponse } from "@/types/document";

export function DocumentUpload({
  onSuccess,
}: {
  readonly onSuccess: (document: DocumentUploadResponse) => void;
}) {
  const { t } = useTranslation("documentWorkflow");
  const input = useRef<HTMLInputElement>(null);
  const busy = useRef(false);
  const active = useRef(true);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [validation, setValidation] = useState<string | null>(null);
  const [uncertain, setUncertain] = useState(false);
  const mutation = useUploadDocument();
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);

  async function upload(selected: File | null, acknowledged = false) {
    if (
      !selected ||
      busy.current ||
      mutation.isSuccess ||
      (uncertain && !acknowledged)
    )
      return;
    let prepared: File;
    try {
      prepared = prepareDocumentUpload(selected);
    } catch (error) {
      setValidation(
        error instanceof DocumentValidationError
          ? error.key
          : "unsupportedFile",
      );
      return;
    }
    busy.current = true;
    setValidation(null);
    setUncertain(false);
    setFile(prepared);
    try {
      const response = await mutation.mutateAsync(prepared);
      if (active.current) onSuccess(response);
    } catch (error) {
      if (active.current) setUncertain(isUncertainMutationError(error));
    } finally {
      busy.current = false;
    }
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        disabled={mutation.isPending || mutation.isSuccess || uncertain}
        onClick={() => input.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          if (!busy.current) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void upload(event.dataTransfer.files[0] ?? null);
        }}
        className={cn(
          "flex min-h-64 w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-input bg-card px-5 py-10 text-center transition-colors hover:border-secondary hover:bg-soft-teal/40 disabled:cursor-wait disabled:opacity-60",
          dragging && "border-secondary bg-soft-teal",
        )}
        aria-label={t("selectFile")}
      >
        <span className="rounded-2xl bg-soft-teal p-4">
          <CloudUpload className="h-8 w-8 text-secondary" aria-hidden="true" />
        </span>
        <span className="text-2xl font-semibold tracking-tight text-primary">
          {t("dropHint")}
        </span>
        <span className="text-sm leading-6 text-muted-foreground">
          {t("supported")}
        </span>
      </button>
      <input
        ref={input}
        type="file"
        accept={DOCUMENT_ACCEPT}
        tabIndex={-1}
        className="sr-only"
        aria-label={t("fileInput")}
        disabled={mutation.isPending || uncertain}
        onChange={(event) => {
          void upload(event.target.files?.[0] ?? null);
          event.target.value = "";
        }}
      />
      <p className="text-sm leading-6 text-muted-foreground">
        {t("uploadFlow")}
      </p>
      {file && (
        <div className="flex items-start justify-between gap-3 rounded-lg border bg-card p-4">
          <div className="flex min-w-0 items-start gap-3">
            {mutation.isPending ? (
              <Loader2 className="mt-1 h-5 w-5 shrink-0 animate-spin text-secondary" />
            ) : (
              <FileText className="mt-1 h-5 w-5 shrink-0 text-secondary" />
            )}
            <div className="min-w-0">
              <p className="break-words font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatBytes(file.size)}
              </p>
              <p role="status" className="mt-1 text-sm">
                {t(
                  mutation.isPending
                    ? "uploading"
                    : mutation.isSuccess
                      ? "uploaded"
                      : "selected",
                )}
              </p>
            </div>
          </div>
          {!mutation.isPending && !uncertain && (
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("removeFile")}
              onClick={() => {
                setFile(null);
                setValidation(null);
                mutation.reset();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      {validation && <ErrorState message={t(validation)} />}
      {mutation.isError && (
        <div className="space-y-3">
          <ErrorState
            message={
              uncertain
                ? t("uncertainUpload")
                : getApiErrorMessage(mutation.error)
            }
          />
          <div className="flex flex-wrap gap-2">
            {uncertain && (
              <Button variant="outline" asChild>
                <a
                  href="/compositions?tab=documents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("checkDocuments")}
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => void upload(file, uncertain)}
            >
              {t(uncertain ? "checkedDocuments" : "retryUpload")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
