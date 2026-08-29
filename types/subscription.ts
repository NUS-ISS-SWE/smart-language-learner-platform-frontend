export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING";

export type SubscriptionPlanCode = string;

export type UserSubscription = {
  id: number | null;
  plan: SubscriptionPlanSnapshot;
  status: SubscriptionStatus;
  startDate: string | null;
  endDate: string | null;
  durationDays: number | null;
  createdAt: string | null;
};

export type SubscriptionPlanInfo = {
  code: SubscriptionPlanCode;
  displayName: string;
  description: string | null;
  priceMinor: number;
  currency: string;
  billingInterval: "MONTHLY";
  durationDays: number | null;
  features: string[];
  active: boolean;
  displayOrder: number;
};

export type SubscriptionPlanSnapshot = {
  code: SubscriptionPlanCode;
  displayName: string;
  priceMinor: number;
  currency: string;
  features: string[];
};

export type SelectPlanRequest = {
  planCode: SubscriptionPlanCode;
  /** Reserved for Stripe PaymentIntent ID — populated once Stripe integration is complete. */
  paymentToken?: string;
};
