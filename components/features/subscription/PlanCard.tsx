"use client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { PlanDetails } from "./PlanDetails";
import type {
  SubscriptionPlanCode,
  SubscriptionPlanInfo,
} from "@/types/subscription";

export function PlanCard({
  plan,
  isCurrentPlan,
  onSelect,
  isLoading,
}: {
  plan: SubscriptionPlanInfo;
  isCurrentPlan: boolean;
  onSelect: (plan: SubscriptionPlanCode) => void;
  isLoading: boolean;
}) {
  const { t } = useTranslation("visual");
  return (
    <article
      className={cn(
        "flex min-w-0 flex-col gap-6 rounded-2xl border bg-card p-6",
        isCurrentPlan &&
          "border-secondary bg-soft-teal/20 ring-1 ring-secondary",
      )}
    >
      {isCurrentPlan && (
        <Badge variant="secondary" className="self-start">
          {t("currentPlan")}
        </Badge>
      )}
      <PlanDetails plan={plan} />
      <Button
        variant={isCurrentPlan ? "outline" : "default"}
        className="mt-auto w-full whitespace-normal"
        disabled={isCurrentPlan || isLoading}
        onClick={() => onSelect(plan.code)}
      >
        {isCurrentPlan
          ? t("currentPlan")
          : isLoading
            ? t("saving")
            : t("selectPlan", { name: plan.displayName })}
      </Button>
    </article>
  );
}
