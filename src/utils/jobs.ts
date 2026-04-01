import { Job } from "../data/jobs";

export async function fetchJobsFromSheet(): Promise<Job[]> {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const range = "Sheet1!A2:Z100"; // Assuming headers are in row 1

  if (!apiKey || !sheetId) {
    console.warn("Google Sheets API key or Sheet ID missing. Falling back to mock data.");
    return getMockJobs();
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.statusText}`);
    }

    const data = await response.json();
    const rows = data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    // Map rows to Job objects
    // Expected column order: jobId, title, company, location, type, salary, description, postedAt, logo, url, code
    return rows.map((row: string[]) => ({
      jobId: row[0] || "",
      title: row[1] || "",
      company: row[2] || "",
      location: row[3] || "",
      type: row[4] || "",
      salary: row[5] || "",
      description: row[6] || "",
      postedAt: row[7] || "",
      logo: row[8] || "",
      url: row[9] || "",
      code: row[10] || "",
    }));
  } catch (error) {
    console.error("Error fetching jobs from Google Sheets:", error);
    return getMockJobs();
  }
}

function getMockJobs(): Job[] {
  return [
    {
      jobId: "1",
      title: "Senior Frontend Developer",
      company: "TechFlow Solutions",
      location: "Remote / Dubai, UAE",
      type: "Full-time",
      salary: "$80k - $120k",
      description: "We are looking for a Senior Frontend Developer with expertise in React, TypeScript, and Tailwind CSS to join our growing team.",
      postedAt: "2 days ago",
      logo: "https://picsum.photos/seed/techflow/100/100",
      url: "https://example.com/apply/1",
      code: "TF-2024-001"
    },
    {
      jobId: "2",
      title: "Product Designer",
      company: "CreativePulse",
      location: "Hybrid / Riyadh, Saudi Arabia",
      type: "Full-time",
      salary: "$60k - $90k",
      description: "Join our design team to create beautiful and intuitive user experiences for our global client base.",
      postedAt: "1 week ago",
      logo: "https://picsum.photos/seed/creative/100/100",
      url: "https://example.com/apply/2",
      code: "CP-2024-042"
    },
    {
      jobId: "3",
      title: "Backend Engineer (Node.js)",
      company: "DataStream Systems",
      location: "Remote",
      type: "Contract",
      salary: "$70k - $100k",
      description: "We need a Backend Engineer to help us build and scale our real-time data processing platform.",
      postedAt: "3 days ago",
      logo: "https://picsum.photos/seed/datastream/100/100",
      url: "https://example.com/apply/3",
      code: "DS-2024-007"
    }
  ];
}
