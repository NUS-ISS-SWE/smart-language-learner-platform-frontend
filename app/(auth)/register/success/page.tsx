"use client";
import { useTranslation } from "@/lib/i18n/useTranslation";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/Card";

export default function RegisterSuccessPage() {
  const { t } = useTranslation("visual");
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
          <MailCheck className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-primary">
          {t("accountCreated")}
        </h1>
        <CardDescription>{t("accountCreatedHint")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 text-center">
        <p className="rounded-lg border bg-muted p-4 text-sm text-muted-foreground">
          {t("activationHint")}
        </p>
        <Button asChild className="w-full">
          <Link href="/login">{t("backLogin")}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
