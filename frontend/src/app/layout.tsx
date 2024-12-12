import * as React from 'react';
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'
import RootLayoutClient from '@/components/layout/RootLayoutClient';
import { AuthProvider } from '@/context/AuthContext';
import Head from 'next/head'; // Import Head component

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
      <Head>
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7508445426374362"
          crossOrigin="anonymous"
        ></script>
      </Head>
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
