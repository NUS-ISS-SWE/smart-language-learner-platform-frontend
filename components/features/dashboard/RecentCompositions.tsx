"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Button } from "@/components/ui/Button";
import { CompositionRow } from "@/components/features/compositions/CompositionRow";
import type { Composition } from "@/types/composition";

export function RecentCompositions({
  compositions,
}: {
  compositions: Composition[];
}) {
  const { t } = useTranslation("studio");
  return (
    <section aria-labelledby="recent-writing">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2
            id="recent-writing"
            className="text-xl font-semibold tracking-tight text-primary"
          >
            {t("recent")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("recentHint")}
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/compositions">
            {t("viewLibrary")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      {compositions.length ? (
        <div className="divide-y rounded-xl border border-border bg-card">
          {compositions.slice(0, 5).map((item) => (
            <CompositionRow key={item.id} composition={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-input bg-card p-6">
          <h3 className="font-semibold text-primary">{t("emptyTitle")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t("emptyHint")}</p>
        </div>
      )}
    </section>
  );
}
