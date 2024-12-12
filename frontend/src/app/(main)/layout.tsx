'use client';

import { usePathname } from 'next/navigation';
import ClientLayout from '@/components/layout/ClientLayout';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isListingsPage = pathname ? pathname.startsWith('/listings') : false;

  if (isListingsPage) {
    return children;
  }

  return <ClientLayout>{children}</ClientLayout>;
}
