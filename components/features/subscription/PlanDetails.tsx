"use client";
import { Check } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { formatCurrencyMinor } from "@/lib/utils";
import type { SubscriptionPlanInfo } from "@/types/subscription";

/** Registration and subscription show the same complete plan terms. */
export function PlanDetails({
  plan,
  compact = false,
}: {
  plan: Pick<
    SubscriptionPlanInfo,
    | "displayName"
    | "priceMinor"
    | "currency"
    | "durationDays"
    | "description"
    | "features"
  >;
  compact?: boolean;
}) {
  const { t } = useTranslation("visual");
  return (
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h3 className="break-words text-lg font-semibold text-primary">
          {plan.displayName}
        </h3>
        <p
          className={
            compact
              ? "text-xl font-semibold tabular-nums text-primary"
              : "mt-3 w-full text-4xl font-semibold tracking-tight tabular-nums text-primary"
          }
        >
          {formatCurrencyMinor(plan.priceMinor, plan.currency)}
        </p>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {plan.durationDays != null
          ? t("duration", { count: plan.durationDays })
          : t("noExpiry")}
      </p>
      {plan.description && (
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {plan.description}
        </p>
      )}
      <ul
        className="mt-5 space-y-3 border-t pt-4"
        aria-label={t("features", { name: plan.displayName })}
      >
        {plan.features.map((feature, index) => (
          <li
            key={`${index}-${feature}`}
            className="flex items-start gap-2 text-sm leading-6"
          >
            <Check
              className="mt-1 h-4 w-4 shrink-0 text-secondary"
              aria-hidden="true"
            />
            <span className="break-words">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
