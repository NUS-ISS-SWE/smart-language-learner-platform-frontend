import { apiClient } from "./client";
import type { UserSubscription, SubscriptionPlanInfo, SelectPlanRequest } from "@/types/subscription";

export async function getAvailablePlans(): Promise<SubscriptionPlanInfo[]> {
  const response = await apiClient.get<SubscriptionPlanInfo[]>("/api/v1/subscription/plans");
  return response.data;
}

export async function getCurrentSubscription(): Promise<UserSubscription> {
  const response = await apiClient.get<UserSubscription>("/api/v1/subscription/current");
  return response.data;
}

export async function selectPlan(request: SelectPlanRequest): Promise<UserSubscription> {
  const response = await apiClient.post<UserSubscription>("/api/v1/subscription/select", request);
  return response.data;
}

export async function cancelSubscription(): Promise<UserSubscription> {
  const response = await apiClient.post<UserSubscription>("/api/v1/subscription/cancel", {});
  return response.data;
}

export async function getSubscriptionHistory(): Promise<UserSubscription[]> {
  const response = await apiClient.get<UserSubscription[]>("/api/v1/subscription/history");
  return response.data;
}
