import { apiClient } from "./client";
import type { PricingPlan, PricingPlanRequest } from "@/types/pricing-plan";

export async function listPricingPlans() {
  return (await apiClient.get<PricingPlan[]>("/api/v1/admin/subscription/plans")).data;
}

export async function createPricingPlan(body: PricingPlanRequest) {
  return (await apiClient.post<PricingPlan>("/api/v1/admin/subscription/plans", body)).data;
}

export async function updatePricingPlan(code: string, body: PricingPlanRequest) {
  return (await apiClient.put<PricingPlan>(`/api/v1/admin/subscription/plans/${code}`, body)).data;
}

export async function setPricingPlanStatus(code: string, active: boolean) {
  return (await apiClient.patch<PricingPlan>(`/api/v1/admin/subscription/plans/${code}/status`, { active })).data;
}
