import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { getApiErrorMessage } from "@/lib/api/client";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Composition } from "@/types/composition";

type UserCompositionsListProps = {
  query: UseQueryResult<Composition[]>;
};

export function UserCompositionsList({ query }: UserCompositionsListProps) {
  if (query.isLoading) return <LoadingState label="Loading compositions…" />;
  if (query.isError) return <ErrorState message={getApiErrorMessage(query.error)} />;

  const compositions = query.data ?? [];

  if (compositions.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No compositions found.</p>;
  }

  return (
    <div className="space-y-2">
      {compositions.map((c) => (
        <div key={c.id} className="flex items-center justify-between rounded-md border px-4 py-3 text-sm">
          <div className="min-w-0">
            <p className="truncate font-medium">{c.title || "(Untitled)"}</p>
            <p className="text-xs text-muted-foreground">{c.language} · {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}</p>
          </div>
          <StatusBadge status={c.compositionStatus} />
        </div>
      ))}
    </div>
  );
}
