"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getApiErrorMessage } from "@/lib/api/client";
import { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Label } from "@/components/ui/Label";

export default function LoginPage() {
  const { signIn } = useAuth();
  const { t: visual } = useTranslation("visual");
  const { t } = useTranslation("auth");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<unknown>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;
    setError(null);
    setIsPending(true);
    try {
      await signIn({ username, password });
    } catch (err) {
      setError(err);
    } finally {
      setIsPending(false);
    }
  }

  function errorMessage(): string {
    if (error instanceof AxiosError && error.response?.status === 401) {
      return visual("loginError");
    }
    return getApiErrorMessage(error);
  }

  return (
    <Card>
      <CardHeader>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-primary">
          {t("welcomeBack")}
        </h1>
        <CardDescription>{t("loginSubtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error ? <ErrorState message={errorMessage()} /> : null}

          <div className="space-y-2">
            <Label htmlFor="username">{t("username")}</Label>
            <Input
              id="username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t("password")}</Label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                {t("forgotPassword")}
              </Link>
            </div>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {t("logIn")}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("newToPlatform")}{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            {t("createAccount")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
