"use client";

import { Label } from "@/components/ui/Label";
import { WrappingTitleInput } from "@/components/ui/WrappingTitleInput";
import { RichTextEditor } from "./RichTextEditor";
import type { CompositionDraft } from "@/types/composition";
import { useTranslation } from "@/lib/i18n/useTranslation";

type CompositionEditorFieldsProps = {
  readonly draft: CompositionDraft;
  readonly disabled?: boolean;
  readonly onChange: <Key extends keyof CompositionDraft>(
    key: Key,
    value: CompositionDraft[Key],
  ) => void;
};

export function CompositionEditorFields({
  draft,
  onChange,
  disabled,
}: CompositionEditorFieldsProps) {
  const { t } = useTranslation("editor");
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-[0_16px_48px_-32px_#142b3d60]">
      <div className="space-y-1 px-5 pb-3 pt-5 sm:px-8 sm:pt-6">
        <Label htmlFor="title" className="text-muted-foreground">
          {t("title")}
        </Label>
        <WrappingTitleInput
          id="title"
          value={draft.title}
          disabled={disabled}
          onValueChange={(title) => onChange("title", title)}
          placeholder={t("titlePlaceholder")}
          className="min-h-12 rounded-none border-0 border-b border-transparent bg-transparent px-0 py-2 text-2xl font-semibold leading-8 tracking-tight text-primary focus-visible:border-secondary sm:text-3xl"
          required
        />
      </div>
      <RichTextEditor
        value={draft.content}
        disabled={disabled}
        onChange={(html) => onChange("content", html)}
      />
    </div>
  );
}
