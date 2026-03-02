import type { VercelRequest, VercelResponse } from '@vercel/node';
import Papa from 'papaparse';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

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
}
