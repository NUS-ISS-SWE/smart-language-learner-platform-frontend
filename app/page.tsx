"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const { t } = useTranslation("home");

  const features = [
    {
      icon: "📚",
      titleKey: "structuredCourses",
      descKey: "structuredCoursesDesc",
    },
    {
      icon: "🔤",
      titleKey: "vocabularyBuilder",
      descKey: "vocabularyBuilderDesc",
    },
    {
      icon: "📊",
      titleKey: "progressTracking",
      descKey: "progressTrackingDesc",
    },
    {
      icon: "🤖",
      titleKey: "aiPoweredHints",
      descKey: "aiPoweredHintsDesc",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-indigo-50 to-white">
        <span className="text-6xl mb-6">🌐</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight max-w-3xl">
          {t("heroTitle")}{" "}
          <span className="text-indigo-600">{t("heroSubtitle")}</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-xl">
          {t("heroDescription")}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg">{t("startFree")}</Button>
          </Link>
          <Link href="/courses">
            <Button variant="outline" size="lg">{t("browseCourses")}</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
            {t("featuresTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.titleKey}
                className="rounded-xl border border-gray-100 bg-gray-50 p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{t(f.titleKey)}</h3>
                <p className="text-sm text-gray-500">{t(f.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-400">
        {t("footer", { year: new Date().getFullYear() })}
      </footer>
    </div>
  );
}
