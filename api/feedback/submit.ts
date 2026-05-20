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
    const feedbackData = req.body;
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_FEEDBACK_URL;
    if (!scriptUrl) {
      throw new Error("Feedback script URL not configured");
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedbackData),
    });

    if (!response.ok) {
      throw new Error("HTTP error from feedback provider");
    }

    return res.json({ success: true });
  } catch (error: any) {
    console.error("[Vercel Serverless Feedback] Error:", error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Submission failed due to server error"
    });
  }
}
