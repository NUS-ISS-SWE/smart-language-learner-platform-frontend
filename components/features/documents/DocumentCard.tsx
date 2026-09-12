"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useRouter } from "next/navigation";
import { FileText, Loader2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useDeleteDocument } from "@/lib/hooks/useDocuments";
import { getApiErrorMessage } from "@/lib/api/client";
import { formatBytes } from "@/lib/utils";
import type { DocumentDTO } from "@/types/document";

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  UPLOADED: "secondary",
  PROCESSING: "secondary",
  READY: "default",
  FAILED: "destructive",
};

type Props = { readonly document: DocumentDTO };

export function DocumentCard({ document }: Props) {
  const { t, language } = useTranslation("studio");
  const router = useRouter();
  const deleteMutation = useDeleteDocument();
  // Read once on mount — check if this document was already converted to a composition
  const [compositionId] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem(`sllp.doc.${document.id}.compositionId`)
      : null,
  );

  function handleView() {
    router.push(
      compositionId
        ? `/compositions/${compositionId}`
        : `/documents/${document.id}`,
    );
  }

  function handleDelete() {
    if (
      !globalThis.confirm(
        t("confirmDeleteDocument", { name: document.filename }),
      )
    )
      return;
    deleteMutation.mutate(document.id);
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileText
              className="h-4 w-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <CardTitle
              title={document.filename}
              className="break-words text-sm font-medium"
            >
              {document.filename}
            </CardTitle>
          </div>
          <Badge
            variant={STATUS_VARIANT[document.status] ?? "secondary"}
            className="shrink-0 capitalize"
          >
            {t(document.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
          <span>
            {t("fileType")}:{" "}
            <span className="uppercase">{document.fileType}</span>
          </span>
          <span>
            {t("fileSize")}: {formatBytes(document.fileSize)}
          </span>
          <span className="col-span-2">
            {t("uploaded", {
              date: new Date(document.createdAt).toLocaleDateString(
                language === "zh" ? "zh-CN" : "en-GB",
              ),
            })}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleView}
          >
            {t(compositionId ? "viewComposition" : "viewDocument")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            aria-label={t("deleteDocument", { name: document.filename })}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 text-destructive" />
            )}
          </Button>
        </div>
        {deleteMutation.isError ? (
          <p className="text-xs text-destructive">
            {getApiErrorMessage(deleteMutation.error)}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
