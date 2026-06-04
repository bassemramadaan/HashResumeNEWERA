export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await req.json();

  if (!process.env.GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({
        error: {
          message: "GEMINI_API_KEY is not configured in environment variables. Please add GEMINI_API_KEY to your project settings in Vercel."
        }
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
