"use client";

import { TierBadge } from "./tier-badge";
import { ChevronRight } from "lucide-react";
import type { LoyaltyAccount } from "../types";

interface LoyaltySummaryProps {
  account: LoyaltyAccount;
}

export function LoyaltySummary({ account }: LoyaltySummaryProps) {
  const progressPercentage = account.pointsToNextTier
    ? Math.min(
        ((account.lifetimePoints -
          (account.lifetimePoints - (account.pointsToNextTier || 0))) /
          (account.pointsToNextTier || 1)) *
          100,
        100
      )
    : 100;

  return (
    <div className="bg-white border border-[#E5E0D6] p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-[20px] text-[#232D35] font-medium"
          style={{ fontFamily: "Raleway, sans-serif" }}
        >
          Your Loyalty Status
        </h2>
        <TierBadge tier={account.tier} size="md" />
      </div>

      {/* Points Balance */}
      <div className="bg-[#FBF9F6] p-6 mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <span
            className="text-[36px] text-[#232D35] font-light"
            style={{ fontFamily: "Raleway, sans-serif" }}
          >
            {account.currentBalance.toLocaleString()}
          </span>
          <span
            className="text-[14px] text-[#888888] uppercase tracking-wider"
            style={{ fontFamily: "Raleway, sans-serif" }}
          >
            Points Available
          </span>
        </div>
        <p
          className="text-[12px] text-[#888888]"
          style={{ fontFamily: "Raleway, sans-serif" }}
        >
          {account.tierMultiplier}x points multiplier on purchases
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#FBF9F6] p-4">
          <p
            className="text-[12px] text-[#888888] uppercase tracking-wider mb-1"
            style={{ fontFamily: "Raleway, sans-serif" }}
          >
            Lifetime Points
          </p>
          <p
            className="text-[24px] text-[#232D35] font-light"
            style={{ fontFamily: "Raleway, sans-serif" }}
          >
            {account.lifetimePoints.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#FBF9F6] p-4">
          <p
            className="text-[12px] text-[#888888] uppercase tracking-wider mb-1"
            style={{ fontFamily: "Raleway, sans-serif" }}
          >
            Points Redeemed
          </p>
          <p
            className="text-[24px] text-[#232D35] font-light"
            style={{ fontFamily: "Raleway, sans-serif" }}
          >
            {account.totalPointsRedeemed.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Next Tier Progress */}
      {account.nextTier && account.pointsToNextTier && (
        <div className="border-t border-[#E5E0D6] pt-6">
          <div className="flex items-center justify-between mb-3">
            <p
              className="text-[14px] text-[#232D35]"
              style={{ fontFamily: "Raleway, sans-serif" }}
            >
              Next Tier: <span className="font-medium">{account.nextTier.replace(/_/g, " ")}</span>
            </p>
            <p
              className="text-[12px] text-[#888888]"
              style={{ fontFamily: "Raleway, sans-serif" }}
            >
              {account.pointsToNextTier.toLocaleString()} points to go
            </p>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C78869] transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {account.nextTier === null && (
        <div className="border-t border-[#E5E0D6] pt-6">
          <div className="flex items-center gap-2 text-[#C78869]">
            <ChevronRight className="w-4 h-4" />
            <p
              className="text-[14px] font-medium"
              style={{ fontFamily: "Raleway, sans-serif" }}
            >
              You've reached the highest tier!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
