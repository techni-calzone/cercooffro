import { Metadata } from 'next';
import SimpleNavbar from '@/components/SimpleNavbar';

export const metadata: Metadata = {
  title: 'Privacy Policy - CercoOffro',
  description: 'Privacy Policy and data protection information for CercoOffro users',
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SimpleNavbar />
      <div className="pt-16">
        {children}
      </div>
    </>
  );
}
