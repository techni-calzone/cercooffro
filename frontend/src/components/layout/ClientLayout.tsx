'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { NavBar, Footer } from '@/components/layout';

// Dynamically import components that might cause hydration issues
const AdBlockerModal = dynamic(() => import('../features/ads/AdBlockerModal'), {
  ssr: false
});

const AnalyticsProvider = dynamic(() => import('../AnalyticsProvider'), {
  ssr: false
});

interface ClientLayoutProps {
  children: React.ReactNode;
  showNavBar?: boolean;
}

const ClientLayout = ({ children, showNavBar = true }: ClientLayoutProps) => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        {showNavBar && <NavBar />}
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
      <AdBlockerModal />
      <AnalyticsProvider />
    </>
  );
};

export default ClientLayout;
