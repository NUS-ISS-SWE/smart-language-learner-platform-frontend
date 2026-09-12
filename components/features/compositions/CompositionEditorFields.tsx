"use client";

import { Label } from "@/components/ui/Label";
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
    <div className="overflow-hidden rounded-xl border bg-card shadow-soft">
      <div className="space-y-2 px-5 pb-5 pt-6 sm:px-8 sm:pt-8">
        <Label htmlFor="title" className="text-muted-foreground">
          {t("title")}
        </Label>
        <textarea
          id="title"
          rows={1}
          style={{ fieldSizing: "content" }}
          value={draft.title}
          disabled={disabled}
          onChange={(event) =>
            onChange("title", event.target.value.replace(/\r?\n/g, " "))
          }
          placeholder={t("titlePlaceholder")}
          className="block min-h-12 w-full resize-none rounded-none border-0 border-b border-transparent bg-transparent px-0 py-2 text-2xl font-semibold leading-8 text-primary placeholder:text-muted-foreground focus-visible:border-secondary focus-visible:outline-none"
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
