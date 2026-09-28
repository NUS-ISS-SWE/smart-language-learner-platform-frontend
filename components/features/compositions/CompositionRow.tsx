"use client";

import Link from "next/link";
import { compositionPreview } from "@/lib/composition-content";
import { ArrowUpRight, FileText } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/Badge";
import type { Composition } from "@/types/composition";

export function CompositionRow({ composition }: { composition: Composition }) {
  const { t, i18n } = useTranslation("studio");
  const preview = compositionPreview(composition.content ?? "", 180);
  const removed = composition.moderation?.status === "REMOVED";
  const date = (value: string) =>
    new Date(value).toLocaleDateString(
      i18n.language.startsWith("zh") ? "zh-CN" : "en-GB",
      { day: "numeric", month: "short", year: "numeric" },
    );
  return (
    <Link
      href={`/compositions/${composition.id}`}
      className="group flex min-w-0 items-start gap-3 px-4 py-5 transition-colors hover:bg-muted/60 sm:gap-4 sm:px-6"
    >
      <span className="hidden rounded-lg border border-border bg-background p-2.5 text-secondary sm:block">
        <FileText className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between">
          <h3 className="min-w-0 flex-1 break-words text-base font-semibold leading-6 text-primary">
            {composition.title || t("untitled")}
          </h3>
          <StatusBadge status={composition.compositionStatus} />
          {removed && <Badge variant="destructive">Removed</Badge>}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm leading-5 text-muted-foreground">
          <span>
            {t(composition.language === "CHINESE" ? "chinese" : "english")}
          </span>
          <span>{t("updated", { date: date(composition.updatedAt) })}</span>
          <span>{t("created", { date: date(composition.createdAt) })}</span>
        </div>
        <p className="mt-2 line-clamp-2 break-words text-sm leading-6 text-muted-foreground">
          {removed
            ? `Removed: ${composition.moderation?.reasonNote || composition.moderation?.reasonCategory || "Reason provided by an administrator."}`
            : preview || t("noContent")}
        </p>
      </div>
      <ArrowUpRight
        className="mt-1 hidden h-4 w-4 shrink-0 text-muted-foreground group-hover:text-secondary sm:block"
        aria-hidden="true"
      />
    </Link>
  );
}
