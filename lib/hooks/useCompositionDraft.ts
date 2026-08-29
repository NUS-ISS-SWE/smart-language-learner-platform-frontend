"use client";

import { useEffect, useRef, useState } from "react";
import type { Composition, CompositionDraft } from "@/types/composition";

const emptyDraft: CompositionDraft = {
  title: "",
  content: "",
  language: "ENGLISH",
  compositionSource: "RAW_TEXT",
};

function initialDraft(composition?: Composition | null): CompositionDraft {
  if (!composition) return emptyDraft;
  return {
    title: composition.title,
    content: composition.content ?? "",
    language: composition.language,
    compositionSource: composition.compositionSource,
  };
}

export function useCompositionDraft(initialValue?: Composition | null, onDraftChange?: (draft: CompositionDraft) => void) {
  const [draft, setDraft] = useState<CompositionDraft>(() => initialDraft(initialValue));
  const callbackRef = useRef(onDraftChange);

  useEffect(() => {
    callbackRef.current = onDraftChange;
  }, [onDraftChange]);

  useEffect(() => {
    callbackRef.current?.(draft);
  }, [draft]);

  function updateDraft<Key extends keyof CompositionDraft>(key: Key, value: CompositionDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return { draft, updateDraft, setDraft };
}

export function isNewDraftDirty(draft: CompositionDraft): boolean {
  return draft.title.trim().length > 0 || draft.content.trim().length > 0;
}
