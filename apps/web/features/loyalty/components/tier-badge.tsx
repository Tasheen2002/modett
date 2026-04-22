"use client";

import { Crown, Sparkles, Star, Award } from "lucide-react";
import type { LoyaltyTier } from "../types";

interface TierBadgeProps {
  tier: LoyaltyTier;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const tierConfig = {
  STYLE_LOVER: {
    label: "Style Lover",
    icon: Sparkles,
    color: "#C78869",
    bgColor: "#F9F6F3",
  },
  FASHION_FAN: {
    label: "Fashion Fan",
    icon: Star,
    color: "#A67C52",
    bgColor: "#F5F0EB",
  },
  STYLE_INSIDER: {
    label: "Style Insider",
    icon: Award,
    color: "#8B6F47",
    bgColor: "#F0EBE5",
  },
  VIP_STYLIST: {
    label: "VIP Stylist",
    icon: Crown,
    color: "#765C4D",
    bgColor: "#ECE6E0",
  },
};

const sizeConfig = {
  sm: { icon: 16, text: "text-[12px]" },
  md: { icon: 20, text: "text-[14px]" },
  lg: { icon: 24, text: "text-[16px]" },
};

export function TierBadge({
  tier,
  size = "md",
  showLabel = true,
}: TierBadgeProps) {
  const config = tierConfig[tier];
  const Icon = config.icon;
  const sizeSettings = sizeConfig[size];

  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded"
      style={{ backgroundColor: config.bgColor }}
    >
      <Icon size={sizeSettings.icon} style={{ color: config.color }} />
      {showLabel && (
        <span
          className={`font-medium ${sizeSettings.text}`}
          style={{ color: config.color, fontFamily: "Raleway, sans-serif" }}
        >
          {config.label}
        </span>
      )}
    </div>
  );
}
