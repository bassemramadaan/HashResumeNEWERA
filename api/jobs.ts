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
}
