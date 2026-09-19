"use client";

import Link from "next/link";
import { Suspense, use, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminReturnTo } from "@/lib/admin-return";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage } from "@/lib/api/client";
import { isUncertainMutationError } from "@/lib/api/mutation-outcome";
import { hasCompositionText } from "@/lib/composition-session";
import {
  compositionId,
  useComposition,
  useDeleteComposition,
  useRequestGrading,
} from "@/lib/hooks/useCompositions";
import { useAdminCompositionDetail } from "@/lib/hooks/useAdminContent";
import { CompositionFeedback } from "@/components/features/compositions/CompositionFeedback";
import { CompositionReader } from "@/components/features/compositions/CompositionReader";
import { CompositionSourceDocument } from "@/components/features/compositions/CompositionSourceDocument";
import { CreateCompositionCopy } from "@/components/features/compositions/CreateCompositionCopy";
import { AssessmentProgress } from "@/components/features/compositions/AssessmentProgress";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { formatDate } from "@/lib/utils";

function CompositionDetail({ id }: { id: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const { user } = useAuth();
  const inspection =
    params.get("context") === "admin" && user?.role === "ADMIN";
  const numId = compositionId(id);
  const validId = Number.isFinite(numId) ? numId : null;
  const own = useComposition(inspection ? null : validId);
  const admin = useAdminCompositionDetail(inspection ? validId : null);
  const query = inspection ? admin : own;
  const { t, language } = useTranslation("feedback");
  const { t: compositionT } = useTranslation("composition");
  const grade = useRequestGrading();
  const deletion = useDeleteComposition();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [uncertainReview, setUncertainReview] = useState(false);
  const grading = useRef(false);
  const deleting = useRef(false);
  const active = useRef(true);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  const composition = query.data;
  async function requestReview() {
    if (
      inspection ||
      !composition ||
      composition.compositionStatus !== "DRAFT" ||
      grading.current ||
      uncertainReview
    )
      return;
    grading.current = true;
    try {
      await grade.mutateAsync(composition.id);
    } catch (error) {
      setUncertainReview(isUncertainMutationError(error));
    } finally {
      grading.current = false;
    }
  }
  async function refresh() {
    const result = await query.refetch();
    if (!result.isError) {
      setUncertainReview(false);
      grade.reset();
    }
  }
  async function remove() {
    if (inspection || !composition || deleting.current) return;
    deleting.current = true;
    try {
      await deletion.mutateAsync(composition.id);
      if (active.current) router.replace("/compositions");
    } catch {
      /* Keep the confirmation and API error visible. */
    } finally {
      deleting.current = false;
    }
  }
  if (!validId) return <ErrorState message={t("invalidId")} />;
  if (query.isLoading)
    return <LoadingState label={compositionT("loadingComposition")} />;
  if (!composition)
    return (
      <div className="space-y-4">
        <ErrorState message={getApiErrorMessage(query.error)} />
        <Button variant="outline" onClick={() => void refresh()}>
          {t("refresh")}
        </Button>
      </div>
    );
  const status = composition.compositionStatus;
  const reviewed = status === "REVIEWED";
  const processing = status === "GENERATING" || status === "REVIEWING";
  const content = composition.content ?? "";
  const meaningful = hasCompositionText(content);
  return (
    <div className="composition-detail space-y-6">
      <header className="space-y-4">
        <Button variant="ghost" size="sm" asChild className="-ml-3">
          <Link
            href={
              inspection
                ? adminReturnTo(
                    params.get("returnTo"),
                    `/admin/users/${composition.userId}`,
                  )
                : "/compositions"
            }
          >
            <ArrowLeft className="h-4 w-4" />
            {t(inspection ? "backToUser" : "back")}
          </Link>
        </Button>
        {inspection && (
          <p className="text-sm font-medium text-secondary">
            {t("inspection")}
          </p>
        )}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="min-w-0 break-words text-3xl font-semibold leading-tight text-primary">
              {composition.title || compositionT("untitled")}
            </h1>
            <StatusBadge status={status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {compositionT(
              composition.language === "CHINESE"
                ? "chineseComposition"
                : "englishComposition",
              { date: formatDate(composition.createdAt, language) },
            )}
          </p>
        </div>
        {!inspection && (
          <div className="flex flex-wrap items-start gap-3">
            {reviewed && meaningful && (
              <CreateCompositionCopy
                key={composition.id}
                composition={composition}
              />
            )}
            {!processing && !uncertainReview && !grade.isPending && (
              <Button
                variant={status === "DRAFT" ? "default" : "outline"}
                asChild
              >
                <Link href={`/compositions/${composition.id}/edit`}>
                  {t(reviewed ? "editOriginal" : "continueWriting")}
                </Link>
              </Button>
            )}
            {status === "DRAFT" && (
              <Button
                variant="outline"
                onClick={() => void requestReview()}
                disabled={
                  grade.isPending ||
                  uncertainReview ||
                  !meaningful ||
                  !composition.title.trim()
                }
              >
                {grade.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {t("requestReview")}
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => setDeleteOpen(true)}
              disabled={grade.isPending}
            >
              <Trash2 className="h-4 w-4" />
              {t("delete")}
            </Button>
          </div>
        )}
        {reviewed && !inspection && (
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {t("revisionHint")}
          </p>
        )}
      </header>
      {(query.isError || grade.isError || uncertainReview) && (
        <div className="space-y-3">
          <ErrorState
            message={
              uncertainReview
                ? t("uncertainReview")
                : query.isError
                  ? t("refreshFailed")
                  : getApiErrorMessage(grade.error)
            }
          />
          <Button
            variant="outline"
            onClick={() => void refresh()}
            disabled={query.isFetching}
          >
            {t("refresh")}
          </Button>
        </div>
      )}
      <CompositionSourceDocument
        id={composition.id}
        inspection={inspection}
        compositionSource={composition.compositionSource}
      />
      {status === "GENERATING" && (
        <section
          role="status"
          className="space-y-3 rounded-xl border bg-card p-6"
        >
          <h2 className="flex items-center gap-2 text-xl font-semibold text-primary">
            <Loader2 className="h-5 w-5 animate-spin" />
            {t("generating")}
          </h2>
          <p className="max-w-2xl leading-7 text-muted-foreground">
            {t("generationHint")}
          </p>
        </section>
      )}
      {status === "GENERATION_FAILED" && (
        <section className="space-y-4 rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold text-primary">
            {t("generationFailed")}
          </h2>
          <p className="leading-7 text-muted-foreground">
            {t("generationRetryHint")}
          </p>
          {!inspection && (
            <CreateCompositionCopy
              key={composition.id}
              composition={composition}
              kind="generation"
            />
          )}
        </section>
      )}
      {status !== "GENERATING" && (
        <>
          <nav
            aria-label={t("content")}
            className="detail-jumps flex flex-wrap gap-3"
          >
            <Button variant="outline" asChild>
              <a href="#composition-text">{t("readComposition")}</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#feedback">{t("jumpFeedback")}</a>
            </Button>
          </nav>
          <div className="detail-columns grid items-start gap-6">
            <article
              id="composition-text"
              aria-labelledby="composition-heading"
              className="min-w-0 scroll-mt-24 rounded-xl border bg-card p-5 shadow-soft sm:p-8"
            >
              <h2
                id="composition-heading"
                className="mb-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
              >
                {t("content")}
              </h2>
              {content.trim() ? (
                <CompositionReader content={content} />
              ) : (
                <p className="text-base leading-7 text-muted-foreground">
                  {t("noContent")}
                </p>
              )}
              <footer className="mt-8 flex flex-wrap gap-x-4 gap-y-2 border-t pt-4 text-xs leading-5 text-muted-foreground">
                <span>
                  {compositionT("sourceLabel", {
                    source:
                      {
                        RAW_TEXT: t("sourceTyped"),
                        FILE_PDF: t("sourcePdf"),
                        FILE_DOCX: t("sourceDocx"),
                        SYSTEM: t("sourceGenerated"),
                      }[composition.compositionSource] ??
                      composition.compositionSource,
                  })}
                </span>
                <span>
                  {compositionT("updatedLabel", {
                    date: formatDate(composition.updatedAt, language),
                  })}
                </span>
              </footer>
            </article>
            <aside className="min-w-0 space-y-6 rounded-xl border bg-card p-5 sm:p-6">
              {status === "REVIEWING" && (
                <section className="space-y-4 border-b pb-6">
                  <h2 className="text-xl font-semibold text-primary">
                    {t("reviewRunning")}
                  </h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {t("reviewHint")}
                  </p>
                  <AssessmentProgress
                    stage={composition.gradingProgressStage}
                    message={composition.gradingProgressMessage}
                  />
                </section>
              )}
              <CompositionFeedback
                feedback={composition.systemFeedback}
                suggestions={composition.suggestions}
                suggestionStatus={composition.suggestionStatus}
                reviewed={reviewed}
              />
              {reviewed && !composition.systemFeedback?.trim() && (
                <Button
                  variant="outline"
                  onClick={() => void refresh()}
                  disabled={query.isFetching}
                >
                  {t("refresh")}
                </Button>
              )}
            </aside>
          </div>
        </>
      )}
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
            {t(deletion.isPending ? "deleting" : "delete")}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export default function CompositionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <Suspense>
      <CompositionDetail key={id} id={id} />
    </Suspense>
  );
}
