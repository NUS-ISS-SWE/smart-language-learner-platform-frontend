"use client";
import { LoadingState } from "@/components/shared/LoadingState";
import { useTranslation } from "@/lib/i18n/useTranslation";
export default function Loading() {
  const { t } = useTranslation("visual");
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <LoadingState label={t("loading")} />
    </div>
  );
}
