import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { fetchJobsFromSheet } from './utils/jobs';
import { checkRateLimit } from './utils/rateLimit';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' })); // Increase limit for CV data

  // Simple rate limiting middleware
  app.use((req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    next();
  });

  // API routes
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
