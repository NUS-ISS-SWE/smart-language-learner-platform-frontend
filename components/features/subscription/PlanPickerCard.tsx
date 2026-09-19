"use client";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { PlanDetails } from "./PlanDetails";
import type {
  SubscriptionPlanCode,
  SubscriptionPlanInfo,
} from "@/types/subscription";

export function PlanPickerCard({
  plan,
  isSelected,
  onSelect,
}: {
  plan: SubscriptionPlanInfo;
  isSelected: boolean;
  onSelect: (plan: SubscriptionPlanCode) => void;
}) {
  const { t } = useTranslation("visual");
  return (
    <button
      type="button"
      onClick={() => onSelect(plan.code)}
      aria-pressed={isSelected}
      aria-label={t("selectPlan", { name: plan.displayName })}
      className={cn(
        "flex w-full items-start gap-4 rounded-xl border bg-card p-5 text-left transition-colors hover:bg-soft-teal/40",
        isSelected
          ? "border-secondary bg-soft-teal/30 ring-1 ring-secondary"
          : "border-border",
      )}
    >
      <PlanDetails plan={plan} compact />
      <span
        aria-hidden="true"
        className={cn(
          "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
          isSelected
            ? "border-secondary bg-secondary text-white"
            : "border-input",
        )}
      >
        {isSelected && <Check className="h-3 w-3" />}
      </span>
    </button>
  );
}
