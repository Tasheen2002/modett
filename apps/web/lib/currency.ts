export type Currency = "LKR" | "SGD" | "USD";

export const CURRENCY_COOKIE = "preferred_currency";

export const CURRENCY_CONFIG: Record<Currency, { symbol: string; locale: string }> = {
  LKR: { symbol: "Rs", locale: "en-LK" },
  SGD: { symbol: "S$", locale: "en-SG" },
  USD: { symbol: "$", locale: "en-US" },
};

// Country code → currency mapping
export function countryToCurrency(countryCode: string): Currency {
  if (countryCode === "LK") return "LKR";
  if (countryCode === "SG") return "SGD";
  return "USD";
}

// Format a price value for display
export function formatPrice(amount: number, currency: Currency): string {
  const { symbol, locale } = CURRENCY_CONFIG[currency];
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${symbol} ${formatted}`;
}

// Pick the right price from variant based on active currency
export function getPriceForCurrency(
  priceLkr: number,
  priceSgd: number | null | undefined,
  priceUsd: number | null | undefined,
  currency: Currency
): number | null {
  if (currency === "LKR") return priceLkr;
  if (currency === "SGD") return priceSgd ?? null;
  if (currency === "USD") return priceUsd ?? null;
  return priceLkr;
}
