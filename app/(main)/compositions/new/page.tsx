"use client";

import { useRouter } from "next/navigation";
import { CompositionEditor } from "@/components/features/compositions/CompositionEditor";
import { useCreateComposition } from "@/lib/hooks/useCompositions";
import type { CompositionDraft } from "@/types/composition";

export default function NewCompositionPage() {
  const router = useRouter();
  const createMutation = useCreateComposition();

  function handleSave(draft: CompositionDraft) {
    createMutation.mutate(draft, {
      onSuccess: (composition) => router.push(`/compositions/${composition.id}`),
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">New composition</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">Start writing</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Compose in a clean editor and save your work to the backend composition service.
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
