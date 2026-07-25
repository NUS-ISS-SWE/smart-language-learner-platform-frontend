"use client";

import { useState } from "react";
import {
  useCurrentSubscription,
  useAvailablePlans,
  useSelectPlan,
} from "@/lib/hooks/useSubscription";
import { CurrentSubscriptionBanner } from "@/components/features/subscription/CurrentSubscriptionBanner";
import { PlanSelector } from "@/components/features/subscription/PlanSelector";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { getApiErrorMessage } from "@/lib/api/client";
import { isPaidPlan } from "@/lib/subscription-utils";
import type { SubscriptionPlan } from "@/types/subscription";

export default function SubscriptionPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    data: currentSubscription,
    isLoading: isCurrentLoading,
    isError: isCurrentError,
  } = useCurrentSubscription();
  const { data: plans, isLoading: isPlansLoading } = useAvailablePlans();
  const selectPlanMutation = useSelectPlan();

  const isMutating = selectPlanMutation.isPending;

  function clearMessages() {
    setSuccessMessage(null);
    setErrorMessage(null);
  }

  function handleSelectPlan(plan: SubscriptionPlan) {
    clearMessages();
    selectPlanMutation.mutate(
      { plan },
      {
        onSuccess: () => setSuccessMessage(
          isPaidPlan(plan) ? "Plan updated successfully." : "Subscription cancelled."
        ),
        onError: (err) => setErrorMessage(getApiErrorMessage(err)),
      },
    );
  }

  if (isCurrentLoading || isPlansLoading) {
    return <LoadingState />;
  }

  if (isCurrentError) {
    return <ErrorState message="Failed to load subscription details." />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">Subscription</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your plan and billing.
        </p>
      </div>

      {successMessage && (
        <output className="block rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </output>
      )}

      {errorMessage && (
        <div role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      {currentSubscription && (
        <CurrentSubscriptionBanner subscription={currentSubscription} />
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold">Choose a Plan</h2>
        {plans && (
          <PlanSelector
            plans={plans}
            currentSubscription={currentSubscription}
            onSelect={handleSelectPlan}
            isLoading={isMutating}
          />
        )}
      </div>
    </div>
  );
}
