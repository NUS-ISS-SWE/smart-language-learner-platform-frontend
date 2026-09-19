"use client";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { getApiErrorMessage } from "@/lib/api/client";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Composition } from "@/types/composition";

type UserCompositionsListProps = {
  readonly query: UseQueryResult<Composition[]>;
  readonly returnTo?: string;
};

export function UserCompositionsList({
  query,
  returnTo = "/admin/users",
}: UserCompositionsListProps) {
  const { t, language } = useTranslation("studio");
  if (query.isLoading) return <LoadingState label={t("compositions")} />;

  const compositions = query.data ?? [];

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
      {!query.isError && compositions.length === 0 && (
        <p className="rounded-xl border border-dashed bg-card py-10 text-center text-sm text-muted-foreground">
          {t("noUserCompositions")}
        </p>
      )}
      {compositions.map((c) => (
        <Link
          key={c.id}
          href={`/compositions/${c.id}?context=admin&returnTo=${encodeURIComponent(returnTo)}`}
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card px-5 py-4 text-sm transition-colors hover:bg-soft-teal/40"
        >
          <div className="min-w-0">
            <p className="break-words font-medium">
              {c.title || t("untitled")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t(c.language === "CHINESE" ? "chinese" : "english")} ·{" "}
              {c.createdAt
                ? new Date(c.createdAt).toLocaleDateString(language)
                : "\u2014"}
            </p>
          </div>
          <StatusBadge status={c.compositionStatus} />
        </Link>
      ))}
    </div>
  );
}
