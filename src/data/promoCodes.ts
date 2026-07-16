export interface PromoCode {
  code: string;
  discountPercent: number; // e.g. 20 for 20%
}

export const PROMO_CODES: PromoCode[] = [
  { code: "START20", discountPercent: 20 },
  { code: "WELCOME20", discountPercent: 20 },
  { code: "HASH20", discountPercent: 20 },
];

/**
 * Validates a promo code and returns its discount percentage, or null if invalid.
 */
export function validatePromoCode(code: string): number | null {
  const match = PROMO_CODES.find(p => p.code === code.trim().toUpperCase());
  return match ? match.discountPercent : null;
}
