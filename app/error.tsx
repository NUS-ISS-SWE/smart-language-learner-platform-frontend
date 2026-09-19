"use client";
import Link from "next/link";
import { BookOpenCheck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function ErrorBoundary({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const { t } = useTranslation("visual");
  return (
    <div className="flex min-h-[65vh] items-center justify-center px-4 py-12">
      <section className="w-full max-w-lg rounded-2xl border bg-card p-6 text-center sm:p-10">
        <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-soft-teal text-secondary">
          <BookOpenCheck className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="font-editorial text-4xl text-primary">
          {t("errorTitle")}
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          {t("errorHint")}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={retry}>
            <RotateCcw className="h-4 w-4" />
            {t("retry")}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">{t("home")}</Link>
          </Button>
        </div>
        {process.env.NODE_ENV === "development" && (
          <details className="mt-6 text-left text-sm">
            <summary className="cursor-pointer py-3 text-muted-foreground">
              Developer details
            </summary>
            <pre className="whitespace-pre-wrap break-words rounded-lg bg-muted p-4">
              {error.message}
            </pre>
          </details>
        )}
      </section>
    </div>
  );
}
