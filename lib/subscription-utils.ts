import type { BadgeProps } from "@/components/ui/Badge";
import type { SubscriptionStatus } from "@/types/subscription";

/** Full display name for use in headings, banners, and labels. */
export function planDisplayName(plan: string): string {
  return plan.split("_").map((part) => part.charAt(0) + part.slice(1).toLowerCase()).join(" ");
}

/** Short label for compact UI elements such as badges in the topbar. */
export function planBadgeLabel(plan: string): string {
  return plan === "FREE_TRIAL" ? "Free" : planDisplayName(plan);
}

/** Badge colour variant that corresponds to a subscription status. */
export function subscriptionStatusVariant(status: SubscriptionStatus): BadgeProps["variant"] {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "EXPIRED":
      return "destructive";
    case "CANCELLED":
      return "secondary";
    case "PENDING":
      return "warning";
  }
}

/** Returns true for plans that carry an expiry date and require payment. */
