"use client";

import { Badge } from "@/components/ui/Badge";
import { subscriptionStatusVariant } from "@/lib/subscription-utils";
import type { UserSubscription } from "@/types/subscription";

type CurrentSubscriptionBannerProps = {
  readonly subscription: UserSubscription;
};

export function CurrentSubscriptionBanner({ subscription }: CurrentSubscriptionBannerProps) {
  const formattedEndDate = subscription.endDate
    ? new Date(subscription.endDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Current Plan</p>
          <p className="mt-0.5 text-lg font-semibold">{subscription.plan.displayName}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={subscriptionStatusVariant(subscription.status)}>{subscription.status}</Badge>

          {formattedEndDate && subscription.status === "ACTIVE" && (
            <p className="text-sm text-muted-foreground">Renews {formattedEndDate}</p>
          )}
          {formattedEndDate && subscription.status === "EXPIRED" && (
            <p className="text-sm text-muted-foreground">Expired {formattedEndDate}</p>
          )}
          {!formattedEndDate && subscription.status === "ACTIVE" && (
            <p className="text-sm text-muted-foreground">No expiry</p>
          )}
        </div>
      </div>
    </div>
  );
}
