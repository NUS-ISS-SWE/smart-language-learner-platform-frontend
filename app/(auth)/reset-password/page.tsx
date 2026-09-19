"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { LoadingState } from "@/components/shared/LoadingState";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { confirmPasswordReset } from "@/lib/api/auth";
import { setStoredAccessToken } from "@/lib/auth-storage";
import { getApiErrorMessage } from "@/lib/api/client";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/Card";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Label } from "@/components/ui/Label";

function decodeJwtSubject(jwt: string): string {
  try {
    const payload = JSON.parse(
      atob(jwt.split(".")[1].replaceAll("-", "+").replaceAll("_", "/")),
    );
    return (payload.sub as string) ?? "";
  } catch {
    return "";
  }
}

function InvalidLinkCard() {
  const { t } = useTranslation("visual");
  return (
    <Card>
      <CardHeader>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-primary">
          {t("invalidLink")}
        </h1>
        <CardDescription>{t("invalidLinkHint")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-primary hover:underline"
        >
          {t("requestLink")}
        </Link>
      </CardContent>
    </Card>
  );
}

function ResetPasswordContent() {
  const { t } = useTranslation("visual");
  const token = useSearchParams().get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: confirmPasswordReset,
    onSuccess: (data) => {
      const username = decodeJwtSubject(data.accessToken);
      setStoredAccessToken(data.accessToken);
      window.localStorage.setItem(
        "sllp.user",
        JSON.stringify({ username, role: data.role }),
      );
      window.location.href = "/dashboard";
    },
  });

  if (!token) return <InvalidLinkCard />;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mutation.isPending) return;
    setValidationError(null);
    if (newPassword !== confirmPassword) {
      setValidationError(t("mismatch"));
      return;
    }
    mutation.mutate({ token, newPassword });
  }

  return (
    <Card>
      <CardHeader>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-primary">
          {t("resetTitle")}
        </h1>
        <CardDescription>{t("choosePassword")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {(mutation.isError || validationError) && (
            <ErrorState
              message={validationError ?? getApiErrorMessage(mutation.error)}
            />
          )}

          <div className="space-y-2">
            <Label htmlFor="newPassword">{t("newPassword")}</Label>
            <PasswordInput
              id="newPassword"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <Button
            className="w-full"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("setPassword")}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
