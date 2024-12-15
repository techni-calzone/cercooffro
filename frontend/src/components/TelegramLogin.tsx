'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface TelegramLoginProps {
  botName: string;
  buttonSize?: 'large' | 'medium' | 'small';
  cornerRadius?: number;
  requestAccess?: boolean;
  usePic?: boolean;
  className?: string;
}

declare global {
  interface Window {
    TelegramLoginWidget: {
      dataOnauth: (user: any) => void;
    };
  }
}

export default function TelegramLogin({
  botName,
  buttonSize = 'large',
  cornerRadius = 8,
  requestAccess = true,
  usePic = true,
  className = '',
}: TelegramLoginProps) {
  const { loginWithTelegram } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Initialize Telegram Login Widget
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', buttonSize);
    script.setAttribute('data-radius', cornerRadius.toString());
    script.setAttribute('data-request-access', requestAccess.toString());
    script.setAttribute('data-userpic', usePic.toString());
    script.setAttribute('data-onauth', 'TelegramLoginWidget.dataOnauth(user)');
    script.async = true;

    // Add script to document
    const container = document.getElementById('telegram-login-container');
    if (container) {
      container.appendChild(script);
    }

    const handleAuth = async (user: any) => {
      try {
        if (!user || !user.id) {
          throw new Error('Invalid login response');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/telegram/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });

        if (!response.ok) {
          throw new Error('Failed to verify Telegram login');
        }

        const userData = await response.json();
        await loginWithTelegram(userData);
        toast.success('Successfully logged in!');
        router.push('/');
      } catch (error) {
        console.error('Error during Telegram authentication:', error);
        toast.error('Failed to login. Please try again.');
      }
    };

    window.TelegramLoginWidget = {
      dataOnauth: handleAuth,
    };

    return () => {
      // Cleanup
      if (container && container.contains(script)) {
        container.removeChild(script);
      }
    };
  }, [botName, buttonSize, cornerRadius, requestAccess, usePic, loginWithTelegram, router]);

  return (
    <div id="telegram-login-container" className={className}>
      {/* Telegram Login Widget will be rendered here */}
    </div>
  );
}