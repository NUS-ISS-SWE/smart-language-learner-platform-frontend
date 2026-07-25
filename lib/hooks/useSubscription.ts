"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelSubscription,
  getAvailablePlans,
  getCurrentSubscription,
  selectPlan,
} from "@/lib/api/subscription";
import type { SelectPlanRequest } from "@/types/subscription";

export const subscriptionKeys = {
  all: ["subscription"] as const,
  current: () => [...subscriptionKeys.all, "current"] as const,
  plans: () => [...subscriptionKeys.all, "plans"] as const,
  history: () => [...subscriptionKeys.all, "history"] as const,
};

export function useCurrentSubscription() {
  return useQuery({
    queryKey: subscriptionKeys.current(),
    queryFn: getCurrentSubscription,
  });
}

export function useAvailablePlans() {
  return useQuery({
    queryKey: subscriptionKeys.plans(),
    queryFn: getAvailablePlans,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSelectPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: SelectPlanRequest) => selectPlan(request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.current() });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.current() });
    },
  });
}
