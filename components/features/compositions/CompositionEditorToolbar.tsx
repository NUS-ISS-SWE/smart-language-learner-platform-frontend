"use client";

import {
  ChevronDown,
  Loader2,
  Save,
  SendHorizontal,
  SlidersHorizontal,
  WandSparkles,
} from "lucide-react";
import { useId, useState } from "react";
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
import { cn } from "@/lib/utils";

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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsId = useId();
  const canGenerate =
    props.draft.title.trim().length > 0 && !props.isGenerating;
  const canSubmitForReview =
    props.draft.title.trim().length > 0 &&
    hasCompositionText(props.draft.content);
  return (
    <div className="composition-actions flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-border bg-card px-3 py-2 sm:px-4">
      <div className="flex flex-[1_1_420px] flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
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
      <section className="basis-full border-t border-border pt-1 text-sm">
        <button
          type="button"
          className="flex min-h-12 w-full items-center justify-between gap-4 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted focus-visible:bg-muted"
          aria-label={
            settingsOpen ? t("hideWritingOptions") : t("writingOptions")
          }
          aria-expanded={settingsOpen}
          aria-controls={settingsId}
          onClick={() => setSettingsOpen((open) => !open)}
        >
          <span className="flex min-w-0 items-center gap-3">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-secondary" />
            <span className="min-w-0">
              <span className="block font-semibold text-primary">
                {t("writingOptions")}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {t("writingOptionsHint")}
              </span>
            </span>
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
              settingsOpen && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>
        {settingsOpen && (
          <div
            id={settingsId}
            className="grid gap-5 border-t border-border px-2 py-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div className="space-y-2">
              <Label htmlFor="autosave">{t("autosave")}</Label>
              <div className="flex min-h-11 items-center gap-3 rounded-lg bg-muted px-3">
                <Toggle
                  id="autosave"
                  checked={props.autosaveEnabled}
                  onCheckedChange={props.onAutosaveChange}
                  aria-label={t("toggleAutosave")}
                />
                <span className="text-sm text-muted-foreground">
                  {props.autosaveEnabled ? t("saved") : t("unsaved")}
                </span>
              </div>
            </div>
            <div className="space-y-2">
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
                className="text-xs leading-5 text-muted-foreground"
              >
                {t("languageGuidance")}
              </p>
            </div>
            <div className="space-y-2">
              <span className="block text-sm font-medium text-foreground">
                {t("generate")}
              </span>
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
              <p className="text-xs leading-5 text-muted-foreground">
                {t("generationGuidance")}
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
