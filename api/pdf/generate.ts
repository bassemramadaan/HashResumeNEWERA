import type { VercelRequest, VercelResponse } from "@vercel/node";
import puppeteer from "puppeteer";

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
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { html, css } = req.body;
    
    if (!html) {
      return res.status(400).json({ error: "HTML content is required" });
    }

    // Launch puppeteer with a timeout so it doesn't hang in headless-unsupported environments like standard Vercel serverless functions
    let browser;
    try {
      browser = await Promise.race([
        puppeteer.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error("Timeout launching Chrome browser")), 3500)
        )
      ]);
    } catch (launchError: any) {
      console.warn("[Vercel PDF Generator] Browser launch failed or timed out:", launchError.message || launchError);
      return res.status(503).json({
        error: "Server-side PDF renderer is not available. Please use client-side download.",
        fallback: true
      });
    }
    const page = await browser.newPage();
    
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
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdfBuffer.length.toString());
    return res.send(pdfBuffer);
  } catch (error: any) {
    console.error("[Vercel Serverless PDF] Error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "PDF generation failed due to serverless error"
    });
  }
}
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
