"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "@/lib/api/client";
import { useAuth } from "@/context/AuthContext";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import type { RegisterRequest } from "@/types/auth";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const { t } = useTranslation("auth");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    preferredLanguage: "ENGLISH",
    difficultyLevel: "INTERMEDIATE",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<unknown>(null);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);
    try {
      await signUp({
        username: form.username,
        email: form.email,
        password: form.password,
        preferredLanguage: form.preferredLanguage as RegisterRequest["preferredLanguage"],
        difficultyLevel: form.difficultyLevel as RegisterRequest["difficultyLevel"],
      });
    } catch (err) {
      setError(err);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("createAccount")}</CardTitle>
        <CardDescription>{t("registerSubtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error ? <ErrorState message={getApiErrorMessage(error)} /> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="username">{t("username")}</Label>
              <Input
                id="username"
                autoComplete="username"
                value={form.username}
                onChange={(e) => update("username", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? t("hidePassword") : t("showPassword")}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">{t("preferredLanguage")}</Label>
              <Select
                id="language"
                value={form.preferredLanguage}
                onChange={(e) => update("preferredLanguage", e.target.value)}
              >
                <option value="ENGLISH">{t("english")}</option>
                <option value="CHINESE">{t("chinese")}</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">{t("difficultyLevel")}</Label>
              <Select
                id="difficulty"
                value={form.difficultyLevel}
                onChange={(e) => update("difficultyLevel", e.target.value)}
              >
                <option value="BEGINNER">{t("common:beginner", { defaultValue: "Beginner" })}</option>
                <option value="INTERMEDIATE">{t("common:intermediate", { defaultValue: "Intermediate" })}</option>
                <option value="ADVANCED">{t("common:advanced", { defaultValue: "Advanced" })}</option>
              </Select>
            </div>
          </div>

          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {t("signUp")}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("haveAccount")}{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            {t("logIn")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

  const { signUp } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    preferredLanguage: "ENGLISH",
    difficultyLevel: "INTERMEDIATE",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<unknown>(null);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);
    try {
      await signUp({
        username: form.username,
        email: form.email,
        password: form.password,
        preferredLanguage: form.preferredLanguage as RegisterRequest["preferredLanguage"],
        difficultyLevel: form.difficultyLevel as RegisterRequest["difficultyLevel"],
      });
    } catch (err) {
      setError(err);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Start your language-learning journey today.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error ? <ErrorState message={getApiErrorMessage(error)} /> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                autoComplete="username"
                value={form.username}
                onChange={(e) => update("username", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Preferred language</Label>
              <Select
                id="language"
                value={form.preferredLanguage}
                onChange={(e) => update("preferredLanguage", e.target.value)}
              >
                <option value="ENGLISH">English</option>
                <option value="CHINESE">Chinese</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                id="difficulty"
                value={form.difficultyLevel}
                onChange={(e) => update("difficultyLevel", e.target.value)}
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </Select>
            </div>
          </div>

          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
