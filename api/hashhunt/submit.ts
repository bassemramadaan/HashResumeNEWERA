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
    const submissionData = req.body;
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_HASHHUNT_URL || "https://script.google.com/macros/s/AKfycbzuViPQd8dgGJ7MEprD972A1Henp55Q_ypyzoMbwIA5H_lpFnq2Ed3EnOwH4Gc12HvD/exec";
    
    console.log("[Vercel Serverless] Sending submission to Google Apps Script Web App url:", scriptUrl);

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submissionData),
    });

    const responseText = await response.text();
    console.log(`[Vercel Serverless] Apps Script response status: ${response.status}. Length: ${responseText.length}`);

    if (!response.ok) {
      throw new Error(`HTTP error from Google Apps Script provider: ${response.status} ${response.statusText}`);
    }

    // Try parsing the returned text as JSON
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (jsonError) {
      console.error("[Vercel Serverless] Failed to parse response as JSON. Response preview:", responseText.slice(0, 1000));
      
      if (responseText.includes("accounts.google.com") || responseText.includes("Sign in") || responseText.includes("login")) {
        throw new Error("Google Apps Script returned a Google Login page. Please verify that you selected 'Who has access: Anyone' under the deployment settings inside Google Apps Script (and not 'Only myself' or 'Anyone with a Google account').");
      }
      
      if (responseText.includes("ScriptError") || responseText.includes("Exception") || responseText.includes("not found")) {
        throw new Error("Google Apps Script returned an execution exception. Check if you authorized the script to access Drive & Sheets, and that your Sheet ID and Folder ID are 100% correct in the script code.");
      }

      throw new Error("The Google Apps Script did not respond with a valid JSON. Please check your Google Apps Script logs and ensure the Web App is active and updated.");
    }

    res.json({ success: true, ...result });
  } catch (error: unknown) {
    console.error("[Vercel Serverless] Hash Hunt Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : "Submission failed due to server error" 
    });
  }
}
