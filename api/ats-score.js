/**
 * api/ats-score.js
 * Vercel Edge Function — ATS Scorer proxy
 *
 * الإعداد:
 *   1. حط الملف ده في /api/ats-score.js في المشروع
 *   2. في Vercel Dashboard → Settings → Environment Variables:
 *      GEMINI_API_KEY = your_key_here
 *   3. الـ frontend يكال /api/ats-score بدل Gemini مباشرة
 *
 * الـ endpoint:
 *   POST /api/ats-score
 *   Body: { cvText: string, jdText: string, lang: "ar"|"en"|"fr" }
 *   Returns: { overallScore, matchLevel, summary, keywords, sections, suggestions }
 */

export const config = { runtime: "edge" };

// ── CORS headers ──────────────────────────────────────────
const CORS = {
  "Access-Control-Allow-Origin":  "*",           // ← غيّرها لـ domain بتاعك في production
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// ── Rate limiting (بسيط في الـ Edge) ─────────────────────
// Vercel Edge مش بيدعم KV مجاناً — لو عايز rate limiting حقيقي
// استخدم Upstash Redis أو Vercel KV
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX    = 10;        // max requests per IP per window
const rateLimitMap      = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) ?? { count: 0, start: now };

  if (now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) return false;

  entry.count++;
  rateLimitMap.set(ip, entry);
  return true;
}

// ── Gemini prompt ─────────────────────────────────────────
function buildPrompt(cvText, jdText, lang) {
  const responseLang = lang === "ar" ? "Arabic" : lang === "fr" ? "French" : "English";
  return `You are an expert ATS (Applicant Tracking System) analyzer.
Analyze the match between this resume and job description carefully.

RESUME:
${cvText.slice(0, 4000)}

JOB DESCRIPTION:
${jdText.slice(0, 2000)}

Respond ONLY with a valid JSON object. No markdown, no backticks, no extra text.
Use ${responseLang} for all text fields (summary, feedback, issue, fix, section names).

{
  "overallScore": <integer 0-100>,
  "matchLevel": "<excellent|good|average|weak>",
  "summary": "<2-3 sentences explaining the match>",
  "keywords": {
    "found": ["<keyword>", ...],
    "missing": ["<keyword>", ...]
  },
  "sections": [
    { "name": "<section name>", "score": <0-100>, "feedback": "<brief actionable feedback>" },
    { "name": "<section name>", "score": <0-100>, "feedback": "<brief actionable feedback>" },
    { "name": "<section name>", "score": <0-100>, "feedback": "<brief actionable feedback>" }
  ],
  "suggestions": [
    { "issue": "<what is missing or weak>", "fix": "<exact phrase to add to resume>" },
    { "issue": "<what is missing or weak>", "fix": "<exact phrase to add to resume>" },
    { "issue": "<what is missing or weak>", "fix": "<exact phrase to add to resume>" }
  ]
}`;
}

// ── Input validation ──────────────────────────────────────
function validateInput({ cvText, jdText, lang }) {
  if (!cvText || typeof cvText !== "string" || cvText.trim().length < 50) {
    return "cvText must be at least 50 characters";
  }
  if (!jdText || typeof jdText !== "string" || jdText.trim().length < 50) {
    return "jdText must be at least 50 characters";
  }
  if (!["ar", "en", "fr"].includes(lang)) {
    return "lang must be 'ar', 'en', or 'fr'";
  }
  return null;
}

// ── Main handler ──────────────────────────────────────────
export default async function handler(req) {

  // handle preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  // rate limit
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please wait a minute." }),
      { status: 429, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  // parse body
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  // validate
  const validationError = validateInput(body);
  if (validationError) {
    return new Response(
      JSON.stringify({ error: validationError }),
      { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  const { cvText, jdText, lang } = body;

  // call Gemini
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) {
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(cvText, jdText, lang) }] }],
          generationConfig: {
            temperature:     0.2,   // منخفض عشان الـ output يبقى consistent
            maxOutputTokens: 1500,
            topP:            0.8,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini error:", errText);
      return new Response(
        JSON.stringify({ error: "AI service unavailable" }),
        { status: 502, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const geminiData = await geminiRes.json();
    const raw        = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // strip markdown fences if any
    const clean = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    // validate result shape
    if (
      typeof result.overallScore !== "number" ||
      !result.matchLevel ||
      !result.keywords?.found ||
      !result.sections
    ) {
      throw new Error("Invalid AI response shape");
    }

    return new Response(
      JSON.stringify(result),
      {
        status:  200,
        headers: {
          ...CORS,
          "Content-Type":  "application/json",
          "Cache-Control": "no-store",
        },
      }
    );

  } catch (e) {
    console.error("ATS Scorer error:", e);
    return new Response(
      JSON.stringify({ error: "Analysis failed. Please try again." }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }
}
