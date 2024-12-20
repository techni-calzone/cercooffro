'use client';

import React from 'react';
import Footer from '@/components/layout/Footer';

export default function ListingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
