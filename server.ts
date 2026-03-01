import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import Papa from "papaparse";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
      // Use the Google Sheet CSV export URL
      const sheetId = "12U_XZS98HwLdXP2s05wUmorsFDf2CAVWoOl6SR7I3OA";
      const jobsUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
      
      const response = await fetch(jobsUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; HashHunt/1.0; +http://hashhunt.com)"
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.statusText}`);
      }

      const csvText = await response.text();
      
      // Parse CSV
      const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim().toLowerCase().replace(/\s+/g, '_')
      });

      // Map CSV columns to Job interface
      // Assuming columns: Job Title, Company, Location, Type, Salary, Description, Job Code, etc.
      const jobs = parsed.data
        .map((row: any, index: number) => ({
          jobId: row.job_code || row.code || `job-${index}`,
          title: row.job_title || row.title || "",
          company: row.company || "Confidential",
          location: row.location || "Remote",
          type: row.type || row.employment_type || "Full-time",
          salary: row.salary || "Competitive",
          postedAt: row.posted_date || "Recently",
          description: row.description || "",
          code: row.job_code || row.code || ""
        }))
        .filter((job: any) => job.title && job.title !== "Untitled Role");

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
