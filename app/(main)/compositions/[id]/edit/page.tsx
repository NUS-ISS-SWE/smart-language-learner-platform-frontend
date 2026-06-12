"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { CompositionEditor } from "@/components/features/compositions/CompositionEditor";
import { useComposition, useUpdateComposition } from "@/lib/hooks/useCompositions";
import { getApiErrorMessage } from "@/lib/api/client";
import type { CompositionDraft } from "@/types/composition";

type Props = { params: Promise<{ id: string }> };

export default function EditCompositionPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useTranslation("composition");

  const { data: composition, isLoading, isError, error } = useComposition(id);
  const mutation = useUpdateComposition();

  if (isLoading) return <LoadingState label={t("loadingComposition")} />;
  if (isError) return <ErrorState message={getApiErrorMessage(error)} />;

  function handleSave(draft: CompositionDraft) {
    mutation.mutate(
      { id, draft },
      {
        onSuccess: () => {
          router.push(`/compositions/${id}`);
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">{t("editComposition")}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">{t("updateDraft")}</h1>
      </div>
      <CompositionEditor
        initialValue={composition ?? null}
        isSaving={mutation.isPending}
        saveError={mutation.error}
        onSave={handleSave}
      />
    </div>
  );
}
