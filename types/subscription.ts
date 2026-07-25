export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING";

export type SubscriptionPlan = "FREE_TRIAL" | "BASIC" | "PREMIUM";

export type UserSubscription = {
  id: number | null;
  planType: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string | null;
  endDate: string | null;
  durationDays: number | null;
  createdAt: string | null;
};

export type SubscriptionPlanInfo = {
  plan: SubscriptionPlan;
  displayName: string;
  price: string;
  durationDays: number | null;
  features: string[];
};

export type SelectPlanRequest = {
  plan: SubscriptionPlan;
  /** Reserved for Stripe PaymentIntent ID — populated once Stripe integration is complete. */
  paymentToken?: string;
};
