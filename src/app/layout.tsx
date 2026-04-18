import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: { default: 'AutoDeliver — Ship Your Car from Europe', template: '%s | AutoDeliver' },
  description: 'The trusted platform to ship your European car to the Gulf and beyond. Verified drivers, live GPS tracking, and secure payments.',
  keywords: ['car delivery', 'car transport', 'Europe to Kuwait', 'vehicle shipping', 'توصيل سيارات'],
  openGraph: {
    title: 'AutoDeliver',
    description: 'Ship your car from Europe — verified drivers, live tracking.',
    url: 'https://autodeliver.com',
    siteName: 'AutoDeliver',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
