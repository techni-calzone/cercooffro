'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    // Redirect if user is already logged in
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleTelegramResponse = async (response: any) => {
    try {
      // Validate the response from Telegram login widget
      if (!response || !response.id) {
        throw new Error('Invalid login response');
      }

      // Call your backend to verify the Telegram auth data
      const verificationResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/telegram/verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(response),
        }
      );

      if (!verificationResponse.ok) {
        throw new Error('Failed to verify Telegram login');
      }

      const userData = await verificationResponse.json();
      await login(userData.email, userData.password);
      toast.success(t('login.success'));
    } catch (error) {
      console.error('Login error:', error);
      toast.error(t('login.error'));
    }
  };

  // Return early if user is already logged in
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('login.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('login.description')}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <script
              async
              src="https://telegram.org/js/telegram-widget.js?22"
              data-telegram-login={process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME}
              data-size="large"
              data-radius="8"
              data-onauth="onTelegramAuth(user)"
              data-request-access="write"
            ></script>
          </div>
        </div>
      </div>
    </div>
  );
}
