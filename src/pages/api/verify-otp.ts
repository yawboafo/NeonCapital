import type { NextApiRequest, NextApiResponse } from 'next';
import { otpStore } from './send-otp';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP required' });
  }

  if (otpStore[phone] === otp) {
    // OTP is valid, remove from store
    delete otpStore[phone];
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ error: 'Invalid OTP' });
  }
}
