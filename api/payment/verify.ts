import type { VercelRequest, VercelResponse } from "@vercel/node";

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
    const { code, action, reference, senderInfo, email, amount } = req.body;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_PAYMENT_URL || "https://script.google.com/macros/s/AKfycbxEwZAiv_ja3Tlpno6HWp-OL1ur2WPkRq_9V4BTqquWsfX1gAEacB9vu-iRowF9FxDI-A/exec";
    if (!scriptUrl) {
      throw new Error("Payment script URL not configured");
    }

    let url = `${scriptUrl}?t=${Date.now()}`;
    const fetchOptions: RequestInit = {
      method: "GET",
      signal: controller.signal,
    };

    if (action === "submitPayment") {
      url = `${scriptUrl}?action=submitPayment&reference=${encodeURIComponent(reference || "")}&senderInfo=${encodeURIComponent(senderInfo || "")}&email=${encodeURIComponent(email || "")}&amount=${encodeURIComponent(amount || "")}&t=${Date.now()}`;
    } else if (action === "checkStatus") {
      url = `${scriptUrl}?action=checkStatus&reference=${encodeURIComponent(reference || "")}&t=${Date.now()}`;
    } else {
      const verifyCode = code || reference;
      url = `${scriptUrl}?action=verify&code=${encodeURIComponent(verifyCode || "")}&t=${Date.now()}`;
    }

    try {
      console.log(`[Vercel Serverless Payment] Sending request to URL: ${url}`);
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      console.log(`[Vercel Serverless Payment] Received status: ${response.status}`);
      const responseText = await response.text();
      console.log(`[Vercel Serverless Payment] Raw response: ${responseText}`);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status} from payment provider: ${responseText}`);
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseErr) {
        throw new Error(`Failed to parse JSON response: ${responseText}`);
      }

      return res.json(result);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error("[Vercel Serverless Payment] Error in fetch:", fetchError);
      if (fetchError.name === 'AbortError') {
        return res.status(504).json({ success: false, message: "Verification request timed out. Please try again." });
      }
      throw fetchError;
    }
  } catch (error: unknown) {
    console.error("[Vercel Serverless Payment] Error:", error);
    return res.status(505).json({
      success: false,
      message: error instanceof Error ? error.message : "Verification failed due to server error"
    });
  }
}
