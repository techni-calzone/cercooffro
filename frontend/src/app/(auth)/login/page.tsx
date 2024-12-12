'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TelegramLogin from '@/components/TelegramLogin';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg border border-gray-200">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('login.sign_in')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('login.use_telegram')}
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            {t('login.notice')}
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            {t('login.download_notice')}
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <TelegramLogin
            botName="cerco_offro_bot" // Replace with your bot name
            className="flex justify-center"
          />
        </div>
        <div className="mt-4 text-center">
          <a 
            href="https://telegram.org/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-200"
          >
            {t('login.download_button')}
          </a>
        </div>
      </div>
    </div>
  );
}
