"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { type FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { forgotPassword } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/client";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export default function ForgotPasswordPage() {
  const { t } = useTranslation("visual");
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    mutationFn: forgotPassword,
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mutation.isPending) mutation.mutate({ email });
  }

  return (
    <Card>
      <CardHeader>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-primary">
          {t("resetTitle")}
        </h1>
        <CardDescription>{t("resetHint")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {mutation.isError ? (
            <ErrorState message={getApiErrorMessage(mutation.error)} />
          ) : null}

          {mutation.isSuccess ? (
            <div
              role="status"
              className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
            >
              {t("resetSent")}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <Button
            className="w-full"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            {t("sendReset")}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            {t("backLogin")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
