import { NextRequest, NextResponse } from "next/server";
import { CURRENCY_COOKIE, countryToCurrency } from "./lib/currency";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // If cookie already set, do nothing
  if (request.cookies.has(CURRENCY_COOKIE)) {
    return response;
  }

  // On Vercel: request.geo is populated automatically from the edge network
  // On other platforms or local dev: fall back to USD
  const country =
    (request as any).geo?.country ||
    request.headers.get("x-vercel-ip-country") ||
    "US";

  const currency = countryToCurrency(country);

  // Set cookie for 30 days
  response.cookies.set(CURRENCY_COOKIE, currency, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
  });

  return response;
}

export const config = {
  // Run on all pages except static assets and API routes
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
