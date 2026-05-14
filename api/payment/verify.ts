import type { VercelRequest, VercelResponse } from '@vercel/node';

const GOOGLE_APPS_SCRIPT_PAYMENT_URL = process.env.GOOGLE_APPS_SCRIPT_PAYMENT_URL || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId, email } = req.body;

  if (!sessionId || !email) {
    return res.status(400).json({ error: 'Missing sessionId or email' });
  }

  if (!GOOGLE_APPS_SCRIPT_PAYMENT_URL) {
    console.error('GOOGLE_APPS_SCRIPT_PAYMENT_URL is not configured');
    return res.status(500).json({ error: 'Payment verification service not configured' });
  }

  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_PAYMENT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify', sessionId, email }),
    });

    if (!response.ok) {
      throw new Error(`Apps Script responded with status ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.verified === true) {
      return res.status(200).json({ verified: true, plan: data.plan || 'premium' });
    } else {
      return res.status(200).json({ verified: false });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ error: 'Verification failed' });
  }
}
