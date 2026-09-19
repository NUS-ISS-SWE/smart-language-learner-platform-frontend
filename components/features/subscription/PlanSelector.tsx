"use client";

import { PlanCard } from "./PlanCard";
import type {
  SubscriptionPlanCode,
  SubscriptionPlanInfo,
  UserSubscription,
} from "@/types/subscription";

type PlanSelectorProps = {
  readonly plans: SubscriptionPlanInfo[];
  readonly currentSubscription: UserSubscription | undefined;
  readonly onSelect: (plan: SubscriptionPlanCode) => void;
  readonly isLoading: boolean;
};

export function PlanSelector({
  plans,
  currentSubscription,
  onSelect,
  isLoading,
}: PlanSelectorProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-5">
      {plans.map((plan) => (
        <PlanCard
          key={plan.code}
          plan={plan}
          isCurrentPlan={
            currentSubscription?.plan.code === plan.code &&
            currentSubscription?.status === "ACTIVE"
          }
          onSelect={onSelect}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
