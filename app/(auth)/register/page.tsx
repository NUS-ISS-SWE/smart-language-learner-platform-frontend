"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
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
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import type { RegisterRequest } from "@/types/auth";
import type { SubscriptionPlanCode } from "@/types/subscription";

type Step = 1 | 2;

export default function RegisterPage() {
  const { t: visual } = useTranslation("visual");
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
  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionPlanCode>("FREE_TRIAL");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const {
    data: plans,
    isLoading: isPlansLoading,
    isError: plansFailed,
    error: plansError,
    refetch: retryPlans,
  } = useAvailablePlans();
  const chosenPlan = plans?.some((plan) => plan.code === selectedPlan)
    ? selectedPlan
    : plans?.[0]?.code;

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
    if (isPending || !chosenPlan || plansFailed) return;
    setError(null);
    setIsPending(true);
    try {
      await signUp({
        username: form.username,
        email: form.email,
        password: form.password,
        preferredLanguage:
          form.preferredLanguage as RegisterRequest["preferredLanguage"],
        difficultyLevel:
          form.difficultyLevel as RegisterRequest["difficultyLevel"],
        planType: chosenPlan,
      });
    } catch (err) {
      setError(err);
    } finally {
      setIsPending(false);
    }
  }

  if (step === 1) {
    return (
      <Card>
        <CardHeader>
          <RegistrationSteps step={1} />
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-primary">
            {t("createAccount")}
          </h1>
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
              <PasswordInput
                id="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(event) => update("password", event.target.value)}
                required
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">
                {visual("passwordHint")}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
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
              {visual("nextPlan")}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("haveAccount")}{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
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
        <RegistrationSteps step={2} />
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            setStep(1);
            setError(null);
          }}
          className="mb-2 flex min-h-11 items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {visual("back")}
        </button>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-primary">
          {visual("choosePlan")}
        </h1>
        <CardDescription>{visual("planHint")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSignUp}>
          {error ? <ErrorState message={getApiErrorMessage(error)} /> : null}

          {plansFailed && (
            <div className="space-y-3">
              <ErrorState message={getApiErrorMessage(plansError)} />
              <Button
                type="button"
                variant="outline"
                onClick={() => void retryPlans()}
              >
                {visual("retry")}
              </Button>
            </div>
          )}
          {plans?.length === 0 && (
            <p className="text-sm text-muted-foreground">{visual("noPlans")}</p>
          )}
          {isPlansLoading ? (
            <LoadingState />
          ) : (
            <fieldset disabled={isPending} className="space-y-3">
              {plans?.map((plan) => (
                <PlanPickerCard
                  key={plan.code}
                  plan={plan}
                  isSelected={chosenPlan === plan.code}
                  onSelect={setSelectedPlan}
                />
              ))}
            </fieldset>
          )}

          <Button
            className="w-full"
            type="submit"
            disabled={isPending || isPlansLoading || plansFailed || !chosenPlan}
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {t("signUp")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function RegistrationSteps({ step }: { step: Step }) {
  const { t } = useTranslation("visual");
  return (
    <div className="mb-5">
      <p className="eyebrow mb-3 text-secondary">
        {t("step", { current: step })}
      </p>
      <ol className="grid grid-cols-2 gap-3">
        {["accountStep", "planStep"].map((key, index) => (
          <li
            key={key}
            aria-current={step === index + 1 ? "step" : undefined}
            className={`border-t-2 pt-2 text-xs ${step >= index + 1 ? "border-secondary font-semibold text-secondary" : "border-border text-muted-foreground"}`}
          >
            {t(key)}
          </li>
        ))}
      </ol>
    </div>
  );
}
