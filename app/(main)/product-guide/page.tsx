"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ProductGuideChat } from "@/components/features/product-guide/ProductGuideChat";
import { useAuth } from "@/context/AuthContext";

export default function ProductGuidePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useTranslation("productGuide");

  useEffect(() => {
    if (user?.role === "ADMIN") router.replace("/dashboard");
  }, [router, user]);

  if (user?.role === "ADMIN") return null;

  return (
    <div className="flex h-[calc(100dvh-10.125rem)] min-h-0 flex-col gap-4 lg:h-[calc(100dvh-7rem)]">
      <header className="shrink-0">
        <p className="text-sm font-medium text-primary">{t("eyebrow")}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">{t("title")}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {t("description")}
        </p>
      </header>
      <ProductGuideChat />
    </div>
  );
}
