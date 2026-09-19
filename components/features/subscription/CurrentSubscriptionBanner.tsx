"use client";

import { Badge } from "@/components/ui/Badge";
import { subscriptionStatusVariant } from "@/lib/subscription-utils";
import type { UserSubscription } from "@/types/subscription";
import { useTranslation } from "@/lib/i18n/useTranslation";

type CurrentSubscriptionBannerProps = {
  readonly subscription: UserSubscription;
};

export function CurrentSubscriptionBanner({
  subscription,
}: CurrentSubscriptionBannerProps) {
  const { t, i18n } = useTranslation("visual");
  const formattedEndDate = subscription.endDate
    ? new Date(subscription.endDate).toLocaleDateString(i18n.language, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="rounded-2xl bg-primary p-6 text-white sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow text-accent">{t("currentPlan")}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">
            {subscription.plan.displayName}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={subscriptionStatusVariant(subscription.status)}>
            {t(`status_${subscription.status}`)}
          </Badge>

          {formattedEndDate && subscription.status === "ACTIVE" && (
            <p className="text-sm text-slate-300">
              {t("accessEnds", { date: formattedEndDate })}
            </p>
          )}
          {formattedEndDate && subscription.status === "EXPIRED" && (
            <p className="text-sm text-slate-300">
              {t("expiredOn", { date: formattedEndDate })}
            </p>
          )}
          {!formattedEndDate && subscription.status === "ACTIVE" && (
            <p className="text-sm text-slate-300">{t("noExpiry")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
