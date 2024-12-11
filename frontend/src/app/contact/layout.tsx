import { Metadata } from 'next';
import SimpleNavbar from '@/components/SimpleNavbar';

export const metadata: Metadata = {
  title: 'Contact Us - CercoOffro',
  description: 'Get in touch with CercoOffro - Your student housing platform in Italy',
};

export default function ContactLayout({
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
