import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import rateLimit from "express-rate-limit";
import { GoogleGenAI } from "@google/genai";

import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import puppeteer from "puppeteer";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Trust proxy for reverse proxies (like Cloud Run / Nginx) so rate-limiting captures real client IPs correctly
  app.set('trust proxy', 1);

  const allowedOrigins = ['https://hashresume.com', 'https://www.hashresume.com'];
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.endsWith('.run.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  }));
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

  app.post("/api/cover-letter/generate", aiLimiter, async (req, res) => {
    try {
      const { resume, jobDescription, tone, companyName, recipientName, jobTitle, language } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not defined" });
      }

      const systemInstruction = language === "ar"
        ? `أنت خبير كتابة رسائل تغطية احترافية ومقنعة (Cover Letters) لمساعدة الباحثين عن عمل على لفت انتباه مسؤولي التوظيف واجتياز فحص الـ ATS بنجاح.
يرجى كتابة رسالة تغطية ممتازة ومثالية باللغة العربية بناءً على السيرة الذاتية المقدمة والوصف الوظيفي (إن وجد)، باتباع النبرة المطلوبة: "${tone || "professional"}".
يجب أن تتضمن الرسالة:
1. ترويسة احترافية (تاريخ، اسم الشركة، اسم المستلم إن وجد).
2. مقدمة قوية تجذب الانتباه للمنصب المستهدف.
3. تفصيل مهارات وإنجازات محددة من السيرة الذاتية تتقاطع مباشرة مع احتياجات الوظيفة.
4. خاتمة حاسمة وواثقة مع دعوة صريحة للاتصال (Call to Action).
يرجى تنسيق المخرجات بشكل رائع ومصقول ومريح للقراءة مع فقرات واضحة.`
        : `You are an expert professional cover letter writer helping job seekers catch the eye of recruiters and successfully pass ATS filters.
Please write a highly polished, persuasive, and custom-tailored cover letter in English based on the provided resume data and target job description (if provided), following the specified tone: "${tone || "professional"}".
The letter must include:
1. A professional header (Date, Target Company, Recipient Name if provided).
2. A captivating hook introducing the candidate's enthusiasm for the target job title "${jobTitle || "target role"}".
3. Highly tailored body paragraphs highlighting specific accomplishments and skills from the resume that directly intersect with the job specifications.
4. A confident call to action in the closing paragraph.
Please return beautifully formatted plain text with professional paragraph breaks and neat margins.`;

      const prompt = `
Resume Data:
${JSON.stringify(resume)}

Target Job Description:
${jobDescription || "N/A"}

Company Name: ${companyName || "N/A"}
Recipient Name: ${recipientName || "N/A"}
Target Job Title: ${jobTitle || "N/A"}
Tone: ${tone || "professional"}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("AI Cover Letter Generation Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate cover letter with Gemini" });
    }
  });

  // Validate Promo Codes Server-side
  app.post("/api/payment/apply-promo", async (req, res) => {
    try {
      const { promoCode, plan } = req.body;
      if (!promoCode) {
        return res.status(400).json({ success: false, message: "Promo code is required" });
      }

      const PROMO_CODES = [
        { code: "START20", discountPercent: 20 },
        { code: "WELCOME20", discountPercent: 20 },
        { code: "HASH20", discountPercent: 20 },
      ];

      const code = promoCode.trim().toUpperCase();
      const match = PROMO_CODES.find(p => p.code === code);

      if (!match) {
        return res.status(400).json({ success: false, message: "Invalid or expired promo code" });
      }

      const basePrice = plan === "single" ? 50 : 120;
      const discountAmount = Math.round(basePrice * (match.discountPercent / 100));
      const finalPrice = Math.max(10, basePrice - discountAmount);

      res.json({
        success: true,
        discountPercent: match.discountPercent,
        discountAmount,
        finalPrice,
      });
    } catch (error: any) {
      console.error("[ApplyPromo Server Error]", error);
      res.status(500).json({ success: false, message: "Server error occurred while validating promo code" });
    }
  });

  // Payment Verification & Manual InstaPay Flow Proxy
  app.post("/api/payment/verify", async (req, res) => {
    try {
      const { code, action, reference, senderInfo, email, amount } = req.body;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout for slow Google Apps Script runs

      // Proxy the verification to the actual Google Apps Script privately
      const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_PAYMENT_URL || "";
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
        const response = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);
        
        const responseText = await response.text();

        // Detect clean Google Apps Script error / warning or un-auth/HTML page
        const isGoogleError = responseText.includes("Exception:") || 
                            responseText.includes("does not have permission") || 
                            responseText.includes("goog-ws-error") || 
                            (responseText.includes("<html") && responseText.includes("Google Apps Script"));

        let result;
        if (isGoogleError) {
          if (process.env.NODE_ENV === "production") {
            return res.status(400).json({ success: false, message: "Payment verification failed: Google Apps Script verification error." });
          }
          if (action === "submitPayment") {
            result = { success: true, status: "approved", message: "Recorded successfully (Sandbox Auto-Approved)" };
          } else if (action === "checkStatus") {
            result = { success: true, status: "approved" };
          } else {
            result = { success: true, message: "Code verified (Sandbox Sandbox Mode)" };
          }
        } else {
          try {
            result = JSON.parse(responseText);
          } catch (parseErr) {
            if (process.env.NODE_ENV === "production") {
              return res.status(400).json({ success: false, message: "Payment verification failed: Failed to parse verification server response." });
            }
            if (action === "submitPayment") {
              result = { success: true, status: "approved", message: "Recorded successfully (Sandbox Auto-Approved)" };
            } else if (action === "checkStatus") {
              result = { success: true, status: "approved" };
            } else {
              result = { success: true, message: "Code verified (Sandbox Sandbox Mode)" };
            }
          }
        }
        
        res.json(result);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name !== 'AbortError') {
          console.error("[PaymentProxy] Error in fetch:", fetchError);
        }
        
        if (process.env.NODE_ENV === "production") {
          return res.status(400).json({ 
            success: false, 
            message: fetchError.name === 'AbortError' 
              ? "Payment verification failed: Request timed out." 
              : "Payment verification failed: Failed to connect to verification server." 
          });
        }
        // Return a successful fallback response in Sandbox mode so they are never blocked!
        let result;
        if (action === "submitPayment") {
          result = { success: true, status: "approved", message: "Recorded successfully (Sandbox Auto-Approved)" };
        } else if (action === "checkStatus") {
          result = { success: true, status: "approved" };
        } else {
          result = { success: true, message: "Code verified (Sandbox Sandbox Mode)" };
        }
        return res.json(result);
      }
    } catch (error: unknown) {
      console.error("Payment Verification Error:", error);
      res.status(500).json({ success: false, message: "Verification failed due to server error" });
    }
  });

  // Dedicated Payment Submission Endpoint
  app.all("/api/payment/verify", async (req, res) => {
    try {
      const { reference, senderInfo, email, amount } = req.method === "POST" ? req.body : req.query;

      const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_PAYMENT_URL || process.env.GOOGLE_SCRIPT_URL || "";

      const params = new URLSearchParams({
        action: "submitPayment",
        reference: (reference || "").toString(),
        senderInfo: (senderInfo || "").toString(),
        email: (email || "").toString(),
        amount: (amount || "50 EGP").toString(),
      });

      try {
        const response = await fetch(`${scriptUrl}?${params}`);
        const responseText = await response.text();
        
        const isGoogleError = responseText.includes("Exception:") || 
                            responseText.includes("does not have permission") || 
                            responseText.includes("goog-ws-error") || 
                            (responseText.includes("<html") && responseText.includes("Google Apps Script"));
                            
        if (isGoogleError) {
          if (process.env.NODE_ENV === "production") {
            return res.status(400).json({ success: false, message: "Payment verification failed: Google Apps Script authorization error." });
          }
          return res.json({ success: true, status: "approved", message: "Success (Sandbox Auto-Approved)" });
        }
        
        try {
          const data = JSON.parse(responseText);
          res.json(data);
        } catch (parseErr) {
          if (process.env.NODE_ENV === "production") {
            return res.status(400).json({ success: false, message: "Payment verification failed: Failed to parse verification server response." });
          }
          res.json({ success: true, status: "approved", message: "Success (Sandbox Auto-Approved)" });
        }
      } catch (fetchErr) {
        console.error("[PaymentSubmitProxy] Fetch error.", fetchErr);
        if (process.env.NODE_ENV === "production") {
          return res.status(400).json({ success: false, message: "Payment verification failed: Failed to connect to verification server." });
        }
        res.json({ success: true, status: "approved", message: "Success (Sandbox Auto-Approved)" });
      }
    } catch (error) {
      console.error("[PaymentSubmitProxy] Outer error.", error);
      if (process.env.NODE_ENV === "production") {
        return res.status(400).json({ success: false, message: "Payment verification failed due to internal server error." });
      }
      res.json({ success: true, status: "approved", message: "Success (Sandbox Auto-Approved)" });
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
      const scriptUrl = process.env.GAS_HASHHUNT_URL || process.env.GOOGLE_APPS_SCRIPT_HASHHUNT_URL;
      if (!scriptUrl) {
        throw new Error("Hash Hunt script URL not configured (GAS_HASHHUNT_URL)");
      }
      
      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const responseText = await response.text();

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

      // Basic sanitization: remove <script> tags and javascript: pseudo-protocol
      const sanitizedHtml = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, 'about:blank');

      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      
      // Emulate screen media to prevent responsive Tailwind breakpoints from collapsing layout into mobile-column formats
      await page.emulateMediaType('screen');

      // Set a standard desktop viewport so md: and lg: responsive columns display beautifully
      await page.setViewport({
        width: 1200,
        height: 800,
        deviceScaleFactor: 2
      });

      // Determine the base URL to resolve relative assets/styles correctly
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const host = req.headers['x-forwarded-host'] || req.get('host');
      const baseUrl = `${protocol}://${host}`;
      
      // Construct complete HTML document with provided CSS
      const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <base href="${baseUrl}/">
            <!-- Ensure Google Fonts are loaded exactly as in index.html -->
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">
            <style>
              @page { size: A4; margin: 0; }
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              body { 
                margin: 0; 
                padding: 0; 
                background: transparent !important; 
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            </style>
            ${css || ''}
          </head>
          <body>
            ${sanitizedHtml}
          </body>
        </html>
      `;
      
      await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

      // Guarantee index.html fonts are fully loaded prior to drawing the PDF stream
      await page.evaluateHandle('document.fonts.ready');
      
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
    
    let indexHtmlCache: string | null = null;
    app.use((req, res, next) => {
      // Ignore API routes
      if (req.path.startsWith('/api/')) {
        return next();
      }
      try {
        const filePath = path.join(distPath, 'index.html');
        if (!indexHtmlCache) {
          if (fs.existsSync(filePath)) {
            indexHtmlCache = fs.readFileSync(filePath, 'utf8');
          }
        }

        if (indexHtmlCache) {
          const host = req.get('host') || req.headers.host || "hashresume.com";
          const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
          const baseUrl = `${protocol}://${host}`;

          // Replace hardcoded domain with the actual current host URL dynamically
          const modifiedHtml = indexHtmlCache
            .replaceAll('https://hashresume.com/', `${baseUrl}/`)
            .replaceAll('https://hashresume.com', baseUrl);

          res.send(modifiedHtml);
        } else {
          res.sendFile(filePath);
        }
      } catch (err) {
        console.error("Error serving index.html:", err);
        res.sendFile(path.join(distPath, 'index.html'));
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
