import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ success: false, message: "Code is required" });
    }

    // The Google Apps Script URL is now hidden on the server
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbwu93DNeKqcO_JYt-qGPi-E6UW7hNoRT7LRdg6_UuAyxNEkQYuYFmXVo55yy68q-GfF9A/exec";
    
    const response = await fetch(`${scriptUrl}?code=${encodeURIComponent(code)}`);
    const data = await response.json();
    
    if (data.success) {
      res.json({ success: true, message: data.message || "Code verified successfully" });
    } else {
      res.status(400).json({ success: false, message: data.message || "Invalid or already used code" });
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({ success: false, message: "Server error while verifying code" });
  }
}
