import type { CurrencyCode } from "@pin-stitch/domain";

export function formatMoney(amount: number, currency: CurrencyCode = "KRW"): string {
  if (currency === "KRW") {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0
    }).format(amount);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(amount);
}
