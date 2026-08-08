"use client";

import Link from "next/link";
import { use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Download, Edit, FileText, Loader2, Trash2 } from "lucide-react";
import { getApiErrorMessage } from "@/lib/api/client";
import { useAuth } from "@/context/AuthContext";
import { CompositionFeedback } from "@/components/features/compositions/CompositionFeedback";
import {
  useComposition,
  useDeleteComposition,
  useRequestGrading,
} from "@/lib/hooks/useCompositions";
import { useAdminCompositionDetail } from "@/lib/hooks/useAdmin";
import { useDocument } from "@/lib/hooks/useDocuments";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { formatDate, formatBytes } from "@/lib/utils";

type Props = { readonly params: Promise<{ id: string }> };

export default function CompositionDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useTranslation("composition");
  const compositionId = useMemo(() => {
    const n = Number(id);
    return Number.isNaN(n) ? null : n;
  }, [id]);

  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  // Admin uses the admin endpoint (no user-scoped ownership check); normal users use the regular endpoint.
  const compositionQuery = useComposition(isAdmin ? null : compositionId);
  const adminQuery = useAdminCompositionDetail(isAdmin ? compositionId : null);
  const resolvedQuery = isAdmin ? adminQuery : compositionQuery;
  const gradeMutation = useRequestGrading();
  const deleteMutation = useDeleteComposition();
  const composition = resolvedQuery.data;

  // Retrieve linked document ID stored when auto-creating from a document
  const linkedDocId = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(`sllp.comp.${id}.docId`);
  }, [id]);

  const { data: linkedDocData } = useDocument(linkedDocId);

  function handleGrade() {
    if (!compositionId) return;
    gradeMutation.mutate(compositionId);
  }

  function handleDelete() {
    if (!compositionId || !globalThis.confirm(t("deleteConfirm"))) return;
    deleteMutation.mutate(compositionId, {
      onSuccess: () => router.replace("/compositions"),
    });
  }

  if (resolvedQuery.isLoading) {
    return <LoadingState label={t("loadingComposition")} />;
  }

  if (resolvedQuery.isError || !composition) {
    return <ErrorState message={getApiErrorMessage(resolvedQuery.error)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-3 mb-2">
            <Link href="/compositions">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {t("back")}
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-normal">{composition.title || t("untitled")}</h1>
            <StatusBadge status={composition.compositionStatus} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {composition.language === "CHINESE"
              ? t("chineseComposition", { date: formatDate(composition.createdAt) })
              : t("englishComposition", { date: formatDate(composition.createdAt) })}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href={`/compositions/${composition.id}/edit`}>
              <Edit className="h-4 w-4" aria-hidden="true" />
              {t("editComposition")}
            </Link>
          </Button>
          <Button variant="outline" type="button" onClick={handleGrade} disabled={gradeMutation.isPending}>
            {gradeMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {t("requestGrading")}
          </Button>
          <Button
            variant="destructive"
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            aria-label={t("deleteConfirm")}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {t("common:delete")}
          </Button>
        </div>
      </div>

      {gradeMutation.isError ? <ErrorState message={getApiErrorMessage(gradeMutation.error)} /> : null}
      {deleteMutation.isError ? <ErrorState message={getApiErrorMessage(deleteMutation.error)} /> : null}

      {linkedDocData && (
        <Card>
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="rounded-lg bg-muted p-2 shrink-0">
                <FileText className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">Source document</p>
                <p className="truncate text-sm font-medium">{linkedDocData.document.filename}</p>
                <p className="text-xs text-muted-foreground">
                  {linkedDocData.document.fileType.toUpperCase()} &middot; {formatBytes(linkedDocData.document.fileSize)} &middot; Uploaded {formatDate(linkedDocData.document.createdAt)}
                </p>
              </div>
            </div>
            {linkedDocData.downloadUrl && (
              <Button variant="outline" size="sm" asChild className="shrink-0">
                <a href={linkedDocData.downloadUrl} target="_blank" rel="noopener noreferrer" download={linkedDocData.document.filename}>
                  <Download className="mr-1 h-4 w-4" aria-hidden="true" />
                  Download
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card>
          <CardHeader>
            <CardTitle>{t("compositionContent")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[460px] whitespace-pre-wrap rounded-lg border bg-white p-5 text-base leading-8">
              {composition.content}
            </div>
            <Separator className="my-5" />
            <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <span>{t("sourceLabel", { source: composition.compositionSource ?? "RAW_TEXT" })}</span>
              <span>{t("updatedLabel", { date: formatDate(composition.updatedAt) })}</span>
            </div>
          </CardContent>
        </Card>

        <CompositionFeedback feedback={composition.systemFeedback} />
      </div>
    </div>
  );
}
