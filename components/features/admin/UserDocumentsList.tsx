import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { getApiErrorMessage } from "@/lib/api/client";
import type { UseQueryResult } from "@tanstack/react-query";
import type { AdminUserDocumentsResponse } from "@/lib/api/admin";

type UserDocumentsListProps = {
  readonly query: UseQueryResult<AdminUserDocumentsResponse>;
};

export function UserDocumentsList({ query }: UserDocumentsListProps) {
  if (query.isLoading) return <LoadingState label="Loading documents…" />;
  if (query.isError) return <ErrorState message={getApiErrorMessage(query.error)} />;

  const documents = query.data?.documents ?? [];

  if (documents.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No documents found.</p>;
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between rounded-md border px-4 py-3 text-sm">
          <div className="min-w-0">
            <p className="truncate font-medium">{doc.filename}</p>
            <p className="text-xs text-muted-foreground">
              {doc.fileType} · {(doc.fileSize / 1024).toFixed(1)} KB · {new Date(doc.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span className="ml-3 shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs">{doc.status}</span>
        </div>
      ))}
    </div>
  );
}
