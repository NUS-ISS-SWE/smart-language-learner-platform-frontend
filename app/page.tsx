"use client";

import Link from "next/link";
import { ArrowRight, BookOpenCheck, FileText, LineChart, PenLine, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { APP_NAME } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation("home");

  const features = [
    { title: t("feature1Title"), description: t("feature1Desc"), icon: PenLine },
    { title: t("feature2Title"), description: t("feature2Desc"), icon: Sparkles },
    { title: t("feature3Title"), description: t("feature3Desc"), icon: LineChart },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-2 text-primary-foreground">
              <BookOpenCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="text-sm font-semibold sm:text-base">{APP_NAME}</span>
          </Link>

          <nav className="flex items-center gap-2">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <Button asChild>
                <Link href="/dashboard">
                  {t("dashboard")}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">{t("logIn")}</Link>
                </Button>
                <Button variant="accent" asChild>
                  <Link href="/register">{t("signUp")}</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <section className="border-b bg-[linear-gradient(180deg,#ffffff_0%,#f8f9ff_100%)]">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)] lg:px-8">
          <div>
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
                {t("categoryLabel")}
              </p>
              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-normal text-balance sm:text-5xl">
                {t("platformTitle")}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                {t("platformDescription")}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" variant="accent" asChild>
                  <Link href={isAuthenticated ? "/dashboard" : "/register"}>
                    {t("startWriting")}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href={isAuthenticated ? "/compositions" : "/login"}>{t("openWorkspace")}</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="rounded-xl border bg-white p-8 shadow-sm">
              <div className="space-y-4">
                <div className="h-6 w-3/4 rounded bg-primary/10" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-5/6 rounded bg-muted" />
                <div className="h-4 w-4/6 rounded bg-muted" />
                <div className="mt-6 flex items-center gap-2">
                  <div className="h-6 w-20 rounded-full bg-emerald-100" />
                  <div className="h-4 w-24 rounded bg-muted" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">{t("platformWorkflowLabel")}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-normal">{t("builtForWriting")}</h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-lg border bg-white p-6">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-[#d3e4fe] text-primary">
                <feature.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <h2 className="text-2xl font-bold tracking-normal">{t("ctaTitle")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("ctaDescription")}</p>
          </div>
          <Button variant="accent" asChild>
            <Link href={isAuthenticated ? "/compositions/new" : "/register"}>
              <FileText className="h-4 w-4" aria-hidden="true" />
              {t("newComposition")}
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

            <Link href={isAuthenticated ? "/compositions/new" : "/register"}>
              <FileText className="h-4 w-4" aria-hidden="true" />
              {t("newComposition")}
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

