import type { VercelRequest, VercelResponse } from "@vercel/node";

const DEFAULT_PROMO_CODES = [
  { code: "START20", discountPercent: 20 },
  { code: "WELCOME20", discountPercent: 20 },
  { code: "HASH20", discountPercent: 20 },
];

function getPromoCodes() {
  if (process.env.PROMO_CODES) {
    try {
      return JSON.parse(process.env.PROMO_CODES);
    } catch (e) {
      console.warn("Failed to parse PROMO_CODES env var, using defaults.");
    }
  }
  return DEFAULT_PROMO_CODES;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const { promoCode, plan } = req.body;

    if (!promoCode) {
      return res.status(400).json({ success: false, message: "Promo code is required" });
    }

    const code = typeof promoCode === "string" ? promoCode.trim().toUpperCase() : "";
    if (!code) {
      return res.status(400).json({ success: false, message: "Invalid promo code format" });
    }

    const activePromoCodes = getPromoCodes();
    const match = activePromoCodes.find((p: { code: string; discountPercent: number }) => p.code === code);

    if (!match) {
      return res.status(400).json({ success: false, message: "Invalid or expired promo code" });
    }

    const basePrice = plan === "single" ? 50 : 120;
    const discountAmount = Math.round(basePrice * (match.discountPercent / 100));
    const finalPrice = Math.max(10, basePrice - discountAmount);

    return res.json({
      success: true,
      discountPercent: match.discountPercent,
      discountAmount,
      finalPrice,
    });
  } catch (error: any) {
    console.error("[ApplyPromo Error]", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while validating promo code",
    });
  }
}
