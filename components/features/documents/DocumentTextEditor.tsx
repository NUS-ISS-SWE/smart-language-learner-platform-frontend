"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, SendHorizontal } from "lucide-react";
import { getApiErrorMessage } from "@/lib/api/client";
import { RichTextEditor } from "@/components/features/compositions/RichTextEditor";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { useCreateComposition, useRequestGrading } from "@/lib/hooks/useCompositions";
import type { CompositionLanguage, CompositionSource } from "@/types/composition";
import type { DocumentDTO } from "@/types/document";

type DocumentTextEditorProps = {
  readonly document: DocumentDTO;
  readonly initialContent: string;
};

function stripExtension(filename: string): string {
  return filename.replace(/\.[^.]+$/, "");
}

function toCompositionSource(fileType: string): CompositionSource {
  const ft = fileType.toLowerCase();
  if (ft === "pdf") return "FILE_PDF";
  if (ft === "docx") return "FILE_DOCX";
  return "RAW_TEXT";
}

/** Convert plain text (with newlines) to HTML paragraphs for the rich text editor. */
function plainTextToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((para) => `<p>${para.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export function DocumentTextEditor({ document: doc, initialContent }: DocumentTextEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(stripExtension(doc.filename));
  const [content, setContent] = useState(() => plainTextToHtml(initialContent));
  const [language, setLanguage] = useState<CompositionLanguage>("ENGLISH");

  const createMutation = useCreateComposition();
  const gradingMutation = useRequestGrading();

  const source: CompositionSource = toCompositionSource(doc.fileType);
  const canAct = content.trim().length > 0 && title.trim().length > 0;
  const isBusy = createMutation.isPending || gradingMutation.isPending;

  function handleCreate() {
    createMutation.mutate(
      { title, content, language, compositionSource: source },
      {
        onSuccess: (composition) => {
          if (composition.id) router.push(`/compositions/${composition.id}`);
        },
      },
    );
  }

  function handleSubmitForReview() {
    createMutation.mutate(
      { title, content, language, compositionSource: source },
      {
        onSuccess: (composition) => {
          if (!composition.id) return;
          gradingMutation.mutate(composition.id, {
            onSuccess: () => router.push(`/compositions/${composition.id}`),
          });
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Top settings + actions toolbar */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <Label htmlFor="doc-language" className="shrink-0">Language</Label>
          <Select
            id="doc-language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as CompositionLanguage)}
          >
            <option value="ENGLISH">English</option>
            <option value="CHINESE">Chinese</option>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label className="shrink-0 text-muted-foreground">Source</Label>
          <Badge variant="secondary">{source}</Badge>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" onClick={handleCreate} disabled={!canAct || isBusy}>
            {createMutation.isPending && !gradingMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            Create Composition
          </Button>
          <Button type="button" onClick={handleSubmitForReview} disabled={!canAct || isBusy}>
            {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
            Submit for Review
          </Button>
        </div>
      </div>

      {!!createMutation.error && <ErrorState message={getApiErrorMessage(createMutation.error)} />}

      {/* Editor card */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="doc-comp-title">Composition Title</Label>
            <Input
              id="doc-comp-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for the composition"
            />
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
