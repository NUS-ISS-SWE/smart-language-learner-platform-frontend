"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { CompositionEditor } from "@/components/features/compositions/CompositionEditor";
import { useCreateComposition } from "@/lib/hooks/useCompositions";
import type { CompositionDraft } from "@/types/composition";

export default function NewCompositionPage() {
  const router = useRouter();
  const createMutation = useCreateComposition();
  const { t } = useTranslation("composition");

  function handleSave(draft: CompositionDraft) {
    createMutation.mutate(draft, {
      onSuccess: (composition) => router.push(`/compositions/${composition.id}`),
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">{t("newCompositionLabel")}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">{t("startWriting")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("editorSubtitle")}
        </p>
      </div>

      <CompositionEditor
        initialValue={null}
        isSaving={createMutation.isPending}
        saveError={createMutation.error}
        onSave={handleSave}
      />
    </div>
  );
}
