"use client";

import Link from "next/link";
import { FileText, Loader2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useDeleteDocument } from "@/lib/hooks/useDocuments";
import { getApiErrorMessage } from "@/lib/api/client";
import { formatDate } from "@/lib/utils";
import type { DocumentDTO } from "@/types/document";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  UPLOADED: "secondary",
  PROCESSING: "secondary",
  READY: "default",
  FAILED: "destructive",
};

type Props = { document: DocumentDTO };

export function DocumentCard({ document }: Props) {
  const deleteMutation = useDeleteDocument();

  function handleDelete() {
    if (!window.confirm(`Delete "${document.filename}"?`)) return;
    deleteMutation.mutate(document.id);
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <CardTitle className="truncate text-sm font-medium">{document.filename}</CardTitle>
          </div>
          <Badge variant={STATUS_VARIANT[document.status] ?? "secondary"} className="shrink-0 capitalize">
            {document.status.toLowerCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
          <span>Type: <span className="uppercase">{document.fileType}</span></span>
          <span>Size: {formatBytes(document.fileSize)}</span>
          <span className="col-span-2">Uploaded: {formatDate(document.createdAt)}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href={`/documents/${document.id}`}>View</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            aria-label={`Delete ${document.filename}`}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 text-destructive" />
            )}
          </Button>
        </div>
        {deleteMutation.isError ? (
          <p className="text-xs text-destructive">{getApiErrorMessage(deleteMutation.error)}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
