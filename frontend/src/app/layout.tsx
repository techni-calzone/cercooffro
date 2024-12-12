import * as React from 'react';
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'
import RootLayoutClient from '@/components/RootLayoutClient';
import { AuthProvider } from '@/context/AuthContext';

// Initialize Inter font
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

// Metadata definition
export const metadata: Metadata = {
  title: 'CercoOffro',
  description: 'Student Rental Aggregator',
  openGraph: {
    title: 'CercoOffro - Student Housing Platform',
    description: 'Discover affordable and convenient student housing across Italy',
    images: ['/images/italian-university-campus-1.jpg']
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg'
  }
}

// Root Layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AuthProvider>
          <RootLayoutClient>
            {children}
          </RootLayoutClient>
        </AuthProvider>
      </body>
    </html>
  );
}
