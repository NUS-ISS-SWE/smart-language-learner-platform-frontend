import type { BadgeProps } from "@/components/ui/Badge";
import type { SubscriptionPlan, SubscriptionStatus } from "@/types/subscription";

/** Full display name for use in headings, banners, and labels. */
export function planDisplayName(plan: SubscriptionPlan): string {
  switch (plan) {
    case "FREE_TRIAL":
      return "Free Trial";
    case "BASIC":
      return "Basic";
    case "PREMIUM":
      return "Premium";
  }
}

/** Short label for compact UI elements such as badges in the topbar. */
export function planBadgeLabel(plan: SubscriptionPlan): string {
  switch (plan) {
    case "FREE_TRIAL":
      return "Free";
    case "BASIC":
      return "Basic";
    case "PREMIUM":
      return "Premium";
  }
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
export function isPaidPlan(plan: SubscriptionPlan): boolean {
  return plan !== "FREE_TRIAL";
}
