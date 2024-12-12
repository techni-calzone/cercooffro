import axios from 'axios';
import crypto from 'crypto';

interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export class TelegramAuth {
  private readonly botToken: string;

  constructor(botToken: string) {
    this.botToken = botToken;
  }

  async validateTelegramAuth(authData: TelegramAuthData): Promise<boolean> {
    const { hash, ...data } = authData;
    const dataCheckString = Object.keys(data)
      .sort()
      .map(k => `${k}=${data[k]}`)
      .join('\n');

    const secretKey = crypto
      .createHash('sha256')
      .update(this.botToken)
      .digest();

    const generatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    return generatedHash === hash;
  }

  async getUserInfo(userId: number) {
    try {
      const response = await axios.get(`https://api.telegram.org/bot${this.botToken}/getChat`, {
        params: {
          chat_id: userId
        }
      });
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to fetch Telegram user info');
    }
  }
}
