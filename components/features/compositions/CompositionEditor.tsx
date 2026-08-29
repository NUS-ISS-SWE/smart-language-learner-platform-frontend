"use client";

import { useState } from "react";
import { AUTOSAVE_STORAGE_KEY } from "@/lib/constants";
import { getApiErrorMessage } from "@/lib/api/client";
import { useAutosave } from "@/lib/hooks/useAutosave";
import { isNewDraftDirty, useCompositionDraft } from "@/lib/hooks/useCompositionDraft";
import { useUnsavedWarning } from "@/lib/hooks/useUnsavedWarning";
import { useGenerateComposition } from "@/lib/hooks/useCompositions";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card, CardContent } from "@/components/ui/Card";
import { CompositionEditorFields } from "./CompositionEditorFields";
import { CompositionEditorToolbar } from "./CompositionEditorToolbar";
import type { Composition, CompositionDraft } from "@/types/composition";

type CompositionEditorProps = {
  readonly compositionId?: string;
  readonly initialValue?: Composition | null;
  readonly isSaving: boolean;
  readonly saveError?: unknown;
  readonly onSave: (draft: CompositionDraft) => void;
  readonly onDraftChange?: (draft: CompositionDraft) => void;
  readonly onSubmitForReview?: (draft: CompositionDraft) => void;
  readonly isSubmitting?: boolean;
  readonly submitError?: unknown;
};

export function CompositionEditor({ compositionId, initialValue, isSaving, saveError, onSave, onDraftChange, onSubmitForReview, isSubmitting, submitError }: CompositionEditorProps) {
  const { draft, updateDraft, setDraft } = useCompositionDraft(initialValue, onDraftChange);
  const [autosaveEnabled, setAutosaveEnabled] = useState(() => typeof window === "undefined" || localStorage.getItem(AUTOSAVE_STORAGE_KEY) !== "false");
  const { autosaveStatus, lastSavedAt } = useAutosave(compositionId, draft, autosaveEnabled);
  const generateMutation = useGenerateComposition();
  const isDirty = !compositionId && isNewDraftDirty(draft);
  useUnsavedWarning(isDirty);

  function setAutosave(enabled: boolean) {
    setAutosaveEnabled(enabled);
    localStorage.setItem(AUTOSAVE_STORAGE_KEY, String(enabled));
  }

  function generate() {
    generateMutation.mutate({ title: draft.title }, {
      onSuccess: (composition) => setDraft((current) => ({ ...current, content: composition.content ?? current.content, compositionSource: "SYSTEM" })),
    });
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={(event) => { event.preventDefault(); onSave(draft); }}>
      <CompositionEditorToolbar
        draft={draft} onChange={updateDraft} autosaveEnabled={autosaveEnabled} onAutosaveChange={setAutosave}
        autosaveStatus={autosaveStatus} lastSavedAt={lastSavedAt} showAutosaveStatus={Boolean(compositionId)} isDirty={isDirty}
        onGenerate={generate} isGenerating={generateMutation.isPending} onSubmitForReview={onSubmitForReview ? () => onSubmitForReview(draft) : undefined}
        isSubmitting={isSubmitting} isSaving={isSaving}
      />
      {!!saveError && <ErrorState message={getApiErrorMessage(saveError)} />}
      {!!submitError && <ErrorState message={getApiErrorMessage(submitError)} />}
      {generateMutation.isError && <ErrorState message={getApiErrorMessage(generateMutation.error)} />}
      <Card><CardContent className="pt-6"><CompositionEditorFields draft={draft} onChange={updateDraft} /></CardContent></Card>
    </form>
  );
}
