"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getApiErrorMessage } from "@/lib/api/client";
import { useAuth } from "@/context/AuthContext";
import { useAvailablePlans } from "@/lib/hooks/useSubscription";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PlanPickerCard } from "@/components/features/subscription/PlanPickerCard";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import type { RegisterRequest } from "@/types/auth";
import type { SubscriptionPlanCode } from "@/types/subscription";

type Step = 1 | 2;

export default function RegisterPage() {
  const { signUp } = useAuth();
  const { t } = useTranslation("auth");
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    preferredLanguage: "ENGLISH",
    difficultyLevel: "INTERMEDIATE",
  });
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanCode>("FREE_TRIAL");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const { data: plans, isLoading: isPlansLoading } = useAvailablePlans();

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleStepOne(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStep(2);
  }

  async function handleSignUp(event: React.SyntheticEvent<HTMLFormElement>) {
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
        planType: selectedPlan,
      });
    } catch (err) {
      setError(err);
      setStep(1);
    } finally {
      setIsPending(false);
    }
  }

  if (step === 1) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("createAccount")}</CardTitle>
          <CardDescription>{t("registerSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleStepOne}>
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
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
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
                  <option value="BEGINNER">
                    {t("common:beginner", { defaultValue: "Beginner" })}
                  </option>
                  <option value="INTERMEDIATE">
                    {t("common:intermediate", { defaultValue: "Intermediate" })}
                  </option>
                  <option value="ADVANCED">
                    {t("common:advanced", { defaultValue: "Advanced" })}
                  </option>
                </Select>
              </div>
            </div>

            <Button className="w-full" type="submit">
              Next: Choose a plan
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

  return (
    <Card>
      <CardHeader>
        <button
          type="button"
          onClick={() => { setStep(1); setError(null); }}
          className="mb-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>
        <CardTitle>Choose your plan</CardTitle>
        <CardDescription>
          You can change this anytime from your account settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSignUp}>
          {error ? <ErrorState message={getApiErrorMessage(error)} /> : null}

          {isPlansLoading ? (
            <LoadingState />
          ) : (
            <div className="space-y-3">
              {plans?.map((plan) => (
                <PlanPickerCard
                  key={plan.code}
                  plan={plan}
                  isSelected={selectedPlan === plan.code}
                  onSelect={setSelectedPlan}
                />
              ))}
            </div>
          )}

          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {t("signUp")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
