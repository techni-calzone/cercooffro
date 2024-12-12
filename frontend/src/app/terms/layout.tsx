import { Metadata } from 'next';
import SimpleNavbar from '@/components/layout/SimpleNavbar';

export const metadata: Metadata = {
  title: 'Terms of Service - CercoOffro',
  description: 'Terms and conditions for using the CercoOffro platform',
};

export default function TermsLayout({
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
