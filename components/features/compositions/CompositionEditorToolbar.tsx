"use client";

import { Loader2, Save, SendHorizontal, WandSparkles } from "lucide-react";
import { AutosaveIndicator } from "./AutosaveIndicator";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import type { AutosaveStatus } from "@/lib/composition-session";
import type {
  CompositionDraft,
  CompositionLanguage,
} from "@/types/composition";
import { hasCompositionText } from "@/lib/composition-session";
import { useTranslation } from "@/lib/i18n/useTranslation";

type CompositionEditorToolbarProps = {
  readonly draft: CompositionDraft;
  readonly onChange: <Key extends keyof CompositionDraft>(
    key: Key,
    value: CompositionDraft[Key],
  ) => void;
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
  const { t } = useTranslation("editor");
  const canGenerate =
    props.draft.title.trim().length > 0 && !props.isGenerating;
  const canSubmitForReview =
    props.draft.title.trim().length > 0 &&
    hasCompositionText(props.draft.content);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Label htmlFor="autosave" className="shrink-0">
            {t("autosave")}
          </Label>
          <Toggle
            id="autosave"
            checked={props.autosaveEnabled}
            onCheckedChange={props.onAutosaveChange}
            aria-label={t("toggleAutosave")}
          />
          {props.showAutosaveStatus && (
            <AutosaveIndicator
              status={props.autosaveStatus}
              lastSavedAt={props.lastSavedAt}
            />
          )}
          {props.isDirty && <Badge variant="secondary">{t("unsaved")}</Badge>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" variant="outline" disabled={props.isSaving}>
            {props.isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}{" "}
            {t("saveDraft")}
          </Button>
          {props.onSubmitForReview && (
            <Button
              type="button"
              disabled={!canSubmitForReview || props.isSubmitting}
              onClick={props.onSubmitForReview}
            >
              {props.isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SendHorizontal className="h-4 w-4" />
              )}{" "}
              {t("submitReview")}
            </Button>
          )}
        </div>
      </div>
      <details className="text-sm">
        <summary className="min-h-11 cursor-pointer py-3 font-medium text-muted-foreground">
          {t("writingOptions")}
        </summary>
        <div className="space-y-4 border-l-2 border-border pl-4 pb-2">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="language">{t("language")}</Label>
            <Select
              id="language"
              value={props.draft.language}
              aria-describedby="language-guidance"
              onChange={(event) =>
                props.onChange(
                  "language",
                  event.target.value as CompositionLanguage,
                )
              }
            >
              <option value="ENGLISH">{t("english")}</option>
              <option value="CHINESE">{t("chinese")}</option>
            </Select>
            <p
              id="language-guidance"
              className="leading-6 text-muted-foreground"
            >
              {t("languageGuidance")}
            </p>
          </div>
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={props.onGenerate}
              disabled={!canGenerate}
            >
              {props.isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <WandSparkles className="h-4 w-4" />
              )}{" "}
              {t("generate")}
            </Button>
            <p className="leading-6 text-muted-foreground">
              {t("generationGuidance")}
            </p>
          </div>
        </div>
      </details>
    </div>
  );
}
