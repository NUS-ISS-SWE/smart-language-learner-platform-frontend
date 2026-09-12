"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  CompositionSession,
  hasCompositionText,
} from "@/lib/composition-session";
import {
  createComposition,
  updateComposition,
  requestCompositionGrading,
  generateComposition,
} from "@/lib/api/composition";
import { compositionKeys } from "./useCompositions";
import { AUTOSAVE_STORAGE_KEY } from "@/lib/constants";
import type { Composition } from "@/types/composition";

export function useCompositionSession(initial: Composition | null) {
  const queryClient = useQueryClient();
  const [session] = useState(
    () =>
      new CompositionSession(
        initial,
        {
          create: createComposition,
          update: updateComposition,
          review: requestCompositionGrading,
          generate: generateComposition,
        },
        (record) => {
          queryClient.setQueryData(compositionKeys.detail(record.id), record);
          void queryClient.invalidateQueries({
            queryKey: compositionKeys.lists(),
          });
        },
      ),
  );
  const state = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
    session.getSnapshot,
  );
  useEffect(() => {
    session.setActive(true);
    return () => session.setActive(false);
  }, [session]);
  const [autosave, setAutosave] = useState(true);
  const [preferenceLoaded, setPreferenceLoaded] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setAutosave(localStorage.getItem(AUTOSAVE_STORAGE_KEY) !== "false");
      } catch {
        /* Default remains usable. */
      }
      setPreferenceLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (
      !preferenceLoaded ||
      !autosave ||
      !state.dirty ||
      state.locked ||
      state.phase === "error" ||
      state.phase === "saving" ||
      state.uncertainOperation
    )
      return;
    if (!state.draft.title.trim() || !hasCompositionText(state.draft.content))
      return;
    const timer = window.setTimeout(() => {
      if (!session.getSnapshot().locked)
        void session.save(false).catch(() => {});
    }, 2000);
    return () => clearTimeout(timer);
  }, [session, state, autosave, preferenceLoaded]);
  function toggleAutosave(enabled: boolean) {
    setAutosave(enabled);
    try {
      localStorage.setItem(AUTOSAVE_STORAGE_KEY, String(enabled));
    } catch {
      /* Saving itself does not require local storage. */
    }
  }
  return { session, state, autosave, toggleAutosave };
}
