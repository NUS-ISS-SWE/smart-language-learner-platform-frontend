"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { getComposition } from "@/lib/api/composition";
import { isUncertainMutationError } from "@/lib/api/mutation-outcome";
import {
  compositionId,
  compositionKeys,
  useCreateComposition,
} from "./useCompositions";
import {
  readDocumentAssociation,
  saveDocumentAssociation,
} from "@/lib/document-associations";
import { plainTextToCompositionHtml } from "@/lib/composition-content";
import type { DocumentDTO } from "@/types/document";

export function useDocumentEvaluation(
  document: DocumentDTO,
  text: string,
  ready: boolean,
  automatic: boolean,
) {
  const router = useRouter();
  const [title, setTitle] = useState(
    () => document.filename.replace(/\.[^.]+$/, "") || document.filename,
  );
  const [association, setAssociation] = useState(() =>
    readDocumentAssociation(document.id),
  );
  const linkedId = association.compositionId
    ? compositionId(association.compositionId)
    : NaN;
  const linked = useQuery({
    queryKey: Number.isFinite(linkedId)
      ? compositionKeys.detail(linkedId)
      : [...compositionKeys.all, "no-document-link", document.id],
    queryFn: () => getComposition(linkedId),
    enabled: Number.isFinite(linkedId),
    refetchOnMount: "always",
    retry: 0,
  });
  const missing =
    !!association.compositionId &&
    (!Number.isFinite(linkedId) ||
      (isAxiosError(linked.error) && linked.error.response?.status === 404) ||
      (!!linked.data && linked.data.sourceDocumentId !== document.id));
  const mutation = useCreateComposition();
  const busy = useRef(false);
  const automaticAttempted = useRef(false);
  const active = useRef(true);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);

  async function create(acknowledged = false, replaceMissing = false) {
    if (
      busy.current ||
      !ready ||
      !text.trim() ||
      !title.trim() ||
      (association.pending && !acknowledged) ||
      (association.compositionId && !(replaceMissing && missing))
    )
      return;
    busy.current = true;
    automaticAttempted.current = true;
    // A revisit after an interrupted request must not automatically issue another POST.
    saveDocumentAssociation(document.id, {
      compositionId: null,
      pending: true,
    });
    try {
      const record = await mutation.mutateAsync({
        title,
        content: plainTextToCompositionHtml(text),
        sourceDocumentId: document.id,
      });
      const saved = { compositionId: String(record.id), pending: false };
      saveDocumentAssociation(document.id, saved);
      if (active.current) {
        setAssociation(saved);
        router.replace(`/compositions/${record.id}`);
      }
    } catch (error) {
      const failed = {
        compositionId: null,
        pending: isUncertainMutationError(error),
      };
      saveDocumentAssociation(document.id, failed);
      if (active.current) setAssociation(failed);
    } finally {
      busy.current = false;
    }
  }

  useEffect(() => {
    if (!automatic || automaticAttempted.current || association.pending) return;
    if (association.compositionId) {
      if (
        linked.data &&
        linked.data.sourceDocumentId === document.id &&
        linked.isFetchedAfterMount &&
        !linked.isError
      ) {
        automaticAttempted.current = true;
        router.replace(`/compositions/${linked.data.id}`);
      }
      return;
    }
    if (ready && text.trim() && title.trim()) void create();
  });

  return { title, setTitle, association, linked, missing, mutation, create };
}
