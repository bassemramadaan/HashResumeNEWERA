import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import rateLimit from "express-rate-limit";

import path from "path";
import dotenv from "dotenv";
import puppeteer from "puppeteer";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust proxy for reverse proxies (like Cloud Run / Nginx) so rate-limiting captures real client IPs correctly
  app.set('trust proxy', 1);

  app.use(cors());
  app.use(express.json({ limit: "50mb" }));

  // General Rate Limiter for all API routes
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later.' }
  });
  app.use('/api/', limiter);

  // Rate Limiter for AI Endpoints
  const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per `window` (here, per 15 minutes)
    message: { error: "Too many requests from this IP, please try again after 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // AI Endpoint has been moved to /api/gemini.js edge function in production, handled here in dev/preview
  app.post("/api/gemini", aiLimiter, async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: { message: "GEMINI_API_KEY is not defined" } });
      }

      // Proxy request to official Gemini API using the exact same body
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(req.body),
        }
      );

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error: any) {
      console.error("Gemini Proxy Error:", error);
      res.status(500).json({ error: { message: error.message || "Failed to contact Gemini API" } });
    }
  });

  // Payment Verification & Manual InstaPay Flow Proxy
  app.post("/api/payment/verify", async (req, res) => {
    try {
      const { code, action, reference, senderInfo, email, amount } = req.body;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout for slow Google Apps Script runs

      // Proxy the verification to the actual Google Apps Script privately
      let scriptUrl = process.env.GOOGLE_APPS_SCRIPT_PAYMENT_URL || "";
      if (!scriptUrl || !scriptUrl.includes("AKfycbxEwZA")) {
          scriptUrl = "https://script.google.com/macros/s/AKfycbxEwZAiv_ja3Tlpno6HWp-OL1ur2WPkRq_9V4BTqquWsfX1gAEacB9vu-iRowF9FxDI-A/exec";
      }
      if (!scriptUrl) {
          throw new Error("Payment script URL not configured");
      }

      let url = `${scriptUrl}?t=${Date.now()}`;
      let fetchOptions: RequestInit = {
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
        console.log(`[PaymentProxy] Sending request to URL: ${url}`);
        const response = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);
        
        console.log(`[PaymentProxy] Received status: ${response.status}`);
        const responseText = await response.text();
        console.log(`[PaymentProxy] Raw response: ${responseText}`);

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status} from payment provider: ${responseText}`);
        }
        
        let result;
        try {
          result = JSON.parse(responseText);
        } catch (parseErr) {
          throw new Error(`Failed to parse JSON response: ${responseText}`);
        }
        
        res.json(result);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          console.warn("[PaymentProxy] Request aborted due to 45-second timeout limit.");
          return res.status(504).json({ success: false, message: "Verification request timed out. Please try again." });
        }
        console.error("[PaymentProxy] Error in fetch:", fetchError);
        throw fetchError;
      }
    } catch (error: unknown) {
      console.error("Payment Verification Error:", error);
      res.status(500).json({ success: false, message: "Verification failed due to server error" });
    }
  });

  // Feedback Submission Endpoint
  app.post("/api/feedback/submit", async (req, res) => {
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
      
      res.json({ success: true });
    } catch (error: unknown) {
      console.error("Feedback Submission Error:", error);
      res.status(500).json({ success: false, message: "Submission failed due to server error" });
    }
  });

  // Hash Hunt Profile Submission Endpoint
  app.post("/api/hashhunt/submit", async (req, res) => {
    try {
      const submissionData = req.body;
      const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_HASHHUNT_URL || "https://script.google.com/macros/s/AKfycbzuViPQd8dgGJ7MEprD972A1Henp55Q_ypyzoMbwIA5H_lpFnq2Ed3EnOwH4Gc12HvD/exec";
      
      console.log("Sending submission to Google Apps Script Web App url:", scriptUrl);

      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const responseText = await response.text();
      console.log(`Apps Script response status: ${response.status}. Length: ${responseText.length}`);

      if (!response.ok) {
        throw new Error(`HTTP error from Google Apps Script provider: ${response.status} ${response.statusText}`);
      }

      // Try parsing the returned text as JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("Failed to parse Google Apps Script response as JSON. Original response text preview:", responseText.slice(0, 1000));
        
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
      console.error("Hash Hunt Submission Error Details:", error);
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Submission failed due to server error" 
      });
    }
  });
  
  app.post('/api/pdf/generate', async (req, res) => {
    try {
      const { html, css } = req.body;
      
      if (!html) {
        return res.status(400).json({ error: "HTML content is required" });
      }

      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      
      // Construct complete HTML document with provided CSS
      const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              @page { size: A4; margin: 0; }
              body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; background: transparent !important; }
              ${css || ''}
            </style>
          </head>
          <body>
            ${html}
          </body>
        </html>
      `;
      
      await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      });
      
      await browser.close();
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfBuffer.length
      });
      
      res.send(pdfBuffer);
    } catch (error: unknown) {
      console.error("PDF Generation Error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to generate PDF" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
