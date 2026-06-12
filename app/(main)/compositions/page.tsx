"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "@/lib/api/client";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/Button";
import { CompositionCard } from "@/components/features/compositions/CompositionCard";
import { useCompositionList } from "@/lib/hooks/useCompositions";

export default function CompositionsPage() {
  const { data = [], isLoading, isError, error } = useCompositionList();
  const { t } = useTranslation("composition");

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">{t("library")}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">{t("myCompositions")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("manageAll")}
          </p>
        </div>
        <Button asChild>
          <Link href="/compositions/new">
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t("newComposition")}
          </Link>
        </Button>
      </div>

      {isLoading ? <LoadingState label={t("loading")} /> : null}
      {isError ? <ErrorState message={getApiErrorMessage(error)} /> : null}

      {!isLoading && !isError && data.length === 0 ? (
        <EmptyState
          title={t("noCompositions")}
          description={t("createFirst")}
          action={
            <Button asChild>
              <Link href="/compositions/new">{t("creating")}</Link>
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError && data.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {data.map((composition) => (
            <CompositionCard key={composition.id} composition={composition} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
