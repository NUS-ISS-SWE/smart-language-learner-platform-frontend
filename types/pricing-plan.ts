export type PricingPlan = {
  code: string;
  displayName: string;
  description: string | null;
  priceMinor: number;
  currency: string;
  billingInterval: "MONTHLY";
  durationDays: number | null;
  features: string[];
  active?: boolean;
  displayOrder?: number;
};
export type PricingPlanRequest = {
  code?: string;
  displayName: string;
  description: string;
  priceMinor: number;
  currency: string;
  durationDays: number | null;
  features: string[];
  displayOrder: number;
};
