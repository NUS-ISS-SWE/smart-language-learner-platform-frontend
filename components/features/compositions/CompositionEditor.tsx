"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Save, SendHorizontal, WandSparkles } from "lucide-react";
import { AUTOSAVE_STORAGE_KEY } from "@/lib/constants";
import { getApiErrorMessage } from "@/lib/api/client";
import { useAutosave } from "@/lib/hooks/useAutosave";
import { useUnsavedWarning } from "@/lib/hooks/useUnsavedWarning";
import { AutosaveIndicator } from "./AutosaveIndicator";
import { RichTextEditor } from "./RichTextEditor";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import { useGenerateComposition } from "@/lib/hooks/useCompositions";
import type { Composition, CompositionDraft, CompositionLanguage } from "@/types/composition";

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

const emptyDraft: CompositionDraft = {
  title: "",
  content: "",
  language: "ENGLISH",
  compositionSource: "RAW_TEXT",
};

function isDraftDirty(draft: CompositionDraft): boolean {
  return JSON.stringify(draft) !== JSON.stringify(emptyDraft);
}

export function CompositionEditor({
  compositionId,
  initialValue,
  isSaving,
  saveError,
  onSave,
  onDraftChange,
  onSubmitForReview,
  isSubmitting,
  submitError,
}: CompositionEditorProps) {
  const [draft, setDraft] = useState<CompositionDraft>(() => {
    if (!initialValue) return emptyDraft;
    return {
      title: initialValue.title ?? "",
      content: initialValue.content ?? "",
      language: initialValue.language ?? "ENGLISH",
      compositionSource: initialValue.compositionSource ?? "RAW_TEXT",
    };
  });
  const onDraftChangeRef = useRef(onDraftChange);
  useEffect(() => { onDraftChangeRef.current = onDraftChange; });
  useEffect(() => { onDraftChangeRef.current?.(draft); }, [draft]);
  const [autosaveEnabled, setAutosaveEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(AUTOSAVE_STORAGE_KEY) !== "false";
  });

  const { autosaveStatus, lastSavedAt } = useAutosave(compositionId, draft, autosaveEnabled);
  const generateMutation = useGenerateComposition();

  const isNewComposition = !compositionId;
  const isDirty = isNewComposition && isDraftDirty(draft);
  useUnsavedWarning(isDirty);

  function updateDraft<Key extends keyof CompositionDraft>(key: Key, value: CompositionDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleAutosaveToggle(checked: boolean) {
    setAutosaveEnabled(checked);
    localStorage.setItem(AUTOSAVE_STORAGE_KEY, String(checked));
  }

  function handleGenerate() {
    generateMutation.mutate(
      { title: draft.title, language: draft.language },
      {
        onSuccess: (composition) => {
          setDraft((current) => ({
            ...current,
            content: composition.content ?? current.content,
            compositionSource: "SYSTEM",
          }));
        },
      },
    );
  }

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(draft);
  }

  function handleSubmitForReview() {
    onSubmitForReview?.(draft);
  }

  const canGenerate = draft.title.trim().length > 0 && !generateMutation.isPending;
  const canSubmitForReview = draft.content.trim().length > 0;

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {/* Top settings + actions toolbar */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <Label htmlFor="language" className="shrink-0">Language</Label>
          <Select
            id="language"
            value={draft.language}
            onChange={(e) => updateDraft("language", e.target.value as CompositionLanguage)}
          >
            <option value="ENGLISH">English</option>
            <option value="CHINESE">Chinese</option>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="source" className="shrink-0">Source</Label>
          <Select
            id="source"
            value={draft.compositionSource}
            onChange={(e) => updateDraft("compositionSource", e.target.value as CompositionDraft["compositionSource"])}
          >
            <option value="RAW_TEXT">Manual</option>
            <option value="SYSTEM">AI generated</option>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label className="shrink-0">Auto-save</Label>
          <Toggle checked={autosaveEnabled} onCheckedChange={handleAutosaveToggle} aria-label="Toggle auto-save" />
          {compositionId && <AutosaveIndicator status={autosaveStatus} lastSavedAt={lastSavedAt} />}
          {isDirty && <Badge variant="secondary">Unsaved changes</Badge>}
        </div>

        {/* Actions pushed to the right */}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" onClick={handleGenerate} disabled={!canGenerate}>
            {generateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <WandSparkles className="h-4 w-4" />}
            Generate
          </Button>

          <Button type="submit" variant="outline" disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save draft
          </Button>

          {onSubmitForReview && (
            <Button type="button" disabled={!canSubmitForReview || isSubmitting} onClick={handleSubmitForReview}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
              Submit for review
            </Button>
          )}
        </div>
      </div>

      {/* Error states */}
      {!!saveError && <ErrorState message={getApiErrorMessage(saveError)} />}
      {!!submitError && <ErrorState message={getApiErrorMessage(submitError)} />}
      {generateMutation.isError && <ErrorState message={getApiErrorMessage(generateMutation.error)} />}

      {/* Full-width editor */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={draft.title}
              onChange={(e) => updateDraft("title", e.target.value)}
              placeholder="A memorable day at school"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <RichTextEditor
              value={draft.content}
              onChange={(html) => updateDraft("content", html)}
            />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
