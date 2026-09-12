"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { CompositionEditor } from "@/components/features/compositions/CompositionEditor";
import { CreateCompositionCopy } from "@/components/features/compositions/CreateCompositionCopy";
import { hasCompositionText } from "@/lib/composition-session";
import { Button } from "@/components/ui/Button";
import { compositionId, useComposition } from "@/lib/hooks/useCompositions";
import { getApiErrorMessage } from "@/lib/api/client";
import type { Composition } from "@/types/composition";

function LoadedEditor({ composition }: { composition: Composition }) {
  // Query acknowledgements must not remount or reset an active editor.
  const initial = composition;
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
          {hasCompositionText(initial.content ?? "") && (
            <CreateCompositionCopy composition={initial} />
          )}
          {back}
          <Button variant="outline" onClick={() => setAllowOriginal(true)}>
            {t("editOriginal")}
          </Button>
        </div>
      </section>
    );
  return (
    <div className="mx-auto w-full max-w-[760px] space-y-6">
      <PageHeader title={t("editTitle")} />
      <CompositionEditor initialValue={initial} />
    </div>
  );
}

function EditSessionLoader({ id }: { id: string }) {
  const { data, error, isFetchedAfterMount, refetch } = useComposition(id);
  const [initial, setInitial] = useState<Composition | null>(null);
  const { t } = useTranslation("composition");
  const { t: editorT } = useTranslation("editor");
  const { t: feedbackT } = useTranslation("feedback");
  if (!Number.isFinite(compositionId(id)))
    return <ErrorState message={feedbackT("invalidId")} />;
  // Capture one successfully refreshed record. Later cache changes must not
  // replace input or unmount an active session when a background fetch fails.
  if (!initial && data && isFetchedAfterMount && !error) setInitial(data);
  if (initial) return <LoadedEditor composition={initial} />;
  if (error)
    return (
      <div className="space-y-4">
        <ErrorState message={getApiErrorMessage(error)} />
        <Button variant="outline" onClick={() => void refetch()}>
          {editorT("retry")}
        </Button>
      </div>
    );
  return <LoadingState label={t("loadingComposition")} />;
}

export default function EditCompositionPage({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <EditSessionLoader key={id} id={id} />;
}
