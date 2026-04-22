"use client";

import { Check } from "lucide-react";
import { TierBadge } from "./tier-badge";
import type { LoyaltyTier } from "../types";

interface TierBenefitsProps {
  currentTier: LoyaltyTier;
}

const tierData = [
  {
    tier: "STYLE_LOVER" as LoyaltyTier,
    threshold: 0,
    multiplier: "1.0x",
    benefits: [
      "Earn 1 point per $1 spent",
      "Birthday bonus points",
      "Early access to sale events",
      "Welcome gift on sign-up",
    ],
  },
  {
    tier: "FASHION_FAN" as LoyaltyTier,
    threshold: 5000,
    multiplier: "1.25x",
    benefits: [
      "Earn 1.25 points per $1 spent",
      "Free standard shipping",
      "Exclusive member-only previews",
      "Priority customer support",
    ],
  },
  {
    tier: "STYLE_INSIDER" as LoyaltyTier,
    threshold: 15000,
    multiplier: "1.5x",
    benefits: [
      "Earn 1.5 points per $1 spent",
      "Free express shipping",
      "Personal stylist consultation",
      "VIP event invitations",
    ],
  },
  {
    tier: "VIP_STYLIST" as LoyaltyTier,
    threshold: 30000,
    multiplier: "2.0x",
    benefits: [
      "Earn 2 points per $1 spent",
      "Free overnight shipping",
      "Dedicated style concierge",
      "First access to new collections",
      "Complimentary alterations",
    ],
  },
];

export function TierBenefits({ currentTier }: TierBenefitsProps) {
  return (
    <div className="bg-white border border-[#E5E0D6] p-8">
      <h2
        className="text-[20px] text-[#232D35] font-medium mb-6"
        style={{ fontFamily: "Raleway, sans-serif" }}
      >
        Loyalty Tiers & Benefits
      </h2>

      <div className="space-y-6">
        {tierData.map((tierInfo) => {
          const isCurrentTier = tierInfo.tier === currentTier;

          return (
            <div
              key={tierInfo.tier}
              className={`border p-6 transition-all ${
                isCurrentTier
                  ? "border-[#C78869] bg-[#FBF9F6]"
                  : "border-[#E5E0D6] bg-white"
              }`}
            >
              {/* Tier Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <TierBadge tier={tierInfo.tier} size="sm" />
                  {isCurrentTier && (
                    <span
                      className="text-[12px] text-[#C78869] uppercase tracking-wider font-medium"
                      style={{ fontFamily: "Raleway, sans-serif" }}
                    >
                      Current Tier
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p
                    className="text-[14px] text-[#232D35] font-medium"
                    style={{ fontFamily: "Raleway, sans-serif" }}
                  >
                    {tierInfo.multiplier} Points
                  </p>
                  <p
                    className="text-[12px] text-[#888888]"
                    style={{ fontFamily: "Raleway, sans-serif" }}
                  >
                    {tierInfo.threshold === 0
                      ? "Starting tier"
                      : `${tierInfo.threshold.toLocaleString()}+ lifetime points`}
                  </p>
                </div>
              </div>

              {/* Benefits List */}
              <div className="space-y-2">
                {tierInfo.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check
                      size={16}
                      className="text-[#C78869] mt-0.5 flex-shrink-0"
                    />
                    <p
                      className="text-[14px] text-[#232D35]"
                      style={{ fontFamily: "Raleway, sans-serif" }}
                    >
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
