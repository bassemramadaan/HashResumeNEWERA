import 'server-only';
import Papa from 'papaparse';

export interface Job {
  jobId: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  postedAt: string;
  description: string;
  code: string;
  responsibilities: string[];
  skills: string[];
}

const SHEET_ID = "12U_XZS98HwLdXP2s05wUmorsFDf2CAVWoOl6SR7I3OA";
const JOBS_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

// Simple in-memory cache
let cachedJobs: Job[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchJobsFromSheet(): Promise<Job[]> {
  // Return cached data if valid
  if (cachedJobs && (Date.now() - lastFetchTime < CACHE_DURATION)) {
    return cachedJobs;
  }

  try {
    const response = await fetch(JOBS_URL, {
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
      const jobCode = row.jop_code || row.job_code || row.code;
      
      if (jobCode) {
        // Start new job
        currentJob = {
          jobId: jobCode,
          title: row.job_title || row.title || "",
          company: row.company || "Confidential",
          location: row.location || "Remote",
          type: row.type || row.employment_type || "Full-time",
          salary: row.salary || "Competitive",
          postedAt: row.posted_date || "Recently",
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

    // Update cache
    cachedJobs = formattedJobs;
    lastFetchTime = Date.now();

    return formattedJobs;
  } catch (error) {
    console.error("Error fetching jobs from Google Sheets:", error);
    
    // Return cached data if available (even if expired) as fallback
    if (cachedJobs) {
      return cachedJobs;
    }
    
    // Fallback to empty array or throw depending on needs
    // For now, return empty array to prevent crashing
    return [];
  }
}
