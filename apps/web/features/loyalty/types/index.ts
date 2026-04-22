// ============================================================================
// LOYALTY TYPES
// ============================================================================

export type LoyaltyTier = "STYLE_LOVER" | "FASHION_FAN" | "STYLE_INSIDER" | "VIP_STYLIST";

export type TransactionType = "EARN" | "REDEEM" | "EXPIRE" | "ADJUST";

export type TransactionReason =
  | "PURCHASE"
  | "SIGNUP"
  | "REVIEW"
  | "STYLE_QUIZ"
  | "OUTFIT_PHOTO"
  | "SOCIAL_SHARE"
  | "BIRTHDAY"
  | "REFERRAL"
  | "DISCOUNT_REDEMPTION"
  | "PRODUCT_REDEMPTION"
  | "MANUAL_ADJUSTMENT";

export interface LoyaltyAccount {
  accountId: string;
  userId: string;
  currentBalance: number;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  lifetimePoints: number;
  tier: LoyaltyTier;
  tierMultiplier: number;
  nextTier: LoyaltyTier | null;
  pointsToNextTier: number | null;
  joinedAt: string;
  lastActivityAt: string | null;
}

export interface LoyaltyTransaction {
  transactionId: string;
  type: TransactionType;
  points: number;
  reason: TransactionReason;
  description: string | null;
  balanceAfter: number;
  expiresAt: string | null;
  createdAt: string;
}

export interface LoyaltyTransactionHistory {
  transactions: LoyaltyTransaction[];
  limit: number;
  offset: number;
}

export interface EarnPointsParams {
  userId: string;
  points: number;
  reason: TransactionReason;
  description?: string;
  referenceId?: string;
  orderId?: string;
}

export interface RedeemPointsParams {
  userId: string;
  points: number;
  reason: Extract<TransactionReason, "DISCOUNT_REDEMPTION" | "PRODUCT_REDEMPTION">;
  description?: string;
  referenceId?: string;
}

export interface AdjustPointsParams {
  userId: string;
  points: number;
  isAddition: boolean;
  reason: string;
}
