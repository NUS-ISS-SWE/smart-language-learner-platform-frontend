"use client";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatBytes } from "@/lib/utils";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { getApiErrorMessage } from "@/lib/api/client";
import type { UseQueryResult } from "@tanstack/react-query";
import type { AdminUserDocumentsResponse } from "@/lib/api/admin";

type UserDocumentsListProps = {
  readonly query: UseQueryResult<AdminUserDocumentsResponse>;
  readonly returnTo?: string;
};

export function UserDocumentsList({
  query,
  returnTo = "/admin/users",
}: UserDocumentsListProps) {
  const { t, language } = useTranslation("studio");
  if (query.isLoading) return <LoadingState label={t("documents")} />;

  const documents = query.data?.documents ?? [];

  return (
    <div className="space-y-2">
      {query.isError && (
        <div className="space-y-3">
          <ErrorState message={getApiErrorMessage(query.error)} />
          <Button variant="outline" onClick={() => void query.refetch()}>
            {t("retry")}
          </Button>
        </div>
      )}
      {!query.isError && documents.length === 0 && (
        <p className="rounded-xl border border-dashed bg-card py-10 text-center text-sm text-muted-foreground">
          {t("noDocuments")}
        </p>
      )}
      {documents.map((doc) => (
        <Link
          key={doc.id}
          href={`/documents/${doc.id}?context=admin&returnTo=${encodeURIComponent(returnTo)}`}
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card px-5 py-4 text-sm transition-colors hover:bg-soft-teal/40"
        >
          <div className="min-w-0">
            <p className="break-words font-medium">{doc.filename}</p>
            <p className="text-xs text-muted-foreground">
              {doc.fileType} · {formatBytes(doc.fileSize)} ·{" "}
              {new Date(doc.createdAt).toLocaleDateString(language)}
            </p>
          </div>
          <Badge
            variant={
              doc.status === "READY"
                ? "success"
                : doc.status === "FAILED"
                  ? "destructive"
                  : "secondary"
            }
          >
            {t(doc.status, { defaultValue: doc.status })}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
