"use client";

import { useId, useState } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { useModerateComposition } from "@/lib/hooks/useAdminContent";
import type { ModerationReasonCategory, ModerationStatus } from "@/types/composition";
import { moderationReasonOptions } from "@/lib/moderation";
import { getApiErrorMessage } from "@/lib/api/client";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { ErrorState } from "@/components/shared/ErrorState";

export function CompositionModerationControls({
  compositionId,
  status = "ACTIVE",
}: {
  readonly compositionId: number;
  readonly status?: ModerationStatus;
}) {
  const mutation = useModerateComposition();
  const [open, setOpen] = useState(false);
  const [reasonCategory, setReasonCategory] = useState<ModerationReasonCategory | "">("");
  const [reasonNote, setReasonNote] = useState("");
  const reasonId = useId();
  const noteId = useId();
  const removed = status === "REMOVED";

  function close() {
    if (!mutation.isPending) setOpen(false);
  }

  function submit() {
    if (!removed && !reasonCategory) return;
    mutation.mutate(
      removed
        ? { id: compositionId, body: { action: "RESTORE" } }
        : {
            id: compositionId,
            body: {
              action: "REMOVE",
              reasonCategory: reasonCategory as ModerationReasonCategory,
              ...(reasonNote.trim() ? { reasonNote: reasonNote.trim() } : {}),
            },
          },
      {
        onSuccess: () => {
          setReasonCategory("");
          setReasonNote("");
          setOpen(false);
        },
      },
    );
  }

  return (
    <>
      <Button
        variant={removed ? "outline" : "destructive"}
        onClick={() => {
          mutation.reset();
          setOpen(true);
        }}
      >
        {removed ? (
          <RotateCcw className="h-4 w-4" />
        ) : (
          <AlertTriangle className="h-4 w-4" />
        )}
        {removed ? "Restore composition" : "Remove composition"}
      </Button>
      <Dialog
        open={open}
        onClose={close}
        title={removed ? "Restore composition" : "Remove composition"}
      >
        <p className="leading-7 text-muted-foreground">
          {removed
            ? "Restore this composition so the learner can access, edit, and request review again."
            : "The learner will no longer be able to read, edit, or request review for this composition."}
        </p>
        {!removed && (
          <div className="mt-5 space-y-4">
            <label htmlFor={reasonId} className="block space-y-2 text-sm font-medium">
              Removal reason
              <Select
                id={reasonId}
                value={reasonCategory}
                onChange={(event) =>
                  setReasonCategory(
                    event.target.value as ModerationReasonCategory | "",
                  )
                }
              >
                <option value="">Select a reason</option>
                {moderationReasonOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </label>
            <label htmlFor={noteId} className="block space-y-2 text-sm font-medium">
              Note for learner{" "}
              <span className="font-normal text-muted-foreground">(optional)</span>
              <Textarea
                id={noteId}
                value={reasonNote}
                maxLength={500}
                onChange={(event) => setReasonNote(event.target.value)}
              />
            </label>
          </div>
        )}
        {mutation.isError && (
          <ErrorState
            className="mt-4"
            message={getApiErrorMessage(mutation.error)}
          />
        )}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" disabled={mutation.isPending} onClick={close}>
            Cancel
          </Button>
          <Button
            variant={removed ? "default" : "destructive"}
            disabled={mutation.isPending || (!removed && !reasonCategory)}
            onClick={submit}
          >
            {mutation.isPending ? "Saving…" : removed ? "Restore" : "Remove"}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
