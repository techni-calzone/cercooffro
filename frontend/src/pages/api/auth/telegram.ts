import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const SECRET = process.env.TELEGRAM_BOT_SECRET; // Your bot's secret token

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const user = req.body;

    // Verify the hash
    const hash = user.hash;
    delete user.hash;
    const dataCheckString = Object.keys(user)
      .map(key => `${key}=${user[key]}`)
      .sort()
      .join('') + SECRET;

    const expectedHash = crypto
      .createHash('sha256')
      .update(dataCheckString)
      .digest('hex');

    if (hash !== expectedHash) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // If verification is successful, return user data
    return res.status(200).json(user);
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
