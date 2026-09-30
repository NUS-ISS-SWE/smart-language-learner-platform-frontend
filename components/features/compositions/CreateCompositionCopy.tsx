"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CopyPlus, Loader2 } from "lucide-react";
import { createComposition, generateComposition } from "@/lib/api/composition";
import { getApiErrorMessage } from "@/lib/api/client";
import { isUncertainMutationError } from "@/lib/api/mutation-outcome";
import { refreshCompositionCache } from "@/lib/hooks/useCompositions";
import {
  applySuggestionReplacements,
  type SuggestionReplacement,
} from "@/lib/suggestion-revision";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/shared/ErrorState";
import type { Composition } from "@/types/composition";

/** Both operations create independent records and need the same uncertain-POST recovery. */
export function CreateCompositionCopy({
  composition,
  kind = "revision",
  replacements,
  buttonText,
}: {
  composition: Composition;
  kind?: "revision" | "generation";
  replacements?: SuggestionReplacement[];
  buttonText?: string;
}) {
  const { t } = useTranslation("feedback");
  const router = useRouter();
  const cache = useQueryClient();
  const busy = useRef(false);
  const active = useRef(true);
  const [uncertain, setUncertain] = useState(false);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  const mutation = useMutation({
    mutationFn: () =>
      kind === "revision"
        ? createComposition({
            title: t("revisionTitle", { title: composition.title }),
            content: replacements?.length
              ? applySuggestionReplacements(composition.content ?? "", replacements)
              : composition.content ?? "",
          })
        : generateComposition({ title: composition.title }),
    onSuccess: (record) => refreshCompositionCache(cache, record),
  });
  async function create(acknowledged = false) {
    if (busy.current || (uncertain && !acknowledged)) return;
    busy.current = true;
    setUncertain(false);
    try {
      const record = await mutation.mutateAsync();
      if (active.current)
        router.push(
          `/compositions/${record.id}${kind === "revision" ? "/edit" : ""}`,
        );
    } catch (error) {
      if (active.current) setUncertain(isUncertainMutationError(error));
    } finally {
      busy.current = false;
    }
  }
  return (
    <div className="space-y-3">
      <Button
        onClick={() => void create()}
        disabled={mutation.isPending || mutation.isSuccess || uncertain}
      >
        {mutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CopyPlus className="h-4 w-4" />
        )}
        {mutation.isPending
          ? t("creating")
          : buttonText ??
            t(kind === "revision" ? "createRevision" : "generateAgain")}
      </Button>
      {mutation.isError && (
        <div className="max-w-lg space-y-3">
          <ErrorState
            message={
              uncertain
                ? t("uncertainCopy")
                : getApiErrorMessage(mutation.error)
            }
          />
          {uncertain && (
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
              <Button variant="outline" onClick={() => void create(true)}>
                {t("checkedLibrary")}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
