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

  // Payment Verification Endpoint
  app.post("/api/payment/verify", async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ success: false, message: "Code is required" });
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      // Proxy the verification to the actual Google Apps Script privately
      const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_PAYMENT_URL;
      if (!scriptUrl) {
          throw new Error("Payment script URL not configured");
      }
      const url = `${scriptUrl}?code=${encodeURIComponent(code)}&t=${Date.now()}`;
      
      try {
        const response = await fetch(url, { 
          method: "GET",
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error("HTTP error from payment provider");
        }
        
        const result = await response.json();
        
        res.json({ 
          success: result.success === true, 
          message: result.message || (result.success ? "Successfully verified" : "Invalid code")
        });
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          return res.status(504).json({ success: false, message: "Verification request timed out. Please try again." });
        }
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
      
      if (!scriptUrl) {
        return res.json({ 
          success: true, 
          isSimulated: true,
          message: "Profile submitted successfully (Simulated Mode - Google Apps Script URL not configured in .env)"
        });
      }
      
      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error from Hash Hunt provider: ${response.statusText}`);
      }
      
      const result = await response.json();
      res.json({ success: true, ...result });
    } catch (error: unknown) {
      console.error("Hash Hunt Submission Error:", error);
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Submission failed due to server error" });
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
