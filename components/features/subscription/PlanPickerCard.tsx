"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SubscriptionPlanCode, SubscriptionPlanInfo } from "@/types/subscription";

type PlanPickerCardProps = {
  readonly plan: SubscriptionPlanInfo;
  readonly isSelected: boolean;
  readonly onSelect: (plan: SubscriptionPlanCode) => void;
};

export function PlanPickerCard({ plan, isSelected, onSelect }: PlanPickerCardProps) {
  const price = new Intl.NumberFormat(undefined, { style: "currency", currency: plan.currency }).format(plan.priceMinor / 100);

  return (
    <button
      type="button"
      onClick={() => onSelect(plan.code)}
      aria-pressed={isSelected}
      aria-label={`Select ${plan.displayName} plan`}
      className={cn(
        "relative flex w-full items-start gap-4 rounded-lg border bg-card p-4 text-left transition-colors hover:bg-muted/30",
        isSelected && "border-primary ring-2 ring-primary",
        !isSelected && plan.priceMinor > 0 && "border-primary/30",
      )}
    >

      <div className="flex-1 space-y-1">
        <div className="flex items-baseline justify-between">
          <p className="font-semibold">{plan.displayName}</p>
          <p className="ml-4 font-bold">{price}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          {plan.durationDays != null ? `${plan.durationDays}-day billing cycle` : "No expiry"}
        </p>
        <ul className="mt-1.5 space-y-0.5">
          {plan.features.slice(0, 2).map((feature) => (
            <li key={feature} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Check className="h-3 w-3 shrink-0 text-emerald-500" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          isSelected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/30",
        )}
        aria-hidden="true"
      >
        {isSelected && <Check className="h-3 w-3" />}
      </div>
    </button>
  );
}
