"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/Button";
import { CompositionCard } from "@/components/features/compositions/CompositionCard";
import { DocumentCard } from "@/components/features/documents/DocumentCard";
import { useCompositionList } from "@/lib/hooks/useCompositions";
import { useDocumentList } from "@/lib/hooks/useDocuments";

function CompositionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation("composition");

  const activeTab = searchParams.get("tab") === "documents" ? "documents" : "compositions";

  const { data: compositions = [], isLoading: compositionsLoading, isError: compositionsError, error } = useCompositionList();
  const { data: documentsData, isLoading: docsLoading } = useDocumentList();
  const documents = documentsData?.documents ?? [];

  function switchTab(tab: "compositions" | "documents") {
    router.push(tab === "compositions" ? "/compositions" : "/compositions?tab=documents");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">{t("library")}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">{t("myCompositions")}</h1>
        </div>
        <Button asChild>
          <Link href="/compositions/new">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New composition
          </Link>
        </Button>
      </div>

      <div className="flex gap-6 border-b">
        <button
          type="button"
          onClick={() => switchTab("compositions")}
          className={cn(
            "-mb-px pb-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "compositions"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          Compositions ({compositions.length})
        </button>
        <button
          type="button"
          onClick={() => switchTab("documents")}
          className={cn(
            "-mb-px pb-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "documents"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          Documents ({documentsData?.total ?? 0})
        </button>
      </div>

      {activeTab === "compositions" && (
        <>
          {compositionsLoading ? <LoadingState label={t("loading")} /> : null}
          {compositionsError ? <ErrorState message={getApiErrorMessage(error)} /> : null}
          {!compositionsLoading && !compositionsError && compositions.length === 0 ? (
            <EmptyState
              title={t("noCompositions")}
              description={t("createFirst")}
            />
          ) : null}
          {!compositionsLoading && !compositionsError && compositions.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {compositions.map((composition) => (
                <CompositionCard key={composition.id} composition={composition} />
              ))}
            </div>
          ) : null}
        </>
      )}

      {activeTab === "documents" && (
        <>
          {docsLoading ? <LoadingState label="Loading documents…" /> : null}
          {!docsLoading && documents.length === 0 ? (
            <EmptyState
              title="No documents yet"
              description="Upload a PDF, DOCX, or TXT file to convert it to a composition."
            />
          ) : null}
          {!docsLoading && documents.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {documents.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          ) : null}
        </>
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


