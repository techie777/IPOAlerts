import type { Metadata, Viewport } from 'next';
import './globals.css';
import PublicLayoutShell from '@/components/layout/PublicLayoutShell';
import LiveNotificationListener from '@/components/notifications/LiveNotificationListener';
import FirebaseAnalyticsInit from '@/components/analytics/FirebaseAnalyticsInit';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'IPO Alerts — Live GMP Tracker, Subscription Status & Allotments (2026)',
  description:
    'Track live IPO Grey Market Premium (GMP), real-time bidding subscription status across QIB/NII/Retail, allotment links, and instant push alerts for Indian Mainboard and SME IPOs.',
  keywords: [
    'IPO GMP',
    'Grey Market Premium today',
    'IPO Watch alternative',
    'IPO Subscription Status',
    'IPO Allotment Status Link Intime Kfintech',
    'SME IPO GMP',
    'Upcoming IPO 2026',
  ],
  authors: [{ name: 'IPOAlerts Intelligence' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased bg-[#f8fafc] text-slate-900 pb-16 sm:pb-0">
        <FirebaseAnalyticsInit />
        <LiveNotificationListener />
        <PublicLayoutShell>
          {children}
        </PublicLayoutShell>
      </body>
    </html>
  );
}
