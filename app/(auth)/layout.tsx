"use client";
import Link from "next/link";
import {
  BookOpenCheck,
  PenLine,
  MessageSquareText,
  Sparkles,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { APP_NAME } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation("visual");
  const { t: home } = useTranslation("home");
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex min-h-16 max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-8">
          <Link
            href="/"
            aria-label={APP_NAME}
            className="flex min-h-11 min-w-0 items-center gap-3"
          >
            <span className="rounded-lg bg-primary p-2 text-white">
              <BookOpenCheck className="h-5 w-5" />
            </span>
            <span className="hidden text-sm font-semibold sm:inline">
              {APP_NAME}
            </span>
          </Link>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1280px] items-center gap-10 px-4 py-8 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:py-14">
        <aside className="hidden self-stretch rounded-2xl bg-primary p-10 text-white lg:flex lg:flex-col lg:justify-center xl:p-14">
          <p className="eyebrow text-accent">{t("accountEyebrow")}</p>
          <h2 className="font-editorial mt-6 text-5xl leading-[1.1] xl:text-6xl">
            {t("accountTitle")}
          </h2>
          <p className="mt-6 max-w-sm text-base leading-8 text-slate-300">
            {t("accountHint")}
          </p>
          <ol className="mt-12 space-y-5 border-t border-white/20 pt-8">
            {[
              { icon: PenLine, key: "workflowWriteTitle" },
              { icon: MessageSquareText, key: "workflowReviewTitle" },
              { icon: Sparkles, key: "workflowReviseTitle" },
            ].map(({ icon: Icon, key }, i) => (
              <li key={key} className="flex items-center gap-4">
                <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                <span className="text-sm">
                  <span className="mr-3 text-slate-400">0{i + 1}</span>
                  {home(key)}
                </span>
              </li>
            ))}
          </ol>
        </aside>
        <div className="account-form mx-auto w-full max-w-[460px]">
          {children}
        </div>
      </main>
    </div>
  );
}
