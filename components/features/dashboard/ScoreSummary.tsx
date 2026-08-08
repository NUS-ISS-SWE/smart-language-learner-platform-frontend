"use client";

import Link from "next/link";
import { CheckCircle2, Clock3, FileText, FolderOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import type { Composition } from "@/types/composition";

type ScoreSummaryProps = {
  readonly compositions: Composition[];
  readonly documentsCount: number;
};

export function ScoreSummary({ compositions, documentsCount }: ScoreSummaryProps) {
  const reviewed = compositions.filter((item) => item.compositionStatus === "REVIEWED").length;
  const inProgress = compositions.filter(
    (item) => item.compositionStatus === "REVIEWING" || item.compositionStatus === "GENERATING",
  ).length;

  const items = [
    { label: "Total compositions", value: compositions.length, icon: FileText, tone: "text-primary bg-primary/10", href: "/compositions" },
    { label: "Reviewed", value: reviewed, icon: CheckCircle2, tone: "text-emerald-700 bg-emerald-100", href: "/compositions" },
    { label: "In progress", value: inProgress, icon: Clock3, tone: "text-amber-800 bg-amber-100", href: "/compositions" },
    { label: "Documents uploaded", value: documentsCount, icon: FolderOpen, tone: "text-violet-700 bg-violet-100", href: "/compositions?tab=documents" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Link key={item.label} href={item.href} className="block">
          <Card className="transition-colors hover:border-primary/35">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`rounded-lg p-3 ${item.tone}`}>
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
