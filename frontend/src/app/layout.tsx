import * as React from 'react';
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'

// Explicitly import all components
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { LanguageProvider } from '@/context/LanguageContext'
import AdBlockerModal from '@/components/AdBlockerModal';
import AnalyticsProvider from '@/components/AnalyticsProvider';

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
    icon: '/favicon.ico',
    apple: '/favicon.ico'
  }
}

// Layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body>
        <LanguageProvider>
          <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <AdBlockerModal />
          </div>
        </LanguageProvider>
        <AnalyticsProvider />
      </body>
    </html>
  );
}
