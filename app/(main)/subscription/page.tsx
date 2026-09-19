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
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { getApiErrorMessage } from "@/lib/api/client";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { SubscriptionPlanCode } from "@/types/subscription";

export default function SubscriptionPage() {
  const { t } = useTranslation("visual");
  const [saved, setSaved] = useState(false);
  const current = useCurrentSubscription(
    (query) => query.state.data?.status === "PENDING" ? 3000 : false,
  );
  const plans = useAvailablePlans();
  const select = useSelectPlan();
  function handleSelectPlan(planCode: SubscriptionPlanCode) {
    if (select.isPending) return;
    setSaved(false);
    select.mutate({ planCode }, { onSuccess: () => setSaved(true) });
  }
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title={t("subscription")}
        description={t("subscriptionHint")}
      />
      {saved && (
        <p
          role="status"
          className="rounded-xl border border-secondary/30 bg-soft-teal p-4 text-sm text-secondary"
        >
          {t("updated")}
        </p>
      )}
      {select.isError && (
        <ErrorState message={getApiErrorMessage(select.error)} />
      )}
      {current.isLoading && <LoadingState />}
      {current.isError && (
        <div className="space-y-3">
          <ErrorState message={getApiErrorMessage(current.error)} />
          <Button variant="outline" onClick={() => void current.refetch()}>
            {t("retry")}
          </Button>
        </div>
      )}
      {current.data?.status === "PENDING" && (
        <output className="block rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Waiting for Stripe to confirm your payment. This updates automatically.
        </output>
      )}
      {current.data && (
        <CurrentSubscriptionBanner subscription={current.data} />
      )}
      <section className="space-y-5">
        <h2 className="text-xl font-semibold text-primary">
          {t("availablePlans")}
        </h2>
        {plans.isLoading && <LoadingState />}
        {plans.isError && (
          <div className="space-y-3">
            <ErrorState message={getApiErrorMessage(plans.error)} />
            <Button variant="outline" onClick={() => void plans.refetch()}>
              {t("retry")}
            </Button>
          </div>
        )}
        {plans.data?.length === 0 && (
          <p className="rounded-xl border border-dashed bg-card p-8 text-muted-foreground">
            {t("noPlans")}
          </p>
        )}
        {plans.data && (
          <PlanSelector
            plans={plans.data}
            currentSubscription={current.data}
            onSelect={handleSelectPlan}
            isLoading={select.isPending || current.isLoading || current.isError}
          />
        )}
      </section>
    </div>
  );
}
