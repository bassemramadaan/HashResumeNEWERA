import { NextResponse } from 'next/server';
import { fetchJobsFromSheet } from '../../../lib/jobs';

export async function GET() {
  try {
    const jobs = await fetchJobsFromSheet();
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
