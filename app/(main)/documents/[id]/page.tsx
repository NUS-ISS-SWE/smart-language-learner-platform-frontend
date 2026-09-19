"use client";

import { Suspense, use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Download, Loader2, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  useDocument,
  useDocumentContent,
  useDeleteDocument,
} from "@/lib/hooks/useDocuments";
import {
  useAdminDocumentDetail,
  useAdminDocumentContent,
} from "@/lib/hooks/useAdminContent";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getApiErrorMessage } from "@/lib/api/client";
import { formatBytes, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { DocumentEvaluation } from "@/components/features/documents/DocumentEvaluation";
import { adminReturnTo } from "@/lib/admin-return";

function DocumentDetail({ id }: { id: string }) {
  const { user } = useAuth();
  const params = useSearchParams();
  const inspection =
    user?.role === "ADMIN" && params.get("context") === "admin";
  const router = useRouter();
  const { t, language } = useTranslation("documentWorkflow");
  const own = useDocument(inspection ? null : id);
  const ownContent = useDocumentContent(inspection ? null : id);
  const admin = useAdminDocumentDetail(inspection ? id : null);
  const adminContent = useAdminDocumentContent(inspection ? id : null);
  const query = inspection ? admin : own;
  const contentQuery = inspection ? adminContent : ownContent;
  const deletion = useDeleteDocument();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleting = useRef(false);
  const active = useRef(true);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  async function remove() {
    if (inspection || deleting.current) return;
    deleting.current = true;
    try {
      await deletion.mutateAsync(id);
      if (active.current) router.replace("/compositions?tab=documents");
    } catch {
      /* Preserve the dialog and its error. */
    } finally {
      deleting.current = false;
    }
  }
  if (query.isLoading) return <LoadingState label={t("loadingDocument")} />;
  if (!query.data)
    return (
      <div className="space-y-4">
        <ErrorState message={getApiErrorMessage(query.error)} />
        <Button variant="outline" onClick={() => void query.refetch()}>
          {t("retryDocument")}
        </Button>
      </div>
    );
  const { document, downloadUrl } = query.data;
  const status = contentQuery.data?.status ?? document.status;
  const text = contentQuery.data?.extractedText ?? "";
  const processing = status === "UPLOADED" || status === "PROCESSING";
  return (
    <div className="mx-auto max-w-[960px] space-y-6">
      <header className="space-y-4">
        <Button variant="ghost" size="sm" asChild className="-ml-3">
          <Link
            href={
              inspection
                ? adminReturnTo(params.get("returnTo"))
                : "/compositions?tab=documents"
            }
          >
            <ArrowLeft className="h-4 w-4" />
            {t(inspection ? "backToUsers" : "backToDocuments")}
          </Link>
        </Button>
        {inspection && (
          <p className="text-sm font-medium text-secondary">
            {t("inspection")}
          </p>
        )}
        <h1 className="break-words text-3xl font-semibold leading-tight text-primary">
          {document.filename}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Badge
            variant={
              status === "FAILED"
                ? "destructive"
                : status === "READY"
                  ? "default"
                  : "secondary"
            }
          >
            {t(`status.${status}`, { defaultValue: status })}
          </Badge>
          <span>
            {document.fileType.toUpperCase()} · {formatBytes(document.fileSize)}
          </span>
          <span>{formatDate(document.createdAt, language)}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {downloadUrl && /^https?:\/\//i.test(downloadUrl) && (
            <Button variant="outline" asChild>
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={document.filename}
              >
                <Download className="h-4 w-4" />
                {t("downloadOriginal")}
              </a>
            </Button>
          )}
          {!inspection && (
            <Button variant="ghost" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4" />
              {t("deleteDocument")}
            </Button>
          )}
        </div>
      </header>
      {query.isError && (
        <div className="space-y-3">
          <ErrorState message={t("documentFetchFailed")} />
          <Button variant="outline" onClick={() => void query.refetch()}>
            {t("retryDocument")}
          </Button>
        </div>
      )}
      {contentQuery.isError && (
        <div className="space-y-3">
          <ErrorState message={t("extractionFetchFailed")} />
          <Button
            variant="outline"
            onClick={() => void contentQuery.refetch()}
            disabled={contentQuery.isFetching}
          >
            {t("retryExtractionFetch")}
          </Button>
        </div>
      )}
      {processing && (
        <section
          role="status"
          className="flex items-start gap-3 rounded-xl border bg-card p-5"
        >
          <Loader2 className="mt-1 h-5 w-5 shrink-0 animate-spin text-secondary" />
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-primary">
              {t("extracting")}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {t(
                params.get("evaluate") === "1" && !inspection
                  ? "automaticEvaluation"
                  : "returnLater",
              )}
            </p>
          </div>
        </section>
      )}
      {status === "FAILED" && (
        <div className="space-y-3">
          <ErrorState message={t("extractionFailed")} />
          <Button variant="outline" asChild>
            <Link href="/compositions/new?mode=upload">
              {t("uploadAnother")}
            </Link>
          </Button>
        </div>
      )}
      {!inspection && (
        <DocumentEvaluation
          key={id}
          document={document}
          text={text}
          ready={status === "READY" && !contentQuery.isError}
          automatic={params.get("evaluate") === "1"}
        />
      )}
      <section
        aria-labelledby="extracted-heading"
        className="space-y-5 rounded-xl border bg-card p-5 sm:p-8"
      >
        <h2
          id="extracted-heading"
          className="text-xl font-semibold text-primary"
        >
          {t("extractedText")}
        </h2>
        {contentQuery.isLoading ? (
          <LoadingState label={t("loadingText")} />
        ) : text.trim() ? (
          <div className="whitespace-pre-wrap break-words text-lg leading-[30px]">
            {text}
          </div>
        ) : (
          !contentQuery.isError &&
          !processing && (
            <p className="text-base leading-7 text-muted-foreground">
              {t(status === "READY" ? "emptyText" : "noText")}
            </p>
          )
        )}
      </section>
      <Dialog
        open={deleteOpen}
        onClose={() => {
          if (!deletion.isPending) setDeleteOpen(false);
        }}
        title={t("deleteTitle")}
      >
        <p className="leading-7 text-muted-foreground">
          {t("deleteDescription")}
        </p>
        {deletion.isError && (
          <ErrorState
            className="mt-4"
            message={getApiErrorMessage(deletion.error)}
          />
        )}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button
            variant="outline"
            disabled={deletion.isPending}
            onClick={() => setDeleteOpen(false)}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="destructive"
            disabled={deletion.isPending}
            onClick={() => void remove()}
          >
            {t(deletion.isPending ? "deleting" : "deleteDocument")}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export default function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <Suspense>
      <DocumentDetail key={id} id={id} />
    </Suspense>
  );
}
