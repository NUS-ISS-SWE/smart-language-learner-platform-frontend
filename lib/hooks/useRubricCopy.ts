"use client";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { formatRubricLabel } from "@/lib/rubric-utils";

export function useRubricCopy() {
  const translation = useTranslation("rubrics");
  return {
    ...translation,
    label: (value: string) =>
      translation.t(`labels.${value}`, {
        defaultValue: formatRubricLabel(value),
      }),
  };
}
