'use client';

import React from 'react';
import { LanguageProvider } from '@/context/LanguageContext';

interface RootLayoutClientProps {
  children: React.ReactNode;
}

export default function RootLayoutClient({ children }: RootLayoutClientProps) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}
