"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  FileText,
  Lightbulb,
  PenLine,
  Sparkles,
  MessageSquareText,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { APP_NAME } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import { LandingStory } from "@/components/features/LandingStory";

const workflowIcons = [PenLine, MessageSquareText, Sparkles] as const;

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation("home");
  const primaryHref = isAuthenticated ? "/compositions/new" : "/register";
  const secondaryHref = isAuthenticated ? "/compositions" : "/login";
  const workflow = [
    {
      title: t("workflowWriteTitle"),
      description: t("workflowWriteDescription"),
    },
    {
      title: t("workflowReviewTitle"),
      description: t("workflowReviewDescription"),
    },
    {
      title: t("workflowReviseTitle"),
      description: t("workflowReviseDescription"),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a href="#main-content" className="skip-link">
        {t("skipToContent")}
      </a>

      <header className="sticky top-0 z-30 border-b border-border/90 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            aria-label={APP_NAME}
            className="flex min-h-11 min-w-11 items-center gap-3 rounded-md"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <BookOpenCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="hidden truncate text-sm font-semibold tracking-tight text-primary sm:inline sm:text-base">
              {APP_NAME}
            </span>
          </Link>
          <nav
            aria-label={t("primaryNavigation")}
            className="flex shrink-0 items-center gap-1.5 sm:gap-2"
          >
            <LanguageSwitcher />
            {isAuthenticated ? (
              <Button size="sm" asChild>
                <Link href="/dashboard">
                  <span className="hidden sm:inline">{t("dashboard")}</span>
                  <span className="sm:hidden">{t("workspace")}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : (
              <>
                <Button size="sm" variant="ghost" asChild>
                  <Link href="/login">{t("logIn")}</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">{t("signUp")}</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="scroll-mt-20">
        <section className="border-b border-border bg-[#f1eee6]">
          <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:gap-12 lg:px-8 lg:py-20">
            <div className="max-w-[35rem]">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary sm:text-sm">
                {t("categoryLabel")}
              </p>
              <h1 className="font-editorial mt-5 text-balance text-5xl leading-[1.05] tracking-[-0.045em] text-primary sm:text-6xl xl:text-7xl">
                {t("platformTitle")}
              </h1>
              <p className="mt-6 max-w-[32rem] text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                {t("platformDescription")}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button size="lg" asChild>
                  <Link href={primaryHref}>
                    {isAuthenticated ? t("startWriting") : t("createAccount")}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" asChild>
                  <Link href={secondaryHref}>
                    {isAuthenticated ? t("openLibrary") : t("logIn")}
                  </Link>
                </Button>
              </div>
            </div>

            <article
              className="overflow-hidden rounded-2xl border border-[#d4d9d0] bg-card shadow-[0_24px_60px_-35px_#142b3d66] lg:rotate-1"
              aria-labelledby="writing-example-title"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-[#fbfdfd] px-5 py-3 sm:px-7">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {t("writingExampleLabel")}
                </p>
                <span className="flex items-center gap-1.5 text-xs font-medium text-secondary">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  {t("draftLabel")}
                </span>
              </div>
              <div className="grid xl:grid-cols-[minmax(0,1.2fr)_minmax(13rem,0.8fr)]">
                <section className="p-6 sm:p-7">
                  <h2
                    id="writing-example-title"
                    className="font-editorial text-2xl tracking-[-0.02em] text-primary"
                  >
                    {t("writingExampleTitle")}
                  </h2>
                  <div className="mt-6 space-y-4 text-[1rem] leading-7 text-foreground sm:text-[1.0625rem] sm:leading-8">
                    <p>{t("writingExampleFirstParagraph")}</p>
                    <p>{t("writingExampleSecondParagraph")}</p>
                  </div>
                </section>
                <aside
                  className="border-t border-border bg-[#eef8f6] p-6 sm:p-7 xl:border-l xl:border-t-0"
                  aria-label={t("feedbackExampleLabel")}
                >
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-secondary shadow-sm">
                    <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
                    {t("feedbackExampleLabel")}
                  </span>
                  <h3 className="mt-5 text-sm font-semibold text-primary">
                    {t("feedbackExampleCriterion")}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-foreground">
                    {t("feedbackExampleRecommendation")}
                  </p>
                  <p className="mt-5 border-l-2 border-secondary pl-3 text-xs leading-5 text-muted-foreground">
                    {t("feedbackExampleEvidence")}
                  </p>
                </aside>
              </div>
            </article>
          </div>
        </section>

        <LandingStory />

        <section
          className="mx-auto max-w-[1280px] rounded-2xl bg-primary px-6 py-12 text-white sm:px-10 lg:py-16"
          aria-labelledby="workflow-title"
        >
          <div className="max-w-[38rem]">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent sm:text-sm">
              {t("platformWorkflowLabel")}
            </p>
            <h2
              id="workflow-title"
              className="font-editorial mt-3 text-3xl tracking-[-0.03em] text-white sm:text-4xl"
            >
              {t("builtForWriting")}
            </h2>
          </div>
          <ol className="mt-10 grid gap-8 border-t border-white/20 pt-8 md:grid-cols-3">
            {workflow.map((step, index) => {
              const Icon = workflowIcons[index];
              return (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e7f3f0] text-secondary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-bold tracking-[0.12em] text-accent">
                      0{index + 1}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section
          className="mt-12 border-t border-border bg-card"
          aria-label={t("featuresTitleCurrent")}
        >
          <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
            {[1, 2, 3].map((number) => (
              <div key={number}>
                <h2 className="text-base font-semibold text-primary">
                  {t(`feature${number}Title`)}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t(`feature${number}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="border-y border-border bg-card">
          <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center lg:px-8">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold tracking-[-0.025em] text-primary">
                {t("ctaTitle")}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t("ctaDescription")}
              </p>
            </div>
            <Button size="lg" asChild>
              <Link href={primaryHref}>
                <FileText className="h-4 w-4" aria-hidden="true" />
                {isAuthenticated ? t("newComposition") : t("createAccount")}
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:px-6 lg:px-8">
        <span>
          © {new Date().getFullYear()} {APP_NAME}
        </span>
        <span>{t("footerPurpose")}</span>
      </footer>
    </div>
  );
}
