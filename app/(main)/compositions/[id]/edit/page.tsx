"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { CompositionEditor } from "@/components/features/compositions/CompositionEditor";
import { Button } from "@/components/ui/Button";
import { useComposition } from "@/lib/hooks/useCompositions";
import { getApiErrorMessage } from "@/lib/api/client";
import type { Composition } from "@/types/composition";

function LoadedEditor({ composition }: { composition: Composition }) {
  // Query acknowledgements must not remount or reset an active editor.
  const [initial] = useState(composition);
  const [allowOriginal, setAllowOriginal] = useState(false);
  const { t } = useTranslation("editor");
  const back = (
    <Button variant="outline" asChild>
      <Link href={`/compositions/${initial.id}`}>{t("backToFeedback")}</Link>
    </Button>
  );
  if (["REVIEWING", "GENERATING"].includes(initial.compositionStatus))
    return (
      <div className="space-y-4">
        <p>{t("workInProgress")}</p>
        {back}
      </div>
    );
  if (initial.compositionStatus === "REVIEWED" && !allowOriginal)
    return (
      <section className="max-w-2xl space-y-4 rounded-xl border border-border bg-card p-6">
        <PageHeader
          title={t("originalTitle")}
          description={t("originalWarning")}
        />
        <div className="flex flex-wrap gap-2">
          {back}
          <Button variant="outline" onClick={() => setAllowOriginal(true)}>
            {t("editOriginal")}
          </Button>
        </div>
      </section>
    );
  return (
    <div className="space-y-6">
      <PageHeader title={t("editTitle")} />
      <CompositionEditor initialValue={initial} />
    </div>
  );
}

export default function EditCompositionPage({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, error } = useComposition(id);
  const { t } = useTranslation("composition");
  if (isLoading) return <LoadingState label={t("loadingComposition")} />;
  if (!data) return <ErrorState message={getApiErrorMessage(error)} />;
  return <LoadedEditor key={id} composition={data} />;
}
