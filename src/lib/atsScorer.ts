/**
 * lib/atsScorer.ts
 * API client for the ATS Scorer - calls the Edge Function instead of Gemini directly
 *
 * Usage:
 *   import { analyzeATS } from '../lib/atsScorer'
 *   const result = await analyzeATS({ cvText, jdText, lang })
 */

export interface ATSAnalysisRequest {
  cvText: string;
  jdText: string;
  lang?: string;
}

// ── main function ─────────────────────────────────────────
export async function analyzeATS({ cvText, jdText, lang = "en" }: ATSAnalysisRequest) {
  const res = await fetch("/api/ats-score", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ cvText, jdText, lang }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Request failed: ${res.status}`);
  }

  return res.json();
}
