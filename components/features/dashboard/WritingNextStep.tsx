"use client";
import Link from "next/link";
import { ArrowUpRight, MessageSquareText, PenLine } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { Composition } from "@/types/composition";

export function WritingNextStep({
  compositions,
}: {
  compositions: Composition[];
}) {
  const { t } = useTranslation("visual");
  const reviewed = compositions
    .filter((item) => item.compositionStatus === "REVIEWED")
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0];
  return (
    <aside className="flex h-full flex-col justify-between rounded-2xl border border-[#e2d8c4] bg-[#f4eddf] p-6 sm:p-8">
      <div>
        <div className="mb-6 flex items-center justify-between text-[#75603c]">
          <p className="eyebrow">
            {t(reviewed ? "feedbackLabel" : "practiceLabel")}
          </p>
          {reviewed ? (
            <MessageSquareText aria-hidden="true" className="h-5 w-5" />
          ) : (
            <PenLine aria-hidden="true" className="h-5 w-5" />
          )}
        </div>
        <h2 className="text-2xl font-semibold leading-tight tracking-tight text-primary sm:text-3xl">
          {t(reviewed ? "feedbackTitle" : "practiceTitle")}
        </h2>
        <p className="mt-4 text-sm leading-6 text-[#66583f]">
          {t(reviewed ? "feedbackHint" : "practiceHint")}
        </p>
      </div>
      {reviewed && (
        <Link
          href={`/compositions/${reviewed.id}`}
          className="mt-6 flex min-h-11 items-center justify-between gap-3 border-t border-[#d7c9ac] pt-4 text-sm font-semibold text-primary"
        >
          <span>
            <span className="block">{t("openFeedback")}</span>
            <span className="mt-1 line-clamp-2 font-normal">
              {reviewed.title}
            </span>
          </span>
          <ArrowUpRight className="h-5 w-5 shrink-0" />
        </Link>
      )}
    </aside>
  );
}
