"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Download, FileText } from "lucide-react";
import { useDocument } from "@/lib/hooks/useDocuments";
import { useAdminDocumentDetail } from "@/lib/hooks/useAdminContent";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Button } from "@/components/ui/Button";
import { formatBytes, formatDate } from "@/lib/utils";
import type { CompositionSource } from "@/types/composition";

const subscribe = (notify: () => void) => {
  window.addEventListener("storage", notify);
  return () => window.removeEventListener("storage", notify);
};

export function CompositionSourceDocument({
  id,
  inspection,
  compositionSource,
}: {
  id: number;
  inspection: boolean;
  compositionSource: CompositionSource;
}) {
  const { t, language } = useTranslation("feedback");
  const documentId = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(`sllp.comp.${id}.docId`);
      } catch {
        return null;
      }
    },
    () => null,
  );
  // AI-generated compositions have no uploaded source document. Local
  // associations are browser hints and can be stale after a local DB reset.
  const linkedDocumentId = compositionSource === "SYSTEM" ? null : documentId;
  const own = useDocument(inspection ? null : linkedDocumentId);
  const admin = useAdminDocumentDetail(inspection ? linkedDocumentId : null);
  const query = inspection ? admin : own;
  if (!linkedDocumentId) return null;
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
          <p className="text-xs text-muted-foreground">{t("localLink")}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" asChild>
          <Link
            href={`/documents/${encodeURIComponent(linkedDocumentId)}${inspection ? "?context=admin" : ""}`}
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
