"use client";

import { useEffect, useState } from "react";
import { Bell, Calendar, Search } from "lucide-react";

export function DashboardHeader({
  title,
  subtitle,
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  children,
}: {
  title?: string;
  subtitle?: string;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  searchPlaceholder?: string;
  children?: React.ReactNode;
}) {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(date.toLocaleDateString("en-US", options));
  }, []);

  return (
    <div className="flex flex-col gap-4 py-2 mb-6">
      {/* Top row: title + actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-normal text-[#232D35] tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {title || "Overview"}
          </h1>
          <div className="flex items-center gap-2 mt-2 text-[#8B7355] text-sm">
            {subtitle ? (
              <p style={{ fontFamily: "Raleway, sans-serif" }}>{subtitle}</p>
            ) : (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <p style={{ fontFamily: "Raleway, sans-serif" }}>
                  Today is {currentDate}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {children}

          <button className="relative w-10 h-10 rounded-full bg-white border border-[#BBA496]/30 flex items-center justify-center hover:bg-[#F8F5F2] transition-colors shadow-sm">
            <Bell className="w-5 h-5 text-[#232D35]" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>

          <div className="w-10 h-10 rounded-full bg-[#232D35] flex items-center justify-center shadow-md">
            <span className="text-white text-sm font-medium">AD</span>
          </div>
        </div>
      </div>

      {/* Search row — only rendered when onSearchChange is provided */}
      {onSearchChange && (
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A09B93]" />
          <input
            type="text"
            value={searchTerm || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder || "Search..."}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#BBA496]/40 rounded-xl text-sm text-[#232D35] placeholder-[#A09B93] focus:outline-none focus:ring-2 focus:ring-[#BBA496]/40 shadow-sm"
            style={{ fontFamily: "Raleway, sans-serif" }}
          />
        </div>
      )}
    </div>
  );
}
