"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useDocumentEvaluation } from "@/lib/hooks/useDocumentEvaluation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getApiErrorMessage } from "@/lib/api/client";
import { Button } from "@/components/ui/Button";
import { WrappingTitleInput } from "@/components/ui/WrappingTitleInput";
import { Label } from "@/components/ui/Label";
import { ErrorState } from "@/components/shared/ErrorState";
import type { DocumentDTO } from "@/types/document";

export function DocumentEvaluation({
  document,
  text,
  ready,
  automatic,
}: {
  document: DocumentDTO;
  text: string;
  ready: boolean;
  automatic: boolean;
}) {
  const { t } = useTranslation("documentWorkflow");
  const evaluation = useDocumentEvaluation(document, text, ready, automatic);
  const { association, linked, missing, mutation } = evaluation;
  const canCreate =
    ready &&
    !!text.trim() &&
    !!evaluation.title.trim() &&
    !mutation.isPending &&
    !mutation.isSuccess;
  return (
    <section
      aria-labelledby="document-evaluation-heading"
      className="space-y-4 rounded-xl border bg-card p-5 sm:p-6"
    >
      <h2
        id="document-evaluation-heading"
        className="text-xl font-semibold text-primary"
      >
        {t("writingFromDocument")}
      </h2>
      <p className="text-sm leading-6 text-muted-foreground">
        {t("localAssociation")}
      </p>
      {association.compositionId && !missing ? (
        <>
          {linked.isLoading ||
          (!linked.isFetchedAfterMount && !linked.isError) ? (
            <p role="status" className="text-sm">
              {t("checkingDraft")}
            </p>
          ) : null}
          {linked.isError && (
            <div className="space-y-3">
              <ErrorState message={t("linkedLookupFailed")} />
              <Button variant="outline" onClick={() => void linked.refetch()}>
                {t("retryLookup")}
              </Button>
            </div>
          )}
          {linked.data && !linked.isError && linked.isFetchedAfterMount && (
            <Button asChild>
              <Link href={`/compositions/${linked.data.id}`}>
                {t("openComposition")}
              </Link>
            </Button>
          )}
        </>
      ) : (
        <>
          {missing && (
            <p className="text-sm leading-6 text-muted-foreground">
              {t("missingLinkedDraft")}
            </p>
          )}
          <div className="max-w-lg space-y-2">
            <Label htmlFor="document-title">{t("compositionTitle")}</Label>
            <WrappingTitleInput
              id="document-title"
              value={evaluation.title}
              disabled={mutation.isPending || mutation.isSuccess}
              onValueChange={evaluation.setTitle}
            />
          </div>
          {mutation.isPending && (
            <p role="status" className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("creatingComposition")}
            </p>
          )}
          {association.pending ? (
            <div className="space-y-3">
              <ErrorState message={t("uncertainComposition")} />
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" asChild>
                  <a
                    href="/compositions"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("checkLibrary")}
                  </a>
                </Button>
                <Button
                  variant="outline"
                  disabled={!canCreate}
                  onClick={() => void evaluation.create(true)}
                >
                  {t("checkedLibrary")}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {mutation.isError && (
                <ErrorState message={getApiErrorMessage(mutation.error)} />
              )}
              <Button
                disabled={!canCreate}
                onClick={() => void evaluation.create(false, missing)}
              >
                {t(
                  mutation.isError
                    ? "retryComposition"
                    : missing
                      ? "replaceMissingDraft"
                      : "createComposition",
                )}
              </Button>
            </>
          )}
          {!ready && (
            <p className="text-sm leading-6 text-muted-foreground">
              {t("waitingForText")}
            </p>
          )}
        </>
      )}
    </section>
  );
}
