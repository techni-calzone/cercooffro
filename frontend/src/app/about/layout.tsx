import { Metadata } from 'next';
import SimpleNavbar from '@/components/SimpleNavbar';

export const metadata: Metadata = {
  title: 'About - CercoOffro',
  description: 'Learn more about CercoOffro and our mission to help students find their perfect accommodation in Italy.',
};

export default function AboutLayout({
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
