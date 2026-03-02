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
        transformHeader: (header: string) => header.trim().toLowerCase().replace(/[:\s]+/g, '_').replace(/_+$/, '')
      });

      const jobs: any[] = [];
      let currentJob: any = null;

      parsed.data.forEach((row: any) => {
        // Check if this is a new job row (has a job code)
        // The sheet has "Jop Code" (typo) -> jop_code
        const jobCode = row.jop_code || row.job_code || row.code;
        
        if (jobCode) {
          // Start new job
          currentJob = {
            jobId: jobCode,
            title: row.job_title || row.title || "",
            company: row.company || "Confidential",
            location: row.location || "Remote",
            type: "Full-time", // Default as not in sheet
            salary: "Competitive", // Default as not in sheet
            postedAt: "Recently", // Default as not in sheet
            responsibilities: [],
            skills: [],
            code: jobCode
          };
          jobs.push(currentJob);
        }
        
        if (currentJob) {
          if (row.key_responsibilities) currentJob.responsibilities.push(row.key_responsibilities);
          if (row.required_skills) currentJob.skills.push(row.required_skills);
        }
      });

      // Format description and cleanup
      const formattedJobs = jobs
        .filter(job => job.title && job.title !== "Untitled Role")
        .map(job => ({
          ...job,
          description: [
            job.responsibilities.length > 0 ? "Key Responsibilities:\n" + job.responsibilities.map((r: string) => "• " + r).join("\n") : "",
            job.skills.length > 0 ? "Required Skills:\n" + job.skills.map((s: string) => "• " + s).join("\n") : ""
          ].filter(Boolean).join("\n\n")
        }));

      res.json({ jobs: formattedJobs });
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
