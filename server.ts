import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { fetchJobsFromSheet } from './lib/jobs';
import { checkRateLimit } from './lib/rateLimit';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Simple rate limiting middleware
  app.use((req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    next();
  });

  // API routes
  app.post("/api/verify-code", async (req, res) => {
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
  });

  app.get("/api/jobs", async (req, res) => {
    try {
      const jobs = await fetchJobsFromSheet();
      res.json({ jobs });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
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
    // In production, serve static files from dist
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
