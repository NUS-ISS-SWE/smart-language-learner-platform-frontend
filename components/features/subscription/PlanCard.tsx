"use client";

import { Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { SubscriptionPlanCode, SubscriptionPlanInfo } from "@/types/subscription";

type PlanCardProps = {
  readonly plan: SubscriptionPlanInfo;
  readonly isCurrentPlan: boolean;
  readonly onSelect: (plan: SubscriptionPlanCode) => void;
  readonly isLoading: boolean;
};

export function PlanCard({ plan, isCurrentPlan, onSelect, isLoading }: PlanCardProps) {
  const buttonVariant = !isCurrentPlan && plan.priceMinor > 0 ? "default" : "outline";
  const price = new Intl.NumberFormat(undefined, { style: "currency", currency: plan.currency }).format(plan.priceMinor / 100);

  return (
    <Card
      className={cn(
        "relative flex flex-col p-6",
        plan.priceMinor > 0 && !isCurrentPlan && "border-primary ring-1 ring-primary",
        isCurrentPlan && "border-emerald-500 ring-1 ring-emerald-500",
      )}
    >
      {isCurrentPlan && (
        <Badge variant="success" className="absolute -top-3 left-4">
          Current Plan
        </Badge>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-semibold">{plan.displayName}</h3>
        <p className="mt-1 text-2xl font-bold">{price}</p>
        <p className="text-xs text-muted-foreground">
          {plan.durationDays != null ? `per ${plan.durationDays} days` : "no expiry"}
        </p>
      </div>

      <ul className="mb-6 flex-1 space-y-2" aria-label={`${plan.displayName} features`}>
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        variant={buttonVariant}
        className="w-full"
        disabled={isCurrentPlan || isLoading}
        onClick={() => onSelect(plan.code)}
        aria-label={isCurrentPlan ? `${plan.displayName} — current plan` : `Select ${plan.displayName}`}
      >
        {isCurrentPlan ? "Current Plan" : "Select"}
      </Button>
    </Card>
  );
}
