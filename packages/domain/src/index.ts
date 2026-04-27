export type KpiSnapshot = {
  name: string;
  target: string;
};

export const sampleKpis: KpiSnapshot[] = [
  { name: "Price Competitiveness Index", target: "95+" },
  { name: "Checkout Conversion Rate", target: ">= 1.5%" },
  { name: "Order STP Rate", target: ">= 80%" },
  { name: "Pricing Quote p95", target: "<= 700ms" }
];
