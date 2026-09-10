"use client";

import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import {
  cancelSubscription,
  getAvailablePlans,
  getCurrentSubscription,
  selectPlan,
} from "@/lib/api/subscription";
import type { SelectPlanRequest, UserSubscription } from "@/types/subscription";

export const subscriptionKeys = {
  all: ["subscription"] as const,
  current: () => [...subscriptionKeys.all, "current"] as const,
  plans: () => [...subscriptionKeys.all, "plans"] as const,
  history: () => [...subscriptionKeys.all, "history"] as const,
};

export function useCurrentSubscription(
  refetchInterval?: UseQueryOptions<UserSubscription>["refetchInterval"],
) {
  return useQuery({
    queryKey: subscriptionKeys.current(),
    queryFn: getCurrentSubscription,
    refetchInterval,
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
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.current() });
      // Paid plans come back PENDING with a Stripe Payment Link to complete payment on.
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
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
