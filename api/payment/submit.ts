import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { reference, senderInfo, email, amount } = req.method === 'POST' 
      ? req.body 
      : req.query;

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL 
      || 'https://script.google.com/macros/s/AKfycbxEwZAiv_ja3Tlpno6HWp-OL1ur2WPkRq_9V4BTqquWsfX1gAEacB9vu-iRowF9FxDI-A/exec';

    if (!scriptUrl) {
      return res.status(500).json({ success: false, message: 'Payment service not configured' });
    }

    const params = new URLSearchParams({
      action: 'submitPayment',
      reference: reference?.toString() || '',
      senderInfo: senderInfo?.toString() || '',
      email: email?.toString() || '',
      amount: amount?.toString() || '50 EGP',
    });

    const response = await fetch(`${scriptUrl}?${params}`);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'HTTP Submission Error' });
  }
}
