'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

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
  const { login } = useAuth();

  useEffect(() => {
    console.log("useEffect running, adding Telegram script"); 

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
    } else {
      console.error("telegram-login-container not found in the DOM"); // Helpful error message
    }

    const handleAuth = async (user: any) => {
      console.log("Telegram user authenticated:", user); 
      // Send user data to the server for verification
      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const userData = await response.json();
        login(userData);
      } else {
        console.error('Authentication failed');
      }
    };

    window.TelegramLoginWidget = {
      dataOnauth: handleAuth,
    };

    return () => {
      // Cleanup
      if (container && container.contains(script)) {
        console.log("Cleaning up Telegram script");
        container.removeChild(script);
      }
    };
  }, [botName, buttonSize, cornerRadius, requestAccess, usePic, login]);

  return (
    <div id="telegram-login-container" className={className}>
      {/* Telegram Login Widget will be rendered here (no extra script tag!) */}
    </div>
  );
}