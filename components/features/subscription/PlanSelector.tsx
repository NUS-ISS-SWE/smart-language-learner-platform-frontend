"use client";

import { PlanCard } from "./PlanCard";
import type { SubscriptionPlan, SubscriptionPlanInfo, UserSubscription } from "@/types/subscription";

type PlanSelectorProps = {
  plans: SubscriptionPlanInfo[];
  currentSubscription: UserSubscription | undefined;
  onSelect: (plan: SubscriptionPlan) => void;
  isLoading: boolean;
};

export function PlanSelector({ plans, currentSubscription, onSelect, isLoading }: PlanSelectorProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {plans.map((plan) => (
        <PlanCard
          key={plan.plan}
          plan={plan}
          isCurrentPlan={
            currentSubscription?.planType === plan.plan &&
            currentSubscription?.status === "ACTIVE"
          }
          onSelect={onSelect}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
