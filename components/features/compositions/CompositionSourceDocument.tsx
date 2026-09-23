"use client";

import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { useDocument } from "@/lib/hooks/useDocuments";
import { useAdminDocumentDetail } from "@/lib/hooks/useAdminContent";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Button } from "@/components/ui/Button";
import { formatBytes, formatDate } from "@/lib/utils";

/** Renders only a document link explicitly stored with this composition. */
export function CompositionSourceDocument({
  inspection,
  sourceDocumentId,
}: {
  inspection: boolean;
  sourceDocumentId: string | null;
}) {
  const { t, language } = useTranslation("feedback");
  const own = useDocument(inspection ? null : sourceDocumentId);
  const admin = useAdminDocumentDetail(inspection ? sourceDocumentId : null);
  const query = inspection ? admin : own;

  // Manually written and system-generated compositions have no source document.
  // In particular, never infer a document from a browser-local composition ID.
  if (!sourceDocumentId) return null;
  if (query.isError)
    return (
      <div className="space-y-2 text-sm">
        <p>{t("sourceMissing")}</p>
        <Button variant="outline" onClick={() => void query.refetch()}>
          {t("refresh")}
        </Button>
      </div>
    );
  if (!query.data) return null;

  const { document, downloadUrl } = query.data;
  return (
    <section
      aria-label={t("sourceDocument")}
      className="flex flex-wrap items-center justify-between gap-4 border-y py-4"
    >
      <div className="flex min-w-0 items-start gap-3">
        <FileText className="mt-1 h-5 w-5 shrink-0 text-secondary" />
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">
            {t("sourceDocument")}
          </p>
          <p className="break-words font-medium">{document.filename}</p>
          <p className="text-xs text-muted-foreground">
            {document.fileType.toUpperCase()} · {formatBytes(document.fileSize)}
            {" · "}
            {formatDate(document.createdAt, language)}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" asChild>
          <Link
            href={`/documents/${encodeURIComponent(sourceDocumentId)}${inspection ? "?context=admin" : ""}`}
          >
            {t("viewDocument")}
          </Link>
        </Button>
        {downloadUrl && /^https?:\/\//i.test(downloadUrl) && (
          <Button variant="outline" asChild>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={document.filename}
            >
              <Download className="h-4 w-4" />
              {t("download")}
            </a>
          </Button>
        )}
      </div>
    </section>
  );
}
