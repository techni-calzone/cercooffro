'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initializeAnalytics, trackPageView } from '@/config/analytics';

export default function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    initializeAnalytics();
  }, []);

  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);

  return null;
}
