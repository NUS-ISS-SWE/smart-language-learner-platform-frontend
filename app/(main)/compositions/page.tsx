"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Plus, Upload } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getApiErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { CompositionRow } from "@/components/features/compositions/CompositionRow";
import { DocumentCard } from "@/components/features/documents/DocumentCard";
import { useCompositionLibrary } from "@/lib/hooks/useCompositions";
import { useDocumentLibrary } from "@/lib/hooks/useDocuments";

function CompositionsContent() {
  const searchParams = useSearchParams();
  const { t } = useTranslation("studio");
  const activeTab =
    searchParams.get("tab") === "documents" ? "documents" : "compositions";
  const query = useCompositionLibrary();
  const docs = useDocumentLibrary();
  const compositions = [
    ...new Map(
      (query.data?.pages.flat() ?? []).map((item) => [item.id, item]),
    ).values(),
  ];
  const documents = [
    ...new Map(
      (docs.data?.pages.flatMap((page) => page.documents) ?? []).map((item) => [
        item.id,
        item,
      ]),
    ).values(),
  ];
  const activeQuery = activeTab === "documents" ? docs : query;
  const count =
    activeTab === "documents" ? documents.length : compositions.length;
  return (
    <div className="space-y-6">
      <PageHeader
        title={t("compositions")}
        description={t("libraryIntro")}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/compositions/new?mode=upload">
                <Upload className="h-4 w-4" />
                {t("upload")}
              </Link>
            </Button>
            <Button asChild>
              <Link href="/compositions/new">
                <Plus className="h-4 w-4" />
                {t("write")}
              </Link>
            </Button>
          </>
        }
      />
      <nav aria-label={t("compositions")} className="flex gap-6 border-b">
        {(["compositions", "documents"] as const).map((tab) => (
          <Link
            key={tab}
            href={
              tab === "documents"
                ? "/compositions?tab=documents"
                : "/compositions"
            }
            aria-current={activeTab === tab ? "page" : undefined}
            className={cn(
              "-mb-px flex min-h-11 items-center border-b-2 py-3 text-sm font-medium",
              activeTab === tab
                ? "border-secondary text-secondary"
                : "border-transparent text-muted-foreground hover:text-primary",
            )}
          >
            {t(tab)}
          </Link>
        ))}
      </nav>
      {activeQuery.isLoading && <LoadingState label={t(activeTab)} />}
      {activeQuery.isError && (
        <div className="space-y-3">
          <ErrorState
            message={
              count ? t("moreFailed") : getApiErrorMessage(activeQuery.error)
            }
          />
          <Button
            variant="outline"
            disabled={activeQuery.isFetching}
            onClick={() =>
              activeQuery.isFetchNextPageError
                ? activeQuery.fetchNextPage()
                : activeQuery.refetch()
            }
          >
            {t("retry")}
          </Button>
        </div>
      )}
      {!activeQuery.isLoading && !activeQuery.isError && count === 0 && (
        <EmptyState
          title={t(activeTab === "documents" ? "noDocuments" : "emptyTitle")}
          description={t(
            activeTab === "documents" ? "documentHint" : "emptyHint",
          )}
        />
      )}
      {activeTab === "compositions" && compositions.length > 0 && (
        <div className="divide-y rounded-xl border border-border bg-card">
          {compositions.map((item) => (
            <CompositionRow key={item.id} composition={item} />
          ))}
        </div>
      )}
      {activeTab === "documents" && documents.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}
      {count > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" className="text-sm text-muted-foreground">
            {activeTab === "compositions"
              ? t("loaded", { count })
              : t("documents") + ": " + count}
            {!activeQuery.hasNextPage && " · " + t("end")}
          </p>
          {activeQuery.hasNextPage && !activeQuery.isFetchNextPageError && (
            <Button
              variant="outline"
              disabled={activeQuery.isFetchingNextPage}
              onClick={() => activeQuery.fetchNextPage()}
            >
              {t(activeQuery.isFetchingNextPage ? "loadingMore" : "loadMore")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default function CompositionsPage() {
  return (
    <Suspense>
      <CompositionsContent />
    </Suspense>
  );
}
