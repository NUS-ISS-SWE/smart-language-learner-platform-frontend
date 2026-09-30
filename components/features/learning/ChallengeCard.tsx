"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  FileUp,
  Loader2,
  PenLine,
  Send,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { DocumentUpload } from "@/components/features/documents/DocumentUpload";
import { RichTextEditor } from "@/components/features/compositions/RichTextEditor";
import { ErrorState } from "@/components/shared/ErrorState";
import { Dialog } from "@/components/ui/Dialog";
import { getApiErrorMessage } from "@/lib/api/client";
import {
  compositionPreview,
  plainTextToCompositionHtml,
} from "@/lib/composition-content";
import { useDocumentContent } from "@/lib/hooks/useDocuments";
import {
  useCurrentChallengeSubmission,
  useSubmitChallenge,
} from "@/lib/hooks/useLearning";
import type { Challenge } from "@/types/learning";

function responseUnits(content: string, language: Challenge["language"]) {
  const text = compositionPreview(content, Number.MAX_SAFE_INTEGER);
  return language === "CHINESE"
    ? [...text].filter((character) => /\p{Script=Han}/u.test(character)).length
    : text.trim()
      ? text.trim().split(/\s+/).length
      : 0;
}

export function ChallengeCard({
  challenge,
}: {
  readonly challenge: Challenge;
}) {
  const [content, setContent] = useState("");
  const [mode, setMode] = useState<"write" | "upload">("write");
  const [documentId, setDocumentId] = useState<string | null>(null);
  const uploadedDocument = useDocumentContent(documentId);
  const submit = useSubmitChallenge(challenge.language);
  const units = useMemo(
    () => responseUnits(content, challenge.language),
    [challenge.language, content],
  );
  const completedEntry = useCurrentChallengeSubmission(
    challenge.id,
    challenge.language,
    challenge.submitted,
  );
  const [entryOpen, setEntryOpen] = useState(false);
  const unit =
    challenge.language === "CHINESE" ? "Chinese characters" : "words";
  const meetsMinimum = units >= challenge.minResponseUnits;
  const pathStyle =
    {
      EVERYDAY_CONFIDENCE: "bg-sky-50 border-sky-200 text-sky-700",
      VIVID_DESCRIPTION: "bg-amber-50 border-amber-200 text-amber-700",
      STORY_BUILDER: "bg-violet-50 border-violet-200 text-violet-700",
      HELPFUL_COMMUNICATION: "bg-rose-50 border-rose-200 text-rose-700",
    }[challenge.themePath] ?? "bg-soft-teal/20 border-border text-secondary";
  useEffect(() => {
    if (!uploadedDocument.data?.extractedText) return;
    // This is an asynchronous extraction result; importing it is the requested upload behaviour.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setContent(plainTextToCompositionHtml(uploadedDocument.data.extractedText));
    setMode("write");
  }, [uploadedDocument.data?.extractedText]);
  if (challenge.submitted)
    return (
      <>
        <Card className="border-emerald-300 bg-emerald-50/50">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                  <Trophy className="h-4 w-4" />
                  Challenge completed
                </p>
                <CardTitle className="mt-2 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  {challenge.title}
                </CardTitle>
                <CardDescription>
                  Completed for this {challenge.cadence.toLowerCase()} cycle.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEntryOpen(true)}
              >
                View entry
              </Button>
            </div>
          </CardHeader>
        </Card>
        <Dialog
          open={entryOpen}
          onClose={() => setEntryOpen(false)}
          title={completedEntry.data?.title ?? challenge.title}
          className="max-w-3xl"
        >
          <p className="mb-4 text-sm text-muted-foreground">
            Completed{" "}
            {completedEntry.data?.submittedAt
              ? new Date(completedEntry.data.submittedAt).toLocaleString()
              : ""}
          </p>
          {completedEntry.isLoading && (
            <p className="text-sm text-muted-foreground">Loading your entry…</p>
          )}
          {completedEntry.isError && (
            <ErrorState message={getApiErrorMessage(completedEntry.error)} />
          )}
          {completedEntry.data && (
            <article
              className="prose max-w-none break-words"
              dangerouslySetInnerHTML={{ __html: completedEntry.data.content }}
            />
          )}
        </Dialog>
      </>
    );
  return (
    <Card className="overflow-hidden">
      <CardHeader className={`border-b ${pathStyle}`}>
        <p className="eyebrow">
          {challenge.themePath.toLowerCase().replaceAll("_", " ")} ·{" "}
          {challenge.category.toLowerCase()}
        </p>
        <CardTitle className="text-2xl">{challenge.title}</CardTitle>
        <CardDescription className="max-w-2xl text-base leading-6">
          {challenge.prompt}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 p-5 sm:p-6">
        <div
          className="flex gap-5 border-b"
          aria-label="Challenge response method"
        >
          <button
            type="button"
            onClick={() => setMode("write")}
            className={`flex min-h-11 items-center gap-2 border-b-2 text-sm font-medium ${mode === "write" ? "border-secondary text-secondary" : "border-transparent text-muted-foreground"}`}
          >
            <PenLine className="h-4 w-4" />
            Write
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex min-h-11 items-center gap-2 border-b-2 text-sm font-medium ${mode === "upload" ? "border-secondary text-secondary" : "border-transparent text-muted-foreground"}`}
          >
            <FileUp className="h-4 w-4" />
            Upload file
          </button>
        </div>
        {mode === "upload" ? (
          <div className="space-y-3">
            <DocumentUpload
              onSuccess={(document) => setDocumentId(document.document.id)}
            />
            {documentId &&
              (uploadedDocument.isLoading ||
                uploadedDocument.data?.status === "UPLOADED" ||
                uploadedDocument.data?.status === "PROCESSING") && (
                <p
                  role="status"
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Extracting your file and adding it to the editor…
                </p>
              )}
            {uploadedDocument.isError && (
              <ErrorState
                message={getApiErrorMessage(uploadedDocument.error)}
              />
            )}
            {uploadedDocument.data?.status === "FAILED" && (
              <ErrorState message="We could not extract text from that file. Try another file or write your response instead." />
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">
                Use the same formatting tools as the composition writer.
              </span>
              <span
                className={
                  meetsMinimum
                    ? "font-medium text-secondary"
                    : "text-muted-foreground"
                }
              >
                {units} / {challenge.minResponseUnits}–
                {challenge.maxResponseUnits} {unit}
              </span>
            </div>
            <RichTextEditor value={content} onChange={setContent} />
            <p className="text-sm text-muted-foreground">
              Your response is saved with this challenge only. It is not
              automatically sent to the composition-assessment agents.
            </p>
            {submit.isError && (
              <ErrorState message={getApiErrorMessage(submit.error)} />
            )}
            <Button
              disabled={
                !meetsMinimum ||
                units > challenge.maxResponseUnits ||
                submit.isPending
              }
              onClick={() =>
                submit.mutate({ challengeId: challenge.id, content })
              }
            >
              <Send className="h-4 w-4" />
              {submit.isPending ? "Completing…" : "Complete challenge"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
