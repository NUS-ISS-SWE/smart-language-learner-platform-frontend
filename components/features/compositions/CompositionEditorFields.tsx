"use client";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { RichTextEditor } from "./RichTextEditor";
import type { CompositionDraft } from "@/types/composition";

type CompositionEditorFieldsProps = {
  readonly draft: CompositionDraft;
  readonly onChange: <Key extends keyof CompositionDraft>(key: Key, value: CompositionDraft[Key]) => void;
};

export function CompositionEditorFields({ draft, onChange }: CompositionEditorFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={draft.title} onChange={(event) => onChange("title", event.target.value)} placeholder="A memorable day at school" required />
      </div>
      <div className="space-y-2">
        <Label>Content</Label>
        <RichTextEditor value={draft.content} onChange={(html) => onChange("content", html)} />
      </div>
    </div>
  );
}
