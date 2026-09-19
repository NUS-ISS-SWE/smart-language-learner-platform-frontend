"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PenLine, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/shared/PageHeader";
import { DocumentUpload } from "@/components/features/documents/DocumentUpload";
import { CompositionEditor } from "@/components/features/compositions/CompositionEditor";
import { useTranslation } from "@/lib/i18n/useTranslation";

function NewCompositionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation("editor");
  const mode = searchParams.get("mode") === "upload" ? "upload" : "write";
  return (
    <div className="mx-auto w-full max-w-[860px] space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <PageHeader title={t("newTitle")} />
        <Button variant="ghost" size="sm" asChild className="-ml-3 sm:ml-0">
          <Link href="/compositions">
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Link>
        </Button>
      </div>
      <nav aria-label={t("newTitle")} className="flex gap-5 border-b">
        {(
          [
            { key: "write", href: "/compositions/new", icon: PenLine },
            {
              key: "upload",
              href: "/compositions/new?mode=upload",
              icon: Upload,
            },
          ] as const
        ).map((item) => (
          <Link
            key={item.key}
            href={item.href}
            aria-current={mode === item.key ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-2 border-b-2 text-sm font-medium",
              mode === item.key
                ? "border-secondary text-secondary"
                : "border-transparent text-muted-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {t(item.key)}
          </Link>
        ))}
      </nav>
      {mode === "write" ? (
        <CompositionEditor />
      ) : (
        <div>
          <DocumentUpload
            onSuccess={(doc) =>
              router.push(`/documents/${doc.document.id}?evaluate=1`)
            }
          />
        </div>
      )}
    </div>
  );
}

export default function NewCompositionPage() {
  return (
    <Suspense>
      <NewCompositionContent />
    </Suspense>
  );
}
