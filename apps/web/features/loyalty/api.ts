// ============================================================================
// LOYALTY API CLIENT
// ============================================================================

import { backendApiClient } from "@/lib/backend-api-client";
import type {
  LoyaltyAccount,
  LoyaltyTransactionHistory,
  EarnPointsParams,
  RedeemPointsParams,
  AdjustPointsParams,
} from "./types";

/**
 * Get loyalty account details for a user
 */
export const getLoyaltyAccount = async (
  userId: string
): Promise<LoyaltyAccount> => {
  const token = localStorage.getItem("authToken");
  const response = await backendApiClient.get(
    `/loyalty/users/${userId}/account`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};

/**
 * Get transaction history for a user
 */
export const getTransactionHistory = async (
  userId: string,
  params?: { limit?: number; offset?: number }
): Promise<LoyaltyTransactionHistory> => {
  const token = localStorage.getItem("authToken");
  const response = await backendApiClient.get(
    `/loyalty/users/${userId}/transactions`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: params?.limit || 50,
        offset: params?.offset || 0,
      },
    }
  );
  return response.data.data;
};

/**
 * Earn points (internal/admin use)
 */
export const earnPoints = async (params: EarnPointsParams): Promise<any> => {
  const token = localStorage.getItem("authToken");
  const { userId, ...body } = params;
  const response = await backendApiClient.post(
    `/loyalty/users/${userId}/earn`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};

/**
 * Redeem points
 */
export const redeemPoints = async (
  params: RedeemPointsParams
): Promise<any> => {
  const token = localStorage.getItem("authToken");
  const { userId, ...body } = params;
  const response = await backendApiClient.post(
    `/loyalty/users/${userId}/redeem`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};

/**
 * Adjust points (admin only)
 */
export const adjustPoints = async (
  params: AdjustPointsParams
): Promise<any> => {
  const token = localStorage.getItem("authToken");
  const { userId, ...body } = params;
  const response = await backendApiClient.post(
    `/loyalty/users/${userId}/adjust`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};
