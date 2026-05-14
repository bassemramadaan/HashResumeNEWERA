import type { VercelRequest, VercelResponse } from '@vercel/node';

const PAYMENT_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_PAYMENT_URL || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { code } = req.body || {};

  if (!code || typeof code !== 'string' || !code.trim()) {
    return res.status(400).json({ success: false, message: 'Code is required' });
  }

  const normalizedCode = code.trim().toUpperCase();

  if (!PAYMENT_SCRIPT_URL) {
    console.error('GOOGLE_APPS_SCRIPT_PAYMENT_URL is not set');
    return res.status(500).json({ success: false, message: 'Payment service not configured' });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const scriptRes = await fetch(PAYMENT_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify', code: normalizedCode }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!scriptRes.ok) {
      console.error('Apps Script error:', scriptRes.status);
      return res.status(502).json({ success: false, message: 'Verification service error' });
    }

    const data = await scriptRes.json();

    if (data.success === true) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({
        success: false,
        message: data.message || 'Invalid or already used code',
      });
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ success: false, message: 'Verification timed out' });
    }
    console.error('Payment verify error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
