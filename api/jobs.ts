import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchJobsFromSheet } from "../src/utils/jobs";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("API jobs handler called");
  try {
    const jobs = await fetchJobsFromSheet();
    console.log("Jobs fetched successfully");
    res.json({ jobs });
  } catch (error) {
    console.error("API jobs handler error:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
}
