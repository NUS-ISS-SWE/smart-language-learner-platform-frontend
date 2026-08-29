"use client";

import { useEffect, useRef, useState } from "react";
import { updateComposition } from "@/lib/api/composition";
import type { CompositionDraft } from "@/types/composition";

export type AutosaveStatus = "idle" | "saving" | "saved" | "error";

export function useAutosave(
  compositionId: string | undefined,
  draft: CompositionDraft,
  enabled: boolean,
) {
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | undefined>();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled || !compositionId) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      setAutosaveStatus("saving");
      try {
        await updateComposition(Number(compositionId), { title: draft.title, content: draft.content });
        setAutosaveStatus("saved");
        setLastSavedAt(new Date());
      } catch {
        setAutosaveStatus("error");
      }
    }, 2000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [draft, enabled, compositionId]);

  return { autosaveStatus, lastSavedAt };
}
