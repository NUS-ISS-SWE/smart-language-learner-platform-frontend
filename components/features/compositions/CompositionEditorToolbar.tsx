"use client";

import { Loader2, Save, SendHorizontal, WandSparkles } from "lucide-react";
import { AutosaveIndicator } from "./AutosaveIndicator";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import type { AutosaveStatus } from "@/lib/composition-session";
import type { CompositionDraft, CompositionLanguage } from "@/types/composition";
import { hasCompositionText } from "@/lib/composition-session";

type CompositionEditorToolbarProps = {
  readonly draft: CompositionDraft;
  readonly onChange: <Key extends keyof CompositionDraft>(key: Key, value: CompositionDraft[Key]) => void;
  readonly autosaveEnabled: boolean;
  readonly onAutosaveChange: (enabled: boolean) => void;
  readonly autosaveStatus: AutosaveStatus;
  readonly lastSavedAt?: Date;
  readonly showAutosaveStatus: boolean;
  readonly isDirty: boolean;
  readonly onGenerate: () => void;
  readonly isGenerating: boolean;
  readonly onSubmitForReview?: () => void;
  readonly isSubmitting?: boolean;
  readonly isSaving: boolean;
};

export function CompositionEditorToolbar(props: CompositionEditorToolbarProps) {
  const canGenerate = props.draft.title.trim().length > 0 && !props.isGenerating;
  const canSubmitForReview = props.draft.title.trim().length > 0 && hasCompositionText(props.draft.content);
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border bg-card px-4 py-3">
      <div className="flex items-center gap-2">
        <Label htmlFor="language" className="shrink-0">Language</Label>
        <Select id="language" value={props.draft.language} onChange={(event) => props.onChange("language", event.target.value as CompositionLanguage)}>
          <option value="ENGLISH">English</option><option value="CHINESE">Chinese</option>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Label className="shrink-0">Auto-save</Label>
        <Toggle checked={props.autosaveEnabled} onCheckedChange={props.onAutosaveChange} aria-label="Toggle auto-save" />
        {props.showAutosaveStatus && <AutosaveIndicator status={props.autosaveStatus} lastSavedAt={props.lastSavedAt} />}
        {props.isDirty && <Badge variant="secondary">Unsaved changes</Badge>}
      </div>
      <div className="ml-auto flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" onClick={props.onGenerate} disabled={!canGenerate}>
          {props.isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <WandSparkles className="h-4 w-4" />} Generate
        </Button>
        <Button type="submit" variant="outline" disabled={props.isSaving}>
          {props.isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save draft
        </Button>
        {props.onSubmitForReview && <Button type="button" disabled={!canSubmitForReview || props.isSubmitting} onClick={props.onSubmitForReview}>
          {props.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />} Submit for review
        </Button>}
      </div>
    </div>
  );
}
