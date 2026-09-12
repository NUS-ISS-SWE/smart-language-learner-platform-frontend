"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiErrorMessage } from "@/lib/api/client";
import { DraftValidationError } from "@/lib/composition-session";
import { useCompositionSession } from "@/lib/hooks/useCompositionSession";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/Button";
import { CompositionEditorFields } from "./CompositionEditorFields";
import { CompositionEditorToolbar } from "./CompositionEditorToolbar";
import { DraftNavigationGuard } from "./DraftNavigationGuard";
import type { Composition } from "@/types/composition";

export function CompositionEditor({
  initialValue = null,
}: {
  readonly initialValue?: Composition | null;
}) {
  const { session, state, autosave, toggleAutosave } =
    useCompositionSession(initialValue);
  const router = useRouter();
  const { t } = useTranslation("editor");
  const [manualSaving, setManualSaving] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const active = useRef(true);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);

  async function save() {
    setManualSaving(true);
    try {
      await session.save();
    } catch {
      /* The session retains the error and input. */
    } finally {
      if (active.current) setManualSaving(false);
    }
  }
  async function transition(action: "review" | "generate") {
    try {
      const record = await session.transition(action);
      if (active.current) {
        setLeaving(true);
        router.push(`/compositions/${record.id}`);
      }
    } catch {
      /* The session exposes operation-specific retry and uncertainty. */
    }
  }
  const errorMessage =
    state.error instanceof DraftValidationError
      ? t(state.error.key)
      : getApiErrorMessage(state.error);
  const uncertain = state.uncertainOperation;
  return (
    <>
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
      >
        {!!state.error && (
          <div className="space-y-3">
            <ErrorState
              message={
                uncertain
                  ? t(
                      uncertain === "review"
                        ? "uncertainReview"
                        : uncertain === "generate"
                          ? "uncertainGeneration"
                          : "uncertainSave",
                    )
                  : errorMessage
              }
            />
            {uncertain === "review" && state.record ? (
              <Button variant="outline" asChild>
                <Link href={`/compositions/${state.record.id}`}>
                  {t("checkReview")}
                </Link>
              </Button>
            ) : uncertain ? (
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" asChild>
                  <a
                    href="/compositions"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("checkLibrary")}
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    session.acknowledgeUncertainCreation();
                    if (uncertain === "generate") void transition("generate");
                    else void save();
                  }}
                >
                  {t("checkedLibrary")}
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  state.errorOperation === "review" ||
                  state.errorOperation === "generate"
                    ? void transition(state.errorOperation)
                    : void save()
                }
              >
                {t("retry")}
              </Button>
            )}
          </div>
        )}
        <fieldset disabled={state.locked} className="min-w-0 space-y-4">
          <CompositionEditorToolbar
            draft={state.draft}
            onChange={(key, value) => session.update(key, value)}
            autosaveEnabled={autosave}
            onAutosaveChange={toggleAutosave}
            autosaveStatus={state.phase}
            lastSavedAt={state.lastSavedAt ?? undefined}
            showAutosaveStatus
            isDirty={state.dirty}
            onGenerate={() => void transition("generate")}
            isGenerating={state.action === "generate"}
            onSubmitForReview={() => void transition("review")}
            isSubmitting={state.action === "review"}
            isSaving={manualSaving}
          />
          <CompositionEditorFields
            draft={state.draft}
            disabled={state.locked}
            onChange={(key, value) => session.update(key, value)}
          />
        </fieldset>
        {state.record && (
          <Button variant="link" asChild className="self-start">
            <Link href={`/compositions/${state.record.id}`}>
              {t("viewDraft")}
            </Link>
          </Button>
        )}
      </form>
      <DraftNavigationGuard dirty={state.dirty && !leaving} session={session} />
    </>
  );
}
