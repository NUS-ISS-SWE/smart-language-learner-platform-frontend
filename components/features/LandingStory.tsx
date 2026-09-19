"use client";
import { ArrowRight, MessageSquareText, PenLine, Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function LandingStory() {
  const { t } = useTranslation("visual");
  return (
    <section
      aria-labelledby="revision-story"
      className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mb-10 grid gap-4 md:grid-cols-2 md:items-end">
        <h2
          id="revision-story"
          className="font-editorial max-w-xl text-4xl leading-tight text-primary sm:text-5xl"
        >
          {t("storyTitle")}
        </h2>
        <p className="max-w-md text-base leading-7 text-muted-foreground md:justify-self-end">
          {t("storyIntro")}
        </p>
      </div>
      <div className="grid overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[1fr_0.85fr_1.15fr]">
        <article className="p-6 sm:p-8">
          <PenLine
            className="mb-8 h-6 w-6 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="eyebrow text-muted-foreground">{t("original")}</p>
          <p className="font-editorial mt-5 text-2xl leading-relaxed text-primary">
            {t("originalText")}
          </p>
        </article>
        <article className="border-y border-border bg-[#f4eddf] p-6 sm:p-8 lg:border-x lg:border-y-0">
          <MessageSquareText
            className="mb-8 h-6 w-6 text-[#75603c]"
            aria-hidden="true"
          />
          <p className="eyebrow text-[#75603c]">{t("guidance")}</p>
          <p className="mt-5 text-lg leading-8 text-primary">
            {t("guidanceText")}
          </p>
          <ArrowRight
            className="mt-6 h-5 w-5 text-[#75603c]"
            aria-hidden="true"
          />
        </article>
        <article className="bg-soft-teal p-6 sm:p-8">
          <Sparkles
            className="mb-8 h-6 w-6 text-secondary"
            aria-hidden="true"
          />
          <p className="eyebrow text-secondary">{t("revision")}</p>
          <p className="font-editorial mt-5 text-2xl leading-relaxed text-primary">
            {t("revisionText")}
          </p>
        </article>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{t("exampleNote")}</p>
    </section>
  );
}
