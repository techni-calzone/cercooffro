'use client';

import { usePathname } from 'next/navigation';
import ClientLayout from '@/components/ClientLayout';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isListingsPage = pathname.startsWith('/listings');

  if (isListingsPage) {
    return children;
  }

  return <ClientLayout>{children}</ClientLayout>;
}
