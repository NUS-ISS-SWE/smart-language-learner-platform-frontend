"use client";
import Link from "next/link";
import { BookOpenCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function NotFound() {
  const { t } = useTranslation("visual");
  return (
    <main className="grid min-h-[70vh] place-items-center px-4 py-12">
      <section className="max-w-lg rounded-2xl border bg-card p-8 text-center sm:p-12">
        <BookOpenCheck
          className="mx-auto mb-6 h-10 w-10 text-secondary"
          aria-hidden="true"
        />
        <p className="eyebrow text-muted-foreground">404</p>
        <h1 className="font-editorial mt-3 text-4xl text-primary">
          {t("notFound")}
        </h1>
        <p className="mt-4 leading-7 text-muted-foreground">
          {t("notFoundHint")}
        </p>
        <Button asChild className="mt-7">
          <Link href="/">{t("home")}</Link>
        </Button>
      </section>
    </main>
  );
}
