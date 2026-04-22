"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useUserProfile } from "@/features/account/queries";
import { useLoyaltyAccount, useTransactionHistory } from "@/features/loyalty/queries";
import { LoyaltySummary } from "@/features/loyalty/components/loyalty-summary";
import { TransactionHistory } from "@/features/loyalty/components/transaction-history";
import { TierBenefits } from "@/features/loyalty/components/tier-benefits";
import { AccountSidebar } from "@/features/account/components/shared/account-sidebar";
import { BackToAccountLink } from "@/features/account/components/shared/back-to-account-link";

export default function LoyaltyPage() {
  const { data: userProfile } = useUserProfile();
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "benefits">("overview");

  const {
    data: loyaltyAccount,
    isLoading: isLoadingAccount,
    error: accountError,
  } = useLoyaltyAccount(userProfile?.id);

  const {
    data: transactionHistory,
    isLoading: isLoadingTransactions,
  } = useTransactionHistory(userProfile?.id, { limit: 50, offset: 0 });

  const isLoading = isLoadingAccount;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#EFECE5]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#232D35]" />
          <p
            className="text-[14px] text-[#232D35]"
            style={{ fontFamily: "Raleway, sans-serif" }}
          >
            Loading loyalty account...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!userProfile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#EFECE5]">
        <p
          className="text-[14px] text-[#888888]"
          style={{ fontFamily: "Raleway, sans-serif" }}
        >
          Please log in to view your loyalty account.
        </p>
      </div>
    );
  }

  if (!loyaltyAccount) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#EFECE5]">
        <p
          className="text-[14px] text-[#888888]"
          style={{ fontFamily: "Raleway, sans-serif" }}
        >
          Unable to load loyalty account. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#EFECE5]">
      {/* Top Strip - Back Link */}
      <div className="w-full flex justify-center border-t border-b border-[#C3B0A5]/30">
        <div className="w-full max-w-[1440px] px-4 md:px-[60px] py-[32px]">
          <BackToAccountLink />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-[60px] pt-[56px] pb-20">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-12">
          {/* Left Sidebar */}
          <AccountSidebar />

          {/* Right Content */}
          <div className="flex-1 max-w-[745px]">
            <h1
              className="text-[24px] font-normal text-[#765C4D] mb-8"
              style={{ fontFamily: "Raleway, sans-serif" }}
            >
              Loyalty Program
            </h1>

            {/* Tabs */}
            <div className="flex items-center gap-6 mb-8 border-b border-[#E5E0D6]">
              {[
                { id: "overview", label: "Overview" },
                { id: "transactions", label: "Transaction History" },
                { id: "benefits", label: "Tier Benefits" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-4 text-[14px] font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? "text-[#C78869]"
                      : "text-[#888888] hover:text-[#765C4D]"
                  }`}
                  style={{ fontFamily: "Raleway, sans-serif" }}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C78869]" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <LoyaltySummary account={loyaltyAccount} />
                </div>
              )}

              {activeTab === "transactions" && (
                <div>
                  <TransactionHistory
                    transactions={transactionHistory?.transactions || []}
                    isLoading={isLoadingTransactions}
                  />
                </div>
              )}

              {activeTab === "benefits" && (
                <div>
                  <TierBenefits currentTier={loyaltyAccount.tier} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
