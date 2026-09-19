"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { Composition } from "@/types/composition";

export function ScoreSummary({
  compositions,
  documentsCount,
}: {
  compositions?: Composition[];
  documentsCount?: number;
}) {
  const { t } = useTranslation("studio");
  const items = [
    {
      label: "recentCount",
      value: compositions?.length,
      href: "/compositions",
    },
    {
      label: "reviewed",
      value: compositions?.filter(
        (item) => item.compositionStatus === "REVIEWED",
      ).length,
      href: "/compositions",
    },
    {
      label: "inProgress",
      value: compositions?.filter((item) =>
        ["REVIEWING", "GENERATING"].includes(item.compositionStatus),
      ).length,
      href: "/compositions",
    },
    {
      label: "documentsCount",
      value: documentsCount,
      href: "/compositions?tab=documents",
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-border py-5 xl:grid-cols-4">
      {items.map((item) => (
        <Link key={item.label} href={item.href} className="rounded-md">
          <p className="text-2xl font-semibold tabular-nums text-primary">
            {item.value ?? "—"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{t(item.label)}</p>
        </Link>
      ))}
    </div>
  );
}
