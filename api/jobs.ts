import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchJobsFromSheet } from "../lib/jobs";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const jobs = await fetchJobsFromSheet();
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
}
