"use client";

import { format } from "date-fns";
import { ArrowDownCircle, ArrowUpCircle, Clock, Settings } from "lucide-react";
import type { LoyaltyTransaction, TransactionType } from "../types";

interface TransactionHistoryProps {
  transactions: LoyaltyTransaction[];
  isLoading?: boolean;
}

const transactionTypeConfig: Record<
  TransactionType,
  {
    icon: any;
    color: string;
    bgColor: string;
    label: string;
  }
> = {
  EARN: {
    icon: ArrowUpCircle,
    color: "#4CAF50",
    bgColor: "#E8F5E9",
    label: "Earned",
  },
  REDEEM: {
    icon: ArrowDownCircle,
    color: "#FF9800",
    bgColor: "#FFF3E0",
    label: "Redeemed",
  },
  EXPIRE: {
    icon: Clock,
    color: "#F44336",
    bgColor: "#FFEBEE",
    label: "Expired",
  },
  ADJUST: {
    icon: Settings,
    color: "#2196F3",
    bgColor: "#E3F2FD",
    label: "Adjusted",
  },
};

const reasonLabels: Record<string, string> = {
  PURCHASE: "Purchase",
  SIGNUP: "Sign Up Bonus",
  REVIEW: "Product Review",
  STYLE_QUIZ: "Style Quiz",
  OUTFIT_PHOTO: "Outfit Photo",
  SOCIAL_SHARE: "Social Share",
  BIRTHDAY: "Birthday Bonus",
  REFERRAL: "Referral Bonus",
  DISCOUNT_REDEMPTION: "Discount Redemption",
  PRODUCT_REDEMPTION: "Product Redemption",
  MANUAL_ADJUSTMENT: "Manual Adjustment",
};

export function TransactionHistory({
  transactions,
  isLoading,
}: TransactionHistoryProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse h-20 bg-white/50 border border-[#E5E0D6]"
          />
        ))}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-[#E5E0D6]">
        <p
          className="text-[14px] text-[#888888]"
          style={{ fontFamily: "Raleway, sans-serif" }}
        >
          No transaction history yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => {
        const config = transactionTypeConfig[transaction.type];
        const Icon = config.icon;
        const isPositive = transaction.type === "EARN" || (transaction.type === "ADJUST");

        return (
          <div
            key={transaction.transactionId}
            className="bg-white border border-[#E5E0D6] p-6 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              {/* Left: Icon and Details */}
              <div className="flex items-start gap-4">
                <div
                  className="p-2 rounded"
                  style={{ backgroundColor: config.bgColor }}
                >
                  <Icon size={20} style={{ color: config.color }} />
                </div>
                <div className="space-y-1">
                  <h3
                    className="text-[16px] text-[#232D35] font-medium"
                    style={{ fontFamily: "Raleway, sans-serif" }}
                  >
                    {reasonLabels[transaction.reason] || transaction.reason}
                  </h3>
                  {transaction.description && (
                    <p
                      className="text-[14px] text-[#888888]"
                      style={{ fontFamily: "Raleway, sans-serif" }}
                    >
                      {transaction.description}
                    </p>
                  )}
                  <p
                    className="text-[12px] text-[#888888]"
                    style={{ fontFamily: "Raleway, sans-serif" }}
                  >
                    {format(new Date(transaction.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                  {transaction.expiresAt && (
                    <p
                      className="text-[12px] text-[#F44336]"
                      style={{ fontFamily: "Raleway, sans-serif" }}
                    >
                      Expires: {format(new Date(transaction.expiresAt), "MMM d, yyyy")}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Points */}
              <div className="text-right">
                <p
                  className={`text-[20px] font-medium ${isPositive ? "text-[#4CAF50]" : "text-[#FF9800]"}`}
                  style={{ fontFamily: "Raleway, sans-serif" }}
                >
                  {isPositive ? "+" : "-"}
                  {Math.abs(transaction.points).toLocaleString()}
                </p>
                <p
                  className="text-[12px] text-[#888888] uppercase tracking-wider"
                  style={{ fontFamily: "Raleway, sans-serif" }}
                >
                  {config.label}
                </p>
                <p
                  className="text-[12px] text-[#888888] mt-1"
                  style={{ fontFamily: "Raleway, sans-serif" }}
                >
                  Balance: {transaction.balanceAfter.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
