// ============================================================================
// LOYALTY REACT QUERY HOOKS
// ============================================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as loyaltyApi from "./api";
import type {
  EarnPointsParams,
  RedeemPointsParams,
  AdjustPointsParams,
} from "./types";

/**
 * Query key factory for loyalty queries
 */
export const loyaltyKeys = {
  all: ["loyalty"] as const,
  account: (userId: string) => ["loyalty", "account", userId] as const,
  transactions: (userId: string, limit?: number, offset?: number) =>
    ["loyalty", "transactions", userId, limit, offset] as const,
};

/**
 * Hook to fetch loyalty account details
 */
export const useLoyaltyAccount = (userId: string | undefined) => {
  return useQuery({
    queryKey: loyaltyKeys.account(userId || ""),
    queryFn: () => loyaltyApi.getLoyaltyAccount(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

/**
 * Hook to fetch transaction history
 */
export const useTransactionHistory = (
  userId: string | undefined,
  params?: { limit?: number; offset?: number }
) => {
  return useQuery({
    queryKey: loyaltyKeys.transactions(
      userId || "",
      params?.limit,
      params?.offset
    ),
    queryFn: () => loyaltyApi.getTransactionHistory(userId!, params),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

/**
 * Hook to earn points
 */
export const useEarnPoints = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: EarnPointsParams) => loyaltyApi.earnPoints(params),
    onSuccess: (data, variables) => {
      // Invalidate loyalty account and transactions
      queryClient.invalidateQueries({
        queryKey: loyaltyKeys.account(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: loyaltyKeys.all,
      });
    },
  });
};

/**
 * Hook to redeem points
 */
export const useRedeemPoints = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: RedeemPointsParams) => loyaltyApi.redeemPoints(params),
    onSuccess: (data, variables) => {
      // Invalidate loyalty account and transactions
      queryClient.invalidateQueries({
        queryKey: loyaltyKeys.account(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: loyaltyKeys.all,
      });
    },
  });
};

/**
 * Hook to adjust points (admin only)
 */
export const useAdjustPoints = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: AdjustPointsParams) => loyaltyApi.adjustPoints(params),
    onSuccess: (data, variables) => {
      // Invalidate loyalty account and transactions
      queryClient.invalidateQueries({
        queryKey: loyaltyKeys.account(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: loyaltyKeys.all,
      });
    },
  });
};
